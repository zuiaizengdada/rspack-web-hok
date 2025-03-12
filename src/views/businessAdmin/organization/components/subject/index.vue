<template>
  <MCard class="black-list">
    <MPageLayout
      ref="MPageLayout"
      border
      row-key="id"
      style="height: 80vh"
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
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div slot="headerLeft" style="margin-bottom: 5px">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">
          新增
        </el-button>
      </div>
      <template slot="status" slot-scope="scope">
        <div class="status-box">
          <div :class="['dot', scope.row.status ? 'disabled' : '']" />
          <span style="margin-right: 5px">{{
            statusMap[scope.row.status]
          }}</span>
          <el-switch
            :value="!scope.row.status"
            @change="$event => handleChange($event, scope.row)"
          />
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" style="color: #ff0000;" @click="deleteSubject(scope.row)">删除</el-button>
        </div>
      </template>
    </MPageLayout>

    <AddDialog
      v-if="addDialogVisible"
      :row="row"
      :visible.sync="addDialogVisible"
      @close="addDialogVisible = false"
      @submit="submitAddDialog"
    />
  </MCard>
</template>

<script>
import { getColumns } from './components/columns'
import AddDialog from './components/addDialog.vue'

import {
  querySubjectList,
  updateState,
  addCompany,
  updateSubject,
  deleteCompany
} from '@/api/businessAdmin/talentFile'

export default {
  components: { AddDialog },
  data() {
    return {
      slotArr: ['headerLeft', 'action', 'status'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      row: {},
      loading: false,
      statusMap: {
        0: '启用',
        1: '禁用'
      },
      addDialogVisible: false
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    edit(row) {
      this.row = { ...row }
      this.addDialogVisible = true
    },
    deleteSubject(row) {
      this.$confirm(`是否删除${row.name}该公司主体?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteCompany(row.id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.onSearchFn()
      })
    },
    add() {
      this.row = {
        businessScope: '',
        name: ''
      }
      this.addDialogVisible = true
    },
    async submitAddDialog(val) {
      if (val.id) {
        const res = await updateSubject(val)

        if (res) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.addDialogVisible = false
          this.onSearchFn()
        }
      } else {
        const res = await addCompany(val)

        if (res) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.addDialogVisible = false
          this.onSearchFn()
        }
      }
    },
    async handleChange(e, value) {
      this.$confirm(`确定${e ? '启用' : '禁用'}${value.name}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'none'
      }).then(async () => {
        const params = {
          id: value.id,
          status: e ? 0 : 1
        }
        const { data, message } = await updateState(params)

        if (data) {
          this.onSearchFn()
          this.$message({
            type: 'success',
            message: `${e ? '启用' : '禁用'}成功`
          })
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      })
    }, // 分页改变触发
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
    async getList() {
      this.loading = true

      const params = {
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }

      querySubjectList(params)
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
::v-deep .el-table th .gutter {
  display: table-cell !important;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 5px;

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #00b42a;
  }

  .disabled {
    background-color: #ed1b24;
  }
}

.black-list {
  min-width: 1200px;
  height: calc(100vh - 100px);
  padding: 0 !important;
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

::v-deep .tablePage .page_footer {
  justify-content: flex-end;
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
