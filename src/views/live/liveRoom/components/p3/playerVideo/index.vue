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
      <div v-show="isPlay" id="myVideo" />
      <div v-if="liveRoomDetail.status === 0 || liveRoomDetail.status === 9" class="liveRoomPoster">
        <img :src="liveRoomDetail.imgUrl" alt="">
        <div class="mask" />
        <div v-if="liveRoomDetail.status === 9" class="liveRoomState">直播已结束</div>
        <div v-else-if="liveRoomDetail.status === 0" class="liveRoomState">
          <div>直播未开始</div>
          <div class="liveRoomStateTime">开播时间: {{ liveRoomDetail.startTime | renderTime }}</div>
        </div>
      </div>
      <div v-if="liveRoomDetail.status === 1" class="liveRoomVolume">
        <MVolume v-model="volume" @change="onhandleVolumeChange" />
      </div>
    </VueDragResize>
  </div>
</template>

<script>
import VueDragResize from '@/assets/js/vue-drag-resize'
import { mapState } from 'vuex'
import moment from 'moment'
import FlvJsPlayer from 'xgplayer-flv.js'
// import Player from 'xgplayer'
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
      sameCount: 0 // decodedFrame不变次数
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
            // this.createVideo()
            setTimeout(() => {
              // 开始直播
              // 10秒定时任务判断画面时间是否没变化，没变化就重连
              const _this = this
              _this.timer = setInterval(() => {
                if (_this.lastCurrentTime === _this.currentTime) {
                  // console.log('10秒定时任务判断画面时间没变化，销毁重连', new Date())
                  _this.currentTime = 0
                  _this.lastCurrentTime = 0
                  if (_this.player) { // 如果有实例，就销毁
                    _this.player.destroy() // 销毁
                  }
                  _this.initPlayer() // 重连
                } else {
                  _this.currentTime = _this.player.currentTime
                }
              }, 10 * 1000)
              this.initPlayer()
            }, 1000)
          })
        } else {
          this.destroyPlayer()
        }
      },
      deep: true,
      immediate: true
    },
    'pushFlowSwitch': {
      handler(val) {
        console.log('pushFlowSwitch改变', val)
        console.log(this.videoUrl, 'videoUrl')
        this.videoUrl && this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomPersonInfo.broadcastInfo).auto).webRtc)
        if (val === 2) {
          // 直播暂停
          clearInterval(this.timer)
          this.destroyPlayer() // 销毁
          setTimeout(() => {
            this.initPlayer()
          }, 500)
        } else if (val === 1) {
          this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomPersonInfo.broadcastInfo).auto).webRtc)
          this.currentTime = 0
          this.lastCurrentTime = 0
          this.destroyPlayer() // 销毁
          this.initPlayer() // 重连
        } else if (val === 0) {
          // 直播结束
          this.currentTime = 0
          this.lastCurrentTime = 0
          this.destroyPlayer() // 销毁
        }
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer)
    if (this.player) {
      this.player.destroy()
    }
    // 销毁监听
    const _this = this
    window.removeEventListener('online', () => {
      if (_this.player) {
        _this.currentTime = 0
        _this.lastCurrentTime = 0
        _this.player.destroy() // 销毁
        _this.initPlayer() // 重连
      }
    }, true)
  },
  created() {

  },
  methods: {
    initPlayer() {
      this.isPlay = true
      if (this.timer2) {
        clearInterval(this.timer2)
        this.timer2 = null
      }
      this.$nextTick(function () {
        const _this = this
        this.player = new FlvJsPlayer({
          id: 'myVideo',
          url: _this.videoUrl,
          // fitVideoSize: 'auto',
          hasStart: false,
          autoplay: true, // 自动播放，设置自动播放必要参数
          autoplayMuted: true, // 自动播放静音，设置自动播放参数必要参数
          volume: (this.volume / 100).toFixed(1),
          defaultMuted: true,
          isLive: true,
          playsinline: true,
          controls: false,
          // screenShot: false,
          fluid: true,
          // aspectRatio: '16:9',
          whitelist: [''],
          controlsList: ['nodownload'],
          ignores: ['time', 'fullscreen', 'play', 'loading', 'volume', 'replay'],
          closeVideoClick: true,
          closeVideoTouch: true,
          keyShortcut: 'off',
          closeInactive: true,
          // errorTips: '<span class="app-error">无视频源</span>',
          errorTips: `直播暂停正在重连中...`,
          customConfig: {
            isClickPlayBack: false
          },
          flvOptionalConfig: {
            enableWorker: true,
            enableStashBuffer: false, // 启用缓存
            stashInitialSize: 128, // 缓存大小4m
            lazyLoad: false,
            lazyLoadMaxDuration: 3 * 60,
            autoCleanupSourceBuffer: true, // 自动清除缓存
            autoCleanupMaxBackwardDuration: 35 * 60,
            autoCleanupMinBackwardDuration: 30 * 60,
            reuseRedirectedURL: true // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
          } // flv.js可选配置项 [flv.js配置](https://github.com/bilibili/flv.js/blob/master/docs/api.md#config)
        })
        this.player.once('canplay', () => {})
        this.player.once('error', () => {
          if (this.player) {
            console.log('replay')
            this.player.replay()
          }
          return
        })
        this.player.once('pause', () => {
          console.log('pause播放暂停')
          if (this.player) {
            this.player.replay()
          }
        })
        this.player.once('canplaythrough', () => {
          console.log('可流畅播放')
        })
        this.player.once('volumechange', (res) => {
          // console.log('音量变化', res)
        })
        // 检测画面是否卡死。如果decodedFrames不再发生变化,就销毁掉该实例并进行重新连接。这个函数基本是1秒执行一次的。
        this.player.on('statistics_info', function (res) {
          if (_this.lastDecodedFrame === 0) {
            _this.lastDecodedFrame = res.decodedFrames
            return
          }
          if (_this.lastDecodedFrame !== res.decodedFrames) {
            _this.lastDecodedFrame = res.decodedFrames
            _this.lastCurrentTime = (_this.player?.currentTime || 0) // 最后的时间
            _this.sameCount = 0
          } else {
            _this.sameCount++
            console.log('decodedFrames没有发生变化第', _this.sameCount, '次。时间：', new Date())

            if (_this.sameCount > 5) {
              // decodedFrames10次不变，则判断为画面卡死，销毁实例进行重连
              console.log('画面卡死，进行重连————————', '时间', new Date())
              _this.lastDecodedFrame = 0
              _this.sameCount = 0

              if (_this.player) {
                _this.currentTime = 0
                _this.lastCurrentTime = 0
                _this.player.destroy() // 销毁
                _this.initPlayer() // 重连
              }
            }
          }
          // console.log('最后的时间：', _this.lastCurrentTime, '   10秒前的时间：', _this.currentTime)
        })
        // //优化延迟
        setTimeout(() => {
          this.timer2 = setInterval(() => {
            // console.log('缓冲区末尾', this.player.getBufferedRange()[1], '当前位置：', this.player.currentTime)
            if (this.player && this.player?.getBufferedRange()[1]) {
              const end = this.player.getBufferedRange()[1]
              const diff = end - (this.player?.currentTime || 0)// 获取buffered与currentTime的差值
              if (diff >= 1) { // 如果差值大于等于3 手动跳帧 这里可根据自身需求来定
                this.player.currentTime = this.player.getBufferedRange()[1]// 手动跳帧
                console.log('优化延迟，手动跳帧，时间：', new Date())
              }
            }
          }, 2000) // 2000毫秒执行一次
        }, 3000)
      })
    },
    play() {
    },
    destroyPlayer() {
      if (this.player) { // 如果有实例，就销毁
        this.player.destroy() // 销毁
        console.log('播放器销毁')
        this.player = null
      }
      // if (Object.keys(this.playerSdk).length > 0) {
      //   const dom = document.querySelector('#myVideo')
      //   dom.innerHTML = ''
      //   this.playerSdk.destroy()
      // }
    },
    onhandleVolumeChange(res) {
      // console.log(this.player.volume, '播放器音量')
      if (this.player && this.isPlay) {
        this.player.video.muted = false
        const volume = Number((res / 100).toFixed(1))
        this.player.volume = volume
        console.log(volume, 'volume', this.player)
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
      z-index: 3;
      .liveRoomStateTime {
        font-size: 16px;
        margin-top: 8px;
        font-weight: 400;
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
  #myVideo {
    width: 100%;
    height: 100%!important;
    // padding-top: 0!important;
    // background: #010001;
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
  .xgplayer-play {
    display: none;
  }
}
</style>
