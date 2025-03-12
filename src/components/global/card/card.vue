<template>
  <!-- 卡片布局组件 -->
  <div class="card">
    <slot />
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

<style lang="scss" scoped>
.card {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 0 0 0;
  box-sizing: border-box;
  height: 100%;
}
</style>
