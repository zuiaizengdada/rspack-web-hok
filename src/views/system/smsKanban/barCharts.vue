<template>
  <div class="chartsBox">
    <div id="smsKanbanBarCharts" style="width: 100%;height: 100%;" />
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
      radio: 1,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  mounted() {
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
      this.chart = echarts.init(document.getElementById('smsKanbanBarCharts'), 'macarons')
    },
    setOptions({ xData = [], legendData = [], series = [] }) {
      const option = {
        xAxis: {
          min: 0,
          type: 'category',
          data: xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333'
            }
          },
          axisTick: {
            alignWithLabel: true,
            show: true,
            lineStyle: {
              color: '#CBCFD3'
            }
          }
        },
        // legend: {
        //   data: legendData
        // },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter(params) {
            if (!params || params.length === 0) {
              return ''
            }
            let str = `<p >${params[0].axisValue}</p>`
            params.map(v => {
              str += `
                <p style="margin-top: 8px;">
                  <span class="circle_blue" style="background: ${v.color}"></span>
                  <span style="color: #777777;font-size: 12px;line-height: 20px;">${v.seriesName}:  </span>
                  <span style="color: #333;font-size: 12px;line-height: 20px;">${v.value}</span>
                </p>
              `
            })
            return str
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        grid: {
          left: '1%',
          right: '0%',
          top: '5%',
          bottom: '50px',
          containLabel: true,
          tooltip: {
            show: true,
            formatter: '{b}: {c}<br />{b1}: {c1}',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#75A0F9',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dotted'
              }
            }
          }
        },
        series: series,
        dataZoom: {
          realtime: true,
          type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
          height: 10, // 表示滚动条的高度，也就是粗细
          startValue: 0, // 从头开始。
          endValue: 10 // 最多10个
        }
      }
      if (xData.length > 10) {
        option.dataZoom.show = true
        option.xAxis.max = ''
      } else {
        option.xAxis.max = xData.length - 1
        option.dataZoom.show = false
      }
      this.chart.setOption(option, true)
    },
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

<style lang='scss' scoped>
.chartsBox {
    height: 586px;
    padding-top: 20px;
    border: 1px solid #CBCFD3;
}
</style>
