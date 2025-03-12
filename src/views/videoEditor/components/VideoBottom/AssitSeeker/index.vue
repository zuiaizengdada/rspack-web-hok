<template>
  <div ref="assit" class="assit-seeker-container" />
</template>
<script>
export default {
  inject: ['video', 'updateAssitTrackTime'],
  data() {
    return {
      isActiveAssistLine: false
    }
  },
  computed: {
    getIsActiveAssistLine() {
      return this.video.isActiveAssistLine
    }
  },
  watch: {
    getIsActiveAssistLine(val) {
      this.isActiveAssistLine = val
      if (!val) {
        this.mouseoutFun()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initAssitSeeker()
    })
  },
  methods: {
    initAssitSeeker() {
      const $tracksBox = document.querySelector('.video-bottom-container .content-right')
      $tracksBox.addEventListener('mousemove', this.mousemoveFun)
      $tracksBox.addEventListener('mouseout', this.mouseoutFun)
    },
    mousemoveFun(e) {
      if (this.isActiveAssistLine) {
        const videoPlayStatus = this.video.status
        if (videoPlayStatus === 'pause') {
          e.stopPropagation()
          const isMoveSeeker = this.video.isMoveSeeker
          if (!isMoveSeeker) {
            const $tracksBox = document.querySelector('.tracks-box') // 编辑台容器
            const scrollLeft = $tracksBox.scrollLeft
            const moveX = scrollLeft + e.clientX - 72
            this.$refs.assit.style.transform = `translateX(${moveX}px)`
          }
        // 暂时不处理辅助线联动视频及字幕
        // const speed = this.getSpeedItem()
        // const time = (moveX - 72) / speed
        // this.updateAssitTrackTime(time)
        }
      }
    },
    mouseoutFun() {
      this.$refs.assit.style.transform = `translateX(-10px)`
    }
  }
}
</script>
<style lang="scss" scoped>
.assit-seeker-container{
    position: absolute;
    top:32px;
    left:0;
    width:1px;
    background: #FF7308;
    transform: translateX(-10px);
    z-index: 100;
    bottom:0;
}
</style>
