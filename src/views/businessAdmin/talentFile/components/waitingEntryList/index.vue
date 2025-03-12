<template>
  <MCard class="resume-list">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      row-key="id"
      key="waitingEntryList"
      reserve-selection
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      index-location="none"
      if-index
      :checkbox="true"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <filterTop
          :search="search"
          style="margin-bottom: 5px"
          @onSearch="onSearchFn"
          @onClear="onClear"
        />
      </template>
      <template slot="phone" slot-scope="{ row }">
        <watchPhone
          :default-value="row.phone"
          :params="row"
          :user-id="row.personnelBaseInfoId"
        />
      </template>
      <template slot-scope="{ row }" slot="contractAgreementNumber">
        <div
          class="cursor-pointer c_0F71FF"
          @click.stop="handleFileClick(row, 'contractAgreement')"
        >
          {{ row.contractAgreementNumber }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="companySystemNumber">
        <div
          class="cursor-pointer c_0F71FF"
          @click.stop="handleFileClick(row, 'companySystem')"
        >
          {{ row.companySystemNumber }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="entryRegisterAuditStatus">
        <div
          class="entryRegisterAudit"
          :class="`entryRegisterAuditStatus${row.entryRegisterAuditStatus}`"
        >
          <div style="display: flex; align-items: center">
            <svg-icon
              class-name="entryRegisterAuditStatusIcon"
              :icon-class="
                {
                  0: 'entryRegisterAuditStatus0',
                  1: 'entryRegisterAuditStatus1',
                  2: 'entryRegisterAuditStatus2',
                  3: 'entryRegisterAuditStatus3'
                }[row.entryRegisterAuditStatus]
              "
            />{{
              row.entryRegisterAuditStatus
                | getOptionsValue(entryRegisterAuditStatusOption)
            }}
          </div>
        </div>
      </template>
      <template slot-scope="{ row }" slot="arrivalStatus">
        <div :class="`arrivalStatus${row.arrivalStatus}`">
          {{ statusMap[row.arrivalStatus] }}
        </div>
      </template>
      <div slot="headerRight" style="margin-bottom: 5px">
        <el-button
          size="small"
          type="default"
          @click="handleWaitingPersonAudt"
          :disabled="multipleSelection.length === 0"
          >入职登记表审核</el-button
        >
        <el-button
          size="small"
          type="default"
          @click="handleOnDuty"
          :disabled="multipleSelection.length === 0"
          >已到岗</el-button
        >
        <el-button size="small" type="default" @click="downLoadQRCode">
          <div class="qr-div">
            <svg-icon icon-class="qr" class="resume_svg" />
            <span>下载入职二维码</span>
          </div>
        </el-button>
      </div>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="giveup(scope.row)"
            >放弃offer</el-button
          >
          <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
        </div>
      </template>
    </MPageLayout>

    <GiveupDialog
      v-if="giveupDialogVisiable"
      :row="row"
      :visible.sync="giveupDialogVisiable"
      @close="giveupDialogVisiable = false"
      @submit="submitGiveupDialog"
    />

    <EditDialog
      v-if="editDialogVisiable"
      :row="row"
      :visible.sync="editDialogVisiable"
      @close="editDialogVisiable = false"
      @submit="submitEditDialog"
    />

    <QRcodeDialog
      v-if="QRCodeDialogVisible"
      :visible.sync="QRCodeDialogVisible"
      @close="QRCodeDialogVisible = false"
    />

    <waitingPersonAudtDialog
      v-if="waitingPersonAudtDialogVisible"
      :select-list="multipleSelection"
      :visible.sync="waitingPersonAudtDialogVisible"
      @success="waitingPersonAudtSuccess()"
      @search="onSearchFn()"
      @close="waitingPersonAudtDialogVisible = false"
    />
    <onDutyDialog
      v-if="onDutyDialogVisible"
      :select-list="multipleSelection"
      :visible.sync="onDutyDialogVisible"
      @success="handleOnDutySuccess"
      @close="onDutyDialogVisible = false"
    />
    <reviewFileListDialog
      v-if="reviewFileListDialogVisable"
      :list="row.flieList"
      :title="row.flieListTitle"
      :select-list="multipleSelection"
      :visible.sync="reviewFileListDialogVisable"
      @success="reviewFileListDialogVisable = false"
      @close="reviewFileListDialogVisable = false"
    />
  </MCard>
</template>

<script>
import {
  queryPersonnelEntryInfo,
  giveUpOffer,
  updatePersonnelEntryInfo,
  queryePersonnelEntryInfo
} from '@/api/businessAdmin/talentFile'
import filterTop from './components/filterTop.vue'
import { getColumns, statusMap } from './components/columns'

import { entryRegisterAuditStatusOption } from '@/views/businessAdmin/talentFile/options'

import WatchPhone from './components/watchPhone.vue'
import GiveupDialog from './components/giveupDialog.vue'
import EditDialog from './components/editDialog.vue'
import moment from 'moment'
import QRcodeDialog from './components/qrcodeDialog'
import waitingPersonAudtDialog from './components/waitingPersonAudtDialog.vue'
import onDutyDialog from './components/onDutyDialog.vue'

import reviewFileListDialog from './components/reviewFileListDialog.vue'

export default {
  components: {
    filterTop,
    WatchPhone,
    GiveupDialog,
    EditDialog,
    QRcodeDialog,
    waitingPersonAudtDialog,
    onDutyDialog,
    reviewFileListDialog
  },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'headerRight',
        'phone',
        'entryRegisterAuditStatus',
        'contractAgreementNumber',
        'companySystemNumber',
        'arrivalStatus'
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
        entryCompanyId: '',
        entryDepartmentId: '',
        expectedEntryTimeEnd: '',
        expectedEntryTimeStart: '',
        time: [],
        personnelBaseInfoId: '',
        positionId: ''
      },
      loading: false,
      giveupDialogVisiable: false,
      editDialogVisiable: false,
      multipleSelection: [],
      QRCodeDialogVisible: false,
      waitingPersonAudtDialogVisible: false,
      onDutyDialogVisible: false,
      entryRegisterAuditStatusOption,
      reviewFileListDialogVisable: false,
      statusMap
    }
  },
  mounted() {
    this.onSearchFn()
  },
  activated() {
    this.onSearchFn()
  },
  methods: {
    downLoadQRCode() {
      this.QRCodeDialogVisible = true
    },
    record(row) {
      this.recordDialogVisible = true
      this.row = { ...row }
    },
    giveup(row) {
      this.giveupDialogVisiable = true
      this.row = { ...row }
    },
    async submitGiveupDialog(val) {
      const res = await giveUpOffer(val)

      if (res) {
        this.giveupDialogVisiable = false
        this.onSearchFn()
        this.row = {}
        this.$message({
          message: '放弃offer成功',
          type: 'success'
        })
      }
    },
    async submitEditDialog(val) {
      const res = await updatePersonnelEntryInfo(val)
      if (res) {
        this.editDialogVisiable = false
        this.onSearchFn()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.row = {}
      }
    },
    async edit(row) {
      const params = {
        personnelEntryInfoId: row.id
      }
      const res = await queryePersonnelEntryInfo(params)

      this.row = { ...res.data }
      this.editDialogVisiable = true
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
        searchType: 0,
        searchValue: '',
        entryCompanyId: '',
        entryDepartmentId: '',
        expectedEntryTimeEnd: '',
        expectedEntryTimeStart: '',
        time: [],
        personnelBaseInfoId: '',
        positionId: ''
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
        entryCompanyId: this.search.entryCompanyId,
        entryDepartmentId: this.search.entryDepartmentId,
        positionId: this.search.positionId,
        expectedEntryTimeStart: this.search.time.length
          ? moment(this.search.time[0]).valueOf()
          : '',
        expectedEntryTimeEnd: this.search.time.length
          ? moment(this.search.time[1]).valueOf()
          : '',
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }

      const res2 = await queryPersonnelEntryInfo(params2)

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
    //审批登记表
    handleWaitingPersonAudt() {
      this.waitingPersonAudtDialogVisible = true
    },
    //已登记
    handleOnDuty() {
      this.onDutyDialogVisible = true
    },
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    //登记成功
    handleOnDutySuccess() {
      this.onDutyDialogVisible = false
      this.onSearchFn()
    },
    //入职表审批成功
    waitingPersonAudtSuccess() {
      this.waitingPersonAudtDialogVisible = false
      this.onSearchFn()
    },
    handleFileClick(row, type) {
      if (type === 'companySystem') {
        row.flieList = row.companySystemList
        row.flieListTitle = '查看关联公司制度'
      } else if (type === 'contractAgreement') {
        row.flieListTitle = '查看关联合同协议'
        row.flieList = row.contractAgreementList
      }
      this.row = { ...row }
      this.reviewFileListDialogVisable = true
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
  // height: calc(100% - 90px);
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
::v-deep .el-table__body-wrapper {
  height: 100% !important;
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

.entryRegisterAudit {
  display: inline-block;
  padding: 0 10px;
  width: 74px;
  border-radius: 13px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .entryRegisterAuditStatusIcon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
}
.entryRegisterAuditStatus0 {
  background: #d2f7ff;
  color: #2364a1;
}
.entryRegisterAuditStatus1 {
  background: #fff2e6;
  color: #ff7d00;
}
.entryRegisterAuditStatus2 {
  background: #e6f7ea;
  color: #00b42a;
}
.entryRegisterAuditStatus3 {
  background: #f6deff;
  color: #b729ff;
}
.arrivalStatus1 {
  color: #ff7d00;
}
.arrivalStatus2 {
  color: #00b42a;
}
</style>
