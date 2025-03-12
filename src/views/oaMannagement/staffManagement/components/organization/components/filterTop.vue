<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <el-form
      ref="form"
      class="filter-module"
      :model="search"
      label-width="80px"
      size="small"
      :inline="true"
    >
      <el-form-item label="人员搜索">
        <div class="flex">
          <el-select
            v-model="search.text.label"
            class="input-with-select input-with-select-chang"
            placeholder="请选择"
          >
            <el-option
              v-for="item in curOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model.trim="search.text.value"
            class="input-with-input"
            style="width: 160px"
            placeholder="请输入"
            clearable
            @clear="sureSearch"
            @keyup.enter.native="sureSearch"
          />
        </div>
      </el-form-item>
      <el-form-item label="岗位">
        <el-select v-model="search.positionId" clearable filterable>
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :value="item.jobId"
            :label="item.jobName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" v-if="['probation', 'all'].includes(type)">
        <el-date-picker
          v-model="search.entryTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChangeTime($event, 'entryTimeStart', 'entryTimeEnd')"
        />
      </el-form-item>
      <el-form-item
        label="预计转正时间"
        label-width="95px"
        v-if="type === 'probation'"
      >
        <el-date-picker
          v-model="search.expectedRegularDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="
            handleChangeTime(
              $event,
              'expectedRegularDateStart',
              'expectedRegularDateEnd'
            )
          "
        />
      </el-form-item>

      <el-form-item label="转正时间" v-if="type === 'regular'">
        <el-date-picker
          v-model="search.regularTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="
            handleChangeTime($event, 'regularTimeStart', 'regularTimeEnd')
          "
        />
      </el-form-item>

      <el-form-item label="离职时间" v-if="type === 'quit'">
        <el-date-picker
          v-model="search.departureTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="
            handleChangeTime($event, 'departureTimeStart', 'departureTimeEnd')
          "
        />
      </el-form-item>

      <el-form-item label="入职公司">
        <!-- 公司 -->
        <el-select
          v-model="search.companyId"
          clearable
          filterable
          placeholder="请选择公司"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <div :class="{'dp_i_b': type !== 'review'}">
        <el-form-item label="状态" v-if="type === 'review'">
          <!-- 状态 -->
          <el-select v-model="search.status" filterable placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="sureSearch"
            >查询</el-button
          >
          <el-button size="small" @click="clear()">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCompanyListAjax } from '@/api/businessAdmin/talentFile'
// import { getDeptData } from '@/utils/getApiData'
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import moment from 'moment'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'type'],
  data() {
    return {
      options: [
        { label: '姓名', value: 'name' },
        { label: '工号', value: 'jobNumber' }
      ],
      reviewOptions: [
        { label: '姓名', value: 'name' },
        { label: '手机号', value: 'phone' }
      ],
      employeeArray: [
        { label: '全部', value: -1 },
        { label: '在职', value: 0 },
        { label: '离职', value: 1 }
      ],
      timeOptions: [
        { label: '创建时间', value: 1 },
        { label: '更新时间', value: 2 }
      ],
      statusOptions: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '待落章', value: 2 },
        { label: '已审核', value: 3 }
      ],
      searchOpen: false,
      companyList: [],
      jobList: []
    }
  },
  created() {
    this.getCompanyPageList()
    this.getJobList()
  },
  computed: {
    curOptions() {
      return this.type === 'review' ? this.reviewOptions : this.options
    }
  },
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        deptName: '',
        text: { label: 'name', value: '' },
        loading: false,
        deptType: 0,
        companyId: '',
        positionId: ''
      }
      this.$emit('search', res)
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data
    },
    getCompanyPageList() {
      getCompanyListAjax()
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.companyList = res.data.filter(item => item.status === 0)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleChangeTime(value, start, end) {
      if (value === null) {
        this.search[start] = ''
        this.search[end] = ''
        return
      }
      this.search[start] = moment(value[0]).valueOf()
      this.search[end] = moment(value[1]).valueOf()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 100px;
  height: 32px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-radius: 3px 0px 0px 3px;
}
.input-with-select-chang {
  ::v-deep .el-input__inner {
    border: none;
    border-radius: 3px 0px 0px 3px;
    border: 1px solid #d8dce6 !important;
    border-right: none !important;
  }
}
.input-with-input {
  ::v-deep .el-input__inner {
    border-radius: 0px 3px 3px 0px;
  }
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
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
 .dp_i_b {
   display: inline-block;
 }
</style>
