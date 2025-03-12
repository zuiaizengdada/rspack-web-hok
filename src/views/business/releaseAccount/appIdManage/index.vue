<template>
  <div class="page-content">
    <div class="back">
      <span class="pointer" @click="back()">投放账号管理</span> /<span>AppID管理</span>
    </div>
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
            :search="search"
            @onSearch="onSearchFn"
            @onClear="onClear"
            @onAdd="onAdd"
            @gopage="gopage"
          />
        </template>
        <template slot="action" slot-scope="scope">
          <el-button
            type="text"
            class="c_red"
            @click="onhandleDel(scope.row)"
          >删除</el-button>
        </template>
      </MPageLayout>
    </MCard>

    <add-account :config="addConfig" @success="successAdd" />
    <error-msg :dialog-visible="errorVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import filterTop from './components/adFilterTop.vue'
import { getColumns1 } from './columns'
import addAccount from './components/addAccount'
import { getApplicationList, delApplication } from '@/api/advertisingKanBan'
import ErrorMsg from './components/errorMsg'
export default {
  name: 'AppIdManage',
  components: {
    ErrorMsg,
    filterTop,
    addAccount
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'expertChannel'],
      config: {
        tableData: [],
        tableColumns: getColumns1.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      addConfig: {
        type: 0, // 0：千川 2：信息流
        visible: false
      },
      errorVisible: false,
      tabIndex: 0,
      search: {},
      loading: false
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    back() {
      this.$router.push('/business/release/releaseAccount?callType=2')
    },
    successAdd() {
      this.addConfig.visible = false
      this.onSearchFn()
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    closeDialog() {
      this.errorVisible = false
    },
    // 点击重置按钮
    onClear() {
      this.search = {}
      this.onSearchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        ...this.search
      }
      getApplicationList(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 新增关联广告
    onAdd() {
      this.addConfig.visible = true
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        type: 1,
        row: row,
        visible: true
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">若AppID存在授权的广告账号，需先删除该账号后才可进行删除</div>`,
        success: () => {
          this.loading = true
          const data = {
            oauthId: row.oauthId
          }
          delApplication(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 新页面
    gopage() {
      this.$router.push({
        name: 'AppIdManage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  // height: 100%;
  border-radius: 10px;
  padding: 20px;
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
.page_wrap {
  height: calc(100vh - 96px);
  padding: 20px 20px;
  background: #fff;
}
.back {
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
</style>
