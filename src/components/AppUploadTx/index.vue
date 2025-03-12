<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      drag
      :show-file-list="false"
      :before-upload="handleChange"
    >
      <div v-if="src" class="videoBox">
        <video ref="videoRef" :src="src" class="videos" @click.stop />
        <div class="videoBtnBox">
          <div @click.stop="handleShowVideo">预览视频</div>
          <div v-if="!disabled">重新上传</div>
        </div>
      </div>
      <div v-else v-loading="loading" class="addBox" :element-loading-text="`已解析${md5progress}%`">
        <i class="el-icon-plus avatar-uploader-icon" />
        <span>点击拖拽上传</span>
        <span>限制大小{{ isLt }}G/MP4格式</span>
        <span>分辨率为1920*1080或1080*1920</span>
      </div>
    </el-upload>
  </div>
</template>
<script>
import SparkMD5 from 'spark-md5'
export default {
  props: {
    isMd5: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    isType: {
      type: String,
      default: 'video/mp4'
    },
    isLt: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: '',
      md5progress: 0,
      loading: false
    }
  },
  mounted() {
    // 监听视频窗口打开关闭
    window.addEventListener('resize', () => {
      const videoObj = this.$refs.videoRef
      if (this.checkIsFullScreen()) {
        videoObj && videoObj.play()
      } else {
        videoObj && videoObj.pause()
      }
    })
  },
  methods: {
    // 获取当前是否展开
    checkIsFullScreen() {
      const isFullScreen =
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen
      return isFullScreen === undefined ? false : isFullScreen
    },
    // 点击预览
    handleShowVideo() {
      var videoObj = this.$refs.videoRef
      videoObj.webkitRequestFullScreen()
    },
    // 选择视频
    async handleChange(file) {
      const bol = await this.confineUpload(file)
      console.log(bol, 'bol')
      if (!bol) return
      this.$emit('update:src', '')
      this.loading = true
      let md5Json
      if (this.isMd5) {
        try {
          this.md5progress = 0
          md5Json = await this.doIncremental(file)
        } catch {
          this.loading = false
          return
        }
      }
      this.file = file
      // 返回file 和  md5
      this.$emit('onChangeFile', this.file, md5Json)
      this.loading = false
      const url = URL.createObjectURL(file)
      this.$emit('update:src', url)
    },
    // 限制上传格式大小和分辨率
    confineUpload(file) {
      // return isLtG && isMp4
      return new Promise((resolve, reject) => {
        const isLtG = file.size / 1024 / 1024 / 1024 < this.isLt
        const isMp4 = file.type === this.isType
        if (!isMp4) {
          this.$message.error('上传视频只能是 MP4 格式!')
          return resolve(false)
        }
        if (!isLtG) {
          this.$message.error(`上传视频大小不能超过 ${this.isLt}G!`)
          return resolve(false)
        }
        const _URL = window.URL || window.webkitURL
        const videoElement = document.createElement('video')
        videoElement.src = _URL.createObjectURL(file)
        videoElement.addEventListener('loadedmetadata', _event => {
          console.log(_event, videoElement.videoWidth, videoElement.videoHeight, '视频信息。。。。')
          if ((videoElement.videoWidth === 1920 && videoElement.videoHeight === 1080) || (videoElement.videoWidth === 1080 && videoElement.videoHeight === 1920)) {
            return resolve(true)
          } else {
            this.$message.error(`请上传视频分辨率为1920*1080或1080*1920的视频`)
            return resolve(false)
          }
        })
        videoElement.addEventListener('error', function() {
          this.$message.error(`媒体文件解析出错，请检查视频源。`)
          return resolve(false)
        })
      }).catch(() => {
        return new Promise().resolve(false)
      })
    },

    doIncremental(file) {
      const _this = this
      return new Promise(resolve => {
        // 这里需要用到File的slice( )方法，以下是兼容写法
        const blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice
        const chunkSize = 2097152 // 以每片2MB大小来逐次读取
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        const spark = new SparkMD5() // 创建SparkMD5的实例
        const fileReader = new FileReader()
        fileReader.onload = function (e) {
          spark.appendBinary(e.target.result) // append array buffer
          currentChunk += 1
          _this.md5progress = ((currentChunk / chunks) * 100).toFixed(2)
          console.log(_this.md5progress, '_this.md5progress')
          if (currentChunk < chunks) {
            console.log(currentChunk, chunks, 'chunks')
            loadNext()
          } else {
            _this.md5progress = 100
            // console.log('Finished loading!')
            const md5 = spark.end()
            if (md5) {
              resolve(md5)
            } else {
              // console.log('md5校验异常', md5)
              this.$message.error('md5校验异常')
            }
          }
        }
        fileReader.onerror = function () {
          // console.log('something went wrong')
          this.$message.error('something went wrong')
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
.avatar-uploader{
  width:200px;
  height:150px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.videoBox {
  width: 200px;
  height: 150px;
  border: 1px solid #e2e2e2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  > .videoBtnBox {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    > div {
      background: rgba($color: #000000, $alpha: 0.8);
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      flex:1;
      z-index: 2;
      &:hover {
        background: rgba($color: #000000, $alpha: 1);
      }
    }
  }
  > .videos {
    position: absolute;
    height: 148px;
  }
}
.addBox {
  width: 178px;
  height: 178px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  line-height: 1;
  > span:nth-of-type(1) {
    color: #0c6fff;
  }
  > span {
    margin-top: 10px;
  }
}
</style>
