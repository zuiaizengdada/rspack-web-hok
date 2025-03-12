<template>
  <div :style="{ height: item.minHeight }" class="myShoping">
    <div class="item">
      <img src="~@/assets/image/homeSetting/wdyg.png" alt="" />
    </div>
    <div class="item">
      <img src="~@/assets/image/homeSetting/qbkc.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
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
.myShoping {
  width: 100%;
  height: 48px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item {
    width: 48%;
    height: 48px;
    border-radius: 6px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
