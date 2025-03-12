<template>
  <div class="page-content">
    <div class="back">
      <span class="pointer" @click="back()">投放账号管理</span> /<span>详情</span>
    </div>

    <!-- 投放账号管理 -->
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
            @onSearch="searchFn"
            @onClear="onClear"
            @onhandleAdd="onhandleAdd"
          />
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="onhandleEdit(row)">编辑</el-button>
          <el-button
            v-permission="['web:systemMenu:Manager', permsList]"
            type="text"
            @click="toManager(row)"
          >管理</el-button>
        </template>
      </MPageLayout>

      <!-- 弹框层 -->
      <addDialog :config="addConfig" @success="closeAddDialog" />
      <managerDialog ref="managerDialog" @success="successFn" />
    </MCard>
  </div>
</template>

<script>
import { getColumns } from './columns.js'
import filterTop from './filterTop.vue'
import { advertiserStaffList } from '@/api/advertisingKanBan'
import managerDialog from '../components/managerDialog.vue'
import addDialog from './addDialog.vue'
export default {
  components: {
    filterTop,
    addDialog,
    managerDialog
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      slotArr: ['action', 'search', 'footer', 'activeFlag'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        adPlatform: undefined,
        accountRoleName: undefined,
        accountId: null,
        platformId: '',
        deliveryType: ''
      },
      loading: false,
      addConfig: {
        visible: false,
        row: {},
        type: 1
      }
    }
  },
  created() {
    if (
      !this.$route.query.platformId ||
      !this.$route.query.adPlatform ||
      !this.$route.query.accountRoleName ||
      !this.$route.query.advertiserId ||
      !this.$route.query.accountId
    ) {
      this.$router.push('/business/release/releaseAccount?callType=2')
      return
    }
  },
  mounted() {
    this.search.platformId = this.$route.query.platformId
    this.search.adPlatform = this.$route.query.adPlatform
    this.search.accountRoleName = this.$route.query.accountRoleName
    this.search.accountParent = this.$route.query.advertiserId
    this.search.accountId = this.$route.query.accountId
    this.searchFn()
  },
  methods: {
    successFn() {
      this.searchFn()
    },
    toManager(row) {
      this.$nextTick(() => {
        this.$refs.managerDialog.managerDialogFlag = true
        this.$refs.managerDialog.loadData(row)
      })
    },
    back() {
      this.$router.push('/business/release/releaseAccount?callType=2')
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        accountId: this.search.accountId
          ? Number(this.search.accountId)
          : undefined,
        advertiserId: this.search.advertiserId,
        discriminate: this.search.discriminate,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        staffId: this.search.staffId,
        platformId: this.search.platformId,
        accountType: this.search.accountType,
        deliveryType: this.search.deliveryType
      }
      advertiserStaffList(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    onClear() {
      this.search = {}
      this.search.platformId = this.$route.query.platformId
      this.search.adPlatform = this.$route.query.adPlatform
      this.search.accountRoleName = this.$route.query.accountRoleName
      this.search.accountParent = this.$route.query.advertiserId
      this.search.accountId = this.$route.query.accountId
      this.searchFn()
    },
    onhandleAdd() {
      this.addConfig = {
        visible: true,
        row: {},
        type: 1
      }
    },
    // 关闭弹框
    closeAddDialog() {
      this.addConfig.visible = false
      this.searchFn()
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        row: {
          ...row
        },
        type: 2
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      // this.$delModal({
      //   width: '505px',
      //   tips: `
      //       <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">删除提醒</div>
      //       <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">删除投放账号，将导致该账号产生的用户线索，无法归属至投放机构。</div>
      //     `,
      //   success: () => {
      //     this.loading = true
      //     delAccount(row.businessId)
      //       .then(res => {
      //         this.$notify.success({ title: '提示', message: '操作成功' })
      //         this.searchFn()
      //       })
      //       .catch(() => {
      //         this.loading = false
      //       })
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
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
  @include responsive-height(20px);
  padding: 20px 20px;
  background: #fff;
}
.back {
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
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
