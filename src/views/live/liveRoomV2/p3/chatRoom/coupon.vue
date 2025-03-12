<template>
  <div class="couponView">
    <div class="leftMoney">
      <template v-if="cloudCustomData.discountMethod === 1">
        <div class="couponMoney">
          <span class="couponUnit">￥</span>
          <span class="couponMoney">{{ cloudCustomData.subtractAmount | filtersMoneyByZeroNoSplit }}</span>
        </div>
        <div class="couponTypeText">满减券</div>
      </template>
      <template v-else-if="cloudCustomData.discountMethod === 2">
        <div class="couponMoney">
          <div class="couponFullReduction">
            <span class="couponUnit">￥</span>
            <span class="couponMoney">{{ cloudCustomData.directReductionAmount | filtersMoneyByZeroNoSplit }}</span>
          </div>
        </div>
        <div class="couponTypeText">直减券</div>
      </template>
      <template v-else-if="cloudCustomData.discountMethod === 3">
        <div class="couponMoney">
          <div class="couponFullReduction">
            <span class="couponMoney">{{ cloudCustomData.sale }}</span>
            <span class="couponUnit">折</span>
          </div>
        </div>
        <div class="couponTypeText">折扣券</div>
      </template>
    </div>
    <div class="couponContent">
      <div class="couponContentName m-t-14">
        <template v-if="cloudCustomData.discountMethod === 1">
          满{{ cloudCustomData.satisfiedAmount | filtersMoneyByZeroNoSplit }}元可用{{ cloudCustomData.subtractAmount | filtersMoneyByZeroNoSplit }}元
        </template>
        <template v-else-if="cloudCustomData.discountMethod === 2">
          购买立减{{ cloudCustomData.directReductionAmount | filtersMoneyByZeroNoSplit }}元
        </template>
        <template v-else-if="cloudCustomData.discountMethod === 3">
          购买立享{{ cloudCustomData.sale }}折
        </template>
      </div>
      <div v-if="cloudCustomData.expireDays && cloudCustomData.expireDays > 0" class="couponContentTime2 m-t-14">
        自领取起{{ cloudCustomData.expireDays }}天有效
      </div>
      <div v-else class="couponContentTime m-t-14">
        <!-- <div> -->
        有效期至{{ cloudCustomData.useEndTime | parseTime('{y}-{m}-{d}') }}
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    cloudCustomData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.m-t-14 {
  margin-top: 14px!important;
}
.couponView {
  width: 231px;
  height: 71px;
  box-shadow: inset 0px 0px 4px 0px rgba(247,149,149,0.5);
  background-image: url(~@/assets/image/coupon/couponBgH5.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  .leftMoney {
    width: 73px;
    .couponUnit {
      font-size: 12px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 17px;
    }
    .couponMoney {
      margin-top: 17px;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 17px;
    }
    .couponTypeText {
      text-align: center;
      margin-top: 4px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 17px;
    }
  }
  .couponContent {
    flex: 1 0 0;
    padding-left: 7px;
    .couponContentName {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 17px;
    }
    .couponContentTime {
      margin-top: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFDFCF;
      line-height: 17px;
    }
    .couponContentTime2 {
      margin-top: 12px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFDFCF;
      line-height: 14px;
    }
  }
  .rightBtn {
    width: 33px;
    height: 71px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      writing-mode:vertical-rl;
      padding: 0 2px;
      height: 61px;
      background: #FF3815;
      border-radius: 4px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      text-align: center;
    }
  }
}
</style>
