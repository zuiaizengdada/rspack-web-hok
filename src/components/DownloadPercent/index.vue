<template>
  <div v-if="display" class="lodding">
    <svg
      :width="widthSize"
      :height="heightSize"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-75 -75 150 150"
      preserveAspectRatio="xMidYMid meet"
      style="transform-origin: 50%;"
    >
      <circle
        :stroke="inactiveColor"
        stroke-width="10"
        fill="none"
        cx="0"
        cy="0"
        r="70"
      />
      <circle
        ref="percent"
        :stroke="activeColor"
        stroke-width="10"
        fill="none"
        cx="0"
        cy="0"
        r="70"
        stroke-linecap="round"
        stroke-dasharray="440"
        stroke-dashoffset="440"
        :style="{'transform':'rotate(-90deg)','transition':`${animateDelay}s`}"
      />
      <text
        ref="percentText"
        stroke="#333333"
        dy="3"
        style="font-size:27px;user-select: none;line-height: 42px;"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        <slot />
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Percent',
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: 0
    },
    color: {
      type: String,
      default: () => 'rgb(0,161,250)'
    },
    activeColor: {
      type: String,
      default: () => '#13ce66'
    },
    inactiveColor: {
      type: String,
      default: () => '#ff4949'
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    unit: {
      type: String,
      default: () => 'px'
    },
    animateDelay: {
      type: [Number, String],
      required: false,
      default: 2
    }
  },
  data() {
    return {
      display: true
    }
  },
  computed: {
    widthSize() {
      if (this.width === 'auto') {
        return '100%'
      }
      return this.width + this.unit
    },
    heightSize() {
      if (this.height === 'auto') {
        return '100%'
      }
      return this.height + this.unit
    }
  },
  watch: {
    value() {
      this.percen()
    }
  },
  mounted() {
    console.log(this.activeColor, 'activeColor')
    this.percen()
  },
  methods: {
    percen() {
      const percentDom = this.$refs.percent
      // const textDom = this.$refs.percentText;
      const all = percentDom.getAttribute('stroke-dasharray')
      const value = this.value > 100 ? 100 : this.value
      const percen = all - all * value * 0.01
      percentDom.setAttribute('stroke-dashoffset', percen)
      // 数字需不需要动画？
      // this.NumAutoPlusAnimation(textDom, {
      //   time: Number(this.AnimateDelay) * 1000,
      //   num: value,
      //   regulator: 30,
      // });
      // return `${value}%`;
    },
    NumAutoPlusAnimation(targetEle, options) {
      /* 可以自己改造下传入的参数，按照自己的需求和喜好封装该函数 */
      // 不传配置就把它绑定在相应html元素的data-xxxx属性上吧
      // eslint-disable-next-line no-param-reassign
      options = options || {}
      const time = options.time || 2000
      const finalNum = options.num || 0 // 要显示的真实数值

      let regulator = options.regulator || 100 // 调速器，改变regulator的数值可以调节数字改变的速度
      regulator = finalNum === 0 ? 0 : regulator
      const step = finalNum / (time / regulator) /* 每30ms增加的数值-- */
      let count = 0 // 计数器
      let initial = 0
      // eslint-disable-next-line no-var
      var timer = setInterval(() => {
        count = count + step
        if (count >= finalNum) {
          clearInterval(timer)
          count = finalNum
        }
        // t未发生改变的话就直接返回
        // 避免调用text函数，提高DOM性能
        const t = Math.floor(count)
        if (t === initial) return
        initial = t
        // eslint-disable-next-line no-param-reassign
        targetEle.innerHTML = `${initial}%`
      }, 30)
    }
  }
}
</script>

<style scoped lang="scss">
.lodding{
  text-align: center;
  width: 100%;
  height: 100%;
  line-height: 0;
  font-size: 0
}
</style>
