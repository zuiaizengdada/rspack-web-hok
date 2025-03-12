<template>
  <div class="title-container">
    <div class="title-box" />
    <span class="text">{{ title }}</span>
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
.title-container{
    display: flex;
    align-items: center;
    .title-box{
        width: 4px;
        height: 20px;
        background: #0C6FFF;
        border-radius: 6px;
        margin-right: 10px;
    }
    .text{
        font-size: 16px;
        color: #333333;
    }
}
</style>
