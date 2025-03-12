<template>
  <p class="title"><slot name="required" />{{ title }}  <slot name="subTitle" /></p>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
    font-size: 16px;
    line-height: 12px;
    color: #333333;
    margin-bottom:12px;
}

</style>
