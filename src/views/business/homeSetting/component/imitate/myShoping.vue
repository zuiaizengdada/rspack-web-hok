<template>
  <div :style="{height: item.minHeight}" class="myShoping">
    <img src="~@/assets/image/homeSetting/myShop.png" alt="" />
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

<style lang='scss' scoped>
.myShoping {
  width: 100%;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
}
</style>
