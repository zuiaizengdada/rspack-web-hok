<template>
  <div class="offcial-container">
    <div class="offcial-header">
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd"
      ><i class="el-icon-plus el-icon--left" />新增公众号</el-button>
    </div>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
      class="dialog-table"
    >
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit(row)">设置</el-button>
      </template>
    </dynamicTable>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { bizOfficialPageList } from '@/api/privateArea/toolbox'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'name',
          label: '公众号名称'
        },
        {
          prop: 'createUserName',
          label: '创建人'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        },
        {
          prop: 'action',
          type: 'slot',
          label: '操作',
          width: 140
        }
      ]
    }
  },
  methods: {
    getList(params) {
      return bizOfficialPageList(params)
    },
    handleAdd() {
      this.$router.push({
        path: '/privateArea/officialManage/detail',
        query: {
          type: 'add'
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/privateArea/officialManage/detail',
        query: {
          type: 'edit',
          ...row
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.offcial-container ::v-deep {
  @include responsive-height(80px);
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  .offcial-header {
    margin-bottom: 20px;
  }
  .filter-container {
    padding: 0px;
  }
  .my-table {
    margin: 0px;
  }
  .dialog-table {
    height:calc(100vh - 300px)
  }
}
</style>
