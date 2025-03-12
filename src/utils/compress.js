/**
 * 压缩图片
 * @class compressImage
 */
class compressImage {
  constructor(fileList, options) {
    this.fileList = fileList ?? []
    this.options = options ?? {
      compressPersents: 0.8, // 压缩质量
      outputType: 'file', // 输出类型 file 或者 blob
      imageType: 'file' // 图片类型  file 或者 url
    }
  }
  /**
    * 开始压缩
    * @function startCompress
    * @param {Array} fileList
    * @return 返回压缩后的fileList
    **/
  async startCompress (fileList) {
    if (!fileList.length) {
      return
    }
    for (let i = 0; i < fileList.length; i++) {
      const item = fileList[i]
      const res = await this._compressImg(item)
      if (res.size / 1024 / 1024 > 1) {
        item.compressSize = (res.size / 1024 / 1024).toFixed(2) + 'M'
      } else {
        item.compressSize = (res.size / 1024).toFixed(2) + 'kb'
      }
      item.persents = ((1 - res.size / item.size) * 100).toFixed(2)
      this.options.outputType === 'file' ? item.compressFile = res : item.compressBlob = res
    }
    return fileList
  }
  // 压缩图片
  _compressImg (res) {
    return new Promise((resolve, reject) => {
      if (this.options.imageType === 'file') {
        const reader = new FileReader()
        reader.readAsDataURL(res.file)
        reader.onload = () => {
          this._imageLoad(reader.result, resolve)
        }
      } else {
        const imgUrl = URL.createObjectURL(res.url)
        this._imageLoad(imgUrl, resolve)
      }
    })
  }
  _imageLoad(imgUrl, resolve) {
    const img = new Image()
    img.src = imgUrl
    img.onload = () => {
      const compressPersents = this.options.compressPersents
      const canvas = this._imagetoCanvas(img)
      const res = this._base64ToBlobOrFile(canvas.toDataURL('image/jpeg', compressPersents))
      canvas.remove()
      resolve(res)
    }
  }
  // base64转化成blob/file
  _base64ToBlobOrFile(code) {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    if (this.options.outputType === 'file') {
      return new File([uInt8Array], { type: contentType })
    }
    return new Blob([uInt8Array], { type: contentType })
  }
  // 创建canvas
  _imagetoCanvas(image) {
    var cvs = document.createElement('canvas')
    var ctx = cvs.getContext('2d')
    // canvas中，png转jpg会变黑底，所以先给canvas铺一张白底
    ctx.fillStyle = '#fff'
    cvs.width = image.width
    cvs.height = image.height
    // fillRect()方法绘制一个填充了内容的矩形，这个矩形的开始点（左上点）在
    // (x, y) ，它的宽度和高度分别由width 和 height 确定，填充样式由当前的fillStyle 决定。
    ctx.fillRect(0, 0, cvs.width, cvs.height)
    // 绘制图像
    ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
    return cvs
  }
}

export default compressImage
