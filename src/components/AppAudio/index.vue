<template>
  <div>
    <div v-if="visible" class="mask">
      <audio
        :src="src"
        controls="controls"
        autoplay="autoplay"
        controlslist="nodownload"
      />
      <span class="m-l-10 close"><i class="el-icon-circle-close" style="color: #fff" @click="visible = false" /></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
}
.close {
  cursor: pointer;
}
</style>
