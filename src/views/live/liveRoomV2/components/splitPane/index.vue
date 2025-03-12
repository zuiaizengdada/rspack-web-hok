<template>
  <div ref="splitPane" class="split-pane" :class="direction" :style="{ flexDirection: direction }">
    <div class="pane pane-one" :style="lengthType + ':' + paneLengthValue">
      <slot name="one" />
    </div>
    <div class="pane-trigger" :style="lengthType + ':' + triggerLengthValue" style="z-index: 9" @mousedown="handleMouseDown">
      <img class="dragIcon" src="~@/assets/image/liveRoom/drag_icon.png" alt="" />
    </div>
    <div class="pane pane-two" style="z-index: 1;overflow:hidden">
      <slot name="two" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'row'
    },

    min: {
      type: Number,
      default: 10
    },

    max: {
      type: Number,
      default: 90
    },

    paneLengthPercent: {
      type: Number,
      default: 50
    },

    triggerLength: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      triggerLeftOffset: 0 // 鼠标距滑动器左(顶)侧偏移量
    }
  },
  computed: {
    lengthType () {
      return this.direction === 'row' ? 'width' : 'height'
    },

    paneLengthValue () {
      return `calc(${this.paneLengthPercent}% - ${this.triggerLength / 2 + 'px'})`
    },

    triggerLengthValue () {
      return this.triggerLength + 'px'
    }
  },

  methods: {
    // 按下滑动器
    handleMouseDown (e) {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)

      if (this.direction === 'row') {
        this.triggerLeftOffset = e.pageX - e.srcElement.getBoundingClientRect().left
      } else {
        this.triggerLeftOffset = e.pageY - e.srcElement.getBoundingClientRect().top
      }
    },

    // 按下滑动器后移动鼠标
    handleMouseMove (e) {
      const clientRect = this.$refs.splitPane.getBoundingClientRect()
      let paneLengthPercent = 0

      if (this.direction === 'row') {
        const offset = e.pageX - clientRect.left - this.triggerLeftOffset + this.triggerLength / 2
        paneLengthPercent = (offset / clientRect.width) * 100
      } else {
        const offset = e.pageY - clientRect.top - this.triggerLeftOffset + this.triggerLength / 2
        paneLengthPercent = (offset / clientRect.height) * 100
      }

      if (paneLengthPercent < this.min) {
        paneLengthPercent = this.min
      }
      if (paneLengthPercent > this.max) {
        paneLengthPercent = this.max
      }
      this.$emit('update:paneLengthPercent', paneLengthPercent)
    },

    // 松开滑动器
    handleMouseUp () {
      document.removeEventListener('mousemove', this.handleMouseMove)
    }
  }
}
</script>

<style scoped lang="scss">
  .split-pane {
    // background: palegreen;
    height: 100%;
    display: flex;
    &.row {
      .pane {
        height: 100%;
      }
      .pane-trigger {
        height: 100%;
        cursor: col-resize;
      }
    }
    &.column {
      .pane {
        width: 100%;
      }
      .pane-trigger {
        width: 100%;
        cursor: row-resize;
      }
    }
    .pane-one {
      // background: lavender;
    }
    .pane-trigger {
      user-select: none;
      position: relative;
      .dragIcon {
        width: 29px;
        height: 23px;
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-user-drag: none;
        -moz-user-drag: none;
        -ms-user-drag: none;
        user-drag: none;
      }
    }
    .pane-two {
      flex: 1;
      // background: #929292;
    }
  }
</style>
