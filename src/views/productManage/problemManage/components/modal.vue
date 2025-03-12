
<template>
  <el-dialog v-if="visible" title="查看结果" :close-on-click-modal="false" width="600px" class="dialog-container" :visible.sync="visible">
    <div class="container">
      <dynamic-table
        ref="table"
        v-model="tableData"
        :config-props="config"
        :hide-pagination="true"
        :checkbox="false"
        :columns="columns"
        :get-list-api="getList"
        immediate-check
      >
        <template #action="{ row }">
          <el-button type="text" @click="getKeyword(row)">查看</el-button>
        </template>
      </dynamic-table>
    </div>
  </el-dialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { questionStatistics } from '@/api/product/question'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      visible: false,
      params: {},
      config: {
        pageSize: 50
      }
    }
  },
  methods: {
    getList(params) {
      return questionStatistics(params)
    },
    open(params) {
      this.params = params
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.onRefresh({ ...this.params, pageSize: 50, pageIndex: 1 })
      })
    },
    getKeyword(item) {
      this.visible = false
      for (const key in this.params) {
        if (!this.params[key]) {
          this.params[key] = undefined
        }
      }
      this.$router.push({
        path: `/problemDetails/${item.id}`,
        query: { ...this.params, keyId: item.keyId, pageIndex: undefined, pageSize: undefined, questionBasicReq: JSON.stringify(this.params) }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .container {
    height: 500px;
  }
  .table_wrap {
    height: 100%;
  }
  .el-dialog__body {
    padding: 0px 20px 30px;
  }
}
</style>
