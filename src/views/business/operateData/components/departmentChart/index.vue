<template>
  <div
    v-loading="loading"
    class="departmentChart"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">{{ getTitle }}业绩 <span class="dw">(元)</span></div>

    <div ref="eEchartId" style="width: 100%; height: 100%" />
    <div
      v-if="op.series[0].data.length < 1"
      style="width: 100%; position: absolute; top: 24%"
    >
      <el-empty :image-size="70" description="暂无数据" />
    </div>
  </div>
</template>
<script>
import {
  getDeptTotalData,
  getPersonTotalData,
  getPersonRefundTotalData
} from '@/api/business'
import { debounce } from '@/utils'
import echarts from 'echarts'
import { orderSourceFilter } from '../utils'

export default {
  data() {
    return {
      loading: false,
      chart: undefined,
      op: {
        grid: {
          left: 80,
          right: 80,
          top: 30
        },
        xAxis: {
          type: 'category',
          show: true,
          showSymbol: false,
          data: [],
          axisLabel: {
            show: true,
            interval: 0,
            overflow: 'breakAll'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
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
        series: [
          {
            data: [],
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return `${this.filterPrice(params.data.value)}`
              }
            },
            barWidth: '40%',
            type: 'bar',
            stack: 'Total',
            color: '#00A3FF'
          }
        ]
      },
      $_resizeHandler: null,
      queryParams: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        type: '', // 时间组件状态
        pageType: '', // 页面状态
        deptId: '', // 部门id
        orderSource: '' // 订单来源
      }
    }
  },
  computed: {
    getTitle() {
      return !this.queryParams.deptId ? '部门' : '部门成员'
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.chart = echarts.init(this.$refs.eEchartId)
    // 柱状图点击事件
    this.chart.on('click', c => {
      if (c.data.isDept) {
        this.queryParams.deptId = c.data.id
        this.queryParams.pageType++
        this.$emit('deptIdEmit', c.data.id)
        this.getPersonTotalData()
      } else if (c.data.isPersion) {
        this.$emit('goPage', c.data)
      }
    })
    this.$_initResizeEvent()
  },
  methods: {
    // 初始化数据
    initData(params) {
      this.queryParams = {
        startTime: params.startTime,
        endTime: params.endTime,
        type: params.type === 0 ? 1 : params.type,
        pageType: params.pageType,
        deptId: params.deptId || 0,
        orderSource: params.orderSource,
        channelId: params.channelId,
        shopId: params.shopId
      }
      if (!params.deptId) {
        this.getData()
      } else {
        this.getPersonTotalData()
      }
    },
    // 获取部门成员业绩
    getPersonTotalData() {
      this.loading = true
      // 成员业绩
      const api =
        this.queryParams.orderSource === 999
          ? getPersonRefundTotalData
          : getPersonTotalData
      api({
        ...this.queryParams,
        orderSource: orderSourceFilter(this.queryParams.orderSource)
      })
        .then(res => {
          this.loading = false
          const data = res.data
          if (res.data.length > 10) {
            data.length = 10
          }
          const { xAxis, series } = this.op
          xAxis.data = data.map(e => e.personName)
          series[0].data = data.map(e => ({
            ...e,
            name: e.personName,
            value: e.totalCount,
            id: e.id,
            isPersion: true
          }))

          this.chart.setOption(this.op)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取部门业绩
    getData() {
      this.loading = true
      // 部门业绩
      getDeptTotalData({
        ...this.queryParams,
        orderSource: orderSourceFilter(this.queryParams.orderSource)
      })
        .then(res => {
          this.loading = false
          const data = res.data
          if (res.data.length > 10) {
            data.length = 10
          }
          const { xAxis, series } = this.op
          xAxis.data = data.map(e => e.departmentName)
          series[0].data = data.map(e => ({
            name: e.departmentName,
            value: e.totalCount,
            id: e.departmentId,
            isDept: true
          }))

          this.chart.setOption(this.op)
        })
        .catch(() => {
          const { series } = this.op
          series[0].data = []
          this.chart.setOption(this.op)
          this.loading = false
        })
    },
    // 过滤所有的数值
    filterPrice(value) {
      const v = Number(Number(value).toFixed(2))
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
.departmentChart {
  width: 100%;
  padding: 44px 24px 24px 24px;
  height: 400px;
  background-color: #fff;
  position: relative;
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
