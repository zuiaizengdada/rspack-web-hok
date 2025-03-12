<template>
  <div class="common-title">
    {{ title }}
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
.common-title{
    position: relative;
    font-size:16px;
    font-weight: bold;
    padding-left:10px;
    &::before{
        content:'';
        position: absolute;
        top:4px;;
        left:0;
        width: 2px;
        height:15px;
        background:#065CFF;
 ;
    }
}
</style>
