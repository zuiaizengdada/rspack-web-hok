
<template>
  <div class="videoView" @click="playVideo">
    <el-image fit="contain" :src="imgUrl" style="width: 100%; height: 100%">
      <img slot="error" src="" alt="" style="width: 100%; height: 100%">
    </el-image>
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
      imgUrl: require('@/assets/image/zanwufnegm.png')
    }
  },
  mounted() {},
  methods: {
    playVideo() {
      if (this.url.substr(0, 7).toLowerCase() === 'http://' || this.url.substr(0, 8).toLowerCase() === 'https://') {
        return window.open(this.url, '_blank')
      } else {
        return window.open('http://' + this.url, '_blank')
      }
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
  cursor: pointer;
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
