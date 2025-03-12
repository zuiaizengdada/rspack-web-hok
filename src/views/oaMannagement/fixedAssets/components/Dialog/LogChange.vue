<template>
  <base-dialog v-bind="$attrs" title="变更记录" :append-to-body="true" :visible-footer="true" v-on="$listeners">
    <el-table slot="content">
      <el-table-column prop="date" label="操作人" width="180" />
      <el-table-column prop="name" label="操作类型" width="180" />
      <el-table-column prop="address" label="记录内容" />
      <el-table-column prop="address" label="记录时间" />
    </el-table>
    <el-pagination />
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
export default {
  components: {
    BaseDialog
  }
}
</script>
