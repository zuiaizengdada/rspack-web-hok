<template>
  <div class="bill-fees-home">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    />
    <div class="bill-settlement-table">
      <el-table
        border
        :data="totalConfig.tableData"
        :loading="billAmountLoading"
      >
        <template v-for="item in totalConfig.columns">
          <el-table-column
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          >
            <template v-if="item.labelTips" slot="header">
              <MTips :text="item.label" :tips="item.labelTips" />
            </template>
            <template slot-scope="scope">
              <span class="total-price">
                {{ scope.row[item.prop] | priceFt }}
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
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
      <template slot="totalAmount" slot-scope="scope">
        <p>{{ scope.row.totalAmount | priceFt }}</p>
      </template>
      <template slot="billNo" slot-scope="scope">
        <p>
          {{ scope.row.billNo }}
          <i
            class="el-icon-document-copy icon-copy"
            @click="copyBtn(scope.row.billNo)"
          />
        </p>
      </template>
      <template slot="isSignProtocol" slot-scope="scope">
        <p>{{ scope.row.isSignProtocol ? '已签署' : '未签署' }}</p>
      </template>
      <template slot="discountAmount" slot-scope="scope">
        <p>{{ scope.row.discountAmount | priceFt }}</p>
      </template>
      <template slot="payableAmount" slot-scope="scope">
        <p>{{ scope.row.payableAmount | priceFt }}</p>
      </template>
      <template slot="paidAmount" slot-scope="scope">
        <p>{{ scope.row.paidAmount | priceFt }}</p>
      </template>
      <template slot="settleTime" slot-scope="scope">
        <p>{{ scope.row.settleTime || '--' }}</p>
      </template>
      <template slot="status" slot-scope="scope">
        <div>
          <p>
            {{
              scope.row.status
                | rowOptionsFt(
                  formOpts.optionsObj.billStatus,
                  'code',
                  'message'
                )
            }}
          </p>
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          class="ptb0"
          type="text"
          @click="
            goPage(isPt ? 'BillingCenterDetails' : 'FeesBillingCenterDetails', {
              billNo: scope.row.billNo
            })
          "
        >
          查看明细
        </el-button>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import Decimal from 'decimal.js'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { getFirstAndLastDayOfMonth } from '@/utils/common.js'
import { copy } from '@/utils'

import { feesOpts } from '../../../data.js'
import {
  listOrganizationByParamApi,
  getProtocolTenantIdsApi,
  billStatusApi,
  pageBillListApi,
  getBillAmountStatisticsApi,
  getBillAmountStatisticsTenantApi,
  pageBillListTenantApi
} from '@/api/orgSettlement/billingCenter.js'
export default {
  components: { HokSearchForm },
  filters: {
    priceFt(number) {
      if (typeof number !== 'number') return '--'
      number = Decimal(number).div(100) // 钱单位为分 单独处理
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
      return '￥' + integerPart + decimalPart
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
      isPt: true, // true => 平台机构  false=> 非平台机构
      formOpts: {},
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: deepClone(feesOpts.table)
      },
      totalConfig: {
        tableData: [],
        columns: feesOpts.ptTotalTable
      },
      billAmountLoading: false,
      PageApi: null, // 表格api
      AmountApi: null // 金额总费api
    }
  },

  created() {
    this.initPage()
    this.initOption()
    this.getTableInfo()
  },
  methods: {
    initPage() {
      this.isPt = !(this.$route.name === 'FeesBillingCenterHome')
      this.formOpts = {
        ...deepClone(this.isPt ? feesOpts.form : feesOpts.unform),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            type: 'plain',
            fn: this.clearFn,
            bind: { plain: true }
          }
        ]
      }
      this.$set(
        this.totalConfig,
        'columns',
        feesOpts[this.isPt ? 'ptTotalTable' : 'totalTable']
      )
      // this.totalConfig.columns =
      //   feesOpts[this.isPt ? 'ptTotalTable' : 'totalTable']
      this.AmountApi = this.isPt
        ? getBillAmountStatisticsApi
        : getBillAmountStatisticsTenantApi
      this.PageApi = this.isPt ? pageBillListApi : pageBillListTenantApi
    },
    async initOption() {
      const { data } = await listOrganizationByParamApi({
        isDeleted: 0,
        isInPlatform: false
      })
      const { data: ids } = await getProtocolTenantIdsApi()
      const organizations = (data || []).filter(f =>
        ids.includes(f.organizationId)
      )
      this.formOpts.optionsObj.tenantId = [
        { name: '全部', organizationId: '' },
        ...organizations
      ]
      const { data: biilData } = await billStatusApi()
      this.formOpts.optionsObj.billStatus = [
        {
          code: '',
          message: '全部'
        },
        ...(biilData || [])
      ]
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.formMat()
        req.billStatusList = req.billStatus ? [req.billStatus] : undefined
        delete req.billStatus
        const { data } = await this.PageApi({
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
        // 是第一页 重新可算总数
        if (this.config.currentPage === 1) this.getBillAmountStatistics(req)
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    async getBillAmountStatistics(req) {
      this.billAmountLoading = true
      try {
        req.status = req.billStatus
        delete req.billStatus
        const { data, success } = await this.AmountApi({ ...req })
        if (success) {
          this.totalConfig.tableData = data ? [data] : []
        }
      } catch (error) {
        console.log('getBillAmountStatisticsApi----ERROE', error)
      }
      this.billAmountLoading = false
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
      this.formOpts.formData = feesOpts.form.formData
      this.getTableInfo()
    },
    copyBtn(txt) {
      copy(txt)
      this.$message.success('复制成功')
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

    // MPageLayout --end
    goPage(routerName, query = {}) {
      this.$router.push({
        name: routerName,
        query: {
          prevPath: this.$route.path + '?active=fees',
          ...query
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.bill-fees-home {
  @include responsive-height(68px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  .icon-copy {
    cursor: pointer;
  }
  .pd20 {
    padding: 20px;
  }
  .ptb0 {
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep .bill-settlement-table {
    padding: 0 20px;
    .el-table {
      border-radius: 8px;
    }
    .el-table--border {
      border-radius: 8px;
    }
    /* .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell{
      border-bottom: none;
    } */
    thead tr {
      th {
        &.el-table__cell.is-leaf {
          padding-left: 22px;
        }
        background-color: #ebf7ff;
        &:first-child {
          border-radius: 8px 0 0 0;
        }
        &:nth-child(3) {
          border-radius: 0 8px 0 0;
        }
        .cell {
          color: #5c6387;
        }
      }
    }
    tbody tr:last-child {
      border-radius: 0 0 8px 8px;
      td:first-child {
        border-radius: 0 0 0 8px;
      }
      td:last-child {
        border-radius: 0 0 8px 0;
      }
    }
    tbody .cell {
      padding: 10px 20px;
      .total-price {
        color: $primaryColor;
        font-family: 'Microsoft YaHei';
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px;
        padding: 16px 10px 16px 12px;
      }
    }
  }
  ::v-deep .fees-table {
    flex: 1;
    overflow: hidden;
    .el-table {
      border-radius: 8px;
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
      padding: 15px 0;
      justify-content: center;
    }
    .cell {
      font-weight: 500;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
    th.el-table__cell > .cell {
      color: #5c6387;
      font-size: 16px;
      font-weight: 600;
      justify-content: center;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
