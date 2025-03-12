<template>
  <div class="upload">
    <el-upload
      v-if="!isUpload"
      class="upload-video"
      drag
      :action="'#'"
      :limit="1"
      :http-request="customUpload"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
      <div class="upload-tips">
        <div class="icon-upload">
          <i class="el-icon-upload" />
        </div>
        <div class="upload-tips-c">
          <div class="tips-o">点击/拖拽上传视频</div>
          <p>视频格式：mp4，分辨率：1080p，单个视频不超过20G</p>
        </div>
      </div>
    </el-upload>
    <div v-else class="upload-info">
      <div class="video">
        <div class="img-for-cls" @click="toShowVideo()">
          <img :src="videoFirstimgsrc" />
          <i class="el-icon-video-play" />
        </div>
      </div>
      <div class="video-info">
        <div class="video-name">{{ file.name }}</div>
        <div class="video-size">
          <span style="margin-right: 20px">
            视频大小 : {{ file.size | getFileSize }}
          </span>
          <span>视频时长 : {{ file.duration | getVideoDuration }}</span>
        </div>
        <div class="video-j">
          <el-progress
            :percentage="percentage"
            :show-text="false"
            class="video-progress"
          />
          <span
            v-if="file.status === 'uploading'"
            style="margin-right: 6px; margin-left: 16px"
            @click="handleClickCancel"
          >
            取消上传
          </span>
          <span v-if="file.status === 'uploading'" @click="handleClickPause">
            暂停上传
          </span>
          <span
            v-if="file.status === 'pause'"
            style="margin-left: 16px"
            @click="handleClickReload"
          >
            继续上传
          </span>
          <span
            v-if="file.status === 'success' || file.status === 'error'"
            style="color: #f53f3f; margin-left: 16px"
            @click="handleClickRemove"
          >
            删除视频
          </span>
          <span v-if="file.status === 'error'" @click="handleClickReload">
            重新上传
          </span>
        </div>
        <div class="progress-plan">
          <span v-if="file.status === 'uploading'">
            正在上传中
            <span style="margin-left: 3px"> {{ percentage }}%</span>
          </span>
          <span v-if="file.status === 'success'">
            <i class="el-icon-success" style="color: #00b42a" />
            <span class="success-text"> 上传成功 </span>
          </span>
          <span v-if="file.status === 'error'">
            <i class="el-icon-error" style="color: #f53f3f" />
            <span class="error-text"> 上传失败 </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { getOssToken } from '@/api/qiniu'
const OSS = require('ali-oss') // 引入阿里云上传插件
const ossProdcutFolder = 'hok_product/video/' // 上传到阿里云的文件夹

