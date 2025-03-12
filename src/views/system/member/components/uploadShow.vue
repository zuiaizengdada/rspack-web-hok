<template>
  <div
    v-loading="loading"
    class="uploadShow"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <template v-if="getFileType(url).fileType === 'img'">
      <div class="fileView">
        <ImagePreviewer
          style="width: 100%; height: 100%;"
          :src="url"
          fit="contain"
          :preview-src-list="[url]"
        />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'video'">
      <div class="videoView" @click="playVideo(getFileType(url))">
        <el-image :src="getPoster(url)" fit="contain" class="poster">
          <img slot="error" src="@/assets/image/jiazaishibia.png" alt="" style="width: 100%; height: 100%" />
        </el-image>
        <svg-icon icon-class="bofang" class="bofangIcon" />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'audio'">
      <div class="audioView" @click="playAudio(getFileType(url))">
        <img src="@/assets/image/mp3.png" alt="" />
        <svg-icon icon-class="bofang" class="bofangIcon" />
      </div>
    </template>
    <template v-else>
      <div class="fileView">
        <ImagePreviewer
          style="width: 100%; height: 100%;"
          :src="url"
          fit="contain"
          :preview-src-list="[url]"
        />
      </div>
    </template>

    <transition name="slide">
      <div v-if="maskdShow" class="maskdShow">
        <i title="播放" class="el-icon-video-play alignUploadIcon" @click="play" />
        <i class="el-icon-download alignUploadIcon" title="下载" @click="down" />
        <!-- <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" /> -->
        <!-- <div class="pointer" @click="$emit('again')">重新上传</div> -->
      </div>
    </transition>
  </div>
</template>

<script>
import { getFileType, downLink } from '@/utils/index'
import AppVideo from '@/components/AppVideo'
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    noMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      maskdShow: false
    }
  },
  mounted() {},
  methods: {
    getFileType,
    playVideo(fileType) {
      AppVideo.play({
        url: this.url,
        autoplay: true,
        poster: ''
      })
    },
    playAudio(fileType) {
      if (fileType.suffix !== 'mp3') {
        return this.$message('暂不支持该格式的文件播放')
      }
      this.$AppAudio({
        visible: true,
        src: this.url
      })
    },
    mouseenter() {
      if (this.noMask) {
        return
      }

      const fileType = getFileType(this.url).fileType
      if (fileType === 'video' || fileType === 'audio') {
        this.maskdShow = true
      }
    },
    mouseleave() {
      this.maskdShow = false
    },
    play() {
      const fileType = getFileType(this.url).fileType
      if (fileType === 'video') {
        this.playVideo(fileType)
      } else if (fileType === 'audio') {
        this.playAudio(getFileType(this.url))
      }
    },
    down() {
      this.loading = true
      downLink(this.url, this.url).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getPoster(src) {
      if (!src) return ''
      // 如果服务端返回的 src 带有 x-oss-process query 参数，说明已经处理过缩略图，不需要继续处理。
      // 主要解决视频的缩略图
      if (src.includes('x-oss-process=')) return src
      // 如果压缩长、高度为 0 则不做处理
      return `${src}?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast`
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadShow {
    width: 160px;
    height: 90px;
    background: #EDEFF2;
    border-radius: 4px;
    .fileView {
      width: 100%;
      height: 100%;
      position: relative;

    }
    .videoView {
      width: 100%;
      height: 100%;
      position: relative;
      background: rgba(0,0,0,0.2);
      backdrop-filter: blur(6px);
      cursor: pointer;
      .poster {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .audioView {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      > img {
        width: 46px;
      }
    }
    .bofangIcon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      cursor: pointer;
    }
}
.maskdShow {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  background: #fbfcfe;
  display: flex;
  align-items: center;
  justify-content: center;
  .alignUploadIcon {
    font-size: 24px;
    cursor: pointer;
    margin: 0 10px;
  }
}

.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
