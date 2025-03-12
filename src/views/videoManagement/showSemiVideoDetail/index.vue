<template>
  <div class="page_wrap">
    <layoutTitled :disabled="!videoId || videoId.length === 0" :title="videoGroupName" :loading="loading" @onClick="handleClickGenerateVideo" />
    <div class="subtitleEditor">
      <!-- 左侧 -->
      <div class="subtitle_editor_Left">
        <div class="projectView">
          <projectd :data="videoList" :loading="loading" @changePlayUrl="changePlayUrl" />
        </div>
        <div class="player">
          <playerd ref="playerd" :url="url" :video-name="videoName" :video-obj="videoObj" :video-id="videoId" @timeupdate="timeupdate" />
        </div>
      </div>
      <!-- 右侧 -->
      <div v-loading="getSubtitleLoading" class="subtitle_editor_right">
        <!-- 右侧字幕 -->
        <subtitled
          ref="subtitle"
          :current-time="currentTime"
          :data="SubtitleList"
          :video-id="videoId"
          @changTime="changTime"
          @changeUpdateTime="changeUpdateTime"
        />
      </div>
    </div>

    <myDialogd :config="config" :success="onProductExport" @close="config.visible = false" />
  </div>
</template>

<script>
import projectd from '@/views/videoManagement/showSemiVideoDetail/component/projectd'
import playerd from '@/views/videoManagement/showSemiVideoDetail/component/playerd'
import subtitled from '@/views/videoManagement/showSemiVideoDetail/component/subtitled'
import layoutTitled from '@/views/videoManagement/showSemiVideoDetail/component/titled'
import myDialogd from '@/views/videoManagement/showSemiVideoDetail/component/dialogd'
import { getHuoshanPosterUrl } from '@/utils/index'
import {
  productExport
} from '@/api/videoManagement/subtitleEditor'
import {
  getMyProjectDesensitizationList,
  getMyMaterialListDesensitizationList,
  getDesensitizationDetails,
  getMyProjectDesensitizationSubtitle,
  getSharedDesensitizationSubtitle,
  queryByProjectId
} from '@/api/videoManagement/clipWork'
import {
  productOriginalVideoSubtitleList
} from '@/api/videoManagement/subtitleEditor'
export default {
  components: {
    projectd,
    playerd,
    subtitled,
    layoutTitled,
    myDialogd
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
      loading: false,
      videoObj: {}, // 当前操作的视频对象
      videoList: [], // 视频列表
      SubtitleList: [], // 字幕列表
      muteTime: 0, // 保留的静音时长
      videoId: '', // 当前操作的视频Id
      videoName: '', // 当前操作的视频名称
      videoTaskStatus: '', // 当前操作的视频状态
      videoDesensitizedProjectId: '', // 当前操作视频的脱敏工程id
      videoGroupName: '', // 脱敏工程名称
      videoType: '',
      getSubtitleLoading: false
    }
  },
  watch: {
    '$route': {
      handler(val) {
        if (val.params && val.params.videoGroupId) {
          // this.videoGroupName = this.$route.query.videoGroupName
          this.videoType = this.$route.query.videoType
          this.getVideoList()
        }
      },
      deep: true
    }
  },
  mounted() {
    // this.videoGroupName = this.$route.query.videoGroupName
    this.videoType = this.$route.query.videoType
    // 爆款标记跳转过来
    if (this.$route.query.fromType && this.$route.query.fromType === '3') {
      this.setDefalutVideo()
    } else {
      this.getVideoList()
    }
  },
  methods: {
    // 播放时长自动改变触发
    timeupdate(val) {
      this.currentTime = val
    },
    // 设置默认的这条数据
    async setDefalutVideo() {
      await this.getVideoType2List()
      console.log('执行2代码')
      const obj = this.videoList.map((item, index) => {
        if (item.desensitizationVideoId !== null) {
          if (item.desensitizationVideoId === this.$route.query.videoId) {
            item.currentFlag = true
            this.$set(item, index, item)
            return item
          } else {
            item.currentFlag = false
            this.$set(item, index, item)
            return false
          }
        } else {
          if (item.videoId === this.$route.query.videoId) {
            item.currentFlag = true
            this.$set(item, index, item)
            return item
          } else {
            item.currentFlag = false
            this.$set(item, index, item)
            return false
          }
        }
      })
      this.$nextTick(() => {
        this.changePlayUrl(obj.filter(item => item)[0])
      })
      setTimeout(() => {
        this.$refs.subtitle.changePositonSearch(this.$route.query.fromType)
      }, 1000)
    },
    // 手动改变播放时长
    changTime(val) {
      this.currentTime = val
      this.$refs.playerd.setplay(val)
    },
    // 点击生成视频
    handleClickGenerateVideo() {
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
      this.$refs.subtitle.cancelTheCommentData()
      this.url = item.videoUrl
      this.videoObj = item
      this.videoName = item.name
      this.videoId = item.videoGroupId
      this.$refs.playerd.play(item.videoUrl, item.posterUri)
      this.$refs.subtitle.init()
      this.$refs.subtitle.changeScrollTop()
      this.videoList.some(obj => {
        console.log(obj, 'obj999999999999999999999')
        if (obj.desensitizationVideoId !== null) {
          if (obj.desensitizationVideoId === item.desensitizationVideoId) {
            obj.currentFlag = true
          } else {
            obj.currentFlag = false
          }
        } else {
          if (obj.videoId === item.videoId) {
            obj.currentFlag = true
          } else {
            obj.currentFlag = false
          }
        }
      })
      if (this.videoType === '1') {
        this.getSubtitleList(item.desensitizationVideoId)
      } else if (this.videoType === '2' || this.videoType === '3') {
        this.getSubtitleList(item.videoId)
      }

      // this.getVideoList(true)
      /*
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
        this.$refs.player.play(item.videoUrl, item.posterUri)
        this.$refs.subtitle.init()
        this.getSubtitleList(item.id)
        this.loading = false
        this.getVideoList(true)
      */
    },
    // 获取脱敏视频原视频列表
    async getVideoList(ifNoGetUrl) {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.videoType === '1') {
        getMyProjectDesensitizationList(this.$route.params.videoGroupId).then(res => {
          this.loading = false
          res.data.some(item => {
            item.isDesensitization = 0
          })
          if (res.data && res.data.length > 0) {
            var isDesensitization = 0 // 判断脱敏中index
            this.videoGroupName = res.data[0].videoGroupName
            res.data.forEach((v, i) => {
              if (i === 0) {
                v.currentFlag = true
              } else {
                v.currentFlag = false
              }
              v.editShow = false
              v.loading = false
              v.posterUrl && (v.posterUri = getHuoshanPosterUrl(v.posterUrl))
              v.isDesensitization === 1 && (isDesensitization = i)
            })
            console.log(res.data, '获取的自动脱敏视频数据')
            this.videoList = res.data
            console.log(this.videoList, '32432432432432432432423432: ')
            this.videoId = res.data[isDesensitization].videoId
            this.videoName = res.data[isDesensitization].name
            this.videoObj = res.data[isDesensitization]
            !ifNoGetUrl && this.changePlayUrl(res.data[isDesensitization])
          } else {
            this.videoList = []
            this.SubtitleList = []
            this.sourceSubtitleList = []
            this.videoName = ''
            this.videoId = ''
            this.videoObj = {}
            this.videoTaskStatus = ''
            this.videoDesensitizedProjectId = ''
            this.url = ''
            this.$refs.subtitle.init()
          }
        }).catch(() => {
          this.loading = false
        })
      } else if (this.videoType === '2') {
        this.getVideoType2List(ifNoGetUrl)
      } else if (this.videoType === '3') {
        const res = await queryByProjectId(this.$route.params.videoGroupId)
        this.setData(res, ifNoGetUrl)
      }
    },
    // 设置数据
    setData(res, ifNoGetUrl) {
      this.loading = false

      if (res.data && res.data.length > 0) {
        var isDesensitization = 0 // 判断脱敏中index
        res.data.some((item, index) => {
          if (item.videoId === this.$route.query.videoId) {
            isDesensitization = index
          }
        })
        this.videoGroupName = res.data[0].videoGroupName
        res.data.forEach((v, i) => {
          v.editShow = false
          v.loading = false
          v.posterUrl && (v.posterUri = getHuoshanPosterUrl(v.posterUrl))
          v.isDesensitization === 1 && (isDesensitization = i)
        })
        // console.log(res.data, '获取的自动脱敏视频数据')
        this.videoList = res.data
        console.log('videoListd: ', this.videoList)
        this.videoId = res.data[isDesensitization].videoId
        this.videoName = res.data[isDesensitization].name
        this.videoObj = res.data[isDesensitization]
        !ifNoGetUrl && this.changePlayUrl(res.data[isDesensitization])
      } else {
        this.videoList = []
        this.SubtitleList = []
        this.sourceSubtitleList = []
        this.videoName = ''
        this.videoObj = {}
        this.videoId = ''
        this.videoTaskStatus = ''
        this.videoDesensitizedProjectId = ''
        this.url = ''
        this.$refs.subtitle.init()
      }
      console.log('执行完了1代码')
    },
    async getVideoType2List(ifNoGetUrl) {
      let res = null
      // 有sensitiveId的是从脱敏审批列表跳转过来
      if (this.$route.query.sensitiveId) {
        res = await queryByProjectId(this.$route.params.videoGroupId)
      } else {
        if (this.$route.query.isVideoList) {
          res = await getDesensitizationDetails(this.$route.params.videoGroupId)
        } else {
          res = await getMyMaterialListDesensitizationList(this.$route.params.videoGroupId)
        }
      }
      this.setData(res, ifNoGetUrl)
    },
    // 获取字幕文件列表
    async getSubtitleList(id) {
      this.muteTime = 0
      this.getSubtitleLoading = true
      if (id === '' || id === undefined) {
        return
      }
      // 共享给我跟脱敏管理查看脱敏详情
      if (this.videoType === '1') {
        getMyProjectDesensitizationSubtitle(id, this.$route.params.videoGroupId).then(res => {
          let muteTime = 0
          res.data.forEach(v => {
            if (v.isMute) {
              muteTime = muteTime + v.endTime - v.startTime
            }
            v.search_content = ''
          })
          this.muteTime = muteTime
          this.SubtitleList = res.data.filter(v => !v.isMute)
          if (res.data.length > 0) {
            this.config.updateTime = res.data[0].updateTime
          }
          this.getSubtitleLoading = false
        }).catch(() => {
          this.getSubtitleLoading = false
        })
      } else if (this.videoType === '2' || this.videoType === '3') {
        let res = null
        // 有sensitiveId的是从脱敏审批列表跳转过来
        if (this.$route.query.sensitiveId || this.videoType === '3') {
          res = await productOriginalVideoSubtitleList({ id: id })
        } else {
          res = await getSharedDesensitizationSubtitle({ id: id, type: this.$route.query.isVideoList ? 1 : 0 })
        }
        console.log('22222222222res::::', res)
        let muteTime = 0
        res.data.forEach(v => {
          if (v.isMute) {
            muteTime = muteTime + v.endTime - v.startTime
          }
          v.search_content = ''
        })
        this.muteTime = muteTime
        this.SubtitleList = res.data.filter(v => !v.isMute)
        if (res.data.length > 0) {
          this.config.updateTime = res.data[0].updateTime
        }
        this.getSubtitleLoading = false
      }
    },
    // 生成视频
    onProductExport() {
      this.config.loading = true
      const data = {
        vid: this.videoId,
        projectId: this.videoDesensitizedProjectId,
        subtitleId: this.SubtitleList[0].id
      }
      productExport(data).then(res => {
        this.config.updateTime = ''
        this.config.loading = false
        this.config.visible = false
        this.$delModal({
          tips: '视频生成进行中，可前往任务中心查看生成进度。',
          sureBtnText: '我知道了',
          sureBtnBgColor: '#1890ff',
          cancelBtnText: '',
          iconClass: 'timeFilled',
          noCancelBtn: true,
          success: () => {
            // location.reload()
            // this.$router.replace({
            //   path: '/refresh' + this.$route.fullPath
            // })
            this.getVideoList()
          }
        })
      }).catch((err) => {
        console.log(err, 'err')
        this.config.visible = false
        this.config.loading = false
      })
    },
    // 记录当前的操作时间
    changeUpdateTime(val) {
      this.config.updateTime = val
    }
  }
}
</script>

  <style lang='scss' scoped>
  .page_wrap {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    user-select: none;
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

