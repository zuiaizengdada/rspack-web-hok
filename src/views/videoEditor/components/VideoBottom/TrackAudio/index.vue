<template>
  <div class="track-audio-container" style="height:128px;" :style="{width:width+'px'}">
    <p v-loading="loading" class="audio-loading" element-loading-text="音频加载中。。。" />
    <div id="trackAudio" class="track-audio" />
  </div>
</template>
<script>
import Wavesurfer from 'wavesurfer.js'
export default {
  data() {
    return {
      audio: {},
      loading: false,
      width: 0
    }
  },
  computed: {
    getVideoStatus() {
      return this.video.status
    },
    getVideoDetail () {
      return this.video.detail
    },
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    },
    getSeekTime () {
      return this.video.seekTime
    },
    getVideoSpeed () {
      return this.video.speed
    }
  },
  watch: {
    // 同步播放暂定
    getVideoStatus(val) {
      if (val === 'playing') {
        this.audio.play()
      } else if (val === 'pause') {
        this.audio.pause()
      }
      const time = this.video.currentTime
      this.videoSeekTime(time)
    },
    getVideoDetail(val) {
      if (Object.keys(this.audio).length) {
        this.audio.destroy()
      }
      this.initAudio()
    },
    getActiveSliderInfo(val) {
      this.initWidth()
      this.setAudioZoom()
      const time = this.video.currentTime
      this.videoSeekTime(time)
    },
    // 跳跃播放
    getSeekTime(val) {
      if (val > 0) {
        this.videoSeekTime(val)
      }
    },
    // 播放速率
    getVideoSpeed(val) {
      console.log(val, 111)
      // this.audio.zoom(100)
      this.audio.setPlaybackRate(val)
    }
  },
  inject: ['video'],
  methods: {
    initAudio() {
      const sampleUrl = this.video.detail.sampleUrl
      this.initWidth()
      this.audio = Wavesurfer.create({
        container: '#trackAudio',
        waveColor: '#73aeff',
        progressColor: '#1778FF'
      })
      this.audio.load(sampleUrl)
      this.audio.setVolume(0)
      this.audio.on('ready', () => {
        this.loading = false
      })
    },
    initWidth() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.detail.duration // 视频时长
      this.width = duration * currentZoomSectionWidth
    },
    setAudioZoom() {
      if (Object.keys(this.audio).length) {
        this.audio.zoom(1)
        this.audio.drawer.setWidth(this.width)
        this.audio.drawer.updateSize()
      }
    },
    videoSeekTime(val) {
      if (Object.keys(this.audio).length) {
        const duration = this.video.detail.duration
        const seekTime = val / duration
        this.audio.seekTo(seekTime)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.track-audio-container{
    width:100%;
    height:128px;
    position: relative;
    .audio-loading{
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
        padding-left:100px;
    }
}
::v-deep .el-loading-spinner{
    left:60px;
    width:200px;
}
</style>
