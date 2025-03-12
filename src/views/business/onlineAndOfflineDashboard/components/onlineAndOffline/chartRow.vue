<template>
  <div class="wrapper-online-chart-row" :class="(formCharRowF.employeeDeptId && formCharRowF.chooseType === 2)?'hidden-cls':''">
    <div v-if="formCharRowF.offlineFlag === 0" class="item-chart">
      <barChart ref="barChart" :biz-data-array="bizDataArray" />
    </div>
    <div class="item-chart item-chart-se" :class="formCharRowF.offlineFlag !== 0?'long-item':''">
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
      formCharRowF: {}
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
      this.formCharRowF = item
      if (this.formCharRowF.chooseType === 1) {
        this.$nextTick(() => {
          if (item.offlineFlag === 0) {
            this.$refs.barChart.init(item)
          }

          this.$refs.lineChart.init(item)
        })
      }
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
        min-width: 500px;
        flex-shrink: 0;
        border-radius: 10px;
        border: 1px solid #F2F2F2;
    }
    .item-chart-se {
        flex: 2;
    }
    .long-item {
      width: 100%;
    }
}

.hidden-cls {
  display: none;
}
</style>
