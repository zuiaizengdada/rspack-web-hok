<template>
  <div class="task-child-upload">
    <div class="task-child-upload-l">
      <svg-icon v-if="info.type === 'file_all'" icon-class="t_file" class="task-child-upload-l-icon" />
      <svg-icon v-if="info.type === 'file_video'" icon-class="t_video" class="task-child-upload-l-icon" />
      <div v-if="info.status === 'pause'" class="task-child-upload-l-stop">
        <svg-icon icon-class="t_suspend" />
      </div>
    </div>
    <div class="task-child-upload-r">
      <div class="task-child-upload-r-info">
        <div class="task-child-upload-r-info-title">{{ info.filename }}</div>
        <div class="task-child-upload-r-info-status">{{ info.origin }}</div>
      </div>
      <div v-if="info.status === 'uploading' || info.status === 'pause'" class="task-child-upload-r-progress">
        <el-progress :stroke-width="6" :percentage="info.progress" :format="progressFormat" />
      </div>
      <div class="task-child-upload-r-upload-msg">
        <div class="task-child-upload-r-upload-msg-l">
          <div>{{ info.size }}</div>
          <div>
            <span v-if="info.status === 'parsing' || info.status === 'parsing-wait'" class="task-color-orange">解析中</span>
            <span v-else-if="info.status === 'uploading'">上传中</span>
            <span v-else-if="info.status === 'wait'">等待中…</span>
            <span v-else-if="info.status === 'pause'">暂停中</span>
            <span v-else-if="info.status === 'fail'" class="task-color-red">上传失败:上传文件读取失败</span>
            <span v-else-if="info.status === 'success'" class="task-color-green">上传成功</span>
            <span v-if="info.status === 'uploading' || info.status === 'pause'" class="task-child-upload-r-progress">{{ info.progress }}%</span>
          </div>
        </div>
        <div class="task-child-upload-r-upload-msg-r">
          <!-- <div v-if="info.status === 'pause'" class="task-child-upload-r-upload-msg-r-action" @click.stop="debounceMethods(handleClickReload)">继续上传</div> -->
          <!-- <div v-if="info.status === 'wait' || info.status === 'uploading'" class="task-child-upload-r-upload-msg-r-action" @click.stop="debounceMethods(handleClickPause)">暂停上传</div> -->
          <div v-if="info.status === 'fail'" class="task-child-upload-r-upload-msg-r-action" @click.stop="debounceMethods(handleClickAgain)">重新上传</div>
          <div class="task-child-upload-r-upload-msg-r-action-del" @click.stop="debounceMethods(delUploadFile)">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from './debounce'
