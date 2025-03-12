<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle style="width: 100%">
        <span>订单数据</span>
        <el-tooltip class="item" :content="'统计范围为开播时间到直播结束后48小时内。'" placement="top">
          <img src="@/assets/image/product/icon.png" class="iconText">
        </el-tooltip>
      </MTitle>
    </div>
    <div class="pageContent">
      <viewData :loading="orderData.loading" class="pageContentView" title="成交订单数" :data="orderData.doneOrderCount | filtersMoneyByWang" />
      <viewData :loading="orderData.loading" class="pageContentView" title="成交金额" :data="orderData.doneOrderAmount | filtersMoneyByWang(true)" />
      <!-- <viewData :loading="orderData.loading" class="pageContentView" title="待付款金额" :data="orderData.waitingAmount | filtersMoneyByWang(true)" /> -->
      <viewData :loading="orderData.loading" class="pageContentView" title="退款金额" :data="orderData.refundAmount | filtersMoneyByWang(true)" />
      <viewData :loading="orderData.loading" class="pageContentView" title="营收" :data="orderData.revenue | filtersMoneyByWang(true)" />
    </div>
  </div>
</template>

<script>
import viewData from './viewData.vue'
export default {
  components: {
    viewData
  },
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {
          loading: false,
          doneOrderAmount: 0, // 成交金额
          doneOrderCount: 0, // 成交订单数
          refundAmount: 0, // 退款金额
          revenue: 0, // 实际营收
          transformOrderCount: 0, // 转化订单数
          transformOrderCountRate: '0%', // 转化人数率
          transformUserCount: 0, // 转化人数
          transformUserCountRate: '0%', // 转化订单率
          waitingAmount: 0 // 待付款金额
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 62px;
    background: #F9FBFF;
    display: flex;
    align-items: center;
    .iconText {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
  .pageContent {
    padding: 16px 30px 34px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    .pageContentView {
      flex: 1;
    }
  }
}
::v-deep {
  .MTitle{
    .title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
