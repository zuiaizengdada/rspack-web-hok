<template>
  <div class="player">
    <div id="mse" />
    <div v-show="!videoDetail.url" class="noVideoUrl">
      <div>未找到视频资源</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      videoDetail: {
        url: ''
      },
      player: null,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  created() {
    this.keyDown()
  },
  beforeDestroy () {
    this.keyDownReview()
    this.destroy()
  },
  mounted() {
    // this.play(this.videoDetail.url, '')
  },
  methods: {
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
      console.log(detail.hlsUrl, '111')
      this.destroy().then(res => {
        this.playerSdk = null
        // eslint-disable-next-line no-undef
        const playerSdk = new VePlayer({
          id: 'mse',
          lang: 'zh',
          streamType: detail.hlsUrl ? 'hls' : '',
          url: detail.hlsUrl ? detail.hlsUrl : detail.url,
          poster: posterUrl,
          // width: 483,
          height: 360,
          controls: {
            autoHide: false
          },
          videoInit: true,
          autoplay: false,
          loop: false,
          pip: false,
          sdkErrorPlugin: {
            errorImg: false
          },
          closeInactive: true,
          playbackRate: [2, 1.5, 1],
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
          playerSdk.on('fullscreen_change', (res) => {
            console.log('全屏状态改变', res)
            this.$store.commit('liveScript/set_fullscreen', res)
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
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        if (event.target.localName === 'input' || event.target.localName === 'textarea') {
          return
        }
        console.log(keyCode, 'keyCode')
        switch (keyCode) {
          case 32:
            console.log('空格')
            _this.playVideo && _this.playVideo()
            break
          case 81:
            console.log('Q键盘')
            _this.forPauseVideo()
            _this.$emit('onkeyDownQ')
        }
      }
    },
    keyDownReview () {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.noVideoUrl {
  height: 360px;
  font-size: 20px;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
