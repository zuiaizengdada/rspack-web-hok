<template>
  <div class="boundaryGapCharts">
    <div class="chartsBox">
      <!-- 面积图 -->
      <div id="deliverBoundaryGapChartsCharts" style="width: 100%;height: 100%;" />
    </div>
    <div class="myRadio">
      <el-radio-group v-model="myValue">
        <el-radio :label="1" @change="$emit('change', 1)">招生业绩</el-radio>
        <el-radio :label="2" @change="$emit('change', 2)">交付业绩</el-radio>
        <el-radio v-show="deliverType!==1" :label="3" @change="$emit('change', 3)">获客学费</el-radio>
        <el-radio v-show="deliverType!==1" :label="4" @change="$emit('change', 4)">支出成本</el-radio>
        <el-radio v-show="deliverType!==1" :label="5" @change="$emit('change', 5)">预期利润</el-radio>
        <el-radio :label="6" @change="$emit('change', 6)">退款金额</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  components: {},
  props: {
    value: {
      type: [Number, String],
      default: 1
    },
    deliverType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      chart: null,
      radio: 1,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    myValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
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
      this.chart = echarts.init(document.getElementById('deliverBoundaryGapChartsCharts'), 'macarons')
    },
    setOptions({ xData = [], yData = [] }) {
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
          borderWidth: 1
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
          left: '1%',
          right: '0%',
          top: '5%',
          bottom: '5%',
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
            data: yData,
            type: 'line',
            areaStyle: {},
            seriesLabel: {
              show: true
            },
            lineStyle: {
              color: '#0C6FFF'
            },
            smooth: true,
            color: '#C2DBFF'
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
.boundaryGapCharts {
  height: 412px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
  display: flex;
  flex-direction: column;
  .chartsBox {
    height: 353px;
  }
  .myRadio {
    width: 100%;
    flex: 1 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
