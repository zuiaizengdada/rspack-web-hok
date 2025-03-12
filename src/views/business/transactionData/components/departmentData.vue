<template>
  <div class="salesChannels">
    <div class="top-data">
      <span class="left-title"><i /><span class="tit-name">部门业绩</span><el-tooltip class="item" effect="dark" :content="'部门所产生的成交金额汇总。'" placement="top">
        <img src="@/assets/image/product/icon.png">
      </el-tooltip></span>
    </div>
    <div class="sales-content flexbox">
      <div class="all-sales">
        <div v-for="(item,index) in deptTotalData" :key="index">
          <div :class="['flexbox','doudian'+index%15]" :style="{width: (587-150*(index/deptTotalData.length))+'px' }" @click="goPage(item)">
            <div class="flexbox">
              <span class="departmentName">{{ item.departmentName }}</span>
            </div>
            <span class="flexbox">
              <span>￥{{ filterPrice(item.totalCount) }}</span>
              <span class="right-enter" />
            </span>
          </div>
        </div>
      </div>
      <div class="sales-broken">
        <div id="salesCharts1" style="width: 100%;height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getDayAll } from '@/utils'
import mixin from '@/components/AppPanelData/mixin'
export default {
  name: 'SalesChannels',
  mixins: [mixin],
  props: {
    deptTotalDayData: {
      type: Array,
      default: () => {
        return []
      }
    },
    deptTotalData: {
      type: Array,
      default: () => {
        return []
      }
    },
    timeList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {

    }
  },
  watch: {
    deptTotalDayData: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    },
    timeList: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.initChart()
  },
  methods: {
    // 跳转页面部门
    goPage(item) {
      this.$emit('goPageDepartment', item)
    },
    sortArr(attr) {
      return function (a, b) {
        return b[attr] - a[attr]
      }
    },
    // 过滤所有的数值
    filterPrice(num) {
      if (num === null) {
        return 0
      } else {
        const newNum = num
        if (newNum < 10000000 && newNum > -10000000) {
          return newNum
        } else {
          return (newNum / 10000).toFixed(2) + '万'
        }
      }
    },
    // 初始化echarts
    initChart() {
      const timeList = getDayAll(this.timeList.startTime, this.timeList.endTime)
      this.chart = echarts.init(document.getElementById('salesCharts1'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter: (params) => {
            console.log(params, 'aabbccdd')
            if (!params || params.length === 0) {
              return ''
            }
            const newArr = params.sort(this.sortArr('value'))
            let str = `<p >${params[0].axisValue}</p>`
            newArr.forEach(ele => {
              str += `
                <p style="margin-top: 8px;">
                    <span class="circle" style="background:${ele.color}"></span>
                    <span>${ele.seriesName}</span>
                    <span style="color: #777">${this.filterPrice(ele.data)}</span>
                </p>`
            })
            return str
          }
        },
        // legend: {
        //   data: this.deptTotalDayData.map(e => e.name)
        // },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     start: 0,
        //     end: 100
        //   }
        // ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeList
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          }
        },
        series: this.deptTotalDayData
      }
      this.chart.setOption(option, true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./department.scss";
</style>
