<template>
  <div class="fixed-assets-container">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      class="assetsTable"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      reserve-selection
      table-index-width="62px"
      if-index
      row-key="assetId"
      :row-class-name="tableRowClassName"
      checkbox
      layout="total, sizes, prev, pager, next, jumper"
      :selectable="handleSelectable"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @handleSelectionAllChange="handleSelectionAllChange"
    >
      <template slot="search">
        <form-search
          ref="tableSearch"
          @query="handleSearch"
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
              @click="handleAssetBatchUpdateState"
              >批量修改状态</el-button
            >
          </el-tooltip>
          <el-button
            size="small"
            type="primary"
            :disabled="batchAllotDisable"
            @click="handleAssetBatchAllot"
            >批量调拨</el-button
          >
        </div>
        <div>
          <el-popover placement="bottom-end" width="168" trigger="click">
            <el-button slot="reference" type="text" size="small">
              <div style="display: flex">
                <img :src="iconShezhi" style="height: 14px; width: 14px" />
                <span class="f_s_14">&nbsp;自定义表头</span>
              </div></el-button
            >
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
            type="primary"
            class="btn_primary m-l-20"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="exportExcel()"
            >导出</el-button
          >
          <el-button
            size="small"
            type="primary"
            class="btn_primary"
            icon="el-icon-upload2"
            @click="importExcel()"
            >导入</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="visibleDialogAddAssets = true"
            >新增</el-button
          >
        </div>
      </div>
      <template slot="assetCode" slot-scope="{ row }">
        <el-popover
          placement="top-start"
          title="原资产编号"
          width="180"
          trigger="click"
          :disabled="!hasValue(row.originalAssetCode)"
          :content="row.originalAssetCode"
        >
          <div
            slot="reference"
            :title="row.assetCode"
            :class="{
              text_hidden: true,
              c_0C6FFF: hasValue(row.originalAssetCode),
              cursorPoninter: hasValue(row.originalAssetCode)
            }"
          >
            {{ row.assetCode }}
          </div>
        </el-popover>
      </template>
      <template slot="state" slot-scope="{ row }">
        <div
          class="cursor-pointer userStatus"
          @click.stop="handleClickUserStatusRow(row)"
        >
          <p :class="`userStatus${row.state}`" />
          &nbsp;<span>{{ row.state | getOptionsValue(userStatus) }}</span
          >&nbsp;<i class="el-icon-edit" />
        </div>
      </template>
      <template slot="cityName" slot-scope="{ row }">
        <span v-if="row.provinceName">
          {{ row.provinceName }} / {{ row.cityName }}</span
        >
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button-group>
          <el-button
            type="text"
            class="m-r-16"
            @click="handleClickRow(row, { value: 1 })"
            >修改</el-button
          >
          <el-button
            v-if="[1, 2, 4].includes(row.state)"
            type="text"
            class="m-r-16"
            @click="handleClickRow(row, { value: 0 })"
            >调拨</el-button
          >
          <el-button
            v-for="item in actionButtons"
            :key="item.value"
            type="text"
            class="m-r-16"
            @click="handleClickRow(row, item)"
            >{{ item.label }}</el-button
          >
        </el-button-group>
      </template>
    </MPageLayout>
    <dialog-add-assets
      :visible.sync="visibleDialogAddAssets"
      @success="closeAddDialog"
    />
    <dialog-edit-assets
      :form="curFormRow"
      :visible.sync="visibleDialogEditAssets"
      @success="closeEditDialog"
    />
    <drawer-more-detail
      :visible.sync="visibleDrawerMoreDeital"
      :form="curFormRow"
      @close="currentIndex = undefined"
    />
    <dialog-log-change :visible.sync="visibleDialogLogChange" />
    <dialog-allot-assets
      :visible.sync="visibleDialogAllotAssets"
      :row="curFormRow"
      :select-list="selectList"
      @success="closeAllotDialog"
    />
    <dialog-edit-user-status
      :row="curFormRow"
      :select-list="selectList"
      :visible.sync="visibleDialogEditUserStatus"
      @success="closeStateDialog"
    />
    <dialog-import-excel
      :visible.sync="visibleDialogImportExcel"
      @success="handleSearch"
    />
  </div>
