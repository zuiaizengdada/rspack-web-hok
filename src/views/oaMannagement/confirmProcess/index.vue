<template>
  <div class="confirmProcess-container">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      table-index-width="62px"
      class="phoneCardTable"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      if-index
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <FormSearch ref="tableSearch" @search="handleSearch" />
      </template>

      <template slot="assetType" slot-scope="{ row }">
        <span>{{ row.assetType | getOptionsValue(assetTypeOption) }}</span>
      </template>
      <template slot="createTime" slot-scope="{ row }">
        <span>{{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template slot="confirmStatus" slot-scope="{ row }">
        <span>{{
          row.confirmStatus | getOptionsValue(confirmStatusOption)
        }}</span>
      </template>
      <div slot="action" slot-scope="{ row }">
        <el-button-group>
          <template v-for="item in actionButtons">
            <el-button
              v-if="item.show(row)"
              :key="item.value"
              type="text"
              class="m-r-16"
              @click="handleClickRow(row, item)"
              >{{ item.label }}</el-button
            >
          </template>
        </el-button-group>
      </div>
    </MPageLayout>
    <dialog-revoke
      :visible.sync="visibleDialogRevoke"
      :row="curFormRow"
      @success="closeRevokeDialog"
    />
  </div>
</template>
<script>
import FormSearch from './components/FormSearch'
// import { tableData } from './mock'
import { getTableColumns } from './tableColumns'
import { cardExport, batchConfirm } from '../api/card.js'
import { confirmProcessPageListAjax } from '../api/confirmProcess.js'
import DialogRevoke from './components/Dialog/revoke.vue'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import moment from 'moment'
import { assetTypeOption, confirmStatusOption } from './constants'

export default {
  components: {
    FormSearch,
    DialogRevoke
  },
  data() {
    return {
      selectList: [],
      iconShezhi,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'assetType',
        'createTime',
        'confirmStatus',
        'action',
        'headerRight',
        'search',
        'footer'
      ],
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: getTableColumns.call(this)
      },
      actionButtons: [
        {
          label: '撤销',
          value: 1,
          show: row => {
            return [1, 2].includes(row.confirmStatus)
          }
        },
        {
          label: '更多详情',
          value: 2,
          show: () => {
            return true
          }
        }
      ],
      visibleDialogAddCard: false,
      visibleDialogEditCard: false,
      visibleDialogImportExcel: false,
      visibleDialogEditUserStatus: false,
      visibleDialogAllotCard: false,
      curFormRow: {}, // 当前选择行
      exportLoading: false,
      search: {},
      visibleDialogRevoke: false,
      assetTypeOption,
      confirmStatusOption,
      searchKey: '/oaManagement/oaMannagementIndex?tab=confirmProcess'
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_confirmProcess_page')
    // 获取search缓存 数据
    const initSearchData = this.$getPageCustomSearch(this.searchKey)
    if (initSearchData) {
      this.$refs.tableSearch?.setSearchForm({ ...initSearchData })
    }
    this.handleSearch()
  },
  created() {},
  methods: {
    moment,
    sendNotice() {
      this.$confirm('是否向所选员工发送确认通知？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await batchConfirm(this.selectList.map(v => v.cardId))
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
        this.$refs.MPageLayout.clearSelection()
      })
    },
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.queryCardPageList()
    },
    // 表头选择全部
    handleCheckAllChange() {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_phoneCardTable',
        JSON.stringify(this.config.tableColumns)
      )
    },
    handleClickRow(row, btn) {
      this.curFormRow = JSON.parse(JSON.stringify(row))
      if (btn.value === 1) {
        this.visibleDialogRevoke = true
      } else if (btn.value === 2) {
        this.$router.push({
          name: 'ConfirmProcessRecords',
          query: {
            statId: this.curFormRow.id,
            assetType: this.curFormRow.assetType
          }
        })
      }
    },
    queryCardPageList() {
      this.search = this.$refs.tableSearch?.getSearchForm() || {}
      this.$setPageCustomSearch({ ...this.search }, this.searchKey)
      if (this.search.createStartTime) {
        this.search.createStartTime = moment(this.search.createStartTime)
          .startOf('day')
          .valueOf()
      }
      if (this.search.createEndTime) {
        this.search.createEndTime = moment(this.search.createEndTime)
          .endOf('day')
          .valueOf()
      }
      const params = {
        ...this.search,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      delete params.createTime
      this.loading = true
      confirmProcessPageListAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
            // 刷新表格 防止对不齐
            this.$nextTick(() => {
              this.$refs.MPageLayout?.doLayout()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClickExportExcel() {
      this.exportLoading = true
      const params = this.$refs.tableSearch?.getSearchForm()
      cardExport(params)
        .then(res => {
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.queryCardPageList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.queryCardPageList()
    },
    handleSelectionChange(row) {
      this.selectList = row
    },
    handleClickUserStatusRow(row) {
      this.curFormRow = row
      this.visibleDialogEditUserStatus = true
    },
    closeRevokeDialog() {
      this.visibleDialogRevoke = false
      this.queryCardPageList()
    },
    // 跳转自媒体账号
    handleToMediaAccountNumber(row) {
      const accountForm = {
        phone: row.phoneNumber
      }
      // 设置查询参数
      localStorage.setItem(
        'accountManage_searchData',
        JSON.stringify(accountForm)
      )
      this.$router.push('/videoManagement/accountManage')
    },
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_phoneCardTable',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置表头按钮
    clear() {
      const tableColumns = getTableColumns.call(this)
      this.config.tableColumns = tableColumns
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_phoneCardTable',
        JSON.stringify(tableColumns)
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.confirmProcess-container {
  height: calc(100vh - 185px);
}
.phoneCardTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
::v-deep .tablePage .page_header .page_header_action {
  > div {
    width: 100%;
  }
  justify-content: flex-end;
}
.userStatus {
  display: flex;
  align-items: center;
  > p {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .userStatus0 {
    background-color: #00b42a;
  }
  .userStatus1,
  .userStatus2 {
    background-color: #ff9733;
  }
  .userStatus3 {
    background-color: #dde1e6;
  }
}
</style>
