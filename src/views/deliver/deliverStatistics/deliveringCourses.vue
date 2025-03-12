<template>
  <!-- 交付课程 -->
  <div class="deliveringCourses">
    <deliveringCourses @change="courceChange" />
    <div class="content">
      <lineCharts ref="lineCharts" :title="courceItem.key" />
      <!-- <barCharts
        v-if="courceItem.prop !== 'costItem'"
        ref="barCharts"
        :title="courceItem.key === '支出成本' ? '招生' : courceItem.key"
        class="m-t-20"
        tips="统计的是招生老师的排行数据"
        @handleClick="barChartsClick"
        @onClickBack="onClickBack"
      /> -->
    </div>
  </div>
</template>

<script>
import deliveringCourses from './components/deliveringHeader.vue'
import lineCharts from './components/lineCharts.vue'
// import barCharts from './components/barCharts.vue'
import BigNumber from 'bignumber.js'
import {
  getDataBoardDeliveryTrendCost,
  getDataBoardDeliveryTrendDeliveredFee,
  getDataBoardDeliveryTrendDeliveredUser,
  getDataBoardDeliveryTrendRecruit,
  getDataBoardDeliveryTrendRefundFee,
  getDataBoardDeliveryTrendRefundToDeliveryUser,
  getDeptUserDeliveredUserRank,
  getDeptUserDeliveryFeeRank,
  getDeptUserRecruitRank,
  getDeptUserRefundFeeRank,
  getDeptUserToDeliveryUserRank
} from '@/api/deliver/deliverStatistics'
export default {
  components: {
    deliveringCourses,
    lineCharts
    // barCharts
  },
  data() {
    return {
      courceItem: {
        prop: 'recruitItem',
        key: '招生',
        title: '总招生金额',
        tips: '所选时间段内课程价格大于等于1000元的子订单付款金额汇总减去时间段内课程价格大于等于1000元的子订单已退款金额汇总<br>按订单付款时间',
        number: 0,
        arr: [],
        channelSource: '',
        tearch: { lecturerName: '', lecturerId: '' },
        goodsId: '',
        goodsName: '',
        time: ['', '']
      },
      crumbs: [], // 排行榜面包屑，用来做返回上一层的操作
      barData: [] // 柱状图数据，用来取值
    }
  },
  mounted() {},
  methods: {
    // 筛选栏的类型切换
    courceChange(item) {
      this.courceItem = item
      this.getlineCharts()
      // this.getBarCharts()
      console.log('筛选栏改变')
    },
    // 获取趋势图
    getlineCharts() {
      const apiFn = {
        recruitItem: getDataBoardDeliveryTrendRecruit,
        deliveredFeeItem: getDataBoardDeliveryTrendDeliveredFee,
        refundedItem: getDataBoardDeliveryTrendRefundFee,
        costItem: getDataBoardDeliveryTrendCost,
        toDeliveryUserItem: getDataBoardDeliveryTrendRefundToDeliveryUser,
        deliveredUserItem: getDataBoardDeliveryTrendDeliveredUser
      }
      const params = {
        channelSource: this.courceItem.channelSource,
        endTime: this.courceItem.time[1],
        startTime: this.courceItem.time[0],
        lecturerId: this.courceItem.tearch.lecturerId,
        goodsIdList: this.courceItem.goodsId.join(','),
        deliveryType: this.courceItem.deliveryType
      }
      apiFn[this.courceItem.prop](params)
        .then(res => {
          console.log(res, `获取${this.courceItem.title}`)
          const xData = []
          const yData = []
          const tooltipData = []
          res.data.forEach(e => {
            xData.push(e.date || '')
            if (
              [
                'recruitItem',
                'deliveredFeeItem',
                'refundedItem',
                'costItem'
              ].includes(this.courceItem.prop)
            ) {
              const y = Number(new BigNumber(e.sumData).div(100).toString())
              yData.push(y)
              tooltipData.push({
                linkRelativeRatio: e.linkRelativeRatio,
                yearBasisRatio: e.yearBasisRatio,
                sumData: e.sumData,
                linkData: Number(new BigNumber(e.linkData).div(100).toString())
              })
            } else {
              yData.push(e.sumData)
              tooltipData.push({
                linkRelativeRatio: e.linkRelativeRatio,
                yearBasisRatio: e.yearBasisRatio,
                sumData: e.sumData,
                linkData: Number(e.linkData)
              })
            }
          })
          this.$refs.lineCharts &&
            this.$refs.lineCharts.setOptions(this.courceItem.title, {
              xData,
              yData,
              tooltipData
            })
        })
        .catch(() => {})
    },
    // 获取排行表
    getBarCharts(deptId = '') {
      if (deptId === '') {
        this.crumbs = []
      }
      const apiFn = {
        recruitItem: getDeptUserRecruitRank,
        deliveredFeeItem: getDeptUserDeliveryFeeRank,
        refundedItem: getDeptUserRefundFeeRank,
        costItem: getDeptUserRecruitRank,
        toDeliveryUserItem: getDeptUserToDeliveryUserRank,
        deliveredUserItem: getDeptUserDeliveredUserRank
      }
      const params = {
        channelSource: this.courceItem.channelSource,
        endTime: this.courceItem.time[1],
        startTime: this.courceItem.time[0],
        lecturerId: this.courceItem.tearch.lecturerId,
        goodsId: this.courceItem.goodsId,
        deptId
      }
      apiFn[this.courceItem.prop](params)
        .then(res => {
          console.log(res, `获取${this.courceItem.title}`)
          this.barData = {
            xData: [],
            lineData: []
          }
          res.data.forEach(v => {
            this.barData.xData.push(v.name)
            const value = ['toDeliveryUserItem', 'deliveredUserItem'].includes(
              this.courceItem.prop
            )
              ? v.sumData
              : new BigNumber(v.sumData).div(100).toNumber()
            this.barData.lineData.push({
              value,
              groupId: v.name,
              deptId: v.deptId,
              subDeptFlag: v.subDeptFlag
            })
          })
          console.log(this.barData, 'data')
          this.$refs.barCharts &&
            this.$refs.barCharts.setOptions(this.barData, deptId)
        })
        .catch(() => {})
    },
    // 排行榜点击返回
    onClickBack() {
      console.log(this.crumbs)
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
      if (event.data) {
        const index = event.dataIndex
        const obj = this.barData.lineData[index]
        console.log(this.barData, obj)
        if (!obj || !obj.deptId) {
          return console.log('无下级')
        }
        obj.subDeptFlag !== 2 || !obj.deptId
        this.crumbs.push(obj.deptId)
        this.getBarCharts(obj.deptId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.deliveringCourses {
  padding: 20px 20px;
  .content {
    margin-top: 32px;
  }
}
</style>
