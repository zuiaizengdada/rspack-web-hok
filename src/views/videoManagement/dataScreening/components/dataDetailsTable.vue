<template>
  <div class="dataDetailsTable">
    <el-table :header-row-class-name="'tableClassName'" :data="tableData" style="width: 100%;overflow-x:auto">
      <el-table-column v-for="item in dataDetailsColumns" :key="item.label" :width="item.width" :sortable="item.sort" :label="item.label" :prop="item.prop" :fixed="item.fixed">
        <template slot-scope="scope">
          <span v-if="item.prop==='name'" :class="!search.operatorId?'deptName':''" @click="showDept(scope.row)">{{ scope.row[item.prop] }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <div slot="empty" class="empty">
        <el-empty
          :image-size="70"
          description="暂无数据"
        />
      </div>
    </el-table>
  </div>
</template>
<script>
import { dataDetailsColumns } from './columns'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    search: {
      type: Object,
      default: () => {
        return {
          active: 1,
          time: ['', '']
        }
      }
    }
  },
  data() {
    return {
      dataDetailsColumns
    }
  },
  methods: {
    showDept(row) {
      this.$emit('checkDept', row)
    },
    changeName(val) {
      this.dataDetailsColumns[0].label = val
    }
  }
}
</script>
<style lang="scss" scoped>
.dataDetailsTable{
    margin: 20px 0;
    background: #FFFFFF;
    // border: 1px solid #E7E7E7;
}
.tableClassName{
  background: #F3F3F3 !important;
}
.deptName{
  color: #0c6fff;
  cursor: pointer;
}
::v-deep {
  .tableClassName>th{
    background: #F3F3F3 !important;
  }
}
</style>
