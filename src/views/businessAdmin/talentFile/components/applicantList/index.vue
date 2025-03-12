<template>
  <MCard class="resume-list">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      row-key="id"
      key="applicantList"
      reserve-selection
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      if-index
      index-location="none"
      :checkbox="true"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <filterTop :search="search" @onSearch="onSearchFn" @onClear="onClear" />
      </template>
      <template slot="phone" slot-scope="{ row }">
        <watchPhone
          :default-value="row.phone"
          :params="row"
          :user-id="row.personnelBaseInfoId"
        />
      </template>
      <template slot="resumeUrl" slot-scope="scope">
        <!-- <a :href="scope.row.resumeUrl" target="_blank"> -->
        <svg-icon
          icon-class="resume"
          class="resume_svg"
          @click="browse(scope.row.resumeUrl)"
        />
        <!-- </a> -->
      </template>
      <template slot="source" slot-scope="{ row }">
        <el-tooltip
          v-if="row.source === 6"
          class="item"
          effect="dark"
          :content="row.internalReferrerName"
          placement="right-end"
        >
          <span> {{ statusMap2[row.source] }}</span>
        </el-tooltip>
        <span v-else> {{ statusMap2[row.source] }}</span>
      </template>
      <template slot="register" slot-scope="scope">
        <svg-icon
          icon-class="resume"
          class="resume_svg"
          :style="{
            width: '18px',
            height: '18px',
            cursor: scope.row.approvalStatus === 1 ? 'not-allowed' : 'pointer'
          }"
          @click="preview(scope.row)"
        />
      </template>
      <template slot="approvalStatus" slot-scope="scope">
        <div class="tag" :class="statusClassMap[scope.row.approvalStatus]">
          {{ statusMap[scope.row.approvalStatus] }}
        </div>
      </template>
      <div slot="headerRight" style="margin-bottom: 5px">
        <el-button size="small" type="default" @click="downLoadQRCode">
          <div class="qr-div">
            <svg-icon icon-class="qr" class="resume_svg" />
            <span>下载面试二维码</span>
          </div>
        </el-button>
      </div>
      <div slot="headerLeft" style="margin-bottom: 5px">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="add"
          >新增</el-button
        >
        <el-button
          size="small"
          type="default"
          :disabled="multipleSelection.length === 0"
          @click="editInterviewer"
          >修改面试官</el-button
        >
        <el-button
          size="small"
          type="default"
          :disabled="
            multipleSelection.length === 0 || multipleSelection.length !== 1
          "
          @click="giveUpInterview"
          >放弃面试</el-button
        >
      </div>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button
            v-if="scope.row.approvalStatus === 3"
            type="text"
            v-permission="[
              'talentFile:applicantList:revokeApproval',
              permsList
            ]"
            @click="withdraw(scope.row)"
            >撤回审批</el-button
          >
          <el-button
            v-if="scope.row.approvalStatus === 3"
            type="text"
            v-permission="['talentFile:applicantList:approval', permsList]"
            Approval
            @click="approve(scope.row)"
            >审批</el-button
          >
          <el-button
            v-if="scope.row.approvalStatus !== 1"
            type="text"
            @click="record(scope.row)"
            v-permission="[
              'talentFile:applicantList:interviewRecord',
              permsList
            ]"
            >面试记录</el-button
          >
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
        </div>
      </template>
    </MPageLayout>

    <QRcodeDialog
      v-if="QRCodeDialogVisible"
      :row="row"
      :visible.sync="QRCodeDialogVisible"
      @close="QRCodeDialogVisible = false"
    />

    <GiveUpInterviewDialog
      v-if="giveUpInterviewDialogVisible"
      :row="row"
      :visible.sync="giveUpInterviewDialogVisible"
      @close="giveUpInterviewDialogVisible = false"
      @submit="submitGiveUpInterviewDialog"
    />

    <EditInterviewerDialog
      v-if="editInterviewerDialogVisible"
      :row="row"
      :visible.sync="editInterviewerDialogVisible"
      @close="editInterviewerDialogVisible = false"
      @submit="submitEditInterviewerDialog"
    />

    <AddEditDialog
      v-if="addEditDialogVisible"
      ref="addEditDialogRef"
      :row="row"
      :visible.sync="addEditDialogVisible"
      @close="addEditDialogVisible = false"
      @submit="submitAddEditDialog"
    />

    <RecordDialog
      v-if="recordDialogVisible"
      :row="row"
      :visible.sync="recordDialogVisible"
      @close="recordDialogVisible = false"
      @submit="submitRecordDialog"
    />

    <WithdrawDialog
      v-if="withdrawVisible"
      :row="row"
      :visible.sync="withdrawVisible"
      @close="withdrawVisible = false"
      @submit="submitWithdrawDialog"
    />

    <ApproveDialog
      v-if="approveVisible"
      :row="row"
      :visible.sync="approveVisible"
      @close="approveVisible = false"
      @submit="submitApproveDialog"
    />

    <PreviewRegistrationForm
      v-if="previewRegistrationFormVisible"
      :row="row"
      :visible.sync="previewRegistrationFormVisible"
      @close="previewRegistrationFormVisible = false"
    />
  </MCard>
