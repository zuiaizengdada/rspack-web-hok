<template>
  <div class="pageWrap">
    <template>
      <div class="cardPage">
        <el-row :gutter="20">
          <el-col class="m-t-20" :xs="24" :sm="24" :md="24" :lg="13" :xl="14"><orderData :order-data="orderData" /></el-col>
          <el-col class="m-t-20" :xs="24" :sm="24" :md="24" :lg="11" :xl="10"><watchData /></el-col>
        </el-row>
      </div>
      <div class="m-t-20 cardPage"><peoplenumData :order-data="orderData" /></div>
      <div class="m-t-20 cardPage"><liveData /></div>
      <div v-if="detail.status === 9" class="m-t-20 cardPage"><videoReplay :detail="detail" /></div>
      <!-- <div class="m-t-20 cardPage"><interactiveTrend ref="interactiveTrend" :detail="detail" /></div> -->
      <div class="m-t-20 cardPage"><goodsData :detail="detail" /></div>
      <div v-if="detail.status === 9" class="m-t-20 cardPage "><couponData :detail="detail" /></div>
    </template>
  </div>
</template>

<script>
import videoReplay from './videoReplay/index.vue'
import liveData from './dataStatistics/liveData.vue'
import couponData from './dataStatistics/couponData.vue'
import goodsData from './dataStatistics/goodsData.vue'
// import interactiveTrend from './dataStatistics/InteractiveTrend.vue'
import orderData from './dataStatistics/orderData.vue'
import peoplenumData from './dataStatistics/peoplenumData.vue'
import watchData from './dataStatistics/watchData.vue'
import { oneLiveRoomReportOrder } from '@/api/liveRoom/kanban.js'
import { liveOperationType } from '@/views/live/columns.js'

export default {
  components: {
    videoReplay,
    couponData,
    goodsData,
    // interactiveTrend,
    orderData,
    peoplenumData,
    watchData,
    liveData
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      orderData: {
        loading: false,
        doneOrderAmount: 0, // 成交金额
        doneOrderCount: 0, // 成交订单数
        refundAmount: 0, // 退款金额
        revenue: 0, // 实际营收
        transformOrderCount: 0, // 转化订单数
        transformOrderCountRate: '0%', // 转化人数率
        transformUserCount: '0%', // 转化人数
        transformUserCountRate: '0%', // 转化订单率
        waitingAmount: 0 // 待付款金额
      }
    }
  },
  mounted() {
    // 埋点
    const params = {
      liveRoomId: this.$route.params.id,
      operationType: liveOperationType.type100
    }
    this.$store.dispatch('im/operationLogsWrite', params)
    this.getOrderData()
  },
  methods: {
    getOrderData() {
      this.orderData.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      oneLiveRoomReportOrder(data).then(res => {
        this.orderData = {
          ...res.data,
          loading: false
        }
        this.loading = false
      }).catch(() => {
        this.orderData.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  // background: #fff;
  // min-width: 1159px;
  .cardPage {
      // background-color: #fff;
      // border-radius: 4px;
  }
}
</style>
