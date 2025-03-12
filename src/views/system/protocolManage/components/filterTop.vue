<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <el-form-item>
        <el-input v-model="searchForm.protocolName" clearable placeholder="请输入协议名称" @clear="getListForSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.userId" clearable filterable placeholder="用户名称" @change="getListForSearch">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="状态" @change="getListForSearch">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.userStatus" clearable placeholder="用户状态" @change="getListForSearch">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListForSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    userArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchForm: {
      type: Object,
      default: () => {
        return {
          protocolName: '',
          userId: '',
          status: '',
          userStatus: ''
        }
      }
    }
  },
  data() {
    return {
      options: [{
        value: '1',
        label: '已签订'
      }, {
        value: '0',
        label: '未签订'
      }],
      options1: [{
        value: '1',
        label: '已离职'
      }, {
        value: '0',
        label: '未离职'
      }]
    }
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    getListForSearch() {
      this.$emit('getListForSearch', this.searchForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin-top: 18px;
  //   margin-left: 20px;
  //   margin-right: 20px;
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
