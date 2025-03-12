<template>
  <div class="frame-sprite-container flex ">
    <div class="frame-scroll" :style="{width:scrollWidth+'px'}" />
    <div
      v-for="(item,index) in renderFrameList"
      :key="index"
      :style="{
        backgroundImage: item.url,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${item.x}px -${item.y}px`,
        marginLeft:item.left+'px',
        width:item.width+'px',
        height:item.height+'px'
      }"
      :index="item.index"
      :left="item.left"
      class="frame-item"
      :class="{isWidth:isWideScreen}"
    />
  </div>
</template>
<script>
import { frameExtractingList } from '../../../api'
import { calculateDisplaySize } from './utils'
export default {
  inject: ['video'],
  data() {
    return {
      renderFrameList: [],
      filterFrames: [], // 雪碧图过滤数组 // 雪碧图渲染数组
      initListFrame: [],
      scrollWidth: 0,
      isWideScreen: true
    }
  },
  computed: {
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    },
    getVideoDetail() {
      return this.video.detail
    }
  },
  watch: {
    getActiveSliderInfo() {
      this.filterFrameList()
    },
    getVideoDetail(val) {
      this.initFrameList(val)
      this.isWideScreen = !this.video.isVideoScreenPortait
    }
  },
  mounted() {
    const scrollDom = document.querySelector('.tracks-box')
    scrollDom.addEventListener('scroll', (e) => {
      const ss = this.video.currentZoomEachSectionTime// 当前缩放比例 一节刻度尺所需要的时间
      const width = this.isWideScreen ? 160 : 90 // 一节刻度尺的宽度
      const left = scrollDom.scrollLeft // 当前滚动条所在 位置
      const leftTime = (left / width) * ss // 滚动条位置转化为所在的时间
      const list = JSON.parse(JSON.stringify(this.filterFrames)) // 过滤后的数组
      const maxWidth = 15 * width
      // 前30张图获取筛选后列表前30张图
      if (left < maxWidth) {
        if (list.length < 60) {
          this.renderFrameList = list
        } else {
          this.renderFrameList = list.slice(0, 30)
        }
        this.scrollWidth = 0
      } else {
        // 拖动滚动条
        if (Math.abs(left - this.lastScrollPx) > 23) {
          const nextList = []
          // 过滤数组中倒数第20个所在的位置
          const last20Left = list[list.length - 21].index * width / ss
          // 最后20个，选取最后30张图
          if (left > last20Left) {
            const nextListIndex = list.length - 31
            for (let i = 0; i < 30; i++) {
              nextList.push(list[nextListIndex + i])
            }
          } else {
            // 滚动条当前位置所代表渲染图的索引值
            const leftIndex = Math.round(leftTime / ss)
            // 以当前滚动条所在的时间点往后拿30张
            for (let i = 0; i < 30; i++) {
              nextList.push(list[leftIndex + i])
            }
          }
          this.scrollWidth = left
          this.renderFrameList = nextList
        } else {
          // 快捷键或者自动播放，进度条到第10张的时候，自动往后加5张，且删掉后面5张
          // 当前渲染第10图片的位置
          const current10Left = this.renderFrameList[20].fIndex * ss
          // 当前播放时间所代表的位置
          const currentTimeLeft = Number(this.video.currentTime)
          if (currentTimeLeft > current10Left) {
            // 当前渲染数组的长度当做 动态添加数组的起始值
            const n = Math.round(document.body.clientWidth / width)
            const lastIndex = Number(this.renderFrameList[20].fIndex) - n
            const createList = []
            for (let i = 0; i < 30; i++) {
              createList.push(list[lastIndex + i])
              this.scrollWidth = left
            }
            this.renderFrameList = createList
          }
        }
      }
      this.lastScrollPx = left
    })
  },
  methods: {
    // 初始化雪碧图，获取所有雪碧图以及坐标
    async initFrameList(val) {
      // 每次请求数据时，需要清空当前的数组
      this.initListFrame = []
      const { id, duration } = val
      // 接口返回雪碧图数据 有横图和竖图两种格式，
      const { data } = await frameExtractingList({ videoId: id })
      // 每张雪碧图的宽高，视频格式不同，取值的范围也不同
      const { width, height } = this.getVideoWidthAndHeight()
      const frameList = []
      const initJ = 10 // 初始化 横轴个数
      const initK = 20 // 初始化 纵轴个数
      let index = 0
      for (let i = 0; i < data.length; i++) {
        let limitJ = initK // 纵轴最大数
        // 如果时长 小于一张雪碧图的个数
        if (duration - 200 * i < 200) {
          // 最大数等于
          limitJ = Math.ceil((duration - (200 * i)) / initJ)
        }
        for (let j = 0; j < limitJ; j++) {
          let limitK = initJ
          if (duration - (200 * i + initJ * j) < initJ) {
            limitK = Math.ceil(duration - (200 * i + initJ * j))
          }
          for (let k = 0; k < limitK; k++) {
            index++
            const obj = {
              index,
              right: width * index,
              width: width,
              height: height,
              x: width * k,
              y: j * height,
              url: 'url(' + data[i].spriteUrl + ')'
            }
            frameList.push(obj)
          }
        }
      }
      this.initListFrame = frameList
      console.log(frameList, '总共多少张')
      this.filterFrameList()
    },
    // 获取视频宽高
    getVideoWidthAndHeight() {
      // 视频的宽高
      const { width, height } = this.video.detail
      const data = calculateDisplaySize(width, height)
      return { width: data.width, height: data.height }
    },
    filterFrameList() {
      const frameList = JSON.parse(JSON.stringify(this.initListFrame))
      const ss = this.video.currentZoomEachSectionTime // 当前缩放比例 1节 所需要的时间
      const list = []
      // 对所有的帧遍历， 取出能整除 1节所需要的时间 帧，得出实际需要显示的帧集合
      frameList.forEach((item, index) => {
        if (index % ss === 0) {
          list.push(item)
        }
      })
      // 给显示的帧集合手动加入 索引值
      list.forEach((item, index) => {
        item.fIndex = index
      })
      this.filterFrames = list
      // 首次渲染取前30张渲染 ，主要为性能优化
      console.log(list, '需要渲染的数组')
      if (list.length < 60) {
        this.renderFrameList = list
      } else {
        this.renderFrameList = list.slice(0, 30)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.frame-sprite-container{
    width:100%;
    overflow: hidden;
    .frame-item {
        width: 90px;
        height: 160px;
        flex:none;
        &.isWidth{
        width: 160px;
        height: 90px;
        }
    }
}
</style>
