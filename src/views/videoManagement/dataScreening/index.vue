<template>
  <div class="data_screen">
    <topSearch ref="topSearchRef" @search="searchData" />
    <dataShow ref="dataShowRef" @reSearchData="reSearchData" />
  </div>
</template>

<script>
import topSearch from '@/views/videoManagement/dataScreening/components/topSearch'
import dataShow from '@/views/videoManagement/dataScreening/components/dataShow'
export default {
  name: 'Index',
  components: {
    topSearch,
    dataShow
  },
  data() {
    return {
      search: {
        deptIdChain: '',
        endTime: '',
        operatorId: '',
        platformAccountId: '',
        platformId: 0,
        startTime: '',
        teacherId: '',
        active: ''
      }
    }
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_videoPublish_dataPage')
  },
  created() {

  },
  methods: {
    searchData(data) {
      console.log(data, '搜索条件')
      localStorage.setItem('dataScreeningForm', JSON.stringify(data))
      this.$nextTick(() => {
        this.$refs.dataShowRef.getList(data)
      })
    },
    reSearchData(search) {
      this.$refs.topSearchRef.reLoadDataForZq(search)
    }
  }
}
</script>

<style scoped lang="scss">
.data_screen {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  // background: #fff;
  border-radius: 10px;
  // padding: 15px 20px;
}
</style>
