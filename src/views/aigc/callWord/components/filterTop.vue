<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="auto"
      size="small"
      :inline="true"
      class="form"
    >
      <el-form-item label="提示词名称">
        <!-- 提示词名称 -->
        <el-input
          v-model="search.templateTitle"
          placeholder="请输入提示词名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item label="提示词分类">
        <!-- 提示词分类 -->
        <el-select
          v-model="search.templateClassifyId"
          clearable
          filterable
          placeholder="请输入提示词分类"
          style="width: 100%"
        >
          <el-option
            v-for="item in templateCategoryList"
            :key="item.id"
            :label="item.classifyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="onSearch"
      >
        查询
      </el-button>
      <el-button size="small" @click="onClear">重置</el-button>
    </el-form>
    <div class="action">
      <el-button size="small" type="primary" @click="gotoPage">
        提示词分类管理
      </el-button>
      <el-button size="small" type="primary" plain @click="handleAddClick">
        新增提示词模板
      </el-button>
    </div>
  </div>
</template>

<script>
import { queryTemplateCategoryList } from '@/api/aigc/callWord'

export default {
  props: {
    search: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      // 提示词分类下拉列表
      templateCategoryList: []
    }
  },
  mounted() {
    this.setTemplateCategoryList()
  },
  methods: {
    // 设置提示语模板分类下拉框
    async setTemplateCategoryList() {
      const params = {
        pageNum: 1,
        pageSize: 9999
      }

      const {
        code,
        data: { items }
      } = await queryTemplateCategoryList(params)

      if (code === 1) {
        this.templateCategoryList = items
      }
    },
    // 点击查询按钮
    onSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    },
    handleAddClick() {
      this.$emit('add')
    },
    // 跳转到提示词分类管理
    gotoPage() {
      this.$router.push({
        path: '/callWord/category'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  padding-bottom: 15px;
  border-bottom: 1px solid #e7e7e7;

  .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
