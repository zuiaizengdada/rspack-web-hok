<template>
  <div class="sub-line-container absolute">
    <div class="move-line" @mousedown="mousedownFun" />
    <p v-show="isMove" class="sub-line" :style="{top: -sublineOffsetTop + 'px',height:sublineOffsetTop+'px'}">
      <span class="flex items-center justify-center">{{ currentMoveTime }}</span>
    </p>
  </div>
</template>
<script>
import { getFormatSSS } from '../../../utils'
export default {
  inject: ['video'],
  props: {
    cutX: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isMove: false,
      currentCutPointX: 0,
      currentMoveTime: 0,
      sublineOffsetTop: 0
    }
  },
  computed: {
    getLayoutMoveData() {
      return this.video.layoutMoveData
    }
  },
  watch: {
    cutX(val) {
      this.currentCutPointX = val
    },
    getLayoutMoveData() {
      this.getSubLineOffsetTop()
    }
  },
  mounted() {
    this.getSubLineOffsetTop()
  },
  methods: {
    getSubLineOffsetTop() {
      const $frameContainer = document.querySelector('.frame-container')
      const $frameContainerOffsetTop = $frameContainer.offsetTop - 34
      this.sublineOffsetTop = $frameContainerOffsetTop
    },
    mousedownFun() {
      this.isMove = true
      this.$emit('mdown', this.index)
      this.initMousemove()
    },
    mousemoveFun(e) {
      if (this.isMove) {
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const moveX = Number((this.currentCutPointX + e.movementX).toFixed(3))
        this.currentMoveTime = getFormatSSS((moveX / currentZoomSectionWidth) * 1000)
        this.$emit('move', { moveX, isMoveLeft: e.movementX < 0, index: this.index })
      }
    },
    mouseupFun() {
      this.isMove = false
      this.$emit('mup')
      this.destoryMousemove()
    },
    initMousemove() {
      const $contentRight = document.querySelector('.video-edit-container .content-right')
      $contentRight.addEventListener('mousemove', this.mousemoveFun)
      $contentRight.addEventListener('mouseup', this.mouseupFun)
    },
    destoryMousemove() {
      const $contentRight = document.querySelector('.video-edit-container .content-right')
      $contentRight.removeEventListener('mousemove', this.mousemoveFun)
      $contentRight.removeEventListener('mouseup', this.mouseupFun)
      // this.isMove = false
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-line-container{
    position: absolute;
    top: 0;
    right: -11px;
    width: 20px;
    height: 100%;
    z-index: 10;

    .move-line{
        width: 100%;
        height: 100%;
        cursor: e-resize;
        position: relative;
        z-index: 2;

       // background: #000;
    }
    .sub-line{
        position: absolute;
        left:10px;
        width:1px;
        border-right:1px dashed #fff;
        span{
            position: absolute;
            width: 88px;
            height: 28px;
            left:0px;
            top:-32px;
            background: #2F2F2F;
            box-shadow: 0px 4px 6px 0px rgba(0,0,0,0.3);
            border-radius: 4px;
            color: #D9D9D9;
            font-size: 12px;
        }
    }
}
</style>
