<template>
  <div
    ref="resizablePane"
    class="resizable-pane"
    :class="{ 'is-dragging': isDragging }"
  >
    <div
      class="pane left-pane"
      :style="{
        width: `${leftPanePercent}%`,
        minWidth: `${minWidthLeft}px`
      }"
    >
      <slot name="one" />
    </div>
    <div
      class="resizer"
      @mousedown="startResize"
    >
      <div class="pane-trigger">
        <img
          class="dragIcon"
          src="~@/assets/image/liveRoom/drag_icon.png"
          alt=""
          draggable="false"
        />
      </div>
    </div>
    <div
      class="pane right-pane"
      :style="{
        width: `${100 - leftPanePercent}%`,
        minWidth: `${minWidthRight}px`
      }"
    >
      <slot name="two" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialRatio: {
      type: Number,
      default: 0.5
    },
    minWidthLeft: {
      type: Number,
      default: 100
    },
    minWidthRight: {
      type: Number,
      default: 375
    },
    storageKey: {
      type: String,
      default: 'resizablePaneRatio'
    }
  },

  data() {
    return {
      leftPanePercent: 50,
      isDragging: false,
      currentRatio: null,
      dragHandler: null,
      stopHandler: null
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.currentRatio = this.getSavedRatio()
      this.initSize()
      window.addEventListener('resize', this.handleResize)
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.isDragging) {
      this.cleanupDragListeners()
    }
  },

  methods: {
    getSavedRatio() {
      const saved = localStorage.getItem(this.storageKey)
      return saved ? parseFloat(saved) : this.initialRatio
    },

    saveRatio(ratio) {
      this.currentRatio = ratio
      localStorage.setItem(this.storageKey, ratio.toString())
    },

    handleResize() {
      const containerWidth = this.$refs.resizablePane.clientWidth
      const currentLeftWidth = (containerWidth * this.leftPanePercent) / 100
      const currentRightWidth = containerWidth - currentLeftWidth

      // 如果右侧小于最小宽度，先调整右侧
      if (currentRightWidth < this.minWidthRight) {
        const rightPercent = (this.minWidthRight / containerWidth) * 100
        this.leftPanePercent = Math.max(0, 100 - rightPercent)
      }

      // 如果左侧小于最小宽度，再调整左侧
      const newLeftWidth = (containerWidth * this.leftPanePercent) / 100
      if (newLeftWidth < this.minWidthLeft) {
        this.leftPanePercent = (this.minWidthLeft / containerWidth) * 100
      }

      // 保存新的比例
      this.saveRatio(this.leftPanePercent / 100)
    },

    initSize() {
      const containerWidth = this.$refs.resizablePane.clientWidth
      const ratio = this.currentRatio || this.getSavedRatio()
      this.leftPanePercent = ratio * 100
      this.handleResize() // 确保初始大小符合最小宽度限制
    },

    startResize(e) {
      e.preventDefault()

      const containerWidth = this.$refs.resizablePane.clientWidth
      const startX = e.clientX
      const startPercent = this.leftPanePercent

      this.isDragging = true

      this.dragHandler = (e) => {
        if (!this.isDragging) return

        const offsetX = e.clientX - startX
        const offsetPercent = (offsetX / containerWidth) * 100
        let newPercent = startPercent + offsetPercent

        // 计算实际宽度以检查最小宽度限制
        const leftWidth = (containerWidth * newPercent) / 100
        const rightWidth = containerWidth - leftWidth

        // 先检查右侧最小宽度
        if (rightWidth < this.minWidthRight) {
          newPercent = ((containerWidth - this.minWidthRight) / containerWidth) * 100
        }
        // 再检查左侧最小宽度
        if (leftWidth < this.minWidthLeft) {
          newPercent = (this.minWidthLeft / containerWidth) * 100
        }

        this.leftPanePercent = newPercent
      }

      this.stopHandler = () => {
        this.cleanupDragListeners()
        this.isDragging = false
        this.saveRatio(this.leftPanePercent / 100)
      }

      document.addEventListener('mousemove', this.dragHandler)
      document.addEventListener('mouseup', this.stopHandler)
    },

    cleanupDragListeners() {
      if (this.dragHandler) {
        document.removeEventListener('mousemove', this.dragHandler)
        this.dragHandler = null
      }
      if (this.stopHandler) {
        document.removeEventListener('mouseup', this.stopHandler)
        this.stopHandler = null
      }
    }
  }
}
</script>

<style scoped>
.resizable-pane {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  min-width: v-bind(minWidthLeft + minWidthRight + 20 + 'px');
}

.pane {
  height: 100%;
  overflow: hidden;
}

.left-pane {
  min-width: v-bind(minWidthLeft + 'px');
}

.right-pane {
  min-width: v-bind(minWidthRight + 'px');
}

.resizer {
  width: 20px;
  background-color: transparent;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.pane-trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dragIcon {
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.is-dragging {
  user-select: none;
}

.is-dragging .resizer {
  /* background-color: rgba(0, 0, 0, 0.1); */
}

/* 添加一个全局遮罩，防止拖动时选中文本 */
.is-dragging::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}
</style>
