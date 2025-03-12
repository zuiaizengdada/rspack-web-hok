<template>
  <!-- 优惠券样式 -->
  <div class="couponView" :class="{active: active, status0: item.status === 0}">
    <div class="couponLeft">
      <div class="couponMoney">
        <!-- //满减券 -->
        <template v-if="item.discountMethod === 1">
          <span class="couponMoney">￥{{ item.subtractAmount | filtersMoneyByZeroNoSplit }}</span>
        </template>
        <!-- 直减券 -->
        <template v-if="item.discountMethod === 2">
          <span class="couponMoney">￥{{ item.directReductionAmount | filtersMoneyByZero }}</span>
        </template>
        <!-- 折扣券 -->
        <template v-if="item.discountMethod === 3">
          <span class="couponMoney">{{ item.sale }}</span>
          <span class="couponUnit">折</span>
        </template>
      </div>
      <div class="couponType">{{ { 1: '满减券', 2: '直减券', 3: '折扣券' }[item.discountMethod] }}</div>
    </div>
    <div class="line" />
    <div class="couponRight">
      <div class="couponTitle">
        <textShowMore :text="item.couponName" :line-clamp="1" style="width: 100%" />
      </div>
      <div class="couponRightTips">
        <template v-if="item.discountMethod !== 1">{{ { 1: '满减券', 2: '直减券', 3: '折扣券' }[item.discountMethod] }}</template>
        <template v-else>满{{ item.satisfiedAmount | filtersMoneyByZeroNoSplit }}元减{{ item.subtractAmount | filtersMoneyByZeroNoSplit }}元</template>
      </div>
    </div>

    <img v-if="active" class="activeImg" src="~@/assets/image/liveRoom/lock_orange.png" alt="" />
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
export default {
  components: {
    textShowMore
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    active: {
      type: Boolean,
      default: false
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
.couponView {
  cursor: pointer;
  width: 230px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #FFEADF;
  background: linear-gradient(90deg, #FFF6F2 0%, #FFEADF 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 10px;
  position: relative;
  .couponLeft {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .couponMoney {
      color: #ff1f00;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 19px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .couponUnit {
      flex-shrink: 0;
      color: #ff1f00;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .couponType {
      color: #ff1f00;
      font-family: "PingFang SC";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 17px;
    }
  }
  .line {
    height: 40px;
    border-right: 1px dashed #E6DEDC;
  }
  .couponRight {
    width: 156px;
    padding-left: 14px;
    .couponTitle {
      height: 16px;
      flex-shrink: 0;
      color: #333333;
      font-family: "PingFang SC";
      font-size: 14px;
      font-weight: bolder;
      line-height: normal;
    }
    .couponRightTips {
      margin-top: 3.2px;
      color: #333333;
      font-family: "PingFang SC";
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
  }
}

// 过期
.status0 {
  cursor: not-allowed;
  background: linear-gradient(90deg, #FAFAFA 0%, #F4F4F4 100%);
  border: 1px solid #ECECEC;
  .couponUnit,.couponMoney,.couponTypeText,.couponContentName,.couponType,.couponRightTips,.couponTitle {
    color: #999999!important;
  }
  ::v-deep {
    .showMore {
      color: #999!important;
    }
  }
}

.active {
  border: 1px solid #FF810C;
  .activeImg {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 14px;
    height: 14px;
  }
}
::v-deep {
  .couponTitle {
    .showMore {
      color: #333333;
      font-family: "PingFang SC";
      font-size: 14px;
      font-weight: bolder;
    }
  }
}
</style>
