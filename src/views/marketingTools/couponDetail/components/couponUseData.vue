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
        <div slot="nickName" slot-scope="scope">
          <p class="goods-title-cls">{{ scope.row.nickName }}</p>
          <p class="goods-blue-cls">ID:{{ scope.row.userId }}</p>
        </div>
        <div slot="couponName" slot-scope="scope">
          <p style="font-size: 14px;">{{ scope.row.couponName }}</p>
          <em v-if="scope.row.couponType === 1" class="goods-em-cls">商品优惠券</em>
          <em v-if="scope.row.couponType === 2" class="goods-em-cls">店铺优惠券</em>
          <em v-if="scope.row.couponType === 3" class="goods-em-cls">直播优惠券</em>
        </div>
        <div slot="couponNo" slot-scope="scope">
          <p class="goods-blue-bt" style="cursor: pointer" @click="toDetail(scope.row)">{{ scope.row.couponNo }}</p>
        </div>
        <div slot="couponType" slot-scope="scope">
          <p v-if="scope.row.couponType === 1">商品券</p>
          <p v-if="scope.row.couponType === 2">店铺券</p>
          <p v-if="scope.row.couponType === 3">直播券</p>
        </div>
        <div slot="writeOffBizNo" slot-scope="scope">
          <p v-if="scope.row.writeOffBizNo" class="goods-blue-bt" style="cursor: pointer" @click="toOrderDetail(scope.row)">{{ scope.row.writeOffBizNo }}</p>
          <p v-else>-</p>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import { getUsedDataPage } from '@/api/marketingTools/coupon.js'
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
      slotArr: ['nickName', 'couponNo', 'couponName', 'couponType', 'writeOffBizNo', 'footer'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'nickName', label: '用户信息', width: 180, type: 'slot', visible: true, disable: true },
          { prop: 'couponName', label: '优惠券名称', width: 200, type: 'slot', visible: true, disable: true },
          { prop: 'userCouponNo', label: '优惠券编码', width: 180, align: 'center', type: 'text', visible: true },
          { prop: 'couponNo', label: '优惠券ID', width: 180, align: 'center', type: 'slot', visible: true },
          { prop: 'couponType', label: '优惠券类型', type: 'slot', visible: true },
          { prop: 'claimTime', label: '领取时间', type: 'text', visible: true },
          { prop: 'writeOffTime', label: '核销时间', type: 'text', visible: true },
          { prop: 'writeOffBizNo', label: '核销订单', type: 'slot', visible: true }
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
    toDetail(row) {
      const paramsString = JSON.stringify(this.searchForStart)
      this.$router.push({ name: 'CouponDataDetail', query: { couponNo: row.couponNo, fromTab: 'couponDetail', formChoose: 'detailData', search: paramsString } })
    },
    toOrderDetail(row) {
      // this.$router.push({ path: `/business/orderManage/orderDetail/${row.writeOffBizNo}/3/全部订单` })
      const routeUrl = this.$router.resolve({
        path: `/business/orderManage/orderDetail/${row.writeOffBizNo}/3/全部订单`
      })

      window.open(routeUrl.href, '_blank')
    },
    loadData(search) {
      this.searchForStart = { ...search }
      const params = {
        writeOffTimeStart: this.searchForStart.orderTimeArray ? this.searchForStart.orderTimeArray[0] : '',
        writeOffTimeEnd: this.searchForStart.orderTimeArray ? this.searchForStart.orderTimeArray[1] : '',
        userCouponNo: this.searchForStart.userCouponNo,
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
      if (this.searchForStart.userValue && this.searchForStart.userLable === 'userName') {
        params.userType = 1
        params.userVal = this.searchForStart.userValue
      } else if (this.searchForStart.userValue && this.searchForStart.userLable === 'userId') {
        params.userType = 2
        params.userVal = this.searchForStart.userValue
      }
      getUsedDataPage(params).then(res => {
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
    color: #333333;
  }
  .goods-blue-bt {
    color: #0C6FFF;
  }
  .goods-em-cls {
    font-style: normal;
    font-size: 12px;
    color: #FF7D00;
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
  </style>