import { getHSToken, getExistsHash, getExistsSuccess, uploadFail } from '@/api/task/index'
import { existsHash } from '@/api/videoManagement/vedioSetting'
// import BMF from 'browser-md5-file'
import TTUploader from 'tt-uploader'
import SparkMD5 from 'spark-md5'
export default {
  mixins: [mixin],
  props: {
    configInit: {
      type: Object,
      default: () => {}
    },
    info: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: () => ''
    }
  },
  data() {
    return {
      abortCheckpoint: '',
      oss: {},
      ossBucketUrl: '',
      uploadData: {},
      percentage: 0,
      uploader: null,
      config: '',
      fileKey: '', // 文件密钥
      callbackArgs: { videoGroupId: '', type: '', tenantId: '1000', createUserId: '', md5: '', optional: '' } // 回调参数 type 1 原视频
    }
  },
  watch: {
    'info': {
      handler(val) {
        if (val.status === 'parsing') {
          this.uploadData.ranking = 1
          this.uploadData.id === val.id ? this.getMd5(this.uploadData.file) : ''
        } else {
          val.status === 'uploading' ? this.uploadData.ranking = 2 : ''
          val.status === 'wait' ? this.uploadData.ranking = 3 : ''
          val.status === 'pause' ? this.uploadData.ranking = 4 : ''
          val.status === 'fail' ? this.uploadData.ranking = 5 : ''
          val.status === 'success' ? this.uploadData.ranking = 6 : ''
          this.uploadData.status = val.status
        }
      },
      deep: true
    },
    'uploadData.status': {
      handler(val) {
        this.uploadData.status = val
        val === 'parsing' ? this.uploadData.ranking = 1 : ''
        val === 'uploading' ? this.uploadData.ranking = 2 : ''
        val === 'wait' ? this.uploadData.ranking = 3 : ''
        val === 'pause' ? this.uploadData.ranking = 4 : ''
        val === 'fail' ? this.uploadData.ranking = 5 : ''
        val === 'success' ? this.uploadData.ranking = 6 : ''
        if (val === 'uploading') {
          this.fileKey ? this.handleClickStart() : this.startUpload(this.uploadData.file)
        }
      },
      deep: true
    }
  },
  created() {
    this.config = this.configInit
    console.log('******************:', this.configInit)
    this.uploadData = this.info
    this.initUpload(this.uploadData.filename) // 初始化火山引擎
    if (this.uploadData.status === 'parsing') {
      this.getMd5(this.uploadData.file)
    }
  },
  mounted() {
    console.log('~~~~~~~~~~~~~~~~~: ', this.info)
    // this.uploadFail()
    if (this.info.origin === '原视频') {
      this.callbackArgs.type = 1
    }
    this.info.optional !== '' ? this.callbackArgs.optional = this.info.optional : ''
    this.callbackArgs.videoGroupId = this.info.originId
    this.callbackArgs.createUserId = this.$store.getters.userInfo.userId
  },
  destroyed() {
    this.uploader = null
    this.fileKey = ''
  },
  methods: {
    getMd5(file) {
      if (this.uploadData.md5) {
        // console.log('存在md5', this.uploadData.md5)
        this.callbackArgs.md5 = this.uploadData.md5
        this.uploadData.status = 'parsing-wait'
        this.uploadData.ranking = 1
        this.getExistsSuccess({ videoGroupId: this.uploadData.originId })
        // this.getExistsHash({ md5: this.uploadData.md5, videoGroupId: this.uploadData.originId })
      } else {
        // console.log('不存在md5', this.uploadData.md5)
        // MD5的实现方式
        // const bmf = new BMF()
        // bmf.md5(
        //   file,
        //   (err, md5) => {
        //     console.log('原md5----', md5)
        //     if (err) {
        //       console.log('md5校验异常反馈', err)
        //       this.uploadData.status = 'fail'
        //       this.uploadData.ranking = 5
        //       this.uploadFail()
        //       this.$emit('fail', this.uploadData)
        //     } else {
        //       this.uploadData.md5 = md5
        //       this.callbackArgs.md5 = md5
        //       console.log('this.callbackArgs', this.callbackArgs)
        //       this.uploadData.status = 'parsing-wait'
        //       this.uploadData.ranking = 1
        //       this.getExistsSuccess({ videoGroupId: this.uploadData.originId })
        //     }
        //   },
        //   progress => {
        //   // console.log('progress number:', progress)
        //   }
        // )
        console.log('开始md5---', new Date())
        this.doIncremental(file)
        // const fileReader = new FileReader()
        // const spark = new SparkMD5.ArrayBuffer()
        // // 获取文件二进制数据
        // fileReader.readAsArrayBuffer(file)
        // fileReader.onload = function (e) {
        //   spark.append(e.target.result)
        //   const md5 = spark.end()
        //   if (md5) {
        //     console.log('结束md5---', new Date())
        //     console.log('SparkMD5--计算->', md5)
        //     that.uploadData.md5 = md5
        //     that.callbackArgs.md5 = md5
        //     console.log('this.callbackArgs', that.callbackArgs)
        //     that.uploadData.status = 'parsing-wait'
        //     that.uploadData.ranking = 1
        //     that.getExistsSuccess({ videoGroupId: that.uploadData.originId })
        //   } else {
        //     console.log('md5校验异常反馈', md5)
        //     that.uploadData.status = 'fail'
        //     that.uploadData.ranking = 5
        //     that.uploadFail()
        //     that.$emit('fail', that.uploadData)
        //   }
        // }
      }
    },

    doIncremental(file) {
      const _this = this
      let running = false // running用于判断是否正在计算md5
      // 这里假设直接将文件选择框的dom引用传入
      if (running) {
        return
      }
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
      fileReader.onload = function(e) {
        console.log('Read chunk number (currentChunk + 1) of  chunks ')
        spark.appendBinary(e.target.result) // append array buffer
        currentChunk += 1
        if (currentChunk < chunks) {
          loadNext()
        } else {
          running = false
          console.log('Finished loading!')
          const md5 = spark.end()
          console.log('最新演算md5', md5)
          if (md5) {
            console.log('结束md5---', new Date())
            console.log('SparkMD5--计算->', md5)
            _this.uploadData.md5 = md5
            _this.callbackArgs.md5 = md5
            console.log('this.callbackArgs', _this.callbackArgs)
            _this.uploadData.status = 'parsing-wait'
            _this.uploadData.ranking = 1
            _this.getExistsSuccess({ videoGroupId: _this.uploadData.originId })
          } else {
            console.log('md5校验异常反馈', md5)
            _this.uploadData.status = 'fail'
            _this.uploadData.ranking = 5
            _this.uploadFail()
            _this.$emit('fail', _this.uploadData)
          }
          return spark.end() // 完成计算，返回结果
        }
      }
      fileReader.onerror = function() {
        running = false
        console.log('something went wrong')
      }
      function loadNext() {
        var start = currentChunk * chunkSize
        var end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsBinaryString(blobSlice.call(file, start, end))
      }
      running = true
      loadNext()
    //   console.log("spark============", spark);
    //   console.log("*************", spark.end());
    },
    // 获取视频组当前MD5信息
    getExistsHash(e) {
      getExistsHash(e)
        .then((res) => {
          // res.data ? console.log('重复上传') : this.getExistsSuccess({ videoGroupId: e.videoGroupId })
          if (res.data) {
            this.uploadData.progress = 100
            this.uploadData.status = 'success'
            this.uploadData.ranking = 6
            this.uploadData.callbackArgs = []
            this.$emit('success', this.uploadData)
          } else {
            this.getExistsSuccess({ videoGroupId: e.videoGroupId })
          }
        })
        .catch(() => {
        })
    },
    // 获取视频组当前视频数量
    getExistsSuccess(e) {
      const that = this
      getExistsSuccess(e)
        .then((res) => {
          if (res.data < 50) {
            if (that.info.origin === '原视频') {
              getExistsHash({ md5: that.uploadData.md5, videoGroupId: that.uploadData.originId })
                .then((res) => {
                  if (res.data) {
                    that.uploadData.progress = 100
                    that.uploadData.status = 'success'
                    that.uploadData.ranking = 6
                    that.$emit('success', that.uploadData)
                    // that.uploadData.status = 'fail'
                    // that.uploadData.ranking = 5
                    // that.uploadFail()
                    // that.$emit('fail', that.uploadData)
                  } else {
                    that.uploadData.status = 'uploading'
                    that.uploadData.ranking = 2
                  }
                })
                .catch(() => {
                })
            } else if (that.info.origin === '半成品视频' || that.info.origin === '成品视频') {
              existsHash({ teacherId: that.info.optional.teacherId, type: that.info.optional.type, md5: that.uploadData.md5 }).then((res) => {
                if (res.data) {
                  that.uploadData.progress = 100
                  that.uploadData.status = 'success'
                  that.uploadData.ranking = 6
                  that.$emit('success', that.uploadData)
                  // that.uploadData.status = 'fail'
                  // that.uploadData.ranking = 5
                  // that.uploadFail()
                  // that.$emit('fail', that.uploadData)
                } else {
                  that.uploadData.status = 'uploading'
                  that.uploadData.ranking = 2
                }
              })
                .catch(() => {
                })
            }
          } else {
            this.uploadData.status = 'fail'
            this.uploadData.ranking = 5
            this.uploadFail()
            this.uploadData.callbackArgs = []
            this.$emit('fail', this.uploadData)
          }
        })
        .catch(() => {
        })
    },
    uploadFail() {
      // console.log('失败回调方法', this.uploadData)
      const formdata = new FormData()
      formdata.append('videoName', this.uploadData.filename)
      formdata.append('videoType', this.info.optional.type)
      // formdata.append('videoGroupName', this.info.optional.videoGroupName)
      uploadFail(formdata)
        .then((res) => {
          console.log('失败回调', res)
        })
        .catch(() => {
        })
    },
    // 开始上传
    startUpload(file) {
    //   this.loading = true
      // console.log('file', file)
      getHSToken()
        .then((res) => {
          console.log('res', res)
          this.config.AccessKeyID = res.data.accessKeyId
          this.config.SecretAccessKey = res.data.secretAccessKey
          this.config.SessionToken = res.data.sessionToken
          this.config.ExpiredTime = res.data.expiredTime
          this.config.CurrentTime = res.data.currentTime
          this.loading = false
          this.vid = ''
          // const fileKey = this.addFile(file)
          // this.uploader.start(fileKey)
          this.addFile(file)
          this.handleClickStart()
          this.startTime = new Date().getTime()
        })
        .catch(() => {
        //   this.loading = false
        })
    },
    // 添加视频文件
    addFile(file) {
      this.fileKey = this.uploader.addFile({
        file: file, // 上传的文件对象
        stsToken: {
          AccessKeyID: this.config.AccessKeyID,
          SecretAccessKey: this.config.SecretAccessKey,
          SessionToken: this.config.SessionToken,
          CurrentTime: this.config.CurrentTime,
          ExpiredTime: this.config.ExpiredTime
        }, // 上传签名
        callbackArgs: this.callbackArgs
      })
      // console.log('上传签名---<>', this.fileKey) // file_1495442273603_999031 （类似格式）
      this.uploadData.fileKey = this.fileKey
      // return this.fileKey
    },
    // 深度拷贝
    deepClone(target) {
      return JSON.parse(JSON.stringify(target))
    },
    // 初始化
    initUpload(fileName) {
      const that = this
      this.uploader = new TTUploader({
        userId: this.config.userId, // 建议设置能识别用户的唯一标识id，用于上传出错时排查问题，不要传入非 ASCII编码
        appId: 401394, // 在视频点播-应用服务中创建的AppID，视频点播的质量监控等都是以这个参数来区分业务方的，务必正确填写
        // 仅视频/普通文件上传时需要配置
        videoConfig: {
          spaceName: this.config.spaceName, // 在视频点播中申请的点播空间名
          processAction: [
            {
              name: 'AddOptionInfo', // 获取视频信息
              input: {
                Title: fileName
              }
            }
          ]
        }
      })
      this.uploader.on('complete', (infor) => {
        console.log('火山上传完成' + this.uploadData.filename)
        // console.log(infor.uploadResult)
        // this.vid = infor.uploadResult.Vid
        // 二次校验
        getExistsSuccess({ videoGroupId: this.uploadData.originId })
          .then((res) => {
            if (res.data < 50) {
              that.uploadData.progress = 100
              that.uploadData.status = 'success'
              that.uploadData.ranking = 6
              that.uploadData.callbackArgs = infor.uploadResult
              that.$emit('success', that.uploadData)
            } else {
              if (that.info.origin === '原视频') {
                getExistsHash({ md5: that.uploadData.md5, videoGroupId: that.uploadData.originId })
                  .then((res) => {
                    if (res.data) {
                      that.uploadData.progress = 100
                      that.uploadData.status = 'success'
                      that.uploadData.ranking = 6
                      that.uploadData.callbackArgs = infor.uploadResult
                      that.$emit('success', that.uploadData)
                    } else {
                      that.uploadData.status = 'fail'
                      that.uploadData.ranking = 5
                      that.uploadFail()
                      that.$emit('fail', that.uploadData)
                    }
                  })
                  .catch(() => {
                  })
              } else if (that.info.origin === '半成品视频' || that.info.origin === '成品视频') {
                existsHash({ teacherId: that.info.optional.teacherId, type: that.info.optional.type, md5: that.uploadData.md5 }).then((res) => {
                  if (res.data) {
                    that.uploadData.progress = 100
                    that.uploadData.status = 'success'
                    that.uploadData.ranking = 6
                    that.$emit('success', that.uploadData)
                  // that.uploadData.status = 'fail'
                  // that.uploadData.ranking = 5
                  // that.uploadFail()
                  // that.$emit('fail', that.uploadData)
                  } else {
                    that.uploadData.status = 'fail'
                    that.uploadData.ranking = 5
                  }
                })
                  .catch(() => {
                  })
              }
            }
          })
          .catch(() => {
          })
      })
      this.uploader.on('error', (infor) => {
        console.log('上传文件错误原因', infor)
        console.log('火山上传失败1' + this.uploadData.filename)
        // console.log('上传文件错误', infor.extra)
        this.uploadData.status = 'fail'
        this.uploadData.ranking = 5
        this.uploadFail()
        this.$emit('fail', this.uploadData)
      })
      this.uploader.on('progress', (infor) => {
        // console.log('上传文件进度:', infor.percent)
        this.uploadData.progress = infor.percent
      })
    },
    // 指定进度条文字内容
    progressFormat(percentage) {
      return ''
    },
    // 移除某个待上传的文件（取消该文件的上传）。其中，key值从addFile方法中返回。
    removeFile() {
      const key = this.uploadData.fileKey
      this.uploader.removeFile(key)
      this.$emit('cancel', { index: this.index, data: this.uploadData })
    },
    // 取消某一文件的上传，同时删除暂存的上传信息。传入文件的key值，如果不传参数，则将取消所有文件的上传。
    cancel() {
      console.log('cancel到这')
      const key = this.uploadData.fileKey
      this.uploader.cancel(key)
      this.$emit('cancel', { index: this.index, data: this.uploadData })
    },
    // 暂停上传，将暂存当前文件的上传信息。传入文件的key值，如果不传参数，则将暂停所有文件的上传。
    handleClickPause() {
      const key = this.uploadData.fileKey
      this.uploader.pause(key)
      this.uploadData.status = 'pause'
      this.uploadData.ranking = 4
      this.$emit('pause', this.uploadData)
      this.$emit('fairing', true)
    },
    handleClickStart() {
      const that = this
      getExistsSuccess({ videoGroupId: that.uploadData.originId })
        .then((res) => {
          if (res.data > 49) {
            if (that.info.origin === '原视频') {
              getExistsHash({ md5: that.uploadData.md5, videoGroupId: that.uploadData.originId })
                .then((res) => {
                  if (!res.data) {
                    that.uploadData.progress = 100
                    that.uploadData.status = 'success'
                    that.uploadData.ranking = 6
                    that.uploadData.callbackArgs = []
                    that.$emit('success', that.uploadData)
                  } else {
                    that.uploadData.status = 'fail'
                    that.uploadData.ranking = 5
                    that.uploadFail()
                    that.$emit('fail', that.uploadData)
                  }
                })
                .catch(() => {
                })
            } else if (that.info.origin === '半成品视频' || that.info.origin === '成品视频') {
              existsHash({ teacherId: that.info.optional.teacherId, type: that.info.optional.type, md5: that.uploadData.md5 }).then((res) => {
                if (res.data) {
                  that.uploadData.progress = 100
                  that.uploadData.status = 'success'
                  that.uploadData.ranking = 6
                  that.$emit('success', that.uploadData)
                  // that.uploadData.status = 'fail'
                  // that.uploadData.ranking = 5
                  // that.uploadFail()
                  // that.$emit('fail', that.uploadData)
                } else {
                  that.uploadData.status = 'uploading'
                  that.uploadData.ranking = 2
                }
              })
                .catch(() => {
                })
            }
          } else {
            const key = this.fileKey
            this.uploader.start(key)
            this.$emit('start', this.uploadData)
          }
        })
        .catch(() => {
        })
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    handleClickAgain() {
      const id = this.uploadData.id
      const task = {
        id: this.getUuiD(22),
        filename: this.uploadData.filename,
        origin: this.uploadData.origin,
        originId: this.uploadData.originId,
        md5: this.uploadData.md5,
        size: this.uploadData.size,
        file: this.uploadData.file,
        status: 'wait',
        progress: 0,
        callbackArgs: [],
        fileKey: '',
        ranking: 3,
        type: this.uploadData.type,
        optional: this.uploadData.optional !== undefined ? this.uploadData.optional : ''
      }
      // console.log('新处理task', task)
      this.$emit('again', { task, id })
      this.$emit('fairing', true)
    },
    // 继续上传
    handleClickReload() {
      this.$emit('reload', this.uploadData)
      this.$emit('fairing', true)
    },
    // 删除根据当前文件上传状态 根据当前判断是等待上传还是正在上传
    delUploadFile() {
      this.uploadData.status === 'uploading' ? this.cancel() : this.removeFile()
      this.$emit('fairing', true)
    }
  }
}
</script>
<style lang="scss" scoped>
 .task-child-upload {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    display: flex;
    line-height: normal;
    margin-top: 16px;
    .task-child-upload-l {
        margin-right: 8px;
        display: flex;
        align-infos: center;
        justify-content: center;
        width: 52px;
        min-width: 52px;
        height: 52px;
        background: #ECF5FE;
        border-radius: 4px;
        position: relative;
        display: flex;
        align-items: center;
        justify-items: center;
        .task-child-upload-l-icon {
            font-size: 38px;
        }
        .task-child-upload-l-stop {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            font-size: 38px;
            display: flex;
            align-infos: center;
            justify-content: center;
            background: rgba(71,160,251,0.4);
            border-radius: 4px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
            justify-items: center;
        }
    }
    .task-child-upload-r {
        line-height: normal;
        flex: 1;
        .task-child-upload-r-info {
          display: flex;
            .task-child-upload-r-info-title {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 258px;
            }
            .task-child-upload-r-info-status {
                padding: 0 10px;
                font-size: 12px;
                font-family: MicrosoftYaHei;
                color: #333333;
                background: #EFF2F6;
                border-radius: 4px;
                border: 1px solid #E1E6ED;
                margin-left: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 95px;
            }
        }
        .task-child-upload-r-progress {
            margin-top: 8px;
        }
        .task-child-upload-r-upload-msg {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            .task-child-upload-r-upload-msg-l {
                display: flex;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #999999;
                :nth-child(2) {
                    margin-left: 16px;
                }
            }
            .task-child-upload-r-upload-msg-r {
                display: flex;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #0C6FFF;
                cursor: pointer;
                div {
                    margin-left: 10px;
                }
                .task-child-upload-r-upload-msg-r-action-del {
                    color: #F53F3F
                }
            }
        }
    }
    .task-color-green {
        color: #00B42A;
    }
    .task-color-red {
        color: #F53F3F;
    }
    .task-color-orange {
        color: #FF7D00;
    }
}
</style>
