<template>
  <el-dialog
    title="保证金说明"
    :visible.sync="dialogVisible"
    width="35%"
    :before-close="handleClose"
    :footer="null"
  >
    <span class="msg">
      为保障用户订单售后服务履行，商家需向平台缴存一定金额的保证金。目前多用于“结算后订单”产生退款的情况，退款金额将从商家保证金中扣除。保证金应缴金额采取就高原则，取商家保证金/浮动保证金二者最大值金额。
    </span>
    <el-table
      border
      :header-cell-style="{ background: '#F3F3F3' }"
      :data="tableData"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="a" label="类型" />
      <el-table-column prop="b" label="保证金应缴金额" />
      <el-table-column prop="c" label="说明" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          a: '商家保证金',
          b: '10,000.00',
          c: '保证金应缴金额采取就高原则，取商家保证金/浮动保证金二者最大值金额。'
        },
        {
          a: '浮动保证金',
          b: '5,000.00',
          c: '"浮动保证金"根据上个自然月商家GMV ￥500,000.00计算应缴金额（比例1%）'
        }
      ]
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.msg {
  color: #333333;
  font-size: 14px;
}
::v-deep {
  .el-dialog__header {
    padding-bottom: 0px;
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #000000;
    }
  }
  .el-dialog__body {
    padding-top: 20px;
  }
}
</style>
