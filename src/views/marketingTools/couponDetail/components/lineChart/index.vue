<template>
  <div
    v-loading="loading"
    class="lineChart"
    element-loading-spinner="el-icon-loading"
    style="min-width: 1100px;"
  >
    <div v-if="!logo" class="title">
      {{ mapTypeAmount }}趋势图 <span class="dw" />
    </div>
    <div v-else class="title-t">
      <div class="label-t">
        <img class="icon-t" :src="logo" alt="">
        <span>{{ mapTypeAmount }}趋势图</span>
        <span class="dw">(元)</span>
      </div>
    </div>
    <div ref="eEchartId" style="width: 100%; min-width: 1100px; height: 100%" />
  </div>
</template>
<script>
import { boardForLine } from '@/api/marketingTools/coupon.js'
import { debounce, getDayAll } from '@/utils'
import echarts from 'echarts'
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
              str += `<span style="font-size: 12px; width: 400px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">${
                params[0].data.isDay === 0 ? params[0].axisValue : params[0].data.date
              }
                  <p style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">
                    ${params[0].seriesName}
                    <span>${(params[0].seriesName === '成交金额' || params[0].seriesName === '优惠券金额') ? this.filterPrice(params[0].data.value / 100) : this.filterPrice(params[0].data.value)}</span>
                  </p>
              </span>
              <p style="color: #fff">环比</p>
              <span style="font-size: 12px; width: 400px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">
                ${params[1].data.isDay === 0 ? this.changeTimeToString(params[1].data.date) : params[1].data.date
}                 <p style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">
                    ${params[0].seriesName}
                    <span>${(params[0].seriesName === '成交金额' || params[0].seriesName === '优惠券金额') ? this.filterPrice(params[1].data.value / 100) : this.filterPrice(params[1].data.value)}</span>
                  </p>
              </span>   

            `
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
      orderSource: 1, // 订单来源
      logo: ''
    }
  },
  computed: {
    mapTypeAmount() {
      return {
        1: '发放张数',
        2: '领取张数',
        3: '领取人数',
        4: '使用张数',
        5: '成交金额',
        6: '成交订单数',
        7: '成交人数',
        8: '券优惠金额'
      }[this.orderSource]
    }
  },
  activated() {
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart && this.activeName === 'dataScreen') {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  methods: {
    changeTimeToString(dateString) {
      if (dateString.indexOf('00') > 0) {
        const date1 = new Date(dateString.substring(0, 10))
        date1.setDate(date1.getDate() - 1)
        const day = date1.getDate()
        const month = date1.getMonth() + 1
        const stringForDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
        return stringForDate
      } else {
        const month = new Date(dateString.substring(0, 10)).getMonth() + 1
        const day = new Date(dateString.substring(0, 10)).getDate()
        const stringForDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
        return stringForDate
      }
    },
    initData(params) {
      this.chart = echarts.init(this.$refs.eEchartId)
      this.loading = true
      const timeList = getDayAll(params.startTime, params.endTime)
      // 是否一个时间段 0-小时接口 1-时间段 例如 2023-01-01- 2023-01-01
      const isDay = params.startTime === params.endTime ? 0 : 1
      this.orderSource = params.dataType
      boardForLine(params).then(res => {
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
            data: res.data.foldLineDataList.map(m => ({
              ...m,
              active: params.type,
              name: m.date,
              value: m.amount,
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
            data: res.data.foldLineDataListRelative.map(m => ({
              ...m,
              active: params.type,
              name: m.date,
              value: m.amount,
              isDay: isDay
            }))
          }
        ]
        this.op.legend.data = [this.mapTypeAmount, '环比']

        this.chart.setOption(this.op, true)
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
