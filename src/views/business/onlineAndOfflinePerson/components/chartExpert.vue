<template>
  <div v-if="formChartExpert.offlineFlag === 0" class="wrapper-online-chart-Expert">
    <div class="chart-exert-row">
      <div class="item" :class="formChartExpert.chooseType === 1?'short-cls':''">
        <expertData ref="expertData" />
      </div>

    </div>
    <div class="chart-exert-row">
      <div v-show="formChartExpert.chooseType === 1" class="item">
        <expertLineChart ref="expertLineChart" :choose-type="formChartExpert.chooseType" />
      </div>
    </div>
  </div>
</template>

<script>
import expertData from './chartExpert/expertData.vue'
import expertLineChart from './chartExpert/expertLineChart.vue'
export default {
  components: {
    expertData,
    expertLineChart
  },
  data() {
    return {
      formChartExpert: {}
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
      this.formChartExpert = item
      this.$nextTick(() => {
        if (this.formChartExpert.offlineFlag === 0) {
          if (this.formChartExpert.chooseType === 1) {
            this.$refs.expertData.init(item)
            this.$refs.expertLineChart.init(item)
          } else {
            this.$refs.expertData.init(item)
            // this.$refs.expertLineChart.init(item)
          }
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-chart-Expert {
    width: 100%;
    margin-top: 20px;
    .chart-exert-row {
        width: 100%;
        .item {
          float: left;
          width: 100%;
          background: #fff;
          border-radius: 10px;
        }
    }
  }
  </style>
