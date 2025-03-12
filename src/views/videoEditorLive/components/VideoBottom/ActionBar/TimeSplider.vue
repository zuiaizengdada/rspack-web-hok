<template>
  <div class="time-splider flex items-center">
    <span class="mr-2">刻度表</span>
    <img :src="spliderIcons[1]" class="cursor-pointer" @click="handleClickSpliderSub" />
    <el-slider
      v-model="zoom"
      :min="1"
      :max="20"
      style="width: 200px"
      :show-tooltip="false"
      @input="changeSliderNum"
    />
    <img :src="spliderIcons[0]" class="cursor-pointer" @click="handleClickSpliderAdd" />
  </div>
</template>
<script>
import hotkeys from 'hotkeys-js'
import AddIcon from '../../../icons/zengjia_icon.svg'
import SubIcon from '../../../icons/jianshao_icon.svg'
export default {
  data() {
    return {
      zoom: 16,
      spliderIcons: [AddIcon, SubIcon],
      isActiveHotkeysA: false,
      scrollPercent: 0
    }
  },
  inject: ['video', 'updateActiveSliderInfo'],
  computed: {
    getSeekTime() {
      return this.video.seekTime
    }
  },
  watch: {
    getSeekTime() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.totalVideoDuration
      const durationTotal = duration * currentZoomSectionWidth
      const $tracksBox = document.querySelector('.video-bottom-container .tracks-box')
      const scrollLeft = $tracksBox.scrollLeft
      this.scrollPercent = scrollLeft / durationTotal
    }
  },
  mounted() {
    this.initMousewheel()
    hotkeys('*', { keyup: true }, (e) => {
      if (hotkeys.alt) {
        e.preventDefault()
        this.isActiveHotkeysA = e.type === 'keydown'
      }
    })
  },
  methods: {
    initMousewheel() {
      document.addEventListener('mousewheel', (e) => {
        if (this.isActiveHotkeysA) {
        // 向上滚动,缩小刻度表
          if (e.wheelDeltaY < 0) {
            this.handleClickSpliderSub()
          } else {
            // 向下滚动，放大刻度表
            this.handleClickSpliderAdd()
          }
        }
        this.isActiveHotkeysA = false
      })
    },
    changeSliderNum() {
      // 获取当前刻度表的值，总等级为1-20级
      const num = 21 - this.zoom // 获取当前实际的等级
      this.updateActiveSliderInfo(num)
      const $tracksBox = document.querySelector('.video-bottom-container .tracks-box')
      const scrollLeft = $tracksBox.scrollLeft
      if (scrollLeft > 0) {
        const currentTime = this.video.currentTime
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const documentWidth = document.body.clientWidth
        const scrollMoveX = currentTime * currentZoomSectionWidth - documentWidth / 2
        // const scrollMoveX = (currentTime - ss) * speed
        // const duration = this.video.detail.duration
        //  const currentScroll = duration * currentZoomSectionWidth * this.scrollPercent
        $tracksBox.scrollTo(scrollMoveX, 0)
      }
    },
    // 刻度表相减，最小为1，不执行
    handleClickSpliderSub() {
      if (this.zoom === 1) return false
      this.zoom = this.zoom - 1
      this.changeSliderNum()
    },
    // 刻度表相加 大为20
    handleClickSpliderAdd() {
      if (this.zoom === 20) return false
      this.zoom = this.zoom + 1
      this.changeSliderNum()
    }
  }
}
</script>
<style lang="scss" scoped>
.time-splider {
    border-left:1px solid #000;
    padding-right: 24px;
    color: #d9d9d9;
    font-size: 14px;
    padding-left:24px;
    margin-left:24px;
    height:24px;
    img {
    margin: 0 10px;
    }
}
::v-deep .el-slider__bar,
::v-deep .el-slider__runway {
  height: 4px;
}
::v-deep .el-slider__button {
  width: 14px;
  height: 20px;
  border-radius: 0;
  border:none;
  position: relative;
  background: url('../../../icons/huakuai.svg') no-repeat;
  &:hover{
   transform: scale(1);
  }
}

</style>
