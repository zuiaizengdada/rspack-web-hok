<template>
  <div class="order-list">
    <operationStatisticsSearch :search="search" @search="searchFn" />
    <operationStatisticsData ref="operationStatisticsData" />
  </div>
</template>

<script>
import operationStatisticsSearch from './operationStatistcsSearch.vue'
import operationStatisticsData from './operationStatistcsData.vue'
import { DateFormat } from '@/utils/index'
export default {
  name: 'OperationStatistcs',
  components: {
    operationStatisticsSearch,
    operationStatisticsData
  },
  data() {
    return {
      orderTimeArray: [],
      search: {
        deptId: '',
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        operateUid: '' // 员工
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    const today = new Date()
    today.setDate(today.getDate() - 1)
    this.orderTimeArray = [DateFormat(today, 'yyyy-MM-dd'), DateFormat(today, 'yyyy-MM-dd')]
    if (this.orderTimeArray) {
      this.search.orderStartTime = this.orderTimeArray[0]
      this.search.orderEndTime = this.orderTimeArray[1]
    } else {
      this.search.orderStartTime = ''
      this.search.orderEndTime = ''
    }
    this.searchFn(this.search)
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    searchFn(res) {
      this.search = res
      this.$nextTick(() => {
        this.$refs.operationStatisticsData.loadData(res)
      })
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

