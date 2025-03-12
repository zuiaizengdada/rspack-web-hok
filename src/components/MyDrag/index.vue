<template>
  <div
    id="dragElement"
    ref="dragRef"
    class="draggable-element"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`
    }"
  >
    <slot name="default" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    w: {
      type: Number,
      default: 0
    },
    h: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  }),
  created() {},
  mounted() {
    this.$nextTick(() => this.init())
  },
  methods: {
    onreset() {
      const dragElement = this.$refs.dragRef
      window.onresize = () => {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.setclientxy(dragElement)
      }
    },
    init() {
      // 获取拖拽元素和容器
      const dragElement = this.$refs.dragRef
      const that = this
      // 监听页面拖拽
      this.onreset()
      // 定义变量记录初始位置和偏移量
      let offsetX = 0
      let offsetY = 0

      dragElement.addEventListener('dragstart', event => {
        // 取消文本复制行为
        event.preventDefault()

        // 执行其他拖拽开始时的逻辑
        // ...
      })

      // 鼠标按下事件处理函数
      function handleMouseDown(event) {
        console.log(event)
        // 计算鼠标相对于拖拽元素的偏移量
        offsetX = event.clientX - dragElement.offsetLeft
        offsetY = event.clientY - dragElement.offsetTop

        // 添加鼠标移动和鼠标放开事件监听
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        document.body.setAttribute('style', 'buser-select: none;-webkit-user-select: none;')
      }

      // 鼠标移动事件处理函数
      function handleMouseMove(event) {
        // 计算拖拽元素的新位置
        const newLeft = event.clientX - offsetX
        const newTop = event.clientY - offsetY
        // 更新拖拽元素的位置
        requestAnimationFrame(() => {
          dragElement.style.left = newLeft + 'px'
          dragElement.style.top = newTop + 'px'
        })
      }

      // 鼠标放开事件处理函数
      function handleMouseUp(event) {
        document.body.setAttribute('style', '')
        // 移除鼠标移动和鼠标放开事件监听
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        // 松开重置位置
        setclient(event)
      }

      function setclient() {
        that.setclientxy(dragElement)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      // 添加鼠标按下事件监听到拖拽元素
      dragElement.addEventListener('mousedown', handleMouseDown)
    },
    setclientxy(dragElement) {
      setTimeout(() => {
        const { left, top } = dragElement.style
        const newLeft = parseFloat(left)
        const newTop = parseFloat(top)

        const xw = this.windowWidth - this.w
        const yh = this.windowHeight - this.h

        const setStyle = (left, top) => {
          dragElement.style.left = `${Math.min(Math.max(0, left), xw)}px`
          dragElement.style.top = `${Math.min(Math.max(0, top), yh)}px`
        }

        setStyle(
          newLeft < 0 ? 0 : newLeft > xw ? xw : newLeft,
          newTop < 0 ? 0 : newTop > yh ? yh : newTop
        )
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
.draggable-element {
  right: 0;
  top: 0;
  color: #fff;
  cursor: grab;
  position: fixed;
  z-index: 3000;
  will-change: transform;
  cursor: grab;
  img {
    pointer-events: none;
  }
}
</style>
