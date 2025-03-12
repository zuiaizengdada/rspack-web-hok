<template>
  <div class="video-bottom-container relative">
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
        <div class="content-left h-full">
          <p style="height:70px;" />
          <div class="flex items-center justify-center" style="height:calc(100% - 145px);">
            <ul :class="{isWidth:isVideo1080p}">
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
                <track-maps
                  class="track-maps"
                />
                <!-- <track-mark
                  :style="{ width: width + 'px' }"
                  class="trank-mark"
                  @edit="dialogMarkEdit"
                />-->
                <track-subtitle
                  class="track-subtitle"
                />
                <track-frame-fix />
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
// import TrackSubtitle from './TrackSubtitle'
import TrackVideoFrame from './TrackVideoFrame'
import TrackSeeker from './TrackSeeker'
// import TrackMark from './TrackMark'
import TrackMaps from './TrackMaps'
import DialogMark from './DialogMark.vue'
import AssitSeeker from './AssitSeeker'
import TrackFrameFix from './TrackFrameFix'
// import TrackAudio from './TrackAudio'
// import MarkIcon from '../../icons/biaoqinzhanshi_icon.svg'
// import SubTitleIcon from '../../icons/zimu_icon.svg'
import FrameIcon from '../../icons/shipinzhanshi_icon.svg'
import MapsIcon from '../../icons/maps_icon.svg'
import FixIcon from '../../icons/action_frame_icon.svg'
// import AudioIcon from '../../icons/yinpin_icon.svg'
export default {
  components: {
    ActionBar,
    TimeLine,
    TrackSeeker,
    TrackFrameFix,
    // TrackMark,
    // TrackSubtitle,
    TrackMaps,
    TrackVideoFrame,
    AssitSeeker,
    // TrackAudio,
    DialogMark
  },
  inject: ['video', 'updateLayoutMoveSave'],
  data() {
    return {
      width: 0,
      leftIconList: [MapsIcon, FixIcon, FrameIcon],
      // leftIconList: [],
      visibleDialogMark: false,
      editMarkItem: {},
      videoName: '',
      isEditDialogMark: false,
      isMove: false,
      isVideo1080p: true
      // videoEditBottomHight: 600
    }
  },
  computed: {
    getVideoDetail() {
      return this.video.detail
    },
    getMapsList() {
      return this.video.mapsList
    }
  },
  watch: {
    getVideoDetail(val) {
      this.isVideo1080p = val.width === 1920 && val.height === 1080
      this.videoName = val.name
    },
    getMapsList(val) {
      // const isHasMapsIcon = this.leftIconList.includes(MapsIcon)
      // if (val.length > 0) {
      //   if (!isHasMapsIcon) {
      //     this.leftIconList.unshift(MapsIcon)
      //   }
      // } else {
      //   this.leftIconList = [FrameIcon]
      // }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // const layoutMoveData = this.video.layoutMoveData
      // const clientHeight = document.body.clientHeight * 0.46
      // this.videoEditBottomHight = layoutMoveData && Object.keys(layoutMoveData).length > 0 ? layoutMoveData.videoEditBottomHight : clientHeight
      // const documentHeight = document.body.clientHeight
      // const $editCenter = document.querySelector('.video-edit-container .edit-center')
      // const $editMain = document.querySelector('.video-edit-container .edit-main')
      // $editCenter.style.height = documentHeight - this.videoEditBottomHight - 58 + 'px'
      // $editMain.addEventListener('mousemove', this.mousemoveFun)
      // $editMain.addEventListener('mouseup', this.mouseupFun)
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
      ul{

        li{
          display: flex;
          justify-content: center;
          align-items: center;
          &.li0 {
            height:100px;

          }
          &.li1 {
            height: 24px;
          }
          &.li2{
            height:160px;
          }
        }
        &.isWidth{
          .li2{
            height:90px;
          }
        }
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
      height: calc(100% - 46px);
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
