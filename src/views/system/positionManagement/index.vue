<template>
  <div class="position-managment-container">
    <el-form size="small" :model="form" inline @submit.native.prevent>
      <el-form-item prop="jobName">
        <el-input
          v-model="form.jobName"
          placeholder="请输入岗位名称"
          clearable
          @keyup.native.enter="handleSearch"
          @clear="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="relative position-content">
      <p class="flex justify-end absolute" style="right: 0; top: -20px">
        <el-button
          type="primary"
          size="small"
          @click="visibleDrawerAddPosition = true"
        >新增</el-button>
      </p>
      <p class="absolute" style="bottom: 10px; left: 0">
        <el-button
          type="danger"
          size="small"
          @click="handleClickBatchDelete"
        >批量删除</el-button>
      </p>
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
        if-index
        index-location="none"
        :checkbox="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <template slot="roleList" slot-scope="{ row }">
          <el-tag
            v-for="item in row.roleList"
            :key="item.label"
            style="margin: 5px"
            class="text_hidden_tag"
            :title="item.roleName"
            effect="plain"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
        <!-- <template slot="userNum" slot-scope="{ row }">
          {{ row.userNum === '0' ? '——' : row.userNum || '——' }}
        </template> -->
        <div slot="action" slot-scope="{ row }">
          <el-button type="text" @click="handleClickEdit(row)">修改</el-button>
          <el-button
            type="text"
            class="red-cls"
            @click="handleClickDelete(row)"
          >删除</el-button>
        </div>
      </MPageLayout>
    </div>
    <drawer-add-position
      :visible.sync="visibleDrawerAddPosition"
      @success="queryPositionList"
    />
    <drawer-edit-position
      :row="editRow"
      :visible.sync="visibleDrawerEditPosition"
      @success="queryPositionList"
    />
  </div>
</template>
<script>
import { tableColumns } from './tableColumns'

import { jobPageList, jobDelete } from './api/job.js'

import DrawerAddPosition from './components/DrawerAddPosition.vue'
import DrawerEditPosition from './components/DrawerEditPosition.vue'
export default {
  components: {
    DrawerAddPosition,
    DrawerEditPosition
  },
  data() {
    return {
      form: {
        jobName: undefined
      },
      loading: false,
      slotArr: ['action', 'roleList', 'userNum'],
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: tableColumns
      },
      actionButtons: [
        { label: '修改', value: 0 },
        { label: '删除', value: 1 }
      ],
      visibleDrawerAddPosition: false,
      visibleDrawerEditPosition: false,
      editRow: {},
      selectAllRow: []
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.queryPositionList()
    },
    async queryPositionList() {
      const params = {
        ...this.form,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      this.loading = true
      const res = await jobPageList(params)
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.loading = false
    },
    handleClickDelete(row) {
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await jobDelete(row.jobId)
          this.$message.success('删除成功')
          this.queryPositionList()
        })
        .catch(() => {})
    },
    handleClickEdit(row) {
      this.visibleDrawerEditPosition = true
      this.editRow = row
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.queryPositionList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.queryPositionList()
    },
    handleSelectionChange(val) {
      this.selectAllRow = val
    },
    handleClickBatchDelete() {
      if (this.selectAllRow.length === 0) {
        return this.$message.warning('请先选择岗位')
      }
      const jopIds = []
      this.selectAllRow.forEach(item => {
        jopIds.push(item.jobId)
      })
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await jobDelete(jopIds)
            this.$message.success('删除成功')
            this.queryPositionList()
          } catch (e) {
            this.queryPositionList()
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep .my-table {
  margin: 0;
}
.position-managment-container {
  @include responsive-height(20px);
  width: 100%;
  padding: 20px;
  border-radius: 5px;
  background: #fff;
}
.position-content {
  height: calc(100% - 60px);
}
::v-deep .tablePage .page_footer {
  justify-content: flex-end;
  width: 100%;
}
.red-cls {
  color: #f53f3f;
}
</style>
