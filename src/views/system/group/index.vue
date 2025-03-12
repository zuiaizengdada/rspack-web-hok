<template>
  <div class="group-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #headerBtn>
        <el-button
          v-permission="['web:group:add', permsList]"
          type="primary"
          size="small"
          plain
          @click="openModel"
        >新增</el-button>
      </template>
      <template #action="{ row }">
        <el-button
          v-permission="['web:group:edit', permsList]"
          type="text"
          @click="openModel(row,'edit')"
        >编辑</el-button>
        <el-button
          v-permission="['web:group:del', permsList]"
          class="del-btn"
          type="text"
          @click="openDetail(row)"
        >删除</el-button>
      </template>
    </dynamicTable>
    <modal ref="modal" @success="handleSuccess" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { getGroupList, getGroupDel } from '@/api/tearchCenter/index'
import modal from './components/modal'
export default {
  name: 'Group',
  components: {
    dynamicTable,
    modal
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      permsList: this.$route.meta.permsList || []
    }
  },
  methods: {
    getList(params) {
      return getGroupList(params)
    },
    openModel(row, type) {
      this.$refs.modal.open(row, type)
    },
    handleSuccess() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh()
    },
    openDetail(row) {
      this.$delModal({
        tips: `确定删除?`,
        success: async() => {
          const { code } = await getGroupDel(row.id)
          if (code === 1) {
            this.$notify.success('删除成功')
            this.$refs.table.config.pageIndex = 1
            this.$refs.table.onRefresh()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.group-container ::v-deep{
  @include responsive-height(62px);
  background: #fff;
  border-radius: 15px;
  .filter-container{
    padding: 10px 20px 0 20px;
  }
  .del-btn{
    color: #F53F3F;
  }
}
</style>
