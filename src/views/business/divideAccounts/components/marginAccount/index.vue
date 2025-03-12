<template>
  <div>
    <div class="sum-row">
      <div class="item-left flex flex-middle">
        <span class="sum-label">资金账户余额:</span>
        <span class="sum-amount">￥{{ totalAmount }}</span>
      </div>
      <!-- <div class="item-right">
        保证金应缴金额：<span>¥{{ totalNum }}</span>
        <img src="@/assets/image/info.png" alt="" @click="openDialog" />
      </div> -->
    </div>
    <filters ref="filtersRef" @query="queryFilter" @resetQuery="resetQuery" />
    <div v-loading="loadding">
      <el-table :data="tableData" style="width: 100%">
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="item.type !== 'slot'"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :render-header="item.renderHeader"
            :fixed="item.fixed"
          />
          <el-table-column
            v-else
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :render-header="item.renderHeader"
            :fixed="item.fixed"
          >
            <template
              v-if="item.type === 'slot' && item.prop === 'orderNo'"
              slot-scope="scope"
            >
              <span
                v-if="scope.row.orderNo"
                class="link_c"
                @click="toDetail(scope.row)"
              >{{ scope.row.orderNo }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 10px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
    <marginDetailDialog ref="marginDetailDialog" />
  </div>
</template>

<script>
import filters from './components/filters'
import marginDetailDialog from './components/marginDetailDialog'
import { columns } from './table'
import { getCapitalList, getCapitalInfo } from '@/api/business/divideAccounts'
import { mapAmount, mapbizTypes } from '../../utils'
import moment from 'moment'
export default {
  components: {
    filters,
    marginDetailDialog
  },
  data() {
    return {
      columns,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      isShowTip: true,
      loadding: false,
      totalObj: {
        account: '',
        count: 0
      }
    }
  },
  computed: {
    totalAmount() {
      return mapAmount(this.totalObj.balance) || 0
    },
    totalNum() {
      return mapAmount(this.totalObj.count) || 0
    }
  },
  methods: {
    resetQuery(params = {}) {
      this.currentPage = 1
      this.pageSize = 10
      this.queryFilter(params)
    },
    queryFilter(params = {}) {
      this.getTotalInfo({ ...params })
      this.getList({ ...params })
    },
    openDialog() {
      this.$refs.marginDetailDialog.dialogVisible = true
    },
    getTotalInfo(params = {}) {
      getCapitalInfo({ ...params }).then(res => {
        this.totalObj = res.data
      })
    },
    getList(params = {}) {
      this.loadding = true
      getCapitalList({
        channel: 1,
        current: this.currentPage,
        size: this.pageSize,
        ...params
      })
        .then(res => {
          this.loadding = false
          this.tableData = res.data.records.map(m => ({
            ...m,
            tradeTime: m.tradeTime
              ? moment(m.tradeTime).format('YYYY-MM-DD HH:mm:ss')
              : '-',
            inOutTypeName: m.inOut === 1 ? '收入' : '支出',
            bizType: mapbizTypes(m.bizType),
            amount: (m.inOut === 1 ? '+' : '-') + mapAmount(m.amount),
            amountBefore: mapAmount(m.amountBefore),
            balance: mapAmount(m.balance),
            orderDetailNo: m.orderDetailNo || '-',
            remark: m.remark || '-'
          }))
          this.total = res.data.total
        })
        .catch(() => {
          this.loadding = false
        })
    },
    closeTip() {
      this.isShowTip = false
    },
    toDetail(row) {
      this.$router.push({
        path: `/business/orderManage/orderDetail/${row.orderNo}/${3}/全部订单`,
        query: {
          source: '资金结算'
        }
      })
      console.log(row)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.$refs.filtersRef.onSubmit()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$refs.filtersRef.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.link_c {
  color: #409eff;
  cursor: pointer;
}
.sum-row {
  width: 700px;
  fill: #fff;
  border: 1px solid #dcdee1;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 28px 36px;
  .item-left {
    width: 58%;
    margin-right: 2%;
    .sum-label {
      font-size: 18px;
      color: #777777;
    }
    .sum-amount {
      font-weight: 700;
      font-size: 28px;
      color: #000000;
    }
  }
  .item-right {
    width: 40%;
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 5px;
    background: #f6f6f6;
    font-size: 14px;
    color: #777777;
    span {
      color: #000000;
      font-size: 16px;
      font-weight: 600;
    }
    img {
      width: 15px;
      height: 15px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
}
</style>
