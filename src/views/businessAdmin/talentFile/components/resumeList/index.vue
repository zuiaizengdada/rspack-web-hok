<template>
  <MCard class="resume-list">
    <MPageLayout
      ref="MPageLayout"
      row-key="id"
      reserve-selection
      key="resumeList"
      type="tablePage"
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
      <template slot="source" slot-scope="{ row }">
        <el-tooltip
          v-if="row.source === 6"
          class="item"
          effect="dark"
          :content="row.internalReferrerName"
          placement="right-end"
        >
          <span> {{ statusMap[row.source] }}</span>
        </el-tooltip>
        <span v-else> {{ statusMap[row.source] }}</span>
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
      <div slot="headerLeft" style="width: 100%; margin-bottom: 5px">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="add"
          >新增</el-button
        >
        <el-button size="small" type="default" @click="toBlackList"
          >移入黑名单</el-button
        >
      </div>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="invite(scope.row)">邀面成功</el-button>
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
        </div>
      </template>
    </MPageLayout>

    <AddEditDialog
      v-if="addEditDialogVisible"
      ref="addEditDialogRef"
      :row="row"
      :visible.sync="addEditDialogVisible"
      @close="closeAddEditDialog"
      @submit="addEditDialogSubmit"
    />

    <BlackListDialog
      v-if="backListVisible"
      :visible.sync="backListVisible"
      @close="closeBackListDialog"
      @submit="moveBlackListSubmit"
    />

    <InviteDialog
      v-if="inviteVisible"
      :row="row"
      :visible.sync="inviteVisible"
      @close="closeInviteDialog"
      @submit="addInviteDialogSubmit"
    />
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import AddEditDialog from './components/addEditDialog.vue'
import BlackListDialog from './components/blackListDialog.vue'
import InviteDialog from './components/inviteDialog.vue'
import WatchPhone from './components/watchPhone.vue'
import { getPhone } from '@/api/businessAdmin/talentFile'
import Dialog from '@/components/Dialog/index.js'
import { browse } from '@/views/oaMannagement/utils/common'

import {
  queryTalentFilePageList,
  addTalentFile,
  approveInterview,
  moveToBlackList,
  editTalentFile,
  queryCandidateInfo
} from '@/api/businessAdmin/talentFile'

export default {
  components: {
    filterTop,
    AddEditDialog,
    BlackListDialog,
    InviteDialog,
    WatchPhone
  },
  data() {
    return {
      statusMap: {
        1: 'BOSS直聘',
        2: '智联招聘',
        3: '前程无忧',
        4: '拉勾',
        5: '猎聘',
        6: '内推',
        7: '公众号/朋友圈',
        8: '其他'
      },
      numPages: null,
      slotArr: [
        'action',
        'phone',
        'search',
        'source',
        'footer',
        'headerLeft',
        'resumeUrl'
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
        hrbp: ''
      },
      loading: false,
      addEditDialogVisible: false,
      backListVisible: false,
      inviteVisible: false,
      multipleSelection: [],
      fileList: []
    }
  },
  mounted() {
    this.onSearchFn()
  },

  activated() {
    this.onSearchFn()
  },

  methods: {
    browse,
    detail(row) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: row.personnelBaseInfoId,
          candidateId: row.personnelBaseInfoId,
          currentComponent: 'ResumeList'
        }
      })
    },
    //员工详情
    toUserDetails(id) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: id,
          candidateId: id,
          currentComponent: 'WaitingEntryList'
        }
      })
    },
    add() {
      this.addEditDialogVisible = true
      this.row = {
        name: '',
        mobile: '',
        source: null,
        internalReferrer: null,
        position: ''
      }
    },
    toBlackList() {
      if (this.multipleSelection.length) {
        this.backListVisible = true
      }
    },
    async moveBlackListSubmit(val) {
      const res = await moveToBlackList({
        ids: this.multipleSelection.map(item => item.id),
        ...val
      })

      if (res.code === 1) {
        this.$message({
          message: '移入黑名单成功',
          type: 'success'
        })
        this.backListVisible = false
        this.onSearchFn()
        this.$emit('submit')
      }
    },
    closeAddEditDialog() {
      this.addEditDialogVisible = false
    },
    closeBackListDialog() {
      this.backListVisible = false
    },
    closeInviteDialog() {
      this.inviteVisible = false
    },
    async edit(row) {
      const params = {
        resumeLibraryId: row.id
      }
      const res = await queryCandidateInfo(params)

      if (res) {
        this.row = {
          ...res.data,
          id: row.id,
          fileList: JSON.parse(res.data.resumeUrlFileList)
        }

        this.addEditDialogVisible = true
      }
    },
    async invite(row) {
      const params = {
        personnelInfoId: row.personnelBaseInfoId
      }
      const { data } = await getPhone(params)

      this.row = {
        id: row.id,
        name: row.name,
        phone: data,
        interviewTime: '',
        interviewerIds: []
      }
      this.inviteVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async addEditDialogSubmit(type, val) {
      if (type === 'new') {
        const res = await addTalentFile(val)
        if (res.code === 1) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$refs.addEditDialogRef.post = {}
          this.$refs.addEditDialogRef.fileList = []
          this.$refs.addEditDialogRef.fileUrl = ''
          this.onSearchFn()
          this.$emit('submit')
        } else if ([5113, 5145].includes(res.code)) {
          Dialog.open({
            type: 'ExistingTipDialog',
            errCode: `${res.code}`,
            visible: true,
            success: res => {
              Dialog.close()
              this.toUserDetails()
            }
          })
        }
      } else {
        if (!val.personnelBaseInfoId) {
          const res = await addTalentFile(val)
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
          const res = await editTalentFile(val)
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
    },
    async addInviteDialogSubmit(val) {
      const res = await approveInterview({
        id: val.id,
        interviewTime: val.interviewTime,
        interviewerIds: val.interviewerIds
      })

      if (res.code === 1) {
        this.$message({
          message: '邀请面试成功',
          type: 'success'
        })
        this.inviteVisible = false
        this.onSearchFn()
        this.$emit('submit')
      }
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
        hrbp: this.search.hrbpId,
        positionId: this.search.positionId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }

      queryTalentFilePageList(params2)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 0 !important;
}
.resume_svg {
  width: 18px;
  height: 18px;
}
.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
.resume-list {
  min-width: 1200px;
  // height: calc(100vh - 90px);
}

.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
::v-deep .el-drawer__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
</style>
