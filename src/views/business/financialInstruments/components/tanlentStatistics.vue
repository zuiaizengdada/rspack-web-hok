<template>
  <div class="order-list">
    <tanlentStatisticsSearch :search="search" @search="searchFn" />
    <tanlentStatisticsData ref="tanlentStaticsData" />
  </div>
</template>

<script>
import tanlentStatisticsSearch from './tanlentStatisticsSearch.vue'
import tanlentStatisticsData from './tanlentStatisticsData.vue'
import { DateFormat } from '@/utils/index'
export default {
  name: 'OrderList',
  components: {
    tanlentStatisticsSearch,
    tanlentStatisticsData
  },
  data() {
    return {
      orderTimeArray: [],
      search: {
        expertId: '', // 达人昵称
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
      this.$nextTick(() => {
        this.$refs.tanlentStaticsData.loadData(res)
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

