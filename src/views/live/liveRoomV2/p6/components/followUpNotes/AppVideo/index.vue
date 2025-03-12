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
      <div class="flex flex-middle flex-between" style="height: 36px; width: 100%;">
        <span class="flex flex-middle" style="height: 36px;">
          <span>{{ videoName }}</span>
          <span v-if="videoId" class="videoId flex flex-middle">ID: {{ videoId }}</span>
        </span>
      </div>
    </template>
    <div class="choose_resource">
      <div v-if="visible" id="msg" />
      <div class="subtitleList">
        <div v-html="currentSubtitle" />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getSubtitleList } from '@/api/liveRoom'
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
      videoInfo: null,
      playerSdk: null,
      duration: 0, // 视频总时长
      renderDuration: '', // 展示的结束时间
      currentTime: 0,
      subTitleLoading: false,
      player_create_finish: false,
      subtitleList: [],
      initBc: () => {},
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
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
    }
  },
  mounted() {},
  methods: {
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
              this.currentTime = player.currentTime
              this.$emit('timeupdate', player.currentTime)
            })
            playerSdk.on('canplay', (player) => {
              // this.$emit('canplay')
              this.duration = player.duration
              this.playerStatus = 'canplay'
              console.log('能够播放了')
            })
            playerSdk.on('loadeddata', (player) => {
              console.log('视频起播数据加载完成时触发。')
              this.initBc && this.initBc().then((res) => {
                this.setplay(res.time || 0, res.ifPlayer)
                res.videoId && this.getSubtitleList(res.videoId)
              })
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
    setCancelInvalid() {
      this.videoInfo.cancelInvalid(this.videoInfo)
    },
    handleClickReload() {
      this.videoInfo.autoDesensitizedStatus = 1
      this.$set(this.videoInfo, 'autoDesensitizedStatus', 1)
      this.videoInfo.handleClickReload(this.videoInfo)
    },
    toDesensitizationVideo() {
      this.videoInfo.toDesensitizationVideo(this.videoInfo)
    },
    reForChuli() {
      this.videoInfo.reForChuli(this.videoInfo)
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
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
.status{
  .green{
    color:#00B42A;
    background: #E6F7EA;
  }
  .orange{
      color:#FF7D00;
      background: #FFF2E6;
  }
  .red{
      color:#F53F3F;
      background: #FEECEC;
  }
  span{
     height: 24px;
    border-radius: 12px;
    line-height: 24px;;
    padding:0 10px;
  }
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
::v-deep .ss-material-box-header-title{
  width: 100% !important;
}
.choose_resource {
  width: 100%;
  height: 531px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
