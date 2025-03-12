<template>
  <div class="timeline-panel flex">
    <div class="lines-scroll" :style="{width:linesScrollWidth+'px'}" />
    <div v-for="item in linesRenderList" :key="item.t" class="scale" :style="{width:video.trueWidth+'px'}" :index="item.index">
      <div class="scalse">
        <i v-for="_item in lines" :key="_item" />
      </div>
      <span class="time">{{ item.time }}</span>
    </div>
  </div>
</template>
<script>
import { getFormatHMS } from '../../../utils'
import moment from 'moment'
import eventBus from '@/utils/eventBus'
export default {
  data() {
    return {
      lines: 10, // 每节刻度表包含10个刻度线
      linesRenderList: [], // 渲染列表
      linesList: [], // 总的时间轴刻度列表
      isWidth: true,
      linesScrollWidth: 0,
      frameWidth: 160,
      frameHeight: 90,
      isDynaRender: false, // 是否需要动态渲染
      lastScrollPx: 0 // 滚动条滚动的位置
    }
  },
  inject: ['video', 'updateActiveSliderInfo'],
  computed: {
    getVideoDetail: function () {
      return this.video.detail
    },
    getActiveSliderInfo: function () {
      return this.video.activeSliderInfo
    }
  },
  watch: {
    // 缩放监听
    getActiveSliderInfo() {
      // 刻度表缩放时，重新初始化刻度线
      this.initTimeLine()
    },
    // 获取视频信息后初始化信息
    getVideoDetail() {
      this.initTimeLine()
      this.isWidth = !this.video.isVideoScreenPortait
    }
  },
  mounted() {
    const scrollDom = document.querySelector('.tracks-box')
    scrollDom.addEventListener('scroll', (e) => {
      if (!this.isDynaRender) return false
      const maxLength = this.linesList.length
      const ss = this.video.currentZoomEachSectionTime// 当前缩放比例 一节刻度尺所需要的时间
      const width = this.video.trueWidth // 一节刻度尺的宽度
      const scrollLeft = scrollDom.scrollLeft // 当前滚动条所在 位置
      const scrollLeftTime = (scrollLeft / width) * ss // 滚动条位置转化为所在的时间
      const scrollLeftIndex = Math.round(scrollLeftTime / ss)
      // 滚动条拖到
      if (Math.abs(scrollLeft - this.lastScrollPx) > 16) {
        if (scrollLeftTime > 20) {
          const list = []
          for (let i = 0; i < 30; i++) {
            const index = scrollLeftIndex + i
            if (index < maxLength) {
              list.push(this.linesList[index])
            }
          }
          this.linesRenderList = list
          const linesScrollWidthIndex = this.linesRenderList[0].index
          this.linesScrollWidth = linesScrollWidthIndex * width
        } else {
          this.linesRenderList = this.linesList.slice(0, 30)
          this.linesScrollWidth = 0
        }
      } else {
        // 自动播放
        // 当前渲染列表第20个刻度所代表的时间
        const current20S = moment.duration(this.linesRenderList[20]?.time).asSeconds()
        // 当前进度所代表的时间
        const currentTimeS = Number(this.video.currentTime)

        // 如果当前的时间大于渲染列表第20个的时间，往后动态添加10个刻度
        if (currentTimeS > current20S) {
          const linesRenderListLength = this.linesRenderList.length
          const linesRenderListIndex = this.linesRenderList[linesRenderListLength - 1].index
          const list = []
          for (let i = 1; i < 11; i++) {
            const index = linesRenderListIndex + i
            if (index < maxLength) {
              list.push(this.linesList[index])
            }
          }
          this.linesRenderList = [...this.linesRenderList, ...list]
          this.linesRenderList.splice(0, 10)
          const linesScrollWidthS = moment.duration(this.linesRenderList[0].index)
          this.linesScrollWidth = linesScrollWidthS * width
        }
      }
      this.lastScrollPx = scrollLeft
    })
    eventBus.$on('changeFrame', this.changeFrame)
  },
  methods: {
    // 抽帧图大小改变
    changeFrame(data) {
      this.frameWidth = data.width
      this.frameHeight = data.frameHeight
    },
    // 初始化刻度线
    initTimeLine() {
      console.log(this.video, '视频信息刻度尺')
      const { detail, isVideoScreenPortait, currentZoomEachSectionTime } = this.video
      // const width = isVideoScreenPortait ? 90 : 160
      this.isWidth = !isVideoScreenPortait
      const duration = detail.duration
      this.linesList = []
      if (duration > 0) {
        let n = Math.ceil(detail.duration / currentZoomEachSectionTime) + 1 // n总节数，根据视频时长除以每节代表的秒数，得出总节数，小于24节,统一为24节
        n = n < 24 ? 24 : n
        for (let i = 0; i < n; i++) {
          const obj = {
            index: i,
            time: getFormatHMS(i * 1000 * currentZoomEachSectionTime) // 刻度尺上显示的节的具体时间
          }
          this.linesList.push(obj)
        }
        this.$emit('init', n * this.video.trueWidth)
        // 视频时长大于半个小时的视频，时间轴动态渲染，初始值取前30个刻度 1800秒
        if (duration > 120) {
          this.linesRenderList = this.linesList.slice(0, 30)
          this.isDynaRender = true
        } else {
          this.linesRenderList = this.linesList
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .timeline-panel {
    border-top: 1px solid #a6a6a6;
    // display: inline-block;
    position: relative;
    .lines-scroll{
      height: 20px;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 8px;
      background: #8a9099;
    }
  }
  .scale-placeholder {
    height: 20px;
  }
  .scale {
    position: relative;
    display: inline-block;
    height: 20px;
    // width: 90px;
    // &.isWidth{
    //   width:160px;
    //   i{
    //     width:9px;
    //   }
    // }
    .time {
      position: absolute;
      top: 8px;
      left: 2px;
      color: #8a9099;
      font-size: 10px;
      user-select: none;
    }
    .scalse {
      position: absolute;
      top: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      i {
        width:18px;
        height: 4px;
        border-right: 1px solid #737373;
        // background-color: #a6a6a6;
        &:last-child {
          height: 8px;
        }
        // &:first-child {
        //   visibility: hidden;
        // }
      }
    }
  }
</style>
