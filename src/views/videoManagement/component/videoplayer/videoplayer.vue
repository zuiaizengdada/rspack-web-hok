<template>
  <AppDialog
    v-model="visible"
    :close-on-press-escape="closeOnPressEscape"
    width="916px"
    height="auto"
    top="10vh"
    title=""
  >
    <template slot="title">
      <span>{{ videoName }}</span>
      <span v-if="videoId" class="videoId">ID: {{ videoId }}</span>
    </template>
    <div class="choose_resource">
      <div v-if="visible" id="msg" />
    </div>
    <div slot="footer" />
    <div class="zimu_ls">
      <span>{{ nowWzData }}</span>
    </div>
  </AppDialog>
</template>

<script>
import { getSubTitleList } from '@/api/videoManagement/subtitleEditor'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    videoId: {
      type: String,
      default: ''
    },
    videoName: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowWzData: '',
      zimuArr: [],
      player: null,
      posterShow: true,
      loading: false,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.keyDown()
      } else {
        this.keyDownReview()
        this.destroy()
      }
    },
    videoId: {
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.loadZm()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadZm()
    })
  },
  methods: {
    loadZm() {
      this.nowWzData = ''
      this.zimuArr = []
      if (this.videoId === '') {
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
    play(option) {
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          const playerSdk = new VePlayer({
            id: 'msg',
            width: 876,
            height: 492,
            lang: 'zh',
            autoplayMuted: false,
            url: option.url,
            controls: {
              autoHide: false
            },
            autoplay: false,
            sdkErrorPlugin: {
              errorImg: false
            },
            playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
            ignores: ['sdkUnmutePlugin', 'DanmuPlugin'],
            ...option
          })
          // 需要在播放器创建完成后再去监听timeupdate事件
          playerSdk.on('player_create_finish', () => {
            console.log('播放器创建完成')
            this.player_create_finish = true
            this.player = playerSdk.getPlayerInstance()
            playerSdk.on('timeupdate', (player) => {
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
        } catch (err) {
          // console.log('err', err)
        }
      })
    },
    close() {
      this.visible = false
    },
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        // console.log('keyCode', keyCode)
        switch (keyCode) {
          case 32:

            _this.playVideo && _this.playVideo()
            break
          default:
            break
        }
        if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          window.event.returnValue = false
        }
      }
    },
    keyDownReview () {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
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
.choose_resource {
  width: 100%;
  height: 531px;
  display: flex;
  align-items: center;
  justify-content: center;
  #msg {
    width: 876px;
    height: 492px;
  }
}
  .videoId {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
    margin-left: 16px;
  }

  .zimu_ls {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 70px;
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