</template>

<script>
import {
  queryApplicantPageList,
  addApplicant,
  updateApplicant,
  addAppInfo,
  giveUpInterview,
  withdrawApproval,
  approval,
  updateInterviewer,
  getCandidateInfo
} from '@/api/businessAdmin/talentFile'
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import QRcodeDialog from './components/qrcodeDialog'
import GiveUpInterviewDialog from './components/giveUpInterviewDialog'
import EditInterviewerDialog from './components/editInterviewerDialog'
import AddEditDialog from './components/addEditDialog'
import RecordDialog from './components/recordDialog.vue'
import WithdrawDialog from './components/withdrawDialog.vue'
import ApproveDialog from './components/approveDialog.vue'
import watchPhone from './components/watchPhone.vue'
import PreviewRegistrationForm from './components/previewRegistrationForm.vue'
import Dialog from '@/components/Dialog/index.js'
import { browse } from '@/views/oaMannagement/utils/common'

export default {
  components: {
    filterTop,
    QRcodeDialog,
    GiveUpInterviewDialog,
    EditInterviewerDialog,
    AddEditDialog,
    RecordDialog,
    WithdrawDialog,
    ApproveDialog,
    watchPhone,
    PreviewRegistrationForm
  },
  data() {
    return {
      statusMap2: {
        1: 'BOSS直聘',
        2: '智联招聘',
        3: '前程无忧',
        4: '拉勾',
        5: '猎聘',
        6: '内推',
        7: '公众号/朋友圈',
        8: '其他'
      },
      statusMap: {
        1: '待面试',
        2: '已面试待定',
        3: '录用审批中',
        4: '录用被驳回'
      },
      statusClassMap: {
        1: 'warning',
        2: 'info',
        3: 'success',
        4: 'danger'
      },
      slotArr: [
        'approvalStatus',
        'action',
        'search',
        'footer',
        'phone',
        'source',
        'headerRight',
        'headerLeft',
        'resumeUrl',
        'register'
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
        searchType: 0,
        searchValue: '',
        positionId: '',
        approvalStatus: ''
      },
      loading: false,
      QRCodeDialogVisible: false,
      addEditDialogVisible: false,
      giveUpInterviewDialogVisible: false,
      editInterviewerDialogVisible: false,
      withdrawVisible: false,
      approveVisible: false,
      recordDialogVisible: false,
      previewRegistrationFormVisible: false,
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.onSearchFn()
  },
  activated() {
    this.onSearchFn()
  },
  methods: {
    add() {
      this.row = {}
      this.addEditDialogVisible = true
    },
    browse,
    // //预览
    // browse(url) {
    //   if (!url) {
    //     return
    //   }
    //   if (
    //     ['txt', 'TXT', 'csv', 'CSV'].includes(this.$getFileType(url).suffix)
    //   ) {
    //     const hrefUrl = 'http://view.xdocin.com/xdoc?_xdoc=' + url
    //     window.open(hrefUrl)
    //     return
    //   }
    //   if (
    //     ['pdf', 'PDF', 'png', 'PNG', 'jpg', 'JPG'].includes(
    //       this.$getFileType(url).suffix
    //     )
    //   ) {
    //     window.open(url)
    //     return
    //   }
    //   const hrefUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + url
    //   window.open(hrefUrl)
    // },
    downLoadQRCode() {
      this.QRCodeDialogVisible = true
    },
    giveUpInterview() {
      this.row = this.multipleSelection[0]

      if (this.row.approvalStatus === 3) {
        return this.$message.warning('录用审批中的人员，不支持该操作')
      }

      this.giveUpInterviewDialogVisible = true
    },

    editInterviewer() {
      this.row = [...this.multipleSelection]

      if (this.row.some(item => item.approvalStatus === 3)) {
        this.$message.warning('录用审批中的人员，不支持该操作')
      } else {
        this.editInterviewerDialogVisible = true
      }
    },
    preview(row) {
      if (row.approvalStatus === 1) return

      this.row = row
      this.previewRegistrationFormVisible = true
    },
    record(row) {
      this.recordDialogVisible = true
      this.row = { ...row }
    },
    withdraw(row) {
      this.row = { ...row }
      this.withdrawVisible = true
    },
    approve(row) {
      this.row = { ...row }
      this.approveVisible = true
    },
    async edit(row) {
      const params = {
        candidateId: row.id
      }
      const res = await getCandidateInfo(params)

      if (res) {
        this.row = {
          ...res.data,
          id: row.id,
          fileList: JSON.parse(res.data.resumeUrlFileList)
        }

        this.addEditDialogVisible = true
      }
    },
    detail(row) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: row.personnelBaseInfoId,
          candidateId: row.personnelBaseInfoId,
          currentComponent: 'ApplicantList'
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async submitGiveUpInterviewDialog(val) {
      const res = await giveUpInterview({ ...val, candidateId: val.id })

      if (res) {
        this.giveUpInterviewDialogVisible = false
        this.onSearchFn()
        this.$message.success('放弃面试成功')
        this.$emit('submit')
      }
    },
    async submitWithdrawDialog(val) {
      const params = {
        candidateId: val.id
      }
      const res = await withdrawApproval(params)

      if (res) {
        this.$message.success('撤回审批成功')
        this.withdrawVisible = false
        this.onSearchFn()
      }
    },
    async submitEditInterviewerDialog(val) {
      const res = await updateInterviewer(val)

      if (res) {
        this.$message.success('修改面试官成功')
        this.editInterviewerDialogVisible = false
        this.onSearchFn()
      }
    },
    async submitApproveDialog(approvalStatus, val) {
      const params = {
        approvalStatus,
        candidateId: val.id
      }

      const res = await approval(params)

      if (res) {
        this.$message.success('审批成功')
        this.approveVisible = false
        this.onSearchFn()
      }
    },
    async submitRecordDialog(val) {
      await addAppInfo(val)

      this.recordDialogVisible = false
      this.$message.success('创建成功')
      this.onSearchFn()
      this.$emit('submit')
    },
    // async submitQRCodeDialog() {
    //   const res = await downloadQrCode()

    //   if (res) {
    //     this.QRCodeDialogVisible = false
    //     this.$message.success('下载成功')
    //     window.open(res.data, '_blank')
    //   }
    // },
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
        searchType: 0,
        searchValue: ''
      }
      this.onSearchFn()
    },
    // 获取列表数据
    async getList() {
      this.loading = true

      const params = {
        personnelName: '',
        phone: ''
      }

      if (this.search.searchType === 0) {
        params.personnelName = this.search.searchValue
      } else {
        params.phone = this.search.searchValue
      }

      const params2 = {
        ...params,
        approvalStatus: this.search.approvalStatus,
        positionId: this.search.positionId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }

      const res2 = await queryApplicantPageList(params2)

      if (res2) {
        this.loading = false
        if (res2.code === 1) {
          this.config.tableData = res2.data.items
          this.config.total = res2.data.total
        }
      } else {
        this.loading = false
      }
    },
    async submitAddEditDialog(type, row) {
      if (type === 'new') {
        const res = await addApplicant(row)
        if (res.code === 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$refs.addEditDialogRef.post = {}
          this.$refs.addEditDialogRef.fileList = []
          this.$refs.addEditDialogRef.fileUrl = ''
          this.$nextTick(() => {
            this.$refs.addEditDialogRef.clearError()
          })
          this.onSearchFn()
          this.$emit('submit')
        } else if ([5113, 5145].includes(res.code)) {
          Dialog.open({
            type: 'ExistingTipDialog',
            visible: true,
            errCode: `${res.code}`,
            success: res => {
              Dialog.close()
              this.toUserDetails()
            }
          })
        }
      } else {
        if (!row.personnelBaseInfoId) {
          const res = await addApplicant(row)
          if (res.code === 1) {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.addEditDialogVisible = false
            this.onSearchFn()
            this.$emit('submit')
          } else if ([5113, 5145].includes(res.code)) {
            Dialog.open({
              type: 'ExistingTipDialog',
              visible: true,
              errCode: `${res.code}`,
              success: res => {
                Dialog.close()
                this.toUserDetails()
              }
            })
          }
        } else {
          const res = await updateApplicant(row)
          if (res.code === 1) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.addEditDialogVisible = false
            this.onSearchFn()
            this.$emit('submit')
          } else if ([5113, 5145].includes(res.code)) {
            Dialog.open({
              type: 'ExistingTipDialog',
              visible: true,
              errCode: `${res.code}`,
              success: res => {
                Dialog.close()
                this.toUserDetails()
              }
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.resume_svg {
  width: 18px;
  height: 18px;
}

.qr-div {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  padding: 0 !important;
}

.tag {
  padding: 5px 10px;
  border-radius: 14px;
  display: inline-block;
  align-items: center;
}

.success {
  color: #00a82d;
  background-color: #f2fff6;
}

.info {
  color: #0085fa;
  background-color: #f2f7ff;
}
.warning {
  color: #f57800;
  background-color: #fff9f2;
}
.danger {
  color: #ed1b24;
  background-color: #fff2f3;
}

.resume-list {
  min-width: 1200px;
  // height: calc(100% - 90px);
}

.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
// ::v-deep .tablePage .page_header .page_header_action {
//   justify-content: flex-end;
// }
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
</style>
