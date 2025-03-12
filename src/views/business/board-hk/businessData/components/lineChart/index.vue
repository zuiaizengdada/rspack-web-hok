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
  performanceTrendRevenueDate,
  performanceTrendDate
} from '@/api/business/board-hk/businessData'
import { debounce, getDayAll } from '@/utils'
import echarts from 'echarts'
import moment from 'moment'
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
                params[0].data.active === 1 || params[0].data.isDay === 0
                  ? params[0].axisValue
                  : moment(params[0].axisValue).utc(true).format('MM-DD')
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
                   <span style="margin-right:4px;font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;">
                   ${
  hb.data.isDay === 0
    ? hb.data.orderHour
    : moment(hb.data.time).format('MM-DD')
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
      bizType: 3,
      logo: ''
    }
  },
  computed: {
    mapTypeAmount() {
      return {
        1: '总营收',
        2: '退款金额',
        3: 'GMV',
        10: '直播带货',
        5: '视频带货',
        9: '线下录单',
        11: '私域线上成交'
      }[this.bizType]
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
    initData(record) {
      this.bizType = record.bizType
      const params = {
        bizType: record.bizType,
        employeeUid: undefined,
        endTime: record.endTime,
        expertId: undefined,
        itemIdList:
          record.goodsId && record.goodsId.length > 0
            ? record.goodsId
            : undefined,
        productCategory: record.productCategory,
        startTime: record.startTime,
        orderChannel: record.orderChannel,
        teacherIdList: record.teacherIdList,
        employeeDeptId: record.deptId,
        timeType: record.type,
        shopId: record.shopId
      }
      if (params.isShowLogo) {
        this.logo = params.logoImgUrl
      } else {
        this.logo = ''
      }
      this.chart = echarts.init(this.$refs.eEchartId)
      this.loading = true
      const timeList = getDayAll(params.startTime, params.endTime)
      // 是否一个时间段 0-小时接口 1-时间段 例如 2023-01-01- 2023-01-01
      const isDay = params.startTime === params.endTime ? 0 : 1
      const api = record.isRevenue
        ? performanceTrendRevenueDate
        : performanceTrendDate
      api({
        ...params
      })
        .then(res => {
          const info = res.data
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
              data: info.trendItemVoList.map(m => ({
                ...m,
                active: params.timeType,
                name: m.time,
                value: m.amount / 100,
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
              data: info.linkTrendItemVoList.map((m, i) => ({
                ...m,
                active: params.timeType,
                name: m.time,
                orderHour:
                  i === 0 && isDay === 0
                    ? params.timeType === 1
                      ? moment(m.time).utc(false).format('MM-DD')
                      : moment(m.time).subtract(2, 'd').format('MM-DD')
                    : moment(m.time).format('MM-DD'),
                value: m.amount / 100,
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
