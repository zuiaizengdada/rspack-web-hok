<template>
  <div class="dashboard-wrap not-select">
    <div class="common-box">
      <div class="common-title">基本信息</div>
      <div class="common-operate">
        <div class="title-box">订单时间</div>
        <div class="common-list-box">
          <el-select v-model="orderType" placeholder="请选择" class="w-200" @change="onChangeType">
            <el-option
              v-for="item in optionsTime"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="common-list-box">
          <el-date-picker
            v-model="timeArray"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onChangeTime"
          />
        </div>
        <div class="common-list-box"><el-button class="common-btn" :class="selectBtn === 1 ?'active-btn':''" @click="getSelectDate(1)">昨日</el-button></div>
        <div class="common-list-box"><el-button class="common-btn" :class="selectBtn === 2 ?'active-btn':''" @click="getSelectDate(2)">今日</el-button></div>
        <div class="common-list-box"><el-button class="common-btn" :class="selectBtn === 3 ?'active-btn':''" @click="getSelectDate(3)">本月</el-button></div>
      </div>
    </div>
    <div class="table-title m-t24 ">第三方订单数据</div>
    <div class="table-box">
      <el-skeleton v-if="thirdPartyLoading" :rows="6" />
      <table-totals v-else :table-data="thirdPartyTableData" />
      <div v-if="thirdPartyTableData.length === 0" class="no-data">暂无数据</div>
    </div>
    <div class="table-title m-t30 ">获客订单数据</div>
    <div class="table-box">
      <el-skeleton v-if="hokLoading" :rows="6" />
      <table-totals v-else :table-data="tableData" />
      <div v-if="tableData.length === 0" class="no-data">暂无数据</div>
    </div>
    <div class="table-title m-t30 ">同步数据</div>
    <div class="table-box">
      <el-skeleton v-if="syncTableDataLoading" :rows="6" />
      <table-totals v-else :sync-table-data="syncTableData" />
      <div v-if="syncTableData.length === 0" class="no-data">暂无数据</div>
    </div>
    <div v-if="thirdPartyLoading && hokLoading && syncTableDataLoading" class="loading">
      <div id="loading-center">
        <div id="loading-center-absolute">
          <div id="object_four" class="object" />
          <div id="object_three" class="object" />
          <div id="object_two" class="object" />
          <div id="object_one" class="object" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderHok, getOrderSync, getOrderDyKs, getOrderWdYz, getOrderXetSph } from '@/api/order/dashboard'
