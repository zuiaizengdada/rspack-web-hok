<template>
  <div class="scriptPreciew">
    <!-- 脚本预览 -->
    <div class="wrap_left">
      <videoView ref="playerView" :video-detail="videoDetail" @timeupdate="timeupdate" />
    </div>
    <div class="wrap_right">
      <discussionView :current-time="currentTime" />
    </div>
  </div>
</template>

<script>
import videoView from './component/videoView.vue'
import discussionView from './component/discussionView.vue'
import { getDetail } from '@/api/liveRoom/script'
export default {
  components: {
    videoView,
    discussionView
  },
  data() {
    return {
      currentTime: -1,
      videoDetail: {
        url: '',
        coverUrl: ''
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    timeupdate(res) {
      this.currentTime = Math.round(res)
    },
    // 获取详情
    getDetail() {
      return getDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.scriptInfo = res.data
        this.videoDetail = res.data.videoDetail
        this.$refs.playerView && this.$refs.playerView.play(res.data.videoDetail.url, res.data.videoDetail.coverUrl, res.data.videoDetail)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.scriptPreciew {
  width: 100vw;
  height: 100vh;
  min-width: 1300px;
  min-height: 800px;
  display: flex;
  padding: 20px;
  background: #EBEDF0;
  .wrap_left {
    flex: 1 0 0;
    margin-right: 20px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .wrap_right {
    width: 500px;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
