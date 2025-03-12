<template>
  <div class="player-container">
    <div id="player" class="player-content" />
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
    preview: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
    preview(val) {
      this.previewData = val
      this.previewPlayer(val)
    },
    src(val) {
      if (val) {
        this.videoSrc = val
        this.initPlayer()
      }
    }
  },
  destroyed() {
    this.destroyPlayer()
  },
  methods: {
    initPlayer() {
      this.destroyPlayer()
      // eslint-disable-next-line no-undef
      const playerSdk = new VePlayer({
        id: 'player',
        url: this.videoSrc,
        width: 740,
        height: 415,
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

        console.log(player, '视频加载完')
      })
      playerSdk.on('timeupdate', (player) => {
        // const seekLeng = this.playList.length
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
      playerSdk.on('canplay', (player) => {
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
      const duration = this.$route.query.duration * 1000
      this.totalTime = getFormatHMS(duration)
    },
    previewPlayer(data) {
      this.currentTime = getFormatHMS(data.start)
      this.playerSdk.seek(data.start / 1000)
      this.totalTime = getFormatHMS(data.end)
    },
    initPlayList(list) {
      this.playList = _.sortBy(list, (item) => {
        return item.start
      })
      if (this.playList.length) {
        const firstItem = this.playList[0]
        this.currentTime = getFormatHMS(firstItem.start)
        this.playerSdk.seek(firstItem.start / 1000)
        this.$emit('play', this.playList[0].index)
      }
    },
    destroyPlayer() {
      this.playList = []
      if (Object.keys(this.playerSdk).length > 0) {
        const dom = document.querySelector('#player')
        dom.innerHTML = ''
        this.playerSdk.destroy()
      }
    },
    handleClickPause() {
      this.playerSdk.pause()
      this.isPlay = false
    },
    handleClickPlay() {
      this.playerSdk.play()
      this.isPlay = true
    },
    handleChangeVideoSpeed(val) {
      this.playerSdk.playbackRate = val
    }
  }
}
</script>
<style lang="scss" scoped>
.player-content{
  padding:40px 0;
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
</style>
