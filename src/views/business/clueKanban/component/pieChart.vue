<template>
  <div class="PieChart">
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="listLi"
        :style="{
          border: item.platformName === '1' ? '1px solid #0051FF' : '1px solid #ff6c37',
          background: item.platformName === '1' ? '#CCDCFF' : 'rgb(255 108 55 / 43%)'
        }"
      >
        <svg-icon
          class-name="listLiicon"
          icon-class="juliangqianchuang"
        />
        <span
          class="listLiText"
          :style="{ color: item.platformName === '1' ? '#0051FF' : '#ff6c37' }"
        >{{ getplatformDisplayName(item.platformName) }}</span>
        <span
          class="listLiNum"
          :style="{ color: item.platformName === '1' ? '#0051FF' : '#ff6c37' }"
        >{{ item.value }}</span>
      </div>
    </div>
    <div
      id="cluePieChart"
      class="cluePieChart"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { launchPlatformOption } from '../../clue/columns'
import { getOptionsValue } from '@/filters/index'
export default {
  components: {},
  data() {
    return {
      list: [],
      chart: null,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  mounted() {
    this.initChart()
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
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
    initChart() {
      this.chart = echarts.init(document.getElementById('cluePieChart'), 'macarons')
    },
    setOptions(sourceInfo = []) {
      this.list = sourceInfo
      const series = [{
        name: '来源图表',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '80%'],
        label: {
          position: sourceInfo.length > 1 ? 'inside' : 'center',
          fontSize: 20,
          lineHeight: 25,
          color: '#FFFFFF',
          formatter: '{b}\n{d}%'
        },
        silent: 'ture',
        labelLine: {
          show: false
        },
        data: []
      }]
      sourceInfo.map(v => {
        const title = getOptionsValue(Number(v.platformName), launchPlatformOption)
        series[0].data.push({ value: v.value, name: title, itemStyle: { color: v.platformName === '1' ? '#0C6FFF' : '#ff6c37' } })
      })
      const option = {
        animation: false,
        series
      }
      this.chart.setOption(option, true)
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    getplatformDisplayName(type) {
      return getOptionsValue(Number(type), launchPlatformOption)
    }
  }
}
</script>

<style lang='scss' scoped>
.PieChart {
  border-radius: 4px;
  border: 1px solid #CBCFD3;
  display: flex;
  box-sizing: border-box;

  .list {
    padding: 16px;
    width: 50%;
    // min-width: 357px;s
    height: 372px;

    .listLi {
      height: 52px;
      padding: 0 10px;
      background: #CCDCFF;
      width: 100%;
      line-height: 52px;
      box-shadow: 0px 2px 6px 0px rgba(0, 81, 255, 0.2);
      border-radius: 8px;
      border: 1px solid #0051FF;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;

      .listLiicon {
        width: 32px;
        height: 32px;
      }

      .listLiText {
        margin-left: 8px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #0051FF;
        line-height: 24px;
      }

      .listLiNum {
        flex: 1 0 0;
        font-size: 20px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #0051FF;
        line-height: 28px;
        text-align: right;
      }
    }
  }

  .cluePieChart {
    // flex: 1 0 0;
    width: 50%;
    // min-width: 300px;
    height: 372px;
  }
}
</style>
