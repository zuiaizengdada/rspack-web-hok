<template>
  <div class="line-content flex">
    <p style="position:absolute;top:0;left:0;z-index:22;color:#fff;cursor:point" class=" cursor-pointer" @click="testHandleClickClear">测试清空片段</p>
    <div
      v-for="(item,index) in cutLineList"
      v-show="!item.exportDeleted"
      :key="item.id"
      class="line-item cursor-pointer"
      :style="{left:item.left+'px',width:item.width+'px'}"
      :draggable="true"
      @dragover="dragOverCutItem($event)"
      @drop="dragEnd(index)"
      @dragstart="dragStartCutItem(index)"
      @mousemove="handleMouseMoveLineItem(index)"
    >
      <!-- 裁剪块-->
      <p class="line-block" :class="{active:currentSelectCutIndexList.includes(index)}" style="color:#fff;font-size:20px;" @click.stop="handleClickLineItem(index)" />
      <!-- 拖动辅助线-->
      <!-- <sub-line ref="subline" :cut-x="currentCutPointX" :index="index" class="sub-line" @move="subLineMove" @mdown="subLineMousedown" @mup="subLineMouseUp" /> -->
      <!-- 裁剪线-->
      <!-- <p class="cut-line" /> -->
      <!-- 裁剪合并区域-->
      <p class="merge-block" :class="{active:mouseMoveActiveIndex===index}" @mouseout="handleMouseOutLineItem" @click="handleClickLineItemMerge(index)">
        <el-tooltip effect="dark" content="合并片段" placement="top">
          <i />
        </el-tooltip>
      </p>
      <p>{{ item.name }}</p>
      <frame-content :data="item" />
    </div>
    <div class="line-item" style="width:200px;" @drop="dragLastItemEnd" @dragover="dragOverCutItem($event)" />

  </div>
