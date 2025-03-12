<template>
  <div class="videoPlayer" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <!-- 播放器 -->
    <div v-if="showVideo" :id="id" class="video" />
    <!-- 封面图展示 -->
    <div class="poster">
      <img src="https://console-image.volcvod.com/tos-vod-cn-v-601e056ec13e28fc/d2a54a2c232041cb9cf4516a50712eba_1663073298~noop.jpeg?sign=1663121879-r0-u0-a452f2b9a700bc9ced296e247c2c0b41" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showVideo: false,
      id: 'video'
    }
  },
  mounted() {},
  methods: {
    getPoster() {
    //   return `https://dev.cover.hokkj.cn/${{}}~tplv-vod-noop.image`
    },
    mouseenter(e) {
      e.preventDefault()
      e.stopPropagation()
      if (this.id === 'video') {
        this.id = `videoplayer${new Date().getTime()}`
        this.showVideo = true
        this.$nextTick(() => {
          // eslint-disable-next-line no-undef
          new VePlayer({
            id: this.id,
            fluid: true,
            url: this.url,
            lang: 'zh',
            // autoplayMuted: true,
            controls: {
              autoHide: false
            },
            autoplay: false,
            sdkErrorPlugin: {
              errorImg: false
            },
            // volume: 0.6,
            ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
          })
        })
      }
    },
    mouseleave() {
      this.id = 'video'
      this.showVideo = false
    }
  }
}
</script>

<style lang='scss' scoped>
.videoPlayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .poster {
        width: 100%;
        height: 100%;
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    > .video {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
