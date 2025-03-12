<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="searchForm.videoName" placeholder="请输入视频名称" clearable @change="getListForSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListForSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item class="right-float">
        <el-button type="primary" plain class="right-tools" @click="addDesensitiVideo">
          <i class="el-icon-plus" />
          新增培训视频</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    searchForm: {
      type: Object,
      default: () => {
        return {
          videoName: ''
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    getListForSearch() {
      this.$emit('getListForSearch', this.searchForm)
    },
    addDesensitiVideo() {
      this.$emit('addDesensitiVideo')
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
margin-top: 18px;
  margin-left: 20px;
  margin-right: 20px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .form-container{
    width: 100%;
    .form-item{
      flex: 1;
      min-width: 400px;
      .el-form-item__content{
         display: flex;
      }
    }
  }
  .search_box{
    display: flex;
    height: 33px;
    width: 100%;
    .search_right {
      margin-left: 20px;
      flex: 1 0 0;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
}
.right-float {
  float: right;
  margin-right: 0px;
}
.right-tools {
  float: right;
  border: 1px solid #0c6fff;
  color: #0c6fff;
  background: none !important;
  font-size: 14px;
}
.right-tools:hover {
  background: #0c6fff !important;
}
.el-icon-plus {
  font-weight: bold;
}
</style>
