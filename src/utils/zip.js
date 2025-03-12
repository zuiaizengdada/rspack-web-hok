import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

function getFile(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    })
      .then((data) => {
        resolve(data.data)
      })
      .catch((error) => {
        reject(error.toString())
      })
  })
}
/*
 * 文件打包
 * files 需要打包的文件list，格式为可访问的url
 * zipName打包后压缩包的名称
 * Fn(progressEvent)文件处理进度回调
 */
export function urlExportZip(files, zipName, Fn = () => {}) {
  console.log(files, 'files')
  const zip = new JSZip()
  const promises = []
  files.forEach((item, index) => {
    const promise = getFile(item.src).then((data) => {
      // 截取后缀名（注意重命名一定要加上原来图片的后缀，否则下载出来的文件就是错误的）
      const nameList = item.src.split('.')
      const fileName = item.name + '.' + nameList[nameList.length - 1]
      zip.file(fileName, data, { binary: true }) // 文件名、文件流、是否为二进制
      Fn && Fn(item, index, 'success')
    })
    promises.push(promise)
  })

  // 等待所有文件添加完进行打包
  return Promise.all(promises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // 利用file-saver保存文件  自定义文件名
      FileSaver.saveAs(content, zipName)
    })
  })
}

export function urlVodExportZip(files, zipName) {
  const zip = new JSZip()
  const promises = []
  files.forEach((item) => {
    const promise = getFile(item.src).then((data) => {
      zip.file(item.name, data, { binary: true }) // 文件名、文件流、是否为二进制
    })
    promises.push(promise)
  })

  // 等待所有文件添加完进行打包
  return Promise.all(promises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // 利用file-saver保存文件  自定义文件名
      FileSaver.saveAs(content, zipName)
    })
  })
}
