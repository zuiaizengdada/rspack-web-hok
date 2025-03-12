<template>
  <div class="couponView">
    <ImagePreviewer
      style="width: 58px; height: 58px;border-radius: 4px;background: #F5F7FA"
      :src="cloudCustomData.goodsImg"
      fit="contain"
      :preview-src-list="[cloudCustomData.goodsImg]"
      @load="$emit('load')"
    />
    <div class="goodsName">
      <textShowMore :line-clamp="2" :text="cloudCustomData.goodsName" />
      <div v-if="cloudCustomData.goodsType !==5" class="goodsPrice">￥{{ cloudCustomData.goodsPromotionPrice | filtersMoneyByZero }}</div>
    </div>
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
export default {
  components: {
    textShowMore
  },
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
  width: 203px;
  padding: 3px 5px;
  background: #fff;
  display: flex;
  .goodsName {
    flex: 1 0 0;
    padding-top: 5px;
    padding-left: 8px;
    padding-right: 22px;
    // padding: 0 4px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goodsPrice {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #F53F3F;
      line-height: 17px;
    }
  }
}
</style>
