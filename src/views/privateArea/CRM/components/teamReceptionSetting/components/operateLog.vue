<template>
  <el-dialog
    title="操作日志"
    :visible.sync="visible"
    width="728px"
    append-to-body
    class="dialog-container"
    :close-on-click-modal="false"
  >
    <dynamicTable
      ref="table"
      v-model="tableData"
      class="dialog-table"
      immediate-check
      :columns="columns"
      :get-list-api="getList"
    >
      <template #radio="{ row }">
        <el-radio v-model="selectValue" :label="row.id" />
      </template>
    </dynamicTable>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="visible = false">确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import {
  receptionStaffLogPage
} from '@/api/privateArea/toolbox'
export default {
  name: 'OperateLog',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      visible: false,
      taskId: '',
      columns: [
        {
          prop: 'userName',
          label: '操作人',
          visible: true
        },
        {
          prop: 'createTime',
          label: '操作时间',
          visible: true
        },
        {
          prop: 'content',
          label: '操作内容',
          visible: true
        }
      ],
      isDefault: false
    }
  },
  methods: {
    getList(params) {
      return receptionStaffLogPage({
        ...params,
        taskId: this.taskId,
        isDefault: this.isDefault
      })
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    open(taskId, isDefault) {
      this.visible = true
      this.isDefault = isDefault
      this.taskId = taskId
      this.onRefresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container ::v-deep{
    .el-dialog__header{
        border-bottom: 1px solid #E7E7E7;
    }
    .filter-container{
        padding: 0px;
    }
    .my-table{
        margin:0px;
    }
    .dialog-table{
        border-radius: 6px;
        border: 1px solid #EFF2F6;
        height: 550px;
    }
}

</style>
