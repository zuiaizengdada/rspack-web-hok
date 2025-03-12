<template>
  <!-- 操作日志 -->
  <div class="operationLog">
    <el-table v-loading="loading" :data="tableData" class="tableBorder" border :header-cell-style="{ background: '#F2F9FF' }">
      <!-- <el-table-column prop="followQwUserId" label="操作人" width="124" /> -->
      <el-table-column prop="createTime" label="操作时间" width="159" />
      <el-table-column prop="updateContent" label="操作内容" />
      <el-table-column prop="operateUserName" label="操作人" />
    </el-table>
    <el-pagination
      class="fr m-t-20"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { followUserUpdateLogPageList } from '@/api/privateArea/clue'
export default {
  components: {},
  props: {
    clueId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: false
    }
  },
  mounted() {
    this.currentPage = 1
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
      if (!this.clueId) return
      const data = {
        clueId: this.clueId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      followUserUpdateLogPageList(data).then(res => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.tableBorder {
  border-radius: 6px;
  width: 100%;
  margin-top: 16px;
}
.syncbtn {
  margin-bottom: 4px;
}
</style>
