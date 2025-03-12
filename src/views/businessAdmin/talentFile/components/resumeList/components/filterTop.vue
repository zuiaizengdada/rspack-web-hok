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
        <!-- 岗位 -->
        <el-select
          v-model="search.positionId"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="HRBP">
        <!-- hrbp -->
        <el-select
          v-model="search.hrbpId"
          clearable
          filterable
          placeholder="请选择HRBP"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
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
import { userNoPage } from '@/api/addressBookApi'
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
      assetInfoList: [
        { label: '姓名', value: 0 },
        { label: '手机号', value: 1 }
      ],
      userList: [],
      jobList: []
    }
  },
  created() {
    this.getJobList()
    this.getUserList()
  },
  methods: {
    changeSearchType() {
      this.search.searchValue = ''
    },
    deptChange() {
      this.$nextTick(() => {
        this.$refs.cascader1.dropDownVisible = false
      })
      this.onSearch()
    },

    async getUserList() {
      const res = await userNoPage()

      this.userList = res.data.flat()
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data.flat()
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
</style>
