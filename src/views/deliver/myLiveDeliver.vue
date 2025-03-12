<template>
  <div class="live-content">
    <div class="filter_top">
      <filterTop :search="search" :goods="goodsList" @search="searchFn" /> <!-- <search /> -->
    </div>
    <div class="table-content">
      <v-mytools :search="search" :goods="goodsList" @search="searchFn" />
      <mytable-data :orders="tableList" :goods="goodsList" :datas="dataObject" :search="search" @search="searchFn" />
    </div>
  </div>
</template>

<script>
import mytableData from './components/mytable-data.vue'
import filterTop from './components/filterTop.vue'
import mytools from './components/mytools.vue'
import { getSetGoodsList, myDeliveryPage } from '@/api/liveDeliver'
export default {
  components: {
    filterTop,
    'mytable-data': mytableData,
    'v-mytools': mytools
  },
  data() {
    return {
      dataObject: {},
      search: {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '0', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        chooseGoods: '',
        choosePeriods: '',
        current: 1, // 当前页
        size: 10 // 每页条数
      },
      goodsList: [],
      tableList: []
    }
  },
  mounted() {},
  created() {
    this.loadGoodsData()
    this.searchFn(this.search)
  },
  methods: {
    searchFn(res) {
      this.search = {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        afterSaleStatus: '', // 售后状态
        channelSource: '', // 渠道来源
        classId: '', // 班期Id
        className: '', // 班期名称
        current: 1, // 当前第几页
        startPayTime: undefined, // 支付开始时间
        endPayTime: undefined, // 支付结束时间
        startSignedTime: undefined, // 签到开始时间
        endSignedTime: undefined, // 签到结束时间
        goodsId: '', // 商品id
        orderNo: '', // 订单号
        signedIn: '', // 签到状态
        size: 10, // 每页显示条数
        userId: '', // 客户id
        userName: '', // 客户姓名
        userPhone: '', // 客户手机号
        userTerminal: '', // 用户终端
        thirdShopId: '',
        thirdShopName: ''
      }
      this.search = res
      this.search = res
      this.search.startPayTime = ''
      this.search.endPayTime = ''
      this.search.startSignedTime = ''
      this.search.endSignedTime = ''
      this.search.orderNo = ''
      this.search.userName = ''
      this.search.userPhone = ''
      this.search.userId = ''
      // this.search = res
      if (this.search.time.label === 1) {
        this.search.startPayTime = this.search.time.value[0]
        this.search.endPayTime = this.search.time.value[1]
      }
      if (this.search.time.label === 2) {
        this.search.startSignedTime = this.search.time.value[0]
        this.search.endSignedTime = this.search.time.value[1]
      }
      if (this.search.order.label === 'orderNo') {
        this.search.orderNo = this.search.order.value
      }
      if (this.search.order.label === 'userName') {
        this.search.userName = this.search.order.value
      }
      if (this.search.order.label === 'userPhone') {
        this.search.userPhone = this.search.order.value
      }
      if (this.search.order.label === 'userId') {
        this.search.userId = this.search.order.value
      }
      myDeliveryPage(this.search).then(res => {
        if (res.code === 1) {
          this.tableList = res.data.records
          this.dataObject = res.data
        }
      })
      // this.getList()
    },
    loadGoodsData() {
      const params = {
        goodsType: '',
        goodsName: ''
      }
      getSetGoodsList(params).then(res => {
        this.goodsList = res.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.filter_top {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
    0px 1px 10px 0px rgba(0, 0, 0, 0.05);
}
.live-content {
  width: 100%;
  height: 100%;
  .search-cont {
    width: 100%;
    height: 135px;
    background: #fff;
    border-radius: 5px;
    .right-font ::v-deep .el-input--medium .el-input__inner{
      text-align: right;
      border: none;
    }
    .demo-form-inline {
      padding: 20px;
    }
  }
  .table-content {
    width: 100%;
    padding: 20px;
    margin-top: 10px;
    border-radius: 5px;
    background: #fff;
    .table-cont-btn {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
