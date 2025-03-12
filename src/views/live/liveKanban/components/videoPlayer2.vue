<template>
  <div ref="videoPlayer" class="videoPlayer">
    <video id="liveKanbanVideo" />
    <div v-if="liveRoomDetail.status !== 1" class="liveRoomPoster">
      <div v-if="liveRoomDetail.status === 9" class="liveRoomState">
        <div>直播已结束</div>
        <div>查看更多数据，请点击直播详情。</div>
        <div class="btnGotoDetail" @click="gotoDetail">查看详情</div>
      </div>
      <div v-else-if="liveRoomDetail.status === 0" class="liveRoomState">
        <div>直播未开始</div>
        <div>暂无直播数据，请开播后再查看！</div>
      </div>
      <div v-else-if="liveRoomDetail.status === 2 || liveRoomDetail.status === 3" class="liveRoomState">
        <div>直播已中断</div>
        <div>暂无直播数据，请稍等片刻！</div>
      </div>
    </div>
    <div v-if="liveRoomDetail.status === 1" class="liveRoomVolume">
      <MVolume v-model="volume" @change="onhandleVolumeChange" />
    </div>
  </div>
</template>

<script>
// import FlvJsPlayer from 'xgplayer-flv.js'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {},
  data() {
    return {
      player: null, // 播放实例
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
        this.videoUrl && this.setUrl()
        if (val === 2 || val === 3) {
          // 直播暂停
          this.setUrl()
        } else if (val === 1) {
          this.setUrl()
          this.play()
        } else if (val === 0) {
          // 直播结束
          this.player && this.player.pause()
        }
      }
    }
  },
  mounted() {
    this.initPlayer()
  },
  methods: {
    initPlayer() {
      // eslint-disable-next-line no-undef
      this.player = TCPlayer('liveKanbanVideo', this.options)
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
        console.log(res, '播放出错', this.videoUrl)
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
    play() {
      // this.player.src(this.videoUrl)
      this.player && this.player.play()
    },
    gotoDetail() {
      this.$router.replace({ path: `/live/liveDetail/${this.$route.params.id}` })
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
    }
  }
}
</script>

<style lang='scss' scoped>
.videoPlayer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  .liveRoomPoster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    background: #000;
    // background: linear-gradient(90deg, #063C70 0%, #192747 100%);
    z-index: 99;
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
      z-index: 3;
      > div:nth-child(2) {
        margin-top: 4px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
      }
      .btnGotoDetail {
        width: 104px;
        height: 36px;
        background: #0091FF;
        border-radius: 5px;
        // opacity: 0.2;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        line-height: 36px;
        margin-top: 32px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .liveRoomVolume {
    position: absolute;
    bottom: 0;
    right: 4px;
    width: 25px;
    height: 25px;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    z-index: 10;
  }
  #liveKanbanVideo {
    width: 100%;
    height: 100%!important;
    padding-top: 0!important;
    // background: #010001;
  }
}
::v-deep {
  .xgplayer-volume {
    .xgplayer-icon {
      margin-left: 0;
      > div {
        width: 24px;
        height: 24px;
      }
    }
  }
  .xgplayer-live {
    display: none!important;
  }
}
::v-deep {
  // 隐藏
  .vdr.active:before {
    opacity: 0;
  }
  .vdr-stick {
    opacity: 0;
  }
  .vjs-live-display {
    display: none;
  }
}
</style>
