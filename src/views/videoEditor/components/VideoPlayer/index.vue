<template>
  <div class="play-container" style="height: 100%">
    <h4 class="player-name flex items-center">{{ videoName }}</h4>
    <div class="player-content flex justify-center items-center">
      <div id="player" />
      <div v-show="visibleSubtitle" class="player-subtitle" :style="{fontSize:subtitleSize+'px'}">{{ currentSubtitle }}</div>
    </div>
    <div class="controls flex  justify-center items-center">
      <p class="icons flex items-center justify-center">
        <img :src="icons[0]" @click="handleClickSeek('prev')" />
        <img v-show="!isPlay" id="play" :src="icons[2]" @click="handleClickPause" />
        <img v-show="isPlay" id="pause" :src="icons[3]" @click="handleClickPlay" />
        <img :src="icons[1]" @click="handleClickSeek('next')" />
      </p>

      <div class="speed flex items-center">
        <MVolume v-model="volume" class="m-r-16" @change="onhandleVolumeChange" />
        <div v-if="video.detail.isEmptyMirror!==1" class="subtitle">
          <img v-if="visibleSubtitle" :src="subtitleIconOn" @click="visibleSubtitle=false" />
          <img v-else :src="subtitleIconOff" @click="visibleSubtitle=true" />
        </div>
        <div v-else>
          <svg-icon icon-class="isEmptyMirror" class="isEmptyMirror" />
        </div>
        <p>倍速</p>
        <el-select v-model="playSpeed" size="mini" class="select-speed" @change="handleChangeSpeed">
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
import hotkeys from 'hotkeys-js'
import playIcon from '../../icons/bofang_icon.svg'
import backIcon from '../../icons/houtui_icon.svg'
import pauseIcon from '../../icons/zanting_icon.svg'
import prevIcon from '../../icons/kuaijin_icon.svg'
import subtitleIconOff from '../../icons/zimu_icon_n.svg'
import subtitleIconOn from '../../icons/zimu_icon_s.svg'
import { speedList } from './constants'
import MVolume from '@/components/global/volume/volume.vue'
import { qryShortcutKey } from '../../api/keyboard'
export default {
  components: {
    MVolume
  },
  data() {
    return {
      isPlay: false,
      playerSdk: {},
      playSpeed: 1,
      playSpeedList: speedList,
      subtitleIconOn,
      subtitleIconOff,
      icons: [backIcon, prevIcon, playIcon, pauseIcon],
      videoName: '',
      visibleSubtitle: true,
      currentSubtitle: '',
      subtitleSize: 16,
      volume: 0
    }
  },
  inject: [
    'video',
    'updateVideoInfo',
    'updateVideoStatus',
    'updateVideoSeekTime',
    'updateVideoCurrentTime',
    'updateVideoSpeed',
    'updateActiveKeyBoard'
  ],
  computed: {
    getVideoSeekTime() {
      return this.video.seekTime
    },
    getVideoDetail() {
      return this.video.detail
    },
    getActiveSubtitleItemIndex() {
      return this.video.activeSubtitleItemIndex
    },
    getSubtitleList() {
      return this.video.subtitleList
    },
    getLayoutMoveData() {
      return this.video.layoutMoveData
    },
    getAssitTrackTime() {
      return this.video.assitTrackTime
    },
    getVideoActiveKeyboardArr() {
      return this.video.keyBoardArr
    },
    getVideoSpeed() {
      return this.video.speed
    },
    getVideoStatus() {
      return this.video.status
    }
  },
  watch: {
    getVideoSeekTime: {
      handler(val) {
        this.videoSeek(val)
      },
      deep: true
    },
    getVideoDetail(val) {
      this.initPlay()
      console.log(this.video.detail, '视频详情')
      this.videoName = val.name
    },
    getActiveSubtitleItemIndex(val) {
      console.log(val, '当前选中的字幕')
      const subtitleList = this.video.subtitleList
      if (val > 0) {
        this.currentSubtitle = subtitleList[val].content
        const eleDom = `<div id='newCurrentSubtitle' style="fontSize:${this.subtitleSize}px;position: absolute;bottom:20px;left:50%;transform: translateX(-50%);padding:4px 10px;color:#fff;font-size:16px;line-height: 24px;text-align: center;letter-spacing: 1.6px;border-radius: 4px;background: rgba(0,0,0,0.4);-webkit-text-stroke: 0px #333333;text-stroke: 0px #333333;">${this.currentSubtitle}</div>`
        // 删除id为newCurrentSubtitle的dom节点
        const $newCurrentSubtitle = document.getElementById('newCurrentSubtitle')
        $newCurrentSubtitle && $newCurrentSubtitle.remove()
        // 删除class叫player-subtitle的节点
        const $playerSubtitle = document.querySelector('.player-subtitle')
        $playerSubtitle && $playerSubtitle.remove()
        // 找到id为player的dom节点 在他的子级的子级插入节点
        const $player = document.getElementById('player')
        this.$nextTick(() => {
          $player.children[0].insertAdjacentHTML('beforeend', eleDom)
        })
      }
    },
    getSubtitleList(val) {
      this.currentSubtitle = val[0]?.content
    },
    getLayoutMoveData(val) {
      if (val) {
        const documentHeight = document.body.clientHeight
        const height = documentHeight - val.videoEditBottomHight
        this.subtitleSize = height > 400 ? 16 : 14
      }
    },
    getAssitTrackTime(val) {
      this.assitVideoSeek(val)
    },
    getVideoActiveKeyboardArr(arr) {
      console.log(arr, '快捷键更换。。。。')
      if (arr.length) {
        this.unbindHotkeys(arr)
        this.initHotKeys()
        // this.updateActiveKeyBoard([])
      }
    },
    getVideoSpeed(val) {
      this.playSpeed = val
    },
    getVideoStatus(val) {
      if (val === 'pause') {
        this.handleClickPlay()
      }
    }
  },
  destroyed() {
    this.clearPlayer()
  },
  mounted() {
    this.initHotKeys()
    document.onkeydown = (e) => {
      const el = e || event || window.event
      if (el.keyCode === 32) {
        const activeMarkItemIndex = this.video.activeMarkItemIndex
        if (activeMarkItemIndex > -1) {
          hotkeys('space', (e) => {
            e.preventDefault()
            if (!this.isPlay) {
              this.handleClickPause()
            }
          })
        }
      }
    }
  },
  methods: {
    unbindHotkeys(arr) {
      if (arr.length) {
        arr.forEach(item => {
          hotkeys.unbind(item)
        })
      }
    },
    async initHotKeys() {
      const { data } = await qryShortcutKey()
      const { multiplyPlay } = data
      hotkeys(multiplyPlay, (e) => {
        e.preventDefault()
        const speedItem = speedList.filter(item => {
          return item.value === this.playSpeed
        })
        let level = speedItem[0].level
        if (level === 5) {
          level = -1
        }
        const speedValue = speedList[level + 1].value
        this.playSpeed = speedValue
        this.handleChangeSpeed(speedValue)
      })
    },
    initPlay() {
      const { videoUrl } = this.video.detail
      this.clearPlayer()
      // eslint-disable-next-line no-undef
      const playerSdk = new VePlayer({
        id: 'player',
        url: videoUrl,
        ignores: ['sdkUnmutePlugin', 'loading', 'enter', 'currentTime', 'volume'],
        // controls: true,
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
        this.updateVideoInfo(player, '播放中回调')
        this.playerSdk = playerSdk.getPlayerInstance()
      })
      playerSdk.on('canplay', (player) => {
        this.volume = player.volume * 100
        this.updateVideoInfo(player, '允许播放回调')
      })
      playerSdk.on('timeupdate', (player) => {
        // console.log(player, 'fffe')
        // this.updateVideoCurrentTime(player.currentTime, '播放器播放。。。')
      })
      playerSdk.on('seeked', (player) => {
        const isActiveAssistLine = this.video.isActiveAssistLine
        if (!isActiveAssistLine) {
          const currentTime = player.currentTime === 0.1 ? 0 : player.currentTime
          this.updateVideoSeekTime(currentTime, '播放器跳帧播放2.。。。')
        }
      })
      playerSdk.on('play', (player) => {
        this.updateVideoInfo(player)
        const currentTime = this.video.currentTime
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const $tracksBox = document.querySelector('.tracks-box')
        const $seekerContainer = document.querySelector('.seeker-container')
        const seekerLeft = $seekerContainer.getBoundingClientRect().left
        const currentPx = currentTime * currentZoomSectionWidth
        if (seekerLeft < 0) {
          $tracksBox.scrollTo(currentPx, 0)
        }
        if (this.video.status === 'ending') {
          $tracksBox.scrollTo(0, 0)
        }
        this.updateVideoStatus('playing')
        this.isPlay = true
        console.log(player, '播放')
        if (player.currentTime > 0) {
          // const currentPlayTime = Number(player.currentTime).toFixed(1)
          this.updateVideoCurrentTime(player.currentTime, '播放器播放。。。')
        }

        //  this.updateVideoSeekTime(currentTime, '播放器跳帧播放2.。。。')
        // this.playSpeed = 1
        // this.handleChangeSpeed(1)
      })
      playerSdk.on('pause', (player) => {
        this.updateVideoInfo(player)
        this.updateVideoStatus('pause')
        console.log(player, '暂停')
        if (player.currentTime > 0) {
          // const currentPlayTime = Number(player.currentTime).toFixed(1)
          this.updateVideoCurrentTime(player.currentTime, '播放器播放。。。')
        }
        this.isPlay = false
      })
      playerSdk.on('ended', (player) => {
        this.updateVideoInfo(player, '结束回调')
        this.updateVideoStatus('ending')
        this.isPlay = false
        // 待优化，播放完后播放时间会清零
        this.updateVideoCurrentTime(0)
      })
    },
    clearPlayer() {
      this.playerSdk?.destroy && this.playerSdk.destroy()
      this.isPlay = false
      const dom = document.querySelector('#player')
      dom && (dom.innerHTML = '')
    },
    handleClickPlay() {
        this.playerSdk?.pause && this.playerSdk.pause()
        this.updateVideoStatus('pause')
        this.isPlay = false
    },
    handleClickPause() {
      this.playerSdk.play()
      this.updateVideoStatus('playing')
      this.isPlay = true
    },
    videoSeek(time) {
      if (Object.keys(this.playerSdk).length) {
        this.handleClickPlay()
        this.playerSdk?.seek && this.playerSdk.seek(time, 'pause')
        this.updateVideoSeekTime(time, '播放器跳帧播放...')
      }
    },
    assitVideoSeek(time) {
      if (Object.keys(this.playerSdk).length) {
        this.playerSdk.seek(time, 'pause')
      }
    },
    handleClickSeek(type) {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const n = type === 'next' ? currentZoomSectionWidth : -currentZoomSectionWidth
      const time = this.video.currentTime
      const moveTime = (time * currentZoomSectionWidth + Number(n)) / currentZoomSectionWidth
      if (moveTime < 0) return false
      this.videoSeek(moveTime)
    },
    handleChangeSpeed(val) {
      this.playerSdk.playbackRate = val
      this.updateVideoSpeed(val)
    },
    onhandleVolumeChange(val) {
      if (this.playerSdk) {
        const voulume = Number((val / 100).toFixed(3))
        if (voulume !== 0) {
          this.playerSdk.volume = voulume
        } else {
          this.playerSdk.volume = 0
          this.playerSdk.muted = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .play-container {
    min-width: 300px;
    background: #000000;
    .player-name{
      height: 40px;
      color: #D9D9D9;
      padding-left: 10px;
      background: #1E1F1E;
      border-bottom:1px solid #000;
      font-size:16px;
    }
    .player-content {
      height: calc(100% - 80px);
      position: relative;
      // background:url(../../icons/video-bg.png);
      width:100%;
      #player {
        width: 100%;
        height: 100%;
      }
      .player-subtitle{
        position: absolute;
        bottom:20px;
        left:50%;
        transform: translateX(-50%);
        padding:4px 10px;
        color:#fff;
        font-size:16px;
        line-height: 24px;
        text-align: center;
        // width: 100%;
        letter-spacing: 1.6px;
        border-radius: 4px;
        background: rgba(0,0,0,0.4);
       -webkit-text-stroke: 0px #333333;
        text-stroke: 0px #333333;
      }
      .player-subtitle1{
        z-index: 9999;
      }
    }
    .controls {
      background: #000;
      height: 40px;
      width: 100%;
      position: relative;
      .icons {
        height: 100%;
        img {
          font-size: 32px;
          color: #fff;
          margin: 0 20px;
          cursor: pointer;
        }
      }
      .speed {
        position: absolute;
        right: 0;
        top: 50%;
        color: #d9d9d9;
        font-size: 12px;
        padding-right: 24px;
        transform: translateY(-50%);
        p {
          margin-right: 16px;
        }
        .subtitle{
          margin-right:14px;
          img{
            cursor: pointer;
          }
        }
        .isEmptyMirror{
          margin-right:14px;
          font-size: 24px;
        }
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
  ::v-deep .el-input--mini .el-input__icon{
    line-height: 24px;
  }
  ::v-deep .el-select .el-input.is-focus .el-input__inner{
    border-color: #4d4d4d;
  }
  ::v-deep .el-select .el-input .el-select__caret {
    font-size: 12px;
  }
  ::v-deep {
    .xgplayer-start {
      display: none;
    }
    .xgplayer{
      background: #1E1F1E;
    }
  }

</style>
