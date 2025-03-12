<template>
  <div class="videoView" @click="playVideo">
    <el-image
      fit="cover"
      :src="url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast'"
      style="width: 100%; height: 100%"
    >
      <img
        slot="error"
        src="@/assets/image/videoBox.png"
        alt=""
        style="width: 100%; height: 100%"
      />
    </el-image>
    <div class="mask">
      <!-- <svg-icon icon-class="bofang" /> -->
      <svg-icon icon-class="bofang" />
    </div>
  </div>
</template>
<script>
import AppVideo from '@/components/AppVideo'
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      myPoster: ''
    }
  },
  mounted() {},
  methods: {
    playVideo() {
      if (this.type === 3) {
        AppVideo.play({
          url: this.url,
          poster:
            this.url +
            '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast'
        })
      } else {
        this.$AppAudio({
          visible: true,
          src: this.url
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.videoView {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  .mask {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    // background: #F0F0F0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
