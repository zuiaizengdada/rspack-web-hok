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
      <el-form-item label="印章名称">
        <el-input
          v-model="search.sealName"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="印章类型">
          <el-select
          v-model="search.sealType"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in sealTypeOption"
            :key="item.value"
              :value="item.value"
              :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司">
        <el-select
          v-model="search.companyId"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
         <el-select
          v-model="search.status"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
           v-for="item in statusOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
        </el-select>
        
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
import { getCompanyListAjax } from '@/api/businessAdmin/talentFile'
import { statusOption, sealTypeOption } from '../../../options'

import { jobNoPageList } from '@/views/system/positionManagement/api/job'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
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
      deptOptions: [],
      statusOption,
      sealTypeOption
    }
  },
  mounted() {
    this.getCompanyPageList()
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
