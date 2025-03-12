<template>
  <el-dialog title="提示" :visible.sync="visible" width="800px">
    <dynamicTable
      ref="table"
      v-model="dataList"
      class="reception-table"
      :immediate-check="true"
      :columns="columns"
      :get-list-api="getList"
    />
  </el-dialog>
</template>

<script>
import { getColumns } from './columns'
import { taskEditLog, taskEditTypeList } from '@/api/privateArea/toolbox'
import dynamicTable from '@/components/DynamicTable/table'
export default {
  components: { dynamicTable },
  data() {
    return {
      initForm: {},
      dataList: [],
      columns: getColumns.call(this),
      params: {},
      visible: false,
      taskId: '',
      options: {}
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    open(row) {
      this.visible = true
      this.taskId = row.id
      this.onRefresh()
    },
    getList(params) {
      return taskEditLog({
        ...params,
        taskId: this.taskId
      })
    },
    getOptions() {
      taskEditTypeList().then(res => {
        this.columns[2].formProps.options = res.data.map(i => {
          return {
            value: i.editType,
            label: i.editTypeName
          }
        })
        const data = res.data
        data.forEach(i => {
          this.options[i.editType] = i.editTypeName
        })
      })
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.reception-table::v-deep {
  .filter-container {
    padding: 0px;
  }
  .el-table {
    border-radius: 6px;
    height: 400px !important;
    border: 1px solid #d8dce6;
  }
}
</style>
