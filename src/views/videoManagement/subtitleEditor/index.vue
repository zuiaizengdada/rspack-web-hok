<template>
  <div :class="{'page_wrap':true, 'disableSelection':isOld}">
    <layoutTitle :disabled="!videoId || videoId.length === 0" :camera-type="cameraType" :title="videoGroupName" :loading="loading" @onClick="handleClickValidate" @onOneClick="onOneClick" />
    <div class="subtitleEditor">
      <!-- 左侧 -->
      <div class="subtitle_editor_Left">
        <div class="projectView">
          <project :data="videoList" :camera-list="cameraList" :loading="loading" @setCancelInvalid="setCancelInvalid" @changePlayUrl="changePlayUrl" @showInput="showInput" @changeTitle="changeTitle" @setInvalid="setInvalid" />
        </div>
        <div class="player">
          <player ref="player" :url="url" :video-name="videoName" :video-id="videoId" @timeupdate="timeupdate" />
        </div>
      </div>
      <!-- 右侧 -->
      <div v-loading="getSubtitleLoading" class="subtitle_editor_right">
        <!-- 右侧字幕 -->
        <subtitle
          :id="toZimuOriginalVideoId"
          ref="subtitle"
          :current-time="currentTime"
          :data="SubtitleList"
          :is-old="isOld"
          :type="type"
          :video-id="videoId"
          :ai-hot-word-info="aiHotWordInfo"
          :ai-desensitization-info="aiDesensitizationInfo"
          :aicancel-desensitized-list="aicancelDesensitizedList"
          @resetAiHotWord="getRecommendMarkList"
          @changTime="changTime"
          @resetAiDesensitized="getRecommendSubtitleList"
          @cancelRecommen="getSubtitleCancelList"
          @changeUpdateTime="changeUpdateTime"
          @toStopVideo="toStopVideo"
          @loadZmData="getSubtitleList"
        />
      </div>
    </div>
    <generateVideo v-if="oneVideoData" :one-video-data="oneVideoData" :config="oneConfig" @success="generateProductExport" @close="oneConfig.visible = false" />
    <myDialog :config="config" :success="onProductExport" @close="config.visible = false" />
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="()=>dialogVisible = false"
    >
      <span style="color: red;">当前有审批中的字幕，此时生成视频会将字幕脱敏，是否继续生成？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClick">继续生成</el-button>
        <el-button @click="dialogVisible = false">取消生成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import project from './component/project.vue'
