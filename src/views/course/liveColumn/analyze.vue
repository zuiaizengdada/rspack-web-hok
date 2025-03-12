<template>
  <div class="analyze_wrap overflowOuto">
    <div class="search">
      <div v-if="search.period.periodNum" class="periodNum">
        <span>{{ search.period.periodNum }}期</span>
        <i class="el-icon-close m-l-10 delBtn" @click="clearSearch" />
      </div>
      <el-button @click="periodChange">选择期数</el-button>
    </div>
    <div v-if="visible" class="analyze_content">
      <div class="pie1">
        <div id="chart1" />
      </div>
      <div class="pie">
        <div id="chart2" />
      </div>
      <div class="pie">
        <div id="chart3" />
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { analysisUser } from '@/api/course'
export default {
  components: {},
  props: {
    goodsId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    period: {
      type: Object,
      default: () => {
        return {
          id: '',
          periodNum: ''
        }
      }
    }
  },
  data() {
    return {
      search: {
        period: { id: '', periodNum: '' }
      },
      chart1: null,
      chart2: null,
      chart3: null,
      data1: {
        legendData: [],
        seriesData: []
      },
      data2: {
        legendData: [],
        seriesData: []
      },
      data3: {
        legendData: [],
        seriesData: []
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log(newValue, 'newValue')
        if (newValue) {
          this.$nextTick(() => {
            this.search.period = this.period
            this.chart1 = echarts.init(document.getElementById('chart1'), 'macarons')
            this.chart2 = echarts.init(document.getElementById('chart2'), 'macarons')
            this.chart3 = echarts.init(document.getElementById('chart3'), 'macarons')
            this.getData()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 筛选条件处选择期数
    periodChange() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.goodsId },
        success: (res) => {
          console.log(res, 'res')
          this.search.period = res
          this.getData()
          // this.$set(this.search.period, 'id', res.id)
          // this.$set(this.search.periodNum, 'id', res.periodNum)
        }
      })
    },
    clearSearch() {
      this.search.period = { id: '', periodNum: '' }
      this.getData()
    },
    //
    setOptions1(data) {
      this.chart1.setOption({
        title: {
          text: '按行业',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData
        },
        series: [
          {
            name: '行业',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      this.chart1.resize({ width: '956px', height: '400px' })
    },
    setOptions2(data) {
      this.chart2 && this.chart2.setOption({
        title: {
          text: '按营业额',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData
        },
        series: [
          {
            name: '营业额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    setOptions3(data) {
      this.chart3 && this.chart3.setOption({
        title: {
          text: '按职位',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData
        },
        series: [
          {
            name: '职位',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    getData() {
      this.data1 = {
        legendData: [],
        seriesData: []
      }
      this.data2 = {
        legendData: [],
        seriesData: []
      }
      this.data3 = {
        legendData: [],
        seriesData: []
      }
      this.loading = true
      const params = {
        goodsId: this.goodsId,
        livePeriodId: this.search.period.id
      }
      analysisUser(params).then(res => {
        let data
        if (res.data) {
          data = res.data
        } else {
          data = {
            'industryMap': {
            },
            'positionMap': {
            },
            'studyMap': {},
            'total': null,
            'turnoverMap': {
            }
          }
        }
        // 行业
        for (const key in data.industryMap) {
          this.data1.legendData.push(key)
          this.data1.seriesData.push({
            name: key,
            value: data.industryMap[key]
          })
        }
        // 营业额
        for (const key in data.turnoverMap) {
          this.data2.legendData.push(key)
          this.data2.seriesData.push({
            name: key,
            value: data.turnoverMap[key]
          })
        }
        // 职位
        for (const key in data.positionMap) {
          this.data3.legendData.push(key)
          this.data3.seriesData.push({
            name: key,
            value: data.positionMap[key]
          })
        }
        console.log(this.data1, this.data2, this.data3)
        this.setOptions1(this.data1)
        this.setOptions2(this.data2)
        this.setOptions3(this.data3)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.analyze_wrap {
  width: 1000px;
  height: 700px;
  padding: 20px;
  .search {
    display: flex;
    align-items: center;
    .periodNum {
      padding: 10px 10px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      border-color: #DCDFE6;
      line-height: 1;
      margin-right: 10px;
      .delBtn {
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
    }
  }
  .analyze_content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    align-items: center;
    justify-content: space-between;
    .pie1 {
      width: 1956px;
      height: 400px;
      border: 1px solid #DCDFE6;
      margin-bottom: 20px;
      > div {
        width: 470px;
        height: 400px;
      }
    }
    .pie {
      width: 470px;
      height: 400px;
      border: 1px solid #DCDFE6;
      margin-bottom: 20px;
      > div {
        width: 470px;
        height: 400px;
      }
    }
  }
}
</style>
