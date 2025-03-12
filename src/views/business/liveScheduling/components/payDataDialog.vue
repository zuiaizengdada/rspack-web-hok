<template>
  <div class="pay-data-dialog">
    <el-dialog title="付费数据" :visible.sync="dialogTableVisible">
      <div class="pay-detail">
        <span>
          <em>付费GMV：</em>
          <i>￥{{ returnYuan(lastFufeiObject.gmv) }}</i>
        </span>
        <span>
          <em>付费订单：</em>
          <i>{{ lastFufeiObject.orderNum }}</i>
        </span>
        <span>
          <em>付费退款：</em>
          <i style="color: red">￥{{ returnYuan(lastFufeiObject.refundAmount) }}</i>
        </span>
        <span>
          <em>付费营收：</em>
          <i>￥{{ returnYuan(lastFufeiObject.revenue) }}</i>
        </span>
      </div>
      <el-table :data="gridData" border :span-method="arraySpanMethod">
        <el-table-column property="advertiserId" label="投放账号ID" width="150" />
        <el-table-column property="advertiserPutterName" label="投放人员" width="200" />
        <el-table-column property="gmv" label="付款GMV">
          <template slot-scope="scope">
            <p>{{ returnYuan(scope.row.gmv) }}</p>
          </template>
        </el-table-column>
        <el-table-column property="refundAmount" label="退款金额">
          <template slot-scope="scope">
            <p>{{ returnYuan(scope.row.refundAmount) }}</p>
          </template>
        </el-table-column>
        <el-table-column property="revenue" label="付费营收">
          <template slot-scope="scope">
            <p>{{ returnYuan(scope.row.revenue) }}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { scheduleStatistics } from '@/api/order/performanceShare'
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      dialogTableVisible: false,
      gridData: [],
      lastFufeiObject: {}
    }
  },
  watch: {
  },
  mounted() {},
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === (this.gridData.length - 1)) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    loadData(row) {
      scheduleStatistics(row.id).then(res => {
        if (res.code === 1) {
          this.gridData = res.data
          this.gridData.some(item => {
            if (item.liveScheduleId === 0) {
              this.lastFufeiObject = item
              item.advertiserPutterName = '合计：'
              item.advertiserId = '合计：'
            }
          })
        }
      })
    },
    returnYuan(number) {
      return (number / 100).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.pay-data-dialog {
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #ececec;
    }
    .pay-detail {
        float: left;
        width: 100%;
        margin-bottom: 20px;
        span {
            float: left;
            width: 50%;
            height: 30px;
            line-height: 30px;
            em {
                font-style: normal;
            }
            i {
                font-style: normal;
            }
        }
    }
}

</style>

