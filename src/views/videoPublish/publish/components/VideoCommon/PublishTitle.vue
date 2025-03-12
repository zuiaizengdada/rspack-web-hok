<template>
  <p class="title">{{ title }}</p>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
    font-size:16px;
    line-height: 24px;
    color:#333;
    flex:none;
    margin-right:16px;
}
</style>
