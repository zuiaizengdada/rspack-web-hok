<template>
  <!-- 直播间商品,优惠劵弹窗 -->
  <div class="liveRoomPopBox">
    <liveRoomPop :config="goodsConfig">
      <template v-slot:text>
        <template v-if="goodsConfig.goodsType === 5">
          <el-tag size="mini" class="liveRoomPop-text">线下课</el-tag>
        </template>
        <template v-else>
          <unitPrice :price="goodsConfig.goodsPrice" class="goods-price liveRoomPop-text" />
        </template>
      </template>
      <template v-slot:imgTip>
        <!-- 名额 -->
        <div
          v-if="![-1, 0].includes(goodsConfig.showQuota)"
          class="goods-showQuota"
        >
          名额仅剩<span class="f_s_ic">x{{ goodsConfig.showQuota }}</span>
        </div>
        <!-- 已抢光 -->
        <div v-if="goodsConfig.showQuota === 0" class="goods-showQuota0">
          - 已抢光 -
        </div>
      </template>
    </liveRoomPop>
    <liveRoomPop :config="couponsConfig">
      <template v-slot:text>
        <template v-if="couponsConfig.discountMethod === 1">
          <!-- 满减 -->
          <el-tag size="mini">满减券</el-tag>
          <div class="coupons-content">
            满{{
              couponsConfig.satisfiedAmount | filtersMoneyByZero
            }}元减{{
              couponsConfig.subtractAmount| filtersMoneyByZero
            }}元
          </div>
        </template>
        <template v-if="couponsConfig.discountMethod === 2">
          <!-- 直减 -->
          <el-tag size="mini">直减券</el-tag>
          <div class="coupons-content">
            购买立减{{
              couponsConfig.directReductionAmount| filtersMoneyByZero
            }}元
          </div>
        </template>
        <template v-if="couponsConfig.discountMethod === 3">
          <!-- 折扣 -->
          <el-tag size="mini">折扣券</el-tag>
          <div class="coupons-content">
            {{ couponsConfig.sale }}折
          </div>
        </template>
      </template>
    </liveRoomPop>
  </div>
</template>

<script>
import liveRoomPop from '../Dialog/liveRoomPop.vue'
import { popoverGoodsAjax, popoverCouponAjax } from '@/api/liveRoom/index.js'
import { mapState } from 'vuex'
import liveNetBad from '@/assets/image/live/coupon_icon.png'
import unitPrice from '@/views/live/liveList/component/price.vue'

export default {
  components: {
    liveRoomPop,
    unitPrice
  },
  data() {
    return {
      liveNetBad,
      goodsConfig: {
        bottom: '65px',
        imgUrl: '',
        visible: false,
        titleTextHidden: 2
      },
      couponsConfig: {
        bottom: '203px',
        imgUrl: '',
        visible: false,
        titleTextHidden: 1
      }
    }
  },
  computed: {
    ...mapState({
      popoverCoupon: (state) => state.im.popoverCoupon,
      popoverGoods: (state) => state.im.popoverGoods
    })
  },
  watch: {
    popoverCoupon: {
      handler(val) {
        const obj = {
          visible: val.visible,
          showEndTime: val.popupExpiresTime,
          finalSendTime: val.finalSendTime,
          imgUrl: this.liveNetBad,
          title: val.couponName,
          discountMethod: val.discountMethod,
          subtractAmount: val.subtractAmount,
          satisfiedAmount: val.satisfiedAmount,
          directReductionAmount: val.directReductionAmount,
          sale: val.sale
        }
        this.couponsConfig = {
          ...this.couponsConfig,
          ...obj
        }
      },
      deep: true
    },
    popoverGoods: {
      handler(val) {
        const obj = {
          visible: val.visible,
          showEndTime: val.showEndTime,
          finalSendTime: val.finalSendTime,
          imgUrl: val.goodsCoverUrl,
          title: val.goodsName,
          goodsPrice: val.goodsPrice,
          showQuota: val.showQuota,
          goodsType: val.goodsType
        }
        this.goodsConfig = {
          ...this.goodsConfig,
          ...obj
        }
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getPopoverGoods()
      this.getPopoverCoupon()
    },
    // 获取商品
    getPopoverGoods() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      popoverGoodsAjax(params).then(res => {
        if (res.code === 1) {
          const { goodsId } = res.data
          const visible = !!goodsId
          res.data.visible = visible
          this.$store.commit('im/set_popoverGoods', res.data)
        }
      })
    },
    // 获取优惠劵
    getPopoverCoupon() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      popoverCouponAjax(params).then(res => {
        if (res.code === 1) {
          const { couponNo } = res.data
          const visible = !!couponNo
          res.data.visible = visible
          this.$store.commit('im/set_popoverCoupon', res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .liveRoomPopBox {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    align-content: flex-end;
    justify-content: flex-end;
    padding-bottom: 65px;
    padding-right: 15px;
    gap: 10px;
  }
  .goods-price {
    font-family: PingFangSC, PingFang SC;
    font-weight: 550;
    color: #F53F3F;
    ::v-deep .priceUnit {
      font-size: 12px;
    }
    ::v-deep .priceText {
      font-size: 18px;
    }
    ::v-deep .priceDecimal {
      font-size: 12px;
    }
   }
   .liveRoomPop-text {
    position: absolute;
    bottom: 8px;
   }
  .coupons-content {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #999999;
    position: absolute;
    bottom: 8px;
  }
  .goods-showQuota {
    position: absolute;
    bottom: 8px;
    left: 6px;
    height: 26px;
    background: linear-gradient(270deg, #f53f3f 0%, #f53f3f 100%);
    border-radius: 4px;
    font-size: 12px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    color: #ffffff;
    line-height: 26px;
    width: 80px;
    text-align: center;
  }
  .goods-showQuota0 {
    position: absolute;
    bottom: 8px;
    text-align: center;
    width: 76px;
    height: 76px;
    line-height: 76px;
    font-size: 13px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0.62;
    border-radius: 4px;
  }
</style>
