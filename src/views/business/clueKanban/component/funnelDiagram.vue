<template>
  <div class="funnelDiagram overflowOuto">
    <div id="cluefunnelDiagram" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { mapState } from 'vuex'
export default {
  components: {},
  props: {
    type: {
      type: [Number, null],
      default: 0 // 为1是部门
    }
  },
  data() {
    return {
      chart: null,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      clueBasicSum: state => state.businessClue.clueBasicSum
    })
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
      this.chart = echarts.init(document.getElementById('cluefunnelDiagram'), 'macarons')
    },
    setOptions({ allocationSum = '', arriveSum = '', outOrderSum = '' }) {
      console.log(this.clueBasicSum.clueSum, this.clueBasicSum.clueSum)
      const data = [
        { value: 50, name: '分配线索', itemStyle: { color: '#0C6FFF', height: '97', width: '458' }, num: allocationSum },
        { value: 25, name: '出单线索', itemStyle: { color: '#00D7C7', height: '63', width: '214' }, num: outOrderSum },
        { value: 10, name: '到课线索', itemStyle: { color: '#FFBD00', height: '52', width: '130' }, num: arriveSum }
      ]
      if (this.type === 0) {
        data.unshift({ value: 80, name: '线索总数', itemStyle: { color: '#0C6FFF', height: '97', width: '458' }, num: this.clueBasicSum.clueSum })
      }
      const option = {
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: -80,
            top: 37,
            bottom: 40,
            width: 'auto',
            min: 10,
            max: 100,
            minSize: '130',
            maxSize: '458',
            sort: 'descending',
            gap: 0,
            label: {
              fontSize: 20,
              formatter: function (res) {
                return `${res.data.name}：${res.data.num}`
              }
            },
            labelLine: {
              length: 71,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            data: data
          },
          {
            name: 'Funnel',
            type: 'funnel',
            left: -80,
            top: 37,
            bottom: 40,
            width: 'auto',
            min: 10,
            max: 100,
            minSize: '130',
            maxSize: '458',
            sort: 'descending',
            gap: 0,
            label: {
              formatter: function (res) {
                if (res.dataIndex === 0) {
                  return ''
                } else {
                  if (!data[res.dataIndex - 1].num) {
                    return '0.00%'
                  }
                  return `${((res.data.num / data[res.dataIndex - 1].num) * 100).toFixed(2)}%`
                }
              },
              position: 'inside'
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              opacity: 0
            },
            data: data
          }
        ]

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
    }
  }
}
</script>

<style lang='scss' scoped>
.funnelDiagram {
  border-radius: 4px;
    border: 1px solid #CBCFD3;
    #cluefunnelDiagram {
      // height: 100%;
      height: 372px;
      // width: 1;
      // width: 700px;
    }
}
</style>
