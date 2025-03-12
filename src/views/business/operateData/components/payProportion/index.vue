<template>
  <div
    v-loading="loading"
    class="payProportion"
    element-loading-spinner="el-icon-loading"
  >
    <div v-if="!logoName" class="title">付费占比</div>
    <div v-else class="title-t">
      <div class="label-t">
        <img class="icon-t" :src="logo" alt="">
        <span>付费占比</span>
      </div>
    </div>
    <div ref="eEchartId" style="width: 100%; height: 85%" />
    <div
      v-if="op.series.data.length < 1"
      style="width: 100%; position: absolute; top: 24%"
    >
      <el-empty :image-size="70" description="暂无数据" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import {
  getQmv,
  getLiveBroadcast,
  getRefundAmount,
  getExpertSales,
  getUnexpertSale
} from '@/api/business'
import { orderSourceFilter } from '../utils'
export default {
  data() {
    return {
      loading: false,
      op: {
        series: {
          name: '付费占比',
          type: 'pie',
          radius: [55, 95],
          silent: true,
          emphasis: {
            label: {
              show: true
            }
          },
          label: {
            show: true,
            alignTo: 'edge',
            formatter: params => {
              return `{name|${params.data.name}}\n{value|${this.filterPrice(
                params.data.value
              )}}\n{value|${params.data.ratio}%}`
            },
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              name: {
                fontSize: 11,
                color: '#2C3242',
                align: 'left'
              },
              value: {
                fontSize: 12,
                color: '#2C3242',
                align: 'left'
              }
            }
          },
          data: []
        }
      },
      chart: undefined,
      $_resizeHandler: null,
      logo: '',
      logoName: ''
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  methods: {
    initData(params) {
      if (params.isShowLogo) {
        this.logo = params.logoImgUrl
        this.logoName = params.channelLogoName
      } else {
        this.logo = ''
        this.logoName = ''
      }
      this.chart = echarts.init(this.$refs.eEchartId)
      this.loading = true
      const api = {
        '-1': this.getQmv,
        999: this.getRefundAmount,
        1: this.getExpertSales,
        2: this.getLiveBroadcast,
        0: this.getUnexpertSale
      }[params.orderSource]
      api({
        ...params,
        orderSource: orderSourceFilter(params.orderSource),
        type: params.type === 0 ? 1 : params.type
      })
        .then(res => {
          this.loading = false
          const d = []
          if (res.data.freeRatio > 0) {
            d.push({
              name: '免费',
              value: res.data.freeAmount,
              ratio: res.data.freeRatio,
              ...res.data,
              itemStyle: {
                color: '#00CC81'
              }
            })
          }
          if (res.data.payRatio > 0) {
            d.push({
              name: '付费',
              value: res.data.payAmount,
              ratio: res.data.payRatio,
              ...res.data,
              itemStyle: {
                color: '#00A3FF'
              }
            })
          }
          this.op.series.data = d

          this.chart.setOption(this.op, true)
        })
        .catch(() => {
          this.op.series.data = []
          this.chart.setOption(this.op, true)
          this.loading = false
        })
    },
    // 过滤所有的数值
    filterPrice(value) {
      const v = Number((Number(value) / 100).toFixed(2))
      if (v < 10000) {
        return v
      }
      if (v >= 10000) return (v * 0.0001).toFixed(2) + '万'
    },
    // 成交金额
    getQmv(params) {
      return new Promise((resolve, reject) => {
        getQmv(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退款金额
    getRefundAmount(params) {
      return new Promise((resolve, reject) => {
        getRefundAmount(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 内容带货
    getExpertSales(params) {
      return new Promise((resolve, reject) => {
        getExpertSales(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 直播带货
    getLiveBroadcast(params) {
      return new Promise((resolve, reject) => {
        getLiveBroadcast(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 自然成交
    getUnexpertSale(params) {
      return new Promise((resolve, reject) => {
        getUnexpertSale(params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
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
<style lang="scss" scoped>
.payProportion {
  width: 28%;
  min-width: 400px;
  height: 315px;
  background-color: #fff;
  position: relative;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2c3242;
    padding: 24px 24px 0 24px;
  }
  .title-t {
    padding: 24px 24px 0 24px;
    .label-t {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2c3242;
      display: flex;
      align-items: center;
      .icon-t {
        width: 28px;
        height: 28px;
        margin-right: 16px;
      }
    }
  }
}
</style>
