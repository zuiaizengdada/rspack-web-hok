<template>
  <div class="page_wrap">
    <!-- 搜索管理 -->
    <div class="p-20 filter_top">
      <filterTop class="w-100p" :search="search" :header-cell-style="{background: '#f5f5f5'}" @search="handerSearch" />
    </div>

    <div class="table-module clearfix">
      <el-row class="m-b-20">
        <el-col>
          <el-button v-permission="['system:search:add', permsList]" type="primary" :loading="search.loading" @click="openAddModel">新增</el-button>

          <el-dropdown v-permission="['system:search:edit', permsList]" class="m-l-10">
            <el-button>
              推荐<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="_searchRecommend(1)">批量推荐</el-dropdown-item>
              <el-dropdown-item @click.native="_searchRecommend(0)">取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-permission="['system:search:edit', permsList]" class="m-l-10">
            <el-button>
              展示<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="_searchDisplay(1)">批量展示</el-dropdown-item>
              <el-dropdown-item @click.native="_searchDisplay(0)">取消展示</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button :loading="search.loading" @click="_searchRecommend(1)">推荐</el-button>
          <el-button :loading="search.loading" @click="_searchDisplay(1)">展示</el-button>
          <el-button :loading="search.loading" @click="_searchRecommend(0)">取消推荐</el-button>
          <el-button :loading="search.loading" @click="_searchDisplay(0)">取消展示</el-button> -->
          <el-button v-permission="['system:search:remove', permsList]" :loading="search.loading" class="m-l-10" @click="del(0)">删除</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%;" :header-cell-style="{background: '#f5f5f5'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="searchValue" label="搜索关键词" />
        <el-table-column prop="searchNum" label="搜索次数" />
        <el-table-column prop="createTime" label="创建时间" width="240" />
        <el-table-column prop="updateTime" label="更新时间" width="240" />
        <el-table-column prop="recommendFlag" label="是否推荐">
          <template slot-scope="{ row }">
            <div v-loading.body="row.loading" element-loading-spinner="el-icon-loading" element-loading-text="处理中">
              <el-switch
                v-model="row.recommendFlag"
                :active-value="1"
                :inactive-value="0"
                @change="recommend(row)"
              />
              {{ {0: '否', 1: '是'}[row.recommendFlag] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="displayFlag" label="前端展示">
          <template slot-scope="{ row }">
            <div v-loading.body="row.loading" element-loading-spinner="el-icon-loading" element-loading-text="处理中">
              <el-switch
                v-model="row.displayFlag"
                :active-value="1"
                :inactive-value="0"
                @change="display(row)"
              />
              {{ {0: '否', 1: '是'}[row.displayFlag] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="searchSource" label="来源">
          <template slot-scope="{ row }">
            {{ {1: '后端运营', 2: '前端客户'}[row.searchSource] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button v-permission="['system:search:edit', permsList]" type="text" @click="openEditModel(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr m-t-20 m-b-20"
        :current-page="search.current"
        :page-size="search.size"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="search.total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
import filterTop from './search/filterTop.vue'
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
} from '@/api/shop/search.js'
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
        recommendFlag: '',
        displayFlag: '',
        searchSource: '',
        current: 1, // 当前页
        total: 0,
        size: 10, // 每页条数
        loading: false
      },
      tableData: [],
      loading: false,
      multipleSelection: [],
      modal: {
        type: 1,
        visible: false,
        title: '新增',
        loading: false
      },
      permsList: this.$route.meta.permsList || []
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
      this.search.size = val
      this.search.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.getList()
    },
    getList() {
      this.search.loading = true
      const params = {
        ...this.search
      }
      getSearchList(params).then(res => {
        res.data.records.map(v => {
          v.loading = false
        })
        this.search.loading = false
        this.tableData = res.data.records
        this.search.total = res.data.total
      }).catch(() => {
        this.search.loading = false
      })
    },
    handerSearch(res) {
      this.search = res
      this.search.current = 1
      this.getList()
    },
    closeModal() {
      this.modal.visible = false
    },
    sendSuccess(res) {
      this.modal.loading = true

      if (this.modal.type === 1) {
        searchAdd(res).then(res => {
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
        }).catch(() => {
          this.modal = {
            type: 1,
            visible: false,
            title: '新增',
            loading: false
          }
        })
      } else if (this.modal.type === 3) {
        searchEdit(res).then(res => {
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
        }).catch(() => {
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
      if (row.loading) {
        return
      }
      row.loading = true
      const data = {
        flag: row.recommendFlag,
        searchIdList: [row.searchId]
      }
      searchRecommend(data).then(res => {
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.getList()
      }).catch(() => {
        row.loading = false
      })
    },
    // 展示/取消
    display(row) {
      if (row.loading) {
        return
      }
      row.loading = true
      const data = {
        flag: row.displayFlag,
        searchIdList: [row.searchId]
      }
      searchDisplay(data).then(res => {
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.getList()
      }).catch(() => {
        row.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  // height: 100%;
  min-width: 1200px;
  overflow: auto;
  // background-color: #fff;
  border-radius: 4px;
}
.filter_top {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .table-module {
    padding: 20px 20px 0 20px;
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    .el-table{
      height: calc(100vh - 545px);
      overflow: auto;
    }
 }
</style>
