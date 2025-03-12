<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    append-to-body
    custom-class="dialog-body"
    :show-close="false"
    :close-on-click-modal="false"
    :press-escape="false"
    top="10vh"
    width="900px"
    height="420px"
  >
    <div slot="title" class="ss-material-box-header">
      <div>{{ title }}</div>
    </div>
    <div :style="{ width: '900px', height: '420px' }">
      <div class="choose_resource">
        <div class="window-search">
          <span class="m-r-10">上传到: </span>
          <AppTreeSelect
            v-model="form.name"
            :data="treeSelectData"
            @change="e => (form.id = e)"
          />
        </div>
        <div class="window-list">
          <el-upload
            class="upload-demo"
            drag
            :accept="accept"
            action="#"
            multiple
            :before-upload="beforeUpload"
            :http-request="fileChange"
            :show-file-list="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__text m-t-10">{{ tips }}</div>
          </el-upload>

          <div class="audioBox">
            <el-table
              :data="uploadArr"
              style="width: 100%"
              empty-text="无上传中文件"
            >
              <el-table-column prop="materialName" label="文件名" width="180">
                <template slot-scope="scope">
                  <span :title="scope.row.file.name">{{
                    scope.row.file.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="进度">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.authProgress" />
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="状态" width="180">
                <template slot-scope="scope">
                  <span>{{ statusText[scope.row.status] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status === 0"
                    type="text"
                    style="color: red"
                    @click="del(scope.row, scope.$index)"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    style="color: #e6a23c"
                    @click="pauseUpload(scope.row, scope.$index)"
                  >暂停</el-button>
                  <el-button
                    v-if="scope.row.status === 3"
                    type="text"
                    style="color: #e6a23c"
                    @click="resumeUpload(scope.row, scope.$index)"
                  >恢复上传</el-button>
                  <el-button
                    v-if="scope.row.status === 4"
                    type="text"
                    style="color: #e6a23c"
                    @click="resumeUpload(scope.row, scope.$index)"
                  >重新上传</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="awaitArr.length > 0"
              :data="awaitArr"
              style="width: 100%"
              :show-header="false"
            >
              <el-table-column prop="materialName" label="文件名" width="180">
                <template slot-scope="scope">
                  <span :title="scope.row.file.name">{{
                    scope.row.file.name
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="进度">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.authProgress" />
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="状态" width="180">
                <template slot-scope="scope">
                  <span>{{ statusText[scope.row.status] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status === 0 || scope.row.status === 2"
                    type="text"
                    style="color: red"
                    @click="del(scope.row, scope.$index)"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    style="color: #e6a23c"
                    @click="pauseUpload(scope.row, scope.$index)"
                  >暂停</el-button>
                  <el-button
                    v-if="scope.row.status === 3"
                    type="text"
                    style="color: #e6a23c"
                    @click="resumeUpload(scope.row, scope.$index)"
                  >恢复上传</el-button>
                  <el-button
                    v-if="scope.row.status === 4"
                    type="text"
                    style="color: #e6a23c"
                    @click="resumeUpload(scope.row, scope.$index)"
                  >重新上传</el-button>
                  <el-button
                    v-if="scope.row.status === 9"
                    type="text"
                    style="color: #e6a23c"
                    @click="aglinSureUp(scope.row, scope.$index)"
                  >重新添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="ss-material-box-bottom">
      <el-button @click="clearSuccess">清除成功记录</el-button>
      <el-button @click="allAglinUp">重新上传</el-button>
      <!-- <el-button v-if="!startUpload" type="primary" @click="authUpload">开始上传</el-button> -->
      <!-- <el-button type="primary" :disabled="sureLoading" @click="successFn()">确定</el-button> -->
      <el-button @click="close()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AppTreeSelect from '@/components/AppTreeSelect'
// import axios from 'axios'
import { getOssToken, refreshVideo } from '@/api/file'
import { imgBase64 } from '@/api/course'
import { material } from '@/api/course'
export default {
  components: {
    AppTreeSelect
  },
  props: {
    beforeUpload: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    treeSelectData: {
      type: Array,
      default: () => {
        return []
      }
    },
    accept: {
      type: String,
      default: '*'
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 上传类型: 1: 音频 2: 视频 3: 其他
    type: {
      type: Number,
      default: 1
    },
    // 当前分组的id
    form: {
      type: Object,
      default: () => {
        return {
          name: '',
          id: ''
        }
      }
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      startUpload: false,
      search: '',
      // 移动分组的form
      //   form: {
      //     name: '',
      //     id: ''
      //   },
      fileList: [],
      // 阿里云上传配置项
      config: {
        timeout: '',
        partSize: '',
        parallel: '',
        retryCount: '',
        retryDuration: '',
        region: 'cn-shanghai',
        userId: '1404407045427118',
        file: null,
        authProgress: 0,
        uploadDisabled: true,
        resumeDisabled: true,
        pauseDisabled: true,
        uploader: null,
        statusText: '',
        status: 0
      },
      statusText: {
        0: '等待上传',
        1: '上传中',
        2: '上传成功,正在添加分组',
        3: '暂停上传',
        4: '上传失败',
        5: '解析中',
        6: '文件处理',
        7: '已删除',
        8: '添加成功',
        9: '添加失败',
        10: '解析失败'
      },
      sureLoading: false,
      uploadArr: [], // 上传中的数组
      awaitArr: [] // 等待上传的数组
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.init()
        } else {
          this.fileList.map(v => {
            if (v.uploader) {
              v.uploader.stopUpload()
            }
          })
        }
      },
      deep: true,
      immediate: true
    },
    fileList: {
      handler(val) {
        console.log(val, 'val')
        const arr = val.filter(
          v => v.status === 1 || v.status === 5 || v.status === 0
        )
        this.sureLoading = arr.length > 0

        this.uploadArr = val.filter(v => v.status === 1) // 上传中的数组
        this.awaitArr = val.filter(v => v.status !== 1 && v.status !== 7) // 等待上传中的数组

        // 修改并发上传逻辑
        const maxConcurrent = 5 // 最大并发数
        if (this.uploadArr.length < maxConcurrent) {
          // 计算还可以启动多少个上传
          const availableSlots = maxConcurrent - this.uploadArr.length
          // 获取等待上传的文件
          const waitingFiles = val.filter(v => v.status === 0)
          // 启动等待队列中的文件上传，但不超过可用槽位数
          waitingFiles.slice(0, availableSlots).forEach(file => {
            if (file.uploader) {
              file.uploader.startUpload()
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.fileList = []
      this.startUpload = false
    },
    successFn() {
      if (!this.form.id) {
        return this.$message.error('请先选择分组')
      }
      console.log(this.fileList)
      const arr = this.fileList.filter(v => v.status === 2)
      const res = []
      arr.map(v => {
        res.push({
          dirId: this.form.id,
          materialDes: v.duration,
          materialFrameUrl: v.materialFrameUrl,
          materialName: v.file.name,
          materialSize: v.file.size,
          materialType: this.type,
          materialUrl: process.env.VUE_APP_UPLOAD_URL + v.uploadInfo.object,
          videoId: v.uploadInfo.videoId
        })
      })
      if (res.length === 0) {
        this.visible = false
      } else {
        this.success && this.success(res, this.form)
        this.visible = false
      }
    },
    fileChange(e) {
      console.log(e)
      const _this = this
      const selectFile = e.file
      if (!this.form.id) {
        return this.$message.error('请先选择分组')
      }
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      var userData = '{"Vod":{}}'
      this.fileList.push({
        ...this.config,
        file: selectFile,
        dirId: this.form.id,
        materialType: this.type,
        status: 5
      })
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      if (_this.type === 2) {
        const formData = new FormData()
        formData.append('file', selectFile)
        var fileUrl = URL.createObjectURL(selectFile)
        var videoEl = document.createElement('VIDEO')
        videoEl.src = fileUrl
        videoEl.setAttribute('crossOrigin', 'Anonymous')
        videoEl.setAttribute('controls', 'controls')
        videoEl.setAttribute('autoplay', 'autoplay')
        videoEl.volume = 0
        videoEl.addEventListener('loadeddata', async () => {
          const duration = videoEl.duration || 0 // 时长
          const canvas = document.createElement('canvas')
          canvas.width = videoEl.videoWidth * 0.8
          canvas.height = videoEl.videoHeight * 0.8
          canvas
            .getContext('2d')
            .drawImage(videoEl, 0, 0, canvas.width, canvas.height) // 绘制canvas
          const materialFrameUrl = canvas.toDataURL('image/jpeg')
          self.materialFrameUrl = materialFrameUrl
          self.duration = duration
          try {
            const res = await imgBase64({ base64Data: materialFrameUrl })
            console.log(res, 'resimgBase64')
            self.materialFrameUrl = res.data.url
            self.status = 6
            if (self.uploader) {
              self.uploader.stopUpload()
              self.authProgress = 0
              self.statusText = ''
            }
            self.uploader = this.createUploader(self)
            self.uploader.addFile(selectFile, null, null, null, userData)
          } catch (err) {
            self.status = 10
          }
        })
      } else if (_this.type === 1) {
        const formData = new FormData()
        formData.append('file', selectFile)
        var url = URL.createObjectURL(selectFile)
        var audioElement = new Audio(url)
        audioElement.addEventListener('loadedmetadata', _event => {
          const duration = parseInt(audioElement.duration || 0)
          self.duration = duration
          self.status = 6
          if (self.uploader) {
            self.uploader.stopUpload()
            self.authProgress = 0
          }
          self.uploader = this.createUploader(self)
          self.uploader.addFile(selectFile, null, null, null, userData)
        })
      }
    },
    createUploader(self) {
      const _this = this
      // eslint-disable-next-line no-undef
      const uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        localCheckpoint: true,
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
          self.status = 0
          console.log('等待上传', uploadInfo)
          console.log('addFileSuccess: ' + uploadInfo.file.name)
          // if (_this.startUpload) {
          // self.uploader.startUpload()
          // }
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          console.log(uploadInfo, '开始上传')
          self.uploadInfo = uploadInfo
          self.status = 1
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          // const params = {
          //   filename: uploadInfo.file.name
          // }

          // getOssToken(params)
          //   .then(({ data }) => {
          //     console.log(data, 'data')
          //     const uploadAuth = data.UploadAuth
          //     const uploadAddress = data.UploadAddress
          //     const videoId = data.VideoId
          //     uploader.setUploadAuthAndAddress(
          //       uploadInfo,
          //       uploadAuth,
          //       uploadAddress,
          //       videoId
          //     )
          //   })
          //   .catch(err => {
          //     self.status = 4
          //     this.$message.error('文件名不符合规范,请修改')
          //     console.log(err, '获取ossToken失败')
          //   })

          if (!uploadInfo.videoId) {
            const params = {
              filename: uploadInfo.file.name
            }
            getOssToken(params)
              .then(({ data }) => {
                console.log(data, 'data')
                const uploadAuth = data.UploadAuth
                const uploadAddress = data.UploadAddress
                const videoId = data.VideoId
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                )
              })
              .catch(err => {
                self.status = 4
                console.log(err, '获取ossToken失败')
              })
          } else {
            refreshVideo(uploadInfo.videoId)
              .then(({ data }) => {
                const uploadAuth = data.UploadAuth
                uploader.resumeUploadWithAuth(uploadAuth)
                console.log(data, '获取刷新的凭证数据')
                const uploadAddress = data.UploadAddress
                const videoId = data.VideoId
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                )
              })
              .catch(err => {
                self.status = 4
                console.log(err, '获取ossToken失败')
              })
          }
        },
        // 文件上传成功
        onUploadSucceed: async function (uploadInfo) {
          console.log(
            'onUploadSucceed: ' +
              uploadInfo.file.name +
              ', endpoint:' +
              uploadInfo.endpoint +
              ', bucket:' +
              uploadInfo.bucket +
              ', object:' +
              uploadInfo.object
          )
          self.status = 2
          console.log('上传成功', uploadInfo)
          self.uploadInfo = uploadInfo
          const list = [
            {
              dirId: self.dirId,
              materialDes: self.duration,
              materialFrameUrl: self.materialFrameUrl,
              materialName: self.file.name,
              materialSize: self.file.size,
              materialType: _this.type,
              materialUrl:
                process.env.VUE_APP_UPLOAD_URL + self.uploadInfo.object,
              videoId: self.uploadInfo.videoId
            }
          ]
          _this.sureSend(list, self)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('上传失败', uploadInfo, code, message)
          console.log(
            'onUploadFailed: file:' +
              uploadInfo.file.name +
              ',code:' +
              code +
              ', message:' +
              message
          )
          self.status = 4
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          console.log(
            'Canceled file: ' +
              uploadInfo.file.name +
              ', code: ' +
              code +
              ', message:' +
              message
          )
          self.status = 3
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          console.log(
            'onUploadProgress:file:' +
              uploadInfo.file.name +
              ', fileSize:' +
              totalSize +
              ', percent:' +
              Math.ceil(progress * 100) +
              '%'
          )
          const progressPercent = Math.ceil(progress * 100)
          self.authProgress = progressPercent
          self.status = 1
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          // const refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
          // axios.get(refreshUrl).then(({ data }) => {
          //   const uploadAuth = data.UploadAuth
          //   uploader.resumeUploadWithAuth(uploadAuth)
          //   console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
          // })
          // self.statusText = '文件超时...'
          refreshVideo(uploadInfo.videoId).then(({ data }) => {
            const uploadAuth = data.UploadAuth
            uploader.resumeUploadWithAuth(uploadAuth)
            // const uploadAddress = data.UploadAddress
            // const videoId = data.VideoId
            // uploader.resumeUploadWithAuth(uploadInfo, uploadAuth, uploadAddress, videoId)
          })
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
          console.log('onUploadEnd: 文件上传完毕')
          // self.statusText = 2
        },
        beFoUploadFaild: function (uploadInfo) {
          console.log('失败', uploadInfo)
          self.status = 4
        }
      })
      return uploader
    },
    close() {
      this.visible = false
      // this.success && this.success()
      //   this.$emit('input', false)
    },
    // 开始上传
    authUpload() {
      if (!this.form.id) {
        return this.$message.error('请先选择分组')
      }
      if (this.fileList.length === 0) {
        return this.$message.error('请先选择文件')
      }
      this.startUpload = true
      this.fileList.map(v => {
        if (v.status === 0 && v.uploader !== null) {
          v.uploader.startUpload()
          v.uploadDisabled = true
          v.pauseDisabled = false
          v.status = 1
        }
      })
    },
    // 取消上传
    cancelRequest() {},
    // 暂停上传
    pauseUpload(row, index) {
      console.log(row, 'row')
      row.status = 3
      if (row.uploader !== null) {
        row.uploader.stopUpload()
        console.log('暂停')
        row.resumeDisabled = false
        row.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload(row, index) {
      console.log(row.uploader)
      if (row.uploader !== null) {
        row.uploader.startUpload()
        row.resumeDisabled = true
        row.pauseDisabled = false
      }
    },
    // 删除
    del(row, index) {
      if (row.uploader !== null) {
        row.uploader.deleteFile(0)
      }
      console.log(row, 'row')
      row.status = 7
      // this.fileList.splice(index, 1)
    },
    align(row, index) {
      console.log(row, 'row')
      if (row.uploader) {
        const params = {
          filename: row.uploadInfo.file.name
        }
        getOssToken(params)
          .then(({ data }) => {
            console.log(data, 'data')
            const uploadAuth = data.UploadAuth
            const uploadAddress = data.UploadAddress
            const videoId = data.VideoId
            row.uploader.setUploadAuthAndAddress(
              row.uploadInfo,
              uploadAuth,
              uploadAddress,
              videoId
            )
          })
          .catch(err => {
            self.status = 4
            console.log(err, '获取ossToken失败')
          })
      }
    },

    // 文件上传成功之后，将文件上传到我们的服务器
    sureSend(list, self) {
      this.loading = true
      const param = {
        list: list
      }
      material(param)
        .then(res => {
          console.log(res, 'res')
          self.status = 8
          this.$notify({
            title: '上传成功',
            type: 'success',
            message: `文件【${list[0].materialName}】上传成功`
          })
          // this.getList()
        })
        .catch(() => {
          self.status = 9
          this.loading = false
        })
    },
    aglinSureUp(row, index) {
      this.loading = true
      const list = [
        {
          dirId: row.dirId,
          materialDes: row.duration,
          materialFrameUrl: row.materialFrameUrl,
          materialName: row.file.name,
          materialSize: row.file.size,
          materialType: row.materialType,
          materialUrl: process.env.VUE_APP_UPLOAD_URL + row.uploadInfo.object,
          videoId: row.uploadInfo.videoId
        }
      ]
      const param = {
        list: list
      }
      material(param)
        .then(res => {
          console.log(res, 'res')
          self.status = 8
          this.$notify({
            title: '上传成功',
            type: 'success',
            message: `文件${list[0].materialName}上传成功`
          })
          // this.getList()
        })
        .catch(() => {
          self.status = 9
          this.loading = false
        })
    },
    clearSuccess() {
      console.log('清除成功记录')
      this.fileList = this.fileList.filter(v => v.status !== 8)
      // this.$set(this, 'fileList', arr)
    },
    allAglinUp() {
      console.log('重新上传')
      // const arr = this.awaitArr.filter(v => v.status !== 10)
      // this.fileList = this.fileList.concat(arr)
      this.fileList.map(v => {
        if (v.status !== 8 && v.status !== 10 && v.status !== 0) {
          v.status = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      background: #fafbfc;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #f2f2f2;
      color: #353535;
      font-size: 16px;
      font-weight: 500;
    }
    .close {
      color: #b2b2b2;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      padding: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 66px;
      background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
    }
  }
}

.choose_resource {
  .window-search {
    position: relative;
    height: 36px;
    line-height: 36px;
    margin: 20px 20px 10px 20px;
    display: flex;
  }
  .window-list {
    width: 100%;
    height: 376px;
    overflow-y: scroll;
    padding: 0 20px;
    position: relative;

    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .upload-demo {
      width: 100%;
      ::v-deep .el-upload {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
        }
      }
    }
  }
}
</style>
