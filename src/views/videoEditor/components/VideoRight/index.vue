<template>
  <div class="video-right-container relative" :style="{width:videoRightWidth+'px'}">
    <p class="move-line" @mousedown="mousedownFun" />
    <div class="nav flex items-center justify-center">
      <p
        v-for="(item, index) in navList"
        :key="item"
        class="cursor-pointer"
        :class="activeNavIndex === index ? 'active' : ''"
        @click="changeTab(index)"
      >{{ item }}</p>
    </div>
    <div class="content">
      <mark-list v-if="activeNavIndex === 0" />
      <subtitle-list v-if="activeNavIndex === 1" />
      <full-subtitle v-if="activeNavIndex === 2" />
    </div>
  </div>
</template>
<script>
import MarkList from './MarkList'
import SubtitleList from './SubtitleList'
import FullSubtitle from './FullSubtitle'
export default {
  components: {
    MarkList,
    SubtitleList,
    FullSubtitle
  },
  inject: ['video', 'updateLayoutMoveSave', 'updateVideoStatus'],
  data() {
    return {
      activeNavIndex: 0,
      navList: ['内容标记', '视频字幕', '全篇字幕'],
      isMove: false,
      videoRightWidth: 384
    }
  },
  computed: {
    getActiveRightNavIndex() {
      return this.video.activeRightNavIndex
    },
    getVideoDetail() {
      return this.video.detail
    }
  },
  watch: {
    getActiveRightNavIndex(val) {
      this.activeNavIndex = val
    },
    getVideoDetail() {
      this.activeNavIndex = this.video.activeRightNavIndex
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.videoRightWidth = Object.keys(this.video.layoutMoveData).length > 0 ? this.video.layoutMoveData.videoRightWidth || 384 : 384
      const $videoList = document.querySelector('.video-edit-container .edit-main')
      $videoList.addEventListener('mousemove', this.mousemoveFun)
      $videoList.addEventListener('mouseup', this.mouseupFun)

      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      const dataArray = JSON.parse(localLayoutMoveDataString)
      if (dataArray.length > 0) {
        // this.activeNavIndex = dataArray[0].activeNavIndex
      }
    })
  },
  methods: {
    changeTab(index) {
      this.activeNavIndex = index
      this.updateVideoStatus('pause')
      /* const userId = this.$store.state.user.userInfo.userId
      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      const dataArray = JSON.parse(localLayoutMoveDataString)
      if (dataArray.length > 0) {
        dataArray[0].activeNavIndex = this.activeNavIndex
      } else {
        dataArray.push({ userId, activeNavIndex: this.activeNavIndex })
      }
      localStorage.setItem('localLayoutMoveDataList', JSON.stringify(dataArray)) */
    },
    mousedownFun() {
      this.isMove = true
    },
    mousemoveFun(e) {
      if (this.isMove) {
        const movementX = e.movementX
        const width = this.videoRightWidth - movementX
        const videoListWidth = document.querySelector('.video-edit-container .video-list-container').clientWidth + 4
        const documentWidth = document.body.clientWidth
        const maxWidth = documentWidth - videoListWidth - 300
        if (width < 384 || width > maxWidth) return false
        this.videoRightWidth = width
      }
    },
    mouseupFun() {
      this.isMove = false
      this.updateLayoutMoveSave({ videoRightWidth: this.videoRightWidth })
    }
  }
}
</script>
<style lang="scss" scoped>
.video-right-container{
  user-select: none;
    .move-line{
      cursor: col-resize;
      position: absolute;
      top: 0;
      left: -5px;
      width: 10px;
      height: 100%;
      z-index: 2;
    }
    .nav {
      height: 40px;
      border-bottom:1px solid #000;
      p {
        font-size: 16px;
        color: #d9d9d9;
        width:30%;
        text-align: center;
        margin: 0 2s0px;
        position: relative;
        height: 100%;
        line-height: 44px;
        &.active {
          color: #1778ff;
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #1778ff;
            border-radius: 1px;
          }
        }
      }
    }
    .content {
      height: 100%;
      background:#1E1F1E;
    }
  }
</style>
