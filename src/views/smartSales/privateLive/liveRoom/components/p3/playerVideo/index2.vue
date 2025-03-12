<template>
  <div class="playerVideo">
    <VueDragResize
      :is-active="isActive"
      :is-draggable="false"
      :minw="368"
      :x="0"
      :y="0"
      :w="368"
      :h="266"
      :sticks="['bl']"
      :aspect-ratio="true"
      :prevent-active-behavior="true"
    >
      <!-- <video id="myVideo" style="width: 100%;height: 100%;background: #010001;" autoplay muted /> -->
      <video id="myVideo" style="width: 100%;height: 100%;background: #010001;" preload="auto" playsinline webkit-playsinline />
      <div v-if="[0, 9].includes(liveRoomDetail.status)" class="liveRoomPoster">
        <div class="mask" />
        <template v-if="liveRoomDetail.status === 0 && liveRoomDetail.warmUp === 1 && liveRoomDetail.warmUpUrl">
          <img :src="liveRoomDetail.warmUpUrl" alt="" />
        </template>
        <template v-if="liveRoomDetail.status === 0 && liveRoomDetail.warmUp === 2 && liveRoomDetail.warmUpUrl">
          <videoPlay ref="videoPlay" />
        </template>
        <div v-if="liveRoomDetail.status === 9" class="liveRoomState">直播已结束</div>
        <div v-else-if="liveRoomDetail.status === 0" class="liveRoomState">
          <div>直播未开始</div>
          <div class="liveRoomStateTime">开播时间: {{ liveRoomDetail.startTime | renderTime }}</div>
        </div>
      </div>
      <!-- v-if="liveRoomDetail.status === 1" -->
      <div class="liveRoomVolume">
        <MVolume v-model="volume" @change="onhandleVolumeChange">
          <img slot="jingyin" src="~@/assets/image/live/liveplayjingyin.png" class="volume-icon" />
          <img slot="yinlaing" src="~@/assets/image/live/livePlayyinlaing.png" class="volume-icon" />
        </MVolume>
      </div>
      <img src="~@/assets/image/live/dragIcon.png" class="dragIcon" />
    </VueDragResize>
  </div>
</template>

