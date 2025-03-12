<template>
  <div>
    <div v-if="isShowTip" class="tips-ms">
      <div class="title-tips">
        <span>结算订单说明：</span>
        <img src="@/assets/image/close.png" alt="" @click="closeTip" />
      </div>
      <div class="content-tips">
        <div>1.结算订单仅包含平台自营、微信小程序、直播间、抖音小程序所产生的订单；</div>
        <div>2.结算订单包含正常结算订单与结算前/后退款产生的订单；</div>
        <div>
          3.退款订单（含部分退款）按照退款完成时间进行计算，及[订单支付时间]为退款完成时间
        </div>
      </div>
    </div>
    <div class="sum-row">
      <div class="sum-item">
        <div class="sum-label">
          <el-tooltip class="item" effect="dark" placement="top">
            <template slot="content">
              <div style="width: 200px">
                已结算总金额仅统计结算状态为'已结算'的部分，其中包含银行账户与资金账户账户，资金账户明细请查询资金账户流水。
              </div>
            </template>
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          已结算总金额 ：
        </div>
        <div class="sum-amount" style="padding-left: 20px">
          ￥{{ totalAmount }}
        </div>
      </div>
      <div class="vertical" />
      <div class="sum-item">
        <div class="sum-label">
          <el-tooltip class="item" effect="dark" placement="top">
            <template slot="content">
              <div style="width: 200px">
                已结算总笔数，包含普通订单与退款 订单。
              </div>
            </template>
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          已结算总笔数：
        </div>
        <div class="sum-amount">{{ totalNum }}</div>
      </div>
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
              <span class="link_c" @click="toDetail(scope.row)">{{
                scope.row.orderNo
              }}</span>
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
  </div>
</template>

<script>
import filters from './components/filters'
import { columns } from './table'
import { getList, getAccountAndCount } from '@/api/business/divideAccounts'
import {
  mapOrderStatus,
  mapOrderChannel,
  mapSettleStatuss,
  mapSettleTypes,
  mapSettleAccountTypes,
  mapAmount
} from '../../utils'
import moment from 'moment'
export default {
  components: {
    filters
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
        accountInt: '',
        count: 0
      }
    }
  },
  computed: {
    totalAmount() {
      return mapAmount(this.totalObj.accountInt) || 0
    },
    totalNum() {
      return this.totalObj.count || 0
    }
  },
  created() {
    const isShow = localStorage.getItem('settlementOrderTips')
    this.isShowTip = !(isShow === 'true')
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
    getTotalInfo(params = {}) {
      getAccountAndCount({ ...params }).then(res => {
        this.totalObj = res.data
      })
    },
    getList(params = {}) {
      this.loadding = true
      getList({
        current: this.currentPage,
        size: this.pageSize,
        ...params
      })
        .then(res => {
          this.loadding = false
          this.tableData = res.data.records.map(m => ({
            ...m,
            settleTime: m.settleTime
              ? moment(m.settleTime).format('YYYY-MM-DD')
              : '-',
            orderStatusName: mapOrderStatus(m.orderStatus),
            channelName: mapOrderChannel(m.channelId),
            payTime: m.payTime
              ? moment(m.payTime).format('YYYY-MM-DD HH:mm:ss')
              : '-',
            settleStatusName: mapSettleStatuss(m.settleStatus),
            settleTypeName: mapSettleTypes(m.settleType),
            settleAccountTypeName: mapSettleAccountTypes(m.settleAccountType),
            orderAmount: mapAmount(m.orderAmount),
            realPayAmount: mapAmount(m.realPayAmount),
            refundAmount:
              (m.orderStatus === 6 || m.orderStatus === 7 ? '-' : '') +
              mapAmount(m.refundAmount),
            payFeeRate:
              (m.orderStatus === 6 || m.orderStatus === 7 ? '-' : '') +
              mapAmount(m.payFeeRate),
            settleAmount:
              (m.orderStatus === 6 || m.orderStatus === 7 ? '-' : '') +
              mapAmount(m.settleAmount)
          }))
          this.total = res.data.total
        })
        .catch(() => {
          this.loadding = false
        })
    },
    closeTip() {
      this.isShowTip = false
      localStorage.setItem('settlementOrderTips', 'true')
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
.tips-ms {
  width: 960px;
  border-radius: 5px;
  border: 1px solid #ffde9d;
  background: #fff5e0;
  padding: 13px;
  margin-bottom: 15px;
  .title-tips {
    user-select: none;
    font-size: 14px;
    color: #734e3a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }
  }
  .content-tips {
    color: #aa5404;
    font-size: 14px;
  }
}
.sum-row {
  width: 961px;
  fill: #fff;
  border: 1px solid #dcdee1;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 28px 36px;
  .sum-item {
    width: 49%;
    .sum-label {
      font-size: 18px;
      padding-left: 24px;
      color: #777777;
    }
    .sum-amount {
      font-weight: 700;
      font-size: 28px;
      padding-left: 24px;
      color: #000000;
    }
  }
  .vertical {
    width: 1px;
    height: 50px;
    background: #dcdee1;
    margin: 0 20px;
  }
}
</style>
