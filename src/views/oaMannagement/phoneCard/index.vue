<template>
  <div class="phone-card-container">
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
      checkbox
      reserve-selection
      row-key="cardId"
      layout="total, sizes, prev, pager, next, jumper"
      :selectable="handleSelectable"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @handleSelectionAllChange="handleSelectionAllChange"
    >
      <template slot="search">
        <FormSearch
          ref="tableSearch"
          @search="handleSearch"
          @clearSelectList="handleClearSelectList"
        />
      </template>
      <div
        slot="headerRight"
        class="flex flex-between items-end"
        style="width: 100%"
      >
        <div>
          <el-button
            size="small"
            type="primary"
            :disabled="
              selectList.length === 0 || selectList.length > maxSelectNum
            "
            @click="sendNotice"
            >发送确认通知</el-button
          >
          <el-tooltip
            :disabled="isAllSameState"
            content="仅支持对同一使用状态进行批量修改"
            placement="top"
          >
            <el-button
              size="small"
              type="primary"
              :disabled="
                selectList.length === 0 ||
                selectList.length > maxSelectNum ||
                !isAllSameState
              "
              @click="handleCardBatchUpdateState"
              >批量修改状态</el-button
            >
          </el-tooltip>
          <el-button
            size="small"
            type="primary"
            :disabled="
              selectList.length === 0 || selectList.length > maxSelectNum
            "
            @click="handleCardBatchAllot"
            >批量调拨</el-button
          >
        </div>
        <div>
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button slot="reference" type="text" size="small">
              <div style="display: flex">
                <img :src="iconShezhi" style="height: 14px; width: 14px" />
                <span class="f_s_14">&nbsp;自定义表头</span>
              </div>
            </el-button>
            <el-checkbox
              v-model="allColumnsSelected"
              :disabled="allColumnsSelected"
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in config.tableColumns.filter(item => !item.disable)"
              :key="item.label"
              v-model="item.visible"
              :disabled="item.disable"
              @change="handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
          <el-button size="small" type="text" class="m-l-20" @click="clear()"
            ><span class="f_s_14">重置表头</span></el-button
          >
          <el-button
            size="small"
            icon="el-icon-download"
            class="btn_primary m-l-20"
            :loading="exportLoading"
            @click="handleClickExportExcel"
            >导出</el-button
          >
          <el-button
            size="small"
            icon="el-icon-upload2"
            class="btn_primary"
            @click="visibleDialogImportExcel = true"
            >导入</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="visibleDialogAddCard = true"
            >新增</el-button
          >
        </div>
      </div>
      <!-- <div slot="userStatus" slot-scope="{ row }">
        <el-popover>
          <div slot="reference"><span>良好</span><i class="el-icon-edit" /></div>
          <el-radio-group style="width:120px">
            <el-radio v-for="item in userStatus" :key="item.value" style="margin-bottom:10px;" :label="3" @click="handleClickRow(row,item)">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-popover>
      </div> -->
      <template slot="communicationCompany" slot-scope="{ row }">
        <span>{{
          row.communicationCompany | getOptionsValue(communicationCompanyList)
        }}</span>
      </template>
      <template slot="weMediaAccountNumber" slot-scope="{ row }">
        <div
          class="cursor-pointer c_0F71FF"
          @click.stop="handleToMediaAccountNumber(row)"
        >
          <span>{{ row.weMediaAccountNumber }}</span>
        </div>
      </template>
      <!-- <div slot="state" slot-scope="{ row }">
        <div class="cursor-pointer" @click="handleClickUserStatusRow(row)">
          <span>{{ row.state | getOptionsValue(stateList) }}</span><i class="el-icon-edit" />
        </div>
      </div> -->
      <template slot="cityName" slot-scope="{ row }">
        <span v-if="row.provinceName">
          {{ row.provinceName }} / {{ row.cityName }}</span
        >
      </template>
      <template slot="state" slot-scope="{ row }">
        <div
          class="cursor-pointer userStatus"
          @click.stop="handleClickUserStatusRow(row)"
        >
          <p :class="`userStatus${row.state}`" />
          &nbsp;<span>{{ row.state | getOptionsValue(stateList) }}</span
          >&nbsp;<i class="el-icon-edit" />
        </div>
      </template>
      <div slot="action" slot-scope="{ row }">
        <el-button-group>
          <el-button
            v-for="item in actionButtons"
            :key="item.value"
            type="text"
            class="m-r-16"
            @click="handleClickRow(row, item)"
            >{{ item.label }}</el-button
          >
        </el-button-group>
      </div>
    </MPageLayout>
    <dialog-edit-user-status
      :row="curFormRow"
      :select-list="selectList"
      :visible.sync="visibleDialogEditUserStatus"
      @success="closeStateDialog"
    />
    <dialog-add-card
      :visible.sync="visibleDialogAddCard"
      @success="closeAddDialog"
    />
    <dialog-edit-card
      :visible.sync="visibleDialogEditCard"
      :form="curFormRow"
      @success="closeEditDialog"
    />
    <dialog-import-excel
      :visible.sync="visibleDialogImportExcel"
      @success="handleSearch"
    />
    <dialog-allot-card
      :visible.sync="visibleDialogAllotCard"
      :row="curFormRow"
      :select-list="selectList"
      @success="closeAllotDialog"
    />
  </div>
