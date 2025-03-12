<template>
  <div v-if="formChartRow.chooseType !== 2" class="wrapper-online-chart-row">
    <div v-if="formChartRow.offlineFlag === 0" class="item-chart">
      <barChart ref="barChart" :biz-data-array="bizDataArray" />
    </div>
    <div class="item-chart item-chart-se">
      <lineChart ref="lineChart" />
    </div>
  </div>
</template>

<script>
import barChart from './barChart.vue'
import lineChart from './lineChart.vue'
export default {
  components: {
    barChart,
    lineChart
  },
  props: {
    bizDataArray: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      formChartRow: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    init(item) {
      this.formChartRow = item
      console.log('charRow：：数据：', item)
      this.$nextTick(() => {
        if (this.formChartRow.chooseType === 1) {
          this.$refs.lineChart.init(item)
          if (this.formChartRow.offlineFlag === 0) {
            this.$refs.barChart.init(item)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-chart-row {
    width: 100%;
    height: 380px;
    margin-bottom: 20px;
    margin-top: 20px;
    display: flex;
    width: calc(100% + 18px);
    margin-left: -10px;
    .item-chart {
        flex: 1;
        margin: 0 10px;
        flex-shrink: 0;
        border-radius: 10px;
        border: 1px solid #F2F2F2;
    }
    .item-chart-se {
        flex: 2;
    }
}
</style>
