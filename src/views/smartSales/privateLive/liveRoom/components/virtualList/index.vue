<template>
  <div :id="`${idName}_scriptConfiguration`" ref="list" :style="{height}" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div v-show="loading" class="loading">正在加载...</div>
    <div ref="phantom" class="infinite-list-phantom" />
    <div ref="content" class="infinite-list">
      <div v-for="(item) in visibleData" :id="`${idName}_${item.item.id}`" :ref="`${idName}items`" :key="item.item.id" class="infinite-list-item">
        <slot ref="slot" :item="item.item" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VirtualList',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
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
      default: 'virtualListLiveRoom'
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
      ifScrollBootom: false,
      commentData: '',
      isCheckedNow: false,
      isClicked: false
    }
  },
  computed: {
    _listData() {
      return this.listData.map((item, index) => {
        return {
          _index: `${this.idName}_${item.id}`,
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
    },
    scrollWrapper() {
      return this.$refs.list
    },
    ...mapState({
      'ifCanScrollBottom': state => state.im.chatView.ifCanScrollBottom
    })
  },
  watch: {
    listData: {
      handler() {
        console.log('数据变化')
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
    const _this = this
    document.addEventListener('wheel', function(event) {
      if (!_this.$refs.list || !_this.checkIn(_this.$refs.list)) {
        return
      }
      if (event.deltaY > 0) {
        // 向下滚动
        console.log('向下滚动')
      } else {
        // 向上滚动
        console.log('向上滚动')
        _this.$store.commit('im/set_ifScrollBottom', false)
        _this.ifScrollBootom = true
      }
    })
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
      const height = this.positions[this.positions.length].bottom
      this.$refs.phantom.style.height = height + 'px'
      // 更新真实偏移量
      this.setStartOffset()
    })
  },
  methods: {
    // 判断鼠标是否落在一个块级元素内部
    checkIn(obj) {
      var x = Number(window.event.clientX) // 鼠标相对屏幕横坐标
      var y = Number(window.event.clientY) // 鼠标相对屏幕纵坐标
      var div_x = Number(obj.getBoundingClientRect().left) // obj相对屏幕的横坐标
      var div_x_width = Number(
        obj.getBoundingClientRect().left + obj.clientWidth
      ) // obj相对屏幕的横坐标+width

      var div_y = Number(obj.getBoundingClientRect().top) // obj相对屏幕的纵坐标
      var div_y_height = Number(
        obj.getBoundingClientRect().top + obj.clientHeight
      ) // obj相对屏幕的纵坐标+height

      if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        return true
      } else {
        return false
      }
    },
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
        tempIndex = midIndex
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
      // console.log(startOffset, 'startOffsetstartOffsetstartOffset')
      this.startOffset = startOffset
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`
    },
    // 滚动事件
    scrollEvent(event) {
      // console.log('触发滚动事件', !this.ifScroll)
      // 当前滚动位置
      // const scrollTop = this.$refs.list.scrollTop
      // 此时的开始索引
      // console.log(scrollTop, 'scrollTop')
      this.start = this.getStartIndex(this.$refs.list.scrollTop)
      // console.log(this.start, 'this.start')
      // 此时的结束索引
      this.end = this.start + this.visibleCount
      // 此时的偏移量
      this.setStartOffset()
      if (!this.ifScroll) {
        this.emitScroll()
      }
    },
    // 滚动到节点
    scrollTo(id) {
      console.log(id, '需要滚动到的元素的id')
      const targetEl = document.getElementById(`${this.idName}_${id}`)
      // console.log(targetEl, 'targetEl ', targetEl.scrollTop, targetEl.scrollHeight, targetEl.offsetTop)
      this.$store.commit('im/set_ifCanScrollBottom', false)
      this.ifScroll = true
      this.$refs.list.scrollTop = this.$refs.list.scrollTop + targetEl.offsetTop
      this.ifScroll = false
    },
    scrollBottom() {
      setTimeout(() => {
        // console.log('能否滚动到底部', this.ifCanScrollBottom)
        if (!this.ifScrollBootom) {
          this.$refs.list.scrollTop = this.$refs.list.scrollHeight + 80
          setTimeout(() => {
            this.$refs.list.scrollTop !== this.$refs.list.scrollHeight && (this.$refs.list.scrollTop = this.$refs.list.scrollHeight)
          }, 30)
          this.$store.commit('im/set_ifCanScrollBottom', true)
        }
      }, 20)
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
    },
    emitScroll() {
      clearInterval(this.timer)
      // console.log('滚动中')
      this.$store.commit('im/set_ifScrollBottom', false)
      this.$store.commit('im/set_ifCanScrollBottom', false)
      var wrap = this.$refs.list
      // this.$refs.list.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
      // this.$refs.list.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
      const poor = wrap.scrollHeight - wrap.clientHeight
      if (
        parseInt(wrap.scrollTop) === poor ||
        Math.ceil(wrap.scrollTop) === poor ||
        Math.floor(wrap.scrollTop) === poor
      ) {
        console.log('已经触底了')
        this.$store.commit('im/set_ifScrollBottom', true)
        this.$store.commit('im/set_ifCanScrollBottom', true)
        this.ifScrollBootom = false
        return this.$emit('load')
      }
      if (wrap.scrollTop === 0) {
        console.log('到顶部了')
        this.$store.commit('im/set_ifScrollBottom', false)
        return this.$emit('rollTop')
      }
      // this.$store.commit('im/set_ifCanScrollBottom', false)
      this.$emit('scroll')
    }
  }
}
</script>

<style scoped lang='scss'>
.infinite-list-container {
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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
  margin-bottom: 20px;
}

.infinite-list-item {
  box-sizing: border-box;
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
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  font-size: 14px;
  text-align: center;
  padding-top: 5px;
  color: #999;
}
</style>
