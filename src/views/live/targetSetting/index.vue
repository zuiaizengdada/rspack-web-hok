<template>
  <MCard class="page_wrap">
    <MTitle>目标业绩表 <span class="m-l-10 tips">注:业绩统计每10分钟更新一次</span></MTitle>
    <filterTop :search="search" @onSearch="onSearch" @checkListChange="checkListChange" />
    <el-table
      ref="eTable"
      v-loading="loading"
      show-summary
      :summary-method="getSummaries"
      :data="tableData"
      style="width: 100%"
      border
      :span-method="objectSpanMethod"
      class="m-t-20"
      :header-cell-style="{ background: '#f5f5f5' }"
      height="100%"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="index" width="50" fixed="left" align="center" />
      <el-table-column prop="userName" label="员工" min-width="120" align="center" fixed="left" />
      <el-table-column prop="tagetValue" label="本月目标" min-width="160" align="center" fixed="left" sortable="custom">
        <template slot="header">
          <div style="display: inline-block;">
            <MTips text="本月目标" tips="指本月设计的目标业绩值" align="center" />
          </div>
        </template>
        <template slot-scope="{ row }">
          {{ row.tagetValue | filterMoney }}
        </template>
      </el-table-column>
      <el-table-column prop="completionRate" label="目标完成率" min-width="160" align="center" fixed="left" sortable="custom">
        <template slot="header">
          <div style="display: inline-block;">
            <MTips text="目标完成率" tips="以本月营收除以本月目标" align="center" />
          </div>
        </template>
        <template slot-scope="{ row }">
          {{ row.completionRate | filtersRate }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="c_type" align="center" fixed="left" />
      <el-table-column prop="gmvSum" label="本月GMV" min-width="160" align="center" fixed="left" sortable="custom">
        <template slot="header">
          <div style="display: inline-block;">
            <MTips text="本月GMV" tips="本月已完成的业绩数据" align="center" />
          </div>
        </template>
        <template slot-scope="{ row }">
          {{ row.gmvSum | filterMoney }}
        </template>
      </el-table-column>
      <el-table-column prop="refundSum" label="新增退款" min-width="160" align="center" fixed="left" sortable="custom">
        <template slot="header">
          <div style="display: inline-block;">
            <MTips text="新增退款" tips="指本月产生的退款金额" align="center" />
          </div>
        </template>
        <template slot-scope="{ row }">
          {{ row.refundSum | filterMoney }}
        </template>
      </el-table-column>
      <el-table-column prop="revenueSum" label="本月营收" min-width="160" align="center" fixed="left" sortable="custom">
        <template slot="header">
          <div style="display: inline-block;">
            <MTips text="本月营收" tips="指本月GMV减去新增退款" align="center" />
          </div>
        </template>
        <template slot-scope="{ row }">
          {{ row.revenueSum | filterMoney }}
        </template>
      </el-table-column>
      <template v-for="(item) in timeDate">
        <el-table-column :key="item" :prop="item" :label="item" min-width="120" align="center">
          <template slot-scope="{ row }">
            {{ row[item] | filterMoney }}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import { employeePerformance } from '@/api/liveRoom/target.js'
import { filtersMoneyByZero } from '@/filters/index'
import { getDays } from '@/assets/js/time.js'
import moment from 'moment'
export default {
  components: {
    filterTop
  },
  filters: {
    filtersRate(rate, unit = '%') {
      return rate + '%'
    },
    filterMoney(value) {
      return value < 0 ? '-' + filtersMoneyByZero(value) : filtersMoneyByZero(value)
    }
  },
  data() {
    return {
      loading: false,
      search: {
        month: '',
        deptIds: [],
        userIds: [],
        checkList: [1, 2, 3]
      },
      // 合计数据
      sumData: {
        completionRateSum: 0, // 目标完成率合计
        gmvSum: 0, // 本月gmv合计
        refundSum: 0, // 新增退款合计
        revenueSum: 0, // 本月营收合计
        tagetValueSum: 0 // 目标值合计
      },
      dailyCompletionSum: {},
      timeDate: [],
      tableData: [],
      orgListData: [],
      sortObj: {
        order: null,
        prop: null
      }
    }
  },
  mounted() {
    this.search.month = moment().format('YYYYMM')
    this.onSearch()
  },
  methods: {
    checkListChange() {
      this.getList()
    },
    filtersRate(rate, unit = '%') {
      return (rate || 0) + '%'
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '——'
        } else if (index === 1) {
          sums[index] = '合计'
        } else if (index === 4) {
          sums[index] = '——'
        } else if (index === 3) {
          sums[index] = this.filtersRate(this.sumData.completionRateSum)
        } else if (index > 1 && index < 8) {
          const obj = {
            2: 'tagetValueSum',
            5: 'gmvSum',
            6: 'refundSum',
            7: 'revenueSum'
          }
          sums[index] = this.sumData[obj[index]] < 0 ? '-' + filtersMoneyByZero(this.sumData[obj[index]]) : filtersMoneyByZero(this.sumData[obj[index]])
        } else {
          sums[index] = this.dailyCompletionSum[column.property] < 0 ? '-' + filtersMoneyByZero(this.dailyCompletionSum[column.property] || 0) : filtersMoneyByZero(this.dailyCompletionSum[column.property] || 0)
        }
        return
      })

      return sums
    },
    getList() {
      this.loading = true
      let dept = ''
      if (this.search.deptIds.length > 0) {
        dept = this.search.deptIds[this.search.deptIds.length - 1]
      }
      const data = {
        deptId: dept,
        monthYear: Number(this.search.month),
        userIds: this.search.userIds
      }
      employeePerformance(data).then(res => {
        this.sumData = {
          completionRateSum: res.data.completionRateSum, // 目标完成率合计
          gmvSum: res.data.gmvSum, // 本月gmv合计
          refundSum: res.data.refundSum, // 新增退款合计
          revenueSum: res.data.revenueSum, // 本月营收合计
          tagetValueSum: res.data.tagetValueSum // 目标值合计
        }
        this.dailyCompletionSum = {}
        this.timeDate.map(v => {
          const o = res.data.dailyCompletionSumList.find(e => e.date === v)
          this.dailyCompletionSum[v] = o ? o.gmv : 0
        })
        const listData = []
        res.data.employeePerformanceList.map(pre => {
          const obj = {}
          this.timeDate.map(v => {
            const o = pre.dailyCompletion.find(e => e.date === v)
            obj[v] = o ? o.gmv : 0
          })
          listData.push({ ...pre, ...obj })
        })
        this.orgListData = listData // 原始数据存一份用来做排序
        this.sortFn()
      }).catch(() => {
        this.tableData = []
        this.$nextTick(() => {
          this.$refs.eTable && this.$refs.eTable.doLayout()
          this.loading = false
        })
      })
    },
    sortChange(val) {
      this.sortObj = val
      this.sortFn()
      console.log('排序改变触发', val)
    },
    sortFn() {
      this.loading = true
      let tableData = []
      const data = JSON.parse(JSON.stringify(this.orgListData))
      if (this.sortObj.order) {
        data.sort((a, b) => {
          return this.sortObj.order === 'descending' ? a[this.sortObj.prop] - b[this.sortObj.prop] : b[this.sortObj.prop] - a[this.sortObj.prop]
        })
      }
      data.map((v, i) => {
        const v1 = this.getTimeDate(v, 'digitalLiveGmv')
        const v2 = this.getTimeDate(v, 'personLiveGmv')
        const v3 = this.getTimeDate(v, 'enterGmv')
        const v4 = this.getTimeDate(v, 'gmvSum')

        const obj = {
          1: { ...v, ...v1, index: i + 1, c_type_sort: 1, c_type: '数字直播', gmvSum: v.digitalLiveGmv, refundSum: v.digitalLiveRefund, revenueSum: v.digitalLiveRevenue },
          2: { ...v, ...v2, index: i + 1, c_type_sort: 2, c_type: '真人直播', gmvSum: v.personLiveGmv, refundSum: v.personLiveRefund, revenueSum: v.personLiveRevenue },
          3: { ...v, ...v3, index: i + 1, c_type_sort: 3, c_type: '录单', gmvSum: v.enterGmv, refundSum: v.enterRefund, revenueSum: v.enterRevenue }
        }
        this.search.checkList.map(pre => {
          tableData = tableData.concat([obj[pre]])
        })
        tableData = tableData.concat([
          { ...v, ...v4, index: i + 1, c_type_sort: 4, c_type: '合计', gmvSum: v.gmvSum, refundSum: v.refundSum, revenueSum: v.revenueSum }
        ])
      })
      this.tableData = tableData
      console.log(this.tableData, 'this.tableData')
      this.$nextTick(() => {
        this.$refs.eTable && this.$refs.eTable.doLayout()
        this.loading = false
      })
    },
    getTimeDate(res, key) {
      const obj = {}
      this.timeDate.map(v => {
        const o = res.dailyCompletion.find(e => e.date === v)
        obj[v] = o ? o[key] : 0
      })
      return obj
    },
    onSearch() {
      if (!this.search.month) {
        this.search.month = moment().format('YYYYMM')
      }
      this.inteDate()
      this.getList()
    },
    inteDate() {
      const arr = []
      var date = new Date(moment(this.search.month + '01').format('YYYY-MM-DD'))
      var date1 = getDays(date)
      for (let i = 1; i <= date1; i++) {
        // 获取一个临时的时间,传入当前的日期
        var nextDate2 = new Date(date.getFullYear(), date.getMonth(), i)
        arr.push(moment(nextDate2).format('YYYY-MM-DD'))
      }
      this.timeDate = arr
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 2, 3].includes(columnIndex)) {
        if (rowIndex % (this.search.checkList.length + 1) === 0) {
          return {
            rowspan: this.search.checkList.length + 1,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  display: flex;
  flex-direction: column;
  padding: 20px;
}
::v-deep {
  .el-table {
    .el-table__body-wrapper{
      z-index: 2
    }
  }
}
.tips {
  font-size: 14px;
  color: red;
  font-weight: 400;
}
</style>
