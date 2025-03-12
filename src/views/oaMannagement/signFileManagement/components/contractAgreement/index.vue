<template>
  <MCard class="resume-list">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      row-key="id"
      reserve-selection
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop
          :search="search"
          style="margin-bottom: 5px"
          @onSearch="onSearchFn"
          @onClear="onClear"
        />
      </template>
      <template slot-scope="{ row }" slot="fileName">
        <div
          :title="`${row.fileName}`"
          class="cursor-pointer c_0F71FF"
          @click.stop="handlefileNameClick(row)"
        >
          {{
            row.fileName.length > 10
              ? `${row.fileName.slice(0, 10)}...`
              : row.fileName.slice(0, 10)
          }}
        </div>
      </template>
      <template slot="companyList" slot-scope="{ row }">
        {{ row.companyList && row.companyList[0] }}
      </template>
      <template slot="deptChainNameList" slot-scope="{ row }">
        <div :title="renderDeptChainNameList(row)">
          {{
            renderDeptChainNameList(row).length > 20
              ? `${renderDeptChainNameList(row).slice(0, 20)}...`
              : renderDeptChainNameList(row).slice(0, 20)
          }}
        </div>
      </template>
      <template slot="positionList" slot-scope="{ row }">
        <div :title="renderPositionList(row)">
          {{
            renderPositionList(row).length > 20
              ? `${renderPositionList(row).slice(0, 20)}...`
              : renderPositionList(row).slice(0, 20)
          }}
        </div>
      </template>

      <template slot="canDownload" slot-scope="{ row }">
        {{ row.canDownload | getOptionsValue(canDownloadOption) }}
      </template>
      <template slot-scope="{ row }" slot="electronicSealList">
        <div :title="`${row.electronicSealList[0]}`">
          {{
            row.electronicSealList[0].length > 10
              ? `${row.electronicSealList[0].slice(0, 10)}...`
              : row.electronicSealList[0].slice(0, 10)
          }}
        </div>
      </template>
      <template slot="status" slot-scope="{ row }">
        <el-switch
          :value="row.status"
          :active-value="1"
          :inactive-value="2"
          @change="setEnableOrDisable($event, row)"
        />
      </template>
      <div slot="headerRight" style="margin-bottom: 5px">
        <el-button size="mini" type="default" @click="add" class="addBtn"
          >+ 新增</el-button
        >
      </div>
      <template slot="action" slot-scope="{ row }">
        <div>
          <el-button type="text" @click="gotoDownload(row)">下载</el-button>
          <el-button type="text" @click="edit(row)" :loading="row.editLoading"
            >修改</el-button
          >
          <el-button type="text" @click="showSignPdf(row)">签署配置</el-button>
          <el-button style="color: #f53f3f" type="text" @click="onDel(row)"
            >删除</el-button
          >
        </div>
      </template>
    </MPageLayout>

    <addDialog
      :row="row"
      :fileType="fileType"
      v-if="editDialogVisiable"
      :visible.sync="editDialogVisiable"
      @close="editDialogVisiable = false"
      @success="submitEditDialog"
      @nextSuccess="nextSuccessEditDialog"
    />
    <signPdf
      v-if="signPdfVisible"
      @cancel="handleSignPdfCancel"
      @success="handleSignPdfSuccess"
      :row="row"
    ></signPdf>
    <reviewFileDialog
      :title="row.fileName"
      :url="row.fileUrl"
      v-if="reviewFileDialogVisable"
      :visible.sync="reviewFileDialogVisable"
      @close="reviewFileDialogVisable = false"
      @success="reviewFileDialogVisable = false"
    >
    </reviewFileDialog>
    <sealPreviewDialog
      :row="row"
      :title="curElectronicSealInfo.sealName"
      :url="curElectronicSealInfo.sealUrl"
      v-if="sealPreviewDialogVisable"
      :visible.sync="sealPreviewDialogVisable"
      @close="sealPreviewDialogVisable = false"
    />
    <statusDialog
      :row="row"
      v-if="statusDialogVisable"
      :visible.sync="statusDialogVisable"
      @close="statusDialogVisable = false"
      @success="successStatusDialog"
    ></statusDialog>
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import addDialog from './components/addDialog.vue'
import statusDialog from './components/statusDialog'
import reviewFileDialog from './components/reviewFileDialog'