</template>
<script>
// import SubLine from './SubLine.vue'
import { mixinsCutDragger } from './mixins/mixinsCutDragger.js'
import { mixinsHistory } from './mixins/mixinsHistory.js'
import { mixinsSubline } from './mixins/mixinsSubline.js'
import { mixinsHotkeys } from './mixins/mixinsHotkeys.js'
import { mixinsMerge } from './mixins/mixinsMerge.js'
import { mixinsDelete } from './mixins/mixinsDelete.js'
import FrameContent from './FrameContent.vue'
import { frameExtractingList } from '../../../api'
import { operateClipsCuttingInfos, operateClipsVideoCutting } from '../../../api/live'
export default {
  inject: [
    'video',
    'updateCutLineActiveList',
    'updateVideoSeekTime',
    'updatePlayVideoSeekTime',
    'updeateCutLineList',
    'updateCurrentSelectCutItemList',
    'updatetoTalVideoDuration'
  ],
  components: {
    // SubLine,
    FrameContent
  },
  mixins: [mixinsDelete, mixinsCutDragger, mixinsHistory, mixinsSubline, mixinsHotkeys, mixinsMerge],
  data() {
    return {
      cutList: [0], // 裁剪点数组
      lineList: [], // 裁剪块渲染数组
      cutLineActiveList: [], // 选中的裁剪块数组，需要将该数组传递到生成视频页面，进行默认选中操作
      mouseMoveActiveIndex: -1, // 当前鼠标hover 选中裁剪块索引值
      nextZoom: 1, // 上一次刻度表缩放值
      currentCutPointX: 0,
      currentMoveSubLineIndex: 0,
      cutLineList: [], // 裁剪块列表
      currentCutLineItemIndex: -1,
      cutItemList: [],
      currentActiveCutItemData: {}, // 当前正在播放的片段
      videoPlayVal: 0,
      currentSelectCutIndexList: [], // 选中的裁剪块索引
      initResLiineList: []
    }
  },

  computed: {
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    },
    getVideoDetail() {
      return this.video.detail
    },
    getCurrentTime() {
      return this.video.currentTime
    },
    getCurrentSelectCutItemList() {
      return this.video.currentSelectCutItemList
    }
  },
  watch: {
    getActiveSliderInfo() {
      this.sliderInitCutLineList()
    },
    getVideoDetail() {
      this.getOperateClipsCuttingInfos()
    },
    getCurrentTime(val) {
      this.handleVideoTimeUpdate(val)
    },
    getCurrentSelectCutItemList(val) {
      this.currentSelectCutIndexList = val
    }
  },

  methods: {
    async getOperateClipsCuttingInfos() {
      const projectId = this.$route.query.projectId
      const res = await operateClipsCuttingInfos({
        videoId: this.video.detail.id,
        projectId
      })
      this.initResLiineList = res.data
      const currentZommEachSectionWidth = this.video.currentZommEachSectionWidth
      // 如果没有片段时，初始化整段视频为片段
      if (!res.data.length) {
        const { duration, id } = this.video.detail
        const resFrame = await frameExtractingList({ videoId: id })
        // const resSubtitle = await subtitleList({ videoId: id })
        const videoData = this.video.detail
        videoData.frameData = resFrame.data
        this.cutLineList.push({
          start: 0,
          end: duration,
          duration,
          refVideoId: id,
          videoPlayStartTime: 0,
          videoPlayEndTime: duration,
          width: Number(duration * currentZommEachSectionWidth).toFixed(3),
          videoData,
          exportDeleted: false,
          id: new Date().getTime(),
          frameData: res.data,
          // subtitleList: resSubtitle,
          fIndex: 0
        })
      } else {
        res.data.forEach((item, index) => {
          const jsonData = JSON.parse(item)
          jsonData.width = Number(jsonData.duration * currentZommEachSectionWidth).toFixed(3)
          jsonData.fIndex = index
          res.data[index] = jsonData
        })

        this.cutLineList = res.data
      }
      this.currentActiveCutItemData = this.cutLineList[0]
      this.updateAllCutLineListTotalDuration()
      this.saveOperateClipsVideoCutting()
    },
    getCutLineListDurationTotal(index) {
      let total = 0
      for (let i = 0; i < index; i++) {
        const item = this.cutLineList[i]
        total += item.duration
      }
      console.log(total, 11111)
      return total
    },
    handleVideoCut(val, isHistroyAction) {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      // const deleteCutLineListTotalDuration = this.getDeleteCulLineListDurationTotal() || 0
      const time = val || this.video.currentTime
      const totalVideoDuration = this.video.totalVideoDuration
      // 如果是裁剪点为起始点或者超过视频时长不能进行裁剪
      if (!time || time > totalVideoDuration) return false
      this.cutLineList.forEach((item, index) => {
        if (time > item.start && time < item.end) {
          // let prevVideoPlayEndTime = 0
          // const prevCutLineListDurationTotal = this.getCutLineListDurationTotal(index)
          // console.log(deleteCutLineListTotalDuration, prevCutLineListDurationTotal, '裁剪前的总时长')
          // if (deleteCutLineListTotalDuration > 0) {
          //   prevVideoPlayEndTime = time + deleteCutLineListTotalDuration - prevCutLineListDurationTotal
          // } else {
          //   prevVideoPlayEndTime = time - prevCutLineListDurationTotal
          // }

          const prevCutLineListDurationTotal = this.getCutLineListDurationTotal(index)

          const videoPlayEndTime = time - prevCutLineListDurationTotal + item.videoPlayStartTime
          console.log(time, prevCutLineListDurationTotal, videoPlayEndTime, '裁剪前的总时长')
          const cutStartData = {
            start: item.start,
            end: time,
            videoPlayStartTime: item.videoPlayStartTime,
            duration: time - item.start,
            videoPlayEndTime: videoPlayEndTime,
            width: Number((time - item.start) * currentZoomSectionWidth).toFixed(3),
            videoData: item.videoData,
            refVideoId: item.refVideoId,
            exportDeleted: false,
            id: new Date().getTime(),
            fIndex: item.fIndex
          }
          const cutEndData = {
            start: time,
            end: item.end,
            duration: item.end - time,
            videoPlayStartTime: cutStartData.videoPlayEndTime,
            videoPlayEndTime: item.videoPlayEndTime,
            exportDeleted: false,
            width: Number((item.end - time) * currentZoomSectionWidth).toFixed(3),
            videoData: item.videoData,
            refVideoId: item.refVideoId,
            id: new Date().getTime() + 1,
            fIndex: item.fIndex + 1
          }

          const _index = this.cutLineList.indexOf(item)
          this.cutLineList.splice(_index, 1, cutStartData, cutEndData)
        }
      })
      console.log(this.cutLineList, '裁剪后的片段列表')
      this.saveOperateClipsVideoCutting('裁切')
      this.video.cutLineList = this.cutLineList
      // this.updateCutlineList()
      if (!isHistroyAction) {
        this.setActionHistory({
          eventFun: 'cut',
          value: time
        })
      }
    },
    async saveOperateClipsVideoCutting(string) {
      console.log(string, '裁剪片段来源。。。。。。。。。。。')
      const projectId = this.$route.query.projectId
      const content = []
      this.cutLineList.forEach((item, index) => {
        content.push(JSON.stringify(item))
      })
      await operateClipsVideoCutting({
        projectId,
        videoId: this.video.detail.id,
        content
      })
    },

    // 刻度尺调整，同步裁剪块
    sliderInitCutLineList() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      this.cutLineList.forEach((item) => {
        const time = item.duration
        item.width = time * currentZoomSectionWidth
      })
    },

    testHandleClickClear() {
      this.cutLineList = []
      this.video.cutLineList = []
      this.saveOperateClipsVideoCutting('裁切')
    },
    getCutLineListStartTime(currentTime, index) {
      let total = 0
      for (let i = 0; i < index; i++) {
        const item = this.cutLineList[i]
        total += item.duration
      }
      return currentTime - total
    },
    getIsCompleteCutLine() {
      let isCompleteCutLine = false
      const initLength = this.initResLiineList.length
      const videoDuration = this.video.detail.duration
      const firstCutLineData = this.cutLineList[0]
      if (initLength === 1) {
        if (firstCutLineData.duration === videoDuration) {
          isCompleteCutLine = true
        }
      }
      return isCompleteCutLine
    },
    // 实时监听播放进度
    handleVideoTimeUpdate(val) {
      console.log(this.cutLineList, val, '当前播放的时间与片段列表。。。')
      console.log(this.video.isSwitchVideoSeek, this.initResLiineList, '是否是多视频播放')
      if (!val) return
      const isCompleteCutLine = this.getIsCompleteCutLine()
      // 如果是整段片段不需要进行二次跳转，没有删除片段
      if (isCompleteCutLine) return
      // 如果监听到播放器跳转经过二次跳转后，就不进行二次跳转的逻辑
      // if (this.video.isSwitchVideoSeek) return
      const isSeek = this.video.isVideoSeek

      // 自动播放时,切换播放视频地址
      this.cutLineList.forEach((item, index) => {
        console.log(val, item, 'item')
        if (val > item.start && val < item.end) {
          console.log(this.currentActiveCutItemData, item, '当前播放的片段')
          // 是否是同一视频播放
          if (item.videoData.videoUrl !== this.currentActiveCutItemData.videoData.videoUrl) {
            // 自动播放
            if (!isSeek) {
              console.log(this.cutLineList, '不同一视频自动播放')
              const videoUrl = this.cutLineList[index].videoData.videoUrl
              const startTime = this.cutLineList[index].videoPlayStartTime
              this.vePlayerChangeAndSeek(videoUrl, startTime)
            } else {
              // 跳帧播放
              console.log(this.cutLineList, '不同一视频跳帧播放')
              const videoUrl = this.cutLineList[index].videoData.videoUrl
              const startTime = this.getCutLineListStartTime(val, index)
              this.vePlayerChangeAndSeek(videoUrl, startTime, true)
            }
          } else {
            // 同一视频调换片段位置播放
            if (isSeek) {
              console.log(this.cutLineList, '同一视频自动播放')
              const start = this.cutLineList[index].videoPlayStartTime
              const startAdd = val - this.cutLineList[index].start
              const startTime = start + startAdd
              this.updatePlayVideoSeekTime({ time: startTime, isPause: isSeek })
              this.cutLineList[index].isSeekPlay = true
            } else {
              console.log(this.cutLineList, '同一视频跳转播放')
              if (!this.cutLineList[index].isSeekPlay) {
                const start = this.cutLineList[index].videoPlayStartTime
                const startAdd = val - this.cutLineList[index].start
                const startTime = start + startAdd
                this.updatePlayVideoSeekTime({ time: startTime, isPause: isSeek })
                this.cutLineList[index].isSeekPlay = true
              }
            }
          }
          this.currentActiveCutItemData = item
          this.video.currentPlayCutLineItem = item
        } else {
          this.cutLineList[index].isSeekPlay = false
        }
      })
    },
    // 切换视频，并跳帧播放
    vePlayerChangeAndSeek(url, time, isPause = false) {
      this.video.isSwitchVideoSeek = true
      const pause = isPause ? 'pause' : 'play'
      const vePlayer = this.video.vePlayer
      vePlayer.playNext({ url })
      vePlayer.on('loadeddata', () => {
        vePlayer.player.seek(time, pause)
        setTimeout(() => {
          this.video.isSwitchVideoSeek = false
        }, 500)
      })
    },
    updateAllCutLineListTotalDuration() {
      // 如果片段列表中的第一个片段的视频id与当前视频id不一致，需要切换播放器信息
      const firstCutLineData = this.cutLineList[0]
      const currentVideoPlayData = this.video.detail
      if (firstCutLineData.videoData.videoUrl !== currentVideoPlayData.videoUrl) {
        this.vePlayerChangeAndSeek(firstCutLineData.videoData.videoUrl, firstCutLineData.videoPlayStartTime, true)
      }
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const videoTotalDuration = this.cutLineList.reduce((sum, obj) => sum + Number(obj.duration), 0)
      const videoTotalWidth = videoTotalDuration * currentZoomSectionWidth
      this.$emit('add', videoTotalWidth)
      this.updatetoTalVideoDuration(videoTotalDuration)
      this.video.cutLineList = this.cutLineList
    }
  }
}
</script>
<style lang="scss" scoped>
 .line-content {
    position: absolute;
    // width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .line-item {
      position: relative;
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
    .frame-content{
      display: flex;
      overflow: hidden;
      .frame-item{
        width:90px;
        flex:0 0 auto;
        height:160px;
      }
    }
  }
</style>
