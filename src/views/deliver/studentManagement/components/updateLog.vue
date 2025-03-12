<template>
  <div v-loading="loading">
    <!-- 跟进记录 -->
    <el-table :data="data" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="followUpTime" label="跟进时间" />
      <el-table-column prop="nickName" label="跟进人" />
      <el-table-column prop="statusName" label="跟进状态" />
      <el-table-column prop="content" label="跟进内容" />
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
import { getFollowPage } from '@/api/deliver/studentManagement'
export default {
  components: {},
  props: {
    deliveryInfoId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: false
    }
  },
  mounted() {
    this.init()
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
    init() {
      this.currentPage = 1
      this.total = 0
      this.data = []
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        deliveryInfoId: this.deliveryInfoId
      }
      getFollowPage(params).then(res => {
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
.reasonContent {
  display: flex;
  justify-content: space-between;
}
</style>
