<template>
  <MCard class="page_wrap">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item to="/sessionTemplate"> AI助手 </el-breadcrumb-item>
        <el-breadcrumb-item>用户举报</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
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
        <filterTop :search="search" @onSearch="onSearchFn" @onClear="onClear" />
      </template>
      <template slot="userAccount" slot-scope="{ row }">
        <watchPhone
          :default-value="row.userAccount"
          :params="row"
          :user-id="row.userId"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button
            v-if="scope.row.handleStatus !== 0"
            type="text"
            @click="viewRecord(scope.row)"
          >
            查看处理记录
          </el-button>
          <el-button v-else type="text" @click="handleRecord(scope.row)">
            去处理
          </el-button>
        </div>
      </template>
    </MPageLayout>

    <viewReportDialog
      v-if="visibleDialog"
      v-model="visibleDialog"
      :row="info"
      @submit="submitSuccess"
      @close="visibleDialog = false"
    />
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import viewReportDialog from './components/viewReportDialog'
import watchPhone from './components/watchPhone'

import {
  aiUserReportListGet,
  aiUserReportRecordsGet,
  aiUserReportHandlePost
} from '@/api/aigc/userReport'

export default {
  components: {
    filterTop,
    viewReportDialog,
    watchPhone
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'userAccount'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      info: {},
      search: {},
      loading: false,
      visibleDialog: false,
      delConfirmVisible: false
    }
  },
  created() {
    this.onSearchFn()
  },
  methods: {
    async submitSuccess(data) {
      const res = await aiUserReportHandlePost(data)

      console.log(res)
      this.visibleDialog = false
      this.onSearchFn()
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
    },
    // 点击重置按钮
    onClear() {
      this.search = {}
      this.onSearchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        ...this.search,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      aiUserReportListGet(params)
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
    },
    // 获取举报记录
    async getUserRecord(row) {
      const params = {
        aiUserReportsId: row.id
      }

      const res = await aiUserReportRecordsGet(params)

      this.handleDesc = res.data.handleDesc
    },
    // 查看处理记录
    async viewRecord(row) {
      await this.getUserRecord(row)
      this.info = {
        ...row,
        handleDesc: this.handleDesc
      }
      this.visibleDialog = true
    },
    // 去处理
    handleRecord(row) {
      this.info = {
        userAccount: row.id
      }
      this.visibleDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  min-width: 1200px;
  height: calc(100vh - 90px);
  padding: 20px 20px 40px;

  .page_top {
    margin-bottom: 20px;
  }
}
::v-deep .page_header {
  padding: 0 !important;
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
