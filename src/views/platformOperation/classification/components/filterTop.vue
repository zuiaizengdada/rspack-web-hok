<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="分类名称">
        <el-input v-model.trim="search.catalogueName" placeholder="请输入" class="w-200" filterable clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleClear">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="small" class="fr" @click="handleAdd"><i class="el-icon-plus" />新增一级分类</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          catalogueName: ''
        }
      }
    }
  },
  methods: {
    handleAdd() {
      this.$emit('handleAdd')
    },
    handleSearch() {
      this.$emit('handleSearch')
    },
    handleClear() {
      this.$emit('handleClear')
    }
  }
}
</script>
<style lang="scss" scoped>
.filterTop{
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  padding:0 25px;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
