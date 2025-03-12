<template>
  <div>
    <MPageLayout
      ref="MPageLayout"
      class="page_content"
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
        <filterTop
          :search="search"
          @onSearch="onSearchFn"
          @onClear="onClear"
          @onAdd="add"
        />
      </template>

      <template slot="action" slot-scope="scope">
        <div>
          <el-button
            type="text"
            :disabled="scope.row.createType === 2"
            @click="edit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            class="c_red"
            :disabled="scope.row.createType === 2"
            @click="del(scope.row)"
          >
            删除
          </el-button>
        </div>
      </template>
    </MPageLayout>
    <createOrEditDialog
      v-if="visibleDialog"
      v-model="visibleDialog"
      :row="info"
      @success="submitSuccess"
      @close="visibleDialog = false"
    />
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { getColumns } from './columns'
import createOrEditDialog from './createOrEditDialog'
import { voicesPage, voicesDel } from '@/api/aiVideoManage'

export default {
  components: {
    filterTop,
    createOrEditDialog
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'img'],
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
      bigImgVisible: false,
      // type horizontal-横图 vertical-竖图
      selectImg: { type: '', url: '' },
      visibleDialog: false
    }
  },
  created() {
    this.onSearchFn()
  },
  methods: {
    submitSuccess() {
      this.bigImgVisible = false
      this.onSearchFn()
    },
    openBigImg(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
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
    add() {
      this.info = {}
      this.visibleDialog = true
    },
    // 点击编辑按钮
    edit(row) {
      this.info = {
        ...row
      }
      this.visibleDialog = true
    },
    del(row) {
      this.$confirm('此操作将永久删除该声音, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        voicesDel({ id: row.id }).then(res => {
          if (res.code === 1) {
            this.$message.success({ title: '提示', message: '删除成功' })
            this.onSearchFn()
          }
        })
      })
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
      voicesPage(params)
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
.page_content {
  height: calc(100vh - 190px);
}
::v-deep {
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d0d0d0;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
}
</style>
