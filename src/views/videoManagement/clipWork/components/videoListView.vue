<template>
  <div class="videoListView">
    <div class="content" :class="ifCurrent?'current':''" v-bind="$attrs" v-on="$listeners">
      <div class="title text_hidden_ellipsis" :name="name">
        <!-- {{ newTime }} -->
        <span class="title-span text_hidden_ellipsis">
          <span class="flex flex-middle">
            <el-tooltip v-if="version>0" class="item" effect="dark" :content="content" placement="top-start">
              <span v-if="version>0" class="video-version">V{{ version }}</span>
            </el-tooltip>
            <span class="text_hidden_ellipsis" :title="name">{{ name || '' }}</span>
            <span v-if="caremaType === 2" class="caremaName">{{ data.caremaName }}</span>
          </span>
          <!-- <span class="flex">
            <span v-if="data.type === 2" class="caremaName">{{ data.caremaName }}</span>
          </span> -->
        </span>
        <a
          v-if="ifCurrent"
          v-permission="['web:clipWork:down', permsList]"
          :href="`${url}&limit=yes`"
          target="tempiframe"
          download=""
          class="download-a"
          @click="downUrl"
        ><img class="download-ls" src="@/assets/image/video/download.png" /></a>
      </div>
      <div class="videoView">
        <div class="markList">
          <span v-if="isNewVideo === 2" class="newMaterials">新素材</span>
          <span v-if="data.isEmptyMirror === 1" class="emptyScene">空镜</span>
          <span v-if="data.exportStatus === 3" class="exportStatus exportStatus3">已导出</span>
          <span v-if="data.exportStatus === 2" class="exportStatus exportStatus2">部分导出</span>
        </div>
        <!-- <videoPlayer :url="url" /> -->
        <el-image
          :src="getHuoshanPosterUrl(posterUrl)"
          class="posterImg"
          fit="contain"
        >
          <img slot="error" src="@/assets/image/noPoster.png" alt="" style="width: 100%; height: 100%;object-fit: fill;" />
        </el-image>
        <svg-icon icon-class="bofang" class="icon-svg" :class="{active: active}" @click="playVideo" />
      </div>
      <div class="tips">
        <div>
          <span>
            <span class="label">时长：</span>
            <span class="value">{{ getPlayDuration(duration*1000) }}</span>
          </span>
          <span style="margin-left: 16px">
            <span class="label">大小：</span>
            <span class="value">{{ size | filterSize }}</span>
          </span>
        </div>
        <el-button v-if="ifCurrent && data.isEmptyMirror !== 1" size="mini" type="text" class="m-l-12" @click="downloadSubtitles">下载字幕</el-button>
      </div>
    </div>
    <iframe name="tempiframe" style="display: none" />
  </div>
</template>

<script>
// import videoplayer from '@/views/videoManagement/component/videoplayer/index'
import { getPlayDuration } from '@/utils/index'
import { getHuoshanPosterUrl } from '@/utils/index'
import AppVideo from '@/components/AppVideo'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    ifCurrent: {
      type: Boolean,
      default: false
    },
    srtUrl: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    },
    projectVideoId: {
      type: String,
      default: ''
    },
    videoType: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    isNewVideo: {
      type: Number,
      default: 1
    },
    version: {
      type: Number,
      default: 0
    },
    videoCreateTime: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    posterUrl: {
      type: String,
      default: ''
    },
    caremaType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      downloadUrl: '',
      active: false,
      content: '6666666666',
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    videoCreateTime: {
      handler: function (val, oldVal) {
        this.content = `时间：${val}`
      },
      immediate: true
    }
  },
  mounted() {
    console.log('cuuuuuuu: ', this.ifCurrent)
    this.downloadUrl = this.url + '&limit=yes'
  },
  methods: {
    getHuoshanPosterUrl(url) {
      const poster = getHuoshanPosterUrl(url)
      return poster
    },
    downloadSubtitles() {
      if (this.srtUrl) {
        window.open(this.srtUrl)
      } else {
        this.$message.error('暂无字幕')
      }
    },
    getPlayDuration,
    playVideo(e) {
      const that = this
      this.active = true
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      setTimeout(() => {
        // videoplayer.play({
        //   visible: true,
        //   url: that.url,
        //   videoName: that.name,
        //   videoId: that.projectVideoId,
        //   // autoplayMuted: true,
        //   autoplay: false
        // })
        console.log(that.name, that.projectVideoId)
        AppVideo.play({
          visible: true,
          url: that.url,
          videoName: that.name,
          videoId: that.projectVideoId,
          idForVideo: that.projectVideoId,
          videoType: that.videoType,
          closeOnPressEscape: true,
          // autoplayMuted: true,
          autoplay: false
        })
      }, 10)
      setTimeout(() => {
        that.active = false
      }, 500)
    },
    downUrl() {
      console.log('点击下载')
      this.$uweb && this.$uweb.setAction('Event_clipWork_myProject_down')
    }
  }
}
</script>

