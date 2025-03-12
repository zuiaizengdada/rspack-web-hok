<template>
  <!-- 成交趋势图 -->
  <div ref="transactionTrendChart" class="transactionTrendChart">
    <div id="transactionTrendChart" style="width: 100%;height: 100%;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  components: {},
  data() {
    return {
      chart: null,
      data1: [],
      data2: [],
      now: new Date(),
      now2: new Date(),
      oneDay: 5 * 60 * 1000,
      value: Math.random() * 1000,
      value2: Math.random() * 1000,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  mounted() {
    this.height = this.$refs.transactionTrendChart.offsetHeight
    this.initChart()
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
    initChart() {
      this.chart = echarts.init(document.getElementById('transactionTrendChart'), 'macarons')
    },
    setOptions({ data1 = [], data2 = [] }) {
      const option = {
        title: {
          text: '成交趋势图',
          textStyle: {
            color: '#B6D4FF',
            fontWeight: 400,
            fontSize: 20
          },
          top: 24,
          left: 24
        },
        grid: {
          top: 80
        },
        legend: {
          top: 24,
          right: 24,
          textStyle: {
            color: '#B6D4FF',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLine: {
            show: true
          },
          axisTick: {
            lineStyle: {
              color: '#B6D4FF'
            }
          },
          axisLabel: {
            color: '#B6D4FF'
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#B6D4FF'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            show: data1.length > 5,
            start: 0,
            end: data1.length > 5 ? (5 / data1.length) * 100 : (data1.length === 0 ? 20 : 100),
            minSpan: 60 * 1000 * 5,
            maxSpan: 60 * 1000 * 15,
            zoomLock: true,
            showDetail: false,
            height: data1.length > 4 ? 10 : 0// 表示滚动条的高度，也就是粗细
          },
          {
            show: data1.length > 5,
            start: 0,
            end: data1.length > 5 ? (5 / data1.length) * 100 : (data1.length === 0 ? 20 : 100),
            zoomLock: true,
            minSpan: 60 * 1000 * 5,
            maxSpan: 60 * 1000 * 15,
            showDetail: false,
            height: data1.length > 4 ? 10 : 0// 表示滚动条的高度，也就是粗细
          }
        ],
        series: [
          {
            name: '成交订单数',
            type: 'line',
            // showSymbol: false,
            symbolSize: 6,
            data: data1,
            smooth: true,
            active: true,
            color: '#2C84FF',
            animationDuration: 100,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            }
            // stack: 'Total'
          },
          {
            name: '成交人数',
            type: 'line',
            symbolSize: 6,
            // showSymbol: false,
            data: data2,
            color: '#2CBFFF',
            animationDuration: 100,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            }
            // stack: 'Total'
          }
        ]
      }
      this.chart.setOption(option)
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    randomData1() {
      this.now = new Date(+this.now + this.oneDay)
      this.value = this.value + Math.random() * 21 - 10
      return {
        name: this.now.toString(),
        value: [
          this.now,
          Math.round(this.value)
        ]
      }
    },
    randomData2() {
      this.now2 = new Date(+this.now2 + this.oneDay)
      this.value2 = this.value2 + Math.random() * 21 - 10
      return {
        name: this.now.toString(),
        value: [
          this.now,
          Math.round(this.value2)
        ]
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.transactionTrendChart {
  width: 100%;
  height: 100%;
}
</style>
