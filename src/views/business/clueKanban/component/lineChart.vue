<template>
  <div class="lineChart">
    <div class="lineChartRadio">
      <el-radio-group v-model="search.current">
        <el-radio v-if="type !== 1" :label="1">线索总数</el-radio>
        <el-radio :label="2">已分配线索</el-radio>
        <el-radio :label="3">已转化线索</el-radio>
        <el-radio :label="4">转化总金额</el-radio>
        <el-radio :label="5">转化率</el-radio>
      </el-radio-group>
    </div>

    <div class="chartsBox">
      <div id="clueLineChart" style="width: 100%;height: 100%;" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      radio: '',
      chart: null,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      search: state => state.businessClue.search
    }),
    ...mapGetters(['sidebar'])
  },
  watch: {
    'sidebar.opened': {
      handler(val) {
        console.log(this.chart)
        if (this.chart) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.chart.resize()
            }, 200)
          })
        }
      }
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
      this.chart = echarts.init(document.getElementById('clueLineChart'), 'macarons')
    },
    setOptions({ xData = [], title = '', ydata = [] }) {
      console.log(title, 'title')
      const current = this.search.current
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
                  <span style="color: #777777;font-size: 12px;line-height: 20px;">${title}:  </span>
                  <span style="color: #333;font-size: 12px;line-height: 20px;">${v.value}${current === 5 ? '%' : ''}</span>
                </p>
              `
            })
            return str
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
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
        series: [
          {
            name: title,
            type: 'line',
            smooth: true,
            color: '#0C6FFF',
            data: ydata,
            active: true,
            animationDuration: 100,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0.2,
                  color: 'rgb(211,229,255)'
                },
                {
                  offset: 1,
                  color: 'rgb(211,229,255)'
                }
              ])
            }
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
.lineChart {
    height: 360px;
    border: 1px solid #CBCFD3;
    display: flex;
    flex-direction: column;
    .lineChartRadio {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chartsBox {
      height: 304px;
      // overflow: hidden;
    }
}
</style>