<style lang='scss' scoped>
.exportStatus{
  height: 20px;
  border-radius: 0px 0px 8px 4px;
  padding: 2px 10px;
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 16px;
}
.caremaName{
    padding: 0 4px;
    box-sizing: border-box;
    // width: 44px;
    height: 18px;
    line-height: 18px;
    border-radius: 4px;
    background: #fff2e6;
    color: #333333;
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
  }
.exportStatus2{
  background: #1A8EC7;
}
.exportStatus3{
  background: #00B42A;
}
.videoListView {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  cursor: pointer;
  .content {
    padding: 10px 8px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #EFF2F6;
    box-sizing: border-box;
    margin-bottom: 20px;
    // border: 2px solid #fff;
    &:hover {
      box-shadow: -2px 4px 12px 0px rgb(22 22 22 / 25%);
    }
    .title {
      // height: 30px;
      // line-height: 30px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      justify-content: space-between;
      .video-version{
        background: #00B8D2;
        border-radius: 2px;
        padding: 0 4px;
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 4px;
      }
      .title-span {
        // float: left;
        width: 80%;
        // line-height: 26px;
        overflow: hidden;
      }
      .download-a {
        float: right;
        z-index: 99;
      }
      .download-ls {
        width: 18px;
        cursor: pointer;
        margin-top: 4px;
        float: right;
      }
    }
    .videoView {
      cursor: pointer;
      // padding-top: 63%;
      width: 243px;
      height: 136px;
      border-radius: 4px;
      opacity: 0.9;
      /* 背景图垂直、水平均居中 */
      background-position: center center;
      /* 背景图不平铺 */
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      overflow: hidden;
      background-color: #f0edf1;
      position: relative;
      .markList{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        display: flex;
      }
    .newMaterials {
      background: #FF7D00;
      border-radius: 4px 0px 8px 0px;
      padding: 2px 10px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #FFFFFF;
      margin-right: 5px;
    }
    .emptyScene{
      padding: 2px 10px;
      background: #00D2B2;
      text-align: center;
      border-radius: 4px 0px 8px 0px;
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
    }
      .posterImg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
      .icon-svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 32px;
        &:hover {
          transform: translate(-50%, -50%) scale(1.2,1.2);
        }
      }
      .active {
        animation:heartbeat .5s 1;
      }
    }
    .tips {
      margin-top: 8px;
      // height: 28px;
      line-height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        color: #777777
      }
      .value {
        color: #333333
      }
    }
  }
  .current {
    border: 2px solid #0C6FFF;
    box-shadow: -2px 4px 12px 0px rgba(22,22,22,0.25);
  }
}
@keyframes heartbeat{
  0%{transform: translate(-50%, -50%) scale(1,1); opacity: 1;}
  25%{transform: translate(-50%, -50%) scale(1.8,1.8); opacity: 0.5;}
  100%{transform: translate(-50%, -50%) scale(2, 2); opacity: 0;}
}
</style>
