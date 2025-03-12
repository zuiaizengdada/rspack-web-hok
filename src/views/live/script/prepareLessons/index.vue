<template>
  <div v-loading="loading" class="prepareLessons">
    <div v-if="info.refVideoId">
      <div class="prepareLessons-top">
        <div class="back" @click="goBack">
          <i class="el-icon-arrow-left m-r-2" />
          <span>返回</span>
        </div>
        <div class="title">{{ info.coursewareName }}——备课内容</div>
      </div>
      <div class="prepareLessons-contet">
        <div class="prepareLessons-left">
          <div v-if="info.videoDetail" class="title">
            视频课件名称：{{ info.videoDetail.videoName }}.{{
              info.videoDetail.format
            }}
          </div>
          <div class="prepareLessons-video">
            <div v-if="mediaProcessTaskStatus === 1" class="videoNoData">
              视频转码中
            </div>
            <div v-else-if="mediaProcessTaskStatus === 3" class="videoNoData">
              视频转码失败
            </div>
            <VideoView
              ref="VideoView"
              start-time="0"
              :show-online-num="false"
              :playback-rate="[1, 1.5, 2]"
            />
          </div>
        </div>
        <div class="prepareLessons-right">
          <LessonContent :duration="info.videoDetail.duration" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoView from '@/views/live/liveList/component/videoReplay/videoView.vue'
import LessonContent from './components/lessonContent.vue'
import { coursewareDetail } from '@/api/liveRoom/courseware'
import { getVideoDetail } from '@/api/liveVideo/index.js'
export default {
  name: 'PrepareLessons',
  components: {
    VideoView,
    LessonContent
  },
  data() {
    return {
      loading: false,
      info: {},
      mediaProcessTaskStatus: 1, // 媒体处理任务状态 1-转码中 2-转码成功 3-转码失败
      url: '',
      playerStatus: '' // 视频的播放状态
    }
  },
  mounted() {
    this.getData()
  },
  provide() {
    return {
      // 播放时间
      setPlayerStatus: this.setPlayerStatus
    }
  },
  methods: {
    async getData() {
      this.loading = true
      const { data } = await coursewareDetail(this.$route.params.id).finally(
        () => {
          this.loading = false
        }
      )
      this.info = data || {}
      this.$nextTick(() => {
        this.$refs.VideoView.getSubtitleList(data.videoDetail.videoId)
        this.initVideo(data.videoDetail.videoId)
      })
    },
    initVideo(videoId) {
      getVideoDetail(videoId).then(res => {
        console.log('获取视频状态', res)
        this.mediaProcessTaskStatus = res.mediaProcessTaskStatus // 1-转码中 2-转码成功 3-转码失败
        this.url = res.data.hlsUrl ? res.data.hlsUrl : res.data.url
        this.$refs.VideoView &&
          this.$refs.VideoView.play('', res.data.coverUrl, res.data)
        return res.data
      })
    },
    setPlayerStatus(val) {
      this.playerStatus = val
    },
    goBack() {
      const { isNewLiveRoom, videoId, videoName } = this.$route.query
      console.log(this.$route.query, 'this.$route.query,')
      if (isNewLiveRoom) {
        this.$router.push(
          `/privateLive/LiveNewScript?videoId${videoId}&videoName=${videoName}`
        )
      } else {
        this.$router.push('/live/script')
      }
      // console.log(query, 'query,')
      // this.$router.go(-1)

      // this.$router.push('/live/script')
    }
  }
}
</script>
<style lang="scss" scoped>
.prepareLessons {
  width: 100vw;
  height: 100vh;
  background: #f6faff;
  min-width: 1900px;
  .prepareLessons-top {
    display: flex;
    padding: 15px;
    .back {
      width: 102px;
      height: 45px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 45px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      background: #fff;
      i {
        margin-left: -6px;
        margin-right: 6px;
      }
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      // height: 75px;
      // line-height: 75px;
      text-align: center;
      word-break: break-all;
      flex: 1;
      text-align: center;
    }
  }
  .prepareLessons-contet {
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: calc(100vh - 75px);
    margin: 0 15px;
    border-radius: 10px;
    border: 1px solid #e7e7e7;
    .prepareLessons-left {
      width: 638px;
      padding: 20px;
      height: 100%;
      border-right: 1px solid #e7e7e7;
      .title {
        margin-bottom: 18px;
        font-size: 24px;
        font-weight: 600;
        word-break: break-all;
      }
      .prepareLessons-video {
        position: relative;
        width: 100%;
        height: 359px;
      }
      .videoNoData {
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 998;
      }
    }
    .prepareLessons-right {
      flex: 1;
      height: 100%;
      padding: 20px;
    }
  }
}
</style>
