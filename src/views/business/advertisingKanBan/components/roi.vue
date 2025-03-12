<template>
  <div class="warpper">
    <div class="data-search">
      <span class="left-title"><i />业绩花费ROI趋势</span>
    </div>
    <div class="eEcharts">
      <div ref="eEchartId" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getPayOrderRoiTrendData } from '@/api/advertisingKanBan'
import { getDayAll } from '@/utils/index'
import { debounce } from '@/utils'

export default {
  name: 'LineEchart',
  props: {
    name: {
      type: String,
      default: ''
    },
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      chart: undefined,
      op: {
        grid: {
          top: 80,
          right: 50,
          bottom: 50,
          left: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed'
            },
            crossStyle: {
              color: '#999'
            }
          },
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#75A0F9',
          borderWidth: 1
        },
        legend: {
          top: 30,
          data: [
            {
              name: '总业绩'
            },
            {
              name: '花费'
            },
            {
              name: '总ROI',
              icon: 'circle'
            }
          ]
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '总业绩',
            type: 'bar',
            cursor: 'default',
            data: [],
            itemStyle: {
              color: '#6DA8FF'
            }
          },
          {
            name: '花费',
            type: 'bar',
            cursor: 'default',
            data: [],
            itemStyle: {
              color: '#0C6FFF'
            }
          },
          {
            name: '总ROI',
            type: 'line',
            cursor: 'default',
            data: [],
            showSymbol: false,
            lineStyle: { color: '#00FFEC', width: '1' },
            itemStyle: {
              color: '#01FFEC'
            },
            yAxisIndex: 1,
            animationDuration: 1000,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1.2,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(19,246,233,0.2)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(106,255,243,0)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      },
      $_resizeHandler: null
    }
  },
  mounted() {
    this.query()
    this.$nextTick(() => {
      this.chart = echarts.init(this.$refs.eEchartId)
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
    numberFormat(value) {
      if (Number(value) < 10000) {
        return Number(value).toFixed(2)
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.0001).toFixed(2) + '万'
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.00000001).toFixed(2) + '亿'
      }
    },
    query() {
      const params = { ...this.search }
      if (params.time) {
        params.startTime = params.time.time[0]
        params.endTime = params.time.time[1]
        delete params.time
        delete params.active
      }
      this.getPayOrderRoiTrendData(params)
    },
    // 业绩花费ROI趋势
    async getPayOrderRoiTrendData(params) {
      const res = await getPayOrderRoiTrendData(params)
      if (res.code === 1) {
        this.list = res.data
        const timeList = getDayAll(params.startTime, params.endTime)
        this.op.xAxis[0].data = timeList
        const o = []
        const t = []
        const ro = []
        const isToday = this.search.time.time[0] === this.search.time.time[1]
        timeList.forEach((r, index) => {
          // eslint-disable-next-line eqeqeq
          const i = isToday
            ? this.list[index]
            : this.list.find(f => r.includes(f.daily))

          o.push(i ? i.totalPayOrderAmount : 0)
          // eslint-disable-next-line eqeqeq
          const ii = isToday
            ? this.list[index]
            : this.list.find(f => r.includes(f.daily))
          t.push(ii ? ii.totalStatCostAmount : 0)

          const iii = isToday
            ? this.list[index]
            : this.list.find(f => r.includes(f.daily))
          ro.push(iii ? iii.totalRoi : 0)
        })
        this.op.series[0].data = o
        this.op.series[1].data = t
        this.op.series[2].data = ro
        this.chart.setOption(this.op, true)
      }
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

<style lang="scss" scoped>
.warpper {
  position: relative;
  .data-search {
    width: 100%;
    .updata-time {
      margin-left: 16px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
    .left-title {
      width: 100px;
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      font-family: '微软雅黑';
      i {
        width: 4px;
        height: 24px;
        margin-top: 3px;
        float: left;
        background: #0c6fff;
        border-radius: 8px;
      }
    }
  }
  .eEcharts {
    width: 100%;
    height: 351px;
    background: #ffffff;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
  }
}
</style>
