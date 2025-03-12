<template>
  <div v-loading="loading">
    <el-table :data="data" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="assignDate" label="分配时间" align="center" />
      <el-table-column prop="userName" label="分配人" align="center" />
      <el-table-column prop="scheduleNum" label="分配班期" align="center" />
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getScheduleStudentDeliveryPage } from '@/api/deliver/studentManagement'
export default {
  components: {},
  props: {
    deliveryInfoId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        deliveryInfoId: this.deliveryInfoId
      }
      getScheduleStudentDeliveryPage(params).then(res => {
        this.data = res.data.records
        this.total = Number(res.data.total)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination {
  height: 62px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
