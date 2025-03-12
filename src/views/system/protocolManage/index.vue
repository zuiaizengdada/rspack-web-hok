<!-- 协议管理 -->
<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="协议管理" name="first">
        <div class="page_wrap1">
          <filter-top
            :user-array="userArray"
            :search-form="searchForm"
            @clear="clear"
            @getListForSearch="getListForSearch"
          />
          <!-- 内容区(协议管理) -->
          <MPageLayout
            ref="MPageLayout"
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
            @sort-change="sortChange"
          >
            <div slot="action" slot-scope="{ row }">
              <!-- v-permission="['web:teachFileList:detail', permsList]" -->
              <span v-if="row.protocolUrl !== null && row.protocolUrl !== ''">
                <el-button
                  type="text"
                  @click="gotoPreview(row)"
                >预览</el-button>
                <el-button
                  type="text"
                  @click="gotoDownload(row, 6)"
                >下载</el-button>
              </span>
              <span v-else> — </span>
            </div>
          </MPageLayout>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的协议" name="second">
        <div class="page_wrap1">
          <!-- 内容区(我的协议) -->
          <MPageLayout
            ref="MPageLayout"
            :slot-arr="slotArr"
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            :total="config.total"
            :table-data="config.tableData"
            :table-columns="config.tableColumns1"
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @sort-change="sortChange"
          >
            <div slot="action" slot-scope="{ row }">
              <!-- v-permission="['web:teachFileList:detail', permsList]" -->
              <span v-if="row.protocolUrl !== '' && row.protocolUrl !== null">
                <el-button
                  type="text"
                  @click="gotoPreview(row)"
                >预览</el-button>
                <el-button
                  type="text"
                  @click="gotoDownload(row, 6)"
                >下载</el-button>
              </span>
            </div>
          </MPageLayout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import filterTop from './components/filterTop.vue'
import { getProtocolPage, getMyProtocolPage } from '@/api/system/protocolManage'
import { fileDownload } from '@/utils/index'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      activeName: 'first',
      slotArr: ['action', 'footer', 'exceptionAccountType', 'platformId'],
      searchForm: {
        protocolName: '',
        userId: '',
        status: '',
        userStatus: ''
      },
      userArray: [],
      config: {
        tableData: [{}], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'userName',
            label: '用户名称',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'deptNameChain',
            label: '部门',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'userStatus',
            label: '用户状态',
            type: 'text',
            visible: true,
            disable: true,
            render: row => {
              return row.userStatus === 1 ? '已离职' : '未离职'
            }
          },
          {
            prop: 'protocolName',
            label: '协议名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'compactId',
            label: '合同编号',
            type: 'text',
            visible: true,
            render: row => {
              return row.compactId ? row.compactId : '—'
            }
          },
          {
            prop: 'status',
            label: '状态',
            type: 'text',
            visible: true,
            render: row => {
              return row.status === 1 ? '已签订' : '未签订'
            }
          },
          {
            prop: 'createTime',
            label: '签署时间',
            type: 'text',
            visible: true,
            render: row => {
              return row.createTime ? row.createTime : '—'
            }
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
          }
        ],
        tableColumns1: [
          {
            prop: 'userName',
            label: '用户名称',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'protocolName',
            label: '协议名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'compactId',
            label: '合同编号',
            type: 'text',
            visible: true,
            render: row => {
              return row.compactId ? row.compactId : '—'
            }
          },
          {
            prop: 'createTime',
            label: '签署时间',
            type: 'text',
            visible: true,
            render: row => {
              return row.createTime ? row.createTime : '—'
            }
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.loadUserNoPage()
    this.getList()
  },
  methods: {
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    handleClick(tab, event) {
      this.config.currentPage = 1
      if (tab.name === 'first') {
        this.getList()
      } else {
        this.getMyList()
      }
      console.log(tab, 'tab')
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    sortChange(val) {
      console.log(val)
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.searchForm = { ...this.searchForm, ...data }
      this.getList()
    },
    clear() {
      console.log('clear重置')
      this.config.currentPage = 1
      this.searchForm.userId = ''
      this.searchForm.protocolName = ''
      this.searchForm.status = ''
      this.searchForm.userStatus = ''
      this.getList()
    },
    // 获取我的列表
    async getMyList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      const res = await getMyProtocolPage(params)
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      // this.config.total = 0
      this.loading = false
    },
    // 获取列表
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        protocolName: this.searchForm.protocolName,
        status: this.searchForm.status,
        userId: this.searchForm.userId,
        userStatus: this.searchForm.userStatus
      }
      const res = await getProtocolPage(params)
      console.log(res, '列表数据')
      this.config.tableData = res.data.items

      this.config.total = res.data.total
      this.loading = false
    },
    // 预览
    gotoPreview(row) {
      window.open(row.protocolUrl, '_blank')
    },
    // 下载
    gotoDownload(row) {
      fileDownload(row.protocolUrl, `${row.protocolName}.pdf`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
  @include responsive-height(20px);
  // height: 100%;
  min-width: 1000px;
  background: #fff;
  border-radius: 10px;
  padding: 0 20px;
  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
.page_wrap1 ::v-deep {
  // height: calc(100vh - 160px);
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
