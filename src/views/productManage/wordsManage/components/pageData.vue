<template>
  <!-- 顶部筛选栏 -->
  <div class="table-data">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      border
      :slot-arr="slotArr"
      :current-page="config.pageIndex"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="createTime" slot-scope="{ row }">
        <p>{{ dataFormater(row.createTime) }}</p>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button v-permission="['web:wordsManage:delete', permsList]" class="btn-delete" type="text" @click="deleteWords(row)">删除</el-button>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
import { getWordsListData, deleteWords } from '@/api/product/setting'
import { DateFormat } from '@/utils/index'
export default {
  name: 'PageData',
  // eslint-disable-next-line vue/require-prop-types
  props: ['searchs'],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      wordsFrom: {
        words: ''
      },
      loading: false,
      slotArr: ['createTime', 'action'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'index', label: '序号', type: 'text' },
          { prop: 'participleName', label: '分词名称', type: 'text' },
          { prop: 'createTime', label: '导入日期', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    getDataList(res) {
      getWordsListData(res).then((res) => {
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.total = res.data.total
          this.config.tableData.forEach((value, index) => {
            value.index = (this.config.pageIndex - 1) * this.config.pageSize + index + 1
          })
        }
      })
    },
    deleteWords(row) {
      this.$confirm('你确定要删除该分词吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          deleteWords(row.id).then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.searchs.pageIndex = 1
              this.getDataList(this.searchs)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.pageIndex = 1
      this.searchs.pageIndex = 1
      this.searchs.pageSize = val
      this.getDataList(this.searchs)
    },
    handleCurrentChange(val) {
      this.config.pageIndex = val
      this.searchs.pageIndex = val
      this.getDataList(this.searchs)
    },
    handleSelectionChange(val) {
      this.$refs.tableTools && this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    dataFormater(date) {
      return DateFormat(new Date(date), 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-data {

  height: 710px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  padding: 0 15px;
  ::v-deep .my-table {
    margin: 0;
  }
  ::v-deep .page_footer {
    padding: 0;
    justify-content: flex-end;
  }
  ::v-deep .page_header {
    padding: 0;
    min-height: 0!important;
  }
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  text-align: right;
  box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
}

.btn-delete {
  color: red;
}
</style>
