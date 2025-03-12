<template>
  <!-- 广告投放 -->
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
          :columns="config.tableColumns"
          :loading="loading"
          :search="search"
          @searchFn="searchFn"
          @change="handleCheckedTableColumnsChange"
          @clear="searchClear"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="openDetailDialog(scope.row)">详情</el-button>
      </template>
      <template slot="phone" slot-scope="{ row }">
        <watchPhoneNumber :default-value="row.phone" :user-id="row.userId" @success="$refs.MPageLayout.doLayout()" />
      </template>
      <template slot="refundFlag" slot-scope="{ row }">
        <AppStatus :status="{1: 'error', 2: 'success'}[row.refundFlag]">
          <span>{{ refundFlagStatus[row.refundFlag] }}</span>
        </AppStatus>
      </template>
      <template slot="adPlatformName" slot-scope="{ row }">
        <div class="adPlatform">
          <el-image :src="row.adPlatformIconUrl" style="width: 24px;height:24px;" />
          <div class="adPlatformName">{{ row.adPlatformName }}</div>
        </div>
      </template>
    </MPageLayout>

    <!-- 详情弹框 -->
    <detailDrawer :row="detailDialog.row" :visible.sync="detailDialog.visible" append-to-body />
  </div>
</template>

<script>
import filterTop from './component/filterTop.vue'
import { getColumns, refundFlagStatus } from './component/columns.js'
import detailDrawer from './component/detailDrawer.vue'
import watchPhoneNumber from '../components/watchPhoneNumber.vue'
import { visitorOrderPage, getBindPhoneCode } from '@/api/deliver/advertising'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    filterTop,
    detailDrawer,
    watchPhoneNumber,
    AppStatus
  },
  data() {
    return {
      refundFlagStatus,
      slotArr: ['action', 'search', 'footer', 'phone', 'refundFlag', 'adPlatformName'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 筛选栏对象
      search: {
        transactionId: '',
        payTime: '',
        phone: '',
        orderNo: '',
        channelSource: '',
        adPlatformId: '',
        refundFlag: '',
        goodsName: ''
      },
      // 详情弹框
      detailDialog: {
        visible: false,
        row: {}
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
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
        payStarTime: this.search.payTime ? this.search.payTime[0] : '',
        payEndTime: this.search.payTime ? this.search.payTime[1] : '',
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      delete params.payTime
      console.log(params)
      visitorOrderPage(params).then(res => {
        console.log(res)
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.$nextTick(() => {
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 自定义表头改变触发
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    },
    // 筛选栏点击筛选按钮
    searchFn(val) {
      this.config.currentPage = 1
      this.getList()
    },
    // 筛选条件清空
    searchClear() {
      this.search = {
        transactionId: '',
        payTime: '',
        phone: '',
        orderNo: '',
        channelSource: '',
        adPlatformId: '',
        refundFlag: '',
        goodsName: ''
      }
      this.config.currentPage = 1
      this.searchFn()
    },
    // 打开详情弹框
    openDetailDialog(row) {
      console.log(row, '打开详情弹框')
      this.detailDialog.row = row
      this.detailDialog.visible = true
    },
    // 点击获取用户手机号
    getPhone(row) {
      console.log(row)
      return getBindPhoneCode(row)
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 90px);
  padding: 0 20px;
  background: #fff;
  border-radius: 10px;
}
::v-deep {
  .tablePage .page_content {
    padding-bottom: 0px;
  }
  .tablePage .page_footer{
    justify-content: space-between;
    box-shadow: none;
    padding:10px 0px 10px;
    height:auto;
  }
  .page_header{
    padding: 0!important;
  }
  .my-table{
    margin:0!important
  }
}
.adPlatform {
  display: flex;
  align-items: center;
  .adPlatformName {
    margin-left: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
  }
}
</style>
