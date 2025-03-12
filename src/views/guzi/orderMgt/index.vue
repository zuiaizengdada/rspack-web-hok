<template>
  <div class="bill-fees-home">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #shareUserId><el-autocomplete
        v-model="formOpts.formData.shareUserName"
        style="width: 100%"
        :maxlength="100"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入名称后选择"
        @select="handleSelect"
      />
      </template>
      <template #user>
        <div class="flex">
          <m-select
            v-model="formOpts.formData.user"
            class="two-min-select"
            placeholder="请选择"
            :dict-list="formOpts.optionsObj.useOption"
          /><el-autocomplete
            v-model="formOpts.formData.userValue"
            style="width: 600px"
            :maxlength="100"
            :fetch-suggestions="querySearchAsync1"
            placeholder="请输入后选择"
            @select="handleSelect1"
          />
        </div>
      </template>
    </HokSearchForm>

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
      <template slot="orderNo" slot-scope="scope">
        <p>
          {{ scope.row.orderNo }}
          <i
            class="el-icon-document-copy icon-copy"
            @click="copyBtn(scope.row.orderNo)"
          />
        </p>
      </template>
      <template slot="payerTotal" slot-scope="scope">
        <span>￥{{ getPricePair(scope.row.payerTotal) }}</span>
      </template>
      <template v-if="scope.row.status" slot="status" slot-scope="scope">
        <span>{{ scope.row.status ===1 ? '未支付' :'已支付' }}</span>
      </template>
      <template slot="shareUser" slot-scope="scope">
        <div v-if="scope.row.shareUser">
          {{ scope.row.shareUser.userName }}
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          class="ptb0"
          type="text"
          @click="
            handleViewDetail(scope.row)
          "
        >
          详情
        </el-button>
      </template>
    </MPageLayout>
    <AppDialog
      v-model="dialogModel.visible"
      title="订单详情"
      width="800px"
      height="80%"
      :btn-footer="false"
      :loading="dialogModel.loading"
    >
      <Detail
        v-if="dialogModel.visible"
        ref="Detail"
        :order-no="dialogModel.orderNo"
      />
    </appdialog></div>
</template>

<script>
import moment from 'moment'
import AppDialog from '@/components/AppDialog'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { deepClone } from '@/utils/FormGenerator/index'
import { copy } from '@/utils'

import { feesOpts } from './components/columns.js'
import Detail from './components/detail.vue'
import {
  guziOrderList, queryByAccountOrNames
} from '@/api/guzi/order.js'
export default {
  components: { HokSearchForm, AppDialog, Detail },
  data() {
    return {
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
      billAmountLoading: false,
      dialogModel: {
        visible: false,
        loading: false,
        row: {}
      }
    }
  },

  created() {
    this.initPage()
    this.getTableInfo()
  },
  methods: {

    async querySearchAsync1(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results)
      } else {
        const params = {
          pageIndex: 1,
          pageSize: 20,
          name: this.formOpts.formData.userValue
        }
        const findResultse = await queryByAccountOrNames(params)
        if (findResultse.code === 1) {
          var result = findResultse.data.items
          // 循环放到一个远程搜索需要的数组
          result.map(v => {
            results.push({
              value: v.name,
              id: v.platformUserId
            })
          })
          cb(results)
        } else {
          results = []
          cb(results)
        }
      }
    },
    async querySearchAsync(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results)
      } else {
        const params = {
          pageIndex: 1,
          pageSize: 20,
          name: this.formOpts.formData.shareUserName
        }
        const findResultse = await queryByAccountOrNames(params)
        if (findResultse.code === 1) {
          var result = findResultse.data.items
          // 循环放到一个远程搜索需要的数组
          result.map(v => {
            results.push({
              value: v.name,
              id: v.platformUserId
            })
          })
          cb(results)
        } else {
          results = []
          cb(results)
        }
      }
    },
    handleSelect(item) {
      this.formOpts.formData.shareUserId = item.id
    },
    handleSelect1(item) {
      this.formOpts.formData.userId = item.id
    },
    getPricePair(price) {
      if (price === null || price === undefined) {
        return ''
      }
      const pricePair = (+price / 100).toFixed(2).split('.')
      const decimal = `.${pricePair[1]}`
      return pricePair[0] + decimal
    },
    async initPage() {
      this.formOpts = {
        ...deepClone(feesOpts.form),
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
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.formMat()
        const { data } = await guziOrderList({
          ...req,
          pageSize: this.config.pageSize,
          pageNo: this.config.currentPage
        })
        if (!data) return
        // this.config.tableData = data.records
        // this.config.total = data.total
        this.$set(this.config, 'tableData', data.records || [])
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
      delete req.user
      delete req.userValue
      if (
        this.formOpts.formData.time &&
        this.formOpts.formData.time[0] &&
        this.formOpts.formData.time[1]
      ) {
        req.payStartTime = moment(this.formOpts.formData.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        req.payEndTime = moment(this.formOpts.formData.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
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
    handleViewDetail({ orderNo }) {
      this.dialogModel = {
        visible: true,
        loading: false,
        orderNo
      }
    }
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
