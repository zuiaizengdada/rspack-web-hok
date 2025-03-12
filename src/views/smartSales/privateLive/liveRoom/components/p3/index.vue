<template>
  <!-- p3区域 -->
  <div class="p3_content">
    <div class="videoPlayer">
      <playerVideo />
    </div>
    <div class="p3info overflowOuto">
      <div v-if="liveRoomDetail.liveModel === 'AI_LIVE' && liveRoomDetail.status === 1" class="videoTimeView">
        {{ playTime | renderPlayTime }} / {{ liveRoomDetail.totalTime | renderTotalTime }}
      </div>
      <userInfo v-if="chatUser.type === 1" />
      <liveRoomInfo v-else />
    </div>
  </div>
</template>

<script>
// import player from './player.vue'
import playerVideo from './playerVideo/index2.vue'
import liveRoomInfo from './liveRoomInfo.vue'
import userInfo from './userInfo.vue'
import { mapState } from 'vuex'
export default {
  components: {
    liveRoomInfo,
    userInfo,
    playerVideo
  },
  filters: {
    renderPlayTime(value) {
      if (!value || typeof value !== 'number') {
        return '00:00:00'
      } else {
        const result = parseInt(value)
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return h + ':' + m + ':' + s
      }
    },
    renderTotalTime(value) {
      if (!value || typeof value !== 'number') {
        return '00:00:00'
      } else {
        const result = parseInt(value)
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return h + ':' + m + ':' + s
      }
    }
  },
  data() {
    return {
      playTime: 0,
      timer: null // 播放时长计时器
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      videoPlayTime: state => state.im.playTime
    })
  },
  watch: {
    'videoPlayTime': {
      handler(val) {
        this.playTime = val || 0
        if (this.liveRoomDetail.status === 9) {
          this.playTime = val
        }
        this.timer && clearInterval(this.timer)
        const nowTime = +new Date()
        if (![0, 9].includes(this.liveRoomDetail.status)) {
          this.timer = null
          this.timer = setInterval(() => {
            this.playTime = this.countDown(val, nowTime)
          }, 1000)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    countDown(time, oldTime) {
      var nowTime = +new Date() // 返回的是当前时间总的毫秒数
      const step = Number(((nowTime - oldTime) / 1000).toFixed(0))
      var times = (time + step) // times是剩余时间总的秒数
      return times
      // return d + '天' + h + '时' + m + '分' + s + '秒' // 返回函数计算出的值
    }
  }
}
</script>

<style lang='scss' scoped>
.p3_content {
  height: 100%;
  display: flex;
  flex-direction: column;
  .videoTimeView {
    padding: 0px 20px 5px;
    border-bottom: 1px solid #F5F5F5;
  }
  .videoPlayer {
    height: 266px;
    min-height: 266px;
    background: #333;
    position: relative;
  }
  .p3info {
    flex: 1 0 0;
    padding-top: 5px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden!important;
  }
}
</style>
