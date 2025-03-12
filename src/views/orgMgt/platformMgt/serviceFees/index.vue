<template>
  <div class="bill-fees-home">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pb20"
    >
      <template #couponInfo>
        <el-input />
      </template>
    </HokSearchForm>
    <div class="flex flex-right pb20 pt20">
      <el-button size="small" type="primary" @click="addFn">新增</el-button>
    </div>
    <MPageLayout
      ref="feesTableRef"
      type="tablePage"
      class="fees-table"
      :border="true"
      :slot-arr="config.basics.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.basics.columns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      :row-class-name="tableRowClassName"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="billNo" slot-scope="scope">
        <p>
          {{ scope.row.billNo }}
          <i
            class="el-icon-document-copy icon-copy"
            @click="copyBtn(scope.row.billNo)"
          />
        </p>
      </template>
      <template slot="chargesAmount" slot-scope="scope">
        <p>{{ scope.row.chargesAmount | priceFt }}</p>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button class="ptb0" type="text" @click="detailFn(scope.row)">
          详情
        </el-button>
        <el-button
          v-if="scope.row.status === 1"
          class="ptb0"
          type="text"
          @click="delFn(scope.row)"
        >
          删除
        </el-button>
      </template>
    </MPageLayout>
    <AddFeesDialog ref="addFeesRef" @search="searchFn" />
    <detailFeesDialog ref="detailFeesRef" @search="searchFn" />
  </div>
</template>

<script>
import Decimal from 'decimal.js'

import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import AddFeesDialog from './cpns/addDialog.vue'
import detailFeesDialog from './cpns/detailDialog.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { getFirstAndLastDayOfMonth } from '@/utils/common.js'
import { copy } from '@/utils'

import { serviceFees } from '../data.js'
import {
  listOrganizationByParamApi,
  pageListBillManualChargesApi
} from '@/api/orgSettlement/billingCenter.js'
export default {
  components: { HokSearchForm, AddFeesDialog, detailFeesDialog },
  filters: {
    priceFt(number, unit = '￥') {
      if (typeof number !== 'number') {
        return '--'
      } else {
        number = Decimal(number).div(100) // 金钱单位后端存储的分
      }
      // 这里我们手动处理，不依赖于特定的区域设置
      const yuanString = number.toString()
      const parts = yuanString.split('.')
      let integerPart = parts[0]
      const decimalPart = parts[1] ? '.' + parts[1] : ''

      // 添加千分位分隔符
      if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      // 合并整数部分和小数部分（如果有的话）
      return unit + integerPart + decimalPart
    },
    rowOptionsFt(value, Arr, key = 'value', label = 'label') {
      for (const item of Arr) {
        if (value === item[key]) return item[label]
      }
      return value
    }
  },
  data() {
    return {
      formOpts: {
        ...deepClone(serviceFees.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            type: 'plain',
            fn: this.clearFn,
            bind: { plain: true }
          }
        ]
      },
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: deepClone(serviceFees.table)
      },
      billAmountLoading: false
    }
  },
  created() {
    this.initOption()
    this.getTableInfo()
  },
  methods: {
    async initOption() {
      const { data } = await listOrganizationByParamApi({
        isDeleted: 0,
        isInPlatform: false
      })
      this.formOpts.optionsObj.tenantId = [
        { name: '全部', organizationId: '' },
        ...(data || [])
      ]
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.formMat()
        const { data } = await pageListBillManualChargesApi({
          ...req,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        if (!data) return
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$nextTick(() => {
          this.$refs.feesTableRef?.doLayout()
        })
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    formMat() {
      const req = deepClone(this.formOpts.formData)
      delete req.time
      if (
        this.formOpts.formData.time &&
        this.formOpts.formData.time[0] &&
        this.formOpts.formData.time[1]
      ) {
        const { firstDay } = getFirstAndLastDayOfMonth(
          this.formOpts.formData.time[0]
        )
        req.beginBillCycle = firstDay
        const { lastDay } = getFirstAndLastDayOfMonth(
          this.formOpts.formData.time[1]
        )
        req.endBillCycle = lastDay
      }
      for (const key in req) {
        if (req[key] === '') {
          delete req[key]
        }
      }
      return req
    },
    searchFn() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    clearFn() {
      console.log('this.formOpts.ref', this.formOpts)
      this.formOpts.ref.resetFields()
      this.formOpts.formData = deepClone(serviceFees.form.formData)
      this.getTableInfo()
    },
    addFn() {
      this.$refs.addFeesRef.openDialog()
    },
    detailFn(row) {
      this.$refs.detailFeesRef.openDialog(row)
    },
    delFn(row) {
      this.$refs.detailFeesRef.openDialog(row, 'del')
    },
    // MPageLayout
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return 'blue-row'
      }
      return ''
    },
    copyBtn(txt) {
      copy(txt)
      this.$message.success('复制成功')
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.bill-fees-home {
  @include responsive-height(20px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  .pb20 {
    padding: 0 20px;
  }
  .pt20 {
    padding-top: 20px;
  }
  .ptb0 {
    padding-top: 0;
    padding-bottom: 0;
  }
  .icon-copy {
    cursor: pointer;
  }
  ::v-deep .fees-table {
    flex: 1;
    overflow: hidden;
    .el-table {
      border-radius: 8px;
    }
    .blue-row {
      background-color: #f2f9ff !important;
    }
    .page_footer {
      justify-content: flex-end;
    }
    .el-table--group,
    .el-table--border,
    .el-table th.el-table__cell.is-leaf,
    .el-table td.el-table__cell {
      border-color: #dcecf7;
    }
    .blue-row {
      background-color: #f2f9ff !important;
    }
    thead th {
      background-color: #f2f9ff !important;
      padding: 10px 0;
      text-align: center;
      .cell {
        display: flex;
        justify-content: center;
      }
    }
    .cell {
      font-weight: 500;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
    th.el-table__cell > .cell {
      font-weight: 700;
      color: #5c6387;
      font-size: 16px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
