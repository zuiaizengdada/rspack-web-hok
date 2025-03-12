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
        <div slot="couponName" slot-scope="scope">
          <div>
            <p class="goods-title-cls">{{ scope.row.couponName }}</p>
            <p class="goods-blue-cls" style="cursor: pointer; width: 100%; float: left;">
              <span style="float: left;" @click="toDetail(scope.row)">ID:{{ scope.row.couponNo }}</span>
              <img v-clipboard:copy="scope.row.couponNo" v-clipboard:success="clipboardSuccess" title="复制订单号" style="float: left; margin-top: 4px;width: 14px; height: 14px;font-style: normal; margin-left: 10px;" src="../../../../assets/image/coupon/icn_copy.png">
            </p>
            <em v-if="scope.row.couponType === 1" class="goods-em-cls">商品优惠券</em>
            <em v-if="scope.row.couponType === 2" class="goods-em-cls">店铺优惠券</em>
            <em v-if="scope.row.couponType === 3" class="goods-em-cls">直播优惠券</em>
          </div>
        </div>
        <div slot="couponContent" slot-scope="scope">
          <p class="coupon-youhui">{{ scope.row.couponContent }}</p>
          <span v-if="scope.row.discountMethod === 1" class="coupon-yh-em">指定商品满减券</span>
          <span v-if="scope.row.discountMethod === 2" class="coupon-yh-em">指定商品直减券</span>
          <span v-if="scope.row.discountMethod === 3" class="coupon-yh-em">指定商品折扣券</span>
        </div>
        <div slot="useBaifenb" slot-scope="scope">
          <p v-if="scope.row.claimCount === 0">-</p>
          <p v-else>{{ ((scope.row.writeOffCount / scope.row.claimCount)*100).toFixed(2) }} %</p>
        </div>
        <div slot="downBili" slot-scope="scope">
          <p v-if="scope.row.claimUserCount === 0">-</p>
          <p v-else>{{ ((scope.row.userCount / scope.row.claimUserCount)*100).toFixed(2) }} %</p>
        </div>
        <div slot="orderAmount" slot-scope="scope">
          <p>{{ scope.row.orderAmount/100 }}</p>
        </div>
        <div slot="discountAmount" slot-scope="scope">
          <p>{{ scope.row.discountAmount/100 }}</p>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { couponTypePage } from '@/api/marketingTools/coupon.js'
import clipboard from '@/directive/clipboard/index.js'
export default {
  name: 'OrderListData',
  components: {

  },
  directives: {
    clipboard
  },
  props: {

  },
  data() {
    return {
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
      slotArr: ['couponName', 'couponContent', 'useBaifenb', 'downBili', 'orderAmount', 'discountAmount', 'footer'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'couponName', label: '优惠券信息', width: 200, type: 'slot', visible: true, disable: true },
          { prop: 'couponContent', label: '优惠内容', width: 140, type: 'slot', visible: true, disable: true },
          { prop: 'createdByName', label: '创建人', align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'issueCount', label: '发放量', align: 'center', type: 'text', visible: true },
          { prop: 'claimCount', label: '领取量', align: 'center', type: 'text', visible: true },
          { prop: 'claimUserCount', label: '领取人数', align: 'center', type: 'text', visible: true },
          { prop: 'writeOffCount', label: '使用张数', align: 'center', type: 'text', visible: true },
          { prop: 'useBaifenb', label: '使用率', align: 'center', type: 'slot', visible: true },
          { prop: 'orderAmount', label: '成交金额', align: 'center', type: 'slot', visible: true },
          { prop: 'orderCount', label: '成交订单数', align: 'center', type: 'text', visible: true },
          { prop: 'userCount', label: '成交人数', align: 'center', type: 'text', visible: true },
          { prop: 'downBili', label: '成交比例', align: 'center', type: 'slot', visible: true },
          { prop: 'discountAmount', label: '券优惠金额', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  activated() {
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    toDetail(row) {
      const paramsString = JSON.stringify(this.searchForStart)
      this.$router.push({ name: 'CouponDataDetail', query: { couponNo: row.couponNo, fromTab: 'couponDetail', formChoose: 'dataScreen', search: paramsString } })
    },
    toComplete(row) {
      this.row = row
      this.$refs.completeModal.show(row)
    },
    formLastLoadData() {
      this.loadData(this.search)
    },
    loadData(search) {
      this.searchForStart = { ...search }
      const params = {
        startTime: this.searchForStart.orderTimeArray ? this.searchForStart.orderTimeArray[0] : '',
        endTime: this.searchForStart.orderTimeArray ? this.searchForStart.orderTimeArray[1] : '',
        type: this.searchForStart.type,
        useStatus: this.searchForStart.useStatus,
        pageIndex: this.searchForStart.pageIndex,
        pageSize: this.searchForStart.pageSize
      }
      if (this.searchForStart.orderValue && this.searchForStart.orderLabel === 'couponName') {
        params.couponType = 1
        params.couponVal = this.searchForStart.orderValue
      } else if (this.searchForStart.orderValue && this.searchForStart.orderLabel === 'couponId') {
        params.couponType = 2
        params.couponVal = this.searchForStart.orderValue
      }
      couponTypePage(params).then(res => {
        if (res.code === 1 && res.data != null) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.searchForStart.pageIndex = val
      this.loadData(this.searchForStart)
    },
    handleSizeChange(val) {
      this.searchForStart.pageSize = val
      this.loadData(this.searchForStart)
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
    ::v-deep .tablePage .page_header {
        padding: 0!important;
        min-height: 0!important;
    }
    ::v-deep .tablePage .page_content{
        width: 100%;
        padding: 0!important;
    }
    ::v-deep .tablePage .my-table {
        width: 100%;
        margin: 0!important;
    }
    ::v-deep .customer-table .el-table__fixed-right::before,
    .el-table__fixed::before {
        width: 0;
    }

}
.content {
  height: 100%;
  min-height: 580px;
  ::v-deep .tablePage .page_content {
  height: 460px!important;
  overflow-y: auto!important;
  padding: 0;
  }
  ::v-deep .el-table__body-wrapper {
    min-height: 460px;
    height: 460px!important;
  }
  ::v-deep .el-table__body-wrapper .is-scrolling-left {
    min-height: 460px;
    height: 460px!important;
  }
  }

.goods-title-cls {
    color: #161616;
    font-size: 16px;
    margin-bottom: 5px;
    white-space: pre-line; /*允许换行*/
    overflow: hidden;
    text-overflow: ellipsis; /*省略号*/
    display: -webkit-box;
    -webkit-box-orient: vertical; /*行向垂直排列*/
    -webkit-line-clamp: 2; /*限制2行*/
  }
  .goods-blue-cls {
    font-size: 12px;
    color: #0C6FFF;
  }
  .goods-em-cls {
    font-style: normal;
    font-size: 12px;
    color: #FF7D00;
  }
</style>

