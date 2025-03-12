<template>
  <!-- 全部课程 -->
  <div class="allCourses">
    <allHeader @change="courceChange" />
    <div class="content">
      <lineCharts ref="lineCharts" :title="courceItem.key" />
      <!-- <barCharts
        ref="barCharts"
        :title="courceItem.key"
        tips="导流课程暂时只统计抖店来源的订单数据"
        class="m-t-20"
        @handleClick="barChartsClick"
        @onClickBack="onClickBack"
      /> -->
    </div>
  </div>
</template>

<script>
import allHeader from './components/allHeader.vue'
import lineCharts from './components/lineCharts.vue'
// import barCharts from './components/barCharts.vue'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { getAllRanking, getAllTrendChart } from '@/api/deliver/deliverStatistics'
export default {
  components: {
    allHeader,
    lineCharts
    // barCharts
  },
  data() {
    return {
      courceItem: {
        id: 1,
        key: '招生',
        title: '总招生金额',
        tips: '所选时间段内订单付款金额汇总(减去已退款金额)',
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
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_deliveringCourses_page')
  },
  methods: {
    // 筛选栏的类型切换
    courceChange(item) {
      this.courceItem = item
      console.log('筛选栏改变')
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
      getAllTrendChart(params).then(res => {
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
      getAllRanking(params).then(res => {
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
          console.log(this.barData, deptId, 'deptId')
          this.$refs.barCharts && this.$refs.barCharts.setOptions(this.barData, deptId)
        }
      }).catch(() => {})
    },
    // 排行榜点击返回
    onClickBack() {
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
.allCourses {
  padding: 20px 20px;
  .content {
    margin-top: 32px;
  }
}
</style>
