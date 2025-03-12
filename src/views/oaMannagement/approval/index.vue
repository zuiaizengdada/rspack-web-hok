<template>
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop
          :loading="loading"
          :search="search"
          @onSearch="searchFn"
          @onClear="onClear"
        />
      </template>
      <template slot="icon" slot-scope="{ row }">
        <el-image
          v-if="row.icon"
          style="width: 80px; height: 60px"
          :src="row.icon"
          fit="contain"
          :preview-src-list="[row.icon]"
        /></template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="handleEdit(row)">修改</el-button>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import moment from 'moment'
import { templateList, lockTemplate } from '../api/approval'
import filterTop from './components/filterTop.vue'
import {
  getColumns
} from './components/columns.js'
export default {
  components: { filterTop },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'icon'
      ],
      config: {
        tableData: [{ a: 1 }],
        tableColumns: getColumns(),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        time: '',
        name: ''
      },
      loading: false,
      rowConfig: {
        visible: false,
        row: {}
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        name: this.search.name,
        createStartTime: this.search.time ? moment(this.search.time[0]).valueOf() : undefined,
        createEndTime: this.search.time ? moment(this.search.time[1]).valueOf() : undefined
      }
      try {
        const res = await templateList(params)
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 编辑
    async handleEdit(row) {
      await lockTemplate(row.id)
      this.$router.push({
        path: `/oaManagement/approval/approvalSetting`,
        query: { id: row.id }
      })
    },
    onClear() {
      this.search = {
        status: '',
        name: ''
      }
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  background-color: #fff;
  border-radius: 10px;
}

</style>
