<template>
  <MCard class="callword-category">
    <!-- 面包屑 -->
    <el-breadcrumb
      class="card-breadcrumb"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item to="/callWord">提示词模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>提示词分类管理</el-breadcrumb-item>
    </el-breadcrumb>

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
          <FilterTopCategory
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
            >修改</el-button>
            <el-button
              style="color: #f53f3f"
              type="text"
              @click="handleDelClick(scope.row)"
            >删除</el-button>
          </div>
        </template>
      </MPageLayout>
    </div>

    <!-- 删除弹框 -->
    <DeleteDialog
      :row="row"
      :visible.sync="isShowDeleteDialog"
      @close="handleDeleteCloseClick"
      @submit="handleDeleteSumbitClick"
    />

    <!-- 新增/编辑抽屉 -->
    <CreateOrEditCategoryDrawer
      ref="createOrEditCategoryDrawerRef"
      :visible.sync="showCreateOrEditDrawer"
      @updata:visible="showCreateOrEditDrawer = $event"
      @update="getPageList"
    />
  </MCard>
</template>

<script>
import FilterTopCategory from './components/filterTopCategory.vue'
import DeleteDialog from './components/deleteDialog.vue'
import CreateOrEditCategoryDrawer from './components/createOrEditCategoryDrawer.vue'
import { getCategoryColumns } from './config'
import {
  queryTemplateCategoryList,
  deleteTemplateCategoryList
} from '@/api/aigc/callWord'

export default {
  name: 'CallWordCategory',
  components: { FilterTopCategory, DeleteDialog, CreateOrEditCategoryDrawer },
  data() {
    return {
      // 当前操作行
      row: {},
      // 页面查询参数
      pageParams: {
        // 提示词模板分类名称
        classifyName: '',
        // 是否是系统模板
        isSystem: true,
        // 用户id
        userId: 0,
        // 租户id
        tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        // 当前分页
        pageIndex: 1,
        // 每页显示条数
        pageSize: 10
      },
      // 表格配置
      config: {
        tableData: [],
        tableColumns: getCategoryColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 插槽
      slotArr: ['action', 'search', 'footer', 'headerLeft'],
      // 加载状态
      loading: false,
      // 是否展示删除弹框
      isShowDeleteDialog: false,
      // 是否展示新增/编辑抽屉
      showCreateOrEditDrawer: false
    }
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
  mounted() {
    this.handleSearch()
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
      this.$refs.createOrEditCategoryDrawerRef.getCustomTemplateDetail(
        row.id,
        type
      )
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
        id: row.id
      }
      const { code } = await deleteTemplateCategoryList(params)

      if (code === 1) {
        this.$message.success('删除成功')
        this.getPageList()
      }
    },
    // 获取数据列表
    async getPageList() {
      this.loading = true

      const { code, data } = await queryTemplateCategoryList(this.pageParams)

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
::v-deep {
  .el-breadcrumb__inner.is-link {
    color: #777777 !important;
  }

  .el-breadcrumb__inner {
    color: #333333 !important;
  }

  .el-breadcrumb__separator {
    color: #333333 !important;
  }
}

.callword-category {
  min-width: 1200px;
  height: calc(100% - 72px);
  padding: 10px 0 0 0 !important;

  .card-breadcrumb {
    padding: 10px 20px;
    font-size: 16px;
  }

  .page-layout-warpper {
    height: 95%;
  }
}
</style>
