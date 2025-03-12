<template>
  <div class="videoView" @click="playVideo">
    <el-image
      fit="contain"
      :src="url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast'"
      style="width: 100%; height: 100%"
    >
      <img slot="error" src="@/assets/image/jiazaishibia.png" alt="" style="width: 100%; height: 100%" />
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
    poster: {
      type: String,
      default: ''
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
      AppVideo.play({
        url: this.url,
        poster: this.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,m_fast'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.videoView {
  width: 195px;
  height: 110px;
  border-radius: 5px;
  position: relative;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
