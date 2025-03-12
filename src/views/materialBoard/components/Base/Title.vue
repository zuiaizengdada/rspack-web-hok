<template>
  <div class="title-container flex items-center">
    <em />
    <span> {{ title }}</span>
  </div>
</template>
<script function>
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
    position: relative;
    em{
        width: 4px;
        height: 24px;
        margin-right: 8px;
        border-radius: 6px;
        background: rgb(12, 111, 255);
    }
}
</style>
