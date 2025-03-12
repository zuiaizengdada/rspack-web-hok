<template>
  <div>
    <div v-if="isShowTip" class="tips-ms">
      <div class="title-tips">
        <span>待结算订单说明：</span>
        <img src="@/assets/image/close.png" alt="" @click="closeTip" />
      </div>
      <div class="content-tips">
        <div>1.待结算订单仅包含平台自营、微信小程序、直播间、抖音小程序所产生的订单；</div>
        <div>
          2.待结算订单是指还未进行分账结算的订单，不包括未付款的订单与全额退款的订单；
        </div>
        <div>
          3.订单状态为“已支付”则D+7天进行结算，支付金额为扣除掉优惠券、卡券等的实际支付金额；
        </div>
        <div>
          4.订单状态为“部分退款”则按原订单支付时间D+7天，其中退款金额为该笔订单订单退款成功的金额；
        </div>
        <div>5.订单支付时间，当订单类型为部分退款时则为订单退款；</div>
        <div>6.支付手续费为第三方支付公司收取的手续费金额；</div>
      </div>
    </div>
    <div class="sum-row">
      <div class="sum-item">
        <div class="sum-label">待结算总金额：</div>
        <div class="sum-amount" style="padding-left: 20px">
          ￥{{ totalAmount }}
        </div>
      </div>
      <div class="vertical" />
      <div class="sum-item">
        <div class="sum-label">待结算总笔数：</div>
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
import { orderPage, orderTotal } from '@/api/business/divideAccounts'
import { mapOrderStatus, mapOrderChannel, mapAmount } from '../../utils'
import moment from 'moment'
export default {
  components: {
    filters
  },
  data() {
    return {
      columns,
      loadding: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      isShowTip: true,
      totalObj: {
        settleTotalAmount: 0,
        settleTotalNum: 0
      }
    }
  },
  computed: {
    totalAmount() {
      return mapAmount(this.totalObj.settleTotalAmount) || 0
    },
    totalNum() {
      return this.totalObj.settleTotalNum || 0
    }
  },
  created() {
    const isShow = localStorage.getItem('staySettlementOrderTips')
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
      orderTotal({
        ...params
      }).then(res => {
        this.totalObj = res.data
      })
    },
    getList(params = {}) {
      this.loadding = true
      orderPage({
        current: this.currentPage,
        size: this.pageSize,
        ...params
      })
        .then(res => {
          this.loadding = false
          this.tableData = res.data.records.map(m => ({
            ...m,
            orderStatusName: mapOrderStatus(m.orderStatus),
            channelName: mapOrderChannel(m.channelId),
            orderAmount: mapAmount(m.orderAmount),
            realPayAmount: mapAmount(m.realPayAmount),
            refundAmount:
              (m.orderStatus === 6 ? '-' : '') + mapAmount(m.refundAmount),
            payFeeRate:
              (m.orderStatus === 6 ? '-' : '') + mapAmount(m.payFeeRate),
            settleAmount:
              (m.orderStatus === 6 ? '-' : '') + mapAmount(m.settleAmount),
            settleTime: m.settleTime
              ? moment(m.settleTime).format('YYYY-MM-DD')
              : '-'
          }))
          this.total = res.data.total
        })
        .catch(() => {
          this.loadding = false
        })
    },
    closeTip() {
      this.isShowTip = false
      localStorage.setItem('staySettlementOrderTips', 'true')
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
