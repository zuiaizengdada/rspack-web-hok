<template>
  <MCard class="black-list">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      row-key="id"
      key="blackList"
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
          :user-id="row.userId"
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
      <div slot="headerLeft" style="margin-bottom: 5px">
        <el-button
          size="small"
          type="primary"
          :disabled="!multipleSelection.length"
          @click="moveBlackList"
          >移出黑名单</el-button
        >
      </div>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
          <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
        </div>
      </template>
    </MPageLayout>

    <MoveBlackDialog
      v-if="backListVisible"
      :row="row"
      :visible.sync="backListVisible"
      @close="closeBackListVisibleDialog"
      @submit="submitBackListVisibleDialog"
    />

    <DeleteDialog
      v-if="deleteDialogVisible"
      :row="row"
      :visible.sync="deleteDialogVisible"
      @close="submitDeleteDialogVisible"
      @submit="submitDeleteDialogVisibleDialog"
    />
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import WatchPhone from './components/watchPhone.vue'
import MoveBlackDialog from './components/moveBlackDialog.vue'
import DeleteDialog from './components/deleteDialog.vue'
import {
  queryBlackList,
  deleteBlackList,
  removeBlacklist
} from '@/api/businessAdmin/talentFile'
import { browse } from '@/views/oaMannagement/utils/common'

export default {
  components: {
    filterTop,
    WatchPhone,
    MoveBlackDialog,
    DeleteDialog
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
      slotArr: [
        'action',
        'phone',
        'search',
        'footer',
        'source',
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
        personnelBaseInfoId: '',
        positionId: ''
      },
      loading: false,
      backListVisible: false,
      deleteDialogVisible: false,
      multipleSelection: []
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
    moveBlackList() {
      if (this.multipleSelection.length) {
        this.row = this.multipleSelection
        this.backListVisible = true
      }
    },
    closeBackListVisibleDialog() {
      this.backListVisible = false
    },
    closeDeleteDialogVisible() {
      this.deleteDialogVisible = false
    },
    async submitBackListVisibleDialog(val) {
      const res = await removeBlacklist(val)

      if (res) {
        this.backListVisible = false
        this.onSearchFn()
        this.$emit('submit')
      }
    },
    submitDeleteDialogVisible() {
      this.deleteDialogVisible = false
      this.onSearchFn()
    },
    async submitDeleteDialogVisibleDialog(val) {
      const res = await deleteBlackList(val.id)

      if (res) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteDialogVisible = false
        this.onSearchFn()
        this.$emit('submit')
      }
    },
    detail(row) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: row.personnelBaseInfoId,
          candidateId: row.personnelBaseInfoId,
          currentComponent: 'BlackList'
        }
      })
    },
    del(row) {
      this.row = { ...row }
      this.deleteDialogVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
        positionId: this.search.positionId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      queryBlackList(params2)
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
.resume_svg {
  width: 18px;
  height: 18px;
}

.card {
  padding: 0 !important;
}
.resume {
  cursor: pointer;

  &:hover {
    color: #0c6fff;
  }
}

.black-list {
  min-width: 1200px;
  // height: calc(100vh - 90px);
}

.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
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
