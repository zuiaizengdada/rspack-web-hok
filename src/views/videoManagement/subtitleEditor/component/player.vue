<template>
  <div class="player">
    <div class="videoTitle" :title="videoName">
      {{ videoName }}
    </div>
    <div v-show="url" id="mse" />
    <div v-show="!url" class="noVideoUrl">
      暂无播放视频
    </div>
    <!-- <div class="zimu_ls">
      <span>{{ nowWzData }}</span>
    </div> -->
  </div>
</template>

<script>
import { getSubTitleList } from '@/api/videoManagement/subtitleEditor'
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    videoId: {
      type: [String, Number],
      default: ''
    },
    videoName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nowWzData: '',
      zimuArr: [],
      player: null,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  created() {
    this.keyDown()
    this.$nextTick(() => {
      this.loadZm()
    })
  },
  beforeDestroy () {
    this.keyDownReview()
    this.destroy()
  },
  mounted() {},
  methods: {
    loadZm() {
      this.nowWzData = ''
      this.zimuArr = []
      if (this.videoId === '') {
        const that = this
        setTimeout(function() {
          that.loadZm()
        }, 1000)
        return
      }
      const params = {
        videoId: this.videoId
      }
      getSubTitleList(params).then(res => {
        if (res.success) {
          this.zimuArr = res.data
        }
      })
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
    play(url, posterUrl) {
      this.destroy().then(res => {
        this.playerSdk = null
        // eslint-disable-next-line no-undef
        const playerSdk = new VePlayer({
          id: 'mse',
          streamType: 'hls',
          lang: 'zh',
          url: url,
          poster: posterUrl,
          width: 483,
          height: 316,
          controls: {
            autoHide: false
          },
          videoInit: true,
          autoplay: false,
          loop: false,
          pip: false,
          playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
          sdkErrorPlugin: {
            errorImg: false
          },
          closeInactive: true,
          autoplayMuted: false,
          ignores: ['sdkUnmutePlugin', 'fullscreen', 'DanmuPlugin']
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
            this.zimuArr.some(item => {
              if ((player.currentTime >= item.startTime / 1000) && (player.currentTime <= item.endTime / 1000)) {
                this.nowWzData = item.content
              }
            })
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
      this.player.pause()
    },
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        if (event.target.localName === 'input') {
          return
        }
        switch (keyCode) {
          case 32:
            console.log('空格')
            _this.playVideo && _this.playVideo()
            break
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
.player {
  position: relative;
  height: 100%;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 28px;
  background: #EEEEEE;
  .videoTitle {
    height: 24px;
    margin-bottom: 10px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  #mse {
    height: 316px;
  }
  .noVideoUrl {
    background: #1E1F1E;
    height: 316px;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #919293;
    line-height: 316px;
    text-align: center;
  }
}
.zimu_ls {
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: 80px;
  span {
    float: left;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    width: 96%;
    padding: 0 2%;
    height: 30px;
    line-height: 30px;
  }
}
</style>
