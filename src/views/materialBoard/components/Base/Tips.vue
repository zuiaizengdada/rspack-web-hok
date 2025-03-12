<template>
  <div class="tips-container flex items-center">
    <span class="tips-title"> {{ title }}</span>
    <el-tooltip
      class="item"
      effect="dark"
      placement="top"
    >
      <div v-for="(item,index) in tips" slot="content" :key="index" :style="index!==tips.length?'margin-bottom: 4px':''">
        {{ item }}
      </div>
      <img src="@/assets/image/product/icon.png" style="width: 16px;height: 16px;" />
    </el-tooltip>
  </div>
</template>
<script function>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: Array,
      default: () => []
    }
  }

}
</script>
  <style lang="scss" scoped>
  .tips-container{
      position: relative;
      display: flex;
      margin-bottom: 14px;
        .tips-title{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-right: 8px;
        }
  }
  </style>

