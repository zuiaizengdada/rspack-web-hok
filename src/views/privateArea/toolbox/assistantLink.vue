<template>
  <!-- 获客助手链接 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      style="height: calc(100vh - 220px)"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <div class="m-t-20 m-b-20">
          <el-input
            v-model="search.name"
            class="w-200 m-r-20"
            size="small"
            placeholder="请输入链接名称"
          />
          <el-button
            size="small"
            type="primary"
            @click="searchFn"
          >查询</el-button>
          <el-button size="small" @click="clear()">重置</el-button>
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          type="text"
          @click="onhandleEdit(scope.row)"
        >设为兜底</el-button>
        <el-button
          v-if="scope.row.linkStatus === 2"
          type="text"
          @click="handleGenerateUrl(scope.row)"
        >重新生成</el-button>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
const linkStatus = { 1: '正常', 2: '失效' }
import {
  gethkPage,
  setlsHKDefault,
  regenerationUrl
} from '@/api/privateArea/toolbox'
export default {
  components: {},
  data() {
    return {
      slotArr: ['action', 'search', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'linkName', label: '链接名称', type: 'text' },
          { prop: 'url', label: '链接地址', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'text' },
          { prop: 'updateTime', label: '更新时间', type: 'text' },
          {
            prop: 'isDefault',
            label: '是否兜底',
            type: 'text',
            render: row => {
              return { 0: '否', 1: '是' }[row.isDefault]
            }
          },
          {
            prop: 'linkStatus',
            label: '状态',
            type: 'text',
            width: 100,
            slotFn: row => linkStatus[row.linkStatus]
          },
          { width: '150px', prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        name: ''
      },
      loading: false
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    clear() {
      this.search.name = ''
      this.searchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        linkName: this.search.name
      }
      gethkPage(data)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    async handleGenerateUrl(row) {
      const { code } = await regenerationUrl({
        id: row.id
      })
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.getList()
        this.loading = false
      }
    },
    // 点击设为兜底
    onhandleEdit(row) {
      console.log(row, '点击设为兜底')
      this.loading = true
      const data = {
        userId: row.userId
      }
      setlsHKDefault(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(76px);
  padding: 0 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
