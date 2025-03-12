
<template>
  <el-table-column :label="coloumnHeader.headerName" :prop="coloumnHeader.group">
    <template v-for="item in coloumnHeader.subHeaderList">
      <tableColumn
        v-if="item.subHeaderList && item.subHeaderList.length"
        :key="item.group"
        :coloumn-header="item"
      />
      <el-table-column
        v-else
        :key="item.group"
        :label="item.headerName"
        :prop="item.group"
      >
        //悬浮展示详情
        <template slot-scope="scope">
          {{ scope.row[scope.column.property] }}
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColumn',
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    }
  }
}
</script>

  <style scoped>
  </style>
