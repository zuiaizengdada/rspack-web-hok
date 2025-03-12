<template>
  <div class="subtitle-container relative flex" :style="{width:containerWidth+'px'}" :class="{overZoom:zoom>9}">
    <p
      v-for="item in renderList"
      :key="item.index"
      :index="item.index"
      class="sub-item absolute"
      :class="{'not':item.class,'overLap':item.isOverLap,'active':activeIndex===item.index}"
      :style="{ left: item.left + 'px',width:item.width+'px' }"
      @click.stop="handleClickItem(item)"
    >{{ item.content }}</p>
  </div>
</template>
<script>
import { formatPrTime, getDurationSS } from '../../../utils'
export default {
  data() {
    return {
      list: [],
      activeIndex: -1,
      renderList: [],
      lastScrollPx: 0,
      zoom: 0,
      containerWidth: 0
    }
  },
  inject: ['video', 'updateVideoSeekTime', 'updateActiveRightNavIndex'],
  computed: {
    getActiveSliderInfo() {
      return this.video.activeSliderInfo
    },
    getList() {
      return this.video.subtitleList
    },
    getActiveIndex() {
      return this.video.activeSubtitleItemIndex
    }
  },
  watch: {
    getActiveSliderInfo: {
      handler(val) {
        this.initList()
        this.zoom = val
      },
      deep: true
    },
    getList: {
      handler() {
        this.initList()
        this.isWidth = !this.video.isVideoScreenPortait
      }
    },
    getActiveIndex: {
      handler(val) {
        this.activeIndex = val
      }
    }
  },
  mounted() {
    const scrollDom = document.querySelector('.tracks-box')
    scrollDom.addEventListener('scroll', (e) => {
      const ss = this.video.currentZoomEachSectionTime// 当前缩放比例 一节刻度尺所需要的时间
      const scrollLeft = scrollDom.scrollLeft // 当前滚动条所在 位置
      const width = this.video.trueWidth // 一节刻度尺的宽度
      const sWidth = width / ss // 一秒钟代表的宽带
      const scrollLeftTime = (scrollLeft / sWidth) * 1000 // 滚动条位置转化为所在的时间
      if (Math.abs(scrollLeft - this.lastScrollPx) > 16) {
        for (let i = 0; i < this.list.length; i++) {
          const start = this.list[i].startTime
          if (start > scrollLeftTime) {
            i = i < 20 ? 20 : i
            this.renderList = this.list.slice(i - 20, i + 80)
            break
          }
        }
      } else {
        const renderListLength = this.renderList.length
        const renderListIndex = this.renderList[renderListLength - 1].index
        if (this.list[renderListIndex + 1]) {
          this.renderList.push(this.list[renderListIndex + 1])
        }
      }
      this.lastScrollPx = scrollLeft
    })
  },
  methods: {
    initList() {
      // const clientWidth = document.body.clientWidth
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.detail.duration // 视频时长
      this.containerWidth = duration * currentZoomSectionWidth
      const list = JSON.parse(JSON.stringify(this.video.subtitleList))
      list.forEach((item, index) => {
        const ss = formatPrTime(item.startTime)
        const ee = formatPrTime(item.endTime)
        const dd = ee - ss
        const width = dd * currentZoomSectionWidth + 1 // 根据标记的起始点，和当前的速度，算出标记的宽度和起点坐标
        item.index = index
        item.left = ss * currentZoomSectionWidth + 2
        item.width = width
        /* 字幕显示规则
        * 1. 字幕宽度小于10 出现省略号
        * 2. 字幕宽度小于5 不显示任何 内容
        * 3. 宽度小于2 不显示分割线
        */
        if (width < 26 && width > 20) {
          item.class = true
          item.content = '...'
        } else if (width < 20 && width > 10) {
          item.class = true
          item.content = '.'
        } else if (width < 10) {
          item.class = true
          item.content = ''
        }
        // item.isOverLap = width > 10
      })
      this.list = list
      let listMaxLength = list.length - 1
      listMaxLength = listMaxLength > 1200 ? 1200 : listMaxLength
      let maxSlice = 0
      if (this.zoom >= 9 && this.zoom < 15) {
        maxSlice = listMaxLength < 500 ? listMaxLength : 500
      } else if (this.zoom >= 15) {
        maxSlice = listMaxLength
      } else {
        maxSlice = listMaxLength < 100 ? listMaxLength : 100
      }
      this.renderList = list.slice(0, maxSlice)
    },
    handleClickItem(item) {
      const time = getDurationSS(Number(item.startTime))
      this.updateVideoSeekTime(time, '字幕跳帧播放。。。')
      this.updateActiveRightNavIndex(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle-container{
  &.overZoom{
    background: #333;
  }
}
.scroll-subtitle{
  height: 20px;
}
  .sub-item {
    top: 0;
    font-size: 12px;
    color: #fff;
    background: #333333;
    border-radius: 2px;
    line-height: 20px;
    padding: 0px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid #333333;
    //border-left:1px solid #212224;
    overflow: hidden;
    height: 20px;
    text-align: left;
    &.not{
      padding:2px 0px;
    }
    &.active,
    &:hover {
      border: 1px solid #fff;
      z-index: 2;
       &.overLap{
        border-left:1px solid #fff;
      }
    }
    &.overLap{
      border-left:1px solid #212224;
    }
  }
  .icon-sub{
    position: absolute;
    top:0;
    left:-200px;
  }
</style>
