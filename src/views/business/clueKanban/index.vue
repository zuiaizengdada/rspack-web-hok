<template>
  <MCard class="clueKanban">
    <filterTop />
    <div class="echartBox">
      <lineChart ref="lineChart" />
      <el-row
        class="m-t-20"
        :gutter="20"
      >
        <el-col :span="12">
          <MTitle class="m-b-16">线索来源</MTitle>
          <pieChart ref="pieChart" />
        </el-col>
        <el-col :span="12">
          <MTitle class="m-b-16">漏斗模型</MTitle>
          <funnelDiagram ref="funnelDiagram" />
        </el-col>
      </el-row>
      <deptData
        ref="deptData"
        class="m-t-32"
      />
    </div>
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import lineChart from './component/lineChart.vue'
import pieChart from './component/pieChart.vue'
import funnelDiagram from './component/funnelDiagram.vue'
import deptData from './component/deptData.vue'
import { filterPayerTotal } from '@/filters/index'
export default {
  components: {
    filterTop,
    lineChart,
    pieChart,
    funnelDiagram,
    deptData
  },
  data() {
    return {
      // 线索来源/漏斗模型
      sorce: {
        allocationSum: 4,
        arriveSum: 0,
        followSum: 0,
        outOrderSum: 0,
        sourceInfo: [{ platformName: '', value: '' }]
      }
    }
  },
  watch: {
    '$store.state.businessClue.search.current': {
      handler(val) {
        this.$store.dispatch('businessClue/getLineChart', 1).then(res => {
          const xData = []
          const ydata = []
          res.data.map(v => {
            v.value = Number(v.value)
            xData.push(v.date)
            ydata.push(v.value)
          })
          this.$refs.lineChart && this.$refs.lineChart.setOptions({
            xData,
            title: { 1: '线索总数', 2: '已分配线索', 3: '已转化线索', 4: '转化总金额', 5: '转化率' }[val],
            ydata
          })
        })
      },
      deep: true,
      immediate: false
    },
    '$store.state.businessClue.search.time.active': {
      handler(val) {
        this.$store.dispatch('businessClue/getLineChart', 1).then(res => {
          const xData = []
          const ydata = []
          res.data.map(v => {
            v.value = Number(v.value)
            if (this.$store.state.businessClue.search.current === 4) {
              v.value = filterPayerTotal(v.value)
            }
            xData.push(v.date)
            ydata.push(v.value)
          })
          this.$refs.lineChart && this.$refs.lineChart.setOptions({
            xData,
            title: { 1: '线索总数', 2: '已分配线索', 3: '已转化线索', 4: '转化总金额', 5: '转化率' }[this.$store.state.businessClue.search.current],
            ydata
          })
        })
        // 获取线索总数
        this.$store.dispatch('businessClue/getclueBasicSum').then(() => {
          // 获取线索来源，漏斗模型数据
          this.$store.dispatch('businessClue/getClueSource').then(res => {
            this.$refs.pieChart && this.$refs.pieChart.setOptions(res.data.sourceInfo)
            this.$refs.funnelDiagram && this.$refs.funnelDiagram.setOptions(res.data)
          })
        })
        this.$refs.deptData && this.$refs.deptData.getList()
      },
      deep: true,
      immediate: false
    },
    '$store.state.businessClue.search.launchPlatform': {
      handler() {
        this.$store.dispatch('businessClue/getLineChart', 1).then(res => {
          const xData = []
          const ydata = []
          res.data.map(v => {
            v.value = Number(v.value)
            if (this.$store.state.businessClue.search.current === 4) {
              v.value = filterPayerTotal(v.value)
            }
            xData.push(v.date)
            ydata.push(v.value)
          })
          this.$refs.lineChart && this.$refs.lineChart.setOptions({
            xData,
            title: { 1: '线索总数', 2: '已分配线索', 3: '已转化线索', 4: '转化总金额', 5: '转化率' }[this.$store.state.businessClue.search.current],
            ydata
          })
        })
        // 获取线索总数
        this.$store.dispatch('businessClue/getclueBasicSum').then(() => {
          // 获取线索来源，漏斗模型数据
          this.$store.dispatch('businessClue/getClueSource').then(res => {
            this.$refs.pieChart && this.$refs.pieChart.setOptions(res.data.sourceInfo)
            this.$refs.funnelDiagram && this.$refs.funnelDiagram.setOptions(res.data)
          })
        })
        this.$refs.deptData && this.$refs.deptData.getList()
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.$store.commit('businessClue/SET_search', { key: 'current', data: 1 })
    this.$store.commit('businessClue/SET_search', { key: 'dept', data: { name: '', id: '' } })
    // // 获取线索总数
    // this.$store.dispatch('businessClue/getclueBasicSum')
    // // 获取线索来源，漏斗模型数据
    // this.$store.dispatch('businessClue/getClueSource').then(res => {
    //   this.$refs.pieChart.setOptions(res.data.sourceInfo)
    //   this.$refs.funnelDiagram.setOptions(res.data)
    // })
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.clueKanban {
  min-width: 1400px;

  .echartBox {
    padding: 0 20px 20px;
  }
}

.m-b-16 {
  margin-bottom: 16px;
}

.m-t-32 {
  margin-top: 32px;
}
</style>
