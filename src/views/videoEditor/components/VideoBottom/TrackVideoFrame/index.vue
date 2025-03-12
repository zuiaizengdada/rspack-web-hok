<template>
  <div class="frame-container relative" :class="{isWidth:isWidthScreen}" :style="{width: containerWidth +'px'}" @click.stop>
    <frame-sprite ref="frameSprite" :is-width="isWidthScreen" />
    <frame-cutline ref="frameCutline" />
  </div>
</template>
<script>
import FrameCutline from './FrameCutline.vue'
import FrameSprite from './FrameSprite.vue'
export default {
  components: {
    FrameCutline,
    FrameSprite
  },
  data() {
    return {
      isWidthScreen: true, // 是否为宽屏
      containerWidth: 0 // 容器总宽度
    }
  },
  inject: ['video'],
  computed: {
    getVideoDetail() {
      return this.video.detail
    },
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    }
  },
  watch: {
    getActiveSliderInfo() {
      this.initWidth()
    },
    getVideoDetail(val) {
      this.isWidthScreen = val.width === 1920
      this.initWidth()
    }
  },
  methods: {
    handleVideoCut() {
      this.$refs.frameCutline.handleVideoCut()
    },
    cutHistoryPrev() {
      this.$refs.frameCutline.cutHistoryPrev()
    },
    cutHistoryNext() {
      this.$refs.frameCutline.cutHistoryNext()
    },
    initWidth() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.detail.duration // 视频时长
      this.containerWidth = duration * currentZoomSectionWidth
      console.log(this.containerWidth, currentZoomSectionWidth, '容器宽度')
    }
  }
}
</script>

