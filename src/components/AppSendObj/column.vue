<template>
  <div v-loading="loading" class="column_wrap">
    <div class="search">
      <el-input
        v-model="search"
        class="w-200 m-r-10"
        placeholder="请输入课程名称"
        clearable
        @keyup.enter.native="searchFn"
        @clear="searchFn"
      />
      <el-button type="primary" @click="searchFn()">搜索</el-button>
    </div>
    <el-table
      :data="list"
      class="table_content m-t-20"
      border
      height="460px"
      :row-key="(row) => row.id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="columnDisabledFn" />
      <el-table-column show-overflow-tooltip prop="contentName" label="课程名称" min-width="300px" />
      <el-table-column show-overflow-tooltip prop="periodNum" label="期数">
        <template slot-scope="{ row }"> {{ row.periodNum }}期 </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="shelveFlag" label="上架状态">
        <template slot-scope="{ row }">
          {{ { 0: '已上架', 1: '未上架', 2: '待上架' }[row.shelveFlag] }}
        </template>
      </el-table-column>
    </el-table>
    <div class="footer m-t-20">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        :pager-count="5"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
      <div>
        <span class="m-r-10">已选{{ multipleSelection.length }}项</span>
        <el-button type="primary" @click="sure()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { periodPageContent } from '@/api/course'
export default {
  components: {},
  props: {
    columnDisabledFn: {
      type: Function,
      default: () => {
        return () => true
      }
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      list: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        contentName: this.search,
        current: this.currentPage,
        size: this.pageSize
      }
      periodPageContent(data)
        .then((res) => {
          console.log(res)
          this.list = res.data.records
          this.total = +res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    sure() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选择数据')
      }
      this.$emit('sureColumn', this.multipleSelection)
    }
  }
}
</script>

<style lang="scss" scoped>
.column_wrap {
  width: 100%;
  height: 100%;
  .search {
  }
  .table_content {
    width: 100%;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
