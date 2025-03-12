<template>
  <MCard class="clueKanban">
    <MBreadRow :title="['线索数据', '部门数据']" class="m-b-20" @onClick="onBreadRowClick" />
    <filterTop :title="search.dept.name" :type="1" />
    <div class="p-20">
      <lineChart ref="lineChart" :type="1" />
      <el-row class="m-t-20" :gutter="20">
        <el-col :span="12">
          <MTitle class="m-b-16">线索来源</MTitle>
          <pieChart ref="pieChart" />
        </el-col>
        <el-col :span="12">
          <MTitle class="m-b-16">漏斗模型</MTitle>
          <funnelDiagram ref="funnelDiagram" :type="1" />
        </el-col>
      </el-row>
      <userData ref="userData" class="m-t-32" />
    </div>
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import lineChart from '../component/lineChart.vue'
import pieChart from '../component/pieChart.vue'
import funnelDiagram from '../component/funnelDiagram.vue'
import userData from './userData.vue'
import { mapState } from 'vuex'
import { filterPayerTotal } from '@/filters/index'
export default {
  components: {
    filterTop,
    lineChart,
    pieChart,
    funnelDiagram,
    userData
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      search: state => state.businessClue.search
    })
  },
  watch: {
    '$store.state.businessClue.search.current': {
      handler(val) {
        this.$store.dispatch('businessClue/getLineChart').then(res => {
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
        this.$refs.userData && this.$refs.userData.getList()
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.$store.commit('businessClue/SET_search', { key: 'dept', data: { name: this.$route.query.name, id: this.$route.params.id } })
  },
  mounted() {
    this.$store.commit('businessClue/SET_search', { key: 'current', data: 2 })
  },
  methods: {
    onBreadRowClick(row) {
      row === 0 && (this.$router.replace({ path: '/business/clueKanban' }))
    }
  }
}
</script>

<style lang='scss' scoped>
.clueKanban {
  // min-width: 1600px;
}
.m-b-16 {
  margin-bottom: 16px;
}
.m-t-32 {
  margin-top: 32px;
}
</style>
