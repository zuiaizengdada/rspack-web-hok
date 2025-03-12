<template>
  <div class="search-container">
    <el-form
      :inline="true"
      size="small"
      :model="form"
      class="search-form"
    >
      <el-form-item label="跟进人">
        <el-input
          v-model="form.userName"
          style="width:140px"
          clearable
          placeholder="请输入"
          @change="onSubmit"
        />
      </el-form-item>
      <el-form-item label="分配状态">
        <el-select
          v-model="form.receptionStatus"
          style="width:140px"
          clearable
          placeholder="请选择"
          @change="onSubmit"
        >
          <el-option label="正常分配" :value="1" />
          <el-option label="暂停分配" :value="2" />
        </el-select>
      </el-form-item>
      <div class="flex flex-between flex-1">
        <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        <el-button
          v-if="type === 'edit'"
          size="small"
          @click="handleShowLog"
        >操作日志</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>

export default {

  props: {
    type: {
      default: 'add',
      type: String
    }
  },
  data() {
    return {
      form: {
        receptionStatus: '',
        userName: ''
      }
    }
  },
  methods: {
    handleShowLog() {
      this.$emit('show')
    },
    onSubmit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container ::v-deep{
    margin:20px 20px 0 20px;
    .search-form{
        display: flex;
        .el-button{
            height: 32px;
        }
    }
}
</style>
