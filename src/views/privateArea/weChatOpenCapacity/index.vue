<template>
  <!-- 企微能力开放 -->
  <MCard class="page-wrap">
    <MPageLayout
      ref="MPageLayout"
      :slot-arr="slotArr"
      type="tablePage"
      :page-sizes="config.pageSizes"
      :current-page="config.currentPage"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      class="hk-table"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div slot="headerLeft" class="header">
        <span class="searchLabel m-r-8">外呼渠道名称</span>
        <el-select
          v-model="search.channelId"
          :loading="getRecallProviderLoading"
          size="small"
          clearable
        >
          <el-option
            v-for="(item) in channelOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <span class="m-l-20 searchLabel m-r-8">调用API时间</span>
        <el-date-picker
          v-model="search.time"
          size="small"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
        <el-button :loading="loading" class="m-l-20 " size="small" type="primary" @click="handleSearch">查询</el-button>
        <el-button :loading="loading" size="small" @click="searchClear">重置</el-button>
      </div>
      <template slot="headerRight">
        <el-button size="small" class="btn_primary" @click="handleClickSetting">客服话术设置</el-button>
        <!-- <el-button size="small" class="btn_primary" @click="openAPI">调用API次数</el-button> -->
      </template>
      <template slot="apiCallCount" slot-scope="{ row }">
        <div class="a_link" @click="openAPI">{{ row.apiCallCount }}</div>
      </template>
    </MPageLayout>
    <settingDrawer :title="settingConfig.title" :visible.sync="settingConfig.visible" />
    <apiDetail ref="apiDetail" :channel-id="search.channelId" />
  </MCard>
</template>

<script>
import settingDrawer from './settingDrawer'
import apiDetail from './apiDetail/index'
import { recallProviderPage, getRecallProviderList } from '@/api/privateArea/recall'
import moment from 'moment'
export default {
  components: {
    settingDrawer,
    apiDetail
  },
  data() {
    return {
      loading: false,
      slotArr: ['action', 'headerRight', 'headerLeft', 'footer', 'apiCallCount'],
      config: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        tableColumns: [
          { prop: 'name', label: '外呼渠道名称', type: 'text' },
          { prop: 'apiCallCount', label: '调用API次数', type: 'slot' },
          { prop: 'smsCount', label: '短信发送成功数', type: 'text' },
          { prop: 'qrCodeMsgCount', label: '推送企微二维码数', type: 'text' },
          { prop: 'addContactCount', label: '成功添加企微数', type: 'text' },
          { prop: 'qrCodeMsgRatio', label: '推送企微成功率', type: 'text', slotFn: (row) => row.qrCodeMsgRatio + '%' },
          { prop: 'addContactRatio', label: '添加企微成功率', type: 'text', slotFn: (row) => row.addContactRatio + '%' }
        ],
        tableData: []
      },
      search: {
        channelId: '',
        time: null
      },
      channelOption: [],
      settingConfig: {
        visible: false,
        title: '客服话术设置'
      },
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            const maxTime = moment(this.currentTime).add(3, 'months').valueOf()
            const minTime = moment(this.currentTime).subtract(3, 'months').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      getRecallProviderLoading: false
    }
  },
  created() {
    this.getRecallProviderList()
    this.getList()
  },
  activated() {
    this.getRecallProviderList()
    this.getList()
  },
  mounted() {},
  methods: {
    handleSearch() {
      if (this.search.channelId === '' || !this.search.time) {
        return this.$message.warning('请选择渠道和时间区间!')
      }

      this.config.currentPage = 1
      this.getList()
    },
    async getList() {
      if (this.search.channelId === '' || !this.search.time) {
        this.config.tableData = []
        return
      }

      this.loading = true
      let startTime = ''
      let endTime = ''
      if (this.search.time && this.search.time.length > 0) {
        startTime = this.search.time[0]
      }
      if (this.search.time && this.search.time.length > 0) {
        endTime = this.search.time[1]
      }
      // const startTime = this.search?.time[0] ? this.search.time[0] : undefined
      // const endTime = this.search?.time[1] ? this.search.time[1] : undefined
      const params = {
        channelId: this.search.channelId,
        current: this.config.currentPage,
        size: this.config.pageSize,
        startTime,
        endTime
      }
      recallProviderPage(params).then(res => {
        this.config.tableData = res.data.records
        this.config.total = res.data?.total ?? 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
    // 点击打开客服话术设置
    handleClickSetting() {
      this.settingConfig.visible = true
    },
    openAPI() {
      this.$refs.apiDetail.open(this.search)
    },
    // 点击重置按钮
    searchClear() {
      this.search = {
        channelId: '',
        time: null
      }
      this.config.currentPage = 1
      this.getList()
    },
    // 获取渠道
    getRecallProviderList() {
      this.getRecallProviderLoading = true
      getRecallProviderList().then(res => {
        this.channelOption = res.data
        this.getRecallProviderLoading = false
      }).catch(() => {
        this.getRecallProviderLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page-wrap {
    height: calc(100vh - 94px);
    min-width: 1200px;
    .searchLabel {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
    }
}
::v-deep .tablePage .page_footer{
  box-shadow: none;
}
::v-deep .page_header{
    margin-left: 20px;
    margin-right: 20px;
    padding: 0 0 20px!important;
    margin-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
}
</style>
