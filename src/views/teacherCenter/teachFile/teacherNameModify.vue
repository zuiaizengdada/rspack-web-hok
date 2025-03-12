<template>
  <formPage title="IP档案" sub-title="IP姓名修改" @click="$router.push('/teacherCenter/teachFile/list')">
    <div class="teacher-container">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :columns="columns"
        :get-list-api="getList"
      >
        <template #action="{ row }">
          <el-button
            type="text"
            @click="openEdit(row)"
          >修改</el-button>
          <el-button
            type="text"
            @click="openModel(row)"
          >日志</el-button>
        </template>
      </dynamicTable>
    </div>
    <modal ref="modal" @success="onRefresh" />
    <journal ref="journal" />
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import dynamicTable from '@/components/DynamicTable/table'
import modal from './components/modal'
import journal from './components/journal'
import { teacherListName } from '@/api/tearchCenter/index'
import { ASSESS_STATUS } from '../enum'
import { getColumns } from './column'

export default {
  components: {
    formPage,
    dynamicTable,
    modal,
    journal
  },
  data() {
    return {
      ASSESS_STATUS,
      tableData: [],
      columns: getColumns.call(this),
      permsList: this.$route.meta.permsList || []
    }
  },
  methods: {
    openEdit(row) {
      this.$refs.modal.open(row)
    },
    // 获取师资评估详情
    getList(params) {
      return teacherListName(params)
    },
    onRefresh() {
      this.$refs.table.onRefresh()
    },
    openModel(row) {
      this.$refs.journal.open(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-container ::v-deep{
  height: calc(100vh - 180px);
  .my-table{
    margin: 0px;
    min-width: 1000px;
  }
}
.card ::v-deep{
  .detail_page_wrap{
    min-width: 1000px;
  }
}
</style>
