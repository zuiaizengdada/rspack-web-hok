<template>
  <div>
    <sceneAssistant ref="sceneAssistant" />
  </div>
</template>

<script>
import sceneAssistant from '../sceneAssistant/ordinary-full.vue'
export default {
  inject: ['getTypeAIList'],
  components: {
    sceneAssistant
  },
  computed: {
    getInfo() {
      return this.getTypeAIList?.find(item => item.checked)
    }
  },
  methods: {
    useAssistant(id) {
      this.$refs.sceneAssistant && this.$refs.sceneAssistant.openAi(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.full-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #05195e;
  z-index: 6000;
  // padding: 24px;
}
</style>
