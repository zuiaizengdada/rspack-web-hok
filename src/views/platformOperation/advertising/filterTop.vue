<template>
  <div class="filterTop">
    <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
      <el-form-item label="广告类型">
        <el-select v-model="search.type" class="w-200" placeholder="请选择" clearable @clear="clearFn">
          <el-option
            v-for="(item, key) in typeOption"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="广告名称">
        <el-input v-model.trim="search.name" class="w-200" placeholder="请输入" clearable maxlength="50" @clear="clearFn" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchFn">查询</el-button>
        <el-button @click="handleClear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { adType } from './columns'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          type: '',
          name: ''
        }
      }
    }
  },
  data() {
    return {
      typeOption: adType
    }
  },
  mounted() {},
  methods: {
    // 筛选栏单独点击清空按钮事件触发
    clearFn() {
      this.$emit('searchFn')
    },
    // 点击重置按钮
    handleClear() {
      this.$emit('clear')
    },
    // 点击查询按钮
    handleSearchFn() {
      this.$emit('searchFn')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
    margin-top: 16px;
    margin-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
}
::v-deep {
  .tearchInput {
    width: 100%;
  }
  label {
    font-weight: normal;
    color: #333;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
