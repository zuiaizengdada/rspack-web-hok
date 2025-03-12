<template>
  <div class="productTransactions">
    <div class="header">
      <span class="headertitle">商品交易记录</span>
      <el-radio-group :value="orderBy" @change="(val) => $emit('sortFn', val)">
        <el-radio :label="0">上架时间排序</el-radio>
        <el-radio :label="1">累计成交金额排序</el-radio>
      </el-radio-group>
    </div>
    <div class="mytable">
      <el-table :data="data" class="tableEl" height="100%" :header-cell-style="{ background: 'transparent' }">
        <el-table-column prop="goodsImg" label="商品" width="88">
          <template slot-scope="{ row }">
            <ImagePreviewer :src="row.goodsImg" fit="contain" class="videoImg" :preview-src-list="[row.goodsImg]" />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="名称" />
        <el-table-column prop="goodsPrice" label="商品价格" align="center">
          <template slot-scope="{ row }">￥{{ row.goodsPrice | filtersMoneyByZero }}</template>
        </el-table-column>
        <el-table-column prop="purchaseOrderNumTotal" label="累计成交订单数" align="center" />
        <el-table-column prop="purchaseMoneyTotal" label="累计成交金额" align="center">
          <template slot-scope="{ row }">￥{{ row.purchaseMoneyTotal | filtersMoneyByZero }}</template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    orderBy: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // value: 0
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.productTransactions {
  padding: 24px 24px 16px;
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headertitle{
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #B6D4FF;
      line-height: 28px;
    }
  }
  .mytable {
    width: 100%;
    height: calc(100% - 28px);
    .tableEl {
      background: transparent;
      height: 100%;
      .videoImg {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        background: rgb(245, 247, 250);
      }
    }
  }
}
::v-deep {
  .el-table::before, .el-table--group::after, .el-table--border::after{
    border-bottom: 1px solid #455E8B;
    color: #B6D4FF;
  }
  .el-table tr {
    background: none;
  }
  .el-table thead .el-table__cell {
    color: #B6D4FF;
  }
  .el-table tbody .el-table__row {
    color: #fff;
  }
  .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 1px solid #455E8B;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: rgba($color: #F5F7FA, $alpha: 0.2);
  }
  .el-radio__label {
    color: #B6D4FF;
  }
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 5px;
      height: 6px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 1);
      transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .el-table thead .el-table__cell {
    background: transparent;
  }
}
</style>
