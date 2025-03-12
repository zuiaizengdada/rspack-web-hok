<template>
  <el-drawer
    title="变更记录"
    :visible.sync="drawerFlag"
    :direction="direction"
    :before-close="handleClose"
    size="650px"
  >
    <div class="draw-flag">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="operateName"
          label="变更前运营"
          width="180"
        />
        <el-table-column
          prop="newOperateName"
          label="变更后运营"
          width="180"
        />
        <el-table-column
          prop="startTime"
          label="变更时间"
        />
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { exportManHistory } from '@/api/order/performanceShare'
export default {
  components: {
  },
  props: {

  },
  data() {
    return {
      direction: 'rtl',
      drawerFlag: false,
      tableData: []
    }
  },
  watch: {

  },
  mounted() {},
  methods: {
    loadData(row) {
      const params = {
        expertChannel: row.expertChannel,
        expertId: row.expertId
      }
      exportManHistory(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        }
      })
    },
    handleClose() {
      this.drawerFlag = false
    }
  }
}
</script>

<style lang='scss' scoped>
.draw-flag {
    padding: 20px;
}
</style>

