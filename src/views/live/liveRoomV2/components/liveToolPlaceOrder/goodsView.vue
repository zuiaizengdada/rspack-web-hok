<template>
  <!-- 商品样式 -->
  <div class="goodsView" :class="{active: active}">
    <div class="goodsImg"><img :src="item.goodsImg" alt="" /></div>
    <div class="goodsContent">
      <div class="goodsName">
        <textShowMore :text="item.goodsName" :line-clamp="1" style="width: 100%" />
      </div>
      <div class="goodsPrice">
        <template v-if="item.goodsType !== 5"><unitPrice :price="item.goodsPromotionPrice" /></template>
        <template v-else>
          <template v-if="filtersSpecPriceMoney(item.goodsSpecPrice).length > 1">
            <unitPrice :price="filtersSpecPriceMoney(item.goodsSpecPrice)[0]" /> - <unitPrice :price="filtersSpecPriceMoney(item.goodsSpecPrice)[1]" />
          </template>
          <template v-else-if="filtersSpecPriceMoney(item.goodsSpecPrice).length === 1">
            <unitPrice :price="filtersSpecPriceMoney(item.goodsSpecPrice)[0]" />
          </template>
        </template>
      </div>
    </div>

    <img v-if="active" class="activeImg" src="~@/assets/image/liveRoom/lock.png" alt="" />
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
import unitPrice from './price.vue'
export default {
  components: {
    textShowMore,
    unitPrice
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
  methods: {
    // 线下课商品价格
    filtersSpecPriceMoney: (res) => {
      if (!res) {
        return ''
      }
      const list = res.split(',')
      if (list.length === 1) {
        return [Number(list[0])]
      } else {
        return [Number(list[0]), Number(list[1])]
      }
    }
  }
}
</script>

  <style lang='scss' scoped>
  .goodsView {
    cursor: pointer;
    width: 213px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid #F2F2F2;
    background: #FFF;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-right: 10px;
    padding: 6px;
    position: relative;
    .goodsImg {
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      border-radius: 4px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .goodsContent {
      flex: 1 0 0;
      padding-left: 6px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .goodsPrice {
        margin-top: 7px;
        color: #FF1F00;
        display: flex;
        align-items: center;
        height: 14px;
      }
    }
  }
  .active {
    border: 1px solid #0C6FFF;
    .activeImg {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 14px;
      height: 14px;
    }
  }
  ::v-deep {
    .goodsName {
      .showMore {
        color: #000000;
        font-family: "PingFang SC";
        font-size: 14px;
        line-height: 14px;
        font-weight: bolder;
      }
    }
  }
  </style>
