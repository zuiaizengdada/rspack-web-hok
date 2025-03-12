<template>
  <div class="demo-container">
    <p class="bg" />
  </div>
</template>
<script>
import demoPng from './demo.png'
export default {
  data() {
    return {
      demoPng
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-container{
    width:800px;
    height:400px;
}
.bg{
    background: url(./demo.png) no-repeat;
    background-size:170px;
    background-repeat: no-repeat;
    background-position:10px 10px, 10px -20px ;
    height:100px;
    width:200px;
}
</style>
