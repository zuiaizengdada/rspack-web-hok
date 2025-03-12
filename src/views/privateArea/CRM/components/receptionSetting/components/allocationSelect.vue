<template>
  <el-dialog
    title="选择分配规则"
    :visible.sync="visible"
    width="728px"
    top="80px"
    append-to-body
    class="dialog-container"
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      size="small"
      :model="form"
      class="search-form"
    >
      <el-form-item label="分配规则名称">
        <el-input
          v-model="form.name"
          style="width:140px"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onRefresh">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <dynamicTable
      ref="table"
      v-model="tableData"
      immediate-check
      class="dialog-table"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #radio="{ row }">
        <el-radio v-model="warehouseId" :label="row.id"><span /></el-radio>
      </template>
      <template #action="{ row }">
        <el-button
          type="text"
          @click="handleShowView(row)"
        >查看</el-button>
      </template>
    </dynamicTable>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
    <allocationView ref="allocationView" />
  </el-dialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import allocationView from './allocationView'
import {
  receptionStaffWarehousePage,
  receptionByWarehouse
} from '@/api/privateArea/toolbox'

export default {
  name: 'SelectAllocation',
  components: {
    dynamicTable,
    allocationView
  },
  data() {
    return {
      tableData: [],
      visible: false,
      warehouseId: '',
      form: {
        name: ''
      },
      columns: [
        {
          prop: 'radio',
          width: 40,
          label: '',
          type: 'slot',
          visible: true
        },
        {
          prop: 'name',
          label: '分配规则名称',
          visible: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true
        },
        {
          width: 90,
          prop: 'action',
          label: '规则内容',
          type: 'slot',
          visible: true
        }
      ],
      taskId: ''
    }
  },
  methods: {
    getList(params) {
      return receptionStaffWarehousePage({
        ...params,
        name: this.form.name
      })
    },
    clear() {
      this.form = {
        name: ''
      }
      this.warehouseId = ''
      this.onRefresh()
    },
    open(taskId) {
      this.visible = true
      this.clear()
      this.taskId = taskId
      this.onRefresh()
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    handleShowView(row) {
      this.$refs.allocationView.open(row)
    },
    async onSubmit() {
      if (!this.warehouseId) {
        this.$message.error('请先选择一条分配规则')
        return
      }
      try {
        const { data, code } = await receptionByWarehouse({
          taskId: this.taskId,
          warehouseId: this.warehouseId
        })
        if (code === 1) {
          this.$emit('submit', data)
          this.visible = false
        }
      } catch (e) {
        // this.$message.error('选择出错')
      }
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