import { fileDownload } from '@/utils/index'
import signPdf from '../signPdf'
import {
  signFilePageListAjax,
  signFileDeleteAjax,
  signFileDetailAjax
} from '../../../api/signFile'
import { canDownloadOption } from '@/views/oaMannagement/signFileManagement/components/utils/options'
import sealPreviewDialog from '@/views/oaMannagement/badgeManagement/components/eleSealAgreement/components/sealPreviewDialog.vue'
export default {
  components: {
    filterTop,
    addDialog,
    signPdf,
    statusDialog,
    reviewFileDialog,
    sealPreviewDialog
  },
  props: {
    fileType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'headerRight',
        'status',
        'companyList',
        'deptChainNameList',
        'electronicSealList',
        'positionList',
        'canDownload',
        'fileName'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      row: {},
      info: {},
      search: {
        companyId: '',
        fileName: ''
      },
      loading: false,
      giveupDialogVisiable: false,
      editDialogVisiable: false,
      multipleSelection: [],
      QRCodeDialogVisible: false,
      waitingPersonAudtDialogVisible: false,
      onDutyDialogVisible: false,
      selectList: [],
      signPdfVisible: false,
      statusDialogVisable: false,
      canDownloadOption,
      reviewFileDialogVisable: false,
      curElectronicSealInfo: {},
      sealPreviewDialogVisable: false
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_signFileManagement_page')
    this.onSearchFn()
  },
  activated() {
    this.onSearchFn()
  },
  methods: {
    async submitEditDialog() {
      this.$uweb?.setAction('Event_oa_signFileManagement_add')
      this.editDialogVisiable = false
      this.onSearchFn()
    },
    nextSuccessEditDialog(e) {
      this.editDialogVisiable = false
      this.onSearchFn()
      this.showSignPdf(e)
    },
    renderDeptChainNameList(row) {
      if (!row.deptChainNameList || row.deptChainNameList.length === 0) {
        return ''
      }
      const labelArray = row.deptChainNameList.join('、')
      return labelArray
    },
    renderPositionList(row) {
      if (!row.positionList || row.positionList.length === 0) {
        return ''
      }
      const labelArray = row.positionList.join('、')
      return labelArray
    },
    add() {
      this.row = {}
      this.editDialogVisiable = true
    },
    //修改
    async edit(row) {
      row.editLoading = true
      const formData = new FormData()
      formData.append('signFileId', row.signFileId)
      formData.append('signFileVersion', row.signFileVersion)
      signFileDetailAjax(formData)
        .then(res => {
          if (res.code === 1) {
            this.row = { ...res.data, ifEdit: true }
            this.editDialogVisiable = true
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    detail(row) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: row.personnelBaseInfoId,
          candidateId: row.personnelBaseInfoId,
          currentComponent: 'WaitingEntryList'
        }
      })
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
      this.$emit('submit')
      this.$refs.MPageLayout.$refs.pageLayout.$refs.mTable.clearSelection()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        companyId: '',
        fileName: ''
      }
      this.onSearchFn()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        pageType: this.fileType,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.search
      }
      signFilePageListAjax(params)
        .then(res => {
          if (res.code === 1) {
            res.data.items?.forEach((v, index) => {
              v.editLoading = false
              v.index =
                (this.config.currentPage - 1) * this.config.pageSize + index + 1
            })
            this.config.tableData = res.data.items || []
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
    //审批登记表
    handleWaitingPersonAudt() {
      this.waitingPersonAudtDialogVisible = true
    },
    //已登记
    handleOnDuty() {
      this.onDutyDialogVisible = true
    },
    // 下载
    gotoDownload(row) {
      this.$uweb?.setAction('Event_oa_signFileManagement_down')
      fileDownload(row.fileUrl, `${row.fileName}.pdf`)
    },
    //签署定位弹出
    showSignPdf(row) {
      this.$uweb?.setAction('Event_oa_signFileManagement_signSet')
      this.row = { ...row }
      this.signPdfVisible = true
    },
    onDel(row) {
      this.$delModal({
        tips: `请确认删除"${row.fileName}"？`,
        success: () => {
          this.loading = true
          const formData = new FormData()
          formData.append('signFileId', row.signFileId)
          formData.append('signFileVersion', row.signFileVersion)
          signFileDeleteAjax(formData)
            .then(res => {
              this.loading = false
              if (res.code === 1) {
                this.onSearchFn()
              }
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {
          this.loading = false
        }
      })
    },
    //取消pdf签署设置
    handleSignPdfCancel() {
      this.signPdfVisible = false
    },
    //保存pdf签署成功
    handleSignPdfSuccess() {
      this.signPdfVisible = false
      this.onSearchFn()
    },
    //开启禁用
    setEnableOrDisable(e, row) {
      console.log(e, row, '333333')
      if (e === 1) {
        //开启
        this.row = { ...row }
        this.statusDialogVisable = true
      } else {
        //禁用
        this.row = { ...row }
        this.statusDialogVisable = true
      }
    },
    successStatusDialog() {
      this.statusDialogVisable = false
      this.onSearchFn()
    },
    handlefileNameClick(row) {
      this.row = { ...row }
      this.reviewFileDialogVisable = true
    },
    handleElectronicSealListClick(id) {
      //  this.$store
      //     .dispatch('oaManage/getElectronicSealInfo', {id}).then(res => {
      //       this.curElectronicSealInfo = res
      //       this.sealPreviewDialogVisable = true
      //     })
      this.curElectronicSealInfo = {
        title: id
      }
      this.sealPreviewDialogVisable = true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 0 !important;
}

.resume-list {
  min-width: 1200px;
}

.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
::v-deep .tablePage .page_header .page_header_action {
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
::v-deep .page_header {
  padding: 10px 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
  .el-table {
    &::after {
      background-color: #e7e7e7;
    }
  }
}
::v-deep {
  .el-table__header {
    tr {
      // 第一个th
      th:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
      // 倒数第二个
      th {
        &:nth-last-child(2) {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      }
    }
    .el-table__cell {
      font-size: 14px;
      font-family: normal;
      color: #777777;
      border-bottom: none !important;
    }
  }
  .el-table__body {
    td {
      border-bottom: 1px solid #e7e7e7;
    }
  }
}
.mask-img {
  display: none;
  width: 100%;
  height: 20px;
  background: rgba(51, 51, 51, 0.4);
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: center;
  user-select: none;
  .mask-img-item {
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
  }
}
.vertical-img {
  position: relative;
  width: 45px;
  height: 80px;
  background: #d8d8d8;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
.horizontal-img {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}

.pointer {
  color: #2c82ff;
  margin-left: 5px;
}
.addBtn {
  border-color: #0c6fff;
  color: #0c6fff;
  font-size: 14px;
  font-weight: 400;
  font-family: '微软雅黑';
  width: 70px;
  height: 32px;
}
</style>
