<template>
  <!-- 广告管理 -->
  <MCard class="page_wrap">
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
          @searchFn="searchFn"
          @clear="searchClear"
        />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" @click="handleSetting(row)">广告设置</el-button>
      </template>
    </MPageLayout>
    <!-- 弹框层 -->
    <editModel :config="editModelConfig" @close="editModelConfig.visible = false" @success="editModelConfigSuccess" />
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import { getColumns } from './columns.js'
import editModel from './editModel.vue'
import { getManagerList } from '@/api/shop/advertising'
export default {
  components: {
    filterTop,
    editModel
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'userName', 'userPhone', 'signedCount'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 筛选栏对象
      search: {
        type: '',
        name: ''
      },
      editModelConfig: {
        visible: false,
        row: {}
      }
    }
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 分页改变
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 筛选清空触发
    searchClear() {
      this.search = { type: '', name: '' }
      // this.config.currentPage = 1
      // this.getList()
    },
    // 点击编辑按钮
    handleEdit(row) {
      console.log(row)
      this.editModelConfig.visible = true
      this.editModelConfig.row = row
    },
    // 点击广告设置按钮
    handleSetting(row) {
      this.$router.push(`shopAdvertising/${row.id}`)
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        size: this.config.pageSize,
        current: this.config.currentPage,
        ...this.search
      }
      getManagerList(params).then(res => {
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑弹框点击确定按钮
    editModelConfigSuccess() {
      this.editModelConfig.visible = false
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  background: #fff;
  padding: 0 20px 20px;
}
::v-deep .tablePage .page_footer{
  justify-content: space-between;
  box-shadow: none;
  padding:10px 0px 0px;
  height:auto;
}
::v-deep .page_header{
  padding: 0!important;
}
::v-deep .my-table{
  margin:0!important
}
</style>
