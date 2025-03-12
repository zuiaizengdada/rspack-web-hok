<template>
  <div class="container" :style="{ borderColor: titleColor }" >
    <div class="container-title" :style="{ backgroundColor: titleColor }">
      <span class="c_F1330D">*</span>{{ title }}
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: '#D9D9FF'
    },
  },
  data() {
    return {}
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.container {
  border-radius: 6px;
  border: 2px solid;
  .container-title {
    height: 44px;
    width: 100%;
    line-height: 44px;
    font-size: 16px;
    font-weight: 600;
    padding: 0 14px;
  }
}
.c_F1330D {
  color: #F1330D;
}
</style>
