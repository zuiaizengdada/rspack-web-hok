<template>
  <div
    class="shape"
    :class="{ active }"
    :ref="`shape${index}`"
    :id="`shape${index}`"
    @click="selectCurComponent"
    @mousedown="handleMouseDownOnShape"
  >
    <!-- <span
      v-show="isActive()"
      class="iconfont icon-xiangyouxuanzhuan"
      @mousedown="handleRotate"
    ></span> -->
    <!-- <span v-show="element.isLock" class="iconfont icon-suo"></span> -->
    <div v-show="active" class="delBtn" @click="deleteComponent()">
      <img :src="fileEditDetel" class="shapeDel" />
    </div>
    <div
      v-for="item in getPointList()"
      :key="item"
      class="shape-point"
      :style="getPointStyle(item)"
      @mousedown="handleMouseDownOnPoint(item, $event)"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import eventBus from './utils/eventBus'
import runAnimation from './utils/runAnimation'
import { mapState } from 'vuex'
import calculateComponentPositonAndSize from './utils/calculateComponentPositonAndSize'
import { mod360 } from './utils/translate'
import { isPreventDrop } from './utils/utils'
import fileEditDetel from '@/assets/image/oa/fileEditDetel.png'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    element: {
      required: true,
      type: Object,
      default: () => {}
    },
    defaultStyle: {
      required: true,
      type: Object,
      default: () => {}
    },
    index: {
      required: true,
      type: [Number, String],
      default: 0
    },
    pageNum: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'], // 八个方向
      pointList2: ['r', 'l'], // 左右两个方向
      initialAngle: {
        // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315
      },
      angleToCursor: [
        // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' }
      ],
      cursors: {},
      fileEditDetel,
      shapeStartX: 0,
      shapeStartY: 0,
      initialMouseX: 0,
      initialMouseY: 0,
      isShapeRagging: false,
      pdfEditorContainerDom: null,
      shapeRef: null
    }
  },
  computed: {
    ...mapState({
      editor: state => state.oaManage.editor,
      curComponent: state => state.oaManage.curComponent
    })
  },
  mounted() {
    this.shapeRef = this.$refs[`shape${this.index}`]
    // 用于 Group 组件
    if (this.curComponent) {
      this.cursors = this.getCursor() // 根据旋转角度获取光标位置
    }
    this.pdfEditorContainerDom = document.getElementById(
      `pdfEditor${this.pageNum}`
    )
    eventBus.$on('runAnimation', () => {
      if (this.element == this.curComponent) {
        runAnimation(this.$el, this.curComponent.animations)
      }
    })
    eventBus.$on('stopAnimation', () => {
      this.$el.classList.remove('animated', 'infinite')
    })
  },
  methods: {
    getPointList() {
      return this.element.component === 'line-shape'
        ? this.pointList2
        : this.pointList
    },

    isActive() {
      return this.active && !this.element.isLock
    },

    // 处理旋转
    handleRotate(e) {
      this.$store.commit('oaManage/setClickComponentStatus', true)
      e.preventDefault()
      e.stopPropagation()
      // 初始坐标和初始角度
      const pos = { ...this.defaultStyle }
      const startY = e.clientY
      const startX = e.clientX
      const startRotate = pos.rotate

      // 获取元素中心点位置
      const rect = this.$el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // 旋转前的角度
      const rotateDegreeBefore =
        Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

      // 如果元素没有移动，则不保存快照
      let hasMove = false
      const move = moveEvent => {
        hasMove = true
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        // 旋转后的角度
        const rotateDegreeAfter =
          Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
        // 获取旋转的角度值
        pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore
        // 修改当前组件样式
        this.$store.commit('oaManage/setShapeStyle', pos)
      }

      const up = () => {
        hasMove && this.$store.commit('oaManage/recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        this.cursors = this.getCursor() // 根据旋转角度获取光标位置
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    getPointStyle(point) {
      const { width, height } = this.defaultStyle
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0

      // 四个角的点
      if (point.length === 2) {
        newLeft = hasL ? 0 : width
        newTop = hasT ? 0 : height
      } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT ? 0 : height
        }

        // 左右两边的点，高度居中
        if (hasL || hasR) {
          newLeft = hasL ? 0 : width
          newTop = Math.floor(height / 2)
        }
      }

      const style = {
        marginLeft: '-4px',
        marginTop: '-4px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: this.cursors[point]
      }

      return style
    },

    getCursor() {
      const { angleToCursor, initialAngle, pointList, curComponent } = this
      const rotate = mod360(curComponent.style.rotate) // 取余 360
      const result = {}
      let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

      pointList.forEach(point => {
        const angle = mod360(initialAngle[point] + rotate)
        const len = angleToCursor.length
        // eslint-disable-next-line no-constant-condition
        while (true) {
          lastMatchIndex = (lastMatchIndex + 1) % len
          const angleLimit = angleToCursor[lastMatchIndex]
          if (angle < 23 || angle >= 338) {
            result[point] = 'nw-resize'

            return
          }

          if (angleLimit.start <= angle && angle < angleLimit.end) {
            result[point] = angleLimit.cursor + '-resize'

            return
          }
        }
      })

      return result
    },
    deleteComponent() {
      this.$store.commit('oaManage/deleteComponent')
    },
    toRollListElement() {
      this.$nextTick(() => {
        const listElement = document.getElementById(
          `rightFormItem${this.index}`
        )
        if (listElement) {
          listElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    handleMouseDownOnShape(e) {
      console.log(e, '鼠标点击++++++++')
      // 获取编辑器元素
      this.$store.commit(
        'oaManage/getEditor',
        `pdfEditor${this.element.pageNum}`
      )
      // 将当前点击组件的事件传播出去，目前的消费是 VText 组件 https://github.com/woai3c/visual-drag-demo/issues/90
      this.$nextTick(() => eventBus.$emit('componentClick'))

      this.$store.commit('oaManage/setInEditorStatus', true)
      this.$store.commit('oaManage/setClickComponentStatus', true)
      if (isPreventDrop(this.element.component)) {
        e.preventDefault()
      }

      e.stopPropagation()
      console.log(this.index, '+++++index')
      this.$store.commit('oaManage/setCurComponent', {
        component: this.element,
        index: this.index
      })
      //列表滚动到对应位置
      this.toRollListElement()

      if (this.element.isLock) return
      this.isShapeRagging = true
      this.cursors = this.getCursor() // 根据旋转角度获取光标位置
      const pos = { ...this.defaultStyle }
      const startY = e.clientY
      const startX = e.clientX
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startTop = Number(pos.top)
      const startLeft = Number(pos.left)

      // 如果元素没有移动，则不保存快照
      let hasMove = false
      const move = moveEvent => {
        hasMove = true
        if (!this.isShapeRagging) return
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        // 限制元素在容器内
        const maxLeft =
          this.pdfEditorContainerDom.clientWidth - this.shapeRef.clientWidth
        const maxTop =
          this.pdfEditorContainerDom.clientHeight - this.shapeRef.clientHeight
        let newLeft = curX - startX + startLeft
        let newTop = curY - startY + startTop
        if (newLeft < 0) newLeft = 0
        if (newTop < 0) newTop = 0
        if (newLeft > maxLeft) newLeft = maxLeft
        if (newTop > maxTop) newTop = maxTop
        // const curX = moveEvent.clientX
        // const curY = moveEvent.clientY
        // pos.top = curY - startY + startTop
        // pos.left = curX - startX + startLeft
        pos.top = newTop
        pos.left = newLeft
        // 修改当前组件样式
        this.$store.commit('oaManage/setShapeStyle', pos)
        // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
        // 如果不使用 $nextTick，吸附后将无法移动
        // this.$nextTick(() => {
        // 触发元素移动事件，用于显示标线、吸附功能
        // 后面两个参数代表鼠标移动方向
        // curY - startY > 0 true 表示向下移动 false 表示向上移动
        // curX - startX > 0 true 表示向右移动 false 表示向左移动
        // eventBus.$emit('move', curY - startY > 0, curX - startX > 0)
        // })
      }

      const up = () => {
        this.isShapeRagging = false
        hasMove && this.$store.commit('oaManage/recordSnapshot')
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.$emit('unmove')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    selectCurComponent(e) {
      // 阻止向父组件冒泡
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('oaManage/hideContextMenu')
      // 打开右侧组件列表
      if (!this.$store.state.rightList) {
        this.$store.commit('oaManage/isShowRightList')
      }
    },

    handleMouseDownOnPoint(point, e) {
      console.log(e, '鼠标点击2++++++++')
      // 获取编辑器元素
      this.$store.commit(
        'oaManage/getEditor',
        `pdfEditor${this.element.pageNum}`
      )

      // 将当前点击组件的事件传播出去，目前的消费是 VText 组件 https://github.com/woai3c/visual-drag-demo/issues/90
      this.$nextTick(() => eventBus.$emit('componentClick'))

      this.$store.commit('oaManage/setInEditorStatus', true)
      this.$store.commit('oaManage/setClickComponentStatus', true)
      if (isPreventDrop(this.element.component)) {
        e.preventDefault()
      }

      e.stopPropagation()
      this.$store.commit('oaManage/setCurComponent', {
        component: this.element,
        index: this.index
      })
      //列表滚动到对应位置
      this.toRollListElement()
      if (this.element.isLock) return

      const style = { ...this.defaultStyle }

      // 组件宽高比
      const proportion = style.width / style.height

      // 组件中心点
      const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2
      }

      // 获取画布位移信息
      const editorRectInfo = this.editor.getBoundingClientRect()

      // 获取 point 与实际拖动基准点的差值 @justJokee
      // fix https://github.com/woai3c/visual-drag-demo/issues/26#issue-937686285
      const pointRect = e.target.getBoundingClientRect()
      // 当前点击圆点相对于画布的中心坐标
      const curPoint = {
        x: Math.round(
          pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2
        ),
        y: Math.round(
          pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2
        )
      }

      // 获取对称点的坐标
      const symmetricPoint = {
        x: center.x - (curPoint.x - center.x),
        y: center.y - (curPoint.y - center.y)
      }

      // 是否需要保存快照
      let needSave = false
      let isFirst = true

      const needLockProportion = this.isNeedLockProportion()
      const move = moveEvent => {
        // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
        // 因此第一次点击时不触发 move 事件
        if (isFirst) {
          isFirst = false
          return
        }

        needSave = true
        const curPositon = {
          x: moveEvent.clientX - Math.round(editorRectInfo.left),
          y: moveEvent.clientY - Math.round(editorRectInfo.top)
        }
        calculateComponentPositonAndSize(
          point,
          style,
          curPositon,
          proportion,
          needLockProportion,
          {
            center,
            curPoint,
            symmetricPoint
          }
        )

        const containerRect = this.pdfEditorContainerDom.getBoundingClientRect()
        const resizableRect = this.shapeRef.getBoundingClientRect()

        // let newWidth = style.width
        // let newHeight = style.height

        // 限制宽度和高度，确保不会超过父元素边界
        if (resizableRect.left + style.width > containerRect.right - 1) {
          style.width = containerRect.right - resizableRect.left - 1
        }
        if (resizableRect.top + style.height > containerRect.bottom - 1) {
          style.height = containerRect.bottom - resizableRect.top - 1
        }

        // 下限是元素最小的宽度和高度
        const minHeight =
          this.element.style.fontSize * 2 - 6 < 5
            ? 5
            : this.element.style.fontSize * 2 - 6
        if (style.height < minHeight) {
          style.height = minHeight
        }
        this.$store.commit('oaManage/setShapeStyle', style)
      }

      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        needSave && this.$store.commit('oaManage/recordSnapshot')
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    isNeedLockProportion() {
      if (this.element.component != 'Group') return false
      const ratates = [0, 90, 180, 360]
      for (const component of this.element.propValue) {
        if (!ratates.includes(mod360(parseInt(component.style.rotate)))) {
          return true
        }
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.shape {
  position: absolute;
  outline: 1px solid #70c0ff;
  user-select: none;

  &:hover {
    cursor: move;
  }
}

.active {
  background: rgba(0, 133, 255, 0.1);
}
.delBtn {
  position: absolute;
  left: 0px;
  top: -30px;
  width: 26px;
  height: 26px;
  z-index: 1;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 2px 0 #0000000f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delBtn:hover {
  background-color: #e4e4e4;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
}

.icon-xiangyouxuanzhuan {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
  color: #59c7f9;
  font-size: 20px;
  font-weight: 600;

  &:active {
    cursor: grabbing;
  }
}

.icon-suo {
  position: absolute;
  top: 0;
  right: 0;
}
.shapeDel {
  width: 15.6px;
  height: 15.6px;
}
</style>