import TableTotals from './components/tableTotals/index.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderDashboard',
  components: {
    TableTotals
  },
  data() {
    return {
      endDate: '',
      startDate: '',
      orderType: 1,
      thirdPartyLoading: false,
      hokLoading: false,
      syncTableDataLoading: false,
      optionsTime: [{ id: 1, label: '下单时间', value: 1 }, { id: 2, label: '入账时间', value: 2 }],
      timeArray: [],
      selectBtn: '',
      thirdPartyTableData: [], // 第三方数据
      tableData: [],
      syncTableData: []
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.getToday()
  },
  mounted() {
    this.inData()
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    async getThirdPartyInfo() {
      this.thirdPartyLoading = true
      const thirdPartyTableData = []
      const params = {
        endDate: this.endDate,
        startDate: this.startDate,
        timeType: this.orderType
      }
      const getDyKs = await getOrderDyKs(params)
      const getWdYz = await getOrderWdYz(params)
      const getXetSph = await getOrderXetSph(params)
      this.thirdPartyLoading = false
      if (getDyKs.data.length) {
        getDyKs.data.map(v => {
          let channel = ''
          this.channelSourceType.map(e => {
            e.value === v.channelSource ? channel = e.label : '--'
          })
          thirdPartyTableData.push({
            id: v.shopId,
            channel, // 渠道
            shop: v.shopName ? v.shopName : '--', // 店铺
            thirdParty: v.thirdOrderNum, // 第三方订单总数
            shouldPush: v.pushOrderNum, // 应推送订单数
            noPay: v.unPayOrderNum, // 未付款订单数
            paid: v.payOrderNum, // 已付款订单数
            refunded: v.refundOrderNum, // 已退款订单数
            partialRefundOrderNum: v.partialRefundOrderNum, // 部分退款订单数
            amountPaid: v.payPrice, // 已付款金额
            refundedAmount: v.refundPrice, // 已退款金额
            revenue: v.income, // 收入
            totalAmount: v.orderTotalPrice// 订单总金额
          })
        })
      }
      if (getWdYz.data.length) {
        getWdYz.data.map(v => {
          let channel = ''
          this.channelSourceType.map(e => {
            e.value === v.channelSource ? channel = e.label : '--'
          })
          thirdPartyTableData.push({
            id: v.shopId,
            channel, // 渠道
            shop: v.shopName ? v.shopName : '--', // 店铺
            thirdParty: v.thirdOrderNum, // 第三方订单总数
            shouldPush: v.pushOrderNum, // 应推送订单数
            noPay: v.unPayOrderNum, // 未付款订单数
            paid: v.payOrderNum, // 已付款订单数
            refunded: v.refundOrderNum, // 已退款订单数
            partialRefundOrderNum: v.partialRefundOrderNum, // 部分退款订单数
            amountPaid: v.payPrice, // 已付款金额
            refundedAmount: v.refundPrice, // 已退款金额
            revenue: v.income, // 收入
            totalAmount: v.orderTotalPrice// 订单总金额
          })
        })
      }
      if (getXetSph.data.length) {
        getXetSph.data.map(v => {
          let channel = ''
          this.channelSourceType.map(e => {
            e.value === v.channelSource ? channel = e.label : '--'
          })
          thirdPartyTableData.push({
            id: v.shopId,
            channel, // 渠道
            shop: v.shopName ? v.shopName : '--', // 店铺
            thirdParty: v.thirdOrderNum, // 第三方订单总数
            shouldPush: v.pushOrderNum, // 应推送订单数
            noPay: v.unPayOrderNum, // 未付款订单数
            paid: v.payOrderNum, // 已付款订单数
            refunded: v.refundOrderNum, // 已退款订单数
            partialRefundOrderNum: v.partialRefundOrderNum, // 部分退款订单数
            amountPaid: v.payPrice, // 已付款金额
            refundedAmount: v.refundPrice, // 已退款金额
            revenue: v.income, // 收入
            totalAmount: v.orderTotalPrice// 订单总金额
          })
        })
      }
      this.thirdPartyTableData = thirdPartyTableData
    },
    inData() {
      this.getThirdPartyInfo()
      this.getOrderHok()
      this.getOrderSync()
    },
    onChangeType(e) {
      this.inData()
    },
    onChangeTime(e) {
      this.startDate = new Date(e[0]).getTime()
      this.endDate = new Date(e[1]).getTime()
      this.selectBtn = ''
      this.inData()
    },
    getSelectDate(num) {
      this.selectBtn = num
      switch (num) {
        case 1:
          this.getYesterday()
          break
        case 2:
          this.getToday()
          break
        case 3:
          this.getMonth()
          break
      }
      this.inData()
    },
    getYesterday() {
      const yesterdayte = new Date().getTime() - 24 * 60 * 60 * 1000
      const { year, month, day } = this.getNowTime(yesterdayte)
      const starTime = new Date(year, month - 1, day, 0, 0, 0)
      const endTime = new Date(year, month - 1, day, 23, 59, 59)
      const timeArray = [starTime, endTime]
      const yesterStar = starTime.getTime()
      const yesterEnd = endTime.getTime()
      this.timeArray = timeArray
      this.startDate = yesterStar
      this.endDate = yesterEnd
    },
    getToday() {
      const today = new Date().getTime()
      const { year, month, day } = this.getNowTime(today)
      const starTime = new Date(year, month - 1, day, 0, 0, 0)
      const endTime = new Date(year, month - 1, day, 23, 59, 59)
      const timeArray = [starTime, endTime]
      const todayStar = starTime.getTime()
      const todayEnd = endTime.getTime()
      this.timeArray = timeArray
      this.selectBtn = 2
      this.startDate = todayStar
      this.endDate = todayEnd
    },
    getMonth() {
      const today = new Date().getTime()
      const { year, month } = this.getNowTime(today)
      const days = new Date(year, month, 0).getDate() // 30
      const starTime = new Date(year, month - 1, 1, 0, 0, 0)
      const endTime = new Date(year, month - 1, days, 23, 59, 59)
      const timeArray = [starTime, endTime]
      const monthStar = starTime.getTime()
      const monhEnd = endTime.getTime()
      this.timeArray = timeArray
      this.startDate = monthStar
      this.endDate = monhEnd
    },
    getNowTime(time) {
      // 将时间戳格式转换成年月日时分秒
      const date = new Date(time)
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      const h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())
      const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
      const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
      const strDate = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
      const dateObj = {
        strDate,
        year: Y,
        month: M,
        day: D,
        hours: h,
        minutes: m,
        seconds: s
      }
      return dateObj
    },
    getOrderHok() { // 获取获客订单数据
      this.hokLoading = true
      this.tableData = []
      const params = {
        endDate: this.endDate,
        startDate: this.startDate,
        timeType: this.orderType
      }
      getOrderHok(params)
        .then((res) => {
          console.log(res, '获客订单数据')
          this.hokLoading = false
          if (res.data.length) {
            res.data.map(v => {
              let channel = ''
              this.channelSourceType.map(e => {
                e.value === v.channelSource ? channel = e.label : '--'
              })
              this.tableData.push({
                id: v.shopId,
                channel, // 渠道
                shop: v.shopName ? v.shopName : '--', // 店铺
                thirdParty: v.thirdOrderNum, // 第三方订单总数
                shouldPush: v.pushOrderNum, // 应推送订单数
                noPay: v.unPayOrderNum, // 未付款订单数
                paid: v.payOrderNum, // 已付款订单数
                refunded: v.refundOrderNum, // 已退款订单数
                partialRefundOrderNum: v.partialRefundOrderNum, // 部分退款订单数
                amountPaid: v.payPrice, // 已付款金额
                refundedAmount: v.refundPrice, // 已退款金额
                revenue: v.income, // 收入
                totalAmount: v.orderTotalPrice// 订单总金额额
              })
            })
          }
        })
        .catch(() => {
          this.hokLoading = false
        })
    },
    getOrderSync() { // 同步数据
      const params = {
        endDate: this.endDate,
        startDate: this.startDate,
        timeType: this.orderType
      }
      this.syncTableDataLoading = true
      getOrderSync(params)
        .then((res) => {
          console.log(res, '同步数据')
          this.syncTableDataLoading = false
          res.data.map(v => {
            // 总订单
            v['syncTotalOrder_thirdOrderNum'] = v.syncTotalOrder.thirdOrderNum
            v['syncTotalOrder_pushOrderNum'] = v.syncTotalOrder.pushOrderNum
            v['syncTotalOrder_syncHokOrderNum'] = v.syncTotalOrder.syncHokOrderNum
            v['syncTotalOrder_syncBosumOrderNum'] = v.syncTotalOrder.syncBosumOrderNum
            // 未付款订单
            v['syncUnPayOrder_unPayOrderNum'] = v.syncUnPayOrder.unPayOrderNum
            v['syncUnPayOrder_syncHokOrderNum'] = v.syncUnPayOrder.syncHokOrderNum
            v['syncUnPayOrder_syncBosumOrderNum'] = v.syncUnPayOrder.syncBosumOrderNum
            // 已付款订单
            v['syncPayOrder_payOrderNum'] = v.syncPayOrder.payOrderNum
            v['syncPayOrder_syncHokOrderNum'] = v.syncPayOrder.syncHokOrderNum
            v['syncPayOrder_syncBosumOrderNum'] = v.syncPayOrder.syncBosumOrderNum
            // 已退款订单
            v['syncRefundOrder_refundOrderNum'] = v.syncRefundOrder.refundOrderNum
            v['syncRefundOrder_syncHokOrderNum'] = v.syncRefundOrder.syncHokOrderNum
            v['syncRefundOrder_syncBosumOrderNum'] = v.syncRefundOrder.syncBosumOrderNum
            // 部分退款订单
            v['syncPartialRefundOrder_partialRefundOrderNum'] = v.syncPartialRefundOrder.partialRefundOrderNum
            v['syncPartialRefundOrder_syncHokOrderNum'] = v.syncPartialRefundOrder.syncHokOrderNum
            v['syncPartialRefundOrder_syncBosumOrderNum'] = v.syncPartialRefundOrder.syncBosumOrderNum
          })
          console.log(res, '同步数据')
          this.syncTableData = res.data
        })
        .catch(() => {
          this.syncTableDataLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-wrap {
    background: #FFFFFF;
    border-radius: 10px;
    padding: 20px;
    min-width: 1200px;
    overflow: auto;
    .common-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .common-title {
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #333333;
            position: relative;
            padding-left: 12px;
            white-space:nowrap;
            &:before {
                position: absolute;
                content: '';
                width: 4px;
                height: 24px;
                background: #0C6FFF;
                border-radius: 6px;
                top: 0;
                left: 0;
            }
        }
        .common-operate {
            display: flex;
            .title-box {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                margin-right: 8px;
                line-height: 32px;
                white-space:nowrap;
            }
            .common-list-box {
                margin-right: 20px;
                .common-btn {
                    width: 68px;
                    height: 32px;
                    line-height: 10px;
                    background: #FFFFFF;
                    border-radius: 4px;
                    border: 1px solid #DCDFE6;
                }
            }
            .active-btn {
                background: #E7F0FF !important;
                border: 1px solid #3C8BFF !important;
                color: #0C6FFF !important;
            }
        }
    }
    .table-title {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
    }
    .table-box {
      margin-top: 16px;
    }
    .no-data {
      color: #969798;
      font-size: 16px;
      text-align: center;
    }
}
.loading {
  background-color: rgba(0, 0, 0, .1);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  #loading-center {
    width: 100%;
    height: 100%;
    position: relative;
  }
  #loading-center-absolute {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 200px;
    width: 200px;
    margin-top: -100px;
    margin-left: -100px;
    -ms-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }
  .object {
    -moz-border-radius: 50% 50% 50% 50%;
    -webkit-border-radius: 50% 50% 50% 50%;
    border-radius: 50% 50% 50% 50%;
    position: absolute;
    border-top: 5px solid #FFF;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #FFF;
    border-right: 5px solid transparent;
    -webkit-animation: animate 2s infinite;
    animation: animate 2s infinite;
  }
  #object_one {
    left: 75px;
    top: 75px;
    width: 50px;
    height: 50px;
  }

  #object_two {
    left: 65px;
    top: 65px;
    width: 70px;
    height: 70px;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  #object_three {
    left: 55px;
    top: 55px;
    width: 90px;
    height: 90px;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  #object_four {
    left: 45px;
    top: 45px;
    width: 110px;
    height: 110px;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  @-webkit-keyframes animate {
    50% {
      -ms-transform: rotate(360deg) scale(0.8);
      -webkit-transform: rotate(360deg) scale(0.8);
      transform: rotate(360deg) scale(0.8);
    }
  }
  @keyframes animate {
    50% {
        -ms-transform: rotate(360deg) scale(0.8);
        -webkit-transform: rotate(360deg) scale(0.8);
        transform: rotate(360deg) scale(0.8);
    }
  }
}
.not-select {
  -moz-user-select:none; /*火狐*/
  -webkit-user-select:none; /*webkit浏览器*/
  -ms-user-select:none; /*IE10*/
  -khtml-user-select:none; /*早期浏览器*/
  user-select:none;
}
::v-deep .el-input__inner{
    height: 32px;
}
.w-200 {
    width: 200px;
}
.w-255 {
    width: 255px;
}
.m-t24 {
    margin-top: 24px;
}
.m-t30 {
    margin-top: 30px;
}
.m-r20 {
    margin-right: 20px;
}
</style>

