<template>
  <div class="container">
    <div class="setting">
      <div class="el-input-control">
        <label for="timeout">请求过期时间（构造参数 timeout, 默认 60000）:</label>
        <el-input id="timeout" v-model="timeout" type="text" placeholder="输入过期时间, 单位毫秒" />
      </div>

      <div class="el-input-control">
        <label for="partSize">分片大小（构造参数 partSize, 默认 1048576）:</label>
        <el-input id="partSize" v-model="partSize" type="text" class="form-control" placeholder="输入分片大小, 单位bit, 最小100k" />
      </div>

      <div class="el-input-control">
        <label for="parallel">上传分片数（构造参数 parallel, 默认 5）:</label>
        <el-input id="parallel" v-model="parallel" type="text" class="form-control" placeholder="输入并行上传分片个数, 默认为5" />
      </div>

      <div class="el-input-control">
        <label for="retryCount">网络失败重试次数（构造参数 retryCount, 默认 3）:</label>
        <el-input id="retryCount" v-model="retryCount" type="text" class="form-control" placeholder="输入网络失败重试次数, 默认为3" />
      </div>

      <div class="el-input-control">
        <label for="retryDuration">网络失败重试间隔（构造参数 retryDuration, 默认 2）:</label>
        <el-input id="retryDuration" v-model="retryDuration" type="text" class="form-control" placeholder="输入网络失败重试间隔, 默认2秒" />
      </div>

      <div class="el-input-control">
        <label for="region">配置项 region, 默认 cn-shanghai:</label>
        <select v-model="region">
          <option>cn-shanghai</option>
          <option>eu-central-1</option>
          <option>ap-southeast-1</option>
        </select>
      </div>

      <div class="el-input-control">
        <label for="userId">阿里云账号ID</label>
        <el-input v-model.trim="userId" type="text" class="form-control" disabled placeholder="输入阿里云账号ID" />
      </div>

    </div>

    <div class="upload">
      <div>
        <input id="fileUpload" type="file" @change="fileChange($event)" />
        <label class="status">上传状态: <span>{{ statusText }}</span></label>
      </div>
      <div class="upload-type">
        上传方式一, 使用 UploadAuth 上传:
        <button :disabled="uploadDisabled" @click="authUpload">开始上传</button>
        <button :disabled="pauseDisabled" @click="pauseUpload">暂停</button>
        <button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button>
        <span class="progress">上传进度: <i id="auth-progress">{{ authProgress }}</i> %</span>
      </div>
    </div>
    <div class="info">uploadAuth及uploadAddress参数请查看<a href="https://help.aliyun.com/document_detail/55407.html" target="_blank">获取上传地址和凭证</a></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getOssToken, refreshVideo } from '@/api/file'
export default {
  data() {
    return {
      timeout: '',
      partSize: '',
      parallel: '',
      retryCount: '',
      retryDuration: '',
      region: 'cn-shanghai',
      // userId: '1303984639806000',
      userId: '1404407045427118',
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: ''
    }
  },
  methods: {
    fileChange(e) {
      console.log(e, 'e', e.target)

      this.file = e.target.files[0]
      if (!this.file) {
        alert('请先选择需要上传的文件!')
        return
      }
      // var Title = this.file.name
      var userData = '{"Vod":{}}'
      if (this.uploader) {
        this.uploader.stopUpload()
        this.authProgress = 0
        this.statusText = ''
      }
      this.uploader = this.createUploader()
      console.log(userData)
      this.uploader.addFile(this.file, null, null, null, userData)
      this.uploadDisabled = false
      this.pauseDisabled = true
      this.resumeDisabled = true
    },
    // 开始上传
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.uploadDisabled = true
        this.pauseDisabled = false
      }
    },
    // 暂停上传
    pauseUpload() {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.resumeDisabled = false
        this.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.resumeDisabled = true
        this.pauseDisabled = false
      }
    },
    createUploader(type) {
      const self = this
      // eslint-disable-next-line no-undef
      const uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
          self.statusText = '添加文件成功, 等待上传...'
          console.log('addFileSuccess: ' + uploadInfo.file.name)
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)

          if (!uploadInfo.videoId) {
            getOssToken().then(({ data }) => {
              console.log(data, 'data')
              const uploadAuth = data.UploadAuth
              const uploadAddress = data.UploadAddress
              const videoId = data.VideoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
          } else {
            refreshVideo(uploadInfo.videoId).then(({ data }) => {
              const uploadAuth = data.UploadAuth
              const uploadAddress = data.UploadAddress
              const videoId = data.VideoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
          }

          // if (!uploadInfo.videoId) {
          //   const createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
          //   axios.get(createUrl).then(({ data }) => {
          //     const uploadAuth = data.UploadAuth
          //     const uploadAddress = data.UploadAddress
          //     const videoId = data.VideoId
          //     uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          //   })
          //   self.statusText = '文件开始上传...'
          //   console.log('onUploadStarted:' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
          // } else {
          //   // 如果videoId有值，根据videoId刷新上传凭证
          //   // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
          //   const refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
          //   axios.get(refreshUrl).then(({ data }) => {
          //     const uploadAuth = data.UploadAuth
          //     const uploadAddress = data.UploadAddress
          //     const videoId = data.VideoId
          //     uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          //   })
          // }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
          self.statusText = '文件上传成功!'
          console.log('上传成功', uploadInfo)

          const formData = new FormData()
          formData.append('file', uploadInfo.file)
          var fileUrl = URL.createObjectURL(uploadInfo.file)
          var videoEl = document.createElement('VIDEO')
          videoEl.src = fileUrl
          videoEl.setAttribute('crossOrigin', 'Anonymous')
          videoEl.setAttribute('controls', 'controls')
          videoEl.setAttribute('autoplay', 'autoplay')
          videoEl.volume = 0
          videoEl.addEventListener('loadeddata', async() => {
            const duration = videoEl.duration // 时长
            const canvas = document.createElement('canvas')
            canvas.width = videoEl.videoWidth * 0.8
            canvas.height = videoEl.videoHeight * 0.8
            canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height) // 绘制canvas
            const materialFrameUrl = canvas.toDataURL('image/jpeg')

            console.log(duration, materialFrameUrl)
          })
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log('上传失败', uploadInfo)
          console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
          self.statusText = '文件上传失败!'
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
          self.statusText = '文件已暂停上传'
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
          const progressPercent = Math.ceil(progress * 100)
          self.authProgress = progressPercent
          self.statusText = '文件上传中...'
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          const refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
          axios.get(refreshUrl).then(({ data }) => {
            const uploadAuth = data.UploadAuth
            uploader.resumeUploadWithAuth(uploadAuth)
            console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
          })
          self.statusText = '文件超时...'
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log('onUploadEnd: uploaded all the files')
          self.statusText = '文件上传完毕'
        }
      })
      return uploader
    }
  }
}
</script>
