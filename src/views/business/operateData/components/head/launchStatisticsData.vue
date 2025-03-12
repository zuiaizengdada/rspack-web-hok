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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >

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
        </div>
        <div slot="advertiserRoi" slot-scope="scope">
          <p v-if="scope.row.advertiserRoi === -1">-</p>
          <p v-else>{{ returnMoneyNumber(scope.row.advertiserRoi) }}</p>
        </div>
        <div slot="monthlyRefund" slot-scope="scope">
          <p>{{ returnMoneyNumber(scope.row.monthlyRefund) }}</p>
        </div>
        <div slot="roi" slot-scope="scope">
          <p v-if="scope.row.roi === -1">-</p>
          <p v-else>{{ scope.row.roi }}</p>
        </div>
        <div slot="roiReachType" slot-scope="scope">
          <p v-if="scope.row.roiReachType === 0" class="red-p">未达标</p>
          <p v-if="scope.row.roiReachType === 1" class="red-green">部门达标</p>
          <p v-if="scope.row.roiReachType === 2" class="red-green">个人达标</p>
          <p v-if="scope.row.roiReachType === 3" class="red-green">账号达标</p>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import {
  getAdvertiseMonthPage
} from '@/api/business/financial'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderListData',
  components: {

  },
  props: {

  },
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
        deptId: '' // 投放部门
      },
      slotArr: ['monthlyRevenue', 'monthlyCost', 'monthlyRefund', 'roiReachFlag', 'monthlyGmv', 'monthlyDirectGmv', 'monthlyIndirectGmv', 'advertiseFlag', 'advertiserRoi', 'roi', 'roiReachType'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'year', label: '年份', type: 'text', visible: true, disable: true },
          { prop: 'month', label: '月份', type: 'text', visible: true, disable: true },
          { prop: 'advertiserId', label: '投放账号', type: 'text', visible: true },
          { prop: 'advertiseFlag', label: '账号类型', type: 'slot', visible: true },
          { prop: 'advertiserPutterName', label: '投放人员', align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'secondDeptName', label: '投放部门', type: 'text', visible: true },
          { prop: 'monthlyDirectGmv', label: '直接成交GMV', width: 130, type: 'slot', visible: true },
          { prop: 'monthlyIndirectGmv', label: '间接成交GMV', width: 130, type: 'slot', visible: true },
          { prop: 'monthlyGmv', label: '累计GMV', type: 'slot', visible: true },
          { prop: 'monthlyRefund', label: '退款金额', type: 'slot', visible: true },
          { prop: 'monthlyRevenue', label: '当月累计营收', type: 'slot', visible: true },
          { prop: 'monthlyCost', label: '当月累计花费', type: 'slot', visible: true },
          { prop: 'advertiserRoi', label: 'ROI', type: 'slot', visible: true },
          { prop: 'roiReachFlag', label: '是否达标', type: 'slot', visible: true },
          { prop: 'roiReachType', label: '达标类型', type: 'slot', visible: true },
          { prop: 'roi', label: '达标判定ROI', type: 'slot', visible: true }
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
    returnMoneyNumber(number) {
      const newNum = number / 100
      if (newNum < 1000000 && newNum > -10000000) {
        return newNum.toFixed(2)
      } else {
        return (newNum / 10000).toFixed(2) + '万'
      }
    },
    formLastLoadData() {
      this.loadData(this.search)
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
    </style>

