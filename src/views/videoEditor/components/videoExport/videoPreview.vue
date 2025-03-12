<template>
  <div class="videoPreview">
    <div class="videoSelectTitle">视频预览</div>
    <div class="videoPreviewContent">
      <video-player ref="videoPlayer" :if-play="ifPlay" :video-id="projectVideoId" :list="selectedList" :src="previewVideoData.videoUrl" :preview="previewVideoData" @play="videoPlaying" />
    </div>
    <div class="videoPreviewTips">
      <div v-if="previewVideoData.videoName" class="videoName m-r-16">视频名称：{{ previewVideoData.videoName }}</div>
      <div v-if="previewVideoData.label" class="label m-r-16">片段{{ previewVideoData.previewPlayIndex + 1 }}：{{ previewVideoData.label }}</div>
      <div v-if="previewVideoData.duration" class="duration m-r-16">时长：{{ renderDuration() }}</div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue'
import moment from 'moment'
export default {
  components: {
    VideoPlayer
  },
  props: {
    projectVideoId: {
      type: String,
      default: ''
    },
    previewVideoData: {
      type: Object,
      default: () => {}
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    projectId: {
      type: String,
      default: ''
    },
    ifPlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    videoPlaying(index) {
      console.log(index)
      // this.$refs.list.updateActiveItem(index)
    },
    renderDuration() {
      if (!this.previewVideoData.end) {
        return ''
      } else {
        const str = moment.utc(this.previewVideoData.end - this.previewVideoData.start).format('HH:mm:ss:SSS')
        const arr = str.split(':')
        if (arr[0] === '00' && arr[1] === '00' && arr[2] === '00') {
          return `${arr[3]}毫秒`
        } else if (arr[0] === '00' && arr[1] === '00') {
          return `${arr[2]}秒${arr[3]}毫秒`
        } else if (arr[0] === '00') {
          return `${arr[1]}分${arr[2]}秒${arr[3]}毫秒`
        } else {
          return `${arr[0]}时${arr[1]}分${arr[2]}秒${arr[3]}毫秒`
        }
      }
    },
    destroyPlayer() {
      this.$refs.videoPlayer && this.$refs.videoPlayer.destroyPlayer()
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .player-content {
    height: 450px;
    border: none;
  }
}
.videoPreview {
  .videoSelectTitle {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #DEDEDE;
    line-height: 28px;
    margin-bottom: 16px;
  }
  .videoPreviewContent {
    width: 452px;
    height: 494px;
    background: #1E1F1E;
    border: 1px solid #000000;
  }
  .videoPreviewTips {
    width: 450px;
    display: flex;
    margin-top: 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #D9D9D9;
    line-height: 22px;
    .videoName {
      // flex: 1 0 0;
      word-break:keep-all;       /* 不换行 */
      white-space:nowrap;        /* 不换行 */
      overflow:hidden;           /* 内容超出宽度时隐藏超出部分的内容 */
      text-overflow:ellipsis;    /*溢出时显示省略标记...；需与overflow:hidden;一起使用*/
    }
    .label {
      word-break:keep-all;
      white-space:nowrap;
    }
    .duration {
      word-break:keep-all;
      white-space:nowrap;
    }
  }
}
.m-r-16 {
  margin-right: 16px;
}
</style>
