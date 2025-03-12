<template>
  <div ref="videoPlayer" class="videoPlayer">
    <div v-show="isPlay" id="liveKanbanVideo" />
    <div v-if="liveRoomDetail.status !== 1" class="liveRoomPoster">
      <!-- <img :src="liveRoomDetail.imgUrl" alt=""> -->
      <!-- <div class="mask" /> -->
      <div v-if="liveRoomDetail.status === 9" class="liveRoomState">
        <div>直播已结束</div>
        <div>查看更多数据，请点击直播详情。</div>
        <div class="btnGotoDetail" @click="gotoDetail">查看详情</div>
      </div>
      <div v-else-if="liveRoomDetail.status === 0" class="liveRoomState">
        <div>直播未开始</div>
        <div>暂无直播数据，请开播后再查看！</div>
      </div>
    </div>
    <div v-if="liveRoomDetail.status === 1" class="liveRoomVolume">
      <MVolume v-model="volume" @change="onhandleVolumeChange" />
    </div>
  </div>
</template>

<script>
import FlvJsPlayer from 'xgplayer-flv.js'
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
      isActive: true,
      isPlay: false, // 是否显示播放画面
      player: null, // 播放实例
      lastDecodedFrame: 0, // 最后一个decodedFrame
      lastCurrentTime: '',
      currentTime: '',
      timer: null,
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
          console.log(this.videoUrl)
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
          id: 'liveKanbanVideo',
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
    destroyPlayer() {
      if (this.player) { // 如果有实例，就销毁
        this.player.destroy() // 销毁
        console.log('播放器销毁')
      }
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
    // background: linear-gradient(90deg, #063C70 0%, #192747 100%);
    z-index: 10;
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
</style>
