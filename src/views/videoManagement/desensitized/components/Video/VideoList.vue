<template>
  <div v-if="origin!=='add'" class="video-list-container mb-4">
    <base-title :title="origin==='upload'?'视频上传':'视频列表'" class="list-title">
      <!-- <div v-if="origin==='detail'&&videoList.length" slot="right" v-permission="['video:detail:zipdownload', permsList]" class="download cursor-pointer flex items-center justify-center" @click="handleClickDownload">
        <p v-if="!downLoading">
          <i class="el-icon-download" />
          <span>打包下载</span>
        </p>
        <p v-else>
          <i class="el-icon-loading" />
          <span>下载中</span>
        </p>
      </div> -->
    </base-title>
    <div v-if="data.isMultiCamera!==2" class="wrapper flex flex-wrap justify-between">
      <el-upload
        v-if="origin==='upload'"
        ref="upload"
        class="upload-demo video-item"
        drag
        multiple
        :http-request="(e)=>{uploadVideo(e)}"
        :show-file-list="false"
        accept="video/mp4,.MXF,.mov,.m4v"
        :before-upload="viladUploadVideo"
        :on-exceed="uploadExceed"
        action="#"
        :limit="limit"
      >
        <i class="el-icon-plus block mt-6 mb-3" />
        <div class="el-upload__text" style="color:#0C6FFF">点击/拖拽上传视频</div>
        <div class="el-upload__tip">
          <span>视频格式：mp4、mov、m4v、mxf，时长不超过4小时， 一个视频组最多可上传100个视频内容</span>
        </div>
      </el-upload>
      <video-item v-for="item in videoList" :key="bigNumberFormat(item.originalVideoId)" :create-id="createUserId" :visible-status="['detail'].includes(origin)" :data="item" class="video-item" :visible-download="['detail'].includes(origin)" :visible-delete="visibleDeleteBtn(item)" @delete="videoItemDelete" @reload="videoItemReload" />
      <p v-if="['edit','detail'].includes(origin)&&videoList.length<1" style="color:#777;font-size:12px;width:100%" class=" text-center">暂无视频哟</p>
    </div>
    <!-- 多机位 -->
    <div v-else>
      <div v-for="(item,index) in multiCameraList" :key="index" class="multiCamera-item">
        <div class="multiTitle flex flex-between">
          <span>{{ item.caremaName }}</span>
          <span v-if="index>1">
            <i class="el-icon-delete deleteIcon" @click="deleteMultiCamera(item)" />
          </span>
        </div>
        <div class="wrapper flex flex-wrap justify-between" style="margin-top: 20px;">
          <el-upload
            v-if="origin==='upload'"
            :ref="`multiCameraUpload${data.multiCameraGroupId}`"
            class="upload-demo video-item"
            drag
            multiple
            :http-request="(e)=>{uploadVideo(e,item)}"
            :show-file-list="false"
            accept="video/mp4,.MXF,.mov,.m4v"
            :before-upload="viladUploadVideo"
            :on-exceed="uploadExceed"
            action="#"
            :limit="limit"
          >
            <i class="el-icon-plus block mt-6 mb-3" />
            <div class="el-upload__text" style="color:#0C6FFF">点击/拖拽上传视频</div>
            <div class="el-upload__tip">
              <span>视频格式：mp4、mov、m4v、mxf,时长不超过4小时， 一个视频组最多可上传100个视频内容</span>
            </div>
          </el-upload>
          <template v-if="item.videoDetailReqList && item.videoDetailReqList.length">
            <video-item
              v-for="ele in item.videoDetailReqList"
              :key="bigNumberFormat(ele.originalVideoId)"
              :is-host-camera="!index && showAddMultiCamera"
              :create-id="ele.createUserId"
              :visible-status="['detail'].includes(origin)"
              :data="ele"
              class="video-item"
              :visible-download="['detail'].includes(origin)"
              :visible-delete="visibleDeleteBtn(item)"
              @delete="videoItemDelete"
              @reload="videoItemReload"
            />
          </template>
          <p v-if="['edit','detail'].includes(origin)&&item.videoDetailReqList && item.videoDetailReqList.length<1" style="color:#777;font-size:12px;width:100%" class=" text-center">暂无视频哟</p>
        </div>
      </div>
      <el-button v-if="origin==='upload' && showAddMultiCamera" type="primary" icon="el-icon-plus" style="margin-top: 20px;" @click="addMultiCamera">新增机位模块</el-button>
    </div>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
