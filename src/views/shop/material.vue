<template lang="">
  <div class="page_wrap">
    <div class="xe-tabs">
      <div
        class="xe-tabs__content__link"
        :class="{ active: current === 'myimage' }"
        @click="current = 'myimage'"
      >
        图片
      </div>
      <div
        class="xe-tabs__content__link"
        :class="{ active: current === 'myaudio' }"
        @click="current = 'myaudio'"
      >
        音频
      </div>
      <div
        class="xe-tabs__content__link"
        :class="{ active: current === 'myvideo' }"
        @click="current = 'myvideo'"
      >
        视频
      </div>
      <div
        class="xe-tabs__content__link"
        :class="{ active: current === 'myfile' }"
        @click="current = 'myfile'"
      >
        文档
      </div>
      <div
        class="xe-tabs__content__link"
        :class="{ active: current === 'recycle' }"
        @click="current = 'recycle'"
      >
        回收站
      </div>
    </div>
    <!-- <transition> -->
    <component :is="current" />
    <!-- </transition> -->
  </div>
</template>
<script>
import myaudio from './material/audio.vue'
import myimage from './material/image.vue'
import myvideo from './material/video.vue'
import myfile from './material/file.vue'
import recycle from './material/recycle.vue'
export default {
  name: 'Material',
  components: {
    myaudio,
    myimage,
    myvideo,
    myfile,
    recycle
  },
  data() {
    return {
      current: 'myimage'
    }
  },
  created() {
    this.$store.dispatch('option/getClass')
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1300px;
  display: flex;
  flex-direction: column;
  // height: 100%;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  .xe-tabs {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    height: 50px;
    .xe-tabs__content__link {
      text-align: center;
      color: #353535;
      line-height: 48px;
      text-decoration: none;
      margin: 0 20px;
      cursor: pointer;
    }
    .active {
      color: #105cfb !important;
      border-bottom: 2px solid #105cfb !important;
    }
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translate(80px, 0);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
}
</style>
