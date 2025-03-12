<template>
  <div class="flex-column flex flex-middle chart-bd">
    <div class="w-full h-full flex items-center justify-center">
      <div :id="idName" style="width:337px;height:263px" />
    </div>
    <div class="charts-tit">{{ title }}</div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { optionFunnel } from './optionCharts'
export default {
  props: {
    title: { type: String, default: '点赞量分布图（作品数）' },
    idName: { type: String, default: 'ChartsFunnel' }
  },
  methods: {
    initEcharts(val, val1) {
      console.log(val, val1, '两层数据')
      this.charts = echarts.init(document.getElementById(this.idName))
      const option = JSON.parse(JSON.stringify(optionFunnel))
      console.log(option, '初始化数据 点赞量分布图（作品数）')
      option.series[0].data = val
      option.series[1].data = val1
      //   option.series[0].label.formatter = '{b}\n{d}%'
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
.chart-bd{
    border-left: 1px solid #DFDFDF;
}
</style>
