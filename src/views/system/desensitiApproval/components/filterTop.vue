<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <el-form-item label="审批内容">
        <el-input v-model="searchForm.content" placeholder="审批内容" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="视频组名称">
        <el-input v-model="searchForm.videoGroupTitle" placeholder="视频组名称" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="视频名称">
        <el-input v-model="searchForm.videoName" placeholder="视频名称" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="申请者">
        <el-select
          v-model="searchForm.applicantUserId"
          size="mini"
          clearable
          filterable
          placeholder="申请者"
          @change="handleChangeTeacher"
        >
          <el-option-group
            v-for="group in userArray"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
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
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" @click="getListForSearch">查询</el-button>
          <el-button @click="clear">重置</el-button>
        </el-col>
        <el-button v-permission="['web:desensiti:approval', permsList]" size="small" plain style="width: 130px;" type="primary" class="accoutSetting" @click="goApproval">脱敏审批设置</el-button>
      </el-row>
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
          approveStatus: 1,
          applicantUserId: '',
          content: '',
          videoGroupTitle: '',
          videoName: '',
          timeArray: []
        }
      }
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      options: []
    }
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    goApproval() {
      this.$emit('goApproval')
    },
    getListForSearch() {
      this.$emit('getListForSearch', this.searchForm)
    },
    handleChangeTeacher() {
      this.$emit('handleChangeTeacher', this.searchForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin-top: 18px;
  padding-bottom: 20px;
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
