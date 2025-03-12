<template>
  <div class="base-title-container flex items-center">
    <em />
    <h4>{{ title }}</h4>
    <slot name="right" />
  </div>
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
.base-title-container{
    margin-bottom:20px;
    em{
        width: 4px;
        height: 24px;
        background: #0C6FFF;
        border-radius: 6px;
        margin-right:8px;
    }
    h4{
        color:#333;
        font-size:16px;
    }
}
</style>
