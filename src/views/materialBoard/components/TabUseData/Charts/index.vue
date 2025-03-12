<template>
  <div class="charts-container">
    <Title class="title" title="点赞量" />
    <div class="flex flex-between">
      <charts-radio ref="radio" class="charts-item" />
      <charts-funnel ref="funnel" class="charts-item" />
      <charts-category ref="category" class="charts-item charts-category" />
    </div>
  </div>
</template>
<script>
import ChartsRadio from './ChartsRatio.vue'
import ChartsFunnel from './ChartsFunnel.vue'
import ChartsCategory from './ChartsCategory.vue'
import { chartsRadio, chartsFunnel, chartsFunnel1, chartsCategory } from './constants'
import Title from '../../Base/Title.vue'
export default {
  components: {
    ChartsRadio,
    ChartsFunnel,
    Title,
    ChartsCategory
  },

  methods: {
    initChartsRadio(data) {
      chartsRadio[0].value = data.greatsUp
      chartsRadio[1].value = data.greatsDown
      this.$refs.radio.initEcharts(chartsRadio)
    },
    initChartsFunnel(data) {
      // 取data里面最大的值
      const max = Math.max(
        data.greatsTwoThousand,
        data.greatsFiveThousand,
        data.greatsTenThousand,
        data.greatsTwentyThousand,
        data.greatsThirtyThousand
      )
      console.log(max, '最大值')
      // 累加data里面的数据
      chartsFunnel[0].value = data.greatsTwoThousand / max * 100
      chartsFunnel[1].value = data.greatsFiveThousand / max * 100
      chartsFunnel[2].value = data.greatsTenThousand / max * 100
      chartsFunnel[3].value = data.greatsTwentyThousand / max * 100
      chartsFunnel[4].value = data.greatsThirtyThousand / max * 100
      // 第二层
      chartsFunnel1[0] = {
        value: data.greatsTwoThousand / max * 100,
        name: '2000及以上',
        label: {
          formatter: res => {
            return `${data.greatsTwoThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[1] = {
        value: data.greatsFiveThousand / max * 100,
        name: '5000及以上',
        label: {
          formatter: res => {
            return `${data.greatsFiveThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[2] = {
        value: data.greatsTenThousand / max * 100,
        name: '1万及以上',
        label: {
          formatter: res => {
            return `${data.greatsTenThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[3] = {
        value: data.greatsTwentyThousand / max * 100,
        name: '2万及以上',
        label: {
          formatter: res => {
            return `${data.greatsTwentyThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[4] = {
        value: data.greatsThirtyThousand / max * 100,
        name: '3万及以上',
        label: {
          formatter: res => {
            return `${data.greatsThirtyThousand}`
          },
          position: 'inside'
        }
      }
      this.$refs.funnel.initEcharts(chartsFunnel, chartsFunnel1)
    },
    processList(list, categoryIndex) {
      const platformIdToIndex = {
        19: 1,
        24: 2,
        31: 3,
        32: 4,
        15: 5
      }
      list.forEach(item => {
        const index = platformIdToIndex[item.platformId]
        if (index !== undefined) {
          chartsCategory[categoryIndex][index] = item.greatsRate
        }
      })
    },
    initChartscategory(data) {
      console.log(data, '各平台点赞数占比666666')

      this.processList(data.greatsTwoThousandUpList, 1)
      this.processList(data.greatsTwoThousandDownList, 2)
      this.processList(data.greatsFiveThousandList, 3)
      this.processList(data.greatsTenThousandsList, 4)
      this.processList(data.greatsTwentyThousandList, 5)
      this.processList(data.greatsThirtyThousandsList, 6)
      console.log(chartsCategory, '初始化时候的数据')
      this.$refs.category.initEcharts(chartsCategory)
    }
  }
}
</script>
<style lang="scss" scoped>
.chartsTitlt{
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 20px;
}
.charts-container{
  width: 100%;
}
.charts-category{
  flex: 1;
}
// .charts-item{
//   flex: 1;
// }
</style>
