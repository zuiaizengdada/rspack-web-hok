<template>
  <!-- 数据统计 复制之前的页面使用  -->
  <div class="pageWrap">
    <template>
      <div class="cardPage">
        <el-row :gutter="20">
          <el-col class="m-t-20" :xs="24" :sm="24" :md="24" :lg="13" :xl="14">
            <orderData :order-data="orderData" />
          </el-col>
          <el-col class="m-t-20" :xs="24" :sm="24" :md="24" :lg="11" :xl="10">
            <watchData />
          </el-col>
        </el-row>
      </div>
      <div class="m-t-20 cardPage">
        <peoplenumData :order-data="orderData" />
      </div>
      <!-- <div class="m-t-20 cardPage"><liveData /></div> -->
      <div v-if="detail.status === 9" class="m-t-20 cardPage">
        <videoReplay :detail="detail" />
      </div>
      <!-- <div class="m-t-20 cardPage"><interactiveTrend ref="interactiveTrend" :detail="detail" /></div> -->
      <div class="m-t-20 cardPage"><goodsData :detail="detail" /></div>
      <div v-if="detail.status === 9" class="m-t-20 cardPage">
        <couponData :detail="detail" />
      </div>
    </template>
  </div>
</template>

<script>
import videoReplay from './videoReplay/index.vue'
// import liveData from './liveData.vue'
import couponData from './couponData.vue'
import goodsData from './goodsData.vue'
import orderData from './orderData.vue'
import peoplenumData from './peoplenumData.vue'
import watchData from './watchData.vue'
// import { oneLiveRoomReportOrder } from '@/api/liveRoom/kanban.js'
import { liveOperationType } from '../../../../columns.js'
import { dataBoardViewData } from '@/api/liveRoom/index'
import { getLiveRoomInfo } from '@/api/liveRoom/index'

export default {
  components: {
    videoReplay,
    couponData,
    goodsData,
    // interactiveTrend,
    orderData,
    peoplenumData,
    watchData,
    // liveData
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
      },
      detail: {}
    }
  },
  created() {
    this.getDetail()
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
    // 获取详情数据
    getDetail() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.detail = { ...res.data }
        })
        .catch(() => {
        })
    },
    getOrderData() {
      this.orderData.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      dataBoardViewData(data)
        .then(res => {
          this.orderData = {
            ...res.data,
            loading: false
          }
          this.loading = false
        })
        .catch(() => {
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
::v-deep .zb-table {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        .cell {
          color: #333;
        }
      }
    }
  }
}
</style>
