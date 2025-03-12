<template>
  <div class="order-list">
    <launchStatisticsSearch :search="search" :advertise-channel-array="advertiseChannelArray" @search="searchFn" />
    <launchStatisticsData ref="orderListData" :advertise-channel-array="advertiseChannelArray" />
  </div>
</template>

<script>
import launchStatisticsSearch from './launchStatisticsSearch.vue'
import launchStatisticsData from './launchStatisticsData.vue'
import { getAdvertiseChannelJsonObject } from '@/api/business/financial'
export default {
  name: 'OrderList',
  components: {
    launchStatisticsSearch,
    launchStatisticsData
  },
  data() {
    return {
      advertiseChannelArray: [],
      orderTimeArray: [],
      search: {
        timeForYear: new Date().getFullYear() + '', // 选择日期的年份
        timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        roiReachFlag: '', // 达标状态
        advertiseChannel: '',
        deptId: '' // 投放部门
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    this.getAdvertiseChannelJsonObject()
  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    getAdvertiseChannelJsonObject() {
      getAdvertiseChannelJsonObject().then(res => {
        if (res.code === 1) {
          this.advertiseChannelArray = res.data
        }
      })
      console.log(this.advertiseChannelArray)
    },
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

