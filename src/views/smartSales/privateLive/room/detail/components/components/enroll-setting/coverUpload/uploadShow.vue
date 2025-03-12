<template>
  <div
    v-loading="loading"
    class="uploadShow"
    :style="{ width: width + 'px', height: height + 'px' }"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <template v-if="getFileType(url).fileType === 'img'">
      <div class="fileView">
        <ImagePreviewer
          style="width: 100%; height: 100%"
          :src="url"
          :scale-width="235"
          :scale-height="132"
          fit="cover"
          :preview-src-list="[url]"
        />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'video'">
      <div class="videoView" @click="playVideo(getFileType(url))">
        <el-image :src="getPoster(url)" fit="contain" class="poster">
          <img
            slot="error"
            src="@/assets/image/jiazaishibia.png"
            alt=""
            style="width: 100%; height: 100%"
          />
        </el-image>
        <svg-icon icon-class="bofang" class="bofangIcon" />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'file'">
      <div class="fileView">
        <img
          src="~@/assets/image/excel.png"
          alt=""
          style="width: 32px; height: 32px"
        />
      </div>
    </template>
    <transition name="slide">
      <div v-if="!disabled" class="maskdShow">
        <div class="maskdShowText">查看大图</div>
        <el-upload
          ref="upload"
          class="maskdShowText"
          action="#"
          :limit="1"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="upload"
          :show-file-list="false"
        >
          <div class="maskdAginText">重新上传</div>
        </el-upload>
      </div>
    </transition>
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import AppVideo from '@/components/AppVideo'
export default {
  components: {},
  props: {
    uploadShowArr: {
      type: Array,
      default: () => {
        return ['重新上传', '删除']
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    noMask: {
      type: Boolean,
      default: false
    },
    beforeUpload: {
      type: Function,
      default: () => {}
    },
    accept: {
      type: String,
      default: '*'
    },
    width: {
      type: [Number, String],
      default: ''
    },
    height: {
      type: [Number, String],
      default: ''
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
    mouseenter() {
      if (this.noMask) {
        return
      }
      this.maskdShow = true
    },
    mouseleave() {
      this.maskdShow = false
    },
    getPoster(src) {
      if (!src) return ''
      // 如果服务端返回的 src 带有 x-oss-process query 参数，说明已经处理过缩略图，不需要继续处理。
      // 主要解决视频的缩略图
      if (src.includes('x-oss-process=')) return src
      // 如果压缩长、高度为 0 则不做处理
      return `${src}?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast`
    },
    upload(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$emit('upload', e)
    },
    onhandleClick(res) {
      this.$emit('onClick', res)
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadShow {
  width: 160px;
  height: 112px;
  background: #edeff2;
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
    background: rgba(0, 0, 0, 0.2);
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
  .fileView {
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
    border: 1px solid #eff2f6;
    > img {
      margin: 30px auto 0;
    }
  }
}
.maskdShow {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  height: 32px;
  background: #333333;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  .maskdShowText {
    flex: 1 0 0;
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 32px;
    pointer-events: none;
  }
  .maskdAginText {
    pointer-events: auto;
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
    transform: translate3d(0, 100%, 0);
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
    transform: translate3d(0, 100%, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
