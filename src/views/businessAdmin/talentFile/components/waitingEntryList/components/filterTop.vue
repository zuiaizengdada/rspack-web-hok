<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="auto"
      size="small"
      :inline="true"
      class="form"
    >
      <el-form-item label="人员搜索">
        <div class="flex">
          <el-select
            v-model="search.searchType"
            class="input-with-select input-with-select-chang"
            @change="changeSearchType"
          >
            <el-option
              v-for="item in assetInfoList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-input
            v-if="search.searchType === 0"
            key="text"
            v-model="search.searchValue"
            class="input-with-input"
            placeholder="请输入"
            style="width: 160px"
            clearable
          />
          <el-input
            v-else
            key="number"
            v-model="search.searchValue"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            class="input-with-input"
            placeholder="请输入"
            style="width: 160px"
            clearable
          />
        </div>
      </el-form-item>

      <el-form-item label="公司">
        <!-- 入职公司 -->
        <el-select
          v-model="search.entryCompanyId"
          clearable
          filterable
          placeholder="请选择入职公司"
          style="width: 100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <!-- 入职部门 -->
        <el-cascader
          v-model="search.entryDepartmentId"
          style="width: 160px"
          placeholder="请选择入职部门"
          :options="deptOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          clearable
          @change="handleChange"
        />
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

      <el-form-item label="入职时间">
        <el-date-picker
          v-model="search.time"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChangeTime"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="onSearch"
      >
        查询
      </el-button>
      <el-button size="small" @click="onClear">重置</el-button>
    </el-form>
  </div>
</template>

<script>
import { getDeptData } from '@/utils/getApiData'
import { querySubjectList } from '@/api/businessAdmin/talentFile'

import { jobNoPageList } from '@/views/system/positionManagement/api/job'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          orgId: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      approvalStatusList: [
        {
          label: '待面试',
          value: 1
        },
        {
          label: '已面试待定',
          value: 2
        },
        {
          label: '录用审批中',
          value: 3
        },
        {
          label: '录用被驳回',
          value: 4
        }
      ],
      assetInfoList: [
        { label: '姓名', value: 0 },
        { label: '手机号', value: 1 }
      ],
      jobList: [],
      companyList: [],
      deptOptions: []
    }
  },
  mounted() {
    this.getCompanyPageList()
    this.getDept()
    this.getJobList()
  },
  methods: {
    async getDept() {
      const dept = await getDeptData()
      this.deptOptions = dept
    },
    handleChange(data) {
      if (!data) return
      this.getTreeLabelById(this.deptOptions, data)
    },
    getTreeLabelById(data, id) {
      data.forEach(i => {
        if (i.value === id) {
          this.form.deptName = i.label
        }
        if (i.children && i.children.length) {
          this.getTreeLabelById(i.children, id)
        }
      })
    },
    changeSearchType() {
      this.search.searchValue = ''
    },
    async getCompanyPageList() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }

      querySubjectList(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.companyList = res.data.items.filter(item => item.status === 0)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleChangeTime(value) {
      if (value === null) {
        this.form.expectedEntryTimeStart = ''
        this.form.expectedEntryTimeEnd = ''
        this.onSearch()
        return
      }
      this.form.expectedEntryTimeStart = value[0]
      this.form.expectedEntryTimeEnd = value[1]
      this.onSearch()
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data
    },

    // 点击查询按钮
    onSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    }
    // 点击新增规则按钮
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  margin-bottom: 0 !important;
}

.input-with-select {
  width: 88px;
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
</style>
