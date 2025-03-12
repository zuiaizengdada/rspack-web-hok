<template>
  <div class="priceView">
    <div class="priceText">{{ renderValue() }}</div>
    <div class="priceDecimal">{{ renderDecimal() }}%</div>
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
      const num = parseInt(BigNumber(Math.abs(+this.price || 0)).div(100)).toFixed(0).toString()
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
  .priceText {
    font-size: 28px;
    color: #fff;
      display:table-cell;
    vertical-align:bottom;
  }
  .priceDecimal {
    font-size: 20px;
    color: #fff;
    display:table-cell;
    vertical-align:bottom;
    line-height: 26px;
  }
}
</style>
