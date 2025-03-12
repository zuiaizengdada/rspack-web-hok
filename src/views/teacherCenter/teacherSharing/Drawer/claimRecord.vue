<template>
  <div v-loading="loading" class="claimRecord">
    <div class="myTable">
      <el-table ref="elTable" height="100%" style="width: 100%" :data="list" :header-cell-style="{ background: '#F3F3F3' }">
        <el-table-column prop="prizeDrawName" label="领取时间" />
        <el-table-column prop="prizeDrawName" label="领取人" />
        <el-table-column prop="prizeDrawName" label="领取机构" />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      top: '114px',
      loading: false,
      visible: false,
      list: [
        { prizeDrawName: '111' }
      ],
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  mounted() {
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.searchFn()
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.liveRoomId,
        prizeDrawId: this.prizeDrawId
      }
      console.log(data)
    }
  }
}
</script>

<style lang='scss' scoped>
.claimRecord {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .myTable {
    flex: 1 0 0;
    border-radius: 6px;
    border: 1px solid #CBCFD3;
  }
}
.pagination {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
