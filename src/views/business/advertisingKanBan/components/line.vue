<template>
  <div>
    <div ref="eEchartId" style="width: 100%; height: 6rem" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

export default {
  name: 'LineEchart',
  props: {
    name: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    xData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      chart: undefined,
      op: {
        title: { show: false },
        grid: {
          top: 0,
          right: 0,
          bottom: '1%',
          left: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          data: this.xData
        },
        yAxis: {
          show: false,
          type: 'value',
          inverse: false
        },
        series: {
          name: this.name,
          type: 'line',
          data: this.data,
          showSymbol: false,
          lineStyle: { color: '#0C6FFF', width: '1' },
          animationDuration: 1000,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1.5,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(32,116,255,0.2)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(32,116,255,0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      },
      $_resizeHandler: null
    }
  },
  watch: {
    data: {
      handler(val) {
        if (this.chart) {
          this.chart.resize()
        }
        this.$nextTick(() => {
          this.chart = echarts.init(this.$refs.eEchartId)
          this.op.series.data = val
          this.op.xAxis.data = this.xData
          this.chart.setOption(this.op, true)
        })
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(this.$refs.eEchartId)

      this.chart.setOption(this.op, true)
    })
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    }
  }
}
</script>

<style></style>
