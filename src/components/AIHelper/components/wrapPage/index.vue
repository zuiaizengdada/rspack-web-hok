<template>
  <!-- <transition name="slide"> -->
  <div v-if="visbile" class="wrapPage">
    <slot />
    <div class="leftBorder" />
  </div>
  <!-- </transition> -->
</template>

<script>
export default {
  components: {},
  props: ['visbile'],
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.wrapPage {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(225deg, #F8FBFF 0%, #F9FCFF 100%);
    overflow: auto;
    z-index: 12;
    .leftBorder {
      position: fixed;
      left: 279px;
      top: 0;
      width: 1px;
      height: 50px;
      background: #F0F0F0;
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
    transform: translate3d(-100%, 0, 0);
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
    transform: translate3d(-100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
