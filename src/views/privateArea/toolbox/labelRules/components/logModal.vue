<template>
  <el-drawer
    :visible.sync="visible"
    title="日志"
    size="956px"
  >
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      immediate-check
      style="height: calc(100vh - 100px)"
      :get-list-api="getList"
    />
  </el-drawer>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getRoleLog } from '@/api/privateArea/rule'
import moment from 'moment'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      ruleId: '',
      visible: false,
      columns: [
        {
          prop: 'operateUserName',
          label: '操作人',
          type: 'text'
        },
        { prop: 'createTime', width: 180, label: '操作时间', type: 'text', slotFn: (row) => moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') },
        { prop: 'ruleTypeName', label: '规则触发', type: 'text' },
        {
          prop: 'content',
          width: 480,
          'show-overflow-tooltip': true,
          label: '操作内容',
          type: 'text'
        }
      ]
    }
  },
  methods: {
    getList(params) {
      return getRoleLog({
        ...params,
        ruleId: this.ruleId
      })
    },
    open(ruleId) {
      this.visible = true
      this.ruleId = ruleId
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    }
  }
}
</script>

<style>

</style>
