<template>
  <div class="listBox">
    <el-form :inline="true" size="small" :model="form" class="demo-form-inline">
      <el-form-item label="渠道">
        <el-select v-model="form.region" style="width: 180px" placeholder="渠道">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="投放账号">
        <el-select v-model="form.region" style="width: 180px" placeholder="投放账号">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="投放计划">
        <el-select v-model="form.region" style="width: 180px" placeholder="投放计划">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <AppAreaSelect />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #action="{ row }">
        <el-button
          class="delete-r"
          type="text"
          @click="del(row)"
        >删除</el-button>
      </template>
      <template #submitBtn>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
    </dynamicTable>
    <AppDialog
      v-model="visible"
      title="权限设置"
      width="360px"
      :loading="loading"
      height="auto"
      @success="sure"
    />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'
import { getColumns } from './column'
export default {
  components: {
    dynamicTable,
    AppAreaSelect
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      form: {},
      loading: false
    }
  },
  methods: {
    getList(params) {
      return []
    },
    reset() {
      this.form = {}
    },
    add() {},
    onSubmit() {},
    sure() {}
  }
}
</script>

<style lang="scss" scoped>
.listBox::v-deep {
  height: 480px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .el-table th.el-table__cell {
    background: #f2f9ff !important;
  }
  .el-table {
    border-radius: 6px;
    min-height: 300px !important;
    border: 1px solid #d8dce6;
  }
}
</style>
