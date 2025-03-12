<template>
  <!-- 短信看板 -->
  <MCard class="pageWrap">
    <filterTop style="margin-bottom: 32px" :search="search" :data-course="dataCourse" @onSearch="onSearch" @onClick="onhandleClick" />
    <barCharts ref="barCharts" />
  </MCard>
</template>

<script>
import filterTop from './smsKanban/filterTop.vue'
import barCharts from './smsKanban/barCharts.vue'
import { getTrendList } from '@/api/system/sms'
export default {
  components: {
    filterTop,
    barCharts
  },
  data() {
    return {
      loading: false,
      // 筛选条件
      search: {
        time: {
          active: 7,
          time: ['', '']
        },
        current: 0,
        channelId: ''
      },
      // 选中的数据[总发送条数,总]
      dataCourse: [
        { name: '总发送条数', type: 'line', smooth: true, color: '#0C6FFF', data: [], active: true, animationDuration: 100 },
        { name: '总发送成功条数', type: 'line', smooth: true, color: '#00E3DB', data: [], active: true, animationDuration: 100 },
        { name: '总发送失败条数', type: 'line', smooth: true, color: '#FF5962', data: [], active: true, animationDuration: 100 }
      ],
      listAllData: []
    }
  },
  mounted() {},
  methods: {
    onSearch() {
      this.getTrendList()
    },
    // 获取总的数据
    getTrendList() {
      const params = {
        channelId: this.search.channelId,
        endTime: this.search.time.time[1] + ' 00:00:00',
        startTime: this.search.time.time[0] + ' 00:00:00'
      }
      getTrendList(params).then(res => {
        this.listAllData = res.data
        this.renderData()
      })
    },
    // 获取渲染的数据结构
    renderData() {
      const xData = []
      const legendData = []
      const series = []
      this.dataCourse[0].data = []
      this.dataCourse[1].data = []
      this.dataCourse[2].data = []
      this.listAllData.map(v => {
        xData.push(v.date)
        this.dataCourse[0].data.push(v.totalSendCount)
        this.dataCourse[1].data.push(v.successCount)
        this.dataCourse[2].data.push(v.failCount)
      })
      this.dataCourse.map(v => {
        if (v.active) {
          legendData.push(v.name)
          const obj = { ...v }
          delete obj.active
          series.push(obj)
        }
      })
      this.$refs.barCharts.setOptions({ xData, legendData, series })
    },
    onhandleClick(index) {
      this.dataCourse[index].active = !this.dataCourse[index].active
      this.renderData()
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  padding: 20px 20px;
}
</style>
