<template>
  <div class="lineCharts">
    <div class="lineChartsHeader">
      <span class="title">{{ title }}趋势图</span>
      <svg-icon v-if="tips" icon-class="tips" class="titleIcon" style="stroke:currentColor" />
    </div>
    <div class="chartsBox">
      <el-checkbox v-model="checked" class="checkBox">环比</el-checkbox>
      <div id="deliverLineCharts" style="width: 100%;height: 90%;" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '折线'
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      checked: false,
      $_resizeHandler: null, // 页面尺寸变化回调函数
      optionsData: {

      }
    }
  },
  watch: {
    checked() {
      this.setOptions(this.optionsData.title, this.optionsData.data)
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
      this.chart = echarts.init(document.getElementById('deliverLineCharts'), 'macarons')
    },
    setOptions(title, { xData = [], yData = [], tooltipData = [] }) {
      this.optionsData = { title: title, data: { xData: xData || [], yData: yData || [], tooltipData: tooltipData || [] } }
      this.chart.setOption({
        xAxis: {
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
            const str = `
                <p >${params[0].axisValue}</p>
                <p style="margin-top: 8px;">
                    <span class="circle_blue"></span>
                    ${title}: 
                    <span style="color: #333">${yData[params[0].dataIndex]}</span>
                </p>     
                <p style="margin-top: 8px;margin-left: ${title.length - 1}em;display: flex;">
                    环比: 
                    <span style="color: #333;display: flex;align-items: center;">
                        <span>${tooltipData[params[0].dataIndex].linkData}</span>
                    </span>
                </p>   
            `
            return str
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#EFF2F6',
              type: 'dashed'
            },
            show: true
          }
        },
        grid: {
          left: '16px',
          right: '16px',
          top: '60px',
          bottom: '20px',
          containLabel: true
          // tooltip: {
          //   show: true,
          //   formatter: '{b}: {c}<br />{b1}: {c1}',
          //   backgroundColor: 'rgba(255,255,255,0.9)',
          //   borderColor: '#75A0F9',
          //   axisPointer: {
          //     type: 'line',
          //     lineStyle: {
          //       type: 'dotted'
          //     }
          //   }
          // }
        },
        legend: {
          data: this.checked ? ['总招生金额', '环比'] : ['总招生金额']
        },
        series: [
          {
            name: '环比',
            data: this.checked ? tooltipData?.map(item => item.linkData) : [],
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#0C6FFF',
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                  type: 'dotted' // 'dotted'虚线 'solid'实线
                }
              }
            }
          },
          {
            name: '总招生金额',
            data: yData,
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#0C6FFF'
          }
        ]
      })
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
.lineCharts {
      position: relative;
      .lineChartsHeader {
        margin-bottom: 16px;
       .title {
        margin-right: 8px;
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 24px;
       }
    }
    .chartsBox {
      padding-top: 20px;
        width: 100%;
        height: 356px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E0E0;
    }
}
.red-p {
  width: 12px;
  height: 12px;
  display: inline-block;
  background-image: url('../../../../assets/image/product/down.png');
  background-size: 100% 100%;
  margin-right: 2px;
}
.green-p {
  width: 12px;
  height: 12px;
  margin-right: 2px;
  display: inline-block;
  background-image: url('../../../../assets/image/product/up.png');
  background-size: 100% 100%;
  margin-right: 2px;
}
.checkBox{
  margin-left: 20px;
  position: absolute;
  top:60px;
  left:20px

}
</style>
