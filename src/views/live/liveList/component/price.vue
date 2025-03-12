<template>
  <div class="priceView">
    <div class="priceUnit">￥</div>
    <div class="priceText">{{ renderValue() }}</div>
    <div class="priceDecimal">{{ renderDecimal() }}</div>
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
    line-height: 17px;
    .priceUnit {
        font-size: 10px;
        color: #F53F3F;
        display:table-cell;
        vertical-align:bottom;
    }
    .priceText {
        font-size: 16px;
        color: #F53F3F;
         display:table-cell;
        vertical-align:bottom;
        line-height: 21px;
    }
    .priceDecimal {
        font-size: 10px;
        color: #F53F3F;
         display:table-cell;
        vertical-align:bottom;
    }
}
</style>
