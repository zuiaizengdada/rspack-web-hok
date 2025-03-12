<template>
  <div ref="videoView" class="videoView">
    <div v-show="videoDetail.url" id="liveRoomScriptVideo" />
    <div v-show="!videoDetail.url" class="noVideoUrl">
      <!-- 暂无播放视频 -->
      <img :src="videoDetail.coverUrl" alt="" style="width: 100%;height: 100%" />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
export default {
  components: {},
  props: {
    videoDetail: {
      type: Object,
      default: () => {
        return {
          url: '',
          coverUrl: ''
        }
      }
    }
  },
  data() {
    return {
      player: null,
      playerSdk: null,
      player_create_finish: false,
      width: 0,
      height: 0,
      posterUrl: '',
      detail: {},
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  mounted() {
    this.init()
    // this.play(this.videoDetail.url, '')
    this.$_resizeHandler = debounce(() => {
      this.init()
      // this.play(this.videoDetail.url, this.posterUrl, this.detail)
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
    setplay(value, ifPlayer = 'pause') {
      console.log('this.player', this.player)
      if (!this.player) {
        return
      } else if (this.playerStatus === 'play') {
        return this.player.seek(value, 'play')
      } else {
        return this.player.seek(value, 'pause')
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
          // fluid: true,
          // width: this.width,
          // height: this.height,
          controls: {
            autoHide: false
          },
          videoInit: true,
          autoplay: false,
          loop: false,
          pip: false,
          playbackRate: [1, 1.5, 2],
          sdkErrorPlugin: {
            errorImg: false
          },
          closeInactive: true,
          autoplayMuted: false,
          ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
        })
        // 需要在播放器创建完成后再去监听timeupdate事件
        playerSdk.on('player_create_finish', () => {
          console.log('播放器创建完成')
          this.player_create_finish = true
          this.player = playerSdk.getPlayerInstance()
          playerSdk.on('timeupdate', (player) => {
            // console.log('视频播放触发', player.currentTime)
            // player.currentTime
            // console.log('视频播放时间', player.currentTime)
            // this.zimuArr.some(item => {
            //   if ((player.currentTime >= item.startTime / 1000) && (player.currentTime <= item.endTime / 1000)) {
            //     this.nowWzData = item.content
            //   }
            // })
            this.$emit('timeupdate', player.currentTime)
          })
          playerSdk.on('canplay', (player) => {
            // this.$emit('canplay')
            this.playerStatus = 'canplay'
          })
          playerSdk.on('play', () => {
            console.log('视频播放')
            this.playerStatus = 'play'
          })
          playerSdk.on('pause', () => {
            // console.log('视频播放暂停')
            this.playerStatus = 'pause'
          })
          playerSdk.on('ended', () => {
            // console.log('视频播放结束')
            this.playerStatus = 'ended'
          })
          playerSdk.on('playing', () => {
            // console.log('（暂停、卡顿后）恢复播放')
            this.playerStatus = 'play'
          })
          playerSdk.on('error', (error) => {
            // this.$message.error('视频播放错误')
            console.log('视频播放错误', error)
            this.playerStatus = 'error'
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
    }
  }
}
</script>

<style lang='scss' scoped>
.videoView {
  width: 100%;
  height: 100%;
  #liveRoomScriptVideo {
    width: 100%;
    height: 100%;
  }
  .noVideoUrl {
    width: 100%;
    height: 100%;
  }
}
</style>
