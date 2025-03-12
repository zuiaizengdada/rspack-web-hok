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
      <el-form-item label="用户账号">
        <el-input
          v-model.trim="search.userAccount"
          placeholder="请输入用户账号"
        />
      </el-form-item>
      <el-form-item label="举报类型">
        <el-select
          v-model="search.reportsType"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          @change="onSearch"
        >
          <el-option :label="'有害/不安全'" :value="1"> 有害/不安全 </el-option>
          <el-option :label="'涉政不当言论'" :value="2">
            涉政不当言论
          </el-option>
          <el-option :label="'色情低俗'" :value="3"> 色情低俗 </el-option>
          <el-option :label="'谩骂攻击'" :value="4"> 谩骂攻击 </el-option>
          <el-option :label="'违法犯罪'" :value="5"> 违法犯罪 </el-option>
          <el-option :label="'其他'" :value="99"> 其他 </el-option>
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

      <el-divider class="divider" />
    </el-form>
  </div>
</template>

<script>
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
      loading: false
    }
  },
  methods: {
    deptChange() {
      this.$nextTick(() => {
        this.$refs.cascader1.dropDownVisible = false
      })
      this.onSearch()
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
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
  .form .el-form-item {
    margin-bottom: 0;
  }
  .divider {
    margin: 20px 0;
    background-color: #e7e7e7;
  }
}
.addBtn {
  margin-bottom: 20px;
}
</style>
