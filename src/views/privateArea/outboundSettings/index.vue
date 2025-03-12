<template>
  <div class="outbound-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #status="{ row }">
        <AppStatus
          :title="{ 1: '启用', 2: '禁用' }[row.status]"
          :status="{ 2: 'info', 1: 'success' }[row.status]"
        />
      </template>
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button
          v-if="row.status === '2'"
          type="text"
          @click="handleUpdateStatus(row)"
        >启用</el-button>
        <el-button
          v-else
          type="text"
          style="color: #f53f3f"
          @click="handleUpdateStatus(row)"
        >禁用</el-button>
      </template>
      <template #headerBtn>
        <el-button
          size="small"
          type="primary"
          @click="openAddModel"
        ><i class="el-icon-plus" /> 新增外呼任务</el-button>
      </template>
    </dynamicTable>
    <addModal ref="addModal" @success="onRefresh" />
  </div>
</template>

<script>
import { getColumns } from './column'
import dynamicTable from '@/components/DynamicTable/table'
import addModal from './components/addModal'
import {
  callAdminPage,
  callUpdateStatus,
  callInitialize
} from '@/api/privateArea/toolbox'
import AppStatus from '@/components/AppStatus/index'
export default {
  components: {
    dynamicTable,
    addModal,
    AppStatus
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this)
    }
  },
  created() {
    this.callInitialize()
  },
  methods: {
    getList(params) {
      return callAdminPage(params)
    },
    callInitialize() {
      callInitialize()
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    handleEdit(row) {
      this.$refs.addModal.open(row, 2)
    },
    openAddModel() {
      this.$refs.addModal.open({}, 1)
    },
    async updateStatus(row) {
      const params = {
        id: row.id,
        status: row.status === '1' ? 2 : 1,
        tenantId: row.tenantId
      }
      const { code } = await callUpdateStatus(params)
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.onRefresh()
      }
    },
    handleUpdateStatus(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.updateStatus(row)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.outbound-container {
  @include responsive-height(76px);
}
</style>
