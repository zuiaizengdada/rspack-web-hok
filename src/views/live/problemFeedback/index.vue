<template>
  <!-- 问题反馈 -->
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
        <filterTop :search="search" :option="resolutionStatusOption" @onSearch="searchFn" @onClear="onClear" />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="onhandleDetail(row)">查看</el-button>
        <el-button v-if="row.status !== 3" type="text" @click="onhandleEdit(row)">处理</el-button>
      </template>
      <template slot="status" slot-scope="{ row }">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.status,resolutionStatusOption)"
          :color="getOptionsValueByKey('value','color', row.status,resolutionStatusOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.status, resolutionStatusOption)"
          :title="getOptionsValueByKey('value','label',row.status,resolutionStatusOption)"
        />
      </template>
      <template slot="feedbackPhone" slot-scope="{ row }">
        <watchPhoneNumber :default-value="row.feedbackPhone" />
      </template>
    </MPageLayout>
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import { getOptionsValueByKey } from '@/filters/index'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { getQuestionFeedbackPage } from '@/api/liveRoom/problemFeedback.js'
import Dialog from '../Dialog/index.js'
import moment from 'moment'
export default {
  components: {
    filterTop,
    watchPhoneNumber
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'status', 'feedbackPhone'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'frameQuestion', label: '画面问题', type: 'text', 'min-width': '113px' },
          { prop: 'soundQuestion', label: '声音问题', type: 'text', 'min-width': '113px' },
          { prop: 'userExperienceQuestion', label: '体验问题', type: 'text', 'min-width': '113px' },
          { prop: 'questionDesc', label: '问题描述', type: 'text', 'min-width': '113px' },
          { prop: 'version', label: '版本号', type: 'text', 'min-width': '113px' },
          { prop: 'feedbackPhone', label: '反馈人手机号', type: 'slot', 'min-width': '130px' },
          { prop: 'createTime', label: '反馈时间', type: 'text', 'width': '200px', render: (row) => { return row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '' } },
          { prop: 'status', label: '解决状态', type: 'slot', 'min-width': '113px' },
          { prop: 'handleUserName', label: '处理人', type: 'text', 'min-width': '113px' },
          { prop: 'handleTime', label: '处理时间', type: 'text', 'width': '200px', render: (row) => { return row.handleTime ? moment(row.handleTime).format('YYYY-MM-DD HH:mm:ss') : '' } },
          { prop: 'action', label: '操作', type: 'slot', width: '120px', fixed: 'right' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        phone: '',
        status: ''
      },
      resolutionStatusOption: [
        { label: '未处理', value: 1, background: '#EEF2F9', color: '#717F99', icon: 'audit_info' },
        { label: '处理中', value: 2, background: '#FFF2E6', color: '#FF7D00', icon: 'audit_wait' },
        { label: '已处理', value: 3, background: '#E6F7EA', color: '#00B42A', icon: 'audit_success' }
      ],
      loading: false
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    getOptionsValueByKey,
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        status: this.search.status,
        feedbackPhone: this.search.phone
      }
      getQuestionFeedbackPage(data).then(res => {
        console.log(res)
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.$nextTick(() => {
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    onClear() {
      this.search = {
        phone: '',
        status: ''
      }
      this.searchFn()
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
    // 点击处理按钮
    onhandleEdit(row) {
      console.log(row)
      Dialog.open({
        visible: true,
        option: this.resolutionStatusOption,
        questionFeedbackId: row.id,
        type: 'ProblemEdit',
        status: row.status,
        success: () => {
          this.getList()
        }
      })
    },
    // 点击查看
    onhandleDetail(row) {
      console.log(row)
      Dialog.open({
        visible: true,
        option: this.resolutionStatusOption,
        questionFeedbackId: row.id,
        type: 'ProblemDetail',
        success: () => {
          Dialog.close()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 169px);
  // min-width: 1200px;
  padding: 20px 20px 0 20px !important;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
