<!-- eslint-disable require-atomic-updates -->
<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <template v-if="fileList.length < maxLength">
      <template v-if="type==='card'">
        <el-upload
          ref="upload"
          class="uploadView m-r-16"
          :class="{ disabledUpload: disabled }"
          :style="{ width: width + 'px', height: height + 'px', ...customStyle }"
          drag
          :disabled="disabled"
          action="#"
          :limit="maxLength"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="upload"
          :show-file-list="false"
        >
          <i class="el-icon-plus" />
          <div class="uploadViewText">{{ uploadText }}</div>
        </el-upload>
      </template>
      <template v-else-if="type === 'btn'">
        <el-upload
          ref="upload"
          :class="{ disabledUpload: disabled }"
          :disabled="disabled"
          action="#"
          :style="{ width: width + 'px', height: height + 'px', ...customStyle }"
          :limit="maxLength"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="upload"
          :show-file-list="false"
        >
          <el-button slot="trigger" :disabled="disabled" icon="el-icon-plus" size="small" type="primary">{{ uploadText }}</el-button>
        </el-upload>
      </template>
    </template>

    <template v-for="(item, index) in fileList">
      <uploadItem
        :key="index"
        :index="index"
        class="m-r-16"
        :status="item.status"
        :err-tips="item.errTips"
        :url="item.url"
        :accept="accept"
        :width="width"
        :disabled="disabled"
        :height="height"
        :auth-progress="item.authProgress"
        :before-upload="beforeUpload"
        :upload-show-arr="uploadShowArr"
        @del="delFile(item, index)"
        @upload="uploadChange"
        @onClick="res => delFile(item, res)"
      />
    </template>

    <slot name="tips" />
  </div>
</template>

