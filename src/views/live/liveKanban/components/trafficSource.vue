<template>
  <!-- 流量来源 -->
  <div ref="trafficSource" class="trafficSource">
    <div id="trafficSource" style="width: 50%;height: 100%;" />
    <div class="legend" style="width: 50%;height: 100%;">
      <div class="legendBox">
        <div v-for="(item, index) in list" :key="index" class="legendItem">
          <div class="legendTips" :style="{background: item.itemStyle.color}" />
          <div class="legendLabel">{{ item.name }}</div>
          <div class="legendValue">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  components: {},
  data() {
    return {
      chart: null,
      $_resizeHandler: null, // 页面尺寸变化回调函数
      options: [
        { label: '抖店', color: '#2C84FF', value: 1 },
        { label: '快手', color: '#F5B22A', value: 2 },
        { label: '获客', color: '#2CBFFF', value: 3 },
        { label: '微店', color: '#F56B6B', value: 4 },
        { label: '老用户', color: '#2C84FF', value: 5 },
        { label: '销售录入', color: '#F5B22A', value: 6 },
        { label: '小鹅通 ', color: '#2CBFFF', value: 7 },
        { label: '博商', color: '#F56B6B', value: 8 },
        { label: '获客线下', color: '#2C84FF', value: 9 },
        { label: '视频号小店', color: '#F5B22A', value: 10 },
        { label: '枫页小店', color: '#2CBFFF', value: 11 },
        { label: '抖音小程序', color: '#F56B6B', value: 12 },
        { label: '直播间', color: '#2C84FF', value: 13 },
        { label: '平台自营', color: '#2CBFFF', value: 14 },
        { label: '其他', color: '#F5B22A', value: -1 }
      ],
      list: []
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
      this.chart = echarts.init(document.getElementById('trafficSource'), 'macarons')
      // this.setOptions()
    },
    setOptions(data = []) {
      this.list = []
      data?.map(v => {
        this.list.push({
          name: getOptionsValueByKey('value', 'label', v.channelSource, this.options),
          value: v.totalNum,
          itemStyle: { color: getOptionsValueByKey('value', 'color', v.channelSource, this.options) }
        })
      })
      const option = {
        title: {
          text: '流量来源',
          textStyle: {
            color: '#B6D4FF',
            fontWeight: 400,
            fontSize: 20
          },
          top: 24,
          left: 24
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '流量来源',
            type: 'pie',
            colorBy: 'data',
            radius: ['60%', '70%'],
            center: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.list
          }
        ]
      }
      this.chart.setOption(option)
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

<style lang='scss' scoped>
.trafficSource {
  width: 100%;
  height: 100%;
  display: flex;
  .legend {
    padding-top: 76px;
    padding-bottom: 20px;
    .legendBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 6px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 1);
        transition: all 0.4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
      }
      .legendItem {
        padding-right: 30px;
        display: flex;
        height: 42px;
        width: 100%;
        align-items: center;
        .legendTips {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .legendLabel {
          margin-left: 8px;
          flex: 1 0 0;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #B6D4FF;
          line-height: 22px;
        }
        .legendValue {
          font-size: 14px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 42px;
          align-self: flex-end;
        }
      }
      .legendItem + .legendItem {
        margin-top: 20px;
      }
    }
  }
}
</style>
