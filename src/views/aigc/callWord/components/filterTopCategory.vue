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
      <el-form-item label="分类名称">
        <!-- 提示词名称 -->
        <el-input
          v-model="search.classifyName"
          placeholder="请输入分类名称"
          clearable
          style="width: 200px"
        />
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
      <el-button size="small" type="primary" @click="handleAddClick">
        新增提示词分类
      </el-button>
    </div>
  </div>
</template>

<script>
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
      callWordCategoryList: []
    }
  },

  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .form {
    width: 100%;
  }

  .action {
    flex: 1;
  }
}
</style>
