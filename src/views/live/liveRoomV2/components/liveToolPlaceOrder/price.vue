<template>
  <div class="priceView">
    <span class="priceUnit">￥</span>
    <span class="priceText">{{ renderValue() }}</span>
    <span class="priceDecimal">{{ renderDecimal() }}</span>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  components: {},
  props: {
    price: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    renderValue() {
      if (!this.price) { return '0' }
      const num = parseFloat(BigNumber(Math.abs(+this.price || 0)).div(100)).toFixed(0).toString()
      return num
    },
    renderDecimal() {
      if (!this.price) { return '.00' }
      const num = parseFloat(BigNumber(Math.abs(+this.price || 0)).div(100)).toFixed(2).toString().split('.')[1]
      return '.' + num
    }
  }
}
</script>

<style lang='scss' scoped>
.priceView {
    display: flex;
    align-items: flex-end;
    .priceUnit {
        font-size: 10px;
        color: #F53F3F;
        line-height: 10px;
        font-weight: bolder;
    }
    .priceText {
        font-size: 14px;
        color: #F53F3F;
        line-height: 12px;
        font-weight: bolder;
    }
    .priceDecimal {
      font-size: 10px;
      color: #F53F3F;
      font-weight: bolder;
      line-height: 10px;
    }
}
</style>
