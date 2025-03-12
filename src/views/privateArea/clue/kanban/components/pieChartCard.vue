<template>
  <div class="card">
    <div class="headerTop">
      <MTitle>{{ dataRatio.label }}</MTitle>
      <span>({{ dataRatio.text }})</span>
    </div>
    <div id="main">
      <span v-if="!dataRatio.data.length" class="noText">暂无数据</span>
      <div ref="echartRef" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  props: {
    dataRatio: {
      type: Object,
      default: () => ({
        label: '来源渠道占比',
        text: '按线索转化率',
        data: []
      })
    }
  },
  data: () => ({
    chart: ''
  }),
  watch: {
    dataRatio: {
      handler: function (val, oldVal) {
        this.$nextTick(() => this.initechart())
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    initechart() {
      this.chart = echarts.init(this.$refs.echartRef)
      window.onresize = () => {
        this.$nextTick(() => this.chart.resize())
      }
      var option = {
        legend: {
          bottom: 'center',
          orient: 'vertical',
          left: 320,
          show: true,
          icon: 'circle',
          formatter: name => {
            const rale = this.dataRatio?.data?.find(item => item?.name === name)?.rale
            const arr = [`{a|${name}}`, `{b|${rale}%}`]
            return arr.join('  ')
          },
          textStyle: {
          // 添加
            rich: {
              a: {
                fontSize: 16,
                fontWeight: 400,
                color: '#333333',
                width: 90
              },
              b: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333333'
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: '80%', // 设置饼图大小
            center: ['20%', '50%'], // 设置饼图位置
            itemStyle: {
              normal: {
                color: function (colors) {
                  var colorList = [
                    '#0C6FFF',
                    '#00DACB',
                    '#FFAF00',
                    '#00A1FF',
                    '#00DAEB',
                    '#FF555D',
                    '#00C5FF',
                    '#FF00C4',
                    '#B200FF',
                    '#FF5EDC',
                    '#00ECAA',
                    '#FF0262'
                  ]
                  return colorList[colors.dataIndex]
                }
              }
            },
            data: this.dataRatio.data || [],
            label: {
              show: true,
              position: 'inside',
              formatter: params => {
                const { name, dataIndex, percent } = params
                if (this.dataRatio.data[dataIndex]) this.dataRatio.data[dataIndex].rale = percent
                return `${name}\n${percent}%`
              }
            }
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(option)
    }
  }

}
</script>
<style lang="scss" scoped>
.card {
  flex: 1;
}
.headerTop {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  > span {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
    margin-left: 10px;
  }
}
#main {
  min-height: 308px;
  border-radius: 10px;
  position: relative;
  background: #ffffff;
  .noText{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color:#666666;
  }
  > div {
    min-height: 308px;
    width: 100%;
  }
}
</style>
