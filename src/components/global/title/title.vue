<template>
  <!-- 标题组件 -->
  <div class="MTitle">
    <span class="line" />
    <span class="title">
      {{ title }}
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.MTitle {
  display: flex;
  align-items: center;
  // justify-content: center;
  .line {
    width: 4px;
    height: 24px;
    background: #0C6FFF;
    border-radius: 6px;
    margin-right: 8px;
  }
  .title {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
  }
}
</style>
