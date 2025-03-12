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
          :columns="config.tableColumns"
          :loading="loading"
          :search="search"
          @change="handleCheckedTableColumnsChange"
          @onSearch="searchFn"
          @onClear="onClear"
          @onhandleAdd="onhandleAdd"
        />
      </template>
      <template slot="receiveStatus" slot-scope="{ row }">
        <AppStatus
          v-if="row.receiveStatus"
          :status="{ 3: 'success', 1: 'info', 2: 'error' }[row.receiveStatus]"
        >
          <el-popover
            v-if="row.receiveStatus === 2"
            class="item"
            :content="row.unreceivedReason || '暂无原因'"
            placement="bottom-start"
            trigger="hover"
          >
            <span slot="reference">{{
              receiveStatusOption[row.receiveStatus]
            }}</span>
          </el-popover>
          <span v-else>{{ receiveStatusOption[row.receiveStatus] }}</span>
        </AppStatus>
      </template>
      <template slot="content" slot-scope="{ row }">
        <div v-if="row.content.length < 70">{{ row.content }}</div>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          :content="row.content"
          placement="top"
        >
          <div class="ellipsis">{{ row.content.slice(0, 70) }}...</div>
        </el-tooltip>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import { getColumns, receiveStatusOption } from './columns.js'
import filterTop from './filterTop.vue'
import AppStatus from '@/components/AppStatus'
import { getMsmsSendLogPage } from '@/api/system/sms.js'
import moment from 'moment'
export default {
  components: {
    filterTop,
    AppStatus
  },
  data() {
    return {
      receiveStatusOption,
      slotArr: ['action', 'search', 'footer', 'receiveStatus', 'content'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        smsTypeId: '', // 模板类型
        channelId: '', // 渠道商名称
        receiveStatus: '', // 到达状态
        sendTime: [
          moment().format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ],
        tem: { label: 'phone', value: '' }
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
      this.config.tableData = []
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        smsTypeId: this.search.smsTypeId,
        channelId: this.search.channelId,
        [this.search.tem.label]: this.search.tem.value,
        receiveStatus: this.search.receiveStatus,
        sendEndTime: this.search.sendTime
          ? this.search.sendTime[1] + ' 23:59:59'
          : '',
        sendStartTime: this.search.sendTime
          ? this.search.sendTime[0] + ' 00:00:00'
          : ''
      }
      getMsmsSendLogPage(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
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
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
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
        smsTypeId: '', // 模板类型
        channelId: '', // 渠道商名称
        receiveStatus: '', // 到达状态
        sendTime: [
          moment().format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ],
        tem: { label: 'phone', value: '' }
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
        success: () => {}
      })
    },
    // 禁用
    onhandleDisable(row) {
      this.$delModal({
        width: '505px',
        tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;">禁用提醒</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">提示场景1:
              是否确认禁用‘{阿里云}’？禁用之后发送“{验证码/通知}”将不再使用‘阿里云’发送，请谨慎操作

              提示场景2:
              “{验证码}”用途的渠道商当前只有1个在启用状态，不能关闭此渠道商，请先启用其他{验证码}用途的渠道商再关闭‘{阿里云}’。</div>
          `,
        success: () => {}
      })
    },
    // 点击关闭弹框并刷新列表数据
    closeAddDialog() {
      this.addConfig.visible = false
      this.searchFn()
    },
    // 自定义表头触发
    handleCheckedTableColumnsChange() {
      this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
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
