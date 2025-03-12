<template>
  <div ref="videoView" class="videoView">
    <div id="liveRoomScriptVideo" />
    <div v-if="showOnlineNum" class="onlineNum">直播间：{{ onlineNum }}人</div>
    <div v-if="duration" class="playTime">
      <span style="color: #fff">{{ currentTime | filterTime(startTime, duration, ifShowYear) }} / </span>
      <span style="color: rgba(255, 255, 255, .5);">{{ renderDuration | renderDuration(ifShowYear) }}</span>
    </div>
    <div class="subtitleList">
      <div v-html="currentSubtitle" />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import moment from 'moment'
import { getSubtitleList } from '@/api/liveRoom'
export default {
  filters: {
    filterTime(val, startTime, duration, ifShowYear) {
      if (!(startTime && duration)) {
        return ''
      }
      return moment(startTime).add(val, 's').format(ifShowYear ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss')
    },
    renderDuration(val, ifShowYear) {
      return moment(val).format(ifShowYear ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {},
  props: {
    startTime: {
      type: String,
      default: ''
    },
    onlineNum: {
      type: Number,
      default: 0
    },
    endTime: {
      type: Number,
      default: 0
    },
    showOnlineNum: {
      type: Boolean,
      default: true
    },
    playbackRate: {
      type: Array,
      default: () => [1, 0.5]
    }
  },
  inject: ['setPlayerStatus'],
  data() {
    return {
      player: null,
      playerSdk: null,
      player_create_finish: false,
      width: 0,
      subtitleList: [],
      height: 0,
      posterUrl: '',
      duration: 0, // 视频总时长
      renderDuration: '', // 展示的结束时间
      currentTime: 0,
      subTitleLoading: false,
      detail: {},
      playerStatus: 'pause' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  computed: {
    // 根据当前播放时间查询对应的展示的字幕文件
    currentSubtitle() {
      if (this.subtitleList.length === 0) return ''
      const time = this.currentTime * 1000
      const arr = this.subtitleList.filter(v => v.startTime <= time && v.endTime > time)
      if (arr.length > 0) {
        let str = arr.reduce((pre, next) => {
          next && (pre = `${pre}${pre ? ' ' : ''}${next.content}`)
          return pre
        }, '')
        str = str.split('')
        let strArr = []
        str.map(v => {
          strArr.push(`<span style="text-shadow: 0px 0px 4px rgba(0, 0, 0, 1);color: rgba(255, 255, 255, 1);">${v}</span>`)
          return
        })
        strArr = strArr.join('')
        return strArr
      }
      return ''
    },
    // 获取开播时间的年月日，如果开播的年月日和结束的相同，就不展示对应的年月日
    ifShowYear() {
      if (!this.startTime || !this.renderDuration) return false
      const startYear = moment(this.startTime).format('YYYY-MM-DD')
      const endYear = moment(this.renderDuration).format('YYYY-MM-DD')
      return startYear === endYear
    }
  },
  mounted() {
    this.init()
    this.$_resizeHandler = debounce(() => {
      this.init()
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  methods: {
    init() {
      this.width = this.$refs.videoView.offsetWidth
      this.height = this.$refs.videoView.offsetHeight
    },
    setplay(value, ifPlayer) {
      console.log('this.player', this.player)
      if (ifPlayer) {
        return this.player.seek(value, ifPlayer)
      }
      const time = value > this.duration ? this.duration : value
      if (!this.player) {
        return
      } else if (this.playerStatus === 'play') {
        return this.player.seek(time, 'play')
      } else {
        return this.player.seek(time, 'pause')
      }
    },
    play(url, posterUrl, detail) {
      this.posterUrl = posterUrl
      this.detail = detail
      this.destroy().then(res => {
        this.playerSdk = null
        // eslint-disable-next-line no-undef
        const playerSdk = new VePlayer({
          id: 'liveRoomScriptVideo',
          lang: 'zh',
          streamType: detail.hlsUrl ? 'hls' : '',
          url: detail.hlsUrl ? detail.hlsUrl : detail.url,
          poster: posterUrl,
          videoInit: true,
          autoplay: false,
          loop: false,
          pip: true,
          playbackRate: this.playbackRate,
          sdkErrorPlugin: {
            errorImg: false
          },
          closeInactive: true,
          autoplayMuted: false,
          ignores: ['sdkUnmutePlugin', 'DanmuPlugin', 'currentTimeDisplay', 'time']
        })

        // 需要在播放器创建完成后再去监听timeupdate事件
        playerSdk.on('player_create_finish', (res) => {
          this.player_create_finish = true
          this.player = playerSdk.getPlayerInstance()
          this.setplay(0, 'pause')
          playerSdk.player.volume = 0
          playerSdk.player.muted = false
          playerSdk.on('timeupdate', (player) => {
            this.currentTime = player.currentTime
            this.$emit('timeupdate', player.currentTime)
          })
          playerSdk.on('canplay', (player) => {
            this.playerStatus = 'canplay'
            this.duration = player.duration
            this.renderDuration = this.getRenderDuration(player.duration, this.startTime)
            this.setPlayerStatus('canplay')
          })
          playerSdk.on('play', () => {
            // console.log('视频播放')
            this.playerStatus = 'play'
            this.setPlayerStatus('play')
          })
          playerSdk.on('pause', () => {
            // console.log('视频播放暂停')
            this.playerStatus = 'pause'
            this.setPlayerStatus('pause')
          })
          playerSdk.on('ended', () => {
            // console.log('视频播放结束')
            this.playerStatus = 'ended'
            this.setPlayerStatus('ended')
          })
          playerSdk.on('playing', () => {
            // console.log('（暂停、卡顿后）恢复播放')
            this.playerStatus = 'play'
            this.setPlayerStatus('play')
          })
          playerSdk.on('error', (error) => {
            // this.$message.error('视频播放错误')
            console.log('视频播放错误', error)
            this.playerStatus = 'error'
            this.setPlayerStatus('error')
          })
        })
        this.playerSdk = playerSdk
      }).catch((err) => {
        console.log(err, 'err')
      })
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    },
    playVideo() {
      if (this.playerSdk?.player?.state === 6 || this.playerSdk?.player?.state === 7 || this.playerSdk?.player?.state === 4) {
        this.playerSdk?.player?.paused ? this.player && this.player.pause() : this.player && this.player.play()
      }
    },
    forPauseVideo() {
      return this.player.pause()
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    getRenderDuration(val, startTime) {
      if (!(startTime && val)) {
        return ''
      }
      return moment(startTime).add(val, 's').format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取字幕数据
    getSubtitleList(videoId) {
      this.subTitleLoading = true
      const data = {
        videoId
      }
      getSubtitleList(data).then((res) => {
        console.log(res, '请求获取到的字幕资源res')
        this.subtitleList = res.data
        this.subTitleLoading = false
      }).catch(() => {
        this.subTitleLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.videoView {
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  #liveRoomScriptVideo {
    width: 100%;
    height: 100%;
  }
  .noVideoUrl {
    width: 100%;
    height: 100%;
  }
  .onlineNum {
    position: absolute;
    top: 10px;
    right: 15px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    opacity: 1;
    background: #000000cc;
    z-index: 2;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    font-family: "微软雅黑";
  }
  .playTime {
    position: absolute;
    bottom: 10px;
    left: 46px;
    z-index: 20;
    color: #fff;
    font-size: 14px;
  }
  .subtitleList {
    position: absolute;
    bottom: 80px;
    left: 0;
    z-index: 8;
    width: 100%;
    padding: 0 20px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    font-family: "微软雅黑";
    text-align: center;
  }
}
::v-deep {
  .xgplayer.not-allow-autoplay .xgplayer-controls, .xgplayer.xgplayer-nostart .xgplayer-controls, .xgplayer.xgplayer-inactive .controls-autohide {
    /* pointer-events: none; */
    /* visibility: hidden; */
    visibility: visible;
    cursor: default;
    opacity: 1;
  }
}
</style>
