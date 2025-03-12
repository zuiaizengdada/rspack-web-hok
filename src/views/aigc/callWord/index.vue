<template>
  <MCard class="call-word">
    <!-- 表格 -->
    <div class="page-layout-warpper">
      <MPageLayout
        ref="MPageLayout"
        row-key="id"
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
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template slot="search">
          <FilterTop
            :search="pageParams"
            @onSearch="handleSearch"
            @onClear="handleClear"
            @add="handleAddClick"
          />
        </template>

        <template slot="action" slot-scope="scope">
          <div>
            <el-button
              type="text"
              @click="handleEditClick(scope.row, 'system')"
            >
              修改
            </el-button>
            <el-button
              style="color: #f53f3f"
              type="text"
              @click="handleDelClick(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </MPageLayout>
    </div>

    <!-- 删除弹框 -->
    <DeleteDialog
      :row="row"
      :visible="isShowDeleteDialog"
      @close="handleDeleteCloseClick"
      @submit="handleDeleteSumbitClick"
    />

    <!-- 新增/编辑抽屉 -->
    <CreateOrEditDrawer
      ref="createOrEditDrawerRef"
      :visible.sync="showCreateOrEditDrawer"
      @updata:visible="showCreateOrEditDrawer = $event"
      @update="getPageList"
    />
  </MCard>
</template>

<script>
import FilterTop from './components/filterTop.vue'
import DeleteDialog from './components/deleteDialog.vue'
import CreateOrEditDrawer from './components/createOrEditDrawer.vue'
import { getColumns } from './config'
import { queryTemplateList, deleteTemplateList } from '@/api/aigc/callWord'

export default {
  name: 'CallWord',
  components: { FilterTop, DeleteDialog, CreateOrEditDrawer },
  data() {
    return {
      // 当前操作行
      row: {},
      // 页面查询参数
      pageParams: {
        // 是否是系统模板
        isSystem: true,
        // 提示词名称
        templateTitle: '',
        // 提示词分类ID
        templateClassifyId: '',
        // 当前分页
        pageIndex: 1,
        // 每页显示条数
        pageSize: 10
      },
      // 表格配置
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 插槽
      slotArr: ['action', 'search', 'footer', 'headerRight'],
      // 加载状态
      loading: false,
      // 是否展示删除弹框
      isShowDeleteDialog: false,
      // 是否展示新增/编辑抽屉
      showCreateOrEditDrawer: false
    }
  },
  mounted() {
    this.handleSearch()
  },
  updated() {
    this.$nextTick(() => {
      if (
        this.$refs.MPageLayout.$refs.pageLayout.$refs.mTable &&
        this.$refs.MPageLayout.$refs.pageLayout.$refs.mTable.doLayout
      ) {
        this.$refs.MPageLayout.$refs.pageLayout.$refs.mTable.doLayout()
      }
    })
  },
  methods: {
    // 点击查询按钮
    handleSearch() {
      this.config.currentPage = 1
      this.getPageList()
    },
    // 重置数据
    resetData(data) {
      return data ? this.$options.data()[data] : this.$options.data()
    },
    // 点击重置按钮
    handleClear() {
      this.pageParams = this.resetData('pageParams')

      this.handleSearch()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.pageParams.pageIndex = 1
      this.config.pageSize = val
      this.config.currentPage = 1

      this.getPageList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.pageParams.pageIndex = val
      this.config.currentPage = val

      this.getPageList()
    },
    handleAddClick() {
      this.showCreateOrEditDrawer = true
    },
    // 点击修改按钮
    handleEditClick(row, type) {
      this.showCreateOrEditDrawer = true
      this.$refs.createOrEditDrawerRef.getCustomTemplateDetail(row.id, type)
    },
    // 点击删除按钮
    handleDelClick(row) {
      this.row = row
      this.isShowDeleteDialog = true
    },
    // 删除弹框关闭
    handleDeleteCloseClick() {
      this.isShowDeleteDialog = false
    },
    // 删除弹框确定
    async handleDeleteSumbitClick(row) {
      this.isShowDeleteDialog = false
      const params = {
        id: row.id,
        isSystem: true
      }

      const { code } = await deleteTemplateList(params)

      if (code === 1) {
        this.$message.success('删除成功')
        this.getPageList()
      }
    },
    // 获取数据列表
    async getPageList() {
      this.loading = true

      const { code, data } = await queryTemplateList(this.pageParams)

      if (code === 1) {
        this.config.tableData = data.items
        this.config.total = data.total
      }

      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.call-word {
  min-width: 1200px;
  height: calc(100% - 72px);
  padding: 10px 0 0 0 !important;

  .page-layout-warpper {
    height: 100%;
  }
}
</style>
