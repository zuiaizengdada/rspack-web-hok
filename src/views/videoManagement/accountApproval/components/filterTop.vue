<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <el-form-item label="账号名称">
        <el-input v-model="searchForm.accountName" placeholder="账号名称" clearable @clear="getListForSearch" />
      </el-form-item>
      <el-form-item label="平台">
        <el-select v-model="searchForm.platformId" filterable placeholder="请选择平台" clearable @change="getListForSearch">
          <el-option
            v-for="item in platformArray"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审批类型">
        <el-select v-model="searchForm.type" filterable placeholder="请选择审批类型" clearable @change="getListForSearch">
          <el-option
            v-for="item in approveArray"
            :key="item.approveId"
            :label="item.approveName"
            :value="item.approveId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP">
        <el-select
          v-model="searchForm.teacherId"
          remote
          :remote-method="tearchFilter"
          clearable
          filterable
          placeholder="请选择IP"
          @blur="()=>tearchFilter('')"
          @change="handleChangeTeacher"
        >
          <el-option-group
            v-for="group in filteredGroups(tearchArray)"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="运营者">
        <el-select
          v-model="searchForm.operatorId"
          clearable
          filterable
          placeholder="运营者"
          @change="handleChangeUser(1)"
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
            > <span style="float: left">{{ item.label }}</span>
              <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="申请者">
        <el-select
          v-model="searchForm.applicantId"
          clearable
          filterable
          placeholder="申请者"
          @change="handleChangeUser(2)"
        >
          <el-option-group
            v-for="group in userArray1"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            > <span style="float: left">{{ item.label }}</span>
              <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchForm.status!=1" label="审批者">
        <el-select
          v-model="searchForm.examineUserId"
          size="mini"
          clearable
          filterable
          placeholder="审批者"
          @change="handleChangeUser(3)"
        >
          <el-option-group
            v-for="group in userArray2"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            > <span style="float: left">{{ item.label }}</span>
              <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.timeArray"
          class="datePicker"
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
        <el-button v-permission="['web:accountMange:approval', permsList]" size="small" style="width: 130px;" type="primary" class="accoutSetting" @click="goApproval">账号审批设置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { filteredGroups } from '@/utils/videoMange'

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
    userArray1: {
      type: Array,
      default: () => {
        return []
      }
    },
    userArray2: {
      type: Array,
      default: () => {
        return []
      }
    },
    approveArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchForm: {
      type: Object,
      default: () => {
        return {
          accountName: '', // 账号名称
          status: '1', // 审批状态
          operatorId: '', // 运营者
          platformId: '', // 平台ID
          teacherId: '', // IP
          applicantId: '', // 申请人
          examineUserId: '', // 审批人
          type: '', // 审批类型
          timeArray: []
        }
      }
    }
  },
  data() {
    return {
      filteredGroups,
      permsList: this.$route.meta.permsList || []
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
    },
    handleChangeUser(type) {
      console.log(type, '类型type')
      this.$emit('handleChangeUser', this.searchForm, type)
    },
    async tearchFilter(query = '') {
      setTimeout(() => {
        this.$emit('tearchFilter', query)
      }, 300)
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
