<template>
  <div class="warpper">
    <div class="data-search">
      <span class="left-title"><i />总成交来源</span>
    </div>
    <div class="eEcharts">
      <div class="flex-d">
        <div class="left-f">
          <div v-for="(item, index) in list" :key="index" class="left-i">
            <div class="left-t">
              <div class="round" :style="{ backgroundColor: colors[index] }" />
              <span class="span_t">{{ item.platformName }}</span>
              <div class="proportion" :style="{ borderColor: colors[index] }">
                <span
                  class="p-v"
                  :style="{ color: colors[index] }"
                >{{ item.totalRatio }}%</span>
              </div>
            </div>
            <div class="left-v">
              {{ numberFormat(item.totalPayOrderCount) }}
            </div>
          </div>
        </div>
        <div style="width: 65%; height: 100%">
          <div ref="eEchartId" style="width: 100%; height: 100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getTotalPayOrderCountData } from '@/api/advertisingKanBan'
import { debounce } from '@/utils'

export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      //   platformName: 0, // 平台
      //   totalPayOrderCount: 0, // 总成交数量
      //   totalRatio: 0 // 比例
      list: [],
      colors: ['#0C6FFF', '#00D7C7'],
      op: {
        grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '总成交来源',
            type: 'pie',
            cursor: 'default',
            radius: '85%',
            label: {
              position: 'inside',
              fontSize: 15,
              lineHeight: 25,
              color: '#FFFFFF',
              formatter: '{b}\n{d}%'
            },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            silent: true
          }
        ]
      },
      chart: undefined,
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
    async query() {
      const params = { ...this.search }
      if (params.time) {
        params.startTime = params.time.time[0]
        params.endTime = params.time.time[1]
        delete params.time
        delete params.active
      }
      const res = await getTotalPayOrderCountData(params)
      if (res.code === 1) {
        this.list = res.data
        this.op.series[0].data = []
        if (this.list.length < 1) {
          this.op.series[0].label.position = 'center'
          this.op.series[0].data = [
            {
              value: 0,
              name: '暂无数据',
              itemStyle: {
                color: '#00D7C7'
              }
            }
          ]
        } else {
          this.op.series[0].label.position =
            this.list.length === 1 ? 'center' : 'inside'

          this.list.forEach((e, index) => {
            this.op.series[0].data.push({
              value: e.totalPayOrderCount,
              name: e.platformName,
              itemStyle: {
                color: this.colors[index]
              }
            })
          })
        }
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
  width: 100%;
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
  .flex-d {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    .left-f {
      width: 35%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      flex-direction: column;
      .left-i {
        width: 100%;
        margin-bottom: 36px;
        padding: 25%;
        .left-t {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .round {
            min-width: 6px;
            width: 6px;
            height: 6px;
            background: #00d7c7;
            border: 1px solid #ffffff;
            border-radius: 50%;
            margin-right: 4px;
          }
          .span_t {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 56px;
            width: 56px;
            margin-right: 4px;
          }
          .proportion {
            width: 60px;
            width: 60px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid #00d7c7;
            display: flex;
            align-items: center;
            justify-content: center;
            .p-v {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #00d7c7;
            }
          }
        }
        .left-v {
          width: 100%;
          display: inline-block;
          font-size: 20px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #161616;
        }
      }
    }
  }
  .eEcharts {
    width: 100%;
    height: 308px;
    background: #ffffff;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
  }
}
</style>
