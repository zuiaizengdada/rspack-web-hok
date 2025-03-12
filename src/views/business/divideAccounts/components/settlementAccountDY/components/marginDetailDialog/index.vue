<template>
  <el-dialog
    title="冻结金额说明"
    :visible.sync="dialogVisible"
    width="35%"
    :before-close="handleClose"
    :footer="null"
  >
    <span class="msg">
      为保障抖音小程序用户订单售后服务履行，商家需向平台留存一定比例的冻结金额。目前多用于抖音小程序渠道结算后订单”产生退款的情况，退款金额将从商家抖音可提现账户扣除
    </span>
    <el-table
      border
      :header-cell-style="{ background: '#F3F3F3' }"
      :data="tableData"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="a" label="类型" />
      <el-table-column prop="b" label="冻结金额" />
      <el-table-column prop="c" label="说明">
        <template slot-scope="scope">
          <span
            @click="dialogVisible = true"
          >冻结金额"根据上个自然月商家抖音渠道GMV ￥<span
            style="color: #409eff"
          >{{ scope.row.c }}</span>计算应缴金额（比例1%）</span>
        </template></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: []
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
