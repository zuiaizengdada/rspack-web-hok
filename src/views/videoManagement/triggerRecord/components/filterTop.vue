<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <el-form-item label="内容">
        <el-input v-model="searchForm.content" placeholder="内容" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="发布平台">
        <el-select v-model="searchForm.platformId" filterable placeholder="发布平台" clearable @change="getListForSearch">
          <el-option
            v-for="item in platformArray"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布者">
        <el-select v-model="searchForm.userId" clearable filterable placeholder="发布者" @change="getListForSearch">
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
      <el-form-item label="视频组名称">
        <el-input v-model="searchForm.videoGroupName" placeholder="视频组名称" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="视频名称">
        <el-input v-model="searchForm.videoName" placeholder="视频名称" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.timeArray"
          class="m-l-10 datePicker"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="日期选择：开始日期"
          end-placeholder="结束日期"
          @change="getListForSearch"
        />
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
    tearchArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    platformArray: {
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
          content: '',
          platformId: '',
          userId: '',
          videoGroupName: '',
          videoName: '',
          timeArray: []
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
