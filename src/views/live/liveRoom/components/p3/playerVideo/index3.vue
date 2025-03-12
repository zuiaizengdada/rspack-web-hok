<template>
  <div id="warmUpVideo" />
</template>

<script>
export default {
  components: {},
  data() {
    return {
      player: null,
      posterShow: true,
      loading: false,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  mounted() {

  },
  methods: {
    play(option = {}) {
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          const playerSdk = new VePlayer({
            id: 'warmUpVideo',
            lang: 'zh',
            autoplayMuted: true,
            url: option.url,
            // controls: {
            //   autoHide: false
            // },
            fluid: true,
            loop: true,
            autoplay: true,
            sdkErrorPlugin: {
              errorImg: false
            },
            controls: true,
            // playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
            ignores: ['sdkUnmutePlugin', 'loading', 'enter', 'currentTime'],
            start: {
              isShowPause: false,
              isShowEnd: false,
              mode: 'hide',
              disableAnimate: true
            },
            ...option
          })
          // 需要在播放器创建完成后再去监听timeupdate事件
          playerSdk.on('player_create_finish', () => {
            console.log('播放器创建完成')
            this.player_create_finish = true
            this.player = playerSdk.getPlayerInstance()
            playerSdk.on('timeupdate', (player) => {})
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
        } catch (err) {
          // console.log('err', err)
        }
      })
    },
    playVideo() {
      if (this.playerSdk?.player?.state === 6 || this.playerSdk?.player?.state === 7) {
        this.playerSdk?.player?.paused ? this.player && this.player.pause() : this.player && this.player.play()
      }
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#warmUpVideo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  ::v-deep {
    .xgplayer-playing {
      height: 100%!important;
    }
  }
}
</style>
