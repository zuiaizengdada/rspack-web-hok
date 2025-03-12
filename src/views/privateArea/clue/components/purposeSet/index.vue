<template>
  <el-drawer
    title="线索意向设置"
    :visible.sync="visible"
    size="1100px"
    @close="handleClose"
  >
    <div class="headBtn">
      <el-button size="small" type="primary" @click="handleUpdateItem()">新增</el-button>
    </div>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      class="dynamicTable"
      :get-list-api="getList"
    >
      <template #color="{ row }">
        <div :style="{background:row.color}" class="numBox" />
      </template>
      <template #action="{ row }">
        <el-button type="text" style="margin-right:10px" @click="handleUpdateItem(row)">编辑</el-button>
        <el-popconfirm title="确定删除当前信息吗？" @confirm="handleDeleteItem(row)">
          <el-button slot="reference" type="text" style="color: #f53f3f">删除</el-button>
        </el-popconfirm>
      </template>
    </dynamicTable>
    <detailsDialog ref="detailsDialogRef" @success="handleSuccess" />
  </el-drawer>
</template>
<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getIntentConfigPage, deleteIntentConfig } from '@/api/privateArea/clue'
import detailsDialog from './components/detailsDialog.vue'
export default {
  components: {
    dynamicTable,
    detailsDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tableData: [],
    params: {},
    columns: [
      {
        prop: 'name',
        label: '意向名称',
        type: 'text',
        visible: true
      },
      { prop: 'color', label: '颜色', type: 'slot' },
      { prop: 'createUserName', label: '创建人', type: 'text' },
      {
        prop: 'createTime',
        label: '创建时间',
        width: 160,
        type: 'text'
      },
      {
        prop: 'updateUserName',
        width: 160,
        label: '最新更新人',
        type: 'text'
      },
      {
        prop: 'updateTime',
        width: 160,
        label: '最新更新时间',
        type: 'text'
      },
      { prop: 'action', label: '操作', type: 'slot' }
    ]
  }),
  methods: {
    handleUpdateItem(data) {
      this.$refs.detailsDialogRef.open({ ...data })
    },
    async handleDeleteItem(data) {
      const { code } = await deleteIntentConfig({ id: data.id })
      if (code === 1) {
        this.$message.success('删除成功')
        this.$refs.table.onRefresh()
      }
    },
    handleSuccess(bol) {
      this.$refs.table.onRefresh(bol ? '' : { pageIndex: 1 })
    },
    getList(params) {
      this.params = params
      return getIntentConfigPage(params)
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('success')
    }
  }
}
</script>
<style lang="scss" scoped>
.headBtn {
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
}
.dynamicTable {
  height: calc(100vh - 220px);
  overflow-y: scroll;
  padding: 0 20px;
}
.numBox{
  width:60px;
  height:20px;
}
</style>
