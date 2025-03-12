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
        <div slot="complementStatus" slot-scope="scope">
          <p v-if="scope.row.complementStatus === 1" class="red-cls">待人工补偿</p>
          <p v-if="scope.row.complementStatus === 2" class="success-cls">人工补偿成功</p>
          <p v-if="scope.row.complementStatus === 3" class="success-cls">系统补偿成功</p>
          <p v-if="scope.row.complementStatus === 4" class="sys-cls">系统补偿中</p>
        </div>
        <div slot="complementType" slot-scope="scope">
          <p v-if="scope.row.complementType === 0">无</p>
          <p v-if="scope.row.complementType === 1">系统</p>
          <p v-if="scope.row.complementType === 2">人工</p>
        </div>
        <div slot="postReceiver" slot-scope="scope">
          <p>{{ scope.row.postReceiver?scope.row.postReceiver:'无' }}</p>
        </div>
        <div slot="postTel" slot-scope="scope">
          <p>{{ scope.row.postTel?scope.row.postTel:'无' }}</p>
        </div>
        <div slot="updateBy" slot-scope="scope">
          <p>{{ scope.row.updateBy?scope.row.updateBy:'无' }}</p>
        </div>
        <div slot="liveType" slot-scope="scope">
          <p v-if="scope.row.liveType === 0">-</p>
          <p v-if="scope.row.liveType === 1">运营直播</p>
          <p v-if="scope.row.liveType === 2">老师直播</p>
          <p v-if="scope.row.liveType === 3">主播直播</p>
        </div>
        <div slot="updateTime" slot-scope="scope">
          <p>{{ scope.row.updateTime?scope.row.updateTime:'无' }}</p>
        </div>
        <div slot="channelSource" slot-scope="scope">
          <p>{{ returnChannelName(scope.row.channelSource) }}</p>
        </div>

        <div slot="productCategory" slot-scope="scope">
          <p v-if="scope.row.productCategory === 0">视频课</p>
          <p v-else-if="scope.row.productCategory === 1">直播课</p>
          <p v-else-if="scope.row.productCategory === 2">线下课</p>
        </div>
        <div slot="labelCode" slot-scope="scope">
          <p>{{ returnLabelCode(scope.row.labelCode) }}</p>
        </div>
        <!-- <div slot="roiReachFlagName" slot-scope="scope">
          <p v-if="scope.row.orderStatusName === '未支付'">-</p>
          <p v-else>{{ scope.row.roiReachFlagName }}</p>
        </div>
        <div slot="isCompanyOwnFlagName" slot-scope="scope">
          <p v-if="scope.row.orderStatusName === '未支付'">-</p>
          <p v-else>{{ scope.row.isCompanyOwnFlagName }}</p>
        </div>
        <div slot="brushFlagName" slot-scope="scope">
          <p v-if="scope.row.orderStatusName === '未支付'">-</p>
          <p v-else>{{ scope.row.brushFlagName }}</p>
        </div>
        <div slot="companyOwnFlagName" slot-scope="scope">
          <p v-if="scope.row.isCompanyOwnFlagName === '否'">-</p>
          <p v-else>{{ scope.row.companyOwnFlagName }}</p>
        </div> -->

        <div slot="action" slot-scope="scope">
          <el-button v-if="scope.row.complementStatus === 1 || scope.row.complementStatus === 4" type="text" @click="toComplete(scope.row)">补齐订单</el-button>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import {
  getFinancialPage
} from '@/api/business/financial'
import { mapGetters } from 'vuex'
import { getItem } from '@/utils/localStorage'
export default {
  name: 'OrderListData',
  components: {

  },
  props: {

  },
  data() {
    return {
      orgInfo: {},
      row: {},
      loading: false,
      orderTimeArray: [],
      searchForStart: {
        orderNo: '',
        orderChannel: 1, // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        orderStartTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '' // 员工
      },
      slotArr: ['action', 'footer', 'labelCode', 'brushFlagName', 'isCompanyOwnFlagName', 'productCategory', 'companyOwnFlagName', 'roiReachFlagName', 'complementStatus', 'channelSource', 'complementType', 'postReceiver', 'postTel', 'updateBy', 'liveType', 'updateTime'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [

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
  mounted() {
    this.orgInfo = getItem('orgInfo')
    if (this.orgInfo.organizationId === 1000) {
      this.config.tableColumns = [
        { prop: 'orderChannelName', label: '渠道', width: 100, type: 'text', visible: true, disable: true },
        { prop: 'shopName', label: '店铺名', width: 300, type: 'text', visible: true, disable: true },
        { prop: 'orderNo', label: '第三方订单号', width: 280, align: 'left', type: 'text', visible: true, disable: true },
        { prop: 'orderSourceName', label: '订单类型', type: 'text', visible: true },
        { prop: 'liveType', label: '直播类型', type: 'slot', visible: true },
        { prop: 'orderStatusName', label: '订单状态', type: 'text', visible: true },
        { prop: 'orderCreateTime', label: '创建时间', width: 160, type: 'text', visible: true },
        { prop: 'goodsName', label: '第三方商品名称', width: 260, type: 'text', visible: true },
        { prop: 'productId', label: '第三方商品ID', width: 240, type: 'text', visible: true },
        { prop: 'productNum', label: '商品数量', width: 120, type: 'text', visible: true },
        { prop: 'productCategory', label: '商品分类标签', width: 160, type: 'slot', visible: true },
        { prop: 'labelCode', label: '商品标签', width: 160, type: 'slot', visible: true },
        { prop: 'teacherName', label: '老师', width: 160, type: 'text', visible: true },
        // { prop: 'goodsAmount', label: '商品金额', width: 160, type: 'text', visible: true },
        { prop: 'payableAmount', label: '应付金额', width: 100, align: 'center', type: 'text', visible: true },
        // { prop: 'transactionId', label: '交易流水号', width: 160, align: 'center', type: 'text', visible: true },
        { prop: 'payerTotal', label: '实付金额', type: 'text', visible: true },
        { prop: 'payTime', label: '支付时间', width: 160, type: 'text', visible: true },
        // { prop: 'thirdAfterSaleName', label: '售后状态', type: 'text', visible: true },
        { prop: 'refundAmount', label: '退款金额', type: 'text', visible: true },
        { prop: 'refundTime', label: '退款时间', width: 160, type: 'text', visible: true },
        { prop: 'refundAtDifferentMonthName', label: '是否往月退款', width: 160, type: 'text', visible: true },
        { prop: 'expertId', label: '达人ID', width: 240, type: 'text', visible: true },
        { prop: 'expertName', label: '达人昵称', type: 'text', visible: true },
        { prop: 'liveRoomId', label: '直播间id', width: 240, type: 'text', visible: true },
        // { prop: 'liveType', label: '直播类型', type: 'slot', visible: true },
        // { prop: 'lecturer', label: '直播老师', type: 'text', visible: true },
        // { prop: 'carrXXX_id', label: 'carrXXX_id', type: 'text', visible: true },
        { prop: 'operateUserName', label: '运营人员', type: 'text', visible: true },
        { prop: 'operateDeptName', label: '运营部门', type: 'text', visible: true },
        { prop: 'anchorName', label: '直播人员', type: 'text', visible: true },
        { prop: 'anchorDeptName', label: '直播部门', type: 'text', visible: true },
        { prop: 'liveScheduleId', label: '绑定排班ID', type: 'text', width: 160, visible: true },
        { prop: 'revenueOwnerName', label: '归属员工', type: 'text', visible: true },
        { prop: 'revenueOwnerDeptName', label: '归属员工部门', width: 180, type: 'text', visible: true },
        { prop: 'orderClassificationName', label: '付费/免费', width: 160, type: 'text', visible: true },
        { prop: 'brushFlagName', label: '是否刷单', type: 'text', align: 'center', visible: true },
        { prop: 'advertiseChannelName', label: '投放平台', type: 'text', visible: true },
        { prop: 'advertiserId', label: '投放账号', width: 240, type: 'text', visible: true },
        { prop: 'advertiserPutterName', label: '投放人员', type: 'text', visible: true },
        { prop: 'advertiserPutterDeptName', label: '投放部门', type: 'text', visible: true },
        { prop: 'roiReachFlagName', label: 'ROI达标', align: 'center', type: 'text', visible: true },
        { prop: 'isCompanyOwnFlagName', label: '是否归公', type: 'text', visible: true },
        { prop: 'companyOwnFlagName', label: '归公类型', type: 'text', visible: true },
        { prop: 'companyOwnRevenue', label: '归公金额', align: 'center', type: 'text', visible: true },
        { prop: 'channelSourceName', label: '渠道来源', type: 'text', visible: true }
        // { prop: 'refundAmount', label: '商品关联老师', type: 'text', visible: true },
      ]
    } else {
      this.config.tableColumns = [{ prop: 'orderChannelName', label: '渠道', width: 100, type: 'text', visible: true, disable: true },
        { prop: 'shopName', label: '店铺名', width: 300, type: 'text', visible: true, disable: true },
        { prop: 'orderNo', label: '第三方订单号', width: 280, align: 'left', type: 'text', visible: true, disable: true },
        { prop: 'orderSourceName', label: '订单类型', type: 'text', visible: true },
        { prop: 'liveType', label: '直播类型', type: 'slot', visible: true },
        { prop: 'orderStatusName', label: '订单状态', type: 'text', visible: true },
        { prop: 'orderCreateTime', label: '创建时间', width: 160, type: 'text', visible: true },
        { prop: 'goodsName', label: '第三方商品名称', width: 260, type: 'text', visible: true },
        { prop: 'productId', label: '第三方商品ID', width: 240, type: 'text', visible: true },
        { prop: 'productNum', label: '商品数量', width: 120, type: 'text', visible: true },
        { prop: 'teacherName', label: '老师', width: 160, type: 'text', visible: true },
        { prop: 'payableAmount', label: '应付金额', width: 100, align: 'center', type: 'text', visible: true },
        { prop: 'payerTotal', label: '实付金额', type: 'text', visible: true },
        { prop: 'payTime', label: '支付时间', width: 160, type: 'text', visible: true },
        { prop: 'refundAmount', label: '退款金额', type: 'text', visible: true },
        { prop: 'refundTime', label: '退款时间', width: 160, type: 'text', visible: true },
        { prop: 'expertId', label: '达人ID', width: 240, type: 'text', visible: true },
        { prop: 'expertName', label: '达人昵称', type: 'text', visible: true },
        { prop: 'liveRoomId', label: '直播间id', width: 240, type: 'text', visible: true },
        { prop: 'operateUserName', label: '运营人员', type: 'text', visible: true },
        { prop: 'operateDeptName', label: '运营部门', type: 'text', visible: true },
        { prop: 'anchorName', label: '直播人员', type: 'text', visible: true },
        { prop: 'anchorDeptName', label: '直播部门', type: 'text', visible: true },
        { prop: 'liveScheduleId', label: '绑定排班ID', type: 'text', width: 160, visible: true },
        { prop: 'orderClassificationName', label: '付费/免费', width: 160, type: 'text', visible: true },
        { prop: 'advertiserPutterName', label: '投放人员', type: 'text', visible: true },
        { prop: 'advertiserPutterDeptName', label: '投放部门', type: 'text', visible: true }
      ]
    }
  },
  activated() {
  },
  methods: {
    returnLabelCode(string) {
      console.log(string)
      if (string.indexOf(',') > 0) {
        const strArray = string.split(',')
        var stringReturn = ''
        strArray?.some(item => {
          if (item === '0') {
            stringReturn += '普通商品' + '、'
          }
          if (item === '1') {
            stringReturn += '大6P' + '、'
          }
          if (item === '2') {
            stringReturn += '刷单' + '、'
          }
          if (item === '3') {
            stringReturn += '单量归公' + '、'
          }
          if (item === '4') {
            stringReturn += '营收归公' + '、'
          }
        })
        console.log('stringReturn::', stringReturn)
        return stringReturn.substring(0, stringReturn.length - 1)
      } else {
        var stringReturnString = ''
        if (string === '0') {
          stringReturnString += '普通商品'
        }
        if (string === '1') {
          stringReturnString += '大6P'
        }
        if (string === '2') {
          stringReturnString += '刷单'
        }
        if (string === '3') {
          stringReturnString += '单量归公'
        }
        if (string === '4') {
          stringReturnString += '营收归公'
        }
        return stringReturnString
      }
    },
    toComplete(row) {
      this.row = row
      this.$refs.completeModal.show(row)
    },
    returnChannelName(value) {
      let str = ''
      this.channelSourceType.some(item => {
        if (item.value === value) {
          str = item.label
        }
      })
      return str
    },
    formLastLoadData() {
      this.loadData(this.search)
    },
    loadData(search) {
      this.searchForStart = { ...search }
      if (this.searchForStart.orderNo) {
        console.log()
      } else if (!this.searchForStart.orderStartTime && !this.searchForStart.orderEndTime) {
        this.$message.error('请选择订单时间范围!')
        return
      }
      getFinancialPage(this.searchForStart).then(res => {
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
      getFinancialPage(this.searchForStart).then(res => {
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
      getFinancialPage(this.searchForStart).then(res => {
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

    .red-cls {
      color: #F53F3F;
    }
    .success-cls {
      color: #67c23a;
    }
    .sys-cls {
      color: #0C6FFF;
    }
  </style>

