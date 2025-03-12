<template>
  <div class="barCharts">
    <div class="barChartsHeader">
      <span class="title">部门/员工{{ title }}排行</span>
      <el-tooltip class="item" effect="dark" :content="tips" placement="top-start">
        <svg-icon v-if="tips" icon-class="tips" class="titleIcon" style="stroke:currentColor" />
      </el-tooltip>
    </div>
    <div class="chartsBox">
      <div id="deliverBarCharts" style="width: 100%;height: 100%;" />
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
      default: '柱状'
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
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
      const _this = this
      this.chart = echarts.init(document.getElementById('deliverBarCharts'), 'macarons')
      this.chart.on('click', function (event) {
        console.log('点击触发')
        _this.$emit('handleClick', event)
      })
    },
    setOptions({ xData = [], lineData = [] }, dept = '') {
      const _this = this
      const option = {
        xAxis: {
          min: 0,
          // max: 10,
          data: xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333'
            }
          },
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#CBCFD3'
            }
          }
        },
        yAxis: {
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
          left: '1%',
          right: '0%',
          top: '15%',
          bottom: '15%',
          containLabel: true
        },
        dataGroupId: '',
        animationDurationUpdate: 500,
        series: {
          type: 'bar',
          id: 'sales',
          data: lineData,
          universalTransition: {
            enabled: true,
            divideShape: 'clone'
          },
          showSymbol: false,
          itemStyle: { color: '#0C6FFF' },
          barWidth: 50,
          datasetIndex: 0
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow'
        //   },
        //   formatter: (params) => {
        //     let res = '<div>' + params[0].name + '</div>'
        //     params.forEach((data, i) => {
        //       if (i !== 0) {
        //         res += `<span style='display:inline-block;
        //                   margin-right:5px;
        //                   margin-bottom:2px;
        //                   border-radius:50%;
        //                   width:8px;
        //                   height:8px;
        //                   background-color: #0C6FFF'></span>`
        //         res += '<p style="display:inline-block">' + data.data.value + '</p>' + '</br>'
        //       }
        //     })
        //     return res
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 10,
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter: (params) => {
            let res = '<div>' + params[0].name + '</div>'
            params.forEach((data, i) => {
              if (i !== 0) {
                res += `<span style='display:inline-block;
                          margin-right:5px;
                          margin-bottom:2px;
                          border-radius:50%;
                          width:8px;
                          height:8px;
                          background-color: #0C6FFF'></span>`
                res += '<p style="display:inline-block">' + data.data.value + '</p>' + '</br>'
              }
            })
            return res
          }
        },
        graphic: [
          {
            type: 'text',
            right: 10,
            top: 10,
            style: { text: '', fontSize: 14 }
          }
        ],
        dataZoom: {
          realtime: true,
          type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
          height: 10, // 表示滚动条的高度，也就是粗细
          startValue: 0, // 从头开始。
          endValue: 10 // 最多10个
        }
      }
      const copyData = JSON.parse(JSON.stringify(lineData))
      var max2 = copyData.sort(function(a, b) {
        return b.value - a.value
      })[0]

      const dataShadow = []
      lineData.map(v => {
        dataShadow.push(max2)
      })
      if (dept === '') {
        option.series = [
          {
            type: 'bar',
            data: dataShadow,
            barGap: '-100%',
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            },
            showSymbol: false,
            itemStyle: { color: 'transparent' },
            barWidth: 50,
            datasetIndex: 0
          }, {
            type: 'bar',
            id: 'sales',
            data: lineData,
            barGap: '-100%',
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            },
            showSymbol: false,
            itemStyle: { color: '#0C6FFF' },
            barWidth: 50,
            datasetIndex: 0
          }
        ]
      } else {
        option.series = [
          {
            type: 'bar',
            data: dataShadow,
            barGap: '-100%',
            dataGroupId: dept,
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            }
          }, {
            type: 'bar',
            id: 'sales',
            dataGroupId: dept,
            data: lineData,
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            }
          }]
        option.graphic = [
          {
            type: 'text',
            left: 10,
            top: 10,
            style: {
              fill: '#51A3E6',
              overflow: 'break',
              text: '返回',
              fontSize: 14
            },
            onclick: _this.onClickBack
          }
        ]
      }
      if (lineData.length > 10) {
        option.dataZoom.show = true
        option.xAxis.max = ''
      } else {
        option.xAxis.max = 10
        option.dataZoom.show = false
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
    // 点击返回
    onClickBack() {
      this.$emit('onClickBack')
    }
  }
}
</script>

<style lang='scss' scoped>
.barCharts {
    .barChartsHeader {
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
        width: 100%;
        height: 356px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E0E0;
    }
}
.titleIcon {
  color: #999;
}
</style>
