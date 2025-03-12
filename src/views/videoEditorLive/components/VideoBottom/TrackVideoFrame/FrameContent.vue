<template>
  <div class="frame-content" style="width:100%">
    <!-- <p style="position:absolute;top:0;left:0;z-index:2">{{ data.videoData.name }}</p> -->
    <div
      v-for="(item) in renderFrameList"
      :key="item.index"
      :style="{
        backgroundImage: item.url,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${item.x}px -${item.y}px`,
      }"
      :index="item.index"
      :left="item.left"
      class="frame-item"
      :class="{isWidth:isWideScreen}"
    />
  </div>
</template>
<script>
// import { frameExtractingList } from '../../../api'
export default {
  inject: ['video'],
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      filterFrames: [],
      renderFrameList: [],
      isWideScreen: false
    }
  },
  computed: {
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    }
  },
  watch: {
    getActiveSliderInfo() {
      this.filterFrameList()
    }
  },
  mounted() {
    this.getFrameList()
  },
  methods: {
    async getFrameList() {
      const data = this.data
      const { duration, frameData, width } = data.videoData
      const isWideScreen = width === 1920
      this.isWideScreen = isWideScreen
      // const res = await frameExtractingList({ videoId: id })
      const list = frameData

      const initJ = 10 // 初始化 横轴个数
      const initK = 20 // 初始化 纵轴个数
      let index = 0
      const fWidth = isWideScreen ? 160 : 90
      const fHeight = isWideScreen ? 90 : 160
      const frameList = []
      for (let i = 0; i < list.length; i++) {
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
              start: index * 90,
              end: 200 * i + initJ * j + k + 1,
              index,
              right: fWidth * index,
              x: fWidth * k,
              y: j * fHeight,
              url: 'url(' + list[i].spriteUrl + ')'
            }
            frameList.push(obj)
          }
        }
      }
      this.initListFrame = frameList
      this.filterFrameList()
    },
    filterFrameList() {
      const frameList = JSON.parse(JSON.stringify(this.initListFrame))
      const ss = this.video.currentZoomEachSectionTime // 当前缩放比例 1节 所需要的时间
      const currentZommEachSectionWidth = this.video.currentZommEachSectionWidth
      const list = []
      const startWidth = this.data.videoPlayStartTime * currentZommEachSectionWidth

      // 对所有的帧遍历， 取出能整除 1节所需要的时间 帧，得出实际需要显示的帧集合
      frameList.forEach((item, index) => {
        if (item.start > startWidth) {
          if (index % ss === 0) {
            list.push(item)
          }
        }
      })
      // 给显示的帧集合手动加入 索引值
      list.forEach((item, index) => {
        item.fIndex = index
      })
      this.filterFrames = list
      // 首次渲染取前30张渲染 ，主要为性能优化
      this.renderFrameList = list
    }
  }
}
</script>
<style lang="scss" scoped>
.frame-item {
  &.isWidth{
    width:160px;
    height:90px;
  }
    width: 90px;
    height: 160px;
    flex:none;
}
</style>
