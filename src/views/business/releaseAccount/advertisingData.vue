<template>
  <div class="page-content">
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
          <el-button type="text" @click="review(scope.row)">详情</el-button>
        </template>
      </MPageLayout>
    </MCard>
    <add-account :config="addConfig" @success="success" />
  </div>
</template>

<script>
import filterTop from './components/adFilterTop.vue'
import { getColumns1 } from './columns'
import addAccount from './components/addAccount'
import { getOauthUserList } from '@/api/business/clue.js'
export default {
  name: 'AdvertisingData',
  components: {
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
      tabIndex: 0,
      search: {
        accountType: 0,
        advertiserId: '',
        advertiserName: '',
        oauthId: ''
      },
      loading: false
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    success(url) {
      this.addConfig.visible = false
      window.open(url, '_blank')
    },
    review(record) {
      this.$router.push({
        name: 'AddAccountReview',
        query: {
          platformId: record.platformId,
          adPlatform: record.platformName,
          accountRole: record.accountRole,
          accountRoleName:
            record.accountRole === 1
              ? '代理商'
              : record.accountRole === 2
                ? '店铺'
                : record.accountRole === 3
                  ? '抖音'
                  : '-',
          accountId: record.accountId,
          advertiserId: record.advertiserId
        }
      })
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
    // 点击重置按钮
    onClear() {
      this.search = {
        accountRole: '',
        advertiserId: '',
        advertiserName: '',
        oauthId: '',
        platformId: ''
      }
      this.onSearchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        accountType: this.search.accountType,
        advertiserId: this.search.advertiserId,
        advertiserName: this.search.advertiserName,
        oauthId: this.search.oauthId,
        platformId: this.search.platformId,
        deliveryType: this.search.deliveryType,
        accountRole: this.search.accountRole
      }
      getOauthUserList(params)
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
    // 新页面
    gopage() {
      this.$router.push({
        name: 'appIdManage'
      })
      // this.$router.push('/appIdManage')
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  background: #fff;
  border-radius: 10px;
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
  height: 100%;
}
::v-deep .tablePage .page_content {
  height: 68%;
  flex: initial;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
