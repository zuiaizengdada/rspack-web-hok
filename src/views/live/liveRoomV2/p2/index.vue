<template>
  <div class="p2">
    <!-- 视频区域 -->
    <liveLoading :visible="loading" />
    <div class="p2_box">
      <p2header @onClick="onHandleClickLiveRoomSetting" />
      <div class="p2_content">
        <div class="p2_content_left">
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
          <div v-if="[1].includes(liveRoomDetail.status)" class="liveRoomVolume">
            <!-- 数字直播时间 -->
            <div>
              <template v-if="liveRoomDetail.liveModel === 'AI_LIVE'">
                <div class="videoTimeView">
                  {{ playTime | renderPlayTime }}
                  <!-- / {{ liveRoomDetail.totalTime | renderTotalTime }} -->
                </div>
              </template>
            </div>
            <MVolume v-model="volume" @change="onhandleVolumeChange">
              <img slot="jingyin" src="~@/assets/image/liveRoom/muteIcon.png" class="volume-icon" />
              <img slot="yinlaing" src="~@/assets/image/liveRoom/volumeIncrease.png" class="volume-icon" />
            </MVolume>
          </div>
        </div>
        <!-- 直播间弹窗 -->
        <liveRoomPopBox />
      </div>
    </div>
  </div>
</template>

<script>
import liveRoomPopBox from './liveRoomPopBox.vue'
import liveLoading from '../components/loading/index.vue'
import p2header from './p2header.vue'
import { mapState } from 'vuex'
import moment from 'moment'
import videoPlay from './videoPlay.vue'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },

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
    }
    // renderTotalTime(value) {
    //   if (!value || typeof value !== 'number') {
    //     return '00:00:00'
    //   } else {
    //     const result = parseInt(value)
    //     const h =
    //       Math.floor(result / 3600) < 10
    //         ? '0' + Math.floor(result / 3600)
    //         : Math.floor(result / 3600)
    //     const m =
    //       Math.floor((result / 60) % 60) < 10
    //         ? '0' + Math.floor((result / 60) % 60)
    //         : Math.floor((result / 60) % 60)
    //     const s =
    //       Math.floor(result % 60) < 10
    //         ? '0' + Math.floor(result % 60)
    //         : Math.floor(result % 60)
    //     return h + ':' + m + ':' + s
    //   }
    // }
  },
  components: {
    liveRoomPopBox,
    liveLoading,
    videoPlay,
    p2header
  },
  data() {
    return {
      loading: false,
      volume: 0,
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
      },
      ifClick: false,
      showLiveRoomSetting: false,
      isActive: true,
      isPlay: false, // 是否显示播放画面
      player: null, // 播放实例
      lastDecodedFrame: 0, // 最后一个decodedFrame
      lastCurrentTime: '',
      currentTime: '',
      timer: null,
      timer2: null,

      playTime: 0,
      timer3: null // 播放时长计时器
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      pushFlowSwitch: state => state.im.pushFlowSwitch,
      videoUrl: state => state.im.videoUrl,
      videoPlayTime: state => state.im.playTime
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
    'videoPlayTime': {
      handler(val) {
        this.playTime = val || 0
        if (this.liveRoomDetail.status === 9) {
          this.playTime = val
        }
        this.timer3 && clearInterval(this.timer3)
        const nowTime = +new Date()
        if (![0, 9].includes(this.liveRoomDetail.status)) {
          this.timer3 = null
          this.timer3 = setInterval(() => {
            this.playTime = this.countDown(val, nowTime)
          }, 1000)
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
  mounted() {
    this.initPlayer()
  },
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
      console.log(url, 'url', process.env.NODE_ENV, 'process.env.NODE_ENV')
      if (process.env.NODE_ENV === 'test') {
        // test环境
        return {
          RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}`
        }
      } else {
        return {
          RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
        }
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
    },
    onHandleClickLiveRoomSetting() {
      this.ifClick = true
      this.showLiveRoomSetting = !this.showLiveRoomSetting
    },
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
.p2 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
  .p2_box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .p2_content {
      flex: 1 0 0;
      position: relative;
      overflow: hidden;
      display: flex;
      .p2_content_left {
        position: relative;
        flex: 1 0 0;
      }
      .p2_content_right {
        width: 0;
      }
    }
  }
}

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
  z-index: 9;
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
  /* justify-content: flex-end; */
  justify-content: space-between;
  padding-left: 4px;
  .videoTimeView{
    color: #fff;
    padding-left: 10px;
    font-size: 16px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
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

.p2_content_right_open_close {
  animation: slide-in .3s;
  animation-fill-mode: forwards;
}
.p2_content_right_open {
  animation: slide-out .3s;
  animation-fill-mode: forwards;
}
@keyframes slide-in {
  from {
    width: 0;
  }
  to {
    width: 300px;
  }
}
@keyframes slide-out {
  from {
    width: 300px;
  }
  to {
    width: 0;
  }
}
::v-deep {
  .vjs-live-display {
    display: none!important;
  }
}
.volume-icon {
  width: 18px;
  height: 18px;
}
</style>
