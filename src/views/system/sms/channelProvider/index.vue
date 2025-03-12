<template>
  <!-- 渠道商 -->
  <div class="page_wrap">
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
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="onhandleEdit(scope.row)">编辑</el-button>
        <el-button
          v-if="scope.row.activeFlag === 2"
          type="text"
          class="c_red"
          @click="onhandleDisable(scope.row)"
        >禁用</el-button>
        <el-button
          v-if="scope.row.activeFlag === 1"
          type="text"
          @click="onhandleEnable(scope.row)"
        >启用</el-button>
      </template>
      <template slot="activeFlag" slot-scope="{ row }">
        <AppStatus :status="{ 2: 'success', 1: 'error' }[row.activeFlag]">
          <span>
            {{ statusOption[row.activeFlag] }}
          </span>
        </AppStatus>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
  </div>
</template>

<script>
import { getColumns, statusOption } from './columns.js'
import filterTop from './filterTop.vue'
import addDialog from './addDialog.vue'
import AppStatus from '@/components/AppStatus'
import {
  getSmsChannelList,
  checkSmsChannel,
  disableSmsChannel
} from '@/api/system/sms.js'
export default {
  components: {
    filterTop,
    addDialog,
    AppStatus
  },
  data() {
    return {
      statusOption,
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
        activeFlag: '',
        name: ''
      },
      loading: false,
      addConfig: {
        visible: false,
        row: {},
        type: 0
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        activeFlag: this.search.activeFlag,
        name: this.search.name
      }
      getSmsChannelList(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.searchFn()
    },
    // 编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row)),
        type: 1
      }
    },
    // 新增按钮点击触发
    onhandleAdd() {
      this.addConfig = {
        visible: true,
        row: {},
        type: 0
      }
    },
    onClear() {
      this.search = {
        status: '',
        name: ''
      }
      this.searchFn()
    },
    // 启用
    onhandleEnable(row) {
      this.$delModal({
        width: '505px',
        sureBtnBgColor: '#0C6FFF',
        iconClassName: 'c_0F71FF',
        tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;font-weight: bold;">启用提醒</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">是否启用该渠道商</div>
          `,
        success: () => {
          this.loading = true
          const params = {
            activeFlag: 2,
            id: row.id
          }
          disableSmsChannel(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 禁用
    onhandleDisable(row) {
      this.loading = true
      const params = {
        id: row.id,
        activeFlag: 1
      }
      checkSmsChannel(params)
        .then(res => {
          this.loading = false
          this.$delModal({
            width: '505px',
            noBtn: !res.data.flag,
            tips: `
              <div style="font-size: 16px;color: #333333;line-height: 24px;">禁用提醒</div>
              <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">${res.data.message}</div>
            `,
            success: () => {
              this.loading = true
              const params = {
                activeFlag: 1,
                id: row.id
              }
              disableSmsChannel(params)
                .then(res => {
                  this.$notify.success({ title: '提示', message: '操作成功' })
                  this.getList()
                  this.loading = false
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭弹框并刷新列表数据
    closeAddDialog() {
      this.addConfig.visible = false
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  padding: 0 20px 10px 20px;
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
