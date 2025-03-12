<template>
  <MCard>
    <div class="videoDeliverySettings">抖音通知设置</div>
    <div class="numberText">
      抖音小程序消息订阅单用户当天不能超过 <el-input-number v-model="ceiling.ceilingNum" :precision="0" :step="1" :min="1" :max="3" label="描述文字" size="mini" @change="handleChange" />次
    </div>
  </MCard>
</template>

<script>
import { getCeilingNum, setCeilingNum } from '@/api/deliver/baseSeeting'
export default {
  components: {},
  data: () => ({
    ceiling: { ceilingNum: null }
  }),
  created() {
    this.getCeilingNum()
  },
  methods: {
    async handleChange(val) {
      const res = await setCeilingNum({ ceilNum: val })
      if (res.code === 1) this.$message.success('设置成功')
    },
    async getCeilingNum() {
      const res = await getCeilingNum()
      if (res.code === 1) this.ceiling = res.data
    }
  }
}
</script>

  <style lang='scss' scoped>
  ::v-deep {
    .el-input-group__append, .el-input-group__prepend {
      padding: 0 10px;
    }
  }
  ::v-deep  .el-form-item__label {
    width: 140px !important;
  }
  .videoDeliverySettings {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
    padding-bottom: 20px;
    margin: 0 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .numberText{
    padding-top: 40px;
    margin-left: 20px;
    color:#333;
  }
  </style>

