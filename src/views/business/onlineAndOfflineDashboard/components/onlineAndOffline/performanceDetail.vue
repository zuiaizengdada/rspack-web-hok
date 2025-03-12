<template>
  <div class="wrapper-online-perfomance-detail">
    <MTitle>团队数据</MTitle>
    <div class="perfomance-chart">
      <performanceChart ref="performanceChart" />
    </div>
    <div class="ip-tearcher-row">
      <div class="item-row item-first-row">
        <teamTable
          ref="zbPerformanceDetail"
          :columns="columns"
          :get-list="getList"
          :form-for-list="formPerformance"
          :hb-line="6"
          :is-pages="false"
        >
          <template v-slot:employeeName="{scope}">
            <span v-if="scope.row.employeeName !== '总计'" class="blue-cls" @click="toYuangongKanban(scope.row)">{{ scope.row.employeeName }}</span>
            <span v-else>{{ scope.row.employeeName }}</span>
          </template>
          <template v-slot:freePerformance="{scope}">
            <span>{{ filterPrice(scope.row.freePerformance) }}</span>
            <em class="dl-em">（{{ scope.row.freeOrderCount }}单）</em>
          </template>
          <template v-slot:directAmount="{scope}">
            <span>{{ filterPrice(scope.row.directAmount) }}</span>
            <em class="dl-em">（{{ scope.row.directOrderCount }}单）</em>
          </template>
          <template v-slot:indirectAmount="{scope}">
            <span>{{ filterPrice(scope.row.indirectAmount) }}</span>
            <em class="dl-em">（{{ scope.row.indirectOrderCount }}单）</em>
          </template>
          <template v-slot:totalPerformance="{scope}">
            <div class="blue-cls">
              <span>{{ filterPrice(scope.row.totalPerformance) }}</span>
              <em class="dl-em">（{{ scope.row.orderCount }}单）</em>
            </div>

          </template>
          <template v-slot:currentMonthPerformance="{scope}">
            <span>{{ filterPrice(scope.row.currentMonthPerformance) }}</span>
          </template>
          <template v-slot:linkMonthPerformance="{scope}">
            <span>{{ filterPrice(scope.row.linkMonthPerformance) }}</span>
          </template>
          <template v-slot:linkRatio="{scope}">
            {{ scope.row.linkRatio>1000?'1000%+':scope.row.linkRatio+'%' }}
          </template>
        </teamTable>
      </div>
      <div class="item-row">
        <accountChart ref="accountChartForPerfomance" />
      </div>
    </div>
  </div>
</template>

<script>
import teamTable from '../detailDataCom/table.vue'
import { columns } from './teamTable'
import accountChart from '../detailDataCom/accountChart.vue'
import { filterPrice } from '@/utils'
import { getDailyPerfomanceDetailYj, getPerformanceEmployeeSimpleDetailList } from '@/api/business/onlineAndOffline'
import performanceChart from '../detailDataCom/performanceChart.vue'
export default {
  components: {
    teamTable,
    accountChart,
    performanceChart
  },
  data() {
    return {
      columns,
      formPerformance: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    filterPrice,
    init(item) {
      this.formPerformance = item
      this.$nextTick(() => {
        this.$refs.performanceChart.init(item, 2, 3)
        this.$refs.zbPerformanceDetail.init()
        this.getChartData()
      })
    },
    getList() {
      const params = this.returnParams()
      return getDailyPerfomanceDetailYj(params)
    },
    getChartData() {
      const params = this.returnParams()
      getPerformanceEmployeeSimpleDetailList(params).then(res => {
        if (res.code === 1 && res.data) {
          this.$nextTick(() => {
            this.$refs.accountChartForPerfomance.init(res.data, '个人', 4, this.formPerformance)
          })
        }
      })
    },
    returnParams() {
      const item = this.formPerformance
      const params = {}
      params.bizType = item.bizTypeActive
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
      return params
    },
    toYuangongKanban(row) {
      this.$router.push({ path: '/business/onlineAndOfflinePerson', query: {
        employeeId: row.employeeUid,
        employeeDeptId: this.formPerformance.employeeDeptId,
        employeeSecondDeptId: this.formPerformance.employeeSecondDeptId,
        timeActive: this.formPerformance.time.active,
        startTime: this.formPerformance.time.time[0],
        endTime: this.formPerformance.time.time[1],
        chooseType: this.formPerformance.chooseType
      } })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-perfomance-detail {
      width: 100%;
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      float: left;
      border-radius: 10px;
      .ip-tearcher-row {
        margin-top: 20px;
        width: calc(100% + 18px);
        margin-left: -10px;
        height: 482px;
        .item-row {
            float: left;
            width: 25%;
            margin-left: 18px;
            margin: 0 10px;
            height: 482px;
            flex-shrink: 0;
            border-radius: 6px;
            border: 1px solid #EFF2F6;
        }
        .item-first-row {
            width: calc(75% - 42px);
        }
    }
  }
  .dl-em {
    font-style: normal;
  }
  .blue-cls {
    color: #0091FF;
    cursor: pointer;
  }

  .perfomance-chart {
    width: 100%;
    height: 380px;
  }
  .blue-cls {
    color: #0091FF;
    cursor: pointer;
  }
  </style>