<script>
import VueDragResize from '@/assets/js/vue-drag-resize'
import { mapState } from 'vuex'
import moment from 'moment'
import videoPlay from './index3.vue'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  directives: {
    // 放大缩小
    open: function (el) {
      // 当被绑定的元素插入到 DOM 中时 放大缩小
      el.onmousedown = function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        var x = e.clientX - el.offsetLeft
        var y = e.clientY - el.offsetTop
        document.onmousemove = function (eve) {
          console.log(y)
          console.log(x)
          // 设置宽高
          document.getElementById('popVideoBox').style.height = -y + eve.clientY + 'px'
          if (document.getElementById('popVideoBox').offsetHeight > document.body.offsetHeight) {
            document.getElementById('popVideoBox').style.height = document.body.offsetHeight + 'px'
          } else if (document.getElementById('popVideoBox').offsetHeight < 150) {
            document.getElementById('popVideoBox').style.height = 150 + 'px'
          }
        //   document.getElementById('popVideoBox').style.width = -x + eve.clientX + 'px'
        //   if (document.getElementById('popVideoBox').offsetWidth > document.body.offsetWidth) {
        //     document.getElementById('popVideoBox').style.width = document.body.offsetWidth + 'px'
        //   } else if (document.getElementById('popVideoBox').offsetWidth < 150) {
        //     document.getElementById('popVideoBox').style.width = 150 + 'px'
        //   }
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },
  components: {
    videoPlay,
    VueDragResize
  },
  data() {
    return {
      isActive: true,
      isPlay: false, // 是否显示播放画面
      player: null, // 播放实例
      lastDecodedFrame: 0, // 最后一个decodedFrame
      lastCurrentTime: '',
      currentTime: '',
      timer: null,
      timer2: null,
      volume: 0,
      sameCount: 0, // decodedFrame不变次数
      options: {
        language: 'zh-CN',
        bigPlayButton: false,
        autoplay: false,
        muted: true,
        controlBar: {
          playToggle: false,
          progressControl: false,
          volumePanel: false,
          currentTimeDisplay: false,
          durationDisplay: false,
          timeDivider: false,
          playbackRateMenuButton: false,
          fullscreenToggle: false,
          QualitySwitcherMenuButton: false
        },
        webrtcConfig: {
          connectRetryCount: 50,
          connectRetryDelay: 1,
          receiveVideo: true,
          receiveAudio: true,
          showLog: false
        },
        plugins: {
          ProgressMarker: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      pushFlowSwitch: state => state.im.pushFlowSwitch,
      videoUrl: state => state.im.videoUrl
    })
  },
  watch: {
    'videoUrl': {
      handler(val) {
        if (val) {
          console.log(this.videoUrl, 'videoUrl')
          this.$refs.videoPlay && this.$refs.videoPlay.destroy()
          this.$nextTick(() => {
            setTimeout(() => {
              this.player.src(val)
              this.play()
            }, 1000)
          })
        } else {
          // this.destroyPlayer()
        }
      },
      deep: true,
      immediate: true
    },
    'pushFlowSwitch': {
      handler(val) {
        console.log('pushFlowSwitch改变', val)
        console.log(this.videoUrl, 'videoUrl')
        this.videoUrl && this.setUrl()
        if (val === 2 || val === 3) {
          // 直播暂停,直播异常
          this.setUrl()
        } else if (val === 1) {
          this.setUrl()
          this.play()
        } else if (val === 0) {
          if (this.player) {
            const fullScreenState = this.player.isFullscreen()
            fullScreenState && this.player.exitFullscreen()
          }
          // 直播结束
          this.currentTime = 0
          this.lastCurrentTime = 0
          this.player && this.player.pause()
        }
      }
    },
    'liveRoomDetail.status': {
      handler(val) {
        if (val === 0 && this.liveRoomDetail.warmUp === 2 && this.liveRoomDetail.warmUpUrl) {
          this.$nextTick(() => {
            this.$refs.videoPlay && this.$refs.videoPlay.play({
              url: this.liveRoomDetail.warmUpUrl
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('123')
    this.initPlayer()
  },
  beforeDestroy() {
    this.destroyPlayer()
    // 销毁监听
    const _this = this
    window.removeEventListener('online', () => {
      if (_this.player) {
        _this.destroyPlayer() // 销毁
        _this.play() // 重连
      }
    }, true)
  },
  created() {},
  methods: {
    initPlayer() {
      // eslint-disable-next-line no-undef
      this.player = TCPlayer('myVideo', this.options)
      this.player.ready(() => {
        console.log('初始化完成')
      })
      this.player.on('webrtcevent', function(event) {
        // 从回调参数 event 中获取事件状态码及相关数据
        // console.log('event', event)
        const codeState = {
          1001: '开始拉流',
          1002: '已经链接服务器',
          1003: '视频播放开始',
          1004: '停止拉流，结束视频播放',
          1005: '链接服务失败，已启动自动重连恢复',
          1006: '获取流数据为空',
          1007: '开始请求信令服务器',
          1008: '请求信令服务器成功',
          1009: '拉流卡顿等待缓冲中',
          1010: '拉流卡顿结束恢复播放'
        }
        console.log(codeState[event.data.code])
      })
      this.player.on('canplay', () => {
      })
      this.player.on('error', (res) => {
        console.log(res, '播放出错')
        this.player.pause()
        this.player.src(this.videoUrl)
        this.play()
      })
      this.player.on('pause', () => {
        console.log('pause播放暂停')
        this.play()
      })
      this.player.on('canplaythrough', () => {
        console.log('可流畅播放')
      })
      this.player.on('volumechange', (res) => {})
    },
    play() {
      // this.player.src(this.videoUrl)
      this.player && this.player.play()
    },
    destroyPlayer() {
      if (this.player) { // 如果有实例，就销毁
        this.player.dispose() // 销毁
        console.log('播放器销毁')
      }
      // if (Object.keys(this.playerSdk).length > 0) {
      //   const dom = document.querySelector('#myVideo')
      //   dom.innerHTML = ''
      //   this.playerSdk.destroy()
      // }
    },
    onhandleVolumeChange(res) {
      // console.log(this.player.volume, '播放器音量')
      if (this.player) {
        this.player.muted(false)
        const volume = Number((res / 100).toFixed(1))
        this.player.volume(volume)
      }
    },
    getUrl({ appName = '', streamName = '', txSecret = '', txTime = '', url = '' }) {
      console.log(url, 'url')
      return {
        RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
      }
    },
    setUrl() {
      if (this.liveRoomDetail.liveModel === 'PERSON_LIVE') {
        this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomPersonInfo.broadcastInfo).auto).webRtc)
      } else if (this.liveRoomDetail.liveModel === 'AI_LIVE') {
        this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomIntelligentInfo.broadcastInfo).auto).webRtc)
      }
    },
    onhandleFullScreen() {
      if (this.player) {
        const fullScreenState = this.player.isFullscreen()
        fullScreenState ? this.player.exitFullscreen() : this.player.requestFullscreen()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.playerVideo {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  // background: #010001;
  .liveRoomPoster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    background: #fff;
    z-index: 99999;
    > img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      object-fit: contain;
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba($color: #000000, $alpha: 0.5);
      z-index: 2;
    }
    .liveRoomState {
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 28px;
      z-index: 2;
      .liveRoomStateTime {
        font-size: 16px;
        margin-top: 8px;
        font-weight: 400;
      }
    }
  }
  .liveRoomVolume {
    position: absolute;
    bottom: 4px;
    right: 7px;
    width: 100%;
    // right: 4px;
    // width: 25px;
    height: 25px;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 4px;
    .fullScreen {
      color: #fff;
      margin-right: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  #myVideo {
    width: 100%;
    height: 100%!important;
    // padding-top: 0!important;
    // background: #010001;
  }
  .dragIcon {
    position: absolute;
    bottom: 6px;
    left: 6px;
    z-index: 999999;
    width: 20px;
    height: 20px;
    // transform: rotateZ(90deg);
  }
  .volume-icon {
    width: 20px;
    height: 20px;
    font-size: 20px!important;
  }
}
::v-deep {
  // 隐藏
  .vdr.active:before {
    opacity: 0;
  }
  .vdr-stick {
    opacity: 0;
    width: 30px!important;
    height: 30px!important;
    z-index: 99999999999;
  }
  .vjs-live-display {
    display: none;
  }
}
</style>
