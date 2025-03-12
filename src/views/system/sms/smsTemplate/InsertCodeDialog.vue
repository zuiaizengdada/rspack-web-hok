<template>
  <AppDialog
    v-model="config.visible"
    title="插入代码"
    width="694px"
    :loading="loading"
    :top="top"
    height="auto"
  >
    <div class="InsertCodeDialog">
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="tableConfig.currentPage"
        :page-sizes="tableConfig.pageSizes"
        :page-size="tableConfig.pageSize"
        :total="tableConfig.total"
        :table-data="tableConfig.tableData"
        :table-columns="tableConfig.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template slot="search">
          <span class="searText">字段名称</span>
          <el-input v-model.trim="search.name" size="small" class="w-200 m-r-20" />
          <el-button size="small" type="primary" @click="searchFn">搜索</el-button>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="onhandleClick(row)">插入</el-button>
        </template>
      </MPageLayout>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getStandardPage } from '@/api/system/sms.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer'],
      tableConfig: {
        tableData: [],
        tableColumns: [
          { prop: 'paramName', label: '字段名称', type: 'text' },
          { prop: 'paramCode', label: '插入代码', type: 'text' },
          { prop: 'action', label: '操作', type: 'slot', width: '60px' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        name: '' // 字段名称
      },
      loading: false,
      top: ''
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.init()
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 784) / 2 + 'px'
  },
  methods: {
    init() {
      this.search = { name: '' }
      this.searchFn()
    },
    handleSizeChange(val) {
      this.tableConfig.pageSize = val
      this.tableConfig.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.tableConfig.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize,
        paramName: this.search.name
      }
      getStandardPage(params).then(res => {
        this.tableConfig.tableData = res.data.items
        this.tableConfig.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击搜索按钮
    searchFn() {
      this.tableConfig.currentPage = 1
      this.getList()
    },
    // 点击操作按钮
    onhandleClick(row) {
      this.$emit('success', row)
    }
  }
}
</script>

<style lang='scss' scoped>
.InsertCodeDialog {
    height: 699px;
    .searText {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
        margin-right: 8px;
    }
}
::v-deep {
    .tablePage .page_content {
        padding-bottom: 0;
    }
}
</style>