</template>
<script>
import FormSearch from './components/FormSearch/index.vue'
import DialogAddAssets from './components/Dialog/AddAssets.vue'
import DialogEditAssets from './components/Dialog/EditAssets.vue'
import DrawerMoreDetail from './components/Drawer/MoreDetail.vue'
import DialogLogChange from './components/Dialog/LogChange.vue'
import DialogAllotAssets from './components/Dialog/AllotAssets.vue'
import DialogEditUserStatus from './components/Dialog/EditUserStatus.vue'
import DialogImportExcel from './components/Dialog/ImportExcel.vue'
import { getTableColumns } from './tableColumns'
import { userStatus } from './constants'
import { assetPageList, assetExport, batchConfirm } from '../api/assets.js'
import { hasValue } from '@/utils/index'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'

export default {
  components: {
    FormSearch,
    DialogAddAssets,
    DialogEditAssets,
    DrawerMoreDetail,
    DialogLogChange,
    DialogAllotAssets,
    DialogEditUserStatus,
    DialogImportExcel
  },
  data() {
    return {
      selectList: [],
      iconShezhi,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: getTableColumns.call(this)
        // tableColumns: JSON.parse(JSON.stringify(tableColumns))
      },
      actionButtons: [
        //  { label: '调拨', value: 0 }
        // { label: '修改', value: 1 },
        { label: '记录', value: 2 },
        { label: '更多详情', value: 3 }
      ],
      slotArr: [
        'state',
        'action',
        'headerRight',
        'footer',
        'search',
        'assetCode',
        'cityName'
      ],
      userStatus,
      visibleDialogAddAssets: false,
      visibleDialogEditAssets: false,
      visibleDrawerMoreDeital: false,
      visibleDialogLogChange: false,
      visibleDialogAllotAssets: false,
      visibleDialogEditUserStatus: false,
      visibleDialogImportExcel: false,
      curFormRow: {},
      exportLoading: false,
      search: {},
      hasValue,
      currentIndex: undefined, // 当前选择行
      searchKey: '/oaManagement/oaMannagementIndex?tab=fixedAssets',
      maxSelectNum: 50
    }
  },
  computed: {
    batchAllotDisable() {
      return (
        this.selectList.length === 0 ||
        this.selectList.length > this.maxSelectNum ||
        this.selectList.some(item => [3, 5, 6, 7].includes(item.state))
      )
    },
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
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   this.$nextTick(() => {
    //     this.$refs.MPageLayout?.doLayout()
    //   })
    //   localStorage.setItem('oaMannagement_fixedAssetsTable', JSON.stringify(this.config.tableColumns))
    // })
    this.$uweb?.setAction('Event_oa_fixedAsset_page')
    // 获取search缓存 数据
    const initSearchData = this.$getPageCustomSearch(this.searchKey)
    if (initSearchData) {
      this.$refs.tableSearch?.setSearchForm({ ...initSearchData })
    }
    this.handleSearch()
  },
  created() {
    const tableColumns = localStorage.getItem('oaMannagement_fixedAssetsTable')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.clearSelection()
      this.queryFixedAssetsList()
    },
    handleClearSelectList() {
      this.clearSelection()
    },
    clearSelection() {
      this.$nextTick(() => {
        this.$refs?.MPageLayout?.clearSelection()
      })
    },
    // 发送通知
    sendNotice() {
      this.$confirm('是否向所选员工发送确认通知?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$uweb?.setAction('Event_oa_fixedAsset_batchConfirm')
        await batchConfirm(this.selectList.map(v => v.assetId))
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
        this.$refs.MPageLayout.clearSelection()
      })
    },
    queryFixedAssetsList() {
      // const isFormSearch = form !== undefined
      // console.log(isFormSearch, '是否为参数查询')
      // if (isFormSearch) {
      //   this.config.pageSize = 10
      //   this.config.currentPage = 1
      // }
      this.search = this.$refs.tableSearch?.getSearchForm() || {}
      this.$setPageCustomSearch({ ...this.search }, this.searchKey)
      if (this.search?.state === '') {
        this.search.state = undefined
      }
      const params = {
        ...this.search,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      console.log(params, '查询参数')
      this.loading = true
      assetPageList(params)
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
    // 表头选择全部
    handleCheckAllChange() {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_fixedAssetsTable',
        JSON.stringify(this.config.tableColumns)
      )
    },
    handleClickUserStatusRow(row) {
      this.curFormRow = JSON.parse(JSON.stringify(row))
      this.visibleDialogEditUserStatus = true
    },
    handleClickRow(row, btn) {
      this.curFormRow = JSON.parse(JSON.stringify(row))
      this.curFormRow.purchaseDate = new Date(this.curFormRow.purchaseDate)
      if (btn.value === 1) {
        this.visibleDialogEditAssets = true
      } else if (btn.value === 2) {
        this.$router.push({
          name: 'AssetChangeRecords',
          query: {
            assetId: this.curFormRow.assetId
          }
        })
      } else if (btn.value === 3) {
        this.currentIndex = row.assetId
        this.visibleDrawerMoreDeital = true
      } else if (btn.value === 0) {
        this.visibleDialogAllotAssets = true
      }
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.queryFixedAssetsList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.queryFixedAssetsList()
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
        const selectedIds = selectList.map(e => e.assetId)
        this.$nextTick(() => {
          this.config.tableData.forEach(row => {
            if (selectedIds.includes(row.assetId)) {
              tabRef.toggleRowSelection(row, true)
            } else {
              tabRef.toggleRowSelection(row, false)
            }
          })
        })
      }
    },
    // 设置选中项
    setSelection() {
      this.selectList = [
        ...(this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs
          ?.myTable?.selection || [])
      ]
    },
    // 禁止选中项
    handleSelectable(row) {
      // 设置checkbox，选中状态，是否可选
      const check = this.selectList.find(v => {
        return v.assetId === row.assetId
      })
      if (!check && this.selectList.length >= this.maxSelectNum) {
        return false
      } else {
        return true
      }
    },
    importExcel() {
      this.visibleDialogImportExcel = true
    },
    exportExcel() {
      this.$uweb?.setAction('Event_oa_fixedAsset_export')
      this.exportLoading = true
      const params = this.$refs.tableSearch?.getSearchForm()
      assetExport(params)
        .then(res => {
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 关闭新增弹窗
    closeAddDialog() {
      this.visibleDialogAddAssets = false
      this.$refs.tableSearch?.querySelectCity()
      this.queryFixedAssetsList()
    },
    // 关闭编辑弹窗
    closeEditDialog() {
      this.visibleDialogEditAssets = false
      this.$refs.tableSearch?.querySelectCity()
      this.queryFixedAssetsList()
    },
    // 关闭调拨弹窗
    closeAllotDialog() {
      this.visibleDialogAllotAssets = false
      this.queryFixedAssetsList()
    },
    closeStateDialog() {
      this.visibleDialogEditUserStatus = false
      this.queryFixedAssetsList()
    },
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_fixedAssetsTable',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置表头按钮
    clear() {
      // this.config.tableColumns = JSON.parse(JSON.stringify(tableColumns))
      const tableColumns = getTableColumns.call(this)
      this.config.tableColumns = tableColumns
      this.$nextTick(() => {
        this.$refs.MPageLayout?.doLayout()
      })
      localStorage.setItem(
        'oaMannagement_fixedAssetsTable',
        JSON.stringify(tableColumns)
      )
    },
    // 当前行添加class
    tableRowClassName({ row, rowIndex }) {
      if (row.assetId === this.currentIndex) {
        return 'highlight-row'
      }
      return ''
    },
    handleAssetBatchUpdateState() {
      // 重置curFormRow，区分批量和单个
      this.curFormRow = {}
      this.visibleDialogEditUserStatus = true
    },
    handleAssetBatchAllot() {
      // 重置curFormRow，区分批量和单个
      this.curFormRow = {}
      this.visibleDialogAllotAssets = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.fixed-assets-container {
  @include responsive-height(115px);
  min-height: 200px;
}
.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
::v-deep .tablePage .page_header .page_header_action {
  > div {
    width: 100%;
  }
  justify-content: flex-end;
}
::v-deep .highlight-row {
  background-color: #e8f0fc;
}
.userStatus {
  display: flex;
  align-items: center;
  > p {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .userStatus1 {
    background-color: #00b42a;
  }
  .userStatus2,
  .userStatus6 {
    background-color: #ff9733;
  }
  .userStatus3,
  .userStatus5,
  .userStatus4 {
    background-color: #ed1b24;
  }
  .userStatus7 {
    background-color: #dde1e6;
  }
}
</style>
