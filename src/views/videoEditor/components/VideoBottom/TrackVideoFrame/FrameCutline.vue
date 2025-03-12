<template>
  <div class="line-content flex">
    <div v-for="(item) in lineList" :key="item.startTime" class="line-item" :style="{left:item.left+'px',width:item.width+'px'}" @mousemove="handleMouseMoveLineItem(item.index)">
      <!-- 裁剪块-->
      <p class="line-block" :class="{active:cutLineActiveList.includes(item.index)}" @click="handleClickLineItem(item.index)" />
      <!-- 拖动辅助线-->
      <sub-line ref="subline" :cut-x="currentCutPointX" :index="item.index" class="sub-line" @move="subLineMove" @mdown="subLineMousedown" @mup="subLineMouseUp" />
      <!-- 裁剪线-->
      <p class="cut-line" />
      <!-- 裁剪合并区域-->
      <p class="merge-block" :class="{active:mouseMoveActiveIndex===item.index}" @mouseout="handleMouseOutLineItem" @click="handleClickLineItemMerge(item.index)">
        <el-tooltip effect="dark" content="合并片段" placement="top">
          <i />
        </el-tooltip>
      </p>
    </div>
  </div>
</template>
<script>
// import hotkeys from 'hotkeys-js'
import SubLine from './SubLine.vue'
import { insertSort, uniqueArray } from './utils'
import { addCuttings, cuttingList } from '../../../api'
import videoExport from '@/views/videoEditor/components/videoExport/index.js'

