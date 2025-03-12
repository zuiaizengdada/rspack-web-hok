<template>
  <div class="text-center account-empty-container">
    <el-image :src="defaultImage" />
    <p class="tips">暂无数据</p>
    <el-button class="btn" size="mini" type="primary" @click="$emit('addGround')"> <b class="el-icon-plus" /> 添加账号</el-button>
  </div>
</template>
<script>
import defaultImage from '../../images/account-empty.png'
export default {
  data() {
    return {
      defaultImage
    }
  }
}
</script>
<style lang="scss" scoped>
.account-empty-container{
    .tips{
        padding-top:12px;
        margin-bottom:36px;
    }
}
</style>
