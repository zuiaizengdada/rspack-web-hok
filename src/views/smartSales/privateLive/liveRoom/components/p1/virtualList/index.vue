<template>
  <div :id="`${idName}_scriptConfiguration`" ref="list" :style="{height}" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div ref="phantom" class="infinite-list-phantom" />
    <div ref="content" class="infinite-list">
      <div v-for="(item) in visibleData" :id="item._index" :ref="`${idName}items`" :key="item._index" class="infinite-list-item">
        <slot ref="slot" :item="item.item" :index="Number(item._index.split('_')[1])" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualList',
  props: {
    // 所有列表数据
    listData: {
      type: Array,
      default: () => []
    },
    multipleSelection: {
      type: Array,
      default: () => []
    },
    // 预估高度
    estimatedItemSize: {
      type: Number,
      required: true
    },
    // 缓冲区比例
    bufferScale: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    },
    // 容器高度 100px or 50vh
    height: {
      type: String,
      default: '100%'
    },
    idName: {
      type: String,
      default: 'virtualList'
    }
  },
  data() {
    return {
      // 可视区域高度
      screenHeight: 0,
      // 起始索引
      start: 0,
      // 结束索引
      end: 0,
      // 偏移量
      startOffset: 0,
      timer: null,
      ifScroll: false, // 给滚动加个锁
      endTop: 0,
      startTop: 0,
      step: 0,
      downScrollObj: {
        screenX: 0,
        screenY: 0,
        index: 0,
        startNum: 0,
        endNum: 0,
        oldItem: {},
        newItem: {},
        upToDown: true
      },
      commentData: '',
      isCheckedNow: false,
      isClicked: false
    }
  },
  computed: {
    _listData() {
      return this.listData.map((item, index) => {
        return {
          _index: `${this.idName}_${index}`,
          item
        }
      })
    },
    // 视图区域实现个数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize)
    },
    // 顶部缓存
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount)
    },
    // 底部缓存数量
    belowCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount)
    },
    // 视图区数据
    visibleData() {
      const start = this.start - this.aboveCount
      const end = this.end + this.belowCount
      return this._listData.slice(start, end)
    }
  },
  watch: {
    listData: {
      handler() {
        this.initPositions()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    window.vm = this
  },
  mounted() {
    this.screenHeight = this.$el.clientHeight
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return
      }
      // 获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize()
      // 更新列表总高度
      const height = this.positions[this.positions.length - 1].bottom
      this.$refs.phantom.style.height = height + 'px'
      // 更新真实偏移量
      this.setStartOffset()
    })
  },
  methods: {
    initPositions() {
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      })
      )
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    // 获取列表起始索引
    getStartIndex(scrollTop = 0) {
      // 二分法查找
      return this.binarySearch(this.positions, scrollTop)
    },
    binarySearch(list, value) {
      let start = 0
      let end = list.length - 1
      let tempIndex = null

      while (start <= end) {
        const midIndex = parseInt((start + end) / 2)
        const midValue = list[midIndex].bottom
        if (midValue === value) {
          return midIndex + 1
        } else if (midValue < value) {
          start = midIndex + 1
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }
      return tempIndex
    },
    // 获取列表项的当前尺寸
    updateItemsSize() {
      const name = `${this.idName}items`
      const nodes = this.$refs[name]
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const height = rect.height
        const index = +node.id.slice(1)
        const oldHeight = this.positions[index].height
        const dValue = oldHeight - height
        // 存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue
          this.positions[index].height = height
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom
            this.positions[k].bottom = this.positions[k].bottom - dValue
          }
        }
      })
    },
    // 获取当前的偏移量
    setStartOffset() {
      let startOffset
      if (this.start >= 1) {
        const size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0)
        startOffset = this.positions[this.start - 1].bottom - size
      } else {
        startOffset = 0
      }
      this.startOffset = startOffset
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`
    },
    // 滚动事件
    scrollEvent() {
      // 当前滚动位置
      const scrollTop = this.$refs.list.scrollTop
      // 此时的开始索引
      this.start = this.getStartIndex(scrollTop)
      // 此时的结束索引
      this.end = this.start + this.visibleCount
      // 此时的偏移量
      this.setStartOffset()
      if (!this.ifScroll) {
        this.$emit('scrollEvent')
      }
    },
    // 滚动到节点
    scrollTo(index, fn) {
      const idName = `${this.idName}_scriptConfiguration`
      const el = document.getElementById(idName)
      this.start = index - this.aboveCount
      this.end = index + this.visibleCount + this.belowCount
      const height = this.positions[this.positions.length - 1].bottom
      this.$refs.phantom.style.height = height + 'px'
      this.setStartOffset()
      this.$nextTick(() => {
        const scrollTop = this.positions[index].bottom
        el.scrollTop = scrollTop
        this.scrollTop(index, fn)
      })
    },
    scrollTop(index, fn) {
      const idName = `${this.idName}_scriptConfiguration`
      const el = document.getElementById(idName)
      const i = this.visibleData.findIndex(v => v._index === `${this.idName}_${index}`)
      const el2 = document.getElementById(`${this.idName}_${index}`)
      if (!el) {
        return
      }
      if (i < 0 || !this.isInViewPort(el2)) {
        if (this.ifScroll) {
          return
        }
        if (this.timer) {
          this.ifScroll = false
          clearInterval(this.timer)
          this.timer = null
        }
        this.ifScroll = true
        this.endTop = this.positions[index].top - 80
        this.startTop = el.scrollTop
        const time = 10 // 时间(毫秒)
        this.step = (this.endTop - this.startTop) / time // 步进
        if (this.startTop < this.endTop) {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop >= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              if (!this.isInViewPort(el2)) {
                clearInterval(this.timer)
                this.scrollTo(index, fn)
              } else {
                this.timer = null
                fn && fn()
              }
            }
          }, 10)
        } else {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop <= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              if (!this.isInViewPort(el2)) {
                this.scrollTo(index, fn)
              } else {
                this.timer = null
                fn && fn()
              }
            }
          }, 10)
        }
      } else {
        fn && fn()
      }
    },
    // 判断视图是否在可视区域
    isInViewPort(el) {
      if (!el) {
        return false
      }
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      const { top, bottom } = el.getBoundingClientRect()
      return top >= 147 && bottom <= viewHeight
    },
    clearTime() {
      if (this.timer) {
        this.ifScroll = false
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.infinite-list-container {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}

.infinite-list-item {
  box-sizing: border-box;
  /* padding-left: 10px; */
  /* padding-right: 10px; */
  /* border-bottom: 1px solid #999; */
  /* height:200px; */
}

.infinite-checked {
  .text {
    .text_value {
      background-color: #FFDBB8!important;
    }

  }
}

.comment-block {
  position: fixed;
  width: 370px;
  height: 135px;
  border-radius: 8px;
  padding: 10px;
  padding-left: 0px;
  background: #FFFFFF;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.1), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 3px 14px 2px rgba(0,0,0,0.05);
  border-radius: 8px;
  border: 1px solid #E4E7ED;
  ::v-deep .el-textarea textarea {
    border: none;
  }
}
.action-block {
  width: 100%;
  text-align: right;
  padding-top: 5px;
}

.comment-position-abs {
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 33;
}
</style>
