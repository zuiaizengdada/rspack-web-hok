<template>
  <div class="video-bottom-container relative" :style="{height:videoEditBottomHight+'px'}">
    <p class="move-line" @mousedown="mousedownFun" />
    <div class="track-wrapper">
      <action-bar
        class="bar-content"
        @open="dialogMarkOpen"
        @cut="videoFrameCut"
        @prev="videoFramePrev"
        @next="videoFrameNext"
      />
      <div class="track-content">
        <div class="content-left flex justify-center h-full">
          <div class="flex items-center">
            <ul style="height:292px;margin-top:140px;">
              <li v-for="(item, index) in leftIconList" :key="item" :class="'li' + index">
                <img :src="item" />
              </li>
            </ul>
          </div>
        </div>
        <div class="content-right">
          <div class="tracks-box">
            <track-seeker class="seeker" />
            <assit-seeker />
            <time-line
              :style="{ width: width + 'px' }"
              class="time-line"
              @init="timeLineInit"
            />
            <div class="flex items-center track-block">
              <div class="track-block-center">
                <track-mark
                  :style="{ width: width + 'px' }"
                  class="trank-mark"
                  @edit="dialogMarkEdit"
                />
                <track-subtitle
                  class="track-subtitle"
                />
                <track-video-frame
                  ref="videoFrame"
                  style="margin-bottom:10px;"
                />
                <!-- <track-audio :width="width" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog-mark :visible.sync="visibleDialogMark" :data="editMarkItem" :edit="isEditDialogMark" @cancel="cancelDialogMark" />
  </div>
</template>
<script>
import ActionBar from './ActionBar'
import TimeLine from './TimeLine'
import TrackSubtitle from './TrackSubtitle'
import TrackVideoFrame from './TrackVideoFrame'
import TrackSeeker from './TrackSeeker'
import TrackMark from './TrackMark'
import DialogMark from './DialogMark.vue'
import AssitSeeker from './AssitSeeker'
// import TrackAudio from './TrackAudio'
import MarkIcon from '../../icons/biaoqinzhanshi_icon.svg'
import SubTitleIcon from '../../icons/zimu_icon.svg'
import FrameIcon from '../../icons/shipinzhanshi_icon.svg'
// import AudioIcon from '../../icons/yinpin_icon.svg'
export default {
  components: {
    ActionBar,
    TimeLine,
    TrackSeeker,
    TrackMark,
    TrackSubtitle,
    TrackVideoFrame,
    AssitSeeker,
    // TrackAudio,
    DialogMark
  },
  inject: ['video', 'updateLayoutMoveSave'],
  data() {
    return {
      width: 0,
      leftIconList: [MarkIcon, SubTitleIcon, FrameIcon],
      visibleDialogMark: false,
      editMarkItem: {},
      videoName: '',
      isEditDialogMark: false,
      isMove: false,
      videoEditBottomHight: document.body.clientHeight * 0.46
    }
  },
  computed: {
    getVideoDetail() {
      return this.video.detail
    }
  },
  watch: {
    getVideoDetail(val) {
      this.videoName = val.name
    }
  },
  mounted() {
    this.$nextTick(() => {
      const layoutMoveData = this.video.layoutMoveData
      const clientHeight = document.body.clientHeight * 0.46
      this.videoEditBottomHight = layoutMoveData && Object.keys(layoutMoveData).length > 0 ? layoutMoveData.videoEditBottomHight : clientHeight
      const documentHeight = document.body.clientHeight
      const $editCenter = document.querySelector('.video-edit-container .edit-center')
      const $editMain = document.querySelector('.video-edit-container .edit-main')
      $editCenter.style.height = documentHeight - this.videoEditBottomHight - 58 + 'px'
      $editMain.addEventListener('mousemove', this.mousemoveFun)
      $editMain.addEventListener('mouseup', this.mouseupFun)
      // document.addEventListener('mouseout', this.mouseupFun)
    })
  },
  methods: {
    timeLineInit(width) {
      this.width = width
    },
    dialogMarkOpen() {
      this.visibleDialogMark = true
      this.isEditDialogMark = false
    },
    videoFrameCut() {
      this.$refs.videoFrame.handleVideoCut()
    },
    videoFramePrev() {
      this.$refs.videoFrame.cutHistoryPrev()
    },
    videoFrameNext() {
      this.$refs.videoFrame.cutHistoryNext()
    },
    dialogMarkEdit(index) {
      this.visibleDialogMark = true
      this.isEditDialogMark = true
      this.editMarkItem = this.video.markList[index]
    },
    cancelDialogMark() {
      this.isEditDialogMark = false
    },
    mousedownFun() {
      this.isMove = true
    },
    mousemoveFun(e) {
      if (this.isMove) {
        const documentHeight = document.body.clientHeight
        const $editCenter = document.querySelector('.video-edit-container .edit-center')
        const $trackBox = document.querySelector('.video-bottom-container .tracks-box')
        const y = e.movementY
        const height = this.videoEditBottomHight - y
        const maxHeight = documentHeight - 280
        if (height < 300 || height > maxHeight) return false
        this.videoEditBottomHight = height
        $trackBox.style.height = height - 28 + 'px'
        $editCenter.style.height = documentHeight - height - 70 + 'px'
      }
    },
    mouseupFun() {
      this.updateLayoutMoveSave({ videoEditBottomHight: this.videoEditBottomHight })
      this.isMove = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-bottom-container {
    .move-line{
      position: absolute;
      width:100%;
      height: 16px;
      top:-8px;
      cursor: n-resize;
    }
    .bottom-title {
      color: #1778ff;
      height: 40px;
      padding-left: 10px;
      border-bottom: 1px solid #000;
      width: 100%;
    }
  }
  .track-wrapper {
    height: 100%;
  }
  .track-content {
    position: relative;
    height: 100%;
    .content-left {
      height: 100%;
      position: absolute;
      width: 72px;
      left: 0;
      top: 0;
      border-right: 1px solid #000;
      color: #fff;
      z-index: 999;
      .li0 {
        margin-bottom: 10px;
      }
      .li1 {
        margin-bottom: 46px;
      }
      .li2{
        margin-bottom:88px;
      }
    }
    .content-right {
      height: 100%;
      width: 100%;
      padding-left: 72px;
      position: relative;
      box-sizing: border-box;
    }
    .trank-mark,
    .track-subtitle {
      height: 20px;
      margin-bottom:16px;
    }
    .tracks-box {
      overflow-x: auto;
      // overflow-y: hidden;
      height: calc(100% - 36px);
      position: relative;
      padding-top:32px;
      padding-left:4px;
      pointer-events: stroke;
      .seeker {
        cursor: ew-resize;
        position: absolute;
        top: 32px;
        left: 0;
        bottom: 0;
        z-index: 99;
      }
      .track-block{
        height: calc(100% - 46px);
        // overflow-x:hidden;
        // overflow-y: auto;
        .track-block-center{
          min-height: 140px;
        }
      }
    }
  }
  .time-line {
    margin-bottom: 16px;
  }
.video-bottom-container{
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
  }
</style>
