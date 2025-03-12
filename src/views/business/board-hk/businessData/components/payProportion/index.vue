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

import { payTypeRevenueData } from '@/api/business/board-hk/businessData'
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
    initData(record) {
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
        employeeDeptId: record.deptId,
        orderChannel: record.orderChannel,
        startTime: record.startTime,
        teacherIdList: record.teacherIdList,
        timeType: record.type,
        shopId: record.shopId
      }
      if (params.isShowLogo) {
        this.logo = params.logoImgUrl
        this.logoName = params.channelLogoName
      } else {
        this.logo = ''
        this.logoName = ''
      }
      this.chart = echarts.init(this.$refs.eEchartId)
      this.loading = true
      payTypeRevenueData({
        ...params
      })
        .then(res => {
          this.loading = false
          const list = []
          res.data.map(m => {
            list.push({
              name: m.payType === 0 ? '免费' : '付费',
              value: m.amount,
              ratio: m.ratio,
              itemStyle: {
                color: m.payType === 0 ? '#00CC81' : '#00A3FF'
              }
            })
          })

          this.op.series.data = list

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