<script>
import { getFileType, blobToBase64 } from '@/utils/index'
import { imgBase64 } from '@/api/course'
import uploadItem from './uploadItem.vue'
import { getOssConfig } from '@/api/file'
import SparkMD5 from 'spark-md5'
export default {
  components: {
    uploadItem
  },
  props: {
    // 样式选择
    type: {
      type: String,
      default: 'card'
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => {}
    },
    getOssCOnfigApi: {
      type: Function,
      default: getOssConfig
    },
    uploadText: {
      type: String,
      default: '点击/拖拽上传'
    },
    tips: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeUpload: {
      type: Function,
      default: () => {}
    },
    ossTeacherFolder: {
      type: String,
      default: 'hok_web'
    },
    accept: {
      type: String,
      default: '*'
    },
    width: {
      type: [Number, String],
      default: ''
    },
    height: {
      type: [Number, String],
      default: ''
    },
    uploadShowArr: {
      type: Array,
      default: () => {
        return ['修改', '删除']
      }
    },
    files: {
      type: Array,
      default: () => {
        return []
      }
    },
    onCheckMdk5: {
      type: [Function, null],
      default: null
    },
    cropperOption: {
      type: Object,
      default: () => {
        return {
          fixed: true,
          width: 200,
          height: 200
        }
      }
    },
    // 压缩图片大小，为0不压缩，单位字节
    compressionSize: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4: 解析中 5.解析失败
      // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
      fileList: [
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'audio', poster: '', url: 'https://dev.oss.hokkj.cn/高伟光体温高.mp3' }
      ]
    }
  },
  watch: {
    files: {
      handler(val) {
        console.log('files-------', val)
        this.fileList = val
      },
      immediate: true
    }
  },
  created() {
    // this.getOssConfig()
  },
  // mounted() {
  //   console.log('mounted--------', this.files)
  //   if (this.files.length) this.fileList = this.files
  // },
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      this.getOssCOnfigApi()
        .then(res => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          // eslint-disable-next-line no-undef
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    uploadChange(obj) {
      this.upload(obj.e, obj.index)
    },
    // 点击上传视频
    async upload(e, changeIndex) {
      console.log(e)
      const _this = this
      this.$refs.upload && this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      const reader = new FileReader()
      reader.onload = function(e) {
        console.log(e, 'eeeeee')
        const src = e.target.result
        _this.$AppImageCropper({
          title: '裁剪图片',
          visible: true,
          url: src,
          fixed: _this.cropperOption.fixed,
          option: {
            ..._this.cropperOption
          },
          success: (data, orginImgInfo) => {
            let fileSize = ''
            // 生产的宽高
            const materialDes = `${orginImgInfo.width}*${orginImgInfo.height}`
            blobToBase64(data).then(async (res) => {
              console.log(data, 'data', materialDes)
              fileSize = _this.getBase64ImageSize(res)// 获取的图片大小
              console.log(fileSize, '获取的图片fileSize')
              const fileType = getFileType(selectFile.name)
              const obj = {
                file: selectFile, // 文件对象
                name: `${_this.getUuiD(10)}.${fileType.suffix}`, // 文件名
                status: 4, // 状态
                authProgress: 0, // 进度
                ossTeacherFolder: `${_this.ossTeacherFolder}/${fileType.fileType}/`,
                poster: '', // 封面
                alignUploadShow: false, // 重新上传mask控制
                abortCheckpoint: null, // 中断点
                // eslint-disable-next-line no-undef
                orginSize: fileSize, // 图片原始大小
                errTips: '',
                url: '' // 地址
              }
              let index = 0
              if (typeof changeIndex === 'number') {
                _this.$set(_this.fileList, changeIndex, obj)
                index = changeIndex
              } else {
                _this.fileList.push(obj)
                index = _this.fileList.length - 1
              }
              const self = _this.fileList[index]
              _this.$emit('change', _this.fileList)
              if (_this.onCheckMdk5) {
                try {
                  const md5Res = await _this.doIncremental(selectFile, self)
                  const checkMd5 = await _this.onCheckMdk5(md5Res)
                  console.log(checkMd5, 'checkMd5')
                  if (!checkMd5) {
                    // eslint-disable-next-line require-atomic-updates
                    self.errTips = '该文件已存在。'
                    // eslint-disable-next-line require-atomic-updates
                    self.status = 5
                    return
                  }
                } catch (err) {
                  // eslint-disable-next-line require-atomic-updates
                  self.status = 5
                  // eslint-disable-next-line require-atomic-updates
                  self.errTips = err
                  return
                }
              }
              // eslint-disable-next-line require-atomic-updates
              self.authProgress = 0
              // eslint-disable-next-line require-atomic-updates
              self.status = 6
              if (_this.compressionSize !== 0) {
                _this.compressedImage(
                  res,
                  { width: orginImgInfo.width, height: orginImgInfo.height },
                  _this.compressionSize,
                  (res) => {
                    console.log(res.newBase64Image, '成功的回调')
                    console.log(res.filesize, '压缩后大小')
                    self.status = 1
                    return imgBase64({ base64Data: res.newBase64Image }).then(res => {
                      self.url = res.data.url
                      self.status = 3
                      const fileList = []
                      _this.fileList.map(v => {
                        v.status === 3 && fileList.push(v)
                      })
                      _this.$emit('change', fileList)
                    }).catch((err) => {
                      self.status = 5
                      self.errTips = err
                    })
                  }
                )
              } else {
                return imgBase64({ base64Data: res }).then(res => {
                  self.url = res.data.url
                  self.status = 3
                  const fileList = []
                  _this.fileList.map(v => {
                    v.status === 3 && fileList.push(v)
                  })
                  _this.$emit('change', fileList)
                }).catch((err) => {
                  console.log(err + '', 'err')
                  self.status = 5
                  self.errTips = err + ''
                })
              }
            }).catch((err) => {
              console.log(err, 'err')
              self.status = 5
              self.errTips = err
            })
          }
        })
      }
      reader.onerror = function(error) {
        console.log('图片读取，失败原因', error)
        this.$message.error(`文件读取失败，源文件不存在或已损坏，请检查源文件。`)
      }
      reader.readAsDataURL(selectFile)
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex(v => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
    },
    // 设置fileList
    setFileList(arr) {
      this.fileList = arr
    },
    getFileList() {
      return this.fileList
    },
    getUuiD(randomLength) {
      return (
        Number(
          Math.random().toString().substr(2, randomLength) + Date.now()
        ).toString(36) +
        Math.floor(Math.random() * 10) +
        1
      )
    },
    doIncremental(file, obj) {
      obj.status = 4
      return new Promise((resolve, reject) => {
        // 这里需要用到File的slice( )方法，以下是兼容写法
        const blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice
        const chunkSize = 2097152 // 以每片2MB大小来逐次读取
        const chunks = Math.ceil(file.size / chunkSize)
        let project = 0 // 进度
        let currentChunk = 0
        const spark = new SparkMD5() // 创建SparkMD5的实例
        const fileReader = new FileReader()
        fileReader.onload = function (e) {
          spark.appendBinary(e.target.result) // append array buffer
          currentChunk += 1
          project = Number(((currentChunk / chunks) * 100).toFixed(0))
          obj.authProgress = project
          if (currentChunk < chunks) {
            loadNext()
          } else {
            console.log('Finished loading!')
            const md5 = spark.end()
            project = 100
            obj.authProgress = project
            console.log(md5, 'md5')
            if (md5) {
              return resolve(md5)
            } else {
              // console.log('md5校验异常', md5)
              // this.$message.error('md5校验异常')
              return reject('md5校验异常')
            }
          }
        }
        fileReader.onerror = function () {
          // console.log('something went wrong')
          // this.$message.error('something went wrong')
          return reject('fileReader解析出错')
        }
        function loadNext() {
          var start = currentChunk * chunkSize
          var end =
            start + chunkSize >= file.size ? file.size : start + chunkSize
          fileReader.readAsBinaryString(blobSlice.call(file, start, end))
        }
        loadNext()
      })
    },
    // 计算base64编码图片大小
    getBase64ImageSize(base64) {
      const indexBase64 = base64.indexOf('base64,')
      if (indexBase64 < 0) return -1
      const str = base64.substr(indexBase64 + 6)
      // 大小单位：字节
      return (str.length * 0.75).toFixed(2)
    },
    /**
     * 图像压缩，默认同比例压缩
     * @param {Object} imgPath
     * 图像base64编码字符串或图像可访问路径
     * @param {Object} obj
     * obj对象有width,height,quality(0-1)
     * @param {Object} maxSize
     * 指定压缩后的文件大小，单位：字节
     * @param {Object} callback
     * 回调函数有一个参数，base64的字符串数据
     */
    compressedImage(imgPath, obj, maxSize, callback) {
      console.log(imgPath, 'imgPath')
      const that = this
      const img = new Image()
      img.src = imgPath
      img.onload = function () {
        const _this = this
        let w = _this.width
        let h = _this.height
        const scale = w / h
        w = obj.width || w
        h = (obj.height && obj.height * (w / scale)) || h
        // 生成canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = w
        canvas.height = h
        ctx.drawImage(_this, 0, 0, w, h) // 图像质量，默认图片质量为0.8
        let quality = 0.8
        if (obj.quality && obj.quality > 0 && obj.quality <= 1) {
          quality = obj.quality
        }
        const newBase64Image = canvas.toDataURL('image/jpeg', quality)
        console.log(newBase64Image, 'newBase64Image')
        console.log(that.getBase64ImageSize, 'that', that)
        const filesize = that.getBase64ImageSize(newBase64Image)
        console.log(filesize, 'filesize')
        if (filesize > maxSize && quality > 0.01) {
          if (quality > 0.05) {
            quality = quality - 0.05
          } else {
            quality = 0.01
          }
          that.compressedImage(imgPath, { quality: quality }, maxSize, callback)
          return
        }
        if (callback) {
          callback({ newBase64Image, filesize })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 120px;
    }
  }
}
.upload {
  display: flex;
  flex-wrap: wrap;
  .uploadView {
    width: 160px;
    height: 120px;
    background: #fbfcfe;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
      margin-top: 12px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .disabledUpload {
    border: 1px solid transparent;
    .uploadViewText {
      color: #c0c4cc;
    }
    ::v-deep {
      .el-upload-dragger {
        border: 1px dashed #d9d9d9;
        &:hover {
          border-color: #d9d9d9;
        }
      }
    }
  }
  .tips {
    width: 339px;
    height: 120px;
    overflow: auto;
    margin-left: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.el-icon-plus {
  font-weight: 700;
  font-size: 14px;
  color: #333333;
}
</style>
