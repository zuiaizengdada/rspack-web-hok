<template>
  <div class="numberChange">
    <slot>{{ myData }}</slot>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      myData: 0
    }
  },
  watch: {
    value: {
      handler(newData, oldData = 0) {
        this.numFun(oldData, newData)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 数字动画函数
    // startNum开始的数值 maxNum
    numFun(startNum, maxNum, key) {
      const duration = 0.5 * 60 // 时长多少秒执行完毕
      var step = ((maxNum - startNum) / duration)// 步长
      var that = this
      let numText = startNum
      let golb // 为了清除requestAnimationFrame
      function numSlideFun() { // 数字动画
        numText += step// 速度的计算可以为小数 。数字越大，滚动越快
        if (numText >= maxNum) {
          numText = maxNum
          cancelAnimationFrame(golb)
        } else {
          golb = requestAnimationFrame(numSlideFun)
        }
        that.myData = numText.toFixed(2)
      }
      numSlideFun() // 调用数字动画
    }
  }
}
</script>

<style lang='scss' scoped>
.numberChange {
    display: inline-block;
}
</style>
