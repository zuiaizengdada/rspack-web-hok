<template>
  <div class="player-container" style="position: relative;">
    <div id="videoExportPlayer" class="player-content" />
    <div class="zimu_ls">
      <span>{{ nowWzData }}</span>
    </div>
    <div class="player-bottom flex justify-between items-center">
      <div class="video-time flex items-center">
        <p class="icons flex items-center justify-center">
          <img
            v-show="!isPlay"
            id="play"
            :src="icons[0]"
            class="cursor-pointer"
            @click="handleClickPlay"
          />
          <img
            v-show="isPlay"
            id="pause"
            class="cursor-pointer"
            :src="icons[1]"
            @click="handleClickPause"
          />
        </p>
        <p
          class="times"
        >{{ currentTime }} / <span>{{ totalTime }}</span></p>
      </div>
      <div class="speed flex items-center" style="margin-right: 26px">
        <p>倍速</p>
        <el-select
          v-model="playSpeed"
          size="mini"
          class="select-speed"
          @change="handleChangeVideoSpeed"
        >
          <el-option
            v-for="item in playSpeedList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import { getWorkbenchSubtitleList } from '@/api/videoManagement/subtitleEditor'
import playIcon from '../../icons/bofang_icon.svg'
import pauseIcon from '../../icons/zanting_icon.svg'
import { speedList } from './constants'
import { getFormatHMS } from '../../utils'
import _ from 'lodash'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    src: {
      type: String,
      default: ''
    },
    videoId: {
      type: String,
      default: ''
    },
    preview: {
      type: Object,
      default: () => {}
    },
    ifPlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowWzData: '',
      zimuArr: [],
      currentTime: '00:00:00',
      totalTime: '00:00:00',
      playerSdk: {},
      playList: [],
      icons: [playIcon, pauseIcon],
      isPlay: false,
      playSpeedList: speedList,
      playSpeed: '1.0',
      videoSrc: '',
      loading: false,
      previewData: {}
    }
  },
  watch: {
    list(val) {
      // this.initPlayList(val)
    },
    // 预览参数
    preview: {
      handler(val) {
        console.log(val, '预览', this.videoSrc)
        if (val.videoUrl) {
          if (val.videoUrl !== this.videoSrc) {
            this.videoSrc = val.videoUrl
            this.previewData = val
            this.initPlayer(this.previewPlayer, val).then(() => {
              this.currentTime = getFormatHMS(val.start)
              this.totalTime = getFormatHMS(val.end)
              if (this.ifPlay) {
                this.playerSdk.seek(val.start / 1000, 'play')
              } else {
                this.isPlay = false
                this.playerSdk.seek(val.start / 1000, 'pause')
              }
            })
          } else {
            this.videoSrc = val.videoUrl
            this.previewData = val
            this.currentTime = getFormatHMS(val.start)
            this.playerSdk.seek(val.start / 1000)
            this.totalTime = getFormatHMS(val.end)
          }
        } else {
          this.currentTime = '00:00:00'
          this.totalTime = '00:00:00'
          this.isPlay = false
          this.videoSrc = ''
        }
      },
      deep: true
    }
    // src(val) {
    //   if (val) {
    //     this.videoSrc = val
    //     this.initPlayer()
    //   }
    // }
  },
  // destroyed() {
  //   this.destroyPlayer()
  // },
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
      getWorkbenchSubtitleList(params).then(res => {
        if (res.success) {
          this.zimuArr = res.data
        }
      })
    },
    initPlayer(fn, val) {
      return new Promise((resolve) => {
        this.destroyPlayer()
        // eslint-disable-next-line no-undef
        const playerSdk = new VePlayer({
          id: 'videoExportPlayer',
          url: val.videoUrl,
          width: 656,
          height: 450,
          ignores: ['sdkUnmutePlugin', 'loading', 'enter', 'currentTime'],
          controls: false,
          autoplayMuted: false,
          autoplay: false,
          start: {
            isShowPause: false,
            isShowEnd: false,
            mode: 'hide',
            disableAnimate: true
          }
        })

        playerSdk.on('player_create_finish', (player) => {
          this.playerSdk = playerSdk.getPlayerInstance()
          this.playerSdk.playbackRate = this.playSpeed
          console.log(player, '视频加载完')
          // fn && fn(val)
        })
        playerSdk.on('timeupdate', (player) => {
          // const seekLeng = this.playList.length
          this.zimuArr.some(item => {
            if ((player.currentTime >= item.startTime / 1000) && (player.currentTime <= item.endTime / 1000)) {
              this.nowWzData = item.content
            }
          })
          const currentTime = player.currentTime
          this.currentTime = getFormatHMS(currentTime * 1000)
          // 不需要循环播放，注释调此逻辑
          // if (seekLeng) {
          //   const lastItemEnd = this.playList[seekLeng - 1].end / 1000
          //   if (currentTime > lastItemEnd) {
          //     this.playerSdk.pause()
          //   }
          //   if (seekLeng > 1) {
          //     this.playList.forEach((item, index) => {
          //       if (currentTime * 1000 > item.end && !item.playing) {
          //         const nextItem = this.playList[index + 1]
          //         if (nextItem) {
          //           this.playerSdk.seek(nextItem.start / 1000)
          //           this.$emit('play', nextItem.index)
          //           item.playing = true
          //         }
          //       }
          //     })
          //   } else {
          //     this.$emit('play', this.playList[0].index)
          //   }
          // }
          // 视频1.2 新增预览逻辑，播放时间超过预览片段结束时间，播放器暂定
          const maxVideoPreviewTime = this.previewData.end / 1000
          if (currentTime > maxVideoPreviewTime) {
            this.playerSdk.pause()
          }
        })
        playerSdk.on('loadeddata', (player) => {
          console.log('切换视频')
        })
        playerSdk.on('canplay', (player) => {
          resolve()
          // this.totalTime = getFormatHMS(player.duration * 1000)
        })
        playerSdk.on('seeked', (player) => {
        })
        playerSdk.on('play', (player) => {
          this.isPlay = true
          console.log(player, '视频播放')
        })
        playerSdk.on('pause', (player) => {
          console.log(player, '视频播放暂停')
          this.isPlay = false
        })
        playerSdk.on('ended', (player) => {
          console.log(player, '视频播放结束')
        })
        const duration = this.previewData.duration * 1000
        this.totalTime = getFormatHMS(duration)
      })
    },
    previewPlayer(data) {
      this.currentTime = getFormatHMS(data.start)
      console.log(this.playerSdk, '播放', this.ifPlay)
      // if (this.ifPlay) {
      //   this.playerSdk.seek(data.start / 1000, 'play')
      // } else {
      //   this.playerSdk.seek(data.start / 1000, 'pause')
      // }
      // this.playerSdk.seek(data.start / 1000, 'pause')
      this.totalTime = getFormatHMS(data.end)
    },
    initPlayList(list) {
      this.playList = _.sortBy(list, (item) => {
        return item.start
      })
      if (this.playList.length) {
        const firstItem = this.playList[0]
        this.currentTime = getFormatHMS(firstItem.start)
        this.playerSdk.player.seek(firstItem.start / 1000)
        this.$emit('play', this.playList[0].index)
      }
    },
    destroyPlayer() {
      this.playList = []
      if (Object.keys(this.playerSdk).length > 0) {
        const dom = document.querySelector('#videoExportPlayer')
        dom.innerHTML = ''
        this.playerSdk.player.destroy()
        this.videoSrc = ''
      }
    },
    handleClickPause() {
      this.playerSdk.player.pause()
      this.isPlay = false
    },
    handleClickPlay() {
      this.loadZm()
      if (this.playerSdk && this.previewData.videoUrl) {
        this.playerSdk.player.play()
        this.isPlay = true
      }
    },
    handleChangeVideoSpeed(val) {
      this.playerSdk.playbackRate && (this.playerSdk.playbackRate = val)
    }
  }
}
</script>
<style lang="scss" scoped>
.player-content{
  // background: #1E1F1E;
  background:url(../../icons/video-bg.png);
  border: 1px solid #000000;
}
  .player-bottom {
    background: #000000;
    height: 44px;
    width: 742px;
    .icons {
      margin-left: 28px;
      margin-right: 18px;
    }
    .times {
      font-size: 16px;
      font-weight: bold;
      span {
        color: #a6a6a6;
      }
    }
    .speed {
      font-size: 12px;

      p {
        margin-right: 16px;
      }
    }
  }
  .select-speed {
    width: 76px;
    height: 24px;
  }
  ::v-deep .el-input--mini .el-input__inner {
    height: 24px;
    background: none;
    border-color: #4d4d4d;
    font-size: 12px;
    line-height: 24px;
    padding-right: 12px;
  }
  ::v-deep .el-select .el-input .el-select__caret {
    font-size: 12px;
  }
   ::v-deep {
    .xgplayer-start,.xgplayer-replay {
      display: none;
    }
  }
   ::v-deep .el-select .el-input.is-focus .el-input__inner{
    border-color: #4d4d4d;
  }
  ::v-deep .el-input--mini .el-input__icon{
    line-height: 24px;
  }
  ::v-deep .xgplayer {
    background: #1E1F1E;
  }

  .zimu_ls {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 50px;
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