export default {
  inject: ['video', 'updateCutLineActiveList', 'updateActionNextList', 'updateActionList', 'updateVideoSeekTime', 'updeateCutLineList'],
  components: {
    SubLine
  },
  data() {
    return {
      cutList: [0], // 裁剪点数组
      lineList: [], // 裁剪块渲染数组
      cutLineActiveList: [], // 选中的裁剪块数组，需要将该数组传递到生成视频页面，进行默认选中操作
      historyList: [], // 历史操作数组
      mouseMoveActiveIndex: -1, // 当前鼠标hover 选中裁剪块索引值
      nextZoom: 1, // 上一次刻度表缩放值
      currentCutPointX: 0,
      currentMoveSubLineIndex: 0
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
      this.initCutLint()
    },
    getVideoDetail() {
      this.getCuttingList()
    }

  },
  mounted() {
    this.initKeydown()
  },
  methods: {
    initKeydown() {
      document.onkeydown = (e) => {
        const el = e || event || window.event
        const currentTime = this.video.currentTime
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const currentPx = Number((currentTime * currentZoomSectionWidth).toFixed(3))
        const durationTime = this.video.detail.duration
        const palyStatus = this.video.status
        if (!el) return false
        if (el.keyCode === 40) {
          e.preventDefault()
          if (videoExport.getVisible()) {
            return
          }
          if (palyStatus === 'playing') {
            this.updateVideoSeekTime(currentTime, '切换片段上键跳帧播放。。。')
          }
          setTimeout(() => {
            let nextCutIndex = 0
            for (let i = 0; i < this.cutList.length; i++) {
              const x = Number((this.cutList[i]).toFixed(3))
              if (x > currentPx) {
                nextCutIndex = i
                break
              }
            }

            const nextCutPx = Number((this.cutList[nextCutIndex]).toFixed(3))
            console.log(nextCutIndex, currentPx, nextCutPx, 444444)
            if (nextCutIndex > 0) {
              const time = nextCutPx / currentZoomSectionWidth
              this.updateVideoSeekTime(time, '切换片段下键跳帧播放。。。')
            } else {
              this.updateVideoSeekTime(durationTime)
            }
          }, 100)
        } else if (el.keyCode === 38) {
          e.preventDefault()
          if (videoExport.getVisible()) {
            return
          }

          if (palyStatus === 'playing') {
            this.updateVideoSeekTime(-1, '切换片段上键跳帧播放。。。')
          }

          setTimeout(() => {
            let prevCutIndex = 0
            for (let i = 0; i < this.cutList.length; i++) {
              const x = Number((this.cutList[i]).toFixed(3))
              if (x < currentPx) {
                prevCutIndex++
              }
            }

            if (prevCutIndex > 0) {
              const prevCutPx = Number((this.cutList[prevCutIndex - 1]).toFixed(3)) || 0
              const time = prevCutPx / currentZoomSectionWidth
              // time = time === 0 ? 0.1 : time
              this.updateVideoSeekTime(time, '切换片段上键跳帧播放。。。')
            } else {
              this.updateVideoSeekTime(0)
            }
            // console.log(prevCutIndex, currentPx, prevCutPx, 22222)
          }, 100)
        }
      }
    },
    // 获取裁剪点
    async getCuttingList() {
      this.cutList = [0]
      const videoId = this.video.detail.id
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const { data } = await cuttingList({ videoId })
      const list = []
      // 数据转换，将起始点时间转换为时间轴对应的像素起始点
      data.forEach(item => {
        list.push(item.start * currentZoomSectionWidth, item.end * currentZoomSectionWidth)
      })
      // 去除数组中重复的起始点
      this.cutList = this.cutList.concat(uniqueArray(list))
      this.initCutLint()
      this.updeateCutLineList(this.cutList)
    },
    // 将裁剪点转换为 裁剪块
    initCutLint() {
      const duration = this.video.detail.duration
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const zoomSectionWidth = this.video.zoomSectionWidth

      // 根据当前的刻度表缩放比例进行裁剪点数据转换，宽1920 和竖1920 的取值不一样
      this.cutList.forEach((item, index) => {
        this.cutList[index] = item * (currentZoomSectionWidth / zoomSectionWidth[this.nextZoom - 1])
      })

      this.lineList = []
      if (this.cutList.length > 1) {
        // 裁剪点从小到大排列
        const sortList = insertSort(this.cutList)
        const first = sortList[1]
        const last = duration * currentZoomSectionWidth
        // 对裁剪点进行遍历转换裁剪块
        sortList.forEach((item, index) => {
          const list = []
          // 第一个位置默认为0和裁剪点第一个
          if (index === 0) {
            list.push(0, first)
          } else if (index === sortList.length - 1) {
            // 最后一个为裁剪点最后一个和视频时长
            list.push(Number(item), last)
          } else {
            // 中间为当前索引值和下一个
            list.push(Number(item), Number(sortList[index + 1]))
          }

          this.lineList.push(list)
        })
      }

      this.nextZoom = this.video.activeSliderInfo
      this.createLineList()
    },
    // 根据裁剪点，生成裁剪块，
    createLineList() {
      this.cutLineActiveList = []
      const duration = this.video.detail.duration
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const last = duration * currentZoomSectionWidth
      const len = this.lineList.length
      this.lineList.forEach((item, index) => {
        const start = item[0]
        const end = item[1]
        let width = end - start // 裁剪宽度
        if (index === len - 1) {
          width = last - start
        }
        item.start = item[0]
        item.end = item[1]
        item.left = start
        item.width = width
        item.index = index
      })
    },
    // 裁剪动作，组装裁剪接口数据
    async cutFrameLines() {
      const videoId = this.video.detail.id
      const list = this.lineList
      const cuttings = []
      const time = this.video.currentZoomEachSectionTime
      list.forEach(item => {
        const width = this.video.trueWidth
        const obj = {
          start: Number(((item[0] / width) * time).toFixed(3)),
          end: Number(((item[1] / width) * time).toFixed(3))
        }
        cuttings.push(obj)
      })
      console.log(cuttings, list, '切片信息。。。。。')
      await addCuttings({ cuttings, videoId })
    },
    // 裁剪块选中事件
    handleClickLineItem(index) {
      // 在选中的裁剪块是否以存在，存在即不选中
      const activeIndex = this.cutLineActiveList.indexOf(index)
      if (activeIndex > -1) {
        this.cutLineActiveList.splice(activeIndex, 1)
      } else {
        this.cutLineActiveList.push(index)
      }
      // 更新到全局变量
      this.updateCutLineActiveList(this.cutLineActiveList)
    },

    handleMouseMoveLineItem(index) {
      if (this.cutLineActiveList.includes(index) && this.cutLineActiveList.includes(index - 1)) {
        this.mouseMoveActiveIndex = index
      }
    },
    handleMouseOutLineItem() {
      this.mouseMoveActiveIndex = -1
    },
    // 裁剪块合并，删除当前裁剪点，进行重新渲染，并同步到接口
    handleClickLineItemMerge(i) {
      const x = this.cutList[i]
      this.cutList.splice(i, 1)
      this.setActionHistory({
        eventFun: 'merge',
        value: x,
        index: i
      })
      this.mouseMoveActiveIndex = -1
      this.initCutLint()
      this.cutFrameLines()
    },
    // 裁剪操作，将当前的裁剪位置，存到裁剪点，单位为像素，并同步历史记录中
    handleVideoCut() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const time = this.video.currentTime
      const x = Number((time * currentZoomSectionWidth).toFixed(3))
      if (!this.cutList.includes(x)) {
        this.cutList.push(x)
        this.initCutLint()
        this.cutFrameLines()
        this.setActionHistory({
          eventFun: 'cut',
          value: x
        })
      }
    },
    setActionHistory(data) {
      const actionList = this.video.actionList
      actionList.push(data)
      this.updateActionList(actionList)
    },
    // 历史重置操作
    cutHistoryPrev() {
      const actionList = this.video.actionList
      const actionNextList = this.video.actionNextList
      const actionLength = actionList.length
      const lastActionItem = actionList[actionLength - 1]
      if (lastActionItem.eventFun === 'cut') {
        const index = this.cutList.indexOf(lastActionItem.value)
        this.cutList.splice(index, 1)
      } else if (lastActionItem.eventFun === 'merge') {
        const { index, value } = lastActionItem
        this.cutList.splice(index, 0, value)
      }
      actionList.splice(actionLength - 1, 1)
      actionNextList.push(lastActionItem)
      this.updateActionList(actionList)
      this.updateActionNextList(actionNextList)

      this.initCutLint()
      this.cutFrameLines()
    },
    // 历史撤销操作
    cutHistoryNext() {
      const actionList = this.video.actionList
      const actionNextList = this.video.actionNextList
      const nextActionLength = actionNextList.length
      const lastActionNextItem = actionNextList[nextActionLength - 1]
      if (lastActionNextItem.eventFun === 'cut') {
        this.cutList.push(lastActionNextItem.value)
      } else if (lastActionNextItem.eventFun === 'merge') {
        const { index } = lastActionNextItem
        this.cutList.splice(index, 1)
      }
      actionNextList.splice(nextActionLength - 1, 1)
      actionList.push(lastActionNextItem)
      this.updateActionList(actionList)
      this.updateActionNextList(actionNextList)

      this.initCutLint()
      this.cutFrameLines()
    },
    // 辅助线移动
    subLineMove(data) {
      const { moveX, isMoveLeft, index } = data
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.detail.duration
      const maxX = duration * currentZoomSectionWidth
      const currentMoveSubLineIndex = this.currentMoveSubLineIndex + 1
      // 拖动到起点和终点时，删除该裁剪点，
      if (moveX < 1 || moveX > maxX) {
        this.cutList.splice(currentMoveSubLineIndex, 1)
        this.initCutLint()
        this.cutFrameLines()
      } else {
        // 拖动到相邻裁剪点 +-4个像素的吸附效果，删除该裁剪点
        this.cutList.forEach((item, _index) => {
          // 往左移
          if (isMoveLeft) {
            if (this.cutList[currentMoveSubLineIndex] - this.cutList[currentMoveSubLineIndex - 1] < 4) {
              this.cutList.splice(currentMoveSubLineIndex, 1)
              this.initCutLint()
              this.$refs.subline[index].mouseupFun()
            } else {
              this.cutList[currentMoveSubLineIndex] = this.currentCutPointX
              this.initCutLint()
            }
          } else {
            // 往右移
            if (this.cutList[currentMoveSubLineIndex] - this.cutList[currentMoveSubLineIndex + 1 ] > -4) {
              this.cutList.splice(currentMoveSubLineIndex, 1)
              this.initCutLint()
              this.$refs.subline[index].mouseupFun()
            } else {
              this.cutList[currentMoveSubLineIndex] = this.currentCutPointX
              this.initCutLint()
            }
          }
        })
        this.currentCutPointX = moveX
        // this.initCutLint()
      }
    },
    // 辅助线点击
    subLineMousedown(index) {
      this.currentMoveSubLineIndex = index
      this.currentCutPointX = this.cutList[index + 1]
    },
    // 辅助线松开，保存数据
    subLineMouseUp() {
      this.cutFrameLines()
    }
  }
}
</script>
<style lang="scss" scoped>
 .line-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .line-item {
      position: absolute;
      top: 0;
      height: 100%;
      cursor: pointer;
      z-index: 2;
      &:hover{
        z-index: 3;
      }
      .line-block {
          position: absolute;
          width: calc(100% + 2px);
          height: 100%;
          top: 0;
          left: 0;
          z-index: 10;
          &.active,&.hover{
              border: 4px solid #fff;
              border-radius: 4px;
              z-index: 6;
          }
      }
      .merge-block{
        display: none;
        position: absolute;
        top:0;
        height:100%;
        left:-16px;
        width: 36px;
        z-index: 11;
        &.active{
         display: block;
        }
        i{
          display: block;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          background: url(../../../icons/merge_icon.svg);
          width:36px;
          height: 36px;
        }
      }
      .cut-line {
        position: absolute;
        top: 0;
        right: -2px;
        width: 2px;
        height: 100%;
        z-index: 4;
        background: #000;
      }
      &:first-child {
        .line-block {
          left: 0;
          width: calc(100% + 2px);
        }
        .merge-block{
          display: none;
        }
      }
      &:last-child{
        .sub-line{
          display: none;
        }
        .cut-line{
          display: none;
        }
      }
    }
  }
</style>
