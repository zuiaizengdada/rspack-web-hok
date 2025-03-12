<template>
  <div class="warpper">
    <div class="data-search">
      <span class="left-title"><i />漏斗模型</span>
    </div>
    <div class="eEcharts">
      <div ref="eEchartId" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getFunnelData } from '@/api/advertisingKanBan'
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
      obj: {
        clickCnt: 0, // 广告点击总数
        createOrderCount: 0, // 商品下单总数
        payOrderCount: 0, // 商品成交总数
        showCnt: 0 // 广告展示总数
      },
      op: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '漏斗模型',
            type: 'funnel',
            left: '10%',
            top: 20,
            bottom: 60,
            width: '60%',
            minSize: '75%',
            maxSize: '100%',
            sort: 'descending',
            silent: true,
            gap: 0,

            labelLine: {
              length: 60,
              lineStyle: {
                width: 2,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: []
          },
          {
            name: '漏斗模型',
            type: 'funnel',
            left: '10%',
            top: 20,
            bottom: 60,
            width: '60%',
            minSize: '75%',
            maxSize: '100%',
            sort: 'descending',
            silent: true,
            gap: 0,

            labelLine: {
              length: 60,
              lineStyle: {
                width: 2,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: []
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
        return value
      }
      if (Number(value) > 10000) return (Number(value) * 0.0001).toFixed(2) + '万'
      if (Number(value) > 10000) return (Number(value) * 0.00000001).toFixed(2) + '亿'
    },
    async query() {
      const params = { ...this.search }
      if (params.time) {
        params.startTime = params.time.time[0]
        params.endTime = params.time.time[1]
        delete params.time
        delete params.active
      }
      const res = await getFunnelData(params)
      if (res.code === 1) {
        this.obj = res.data
        this.op.series[0].data = [
          {
            value: this.obj.showCnt,
            name: '广告展示',
            itemStyle: {
              normal: {
                height: 67,
                color: '#0C6FFF'
              }
            },
            label: {
              fontSize: 14,
              formatter: res => {
                return `${this.numberFormat(res.data.value)}`
              }
            }
          },
          {
            value: this.obj.showCnt,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: '#0C6FFF',
                height: 0
              }
            }
          },
          {
            value: this.obj.clickCnt,
            name: '广告点击',
            itemStyle: {
              normal: {
                height: 67,
                color: '#0094FF'
              }
            },
            label: {
              fontSize: 14,
              formatter: res => {
                return `${this.numberFormat(res.data.value)}`
              }
            }
          },
          {
            value: this.obj.clickCnt,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          },
          {
            value: this.obj.createOrderCount,
            name: '商品下单',
            itemStyle: {
              normal: {
                height: 67,
                color: '#00D78B'
              }
            },
            label: {
              fontSize: 14,
              formatter: res => {
                return `${this.numberFormat(res.data.value)}`
              }
            }
          },
          {
            value: this.obj.createOrderCount,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          },
          {
            value: this.obj.payOrderCount,
            name: '商品成交',
            itemStyle: {
              normal: {
                height: 67,
                color: '#FFBD00'
              }
            },
            label: {
              fontSize: 14,
              formatter: res => {
                return `${this.numberFormat(res.data.value)}`
              }
            }
          },
          {
            value: this.obj.payOrderCount,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          }
        ]
        this.op.series[1].data = [
          {
            value: this.obj.showCnt,
            name: '广告展示',
            itemStyle: {
              normal: {
                height: 67,
                color: '#0C6FFF'
              }
            },
            label: {
              formatter: res => {
                return `广告展示`
              },
              position: 'inside'
            }
          },
          {
            value: this.obj.showCnt,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: '#0C6FFF',
                height: 0
              }
            }
          },
          {
            value: this.obj.clickCnt,
            name: '广告点击',
            itemStyle: {
              normal: {
                height: 67,
                color: '#0094FF'
              }
            },
            label: {
              formatter: res => {
                return `广告点击`
              },
              position: 'inside'
            }
          },
          {
            value: this.obj.clickCnt,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          },
          {
            value: this.obj.createOrderCount,
            name: '商品下单',
            itemStyle: {
              normal: {
                height: 67,
                color: '#00D78B'
              }
            },
            label: {
              formatter: res => {
                return `商品下单`
              },
              position: 'inside'
            }
          },
          {
            value: this.obj.createOrderCount,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          },
          {
            value: this.obj.payOrderCount,
            name: '商品成交',
            itemStyle: {
              normal: {
                height: 67,
                color: '#FFBD00'
              }
            },
            label: {
              formatter: res => {
                return `商品成交`
              },
              position: 'inside'
            }
          },
          {
            value: this.obj.payOrderCount,
            name: '',
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 0,
                borderColor: 'black',
                height: 0
              }
            }
          }
        ]
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
  .eEcharts {
    width: 100%;
    height: 308px;
    background: #ffffff;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
    border-radius: 5px;
  }
}
.t-i {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
}
</style>
