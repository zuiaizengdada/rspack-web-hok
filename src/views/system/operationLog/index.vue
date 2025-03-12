<template>
  <div class="plan-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #operate="{row}">
        <div>
          <template v-if="row.operateType === 1">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div>{{ `新增内容：${row.operateAfter || ''}` }}</div>
              </div>
              <div class="text">{{ `新增内容：${row.operateAfter || ''}` }}</div>
            </el-tooltip>
          </template>
          <template v-else-if="row.operateType === 2">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37 || row.operateBefore.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div style="margin-bottom:10px">{{ `修改前：${row.operateBefore || ''}` }}</div>
                <div>{{ `修改后：${row.operateAfter || ''}` }}</div>
              </div>
              <div>
                <div class="text">{{ `修改前：${row.operateBefore || ''}` }}</div>
                <div class="text">{{ `修改后：${row.operateAfter || ''}` }}</div>
              </div>
            </el-tooltip>

          </template>
          <template v-else-if="row.operateType === 5">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div>{{ `操作内容：${row.operateAfter || ''}` }}</div>
              </div>
              <div class="text">{{ `操作内容：${row.operateAfter || ''}` }}</div>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip placement="bottom" :disabled="!(row.operateBefore.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div>{{ `删除内容：${row.operateBefore || ''}` }}</div>
              </div>
              <div class="text">{{ `删除内容：${row.operateBefore || ''}` }}</div>
            </el-tooltip>
          </template>
        </div>
      </template>
    </dynamicTable>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { logsList } from '@/api/system/index'
export default {
  name: 'OperationLog',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this)
    }
  },
  methods: {
    getList(params) {
      return logsList({
        current: params.pageIndex,
        size: params.pageSize,
        ...params
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-container ::v-deep{
  height: calc(100vh - 90px);
  .el-tooltip{
      font-size: 14px;
  }
  .text{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