import BaseTitle from '../Common/BaseTitle.vue'
import VideoItem from './VideoItem.vue'
import { urlVodExportZip } from '@/utils/zip'
import { videoDownLoadRecord, existsSuccessCount, cameraAdd, cameraDelete } from '@/api/videoManagement/origin'
export default {
  components: {
    BaseTitle,
    VideoItem
  },
  props: {
    origin: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      videoList: [],
      multiCameraList: [],
      videoGroupName: '',
      downLoading: false,
      videoGroupId: '',
      createUserId: '',
      permsList: this.$route.meta.permsList || [],
      limit: 100,
      showAddMultiCamera: false,
      hasAircraftVideo: false // 有副机位视频
    }
  },
  watch: {
    data(val) {
      const { videoDetailReqList, title, videoGroupId, createUserId, multiCameraList } = val
      this.videoList = videoDetailReqList
      if (multiCameraList) {
        // if (!multiCameraList[0].videoDetailReqList) {
        //   this.multiCameraList = multiCameraList.slice(0, 1)
        //   this.showAddMultiCamera = false
        // } else {
        this.multiCameraList = multiCameraList
        this.showAddMultiCamera = true
        // 判断multiCameraList数组第二项开始是否有videoDetailReqList字段
        this.showAddMultiCamera = multiCameraList.some((item, index) => {
          return index > 0 && item.videoDetailReqList
        })
        // }
      }
      this.videoGroupName = title
      this.videoGroupId = videoGroupId
      this.createUserId = createUserId
      this.getSuccessCount()
    }
  },
  mounted() {
    eventBus.$on('successTaks', (msg) => {
      setTimeout(() => {
        this.$emit('update')
      }, 1500)
    })
    eventBus.$on('failTaks', (msg) => {

    })
  },
  destroyed() {
    eventBus.$off('successTaks')
    eventBus.$off('failTaks')
  },
  methods: {
    async getSuccessCount() {
      const { data } = await existsSuccessCount({ videoGroupId: this.videoGroupId }) || 0
      this.limit = data === 100 ? 0 : 100 - data
    },
    async addMultiCamera() {
      await cameraAdd({ videoGroupId: this.videoGroupId })
      this.$emit('update')
    },
    async deleteMultiCamera(item) {
      console.log(item, 'item')
      if (item.videoDetailReqList && item.videoDetailReqList.length) {
        this.$message.error('请先移除机位中的视频，再移除机位。')
        return
      }
      // 二次确认
      this.$confirm('是否删除当前机位模块?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await cameraDelete({ multiCameraGroupId: item.multiCameraGroupId })
        this.$emit('update')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async handleClickDownload() {
      if (!this.downLoading) {
        const list = []
        this.videoList.forEach((item) => {
          list.push({ src: item.videoUrl, name: item.name })
        })

        this.downLoading = true
        try {
          await urlVodExportZip(list, this.videoGroupName)
        } catch (err) {
          this.$message.error('下载失败,请重试')
          this.downLoading = false
        }
        await videoDownLoadRecord({
          originalVideoId: '',
          videoGroupId: this.videoGroupId,
          videoType: 1
        })
        this.downLoading = false
      }
    },
    uploadVideo(e, data) {
      console.log(e, data, 3333)
      console.log(this.videoGroupName, 'LLLLLLLLLLLLLLLLLLLLLLLLL:')
      const obj = {
        file: e.file, // 文件 必传
        type: 'file_video', // 上传文件 区分file_video或file_all（文件上传）和clip（剪辑） 必传
        origin: '原视频', // 任务标识 原视频、成品视频、半成品视频    必传
        originId: this.videoGroupId // 标识id，视频组 必传
      }
      if (data && data.multiCameraGroupId) {
        obj.multiCameraGroupId = data.multiCameraGroupId
      }
      eventBus.$emit('sendTaskMessage', [obj]) // 任务推送
      eventBus.$emit('visibleTaks', true) // 打开任务中心
      if (data && data.multiCameraGroupId) {
        // this.$refs[`multiCameraUpload${data.multiCameraGroupId}`].clearFiles()
      } else {
        this.$refs.upload.clearFiles()
      }
    },
    viladUploadVideo(file) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const videoElement = document.createElement('video')
        // const isMp4 = file.type === 'video/mp4'
        const name = file.name.replace(/\s+/g, '')
        const reg = /^[\w\u4E00-\u9FA5\-\.\(\)\ （\）\:]+$/
        // const reg = /\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\u300a|\u300b|\u3010|\u3011|\u007e/
        const { data } = await existsSuccessCount({ videoGroupId: this.videoGroupId }) || 0
        // else if (!isMp4) {
        //   this.$message.error('请上传MP4格式的视频文件')
        //   this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请上传MP4格式的视频文件', params: { type: 1 } })
        //   reject()
        // }
        if (!reg.test(name)) {
          this.$message.error('请检查上传名字格式')
          this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请检查上传名字格式', params: { type: 1 } })
          reject()
        } else if (data === 100) {
          this.$message.error('当前视频组最多能上传100个视频内容')
          this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '当前视频组最多能上传100个视频内容', params: { type: 1 } })
          reject()
        } else {
          // const isLt20G = file.size / 1024 / 1024 / 1024 < 20
          // // 判断后缀名是是不是MXF或者mxf
          // const fileType = file.name.split('.').pop()
          // console.log(fileType, 'fileType')
          // if (fileType === 'MXF' || fileType === 'mxf') {
          //   if (!isLt20G) {
          //     this.$message.error('请上传小于20G的视频文件')
          //     this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请上传小于20G的视频文件', params: { type: 1 } })
          //     reject()
          //   } else {
          //     resolve()
          //   }
          // }
          videoElement.addEventListener('loadedmetadata', (_event) => {
            console.log(_event, videoElement.videoWidth, videoElement.videoHeight, '视频信息2。。。。')
            // 限制不能超过4个小时
            console.log('duration', videoElement.duration)
            const isLt4H = videoElement.duration <= 14400
            if (!isLt4H) {
              this.$message.error('请上传小于4小时的视频文件')
              this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请上传小于4小时的视频文件', params: { type: 1 } })
              reject()
            }
            // const isHDV = (videoElement.videoWidth === 1920 && videoElement.videoHeight === 1080) || (videoElement.videoWidth === 1080 && videoElement.videoHeight === 1920)
            // 限制视频分辨率为720P-2160P之间
            // const isHDV = (videoElement.videoWidth >= 1280 && videoElement.videoHeight >= 720) && (videoElement.videoWidth <= 3840 && videoElement.videoHeight <= 2160)
            // if (!isLt20G) {
            //   this.$message.error('请上传小于20G的视频文件')
            //   this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请上传小于20G的视频文件', params: { type: 1 } })
            //   reject()
            // }
            // else if (!isHDV) {
            //   this.$message.error('请上传1080P的视频文件')
            //   this.$taskCenter.addTask({ task: '1', file, origin: '原视频', errorReason: '请上传1080P的视频文件', params: { type: 1 } })
            //   reject()
            // }
            resolve()
          })
          videoElement.addEventListener('error', (_event) => {
            console.log(_event, '视频信息。。。。')
            resolve()
          })
          videoElement.src = _URL.createObjectURL(file)
          // resolve()
          // console.log(videoElement, '文件内容')
        }
      }).then(() => {
        return file
      }, () => {
        return Promise.reject()
      })
    },
    async uploadExceed(files) {
      const { data } = await existsSuccessCount({ videoGroupId: this.videoGroupId }) || 0
      if (data + files.length > 100) {
        this.$message.error('当前视频组最多能上传100个视频内容')
      }
    },
    videoItemDelete() {
      this.$emit('update')
    },
    videoItemReload() {
      this.$emit('update')
    },
    bigNumberFormat(num) {
      // eslint-disable-next-line no-undef
      return String(BigInt(num))
    },
    visibleDeleteBtn(data) {
      return ['upload', 'edit'].includes(this.origin) && !data.isShare
    }
  }
}
</script>
<style lang="scss" scoped>
.video-list-container{
  min-width: 1280px;;
}
.multiCamera-item{
  border-bottom: 2px solid #e3e3e3;
  margin-top: 20px;
}
.deleteIcon{
  font-size: 20px;
  color: #F1330D;
  cursor: pointer;
}
.multiTitle{
 color: #333333;
 font-size: 16px;
 font-weight: 600;
}
.list-title{
  position: relative;
  line-height: 1;
  margin-bottom:20px;
  .download{
    border-radius: 4px;
    border: 1px solid #0C6FFF;
    position:absolute;
    color:#0C6FFF;
    font-size:14px;
    width: 108px;
    height: 32px;
    top:-5px;
    right:0;
    i{
      margin-right:6px;
    }
  }
}
.video-item{
  width: calc((100% - 60px) / 4);
  margin: 0 20px 20px 0;
  &:last-child{
    margin-right:auto;
  }
  &:nth-child(4n+4){
    margin-right:0
  }
}

 .video-item  ::v-deep .el-upload-dragger{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #FBFCFE;
    width:100%;
    height: 100%;
    border-radius: 6px;
    border: 1px dashed #E1E6ED;
    padding-bottom:20px;

  }
 .video-item  ::v-deep .el-upload.el-upload--text{
    width:100%;
    height: 100%;
    min-height: 180px;
  }
  .el-upload__tip{
      font-size:12px;
      line-height: 20px;
      color:#999;
      padding:0 20px;
  }

</style>

