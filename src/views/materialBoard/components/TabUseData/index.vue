<template>
  <div class="tab-conatainer tab-use-data">
    <form-search ref="search" class="tab-search" @search="updateUseData" @reset="resetFormSearch" @init="updateUseData" />
    <data-charts v-if="showCharts" ref="charts" class="mb-4" />
    <share-charts v-if="showShareCharts" ref="shareCharts" class="mb-4" />
    <data-info ref="info" v-loading="loadingInfo" :use-data="useData" :default-active="0" :is-click="true" @change="updateEcharts" />
    <data-table ref="tableData" v-loading="loadingTableData" :all-data="allData" :active-index="activeIndex" :data="tableData" @export="exportTable" @search="updateTableList" />
    <!-- <NoviceGuidance v-if="useDataNG" :list="ngList" @ok="ok" /> -->
  </div>
</template>
<script>
// import NoviceGuidance from '@/components/NoviceGuidance/index.vue'
import FormSearch from './FormSearch.vue'
import DataCharts from './Charts/index.vue'
import ShareCharts from './ShareChart/index.vue'
import DataTable from './DataTable.vue'
import DataInfo from './DataInfo.vue'
import { dataInfoList, ngList } from './constants'
import { getMediaGreatsBarChart,
  exportWorksVideoList, getGreatsPieChart, getMediaColumnChart, getUseDataShardVideo, getShareVideoBoard,
  getWorksVideoList, getWorksVideoInfoNum, getUseWorksDataShardVideo,
  getSharedPieChart, getMediaSharedBarChart, getMediaSharedColumnChart } from '@/api/materialBoard'
import { preProcessData, formatSeconds } from '../../utils.js'
export default {
  components: {
    FormSearch,
    DataCharts,
    DataTable,
    DataInfo,
    ShareCharts
    // NoviceGuidance
  },
  data() {
    return {
      dataInfoList,
      ngList,
      activeIndex: 0,
      showCharts: false,
      loadingInfo: false,
      useDataNG: false,
      pieData: {
        greatsDown: 0,
        greatsUp: 0
      },
      allData: {
        fans: 0,
        greats: 0,
        reading: 0
      },
      useData: {
        shardCount: 0,
        shareDuration: 0,
        finishCount: 0,
        usedCount: 0,
        notUsedCount: 0,
        usedPeopleCount: 0,
        usedDuration: 0,
        notUsedDuration: 0,
        workCount: 0
      },
      tableData: {},
      loadingTableData: false,
      showShareCharts: false
    }
  },
  created() {
    const useDataNG = localStorage.getItem('useDataNGV2-2-5' + this.$store.state.user.userInfo.userId)
    this.useDataNG = !useDataNG
  },
  methods: {
    completionData(obj) {
      const arr = Object.keys(obj)
      arr.forEach(key => {
        if (!obj[key]) {
          obj[key] = 0
        }
      })
      return obj
    },
    ok() {
      this.useDataNG = false
      localStorage.setItem('useDataNGV2-2-5' + this.$store.state.user.userInfo.userId, true)
    },
    async updateUseData() {
      console.log(this.$refs.search.form, 'this.$refs.search.form')
      this.loadingInfo = true
      this.$refs.tableData.config.pageIndex = 1
      this.$refs.tableData.reset()
      const query = preProcessData(this.$refs.search.form)
      this.$nextTick(async () => {
        this.handleShareChart()
        let pieData = await getGreatsPieChart({ ...query })
        let funnelData = await getMediaGreatsBarChart({ ...query })
        const categoryData = await getMediaColumnChart({ ...query })
        const useData = await getUseDataShardVideo({ ...query })
        const shardVideoData = await getUseWorksDataShardVideo({ ...query })
        funnelData = this.completionData(funnelData.data)
        this.updateTableList()
        pieData = this.completionData(pieData.data)
        console.log(pieData, 'pieData')
        this.useData = { ...this.completionData(useData.data), ...this.completionData(shardVideoData.data) }
        if (pieData.greatsDown + pieData.greatsUp) {
          this.showCharts = true
          this.$nextTick(() => {
            this.$refs.charts.initChartsRadio(pieData)
            this.$refs.charts.initChartsFunnel(funnelData)
            this.$refs.charts.initChartscategory(categoryData.data)
          })
        } else {
          this.showCharts = false
        }
        this.loadingInfo = false
      })
    },
    async handleShareChart() {
      // 转发量
      const query = preProcessData(this.$refs.search.form)
      let pieData1 = await getSharedPieChart({ ...query })
      let funnelData1 = await getMediaSharedBarChart({ ...query })
      const categoryData1 = await getMediaSharedColumnChart({ ...query })
      funnelData1 = this.completionData(funnelData1.data)
      pieData1 = this.completionData(pieData1.data)
      if (pieData1.sharedDown + pieData1.sharedUp) {
        this.showShareCharts = true
        this.$nextTick(() => {
          this.$refs.shareCharts.initChartsRadio(pieData1)
          this.$refs.shareCharts.initChartsFunnel(funnelData1)
          this.$refs.shareCharts.initChartscategory(categoryData1.data)
        })
      } else {
        this.showShareCharts = false
      }
      this.loadingInfo = false
    },
    // 共享视频列表
    async getShareVideoBoard() {
      console.log(this.$refs.search.form, 'this.$refs.search.form')
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      // const { pageIndex, pageSize, createUserId, deptId, deptIdChain, endDate, startDate, teacherId } = { ...query, ...page }
      const res = await getShareVideoBoard({ ...query, ...page })
      const arr = res.data.items
      // 所有为空的数据补0 resDataList.data.items
      arr.forEach(item => {
        // 把时间的秒数转换成00:00:00格式
        item.duration = formatSeconds(item.duration)
      })
      this.tableData = res.data
    },
    // 作品视频数据 总粉丝 点赞 播放量
    async getStatistics() {
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      const res = await getWorksVideoInfoNum({ ...query, ...page })
      this.allData = res.data
      console.log(res.data, '统计数据')
    },
    async getWorksVideoList() {
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      const res = await getWorksVideoList({ ...query, ...page })
      const arr = res.data.items
      // 所有为空的数据补0 resDataList.data.items
      arr.forEach(item => {
        // 把时间的秒数转换成00:00:00格式
        item.duration = formatSeconds(item.duration)
      })
      this.tableData = res.data
      this.getStatistics()
      console.log(res, '作品数据')
    },
    async updateTableList() {
      this.loadingTableData = true
      if (this.activeIndex === 0) {
        await this.getShareVideoBoard()
      } else {
        await this.getWorksVideoList()
      }
      this.loadingTableData = false
    },
    updateEcharts() {
      const index = this.$refs.info.activeIndex
      if (index !== this.activeIndex) {
        this.tableData = {
          items: [],
          total: 0
        }

        this.activeIndex = index
        this.$refs.tableData.config.pageIndex = 1
        this.$refs.tableData.reset()
        if (index === 0) {
          this.getShareVideoBoard()
        } else {
          this.getWorksVideoList()
        }
      }
    },
    async exportTable() {
      const query = this.$refs.search.form
      const page = { ...this.$refs?.tableData?.config }
      const res = await exportWorksVideoList({ ...query, ...page })
      console.log(res, 'query')
      window.location.href = res.data
    },
    resetFormSearch() {
      // this.$refs.tableData.reset()
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-use-data{
  .tab-search{
    background: #fff;
    // margin-bottom: 10px;
  }
}
</style>
