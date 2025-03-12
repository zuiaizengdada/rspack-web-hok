<template>
  <!-- 导流课程 -->
  <div class="diversionCourse">
    <diversionHeader @change="courceChange" />
    <div class="content">
      <lineCharts ref="lineCharts" :title="courceItem.key" />
      <!-- <barCharts
        ref="barCharts"
        :title="courceItem.key"
        class="m-t-20"
        tips="导流课程暂时只统计抖店来源的订单数据"
        @handleClick="barChartsClick"
        @onClickBack="onClickBack"
      /> -->
    </div>
  </div>
</template>

<script>
import diversionHeader from './components/diversionHeader.vue'
import lineCharts from './components/lineCharts.vue'
// import barCharts from './components/barCharts.vue'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { getDiversionRanking, getDiversionTrendChart } from '@/api/deliver/deliverStatistics'
export default {
  components: {
    diversionHeader,
    lineCharts
    // barCharts
  },
  data() {
    return {
      courceItem: {
        id: 1,
        key: '招生',
        title: '总招生金额',
        tips: '所选时间段内课程价格小于1000元的子订单付款金额汇总减去课程价格小于1000元的子订单已退款金额汇总<br/>按订单付款时间',
        number: 0,
        arr: [],
        channelSource: '',
        tearch: { lecturerName: '', lecturerId: '' },
        goodsId: '',
        goodsName: '',
        time: ['', '']
      },
      deptId: '',
      crumbs: [],
      barData: [], // 柱状图数据，用来取值
      index: 1
    }
  },
  mounted() {},
  methods: {
    // 筛选栏的类型切换
    courceChange(item) {
      this.courceItem = item
      this.getlineCharts(item)
      // this.getBarCharts()
    },
    // 获取趋势图
    getlineCharts(item) {
      const params = {
        dataType: item.id, // 1.招生，2.交付，3.退款
        channelSource: item.channelSource,
        endTime: item.time[1],
        startTime: item.time[0],
        lecturerId: item.tearch.lecturerId,
        goodsId: item.goodsId
      }
      getDiversionTrendChart(params).then(res => {
        console.log(res, `获取${item.title}趋势图`)
        const xData = []
        const yData = []
        const tooltipData = []
        res.data.forEach(e => {
          xData.push(moment(e.date).format('YYYY-MM-DD') || '')
          const y = Number(new BigNumber(e.sumData).div(100).toString())
          yData.push(y)
          tooltipData.push({
            linkRelativeRatio: e.linkRelativeRatio,
            yearBasisRatio: e.yearBasisRatio
          })
        })
        this.$refs.lineCharts && this.$refs.lineCharts.setOptions(item.title, {
          xData, yData, tooltipData
        })
      }).catch(() => {})
    },
    // 获取排行表
    getBarCharts(deptId = '') {
      const params = {
        deptId: deptId,
        dataType: this.courceItem.id, // 1.招生，2.交付，3.退款
        channelSource: this.courceItem.channelSource,
        endTime: this.courceItem.time[1],
        startTime: this.courceItem.time[0],
        lecturerId: this.courceItem.tearch.lecturerId,
        goodsId: this.courceItem.goodsId
      }
      getDiversionRanking(params).then(res => {
        console.log(res, `获取${this.courceItem.title}排行表`)
        if (res.data) {
          const obj = { xData: [], lineData: [] }
          this.barData = res.data.reduce((pre, next) => {
            pre.xData.push(next.objectName)
            pre.lineData.push({
              value: Number(new BigNumber(next.sumData).div(100).toString()),
              groupId: next.objectName,
              deptId: next.objectId
            })
            return pre
          }, obj)
          console.log(this.barData)
          this.$refs.barCharts && this.$refs.barCharts.setOptions(this.barData, deptId)
        }
      }).catch(() => {})
    },
    // 排行榜点击返回
    onClickBack() {
      console.log('back')
      const length = this.crumbs.length
      if (length === 1) {
        return this.getBarCharts('')
      } else {
        const deptId = this.crumbs[length - 2]
        this.crumbs.pop()
        return this.getBarCharts(deptId)
      }
    },
    barChartsClick(event) {
      console.log(event, this.barData)
      if (event.data) {
        const index = event.dataIndex
        const obj = this.barData.lineData[index]
        if (!obj || !obj.deptId) {
          return console.log('无下级')
        }
        this.crumbs.push(obj.deptId)
        this.getBarCharts(obj.deptId)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.diversionCourse {
  padding: 20px 20px;
  .content {
    margin-top: 32px;
  }
}
</style>
