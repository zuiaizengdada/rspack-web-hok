<template>
  <div class="charts-container">
    <Title class="title" title="转发量" />
    <div class="flex flex-between">
      <charts-radio ref="radio" class="charts-item" id-name="shareRadio" title="转发量占比" />
      <charts-funnel ref="funnel" class="charts-item" id-name="shareFunel" title="转发量分布图（作品数）" />
      <charts-category ref="category" class="charts-item charts-category" id-name="shareCategory" title="各平台转发量占比" />
    </div>
  </div>
</template>
<script>
import ChartsRadio from '../Charts/ChartsRatio.vue'
import ChartsFunnel from '../Charts/ChartsFunnel.vue'
import ChartsCategory from '../Charts/ChartsCategory.vue'
import { chartsRadio, chartsFunnel, chartsFunnel1, chartsCategory } from '../Charts/constants'
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
      chartsRadio[0].value = data.sharedUp
      chartsRadio[1].value = data.sharedDown
      this.$refs.radio.initEcharts(chartsRadio)
    },
    initChartsFunnel(data) {
      // 取data里面最大的值
      const max = Math.max(
        data.sharedTwoThousand,
        data.sharedFiveThousand,
        data.sharedTenThousand,
        data.sharedTwentyThousand,
        data.sharedThirtyThousand
      )
      console.log(max, '最大值')
      // 累加data里面的数据
      chartsFunnel[0].value = data.sharedTwoThousand / max * 100
      chartsFunnel[1].value = data.sharedFiveThousand / max * 100
      chartsFunnel[2].value = data.sharedTenThousand / max * 100
      chartsFunnel[3].value = data.sharedTwentyThousand / max * 100
      chartsFunnel[4].value = data.sharedThirtyThousand / max * 100
      // 第二层
      chartsFunnel1[0] = {
        value: data.sharedTwoThousand / max * 100,
        name: '2000及以上',
        label: {
          formatter: res => {
            return `${data.sharedTwoThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[1] = {
        value: data.sharedFiveThousand / max * 100,
        name: '5000及以上',
        label: {
          formatter: res => {
            return `${data.sharedFiveThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[2] = {
        value: data.sharedTenThousand / max * 100,
        name: '1万及以上',
        label: {
          formatter: res => {
            return `${data.sharedTenThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[3] = {
        value: data.sharedTwentyThousand / max * 100,
        name: '2万及以上',
        label: {
          formatter: res => {
            return `${data.sharedTwentyThousand}`
          },
          position: 'inside'
        }
      }
      chartsFunnel1[4] = {
        value: data.sharedThirtyThousand / max * 100,
        name: '3万及以上',
        label: {
          formatter: res => {
            return `${data.sharedThirtyThousand}`
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
          chartsCategory[categoryIndex][index] = item.sharedRate || 0
        }
      })
    },
    initChartscategory(data) {
      this.processList(data.sharedTwoThousandUpList, 1)
      this.processList(data.sharedTwoThousandDownList, 2)
      this.processList(data.sharedFiveThousandList, 3)
      this.processList(data.sharedTenThousandsList, 4)
      this.processList(data.sharedTwentyThousandList, 5)
      this.processList(data.sharedThirtyThousandsList, 6)
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
