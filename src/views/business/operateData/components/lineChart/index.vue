<template>
  <div
    v-loading="loading"
    class="lineChart"
    element-loading-spinner="el-icon-loading"
  >
    <div v-if="!logo" class="title">
      {{ mapTypeAmount }}趋势图 <span class="dw">(元)</span>
    </div>
    <div v-else class="title-t">
      <div class="label-t">
        <img class="icon-t" :src="logo" alt="">
        <span>{{ mapTypeAmount }}趋势图</span>
        <span class="dw">(元)</span>
      </div>
    </div>
    <div ref="eEchartId" style="width: 100%; height: 100%" />
  </div>
</template>
<script>
import {
  getQmv,
  getQmv1,
  getLiveBroadcast,
  getLiveBroadcast1,
  getRefundAmount,
  getRefundAmount1,
  getExpertSales,
  getExpertSales1,
  getUnexpertSale,
  getUnexpertSale1
} from '@/api/business'
import { debounce, getDayAll } from '@/utils'
import echarts from 'echarts'
import moment from 'moment'
import { orderSourceFilter } from '../utils'
export default {
  data() {
    return {
      loading: false,
      chart: undefined,
      op: {
        grid: {
          left: 100,
          right: 100,
          top: 30
        },
        legend: {
          bottom: 10
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
          backgroundColor: '#00A3FF',
          borderColor: '#00A3FF',
          borderWidth: 1,
          formatter: params => {
            if (!params || params.length === 0) {
              return ''
            }
            let str = ''
            if (params[0] && params[0].seriesName !== '环比') {
              str += `<span style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">${
                params[0].data.active === 0 || params[0].data.isDay === 0
                  ? params[0].axisValue
                  : moment(params[0].axisValue).format('MM-DD')
              }</span>
                 <p style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">
                  ${params[0].seriesName}
                    <span>${this.filterPrice(params[0].data.value)}</span>
                  </p>

            `
            }
            const hb = params[1]
              ? params[1]
              : params[0] && params[0].seriesName === '环比'
                ? params[0]
                : undefined
            if (hb) {
              str += `
                  <p style="margin-top: 8px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;"> ${
  hb.seriesName
}</p>
                   <span style="margin-right:4px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">${
  hb.data.active === 0 || hb.data.isDay === 0
    ? moment(hb.data.orderHour).format('MM-DD')
    : moment(hb.data.orderTime).format('MM-DD')
}  <span>${this.filterPrice(hb.data.value)}</span>
              </span>

                \n`
            }
            return str
          }
        },
        title: { show: false },
        xAxis: {
          type: 'category',
          show: true,
          showSymbol: false,
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: []
      },
      $_resizeHandler: null,
      orderSource: '-1', // 订单来源
      logo: ''
    }
  },
  computed: {
    mapTypeAmount() {
      return {
        '-1': '成交金额',
        999: '退款金额',
        1: '内容带货',
        2: '直播带货',
        0: '自然成交'
      }[this.orderSource]
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
      } else {
        this.logo = ''
      }
      this.orderSource = params.orderSource
      this.chart = echarts.init(this.$refs.eEchartId)
      this.loading = true
      const timeList = getDayAll(params.startTime, params.endTime)
      // 是否一个时间段 0-小时接口 1-时间段 例如 2023-01-01- 2023-01-01
      const isDay = params.startTime === params.endTime ? 0 : 1
      // 接口集成 通过isDay取对象
      const fn = [
        {
          '-1': this.getQmv1,
          999: this.getRefundAmount1,
          1: this.getExpertSales1,
          2: this.getLiveBroadcast1,
          0: this.getUnexpertSale1
        },
        {
          '-1': this.getQmv,
          999: this.getRefundAmount,
          1: this.getExpertSales,
          2: this.getLiveBroadcast,
          0: this.getUnexpertSale
        }
      ][isDay][this.orderSource]

      fn({
        ...params,
        orderSource: orderSourceFilter(params.orderSource),
        type: params.type === 0 ? 1 : params.type
      })
        .then(res => {
          this.loading = false
          this.op.xAxis.data = timeList
          this.op.series = [
            {
              name: this.mapTypeAmount,
              type: 'line',
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              showSymbol: false,
              z: 999,
              lineStyle: {
                color: '#00A3FF'
              },
              itemStyle: {
                color: '#00A3FF'
              },
              data: res.data.orderList.map(m => ({
                ...m,
                active: params.type,
                name: m.orderTime,
                value: m.total / 100,
                isDay: isDay
              }))
            },
            {
              name: '环比',
              type: 'line',
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              showSymbol: false,
              lineStyle: {
                color: '#00CC81',
                type: 'dashed'
              },
              itemStyle: {
                color: '#00CC81'
              },
              data: res.data.ringOrderList.map(m => ({
                ...m,
                active: params.type,
                name: m.orderTime,
                value: m.total / 100,
                isDay: isDay
              }))
            }
          ]
          this.op.legend.data = [this.mapTypeAmount, '环比']

          this.chart.setOption(this.op, true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 过滤所有的数值
    filterPrice(value) {
      const v = Number(value)
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
    // 成交金额-小时
    getQmv1(params) {
      return new Promise((resolve, reject) => {
        getQmv1(params)
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
    // 退款金额-小时
    getRefundAmount1(params) {
      return new Promise((resolve, reject) => {
        getRefundAmount1(params)
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
    // 内容带货-小时
    getExpertSales1(params) {
      return new Promise((resolve, reject) => {
        getExpertSales1(params)
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
    }, // 直播带货-小时
    getLiveBroadcast1(params) {
      return new Promise((resolve, reject) => {
        getLiveBroadcast1(params)
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
    // 自然成交-小时
    getUnexpertSale1(params) {
      return new Promise((resolve, reject) => {
        getUnexpertSale1(params)
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
.lineChart {
  width: 100%;
  padding: 24px;
  height: 330px;
  background-color: #fff;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2c3242;
    margin-right: 8px;
  }
  .dw {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2c3242;
  }
  .title-t {
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
