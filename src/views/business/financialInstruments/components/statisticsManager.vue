<template>
  <div class="order-list">
    <statisticsManagerSearch :search="search" @search="searchFn" />
    <statisticsManagerData ref="orderListData" />
  </div>
</template>

<script>
import statisticsManagerSearch from './statisticsManagerSearch.vue'
import statisticsManagerData from './statisticsManagerData.vue'
export default {
  name: 'OrderList',
  components: {
    statisticsManagerSearch,
    statisticsManagerData
  },
  data() {
    return {
      orderTimeArray: [],
      search: {
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        advertiseChannel: '', // 广告渠道
        bindEmployeeFlag: 1, // 是否关联投放人
        secondDeptId: '' // 投放部门
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

