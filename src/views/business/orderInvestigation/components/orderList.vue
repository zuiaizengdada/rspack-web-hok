<template>
  <div class="order-list">
    <orderListSearch :search="search" @search="searchFn" />
    <orderListData ref="orderListData" />
  </div>
</template>

<script>
import orderListSearch from './orderListSearch.vue'
import orderListData from './orderListData.vue'
export default {
  name: 'OrderList',
  components: {
    orderListSearch,
    orderListData
  },
  data() {
    return {
      orderTimeArray: [],
      search: {
        orderNo: '',
        channelSource: 1, // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        endTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        createTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '' // 员工
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {

  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    searchFn(res) {
      console.log('ssseee:', res)
      this.search = res
      this.$refs.orderListData.loadData(res)
    }
  }
}
</script>

    <style lang="scss" scoped>
    .order-list {
      width: 100%;
      height: 100%;
    }
    </style>

