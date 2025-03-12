<template>
  <div class="video-edit-container">
    <video-header class="edit-header" @create="goToCreateVideo" />
    <div class="edit-main">
      <div class="flex overflow-hidden edit-center">
        <video-group-item class=" video-group" @add="videoItemAdd" />
        <video-player class=" video-player flex-1" style="width: 100%" />
        <video-right class="video-right" />
      </div>
      <video-bottom ref="bottom" v-loading="loading" class="edit-bottom" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import VideoHeader from './components/VideoHeader.vue'
import VideoGroupItem from './components/VideoGroupItem.vue'
import VideoPlayer from './components/VideoPlayer/index.vue'
import VideoBottom from './components/VideoBottom/index.vue'
import VideoRight from './components/VideoRight/index.vue'
import { markList, subtitleList, getEcsMemory } from './api'
import { getColor } from './utils'
import { videoMixin } from './minxins/video'
import videoExport from '@/views/videoEditor/components/videoExport/index.js'
export default {
  components: {
    VideoHeader,
    VideoPlayer,
    VideoGroupItem,
    VideoBottom,
    VideoRight
  },
  mixins: [videoMixin],
  data() {
    return {
      loading: true,
      autoVideoSaveTimer: null,
      isMovePlayerWidth: false
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false
    this.clearAutoVideoSave()
    next()
  },
  beforeDestroy() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    sessionStorage.setItem('exportedVideoIdArray', JSON.stringify([]))
  },
  mounted() {
    this.initLocalLayoutSave()
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    beforeunloadHandler(e) {
      sessionStorage.setItem('exportedVideoIdArray', JSON.stringify([]))
    },
    videoItemAdd(item, index) {
      this.updateVideoDetail(item)
      this.getMarkList()
      this.getSubTitleList()
    },
    async getMarkListApi() {
      const videoId = this.video.detail.id
      const { data } = await markList({ videoId })
      data.forEach(item => {
        item.color = getColor(item.color)
      })
      this.updateMarkList(data)
      this.loading = false
    },
    async getSubTitleList() {
      const videoId = this.video.detail.id
      const { data } = await subtitleList({ videoId })
      data.forEach((item, index) => {
        item.index = index
      })
      this.video.subtitleList = data
      this.loading = false
    },
    updateAutoVideoSave() {
      this.clearAutoVideoSave()
      let i = 0
      this.autoVideoSaveTimer = window.setInterval(() => {
        i++
        if (i === 3 * 60) {
          this.$message.success('自动保存成功')
          this.updateAutoVideoSave()
        }
      }, 1000)
    },
    clearAutoVideoSave() {
      window.clearInterval(this.autoVideoSaveTimer)
      this.autoVideoSaveTimer = null
    },

    async goToCreateVideo() {
      // const res = await getEcsMemory()
      videoExport.open({
        projectId: this.$route.query.projectId,
        projectVideoId: this.video.detail.id,
        isShowMemory: true, 
        cutLineActiveList: this.video.detail.cutLineActiveList || []
      })
      // const videoId = this.video.detail.id
      // const list = this.video.detail.cutLineActiveList || []
      // const index = this.$refs.videoItemList.activeIndex
      // const projectId = this.$route.query.projectId
      // const duration = this.video.detail.duration
      // this.$router.push({
      //   path: '/videoCreate?list=' + list,
      //   query: {
      //     projectId,
      //     videoId,
      //     index,
      //     duration
      //   }
      // })
    },
    // 初始化本地保存布局数据
    initLocalLayoutSave() {
      // 跟进当前登录人用于id 取值
      const userId = this.$store.state.user.userInfo.userId
      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      if (localLayoutMoveDataString) {
        const localLayoutMoveDataList = JSON.parse(localLayoutMoveDataString)
        const currentLayouData = _.find(localLayoutMoveDataList, { userId: userId })
        this.video.layoutMoveData = currentLayouData
      }
    }

  }
}
</script>
<style lang="scss">
.video-edit-container,.video-custom-scroll {
  border-radius: 2px;
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color:#4D4D4D;
  }
  ::-webkit-scrollbar-thumb {
    background: #A6A6A6;
    border-radius: 10px;
  }
}
</style>
<style lang="scss" scoped>
  .video-edit-container {
    background:#1E1F1E;
    height: 100%;
    width: 100%;
    min-width: 980px;
    .video-group {
      width: 440px;
      border-right: 4px solid #000;
    }
    .edit-main {
      padding-top: 48px;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      user-select: none;
    }
    .video-right {
      width: 384px;
      border-left: 4px solid #000;
    }
    .edit-center{
      height: 54%;
    }
    .edit-bottom{
      height: 46%;
      border-top:4px solid #000;
    }
  }
  ::v-deep .el-loading-mask{
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>
