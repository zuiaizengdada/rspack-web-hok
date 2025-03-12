<template>
  <div class="wrapper-online-depart-data">
    <div v-if="!formDepartData.employeeDeptId && formDepartData.offlineFlag === 0" class="revenue-performance">
      <span :class="active === 1?'active':''" @click="changeActive(1)">营收</span>
      <span :class="active === 2?'active':''" @click="changeActive(2)">业绩
        <el-tooltip class="item" effect="dark" content="业绩是在营收的基础上，经过公司规定的业绩分成公式，计算的业绩数据" placement="right-start">
          <i class="el-icon-question yj-right" />
        </el-tooltip>
      </span>
    </div>
    <div v-else-if="formDepartData.employeeDeptId && formDepartData.offlineFlag === 0" class="revenue-performance">
      <span :class="activePart === 3?'active':''" @click="changeActive(3)">个人</span>
      <span :class="activePart === 4?'active':''" @click="changeActive(4)">达人</span>
    </div>
    <div v-if="active === 1" class="gmv-block">
      <span>{{ title }} <em>￥{{ filterPrice(amount) }}</em></span>
      <span style="margin-left: 50px;">对比{{ contrastString }}
        <em v-if="amountLinkRatio > 0" class="green-xl"><em style="margin-right: 5px;">{{ filterPrice(amountDiffer) }}</em> {{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}<img src="../../../../../assets/image/business/icn_green_up.png" /></em>
        <em v-else-if="amountLinkRatio < 0" class="red-xl"><em style="margin-right: 5px;">{{ filterPrice(amountDiffer) }}</em>  {{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}<img src="../../../../../assets/image/business/icn_red_up.png" /></em>
        <em v-else>{{ filterPrice(amountDiffer) }}  {{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}</em>
      </span>
    </div>
    <div class="gmv-table-data">
      <dataChart ref="dataChart" @changeDeptMent="changeDeptMent" />
      <div class="gmv-table-line" />
      <MTitle>详情数据</MTitle>
      <data-table ref="dataTable" @changeDeptMent="changeDeptMent" />
    </div>

  </div>
</template>

<script>
import dataChart from './dataChart.vue'
import dataTable from './dataTable.vue'
import { filterPrice } from '@/utils'
import { revenueGroupByBizType } from '@/api/business/onlineAndOffline'
export default {
  components: {
    dataChart,
    dataTable
  },
  data() {
    return {
      active: 1,
      activePart: 3,
      amount: 0,
      amountLinkRatio: 0,
      contrastString: '',
      amountDiffer: '',
      title: '',
      formDepartData: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    changeDeptMent(obj, type) {
      this.$emit('changeDeptMent', obj, type)
    },
    filterPrice,
    changeActive(type) {
      if (type > 2) {
        this.activePart = type
      } else {
        this.active = type
      }

      this.$nextTick(() => {
        this.$refs.dataChart.init(this.formDepartData, this.active, this.activePart)
        this.$refs.dataTable.init(this.formDepartData, this.active, this.activePart)
      })
    },
    init(item) {
      this.formDepartData = item
      if (item.time.active === 0) {
        this.contrastString = '前日'
      } else if (item.time.active === 1) {
        this.contrastString = '昨日'
      } else if (item.time.active === 2) {
        this.contrastString = '同期'
      } else if (item.time.active === 3) {
        this.contrastString = '上月'
      } else if (item.time.active === 4) {
        this.contrastString = '去年'
      }
      this.$nextTick(() => {
        this.$refs.dataChart.init(this.formDepartData, this.active, this.activePart)
        this.$refs.dataTable.init(this.formDepartData, this.active, this.activePart)
        this.loadBizTypeData(item)
      })
    },
    loadBizTypeData(item) {
      const params = {}
      params.bizTypes = []
      params.bizTypes.push(item.bizTypeActive)
      if (item.employeeDeptId) {
        params.employeeDeptId = item.employeeDeptId
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (item.itemIdList && item.itemIdList.length > 0) {
        params.itemIdList = item.itemIdList
      }
      if (item.orderChannel && item.orderChannel.length > 0) {
        params.orderChannel = item.orderChannel[0]
      }
      if (item.orderChannel && item.orderChannel.length > 1) {
        params.shopId = item.orderChannel[1]
      }
      if ((item.productCategory && item.productCategory !== 999) || item.productCategory === 0) {
        params.productCategory = item.productCategory
      }
      if (item.teacherIdList && item.teacherIdList.length > 0) {
        params.teacherIdList = item.teacherIdList
      }
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]

      revenueGroupByBizType(params).then(res => {
        if (res.code === 1 && res.data) {
          this.amount = res.data[0].amount
          this.amountDiffer = res.data[0].amountDiffer
          this.amountLinkRatio = res.data[0].amountLinkRatio
          this.title = ''
          if (this.formDepartData.productCategory === 0) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '视频课' + res.data[0].bizTypeName
          } else if (this.formDepartData.productCategory === 1) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '直播课' + res.data[0].bizTypeName
          } else if (this.formDepartData.productCategory === 2) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '线下课' + res.data[0].bizTypeName
          } else if (this.formDepartData.productCategory === 3) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '组合课' + res.data[0].bizTypeName
          } else {
            this.title = res.data[0].bizTypeName
          }
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-depart-data {
      width: 100%;
      .revenue-performance {
        margin-top: 20px;
        width: 162px;
        height: 28px;
        background: #F7F7F7;
        padding: 1px;
        span {
          float: left;
          text-align: center;
          width: 80px;
          height: 26px;
          line-height: 26px;
          color: #666666;
          text-align: center;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          cursor: pointer;
          .yj-right {
            margin-left: 2px;
          }
        }
        span.active {
          background: #fff;
          color: #000;
        }
      }
      .short-cls {
        width: 83px;
      }
      .gmv-block {
        float: left;
        margin-top: 20px;
        height: 32px;
        border-radius: 6px;
        padding: 0 20px;
        background: #E8F1FF;
        span {
          color: #333333;
          text-align: center;
          font-family: "Microsoft YaHei";
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px;
          em {
            margin-left: 8px;
            font-style: normal;
            font-size: 14px;
            color: #666;
            img {
              display: inline-block;
              width: 16px;
              margin-left: 4px;
              margin-top: -5px;
            }
          }
          em.red-xl {
            color: #D43030;
          }
          em.green-xl {
            color: #43CF7C;
          }
        }
      }
      .gmv-table-data {
        margin-top: 20px;
      }
      .gmv-table-line {
        width: 100%;
        height: 1px;
        margin-top: 10px;
        background: #D9D9D94d;
        margin-top: 20px;
        margin-bottom: 20px;
      }
  }
  </style>
