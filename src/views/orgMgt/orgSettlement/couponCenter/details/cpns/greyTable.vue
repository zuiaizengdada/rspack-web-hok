<template>
  <el-table border :data="info" class="data-table">
    <template v-for="item in columns">
      <el-table-column :key="item.prop" :prop="item.prop" :label="item.label">
        <template slot-scope="scope">
          {{ scope.row[item.prop] || '--' }}
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    info: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
.data-table {
  max-width: 1100px;
}
</style>
