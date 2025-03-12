<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchValue" class="w-200" placeholder="请输入关键词" clearable @keyup.enter.native="sureSearch" @clear="sureSearch" />
          </el-form-item>
          <el-form-item label="前端展示">
            <el-select v-model="search.displayFlag" placeholder="请选择" class="w-200" clearable @clear="sureSearch">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" @click="sureSearch">筛选</el-button>
            <el-button icon="el-icon-refresh" @click="clear()">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div></template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      searchOpen: false
    }
  },
  created() {
  },
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        searchValue: '',
        displayFlag: ''
      }
      this.$emit('search', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  display: flex;
  position: relative;
  .filterTopLeft {
    flex: 1 0 0;
  }
  .filterTopRight {
    border-left: 1px solid  #E7E7E7;
    padding: 20px;
    width: 107px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .fiterTopTagger {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
.filter-module {
  width: 100%;
  // min-width: 1122px;
  // background-color: #f5f7fa;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2A75ED;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
