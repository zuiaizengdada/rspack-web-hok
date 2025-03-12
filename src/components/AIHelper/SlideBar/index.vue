<template>
  <!-- <VueDragResize
    :is-draggable="draggable"
    :is-active="true"
    :x="initialX"
    :y="55"
    w="auto"
    h="auto"
    :sticks="['bl']"
    :aspect-ratio="true"
    class="drag-resize-container"
    :prevent-active-behavior="true"
  >
    <div class="slideBar-container">
      <ordinarySlide />
    </div>
  </VueDragResize> -->
  <MyDrag
    id="drag-resize-container"
    key="1"
    class="drag-resize-container"
    :x="initialX"
    :y="55"
    :w="432"
    :h="100"
  >
    <template slot="default">
      <div class="slideBar-container">
        <ordinarySlide />
      </div>
    </template>
  </MyDrag>
</template>
<script>
import ordinarySlide from '../sceneAssistant/ordinary-slide.vue'
// import VueDragResize from 'vue-drag-resize'
import MyDrag from '@/components/MyDrag'
export default {
  components: {
    ordinarySlide,
    MyDrag
  },
  data: () => ({
    initialX: 0,
    draggable: true
  }),
  created() {
    this.calculateInitialX()
  },
  methods: {
    calculateInitialX() {
      // 获取屏幕宽度
      const screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth

      // 设置初始 x 坐标为屏幕宽度减去组件宽度
      this.initialX = screenWidth - 450 // 假设组件宽度为 200，你可以根据实际情况调整
    }
  }
}
</script>
<style lang="scss" scoped>
.aiHelper-slide-container {
  width: 432px;
  height: 100%;
}
.slideBar-container {
  position: relative;
  // top: 0;
  width: 432px;
  height: calc(100vh - 60px);
  border-radius: 10px;
  background: #f9f9f9;
  border-left: 1px solid #eee;
  box-shadow: -6px 0px 31px 0px rgba(0, 0, 0, 0.2);
  z-index: 6000;
  cursor: grab;
  overflow: hidden;
}
.drag-resize-container::v-deep {
  &:before {
    display: none !important;
  }
  user-select: text; /* 允许文本被选择 */
  .vdr-stick {
    display: none !important;
  }
}
</style>
