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
      deptList: [],
      loading: false,
      assetInfoList: [
        { label: '姓名', value: 0 },
        { label: '手机号', value: 1 }
      ],
      jobList: []
    }
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    changeSearchType() {
      this.search.searchValue = ''
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
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
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
// ::v-deep {
//   label {
//     font-weight: normal;
//     color: #333;
//   }
//   .form .el-form-item {
//     margin-bottom: 0;
//   }
//   .divider {
//     margin: 20px 0;
//     background-color: #e7e7e7;
//   }
// }
// .addBtn {
//   margin-bottom: 20px;
// }
</style>
