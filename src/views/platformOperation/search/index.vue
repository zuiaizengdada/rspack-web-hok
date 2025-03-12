<template>
  <div class="page_wrap">
    <!-- 平台搜索管理 -->
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
          class="w-100p"
          :search="search"
          :header-cell-style="{ background: '#f5f5f5' }"
          @search="handerSearch"
        />
      </template>
      <template slot="displayFlag" slot-scope="{ row }">
        <div>
          <el-switch
            v-model="row.displayFlag"
            :active-value="1"
            :inactive-value="0"
            @change="handleDisplay(row)"
          />
          {{ { 0: '否', 1: '是' }[row.displayFlag] }}
        </div>
      </template>
    </MPageLayout>
    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="600px"
      width="600px"
      :visible.sync="modal.visible"
    >
      <searchModal
        :type="modal.type"
        :visible.sync="modal.visible"
        :data="modal.data"
        @close="closeModal()"
        @success="sendSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import filterTop from './components/filterTop.vue'
import Modal from '@/components/Modal'
import searchModal from '@/components/Modal/shop/search'
import {
  getSearchList,
  searchDisplay,
  // getCatalogueList,
  searchRecommend,
  searchDeleteBatch,
  searchEdit,
  searchAdd
} from '@/api/platform/search.js'
export default {
  name: 'Search',
  components: {
    filterTop,
    Modal,
    searchModal
  },
  data() {
    return {
      search: {
        searchValue: '',
        displayFlag: ''
      },
      tableData: [],
      multipleSelection: [],
      modal: {
        type: 1,
        visible: false,
        title: '新增',
        loading: false
      },
      loading: false,
      permsList: this.$route.meta.permsList || [],
      slotArr: ['search', 'footer', 'displayFlag'],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'searchValue',
            label: '搜索关键词',
            type: 'text'
          },
          {
            prop: 'searchNum',
            label: '搜索次数',
            type: 'text'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text'
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            type: 'text'
          },
          {
            prop: 'displayFlag',
            label: '前端展示',
            type: 'slot'
          }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.current = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        ...this.search,
        size: this.config.pageSize,
        current: this.config.currentPage
      }
      getSearchList(params)
        .then(res => {
          this.loading = false
          this.config.tableData = res.data.records
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handerSearch(res) {
      this.search = res
      this.config.currentPage = 1
      this.getList()
    },
    closeModal() {
      this.modal.visible = false
    },
    sendSuccess(res) {
      this.modal.loading = true

      if (this.modal.type === 1) {
        searchAdd(res)
          .then(res => {
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
            this.modal = {
              type: 1,
              visible: false,
              title: '新增',
              loading: false
            }
            this.init()
          })
          .catch(() => {
            this.modal = {
              type: 1,
              visible: false,
              title: '新增',
              loading: false
            }
          })
      } else if (this.modal.type === 3) {
        searchEdit(res)
          .then(res => {
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
            this.modal = {
              type: 1,
              visible: false,
              title: '新增',
              loading: false
            }
            this.init()
          })
          .catch(() => {
            this.modal = {
              type: 1,
              visible: false,
              title: '新增',
              loading: false
            }
          })
      }
    },
    // 打开新增弹框
    openAddModel() {
      this.modal = {
        type: 1,
        visible: true,
        title: '新增',
        loading: false
      }
    },
    // 打开编辑弹框
    openEditModel(row) {
      this.modal = {
        type: 3,
        visible: true,
        title: '编辑',
        loading: false,
        data: row
      }
    },
    // 批量推荐/取消
    _searchRecommend(flag) {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择!')
      }
      const searchIdList = []
      this.multipleSelection.map(v => {
        searchIdList.push(v.searchId)
      })
      const data = {
        flag: flag,
        searchIdList
      }
      searchRecommend(data).then(res => {
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.getList()
      })
    },
    // 批量展示/取消
    _searchDisplay(flag) {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择!')
      }
      const searchIdList = []
      this.multipleSelection.map(v => {
        searchIdList.push(v.searchId)
      })
      const data = {
        flag: flag,
        searchIdList
      }
      searchDisplay(data).then(res => {
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.getList()
      })
    },
    // 批量删除
    del() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择!')
      }
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}条数据?`,
        success: () => {
          const searchIdList = []
          this.multipleSelection.map(v => {
            searchIdList.push(v.searchId)
          })
          const data = {
            searchIdList
          }
          searchDeleteBatch(data).then(res => {
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
            this.getList()
          })
        }
      })
    },
    // 推荐/取消
    recommend(row) {
      if (this.search.loading) {
        return
      }
      this.search.loading = true
      const data = {
        flag: row.recommendFlag,
        searchIdList: [row.searchId]
      }
      searchRecommend(data)
        .then(res => {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          this.getList()
        })
        .catch(() => {
          this.search.loading = false
        })
    },
    // 展示/取消
    handleDisplay(row) {
      const data = {
        flag: row.displayFlag,
        searchIdList: [row.searchId]
      }
      searchDisplay(data)
        .then(res => {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          this.getList()
        })
    }
  }
}
</script>

  <style lang="scss" scoped>
.page_wrap {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  width: 100%;
  height: calc(100vh - 190px);
  display: flex;
  flex-direction: column;
}
.filter_top {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
    0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
}
.table-module {
  padding: 20px 20px 0 20px;
  margin-top: 20px;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  .el-table {
    height: calc(100vh - 545px);
    overflow: auto;
  }
}
</style>
