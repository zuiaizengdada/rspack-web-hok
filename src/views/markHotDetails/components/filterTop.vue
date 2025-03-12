<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <div class="flex flex-end">
        <div>
          <el-form-item label="部门">
            <el-cascader v-model="searchForm.deptIdChain" :options="deptTreeArray" :props="{ checkStrictly: true }" clearable @change="visibleChangeD($event)" />
          </el-form-item>
          <el-form-item label="主编">
            <el-select v-model="searchForm.userId" clearable filterable placeholder="主编" @change="getListForSearch">
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
            <el-button type="primary" @click="getListForSearch">查询</el-button>
            <el-button @click="clear">重置</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    deptTreeArray: {
      type: Array,
      default: () => {
        return []
      }
    },
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
          deptIdChain: [],
          userId: ''
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
    visibleChangeD(val) {
      if (val) {
        this.searchForm.userId = ''
        this.$emit('visibleChangeD', val, this.searchForm)
      }
    },
    exportTable() {
      this.$emit('exportTable')
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
.flex-end{
  justify-content: space-between;
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
