<template>
  <div class="video-time flex items-center">
    <p class="flex items-center play-time">
      <el-input v-if="isEditPlayTime" ref="palyTime" v-model="playTime" size="mini" @blur.stop="handleBlurPlayTime" @keyup.enter.native="handleBlurPlayTime" />
      <span v-else @click.stop="handleClickEditPlayTime">{{ playTime }}</span>
    </p>
    <span class="total"> / {{ duration }}</span>
  </div>
</template>
<script>
import { getFormatSSS, formatPrTime } from '../../../utils'
export default {
  data() {
    return {
      playTime: '00:00:00.000',
      duration: '00:00:00.000',
      isEditPlayTime: false
    }
  },
  inject: ['video', 'updateVideoSeekTime'],
  computed: {
    getVideoCurrentTime() {
      return this.video.currentTime
    },
    getSeekTime() {
      return this.video.seekTime
    },
    getVideoDetail() {
      return this.video.detail
    }
  },
  watch: {
    getVideoCurrentTime(val) {
      this.playTime = getFormatSSS(val * 100 * 10)
    },
    getSeekTime(val) {
      this.playTime = getFormatSSS(val * 100 * 10)
    },
    getVideoDetail(val) {
      this.duration = getFormatSSS(val.duration * 100 * 10)
      this.playTime = '00:00:00.000'
    }
  },
  methods: {
    handleClickEditPlayTime() {
      this.isEditPlayTime = true
      this.$nextTick(() => {
        this.$refs.palyTime.focus()
      })
    },
    handleBlurPlayTime() {
      const duration = this.video.detail.duration
      let total = formatPrTime(this.playTime)
      if (total || total === 0) {
        total = total > duration ? duration : total
        this.updateVideoSeekTime(total, '播放时间修改')
        this.playTime = getFormatSSS(total * 100 * 10)
      } else {
        this.playTime = getFormatSSS(this.video.currentTime * 100 * 10)
      }
      this.isEditPlayTime = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-time {
      border-left: 1px solid #000;
      margin-left: 24px;
      padding-left:24px;
      font-size: 20px;
      line-height: 22px;
      color: #a6a6a6;
      .play-time{
        span{
          margin-right:6px;
          cursor: pointer;
        }
      }
      .total {
        color: #737373;
      }
    }
  ::v-deep .el-input--mini .el-input__inner{
    width:110px;
    line-height: 26px;
    height: 26px;
    padding:2px 6px;
    font-size:16px;
    margin-right:6px;
  }
</style>