export default {
  filters: {
    // 获取文件大小
    getFileSize(size) {
      if (typeof size !== 'number') {
        return '未知'
      }
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') {
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size
    },
    // 获取视频时长
    getVideoDuration(val) {
      const hour = parseInt(val / 3600)
      const minute = parseInt((val % 3600) / 60)
      const second = Math.ceil(val % 60)
      return (
        (hour > 0 ? hour + '小时' : '') +
        (minute > 0 ? minute + '分' : '') +
        (second > 0 ? second + '秒' : '')
      )
    }
  },
  data() {
    return {
      oss: {},
      ossBucketUrl: '',
      abortCheckpoint: '',
      percentage: 0,
      isUpload: false,
      file: { videoUrl: undefined },
      videoFirstimgsrc: ''
    }
  },
  created() {
    this.getAliOssToken()
  },
  methods: {
    toShowVideo() {
      this.$Videoplayer({
        src: this.file.videoUrl
          ? this.file.videoUrl
          : URL.createObjectURL(this.file.file),
        videoName: this.file.name
      })
    },
    handleClickRemove() {
      this.file = {}
      this.percentage = 0
      this.abortCheckpoint = ''
      this.isUpload = false

      this.$emit('clear')
    },
    // 重新上传
    handleClickReload() {
      this.$emit('clear')
      this.file.status = 'uploading'
      this.upload()
    },
    // 取消
    handleClickCancel() {
      this.$confirm('确定要取消该视频上传吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleClickRemove()
        // 取消上传
        this.oss.cancel()
        localStorage.setItem('localOssList', JSON.stringify([]))
      })
    },
    // 暂停
    handleClickPause() {
      this.file.status = 'pause'
      this.oss.cancel()
    },
    async getAliOssToken() {
      const { data } = await getOssToken()
      const ossToken = data
      const { accessKeyId, accessKeySecret, ossBucket, ossBucketUrl } = ossToken
      this.ossBucketUrl = ossBucketUrl
      this.oss = new OSS({
        region: 'oss-accelerate',
        accessKeyId,
        accessKeySecret,
        bucket: ossBucket,
        secure: true
      })
    },
    async upload() {
      const _this = this
      const localOssList = localStorage.getItem('localOssList')
      const ossList = localOssList ? JSON.parse(localOssList) : []
      const uploadIndex = _.findIndex(ossList, { name: this.file.name })
      if (uploadIndex > -1) {
        this.abortCheckpoint = ossList[uploadIndex].abortCheckpoint
      }
      try {
        await _this.oss.multipartUpload(
          ossProdcutFolder + this.file.name,
          this.file.file,
          {
            checkpoint: this.abortCheckpoint,
            // 设置并发上传的分片数量。
            parallel: 4,
            // 设置分片大小。默认值为1 MB，最小值为100 KB。
            partSize: 1024 * 1024,
            // headers,
            // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
            // meta: { year: 2020, people: 'test' },
            mime: 'text/plain',
            progress: (p, cpt, res) => {
              this.abortCheckpoint = cpt
              this.percentage = Number((p * 100).toFixed(2))
            }
          }
        )
        this.file.status = 'success'
        this.file.src = `${this.ossBucketUrl}${ossProdcutFolder}${this.file.name}`
        this.$emit('success', {
          url: this.file.src,
          name: this.file.name,
          size: this.file.size,
          videoFirstimgsrc: `${this.file.src}?x-oss-process=video/snapshot,t_10000,m_fast`,
          duration: this.file.duration
        })
        const uploadIndex = _.findIndex(ossList, {
          name: this.file.name
        })
        if (uploadIndex > -1) {
          ossList.splice(uploadIndex, 1)
          localStorage.setItem('localOssList', JSON.stringify(ossList))
        }
      } catch (err) {
        if (err?.status !== 0) {
          this.file.status = 'error'
        }
      }
    },
    customUpload({ file }) {
      const u = URL.createObjectURL(file)
      const video = document.createElement('video') // 也可以自己创建video
      video.src = u // 设置视频地址
      var canvas = document.createElement('canvas') // 获取 canvas 对象
      const ctx = canvas.getContext('2d') // 绘制2d

      video.crossOrigin = 'anonymous'
      video.currentTime = 1 // 视频截取第1秒
      video.oncanplaythrough = () => {
        canvas.width = video.videoWidth > video.videoHeight ? 171 : 171 - 20
        canvas.height = video.videoWidth > video.videoHeight ? 128 - 20 : 128
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        // 转换成base64形式
        this.videoFirstimgsrc = canvas.toDataURL('image/png') // 截取后的视频封面

        video.remove()
        canvas.remove()
        this.$set(this, 'file', {
          key: Date.now(),
          status: 'uploading',
          index: 0,
          name: file.name,
          size: file.size,
          file,
          percentage: 0,
          duration: video.duration
        })
        this.isUpload = true
        this.upload()
      }
    },
    beforeUpload(file) {
      // 判断文件类型为视频格式
      const isVideo = file.type === 'video/mp4'
      if (!isVideo) {
        this.$message.error('上传文件只能是 mp4 格式!')
      }
      // 判断文件大小
      const isLt20G = file.size / 1024 / 1024 / 1024 < 20
      if (!isLt20G) {
        this.$message.error('上传视频大小不能超过 20G!')
      }
      return isVideo
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  width: 100%;
  height: 100%;
  .upload-info {
    height: 100%;
    border: 1px solid #e1e6ed;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 20px;
    .video {
      width: 170px;
      height: 100%;
      margin-right: 10px;

      .img-for-cls {
        position: relative;
        text-align: center;
        cursor: pointer;
        width: 100%;
        height: 100%;
        background: rgb(0, 0, 0, 0.75);
        border-radius: 6px;
        img {
          max-height: 128px;
          max-width: 170px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        i {
          position: absolute;
          z-index: 11;
          top: 50%;
          left: 50%;
          font-size: 30px;
          margin: -10px 0 0 -10px;
          border-radius: 100%;
          color: #fff;
        }
      }
    }
    .video-info {
      width: 74%;
      .video-name {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        overflow: hidden;
        text-emphasis: ellipsis;
        white-space: nowrap;
      }
      .video-size {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        margin-top: 10px;
      }
      .video-j {
        width: 100%;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        .video-progress {
          width: 70%;
          margin-top: 38px;
          display: inline-block;
        }
        span {
          &:hover {
            cursor: pointer;
          }
        }
      }
      .progress-plan {
        margin-top: 10px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        height: 21px;
        .success-text {
          margin-left: 3px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #00b42a;
        }
        .error-text {
          margin-left: 3px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #f53f3f;
        }
      }
    }
  }
  .upload-video {
    width: 100%;
    height: 100%;
    .upload-tips {
      height: 100%;

      .icon-upload {
        width: 100%;
        text-align: center;
        margin-top: 20px;
        i {
          font-size: 7rem;
          margin: 0 20px;
          color: #e1e6ed;
        }
      }

      .upload-tips-c {
        width: 100%;
        height: 100%;
        padding-top: 16px;
        .tips-o {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #0c6fff;
        }
        p {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #999999;
        }
      }
    }
  }
}
::v-deep .upload-video {
  .el-upload {
    width: 100%;
    height: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
