<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        :span-method="arraySpanMethod"
        border
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <div slot="advertiserName" slot-scope="scope">
          <span>
            <p class="advers-name-cls">{{ scope.row.advertiserAlias ? scope.row.advertiserAlias : scope.row.advertiserName }}</p>
            <i class="el-icon-edit sys-cls cursor" @click="updateAdvertiserName(scope.row)" />
          </span>
        </div>
        <div slot="advertiseChannel" slot-scope="scope">
          <p>{{ returnChannelName(scope.row.advertiseChannel) }}</p>
        </div>
        <div slot="monthlyRevenue" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyRevenue) }}</p>
        </div>
        <div slot="monthlyCost" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyCost) }}</p>
        </div>
        <div slot="monthlyDirectGmv" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyDirectGmv) }}</p>
        </div>
        <div slot="monthlyIndirectGmv" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyIndirectGmv) }}</p>
        </div>
        <div slot="monthlyGmv" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyGmv) }}</p>
        </div>
        <div slot="advertiseFlag" slot-scope="scope">
          <p v-if="scope.row.advertiseFlag === 0">自投</p>
          <p v-else-if="scope.row.advertiseFlag === 1">代投</p>
        </div>
        <div slot="roiReachFlag" slot-scope="scope">
          <p v-if="scope.row.roiReachFlag === 0" class="red-p">未达标</p>
          <p v-else-if="scope.row.roiReachFlag === 1" class="red-green">达标</p>
          <p v-else class="red-green">/</p>
        </div>
        <div slot="advertiserRoi" slot-scope="scope">
          <p v-if="scope.row.advertiserRoi === -1">-</p>
          <p v-else>{{ scope.row.advertiserRoi }}</p>
        </div>
        <div slot="monthlyRefund" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyRefund) }}</p>
        </div>
        <div slot="roi" slot-scope="scope">
          <div v-if="scope.row.year === '总计'">
            <p>/</p>
          </div>
          <div v-else>
            <p v-if="scope.row.roi === -1">-</p>
            <p v-else>{{ scope.row.roi }}</p>
          </div>
        </div>
        <div slot="roiReachType" slot-scope="scope">
          <p v-if="scope.row.roiReachType === 0" class="red-p">未达标</p>
          <p v-else-if="scope.row.roiReachType === 1" class="red-green">部门达标</p>
          <p v-else-if="scope.row.roiReachType === 2" class="red-green">个人达标</p>
          <p v-else-if="scope.row.roiReachType === 3" class="red-green">账号达标</p>
          <p v-else>/</p>
        </div>
        <div slot="action" slot-scope="scope">
          <el-button v-if="scope.row.advertiseLink" type="text" @click="linkToTfpg(scope.row.advertiseLink)">投放平台</el-button>
          <p v-else />
        </div>
      </MPageLayout>
    </div>
    <updateAdvertiserName ref="updateAdvertiserName" @loadData="loadDataAfterSet" />
  </div>
</template>