import player from './component/player.vue'
import subtitle from './component/subtitle.vue'
import layoutTitle from './component/title.vue'
import myDialog from './component/dialog.vue'
import generateVideo from './component/generateVideo.vue'
import { getHuoshanPosterUrl } from '@/utils/index'
import { updateVideoName } from '@/api/product/videoManager'
import { getGroupByVideoGroupId, getVideoDetail } from '@/api/videoManagement/origin'
import {
  productOriginalVideoList,
  productOriginalVideoSubtitleList,
  productOriginalVideoRenewState,
  productExport,
  qryRecommendSubtitleList,
  qryRecommendMarkList,
  getSubtitleCancelList,
  setInvalidVideo, multiCameraExport
} from '@/api/videoManagement/subtitleEditor'
export default {
  components: {
    project,
    player,
    subtitle,
    layoutTitle,
    generateVideo,
    myDialog
  },
  data() {
    return {
      currentTime: 0, // 当前播放时长
      url: '', // 当前播放的url
      disabled: true, // 是否可以点击生成视频
      config: {
        visible: false,
        title: '',
        sumTime: 0,
        loading: false,
        updateTime: ''
      },
      oneConfig: {
        visible: false,
        loading: false
      },
      cameraList: [],
      cameraType: 1,
      oneVideoData: null,
      loading: false,
      dialogVisible: false,
      isOld: false, // 是否为v2.2.10上线之前的视频
      videoList: [], // 视频列表
      aiDesensitizationInfo: null, // 是否自动脱敏
      aiHotWordInfo: null, // 热词列表
      aicancelDesensitizedList: [], // ai推荐申请取消锁定列表
      SubtitleList: [], // 字幕列表
      muteTime: 0, // 保留的静音时长
      videoId: '', // 当前操作的视频Id
      videoName: '', // 当前操作的视频名称
      videoTaskStatus: '', // 当前操作的视频状态
      videoDesensitizedProjectId: '', // 当前操作视频的脱敏工程id
      videoGroupName: '', // 脱敏工程名称
      getSubtitleLoading: false,
      isDesensitization: 0,
      originalVideoId: '',
      toZimuOriginalVideoId: '',
      type: null// 主机位，副机位
    }
  },
  watch: {
    '$route': {
      handler(val) {
        if (val.params && val.params.videoGroupId) {
          this.videoGroupName = this.$route.query.videoGroupName
          this.getVideoList()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.videoGroupName = this.$route.query.videoGroupName
    this.originalVideoId = this.$route.query.toZimuOriginalVideoId
    this.getVideoList()
    this.getCameraList()
  },
  methods: {
    async getCameraList() {
      const res = await getGroupByVideoGroupId({ videoGroupId: this.$route.params.videoGroupId })
      // 加一条全部上去
      this.cameraList = [...res.data]
      console.log('机位信息', res)
    },
    async getRecommendSubtitleList() {
      const res = await qryRecommendSubtitleList({ originalVideoId: this.videoId })
      console.log(res, '推荐脱敏')
      this.aiDesensitizationInfo = res.data
    },
    async getSubtitleCancelList() {
      const res = await getSubtitleCancelList({ originalVideoId: this.videoId })
      console.log(res, '取消脱敏')
      this.aicancelDesensitizedList = res.data
    },
    async getRecommendMarkList() {
      const res = await qryRecommendMarkList({ originalVideoId: this.videoId })
      console.log(res, '热词')
      this.aiHotWordInfo = res.data
    },
    toStopVideo() {
      this.$refs.player.forPauseVideo()
    },
    showInput(item) {
      this.videoList.forEach(v => {
        if (v.id === item.id) {
          v.showInput = true
          v.name = item.name.substring(0, item.name.lastIndexOf('.'))
        }
      })
    },
    async setCancelInvalid(item) {
      await setInvalidVideo({ originalVideoId: item.id, type: 2 })
      this.videoList.forEach(v => {
        if (v.id === item.id) {
          v.isInvalid = 0
          v.isInvalidShow = false
        }
      })
    },
    async setInvalid(item) {
      // 除了当前这个是否全部都失效了
      const arr = this.videoList.filter(v => v.id !== item.id)
      if (arr.every(v => v.isInvalid)) {
        this.$confirm('是否对该视频组全部设置为无效素材？', '提示', {
          confirmButtonText: '确定并返回',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await setInvalidVideo({ originalVideoId: item.id, type: 1 })
          this.$router.back()
        }).catch(() => {
          return
        })
      } else {
        await setInvalidVideo({ originalVideoId: item.id, type: 1 })
        this.videoList.forEach(v => {
          if (v.id === item.id) {
            v.isInvalid = true
          }
        })
        // 切换到下一个不是无效的视频
        const index = this.videoList.findIndex(v => v.id === item.id)
        if (index === this.videoList.length - 1) {
          this.isDesensitization = 0
          console.log('video1')
        } else {
          this.isDesensitization = index + 1
          console.log('video2')
        }
        this.videoId = this.videoList[this.isDesensitization].id
        this.videoName = this.videoList[this.isDesensitization].name
        this.changePlayUrl(this.videoList[this.isDesensitization])
      }
    },
    changeTitle(item, type) {
      console.log(item, type, '需要更改的数据')
      this.videoList.forEach(v => {
        if (v.id === item.id) {
          if (type === 2) {
            // 输入框发生了改变 没有发生改变不需要请求接口
            const reg = /^[\w\u4E00-\u9FA5\-\.\(\)\ （\）\:]+$/
            item.name = item.name.replace(/\s+/g, '')
            if (!reg.test(item.name)) {
              this.$message.error('填写的名称中不能有特殊字符！')
              return
            }
            const params = {
              originalVideoId: item.id,
              videoName: item.name + item.initialName.substring(item.initialName.lastIndexOf('.'), item.initialName.length)
            }
            updateVideoName(params).then(res => {
              if (res.code === 1) {
                this.$message.success('修改成功！')
              }
              item.name = item.name + item.initialName.substring(item.initialName.lastIndexOf('.'), item.initialName.length)
              item.initialName = item.name
              v.showInput = false
            })
          } else {
            if (v.showInput) {
              item.name = item.initialName
              v.showInput = false
            }
          }
        }
      })
    },
    // 播放时长自动改变触发
    timeupdate(val) {
      this.currentTime = val
    },
    // 手动改变播放时长
    changTime(val) {
      this.currentTime = val
      this.$refs.player.setplay(val)
    },
    handleClick() {
      this.dialogVisible = false
      this.handleClickGenerateVideo()
    },
    // 一键生成视频
    async onOneClick() {
      const res = await getVideoDetail({ videoGroupId: this.$route.params.videoGroupId, type: 2 })
      const newData = res.data
      // 过滤掉videoDetailReqList为null的数据
      newData.multiCameraList = newData.multiCameraList.filter(v => v.videoDetailReqList)
      newData.multiCameraList.forEach((item) => {
        item.checkAll = false
        item.isIndeterminate = false
        // 过滤掉status为1的数据
        item.videoDetailReqList = item.videoDetailReqList.filter(v => v.status !== 1)
        item.videoDetailReqList?.forEach((ele) => {
          ele.checked = false
        })
      })
      this.oneVideoData = { ...newData }
      this.oneConfig.visible = true
    },
    handleClickValidate() {
      // 判断this.SubtitleList是否有approveStatus=1的数据
      const isApproveStatus = this.SubtitleList.some(v => v.approveStatus === 1)
      if (isApproveStatus) {
        this.dialogVisible = true
        return
      }
      this.handleClickGenerateVideo()
    },
    // 点击生成视频
    handleClickGenerateVideo() {
      this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_generate')
      console.log(this.videoTaskStatus)
      this.config.loading = true
      const sum = this.$refs.subtitle.getCreatTime(this.muteTime)
      if (sum === 0) {
        return this.$message.error('视频时长为0不可生成视频!')
      }
      console.log(sum, 'sum')
      this.config.title = this.videoName
      this.config.sumTime = sum
      this.config.loading = false
      this.config.visible = true
    },
    // 播放url改变触发
    changePlayUrl(item) {
      console.log(item, 'url改变')
      this.type = item.type
      this.$refs.subtitle.cancelTheCommentData()
      this.$refs.subtitle.checkVideoReset()
      this.toZimuOriginalVideoId = item.id
      this.loading = true
      const params = {
        id: item.id
      }

      productOriginalVideoRenewState(params).then(res => {
        this.videoList.forEach(v => {
          v.isDesensitization = 0
        })
        this.SubtitleList = []
        this.sourceSubtitleList = []
        item.isDesensitization = 1
        this.videoName = item.name
        this.videoId = item.id
        this.videoTaskStatus = item.desensitizedStatus
        this.videoDesensitizedProjectId = item.desensitizedProjectId
        this.url = item.videoUrl
        // 如果当前这个视频是无效素材 则跳转到不是无效的素材里面去
        if (item.isInvalid === 1) {
          const index = this.videoList.findIndex(v => v.id === item.id)
          if (index === this.videoList.length - 1) {
            this.changePlayUrl(this.videoList[0])
            return
          } else {
            this.changePlayUrl(this.videoList[index + 1])
            return
          }
        }

        this.$refs.player.play(item.videoUrl, item.posterUri)
        this.$refs.subtitle.init()
        this.getSubtitleList(item.id)
        this.loading = false
        this.getVideoList(true)
        this.getRecommendSubtitleList()
        this.getRecommendMarkList()
        this.getSubtitleCancelList()
        this.getCameraList()
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取脱敏视频原视频列表
    getVideoList(ifNoGetUrl) {
      if (this.loading) {
        return
      }
      this.loading = true
      // this.videoList = []
      const params = {
        videoGroupId: this.$route.params.videoGroupId
      }
      productOriginalVideoList(params).then(res => {
        this.loading = false
        if (res.data && res.data.length > 0) {
          // 如果有isInvalid无效素材 则跳转到不是无效的素材里面去
          if (res.data.some(v => v.isInvalid === 1) && ifNoGetUrl) {
            this.isDesensitization = res.data.findIndex(v => v.id === this.videoId)
          } else {
            res.data.forEach((v, i) => {
              v.isDesensitization === 1 && (this.isDesensitization = i)
            })
          }
          // 机位类型
          this.cameraType = res.data[0].videoGroupType
          this.videoGroupName = res.data[0].videoGroupName
          res.data.forEach((v, i) => {
            v.editShow = false
            v.isInvalidShow = false
            v.showInput = false
            v.initialName = v.name
            v.loading = false
            v.posterUrl && (v.posterUri = getHuoshanPosterUrl(v.posterUrl))
          })
          this.videoList = res.data
          this.videoId = res.data[this.isDesensitization].id
          this.videoName = res.data[this.isDesensitization].name
          if (!ifNoGetUrl) {
            if (this.originalVideoId) {
              const obj = res.data.find(v => { return v.id === this.originalVideoId })
              this.changePlayUrl(obj)
              this.originalVideoId = ''
            } else {
              this.changePlayUrl(res.data[this.isDesensitization])
            }
          }
        } else {
          this.isDesensitization = 0
          this.videoList = []
          this.SubtitleList = []
          this.sourceSubtitleList = []
          this.videoName = ''
          this.videoId = ''
          this.videoTaskStatus = ''
          this.videoDesensitizedProjectId = ''
          this.url = ''
          this.$refs.subtitle.init()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取字幕文件列表
    getSubtitleList(id) {
      this.muteTime = 0
      this.getSubtitleLoading = true
      const params = {
        id: id
      }
      // 延迟0.5s再去执行后面的代码（修改状态之后后端结果修改需要0.5s等待）
      const _this = this
      setTimeout(() => {
        productOriginalVideoSubtitleList(params).then(res => {
          let muteTime = 0
          // res.data里面的字幕是否有dataType为2的数据
          const isOld = res.data.some(v => (v.dataType === 2 || !v.dataType))
          _this.isOld = isOld
          res.data.forEach(v => {
            if (v.isMute) {
              muteTime = muteTime + v.endTime - v.startTime
            }
            v.search_content = ''
          })
          _this.muteTime = muteTime
          _this.SubtitleList = res.data.filter(v => !v.isMute)
          _this.SubtitleList.forEach((e) => {
            e.checked = 0
          })
          if (res.data.length > 0) {
            _this.config.updateTime = res.data[0].updateTime
          }
          _this.getSubtitleLoading = false
          _this.$nextTick(() => {
            _this.$refs.subtitle && _this.$refs.subtitle.initIsDesensitized()
          })
        }).catch(() => {
          _this.getSubtitleLoading = false
        })
      }, 500)
    },
    // 一键生成视频
    async generateProductExport(list, id) {
      const arr = []
      list.forEach(v => {
        arr.push({ projectId: id, vid: v.originalVideoId })
      })
      await multiCameraExport(arr)
      this.$delModal({
        tips: '视频生成进行中，可前往任务中心查看生成进度。',
        sureBtnText: '我知道了',
        sureBtnBgColor: '#0C6FFF',
        iconClass: 'zhuyiBlue',
        noCancelBtn: true,
        success: () => {
          this.getVideoList()
        }
      })
    },
    // 生成视频
    onProductExport() {
      this.config.loading = true
      const data = {
        vid: this.videoId,
        projectId: this.videoDesensitizedProjectId,
        subtitleId: this?.SubtitleList[0]?.id || ''
      }
      productExport(data).then(res => {
        this.config.updateTime = ''
        this.config.loading = false
        this.config.visible = false
        if (this.isDesensitization === this.videoList.length - 1) {
          this.$delModal({
            tips: '视频生成进行中，可前往任务中心查看生成进度。',
            sureBtnText: '我知道了',
            sureBtnBgColor: '#0C6FFF',
            iconClass: 'zhuyiBlue',
            noCancelBtn: true,
            success: () => {
              this.getVideoList()
            }
          })
        } else {
          this.$delModal({
            tips: '视频生成进行中，可前往任务中心查看生成进度。',
            sureBtnText: '脱敏下一个',
            sureBtnBgColor: '#0C6FFF',
            cancelBtnText: '我知道了',
            iconClass: 'zhuyiBlue',
            noCancelBtn: false,
            success: () => {
              this.playNextVideo()
            },
            fail: () => {
              this.getVideoList()
            }
          })
        }
      }).catch((err) => {
        console.log(err, 'err')
        this.config.visible = false
        this.config.loading = false
      })
    },
    // 记录当前的操作时间
    changeUpdateTime(val) {
      this.config.updateTime = val
    },
    // 播放下一个视频
    playNextVideo() {
      if (this.isDesensitization === this.videoList.length - 1) {
        return
      }
      this.isDesensitization++
      console.log('video6')
      this.videoId = this.videoList[this.isDesensitization].id
      this.videoName = this.videoList[this.isDesensitization].name
      this.changePlayUrl(this.videoList[this.isDesensitization])
    }
  }
}
</script>

<style lang='scss' scoped>
.disableSelection{
  user-select: none !important;
}
.page_wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  // user-select: none;
  .subtitleEditor {
    margin-top: 68px;
    height: 100%;
    display: flex;
    .subtitle_editor_Left {
      width: 503px;
      background-color: rgba(0, 0, 0, 1);
      display: flex;
      flex-direction: column;
     .projectView {
        flex: 1 0 0;
        border-bottom: 1px solid #CBCFD3;
        // overflow: auto;
      }
      .player {
        width: 503px;
        height: 400px;
      }
    }
    .subtitle_editor_right {
      flex: 1 0 0;
      background-color: rgba(29, 32, 41, 1);
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
