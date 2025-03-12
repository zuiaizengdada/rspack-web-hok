<template>
  <!-- 视频复盘 -->
  <div class="page_wrap">
    <div class="page_content">
      <div class="page_wrap_left">
        <div v-if="mediaProcessTaskStatus === 1" class="videoNoData">视频转码中</div>
        <div v-else-if="mediaProcessTaskStatus === 3" class="videoNoData">视频转码失败</div>
        <!-- <div v-else-if="!videoId" class="videoNoData" /> -->
        <videoView ref="videoView" :online-num="onlineNum" :start-time="pushTime" @timeupdate="timeupdate" />
      </div>
      <div class="page_wrap_right">
        <studentInteraction ref="studentInteraction" :play-time="playTime" :start-time="pushTime" @onClick="onClick" @onClickSearch="onClickSearch" />
      </div>
    </div>

    <div class="m-t-20 cardPage">
      <interactiveTrend ref="interactiveTrend" :detail="detail" :play-time="playTime" :start-time="pushTime" @dataupdata="dataupdata" @showTimeChange="showTimeChange" />
    </div>
  </div>
</template>

<script>
import studentInteraction from './studentInteraction.vue'
import videoView from './videoView.vue'
import { getVideoDetail } from '@/api/liveVideo/index.js'
import interactiveTrend from './InteractiveTrend.vue'
export default {
  components: {
    videoView,
    studentInteraction,
    interactiveTrend
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  provide() {
    return {
      // 播放时间
      getPlayTime: this.getPlayTime,
      getLiveRoomDetail: this.getLiveRoomDetail,
      setPlayerStatus: this.setPlayerStatus,
      getPlayerStatus: this.getPlayerStatus
    }
  },
  data() {
    return {
      loading: false,
      playTime: 0,
      onlineNum: 0,
      videoId: '', // 视频ID
      url: '', // 视频的播放url
      pushTime: '', // 开始推流时间，数字直播为开播时间
      videoStatus: true, // 视频的状态：真人直播存在videoId转码的过程，为false表示没有videoId，视频转码中
      mediaProcessTaskStatus: 1, // 媒体处理任务状态 1-转码中 2-转码成功 3-转码失败
      playerStatus: '' // 视频的播放状态
    }
  },
  watch: {
    detail: {
      handler(val) {
        if (val.status === 9 && val.startTime) {
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    // 互动趋势图数据更新了，需要更新一下直播间人数
    dataupdata() {
      if (this.$refs.interactiveTrend) {
        this.onlineNum = this.$refs.interactiveTrend.getOnlineNumber(this.playTime * 1000)
      }
    },
    getPlayerStatus() {
      return this.playerStatus
    },
    setPlayerStatus(val) {
      this.playerStatus = val
    },
    init() {
      this.$refs.studentInteraction && this.$refs.studentInteraction.init()
      this.videoId = ''
      if (this.detail.liveModel === 'AI_LIVE') {
        this.videoId = this.detail.liveRoomIntelligentInfo.videoId
        this.pushTime = this.detail.startTime
      } else {
        this.videoId = this.detail.liveRoomPersonInfo.videoId
        this.pushTime = this.detail.liveRoomPersonInfo.pushTime
      }
      if (!this.videoId) return
      this.$refs.videoView && this.$refs.videoView.getSubtitleList(this.videoId)
      this.videoInit().then((res) => {
        // 根据开始时间和视频时长，计算时间维度
        this.$refs.interactiveTrend && this.$refs.interactiveTrend.init(this.pushTime, res.duration)
      })
    },
    // 初始化视频播放器
    videoInit() {
      const data = {
        videoId: this.videoId
      }
      return getVideoDetail(data.videoId).then(res => {
        console.log('获取视频状态', res)
        this.mediaProcessTaskStatus = res.data.covertStatus // 1-转码中 2-转码成功 3-转码失败
        this.url = res.data.hlsUrl ? res.data.hlsUrl : res.data.url
        this.$refs.videoView && this.$refs.videoView.play('', res.data.coverUrl, res.data)
        return res.data
      })
    },
    // 播放时间改变触发
    timeupdate(val) {
      this.playTime = val
      if (this.$refs.interactiveTrend) {
        this.onlineNum = this.$refs.interactiveTrend.getOnlineNumber(val * 1000)
      }
    },
    getPlayTime() {
      return this.playTime
    },
    getLiveRoomDetail() {
      return this.detail
    },
    // 列表点击触发
    onClick(item) {
      console.log(item)
      this.$refs.videoView && this.$refs.videoView.setplay(Number(item.time) / 1000, 'pause')
    },
    // 查询的时候触发滚动到置顶位置
    onClickSearch(item) {
      this.$refs.videoView && this.$refs.videoView.setplay(Number(item.time) / 1000, 'pause')
    },
    // 互动趋势图点击的时候改变视频的时间
    showTimeChange(val) {
      console.log(val, 'val')
      this.$refs.videoView && this.$refs.videoView.setplay(Number(val), 'pause')
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  .page_content {
    display: flex;
    .page_wrap_left {
      flex: 1 0 0;
      height: 674px;
      margin-right: 12px;
      padding: 15px;
      border-radius: 8px;
      background: #ffffff;
      position: relative;
      .videoNoData {
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 998;
      }
    }
    .page_wrap_right {
      width: 507px;
      height: 674px;
      border-radius: 8px;
      background: #ffffff;
      overflow: hidden;
    }
  }
}
</style>
