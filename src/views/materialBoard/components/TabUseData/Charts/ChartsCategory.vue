<template>
  <div class="flex-column flex flex-middle chart-bd">
    <div class="w-full h-full flex items-center justify-center">
      <div :id="idName" style="width:100%;height: 100%;" />
    </div>
    <div class="charts-tit">{{ title }}</div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { optionCategory } from './optionCharts'
export default {
  props: {
    title: { type: String, default: '各平台点赞量占比' },
    idName: { type: String, default: 'ChartsCategory' }
  },
  data() {
    return {
      $_resizeHandler: null
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.charts) {
        this.charts.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    initEcharts(val) {
      this.charts = echarts.init(document.getElementById(this.idName))
      const option = JSON.parse(JSON.stringify(optionCategory))
      option.dataset.source = val
      option.tooltip.formatter = params => {
        console.log(params, 'params数据')
        let str = ''
        str += `${params[0].axisValue}<br/>`
        params.forEach(item => {
          str += `${item.marker}${item.seriesName}: ${item.value[item.seriesIndex + 1]}%<br/>`
        })
        return str
      }
      console.log(option, '插入之前option')
      this.charts.setOption(option, true)
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
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
