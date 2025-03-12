<template>
  <div v-loading="loadding" element-loading-spinner="el-icon-loading">
    <!-- 表格通用组件 -->
    <el-table
      :header-cell-style="headerCellStyleFunc"
      :class="{ 'zb-table': true, 'el-table-null': !tableData.length }"
      v-bind="$attrs"
      :data="tableData"
      show-summary
      border
      :summary-method="getSummaryEmployee"
      v-on="$listeners"
    >
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.type !== 'slot'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :render-header="item.renderHeader"
          :fixed="item.fixed"
          v-bind="item.attrs"
        />
        <el-table-column
          v-else
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :render-header="item.renderHeader"
          :fixed="item.fixed"
          v-bind="item.attrs"
        >
          <template slot-scope="scope">
            <slot :name="item.prop" :scope="scope" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-row
      type="flex"
      :justify="isLeftBottomSlot ? 'space-between' : 'end'"
      style="margin-top: 10px"
    >
      <slot name="footer" />
      <el-pagination
        v-if="isPages"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="jumper, prev, pager, next, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import { filterPrice } from '@/utils'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    getList: {
      type: Function,
      default: () => {
        return []
      }
    },
    formForList: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    dataKey: {
      type: String,
      default: 'items'
    },
    // 是否显示分页
    isPages: {
      type: Boolean,
      default: true
    },
    // 分页左下角插槽
    isLeftBottomSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      loadding: false,
      currentPage: 1,
      pageSize: 10,
      directAmount: {},
      employeeObject: {}
    }
  },
  methods: {
    filterPrice,
    removeLastData() {
      this.tableData.pop()
    },
    getSummaryEmployee(params) {
      console.log('this.employeeObject: ', this.employeeObject)
      const { columns, data } = params
      const sums = []
      if (!this.employeeObject.employeeName && !this.employeeObject.teacherName && !this.employeeObject.orderChannelName && !this.employeeObject.shopName) {
        return []
      }
      if (this.employeeObject.employeeName && this.formForList.chooseType === 2) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.label === '免费业绩(单量)') {
            sums[index] = this.filterPrice(this.employeeObject.freePerformance) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.label === '直接付费(单量)') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.label === '间接付费(单量)') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'totalPerformance') {
            sums[index] = this.filterPrice(this.employeeObject.totalPerformance)
            return
          }
          if (column.property === 'currentMonthPerformance') {
            sums[index] = this.filterPrice(this.employeeObject.currentMonthPerformance)
            return
          }
          if (column.property === 'linkMonthPerformance') {
            sums[index] = this.filterPrice(this.employeeObject.linkMonthPerformance)
            return
          }
          if (column.property === 'linkRatio') {
            sums[index] = this.employeeObject.linkRatio > 1000 ? '1000%+' : this.employeeObject.linkRatio + '%'
            return
          }
        })
        return sums
      } else if (this.employeeObject.teacherName && this.formForList.chooseType === 1) {
        columns.forEach((column, index) => {
          console.log('@@@:', column)
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeRevenue') {
            sums[index] = this.filterPrice(this.employeeObject.freeRevenue) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'revenue') {
            sums[index] = this.filterPrice(this.employeeObject.revenue) + '(' + this.employeeObject.revenueOrderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'refundPercent') {
            sums[index] = this.employeeObject.refundPercent > 1000 ? '1000%+' : this.employeeObject.refundPercent + '%'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'amount') {
            sums[index] = this.filterPrice(this.employeeObject.amount)
            return
          }
          if (column.property === 'linkAmount') {
            sums[index] = this.filterPrice(this.employeeObject.linkAmount)
            return
          }
          if (column.property === 'amountLinkRatio') {
            sums[index] = this.employeeObject.amountLinkRatio > 1000 ? '1000%+' : this.employeeObject.amountLinkRatio + '%'
            return
          }
        })
        return sums
      } else if (this.employeeObject.orderChannelName && this.formForList.chooseType === 1) {
        columns.forEach((column, index) => {
          console.log('@@@:', column)
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeRevenue') {
            sums[index] = this.filterPrice(this.employeeObject.freeRevenue) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'revenue') {
            sums[index] = this.filterPrice(this.employeeObject.revenue) + '(' + this.employeeObject.revenueOrderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'refundPercent') {
            sums[index] = this.employeeObject.refundPercent > 1000 ? '1000%+' : this.employeeObject.refundPercent + '%'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'amount') {
            sums[index] = this.filterPrice(this.employeeObject.amount)
            return
          }
          if (column.property === 'linkAmount') {
            sums[index] = this.filterPrice(this.employeeObject.linkAmount)
            return
          }
          if (column.property === 'amountLinkRatio') {
            sums[index] = this.employeeObject.amountLinkRatio > 1000 ? '1000%+' : this.employeeObject.amountLinkRatio + '%'
            return
          }
        })
        return sums
      } else if (this.employeeObject.shopName && this.formForList.chooseType === 1) {
        columns.forEach((column, index) => {
          console.log('@@@:', column)
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeRevenue') {
            sums[index] = this.filterPrice(this.employeeObject.freeRevenue) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'revenue') {
            sums[index] = this.filterPrice(this.employeeObject.revenue) + '(' + this.employeeObject.revenueOrderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'refundPercent') {
            sums[index] = this.employeeObject.refundPercent > 1000 ? '1000%+' : this.employeeObject.refundPercent + '%'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'amount') {
            sums[index] = this.filterPrice(this.employeeObject.amount)
            return
          }
          if (column.property === 'linkAmount') {
            sums[index] = this.filterPrice(this.employeeObject.linkAmount)
            return
          }
          if (column.property === 'amountLinkRatio') {
            sums[index] = this.employeeObject.amountLinkRatio > 1000 ? '1000%+' : this.employeeObject.amountLinkRatio + '%'
            return
          }
        })
        return sums
      }
    },
    headerCellStyleFunc({ row, column, rowIndex, columnIndex }) {
      if (!this.formForList.bizTypeActive) {
        this.formForList.bizTypeActive = this.formForList.bizType
      }
      if (this.formForList.bizTypeActive === 3 && (column.label === 'GMV' || column.label === 'GMV(单量)')) {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else if (this.formForList.bizTypeActive === 2 && (column.label === '总退款（单量）' || column.label === '总退款(单量)')) {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else if ((this.formForList.bizTypeActive !== 3 && this.formForList.bizTypeActive !== 2) && (column.label === '总营收（单量）' || column.label === '总业绩(单量)')) {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      }
    },
    init(isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.currentPage = 1
      }
      this.loadding = true
      this.getList()
        .then(res => {
          this.tableData = []
          this.loadding = false
          this.employeeObject = res.data[res.data.length - 1]
          this.tableData = []
          for (var i = 0; i < res.data.length - 1; i++) {
            this.tableData.push(res.data[i])
          }
          this.total = res.data.total || 0
          this.currentPage = res.data.pageIndex
        })
        .catch(() => {
          this.loadding = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.$emit('handleSizeChangeEmit', this.pageSize)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('handleCurrentChangeEmit', this.currentPage)
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep .zb-table {
    width: 100%;
    border-left: 1px solid #eff2f6;
    border-right: 1px solid #eff2f6;
    border-radius: 6px;
    .el-table-null {
      border-bottom: 1px solid #eff2f6;
    }
    .el-table th.el-table__cell.is-leaf {
      border-bottom: none;
    }
    .el-table td.el-table__cell {
      border-bottom-color: #eff2f6;
    }
    .el-table::before {
      width: 0 !important;
      height: 0 !important;
    }
    .el-table__header-wrapper {
      .el-table__header {
        th {
          border-bottom: none;
          .cell {
            // color: #000;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
          }
        }
      }
    }
    .el-table__body {
      .el-table__row {
        .el-table__cell {
          .cell {
            color: #333;
          }
        }
      }
    }
  }
  </style>
