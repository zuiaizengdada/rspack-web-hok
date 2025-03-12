<template>
  <div class="bill-fees-home">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #couponInfo>
        <el-input />
      </template>
    </HokSearchForm>
    <MPageLayout
      ref="billTableRef"
      type="tablePage"
      class="bill-table"
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
      <template slot="status" slot-scope="scope">
        {{
          scope.row.status
            | rowOptionsFt(formOpts.optionsObj.billStatus, 'code', 'message')
        }}
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
      <template slot="totalAmount" slot-scope="scope">
        <p>{{ scope.row.totalAmount | priceFt }}</p>
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
      <template slot="action" slot-scope="scope">
        <el-button
          class="ptb0"
          v-if="scope.row.status === 4"
          type="text"
          @click="
            goDetailsPage('BillingCenterDetails', {
              billNo: scope.row.billNo,
              type: 'confirm'
            })
          "
        >
          去确认
        </el-button>
        <el-button
          v-if="scope.row.status === 2"
          class="ptb0"
          type="text"
          @click="
            goDetailsPage('BillingCenterDetails', {
              billNo: scope.row.billNo,
              type: 'settlement'
            })
          "
        >
          去结算
        </el-button>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import Decimal from 'decimal.js'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { copy } from '@/utils'

import { billingsettlementOpts } from '../../../data.js'
import {
  listOrganizationByParamApi,
  getProtocolTenantIdsApi,
  pageBillListApi,
  billStatusApi
} from '@/api/orgSettlement/billingCenter.js'

export default {
  components: { HokSearchForm },
  filters: {
    rowOptionsFt(value, Arr, key = 'value', label = 'label') {
      for (const item of Arr) {
        if (value === item[key]) return item[label]
      }
      return value
    },
    priceFt(number) {
      if (typeof number !== 'number') return '--'
      if (number < 0) number = 0
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
    }
  },
  data() {
    return {
      formOpts: {
        ...deepClone(billingsettlementOpts.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          { label: '重置', type: 'plain', fn: this.clearFn }
        ]
      },
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: deepClone(billingsettlementOpts.table)
      },
      totalConfig: {
        tableData: [
          {
            settledAmount: 10000000,
            totalAmount: 100000,
            unsettledAmount: 100000
          }
        ],
        columns: billingsettlementOpts.totalTable
      }
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
        ...(biilData || []).filter(f => [2, 4].includes(f.code))
      ]
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = {
          ...this.formOpts.formData,
          billStatusList: this.formOpts.formData.billStatus
            ? [this.formOpts.formData.billStatus]
            : [2, 4],
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        }
        delete req.billStatus
        const { data } = await pageBillListApi(req)
        if (!data) return
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$nextTick(() => {
          this.$refs.billTableRef.doLayout()
        })
      } catch (error) {
        console.log('error------pageBillListApi', error)
      }
      this.loading = false
    },
    searchFn() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    clearFn() {
      this.formOpts.ref.resetFields()
      this.formOpts.formData = billingsettlementOpts.form.formData
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
    goDetailsPage(routerName, query = {}) {
      this.$router.push({
        name: routerName,
        query: {
          prevPath: this.$route.path + '?active=settlement',
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
  .pd20 {
    padding: 20px 20px 0 20px;
  }
  .ptb0 {
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep .bill-table {
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
      text-align: center;
    }
    .cell {
      font-weight: 500;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
    th.el-table__cell > .cell {
      font-weight: 600;
      color: #5c6387;
      font-size: 16px;
      justify-content: center;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