<script>
import {
  getAdvertiseMonthPage, getAdvertiseMonthlyStatsSummary
} from '@/api/business/financial'
import { mapGetters } from 'vuex'
import updateAdvertiserName from '@/views/business/financialInstruments/components/updateAdvertiserName'
export default {
  name: 'OrderListData',
  components: {
    updateAdvertiserName
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['advertiseChannelArray'],
  data() {
    return {
      row: {},
      loading: false,
      orderTimeArray: [],
      searchForStart: {
        timeForYear: '', // 选择日期的年份
        timeForMonth: '', // 选择日期的月份
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        roiReachFlag: '', // 达标状态
        advertiseChannel: '',
        deptId: '' // 投放部门
      },
      slotArr: ['monthlyRevenue', 'monthlyCost', 'advertiseChannel', 'advertiserName', 'monthlyGmv', 'monthlyDirectGmv', 'monthlyRefund', 'monthlyIndirectGmv', 'roiReachFlag', 'advertiseFlag', 'advertiserRoi', 'roi', 'roiReachType', 'action'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'year', label: '年份', type: 'text', visible: true, disable: true },
          { prop: 'advertiseChannel', label: '投放平台', type: 'slot', visible: true },
          { prop: 'month', label: '月份', type: 'text', visible: true, disable: true },
          { prop: 'advertiserId', label: '投放账号', width: 150, type: 'text', visible: true },
          { prop: 'advertiserName', label: '投放账号名称', width: 360, type: 'slot', visible: true },
          { prop: 'advertiseFlag', label: '账号类型', type: 'slot', visible: true },
          { prop: 'advertiserPutterName', label: '投放人员', width: 150, align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'secondDeptName', label: '投放部门', width: 150, type: 'text', visible: true },
          { prop: 'monthlyDirectGmv', label: '直接成交GMV', width: 140, type: 'slot', visible: true },
          { prop: 'monthlyIndirectGmv', label: '间接成交GMV', width: 140, type: 'slot', visible: true },
          { prop: 'monthlyGmv', label: '累计GMV', width: 120, type: 'slot', visible: true },
          { prop: 'monthlyRefund', label: '退款金额', type: 'slot', visible: true },
          { prop: 'monthlyRevenue', label: '当月累计营收', width: 120, type: 'slot', visible: true },
          { prop: 'monthlyCost', label: '当月累计花费', width: 120, type: 'slot', visible: true },
          { prop: 'advertiserRoi', label: 'ROI', type: 'slot', visible: true },
          { prop: 'roiReachFlag', label: '是否达标', type: 'slot', visible: true },
          { prop: 'roiReachType', label: '达标类型', type: 'slot', visible: true },
          { prop: 'roi', label: '达标判定ROI', width: 140, type: 'slot', visible: true },
          { prop: 'action', label: '操作', width: 100, type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === (this.config.tableData.length - 1)) {
        if (columnIndex === 0) {
          return [1, 8]
        } else if (columnIndex === 1) {
          return [0, 0]
        } else if (columnIndex === 2) {
          return [0, 0]
        } else if (columnIndex === 3) {
          return [0, 0]
        } else if (columnIndex === 4) {
          return [0, 0]
        } else if (columnIndex === 5) {
          return [0, 0]
        } else if (columnIndex === 6) {
          return [0, 0]
        } else if (columnIndex === 7) {
          return [0, 0]
        }
      }
    },
    linkToTfpg(linkUrl) {
      window.open(linkUrl, '_blank')
    },
    returnChannelName(name) {
      let channelName = ''
      this.advertiseChannelArray.some(item => {
        if (item.code === name) {
          channelName = item.message
        }
      })
      return channelName
    },
    updateAdvertiserName(row) {
      this.$refs.updateAdvertiserName.dialogFormVisible = true
      this.$refs.updateAdvertiserName.row.advertiseChannel = row.advertiseChannel
      this.$refs.updateAdvertiserName.row.advertiserId = row.advertiserId
      this.$refs.updateAdvertiserName.form.aliasName = row.advertiserAlias ? row.advertiserAlias : row.advertiserName
    },
    returnMoneyNumber(number) {
      if (number) {
        const newNum = number / 100
        if (newNum < 1000000 && newNum > -10000000) {
          return newNum.toFixed(2)
        } else {
          return (newNum / 10000).toFixed(2) + '万'
        }
      } else {
        return ''
      }
    },
    formLastLoadData() {
      this.loadData(this.search)
    },
    loadDataAfterSet() {
      if (this.searchForStart.timeForYear === '' && this.searchForStart.timeForMonth === '') {
        this.searchForStart.month = ''
      } else {
        this.searchForStart.month = this.searchForStart.timeForYear + '-' + this.searchForStart.timeForMonth + '-01'
      }
      getAdvertiseMonthPage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    loadData(search) {
      this.searchForStart = { ...search }
      if (this.searchForStart.timeForYear === '' && this.searchForStart.timeForMonth === '') {
        this.searchForStart.month = ''
      } else {
        this.searchForStart.month = this.searchForStart.timeForYear + '-' + this.searchForStart.timeForMonth + '-01'
      }
      getAdvertiseMonthPage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.getAdvertiseMonthlyStatsSummary()
        }
      })
    },
    getAdvertiseMonthlyStatsSummary() {
      getAdvertiseMonthlyStatsSummary(this.searchForStart).then(res => {
        if (res.code === 1 && res.data) {
          if (this.config.tableData && this.config.tableData[this.config.tableData.length - 1].year !== '总计') {
            res.data.year = '总计'
            this.config.tableData.push(res.data)
          }
        } else {
          this.config.tableData.push({})
        }
      })
    },
    handleCurrentChange(val) {
      this.searchForStart.pageIndex = val
      getAdvertiseMonthPage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.getAdvertiseMonthlyStatsSummary()
        }
      })
    },
    handleSizeChange(val) {
      this.searchForStart.pageSize = val
      getAdvertiseMonthPage(this.searchForStart).then(res => {
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.getAdvertiseMonthlyStatsSummary()
        }
      })
    }
  }
}
</script>

    <style scoped lang="scss">
      .page_wrap {
        height: 100%;
        // background-color: #fff;
        ::v-deep .el-table::before {
          height: 0px;
        }
        ::v-deep .customer-table .el-table__fixed-right::before,
        .el-table__fixed::before {
          width: 0;
        }
        .content {
          height: 100%;
          min-height: 580px;
          ::v-deep .tablePage .page_content {
            min-height: 500px;
            padding: 0;
          }
          ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
            min-height: 460px;
          }
          ::v-deep .el-table__body-wrapper .is-scrolling-left {
            min-height: 460px;
          }
        }
      }

      .red-cls,.red-p {
        color: #F53F3F;
      }
      .success-cls,.red-green {
        color: #67c23a;
      }
      .sys-cls {
        color: #0C6FFF;
      }

      .advers-name-cls {
        float: left;
        max-width: 340px;
        margin-right: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cursor {
        cursor: pointer;
      }
    </style>

