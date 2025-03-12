<template>
  <div class="flex-column flex flex-middle">
    <div class="w-full h-full flex items-center justify-center">
      <div :id="idName" style="width:386px;height:263px" />
    </div>
    <div class="charts-tit">{{ title }}</div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { optionCharts } from './optionCharts'
export default {
  props: {
    title: { type: String, default: '点赞量占比' },
    idName: { type: String, default: 'ChartsRatio' }
  },
  methods: {
    initEcharts(val) {
      this.charts = echarts.init(document.getElementById(this.idName))
      const option = JSON.parse(JSON.stringify(optionCharts))
      option.series[0].data = val
      option.series[0].label.formatter = '{b}\n{d}%'
      this.charts.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.charts-tit{
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #777777;
  margin-top: 8px;
}
</style>
