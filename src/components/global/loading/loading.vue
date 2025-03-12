<template>
  <div v-show="visible" class="loading-wrap active" v-bind="$attrs">
    <svg-icon class-name="liveTypeicon" icon-class="_wating" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.loading-wrap {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  transition: background-color .3s .1s, transform 0s .5s;
  transform: translateY(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  .liveTypeicon {
    font-size: 38px;
  }
}
.loading-wrap.active {
  background-color: rgba(250, 250, 250, 0);
  transform: translateY(0);
  transition: background-color .3s, transform 0s 0s;
}
</style>
