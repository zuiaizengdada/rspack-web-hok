<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="线索数据" name="clue">
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
              <el-button type="text" class="c_red" @click="onhandleDel(row)"
                >删除</el-button
              >
            </template>
          </MPageLayout>

          <!-- 弹框层 -->
          <addDialog :config="addConfig" @success="closeAddDialog" />
        </MCard>
      </el-tab-pane>
      <el-tab-pane label="广告数据" name="advertising">
        <advertisingData />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getColumns } from './columns.js'
import filterTop from './filterTop.vue'
import { getAccountPage, delAccount } from '@/api/business/clue.js'
import advertisingData from './advertisingData'
import addDialog from './addDialog.vue'
export default {
  components: {
    filterTop,
    addDialog,
    advertisingData
  },
  data() {
    return {
      activeName: 'clue',
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
        adPlatform: '', // 投放平台
        advertiserId: '', // 广告主Id
        deptId: '', // 投放部门
        deptName: '', // 投放部门名称
        fyId: '', // 飞鱼账号id
        userId: '', // 运营人员姓名
        userName: '' // 部门id
      },
      loading: false,
      addConfig: {
        visible: false,
        row: {},
        type: 1
      }
    }
  },
  mounted() {
    // 获取路由参数
    this.search.adPlatform = this.$route.query.adPlatform
    if (this.$route.query.callType === '2') {
      this.activeName = 'advertising'
    }
    this.searchFn()
  },
  methods: {
    handleClick() {},
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        adPlatform: this.search.adPlatform,
        advertiserId: this.search.advertiserId,
        deptId: this.search.deptId,
        fyId: this.search.fyId,
        userId: this.search.userId
      }
      getAccountPage(params)
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
      this.search = {
        adPlatform: '', // 投放平台
        advertiserId: '', // 广告主Id
        deptId: '', // 投放部门
        deptName: '', // 投放部门名称
        fyId: '', // 飞鱼账号id
        userId: '', // 运营人员姓名
        userName: '' // 部门id
      }
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
          userId: row.adProductUserId, // 员工Id
          userName: row.userName, // 员工姓名
          deptId: row.adProductDeptId, // 员工部门ID
          fyId: row.fyId, // 飞鱼账号ID
          businessId: row.businessId,
          fyAccount: row.fyAccount, // 飞鱼账号
          advertiserId: row.advertiserId, // 广告主ID
          accountChannel: row.adPlatform // 账号渠道
        },
        type: 2
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      console.log(row)
      this.$delModal({
        width: '505px',
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">删除提醒</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">删除投放账号，将导致该账号产生的用户线索，无法归属至投放机构。</div>
        `,
        success: () => {
          this.loading = true
          delAccount(row.businessId)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
  @include responsive-height(20px);
  background: #fff;
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