</template>
<script>
import DialogAddCard from './components/Dialog/AddCard.vue'
import DialogEditCard from './components/Dialog/EditCard.vue'
import DialogImportExcel from './components/Dialog/ImportExcel.vue'
import FormSearch from './components/FormSearch'
// import { tableData } from './mock'
import DialogEditUserStatus from './components/Dialog/EditUserStatus.vue'
import { getTableColumns } from './tableColumns'
import { cardPageList, cardExport, batchConfirm } from '../api/card.js'
import { stateList, communicationCompanyList } from './constants'
import DialogAllotCard from './components/Dialog/AllotCard.vue'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
export default {
  components: {
    FormSearch,
    DialogAddCard,
    DialogEditCard,
    DialogImportExcel,
    DialogEditUserStatus,
    DialogAllotCard
  },
  data() {
    return {
      selectList: [],
      iconShezhi,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'state',
        'weMediaAccountNumber',
        'communicationCompany',
        'cityName',
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
        { label: '修改', value: 1 },
        { label: '调拨', value: 0 },
        { label: '记录', value: 2 }
      ],
      visibleDialogAddCard: false,
      visibleDialogEditCard: false,
      visibleDialogImportExcel: false,
      visibleDialogEditUserStatus: false,
      visibleDialogAllotCard: false,
      stateList,
      communicationCompanyList,
      curFormRow: {}, // 当前选择行
      exportLoading: false,
      search: {},
      searchKey: '/oaManagement/oaMannagementIndex?tab=phoneCard',
      maxSelectNum: 50
    }
  },
  computed: {
    isAllSameState() {
      if (this.selectList.length === 0) return true
      const firstState = this.selectList[0].state
      return this.selectList.every(item => {
        return item.state === firstState
      })
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_phoneCard_page')
    // 获取search缓存 数据
    const initSearchData = this.$getPageCustomSearch(this.searchKey)
    if (initSearchData) {
      this.$refs.tableSearch?.setSearchForm({ ...initSearchData })
    }
    this.handleSearch()
  },
  created() {
    const tableColumns = localStorage.getItem('oaMannagement_phoneCardTable')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
  },
  methods: {
    sendNotice() {
      this.$confirm('是否向所选员工发送确认通知？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$uweb?.setAction('Event_oa_phoneCard_batchConfirm')
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
      this.clearSelection()
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
      this.curFormRow.occupantDate = this.curFormRow.occupantDate
        ? new Date(this.curFormRow.occupantDate)
        : undefined
      if (btn.value === 1) {
        this.visibleDialogEditCard = true
      } else if (btn.value === 2) {
        this.$router.push({
          name: 'PhoneCardChangeRecords',
          query: {
            cardId: this.curFormRow.cardId
          }
        })
      } else if (btn.value === 3) {
        this.visibleDialogMoreDeital = true
      } else if (btn.value === 0) {
        this.visibleDialogAllotCard = true
      }
    },
    queryCardPageList() {
      this.search = this.$refs.tableSearch?.getSearchForm() || {}
      this.$setPageCustomSearch({ ...this.search }, this.searchKey)
      if (this.search?.state === '') {
        this.search.state = undefined
      }
      const params = {
        ...this.search,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      this.loading = true
      cardPageList(params)
        .then(res => {
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
            // 刷新表格 防止对不齐
            this.$nextTick(() => {
              this.$refs.MPageLayout?.doLayout()
              this.setSelection()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClickExportExcel() {
      this.$uweb?.setAction('Event_oa_phoneCard_export')
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
      if (row.length === this.maxSelectNum) {
        this.$message.warning(`最多批量操作${this.maxSelectNum}个资产`)
      }
      if (row.length > this.maxSelectNum) {
        return
      }
      this.selectList = row
    },
    // 设置选中项
    setSelection() {
      this.selectList = [
        ...(this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs
          ?.myTable?.selection || [])
      ]
    },
    // 改变选中状态
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs?.myTable?.toggleRowSelection(
            row,
            false
          )
        })
      } else {
        this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs?.myTable?.clearSelection()
      }
    },
    handleClickUserStatusRow(row) {
      this.curFormRow = row
      this.visibleDialogEditUserStatus = true
    },
    // 关闭编辑弹窗
    closeEditDialog() {
      this.visibleDialogEditCard = false
      this.$refs.tableSearch?.querySelectCity()
      this.queryCardPageList()
    },
    closeAddDialog() {
      this.visibleDialogAddCard = false
      this.queryCardPageList()
    },
    closeAllotDialog() {
      this.visibleDialogAllotCard = false
      this.queryCardPageList()
    },
    closeStateDialog() {
      this.visibleDialogEditUserStatus = false
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
    },
    handleCardBatchUpdateState() {
      // 重置curFormRow，区分批量和单个
      this.curFormRow = {}
      this.visibleDialogEditUserStatus = true
    },
    handleCardBatchAllot() {
      // 重置curFormRow，区分批量和单个
      this.curFormRow = {}
      this.visibleDialogAllotCard = true
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs?.MPageLayout?.clearSelection()
      })
    },
    handleClearSelectList() {
      this.clearSelection()
    },
    handleSelectionAllChange(rows) {
      const tabRef =
        this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs
          ?.myTable
      const allSelectResult = tabRef.store.states.isAllSelected
      const selectList = [...this.selectList]
      // allSelectResult=true表示未全选状态点击后变为全选
      // 全选且总数大于允许值
      // 全选清空,保留原来的勾选状态,原来勾选数据重新勾选为选中
      if (rows.length > this.maxSelectNum && allSelectResult) {
        // this.$message.warning(`最多批量操作${this.maxSelectNum}个资产`)
        const selectedIds = selectList.map(e => e.cardId)
        this.$nextTick(() => {
          this.config.tableData.forEach(row => {
            if (selectedIds.includes(row.cardId)) {
              tabRef.toggleRowSelection(row, true)
            } else {
              tabRef.toggleRowSelection(row, false)
            }
          })
        })
      }
    },
    // 禁止选中项
    handleSelectable(row) {
      // 设置checkbox，选中状态，是否可选
      const check = this.selectList.find(v => {
        return v.cardId === row.cardId
      })
      if (!check && this.selectList.length >= this.maxSelectNum) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.phone-card-container {
  @include responsive-height(115px);
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
