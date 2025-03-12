<template>
  <div class="operation-table">
    <div class="title">协议操作日志</div>
    <MPageLayout
      ref="protocolDetailsRef"
      type="tablePage"
      class="protocol-details-table"
      :slot-arr="config.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      max-height="325px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { pageOperationLogListApi } from '@/api/coOpProtocol'
import { detailsTableJson } from '../../../coOpProtocol/data'
export default {
  data() {
    return {
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: detailsTableJson.columns,
        slotArr: detailsTableJson.slotArr
      }
    }
  },
  mounted() {
    this.getTableInfo()
  },
  methods: {
    async getTableInfo() {
      this.loading = true
      try {
        const { data } = await pageOperationLogListApi({
          agreementId: this.$route.query.id,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        //  data.items ||
        this.$set(this.config, 'tableData', data.items)
        this.$set(this.config, 'total', data.total)
      } catch (error) {
        console.log('error------pageOperationLogListApi', error)
      }
      this.loading = false
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
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
.operation-table {
  height: 300px;
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
  }
  .protocol-details-table {
    margin: 0 -20px;
  }
}
::v-deep .el-table {
  th.el-table__cell > .cell {
    font-weight: 600;
  }
  .cell {
    font-weight: 500;
    font-size: 14px;
    color: #333;
  }
  .el-button + .el-button {
    margin-left: 20px;
  }
}
</style>
