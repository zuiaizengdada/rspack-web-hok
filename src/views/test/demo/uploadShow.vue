<template>
  <div
    v-loading="loading"
    class="uploadShow"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <template v-if="getFileType(url).fileType === 'img'">
      <div class="fileView">
        <el-image
          style="width: 100%; height: 100%;"
          :src="url"
          fit="contain"
          :preview-src-list="[url]"
        />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'video'">
      <div class="videoView">
        <el-image :src="getPoster(url)" fit="contain" class="poster">
          <img slot="error" src="@/assets/image/jiazaishibia.png" alt="" style="width: 100%; height: 100%" />
        </el-image>
        <svg-icon icon-class="bofang" class="bofangIcon" />
      </div>
    </template>
    <template v-else-if="getFileType(url).fileType === 'audio'">
      <div class="audioView">
        <img src="@/assets/image/mp3.png" alt="" />
        <svg-icon icon-class="bofang" class="bofangIcon" />
      </div>
    </template>
    <template v-else>
      <div class="fileView">
        <el-image
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
      </div>
    </transition>
  </div>
</template>

<script>
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
    mouseenter() {
      if (this.noMask) {
        return
      }

      const fileType = this.getFileType(this.url).fileType
      if (fileType === 'video' || fileType === 'audio') {
        this.maskdShow = true
      }
    },
    mouseleave() {
      this.maskdShow = false
    },
    play() {
      console.log('点击播放')
    },
    getPoster(src) {
      if (!src) return ''
      return this.getHuoshanPosterUrl(src)
    },
    /**
    * 获取火山播放视频封面url
    * @param {*} url 火山返回的PosterUri 或者 StoreUri
    * @param {*} options.tplv 封面图处理模板
    * tplv-vod-obj：获取图片源文件 (默认)
    * tplv-vod-noop：获取压缩的原图
    * tplv-vod-rs： 设置模版宽和高的像素，等比例缩小图片，至整个图片可以放入模版框内。格式为 tplv-vod-rs:宽:高。如果某条边设置为0px，则用另一条边的长做等比缩小；
    * tplv-vod-cc：居中裁剪。需设置宽和高的像素值。参数格式为 tplv-vod-cc:宽:高。先居中裁剪尽量少的像素到指定的宽高比，后缩小到指定宽高；如果某条边被设置为0px，则使用该边在原图中的像素；
    * tplv-vod-cs：智能裁剪。需设置宽和高的像素值。格式为 tplv-vod-cs:宽:高。智能保留图片中的特征区域，缩小方式同 tplv-vod-cc。
    * @param {*} options.imgType 片格式 image（保留源格式）(默认) jpeg webp
    * @returns 封面地址
    */
    getHuoshanPosterUrl(url = '', options = {}) {
      if (!url) {
        return ''
      }
      // {协议}://{封面图域名}/{PosterUri或StoreUri}~{封面图处理模版}.{图片格式}
      return `${process.env.VUE_APP_HUOSHAN_PSSTERURI}${url}~${options.tplv ? options.tplv : 'tplv-vod-obj'}.${options.imgType ? options.imgType : 'image'}`
    },
    /**
     * 通过后缀判断是否音频，视频，图片
     * @param {*} url 文件的url或者文件名
     * @returns {*} obj suffix|文件的后缀(jpg,mp3等) fileType|文件的类型(video|audio|img)
     */
    getFileType(url) {
      const str = url.toLowerCase().split('?')[0]
      let suffix = ''
      let fileType = ''
      // 音频判断
      if (/\.(amr|mp3|wav|aac|mar|wma)$/.test(str)) {
        fileType = 'audio'
      } else if (/\.(3pg|mp4|mov)$/.test(str)) {
        fileType = 'video'
      } else if (/\.(jpg|png|jpeg|bmp)$/.test(str)) {
        fileType = 'img'
      }
      const index = str.lastIndexOf('.') + 1
      suffix = str.substring(index, index + 3)
      return {
        suffix,
        fileType
      }
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
