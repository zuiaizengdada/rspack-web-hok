<template>
  <div class="outbound-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      style="height: calc(100vh - 220px)"
      :get-list-api="getList"
    >
      <template #action="{ row }">
        <!-- <el-button type="text" @click="handleEdit(row)">设置</el-button> -->
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
      <!-- <template #headerBtn>
        <el-button
          size="small"
          type="primary"
          @click="openAddModel"
        ><i class="el-icon-plus" /> 新增外呼任务</el-button>
      </template> -->
    </dynamicTable>
    <addModal ref="addModal" @success="onRefresh" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import addModal from './components/addModal'
import {
  callPage,
  callUpdateStatus,
  callInitialize
} from '@/api/privateArea/toolbox'
const types = {
  1: '老师专用',
  2: '通用'
}
const status = {
  1: '启用',
  2: '禁用'
}
export default {
  components: {
    dynamicTable,
    addModal
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'type',
          label: '类型',
          type: 'text',
          slotFn: row => types[row.type]
        },
        { prop: 'lectureName', label: 'IP老师', type: 'text' },
        { prop: 'name', label: '外呼任务名称', type: 'text' },
        {
          prop: 'status',
          label: '状态',
          type: 'text',
          slotFn: row => status[row.status]
        },
        { prop: 'createUserName', label: '创建人', type: 'text' },
        { prop: 'createTime', label: '创建时间', type: 'text' },
        { prop: 'action', label: '操作', type: 'slot' }
      ]
    }
  },
  created() {
    this.callInitialize()
  },
  methods: {
    async callInitialize() {
      await callInitialize()
    },
    getList(params) {
      return callPage(params)
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
        status: row.status === '1' ? 2 : 1
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
  display: flex;
  flex-direction: column;
}
</style>
