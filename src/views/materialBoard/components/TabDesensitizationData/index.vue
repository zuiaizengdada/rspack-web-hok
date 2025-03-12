<template>
  <div class="tab-container">
    <form-search ref="search" class="form-search" @search="initDataInfo" @init="initDataInfo" />
    <data-info ref="info" :is-click="true" :default-active="0" :video-group-board="videoGroupBoard" @change="changeOpt" />
    <data-table ref="tableData" :data="tableData" :active-index="activeIndex" @search="updateTableList" />
    <!-- <NoviceGuidance v-if="desensitizationNG" :list="ngList" @ok="ok" /> -->
  </div>
</template>
<script>
// import NoviceGuidance from '@/components/NoviceGuidance/index.vue'
import FormSearch from './FormSearch.vue'
import DataInfo from '../Base/DataInfo.vue'
import { getVideoGroupBoard, getVideoGroupBoardDetailPage, getInvalidVideoBoardDetailPage, getShardVideoBoardDetailPage } from '@/api/materialBoard'
import DataTable from './DataTable.vue'
import { preProcessData, formatSeconds } from '../../utils.js'
import { videoGroupBoard, ngList } from './constans.js'
export default {
  components: {
    FormSearch,
    DataInfo,
    // NoviceGuidance,
    DataTable
  },
  data() {
    return {
      activeIndex: 0,
      desensitizationNG: false,
      ngList,
      tableData: {
        items: [],
        total: 0
      },
      videoGroupBoard
    }
  },
  created() {
    const desensitizationNG = localStorage.getItem('desensitizationNGV2-2-5' + this.$store.state.user.userInfo.userId)
    this.desensitizationNG = !desensitizationNG
  },
  methods: {
    goDetails() {
      console.log(this.$refs.search.form)
      const { createUserId, deptIdChain, endDate, startDate } = { ...this.$refs.search.form }
      // 筛选条件
      this.$router.push({
        path: '/materialBoard/markHotDetails',
        query: {
          createUserId,
          deptIdChain,
          endDate,
          startDate
        }
      })
    },
    ok() {
      this.desensitizationNG = false
      localStorage.setItem('desensitizationNGV2-2-5' + this.$store.state.user.userInfo.userId, true)
    },
    async updateTableList() {
      this.getlist()
    },
    getlist() {
      this.tableData = {
        items: [],
        total: 0
      }
      if (this.activeIndex === 0) {
        this.getVideoGroupBoardDetailPage()
      }
      if (this.activeIndex === 1) {
        this.getInvalidVideoBoardDetailPage()
      }
      if (this.activeIndex === 2) {
        this.getShardVideoBoardDetailPage()
      }
    },
    initDataInfo() {
      this.getVideoGroupBoard()
      // this.getVideoGroupBoardDetailPage()
      this.changeOpt(this.activeIndex)
    },
    changeOpt(val) {
      if (val !== this.activeIndex) {
        this.$refs.tableData.config.pageIndex = 1
        this.$refs.tableData.reset()
        this.activeIndex = val
        this.getlist()
      }
    },
    async getVideoGroupBoard() {
      const query = preProcessData(this.$refs.search.form)
      const resData = await getVideoGroupBoard(query)
      // 所有为空的数据补0
      Object.keys(resData.data).forEach(key => {
        if (!resData.data[key]) {
          resData.data[key] = 0
        }
      })
      this.videoGroupBoard = resData.data
      console.log(resData, '数据')
      // this.$refs.info.updateData(resData.data)
    },
    // 视频组数据明细
    async getVideoGroupBoardDetailPage() {
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      const resDataList = await getVideoGroupBoardDetailPage({ ...query, ...page })
      const arr = resDataList.data.items
      // 所有为空的数据补0 resDataList.data.items
      arr.forEach(item => {
        Object.keys(item).forEach(key => {
          if (!item[key]) {
            item[key] = 0
          }
        })
        // 把时间的秒数转换成00:00:00格式
        item.duration = formatSeconds(item.duration)
        item.effDuration = formatSeconds(item.effDuration)
        item.shareDuration = formatSeconds(item.shareDuration)
        item.manualDesensitizedDuration = formatSeconds(item.manualDesensitizedDuration)
        item.autoDesensitizedDuration = formatSeconds(item.autoDesensitizedDuration)
      })
      resDataList.data.items = arr
      this.tableData = resDataList.data
    },
    // 有效视频脱敏明细
    async getInvalidVideoBoardDetailPage() {
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      const resDataList = await getInvalidVideoBoardDetailPage({ ...query, ...page })
      console.log(resDataList, '有效视频脱敏明细')
      const arr = resDataList.data.items
      // 所有为空的数据补0 resDataList.data.items
      arr.forEach(item => {
        Object.keys(item).forEach(key => {
          if (!item[key]) {
            item[key] = 0
          }
        })
        // 把时间的秒数转换成00:00:00格式
        item.duration = formatSeconds(item.duration)
        item.isDesensitizedStatus = item.isDesensitizedStatus ? '已完成' : '未完成'
      })
      resDataList.data.items = arr
      this.tableData = resDataList.data
    },
    // 共享视频明细
    async getShardVideoBoardDetailPage() {
      const query = preProcessData(this.$refs.search.form)
      const page = { ...this.$refs?.tableData?.config }
      const resDataList = await getShardVideoBoardDetailPage({ ...query, ...page })
      console.log(resDataList, '共享视频明细')
      const arr = resDataList.data.items
      // 所有为空的数据补0 resDataList.data.items
      arr.forEach(item => {
        Object.keys(item).forEach(key => {
          if (!item[key]) {
            item[key] = 0
          }
        })
        // 把时间的秒数转换成00:00:00格式
        item.duration = formatSeconds(item.duration)
        item.isDesensitizedStatus = item.isDesensitizedStatus ? '已完成' : '未完成'
      })
      resDataList.data.items = arr
      this.tableData = resDataList.data
    }
  }
}
</script>
<style lang="scss" scoped>
.form-search{
  margin-bottom:10px;
}
</style>
