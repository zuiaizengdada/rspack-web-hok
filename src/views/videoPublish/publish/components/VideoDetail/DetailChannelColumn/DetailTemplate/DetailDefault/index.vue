<template>
  <div class="relative">
    <div class="guide-text absolute">
      <!-- <p class="step1">点击【添加账号】进行账号选择</p>
      <p class="step2">完成账号选择后进行账号发布设置</p>
      <p class="step3">点击【一键发布】进行发布</p>  -->
    </div>
    <img style="width: 330px; margin-top: 60px;" :src="DefaultDetailImg" />
  </div>
</template>
<script>
import DefaultDetailImg from '@/assets/image/account/icn_jc.png'
export default {
  data() {
    return {
      DefaultDetailImg
    }
  }
}
</script>
<style lang="scss" scoped>
.guide-text{
  top:22px;
  left:70px;
  p{
    color:#333333;
    font-size: 16px;
    &.step1{
      margin-bottom:116px;
    }
    &.step2{
      margin-bottom:307px;
    }
  }
}

</style>
