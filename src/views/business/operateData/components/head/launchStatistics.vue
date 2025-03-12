<template>
  <div class="order-list">
    <launchStatisticsSearch :search="search" @search="searchFn" />
    <launchStatisticsData ref="orderListData" />
  </div>
</template>

<script>
import launchStatisticsSearch from './launchStatisticsSearch.vue'
import launchStatisticsData from './launchStatisticsData.vue'
export default {
  name: 'OrderList',
  components: {
    launchStatisticsSearch,
    launchStatisticsData
  },
  data() {
    return {
      orderTimeArray: [],
      search: {
        timeForYear: new Date().getFullYear() + '', // 选择日期的年份
        timeForMonth: new Date().getMonth() + 1 + '', // 选择日期的月份
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        roiReachFlag: '', // 达标状态
        deptId: '' // 投放部门
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

