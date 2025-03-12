<!-- eslint-disable require-atomic-updates -->
<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <template v-if="fileList.length < maxLength">
      <template v-if="type === 'card'">
        <el-upload
          ref="upload"
          class="uploadView m-r-16"
          :class="{ disabledUpload: disabled }"
          :style="{
            width: width + 'px',
            height: height + 'px',
            ...customStyle
          }"
          :drag="drag"
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
          :drag="drag"
          :style="{
            width: width + 'px',
            height: height + 'px',
            ...customStyle
          }"
          :limit="maxLength"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="upload"
          :show-file-list="false"
        >
          <el-button
            slot="trigger"
            :disabled="disabled"
            icon="el-icon-plus"
            size="small"
            type="primary"
          >{{ uploadText }}</el-button>
        </el-upload>
      </template>
      <template v-if="type === 'digitalPerson'">
        <el-upload
          ref="upload"
          class="uploadVideo-box-wrapper"
          :class="{ disabledUpload: disabled }"
          :style="{
            width: width + 'px',
            height: height + 'px',
            ...customStyle
          }"
          :drag="drag"
          :disabled="disabled"
          action="#"
          :limit="maxLength"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="upload"
          :show-file-list="false"
        >
          <div class="video-box">
            <img src="@/assets/image/plus-blue.png" />
          </div>
          <div class="text">{{ uploadText }}</div>
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
        @again="alignUpload(item, index)"
        @upload="uploadChange"
        @onClick="res => $emit('onClick', res)"
      />
    </template>

    <slot name="tips" />
    <!-- <div class="tips overflowOuto" v-html="tips ? tips.replace(/\n/g, '<br />') : ''" /> -->
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import { getOssConfig } from '@/api/file'
import SparkMD5 from 'spark-md5'
import {
  imageFormatLimits,
  videoFormatLimits
} from '@/views/digitalPerson/digitalPersonTraining/config/fileLimits.config'

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
    drag: {
      type: Boolean,
      default: true
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
      ],
      rowFile: '',
      row: '',
      imageFormatLimits: {},
      videoFormatLimits: {},
      mediainfo: null
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
    this.imageFormatLimits = imageFormatLimits
    this.videoFormatLimits = videoFormatLimits
    this.getOssConfig()
    // eslint-disable-next-line no-undef
    MediaInfo.mediaInfoFactory({ format: 'text' }, mediainfo => {
      this.mediainfo = mediainfo
    })
  },
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
      this.upload(obj.e || obj, obj.index)
    },
    // 检查上传文件格式和大小是否符合要求
    async checkFileFormatAndSize(files, fileType) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        // 检查文件格式
        let isValidFormat = false
        for (const limits of Object.values(
          fileType === 'image' ? this.imageFormatLimits : this.videoFormatLimits
        )) {
          if (limits.extensions.includes(extension)) {
            isValidFormat = true
            // 检查文件大小
            if (limits.maxSize && fileSize > limits.maxSize) {
              this.$message({
                message: `文件 "${file.name}" 超过了 ${limits.type} 类型文件的${
                  limits.maxSize / 1024 / 1024
                }M大小限制，请重新选择`,
                type: 'warning'
              })

              return false
            }
          }
        }
        if (!isValidFormat) {
          this.$message({
            message: `文件 "${file.name}" 的格式不支持，请重新选择`,
            type: 'warning'
          })

          return false
        }

        if (fileType === 'video') {
          const { duration, frameRate, codecId } =
            await this.getVideoPlayerInfo(file)

          if (Math.floor(duration) < 60) {
            this.$message({
              message: `文件 "${file.name}" 时长小于1分钟，请重新选择`,
              type: 'warning'
            })

            return false
          }

          if (Math.floor(duration) > 300) {
            this.$message({
              message: `文件 "${file.name}" 超出了5分钟的时长，请重新选择`,
              type: 'warning'
            })

            return false
          }

          // 视频分辨率 必须大于等于1080P，最大支持2k
          // if (
          //   width >= 1080 &&
          //   height >= 1080 &&
          //   width <= 2560 &&
          //   height <= 1440
          // ) {
          //   console.log(width, height, 'width, height')
          // } else {
          //   this.$message({
          //     message: `文件 "${file.name}" 的分辨率不符合要求，请重新选择`,
          //     type: 'warning'
          //   })

          //   return false
          // }

          // 视频帧率 必须大于等于25帧
          if (frameRate < 25) {
            this.$message({
              message: `文件 "${file.name}" 的帧率必须大于等于25帧，请重新上传`,
              type: 'warning'
            })

            return false
          }

          // 视频编码格式必须为H.264和H.265
          if (codecId !== 'avc1' && codecId !== 'hvc1') {
            this.$message({
              message: `文件 "${file.name}" 的编码格式必须为H.264和H.265，请重新上传`,
              type: 'warning'
            })

            return false
          }
        }
      }
      return true
    },
    makeReadChunk(file) {
      return async (chunkSize, offset) =>
        new Uint8Array(
          await file.slice(offset, offset + chunkSize).arrayBuffer()
        )
    },
    parseMediaInfoText(text) {
      const lines = text.split('\n')
      const result = {
        frameRate: null,
        width: null,
        height: null,
        duration: null,
        codecId: null
      }

      let isInVideoSection = false

      lines.forEach(line => {
        line = line.trim()

        // 检测是否进入 Video 部分
        if (line === 'Video') {
          isInVideoSection = true
          return
        }
        // 检测是否离开 Video 部分（遇到下一个主要部分）
        if (line === 'Audio' || line === 'General') {
          isInVideoSection = false
          return
        }

        if (line.startsWith('Frame rate')) {
          const match = line.match(/: (\d+\.?\d*)/)
          if (match) {
            result.frameRate = parseFloat(match[1])
          }
        } else if (line.startsWith('Width')) {
          const match = line.match(/: (\d+)/)
          if (match) {
            result.width = parseInt(match[1])
          }
        } else if (line.startsWith('Height')) {
          const match = line.match(/: (\d+)/)
          if (match) {
            result.height = parseInt(match[1])
          }
        } else if (line.startsWith('Duration')) {
          const match = line.match(/: (\d+)\s*min\s*(\d+)\s*s/)
          if (match) {
            const minutes = parseInt(match[1])
            const seconds = parseInt(match[2])
            result.duration = minutes * 60 + seconds
          }
        } else if (isInVideoSection && line.startsWith('Codec ID')) {
          if (line.startsWith('Codec ID/Info')) {
            return // 跳过 Codec ID/Info 行
          }
          const match = line.match(/Codec ID\s*:\s*(.+)/)
          if (match) {
            result.codecId = match[1].trim()
          }
        }
      })

      return result
    },
    async getVideoPlayerInfo(file) {
      const mediaInfoResult = await this.mediainfo.analyzeData(
        file.size,
        this.makeReadChunk(file)
      )
      console.log(mediaInfoResult, 'mediaInfoResult')
      const parsedInfo = this.parseMediaInfoText(mediaInfoResult)
      console.log(parsedInfo, 'parsedInfo')

      return new Promise(resolve => {
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(file)
        videoElement.addEventListener('loadedmetadata', () => {
          resolve({
            duration: videoElement.duration,
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
            frameRate: parsedInfo.frameRate || 0,
            codecId: parsedInfo.codecId || ''
          })
        })
      })
    },
    // 点击上传视频
    async upload(e, changeIndex) {
      console.log(e, changeIndex, '11111111')
      this.$refs.upload && this.$refs.upload.clearFiles()
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file

      if (this.type === 'digitalPerson') {
        if (!(await this.checkFileFormatAndSize([e.file], 'video'))) return
      } else {
        if (!this.beforeUpload(selectFile)) {
          return
        }
      }
      if (this.maxLength === 1) {
        this.fileList = []
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.getUuiD(10)}.${fileType.suffix}`, // 文件名
        status: 4, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `${this.ossTeacherFolder}/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        errTips: '',
        url: '' // 地址
      }
      let index = 0
      if (typeof changeIndex === 'number') {
        this.$set(this.fileList, changeIndex, obj)
        index = changeIndex
      } else {
        this.fileList.push(obj)
        index = this.fileList.length - 1
      }
      const self = this.fileList[index]
      this.$emit('change', this.fileList)
      if (this.onCheckMdk5) {
        try {
          const md5Res = await this.doIncremental(selectFile, self)
          const checkMd5 = await this.onCheckMdk5(md5Res)
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
      self.status = 1
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt

            if (p === 1) {
              this.$emit('onSuccess', e)
            }
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(
          self.ossTeacherFolder + obj.name,
          obj.file,
          {
            ...options
          }
        )
        console.log(res, '上传成功的回调')
        this.row = res
        this.rowFile = e.file
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.fileList.map(v => {
          v.status === 3 && fileList.push(v)
        })
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      await this.resumeUpload(self)
    },
    // 上传重试
    async resumeUpload(self) {
      self.status = 1
      // 设置重试次数为五次。
      try {
        const result = await self.client.multipartUpload(
          self.ossTeacherFolder + self.name,
          self.file,
          {
            checkpoint: self.abortCheckpoint,
            progress: (p, cpt, res) => {
              // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
              // 获取上传进度。
              self.authProgress = Number((p * 100).toFixed(2))
              self.abortCheckpoint = cpt
            }
          }
        )
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        console.log(result)
        this.$emit('change', this.fileList)
      } catch (e) {
        if (e.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        } else {
          console.log('上传失败:', e)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex(v => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      if (item && item.abortCheckpoint) {
        item.client &&
          item.client.abortMultipartUpload(
            item.abortCheckpoint.name,
            item.abortCheckpoint.uploadId
          )
      }
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
      this.rowFile = ''
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
  .uploadVideo-box-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    border: 1px dashed transparent;
    border-radius: 4px;
    width: 178px;
    height: 100px;
    margin-top: 10px;
    cursor: pointer;

    ::v-deep {
      .el-upload {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    &:hover {
      border: 1px dashed #0c6fff;
    }

    .video-box {
      cursor: pointer;
      border-radius: 2px;
      width: 20px;
      height: 20px;
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }

    .text {
      cursor: pointer;
      color: #000000;
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
    }
  }
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
