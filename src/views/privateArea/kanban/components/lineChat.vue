<template>
  <div class="broken">
    <div class="qoq">
      <el-checkbox v-model="checked" @change="handleChange">环比</el-checkbox>
      <el-tooltip class="item" :content="'单指标查看环比'" placement="bottom">
        <img src="@/assets/image/product/icon.png" style="" />
      </el-tooltip>
    </div>
    <div id="deliverLineCharts" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  name: 'DataDiscount',
  props: {
    paramType: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      checked: false,
      chart: null,
      $_resizeHandler: null, // 页面尺寸变化回调函数
      xAxis: [],
      upperDate: [],
      seriesNumData: [],
      seriesLinkRatioData: [],
      seriesLinkRatioDataOne: [],
      seriesNumDataOne: [],
      title: '',
      titleOne: ''
    }
  },
  mounted() {
    this.initChart()
    this.setOptions()
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
    sortArr(attr) {
      return function (a, b) {
        return b[attr] - a[attr]
      }
    },
    handleChange() {
      this.setOptions(
        this.xAxis,
        this.upperDate,
        this.seriesNumData,
        this.seriesLinkRatioData,
        this.title
      )
    },
    initChart() {
      this.chart = echarts.init(
        document.getElementById('deliverLineCharts'),
        'macarons'
      )
    },
    initSeries() {
      if (Array.isArray(this.title)) {
        let list = []
        this.title.forEach((item, index) => {
          const title = item
          const seriesNumData = this.seriesNumData.map(n => (n[index]))
          const seriesLinkRatioData = this.seriesLinkRatioData.map(n => (n[index]))
          list = [...list,
            {
              name: title,
              type: 'line',
              smooth: true,
              data: seriesNumData,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#3382F6'
                  },
                  {
                    offset: 1,
                    color: '#cadaf3'
                  }
                ]),
                opacity: 0.3
              }
            },
            // 环比
            {
              type: 'line',
              name: '环比',
              smooth: true,
              data: this.checked ? seriesLinkRatioData : [],
              // itemStyle: {
              //   normal: {
              //     lineStyle: {
              //       width: 2,
              //       type: 'dotted'
              //     }
              //   }
              // },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#42e3f8'
                  },
                  {
                    offset: 1,
                    color: '#c7eef3'
                  }
                ]),
                opacity: 0.3
              }
            }
          ]
        })
        return list
      } else {
        return [
          {
            name: this.title,
            type: 'line',
            smooth: true,
            data: this.seriesNumData,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#3382F6'
                },
                {
                  offset: 1,
                  color: '#cadaf3'
                }
              ]),
              opacity: 0.3
            }
          },
          // 环比
          {
            type: 'line',
            name: '环比',
            smooth: true,
            data: this.checked ? this.seriesLinkRatioData : [],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#42e3f8'
                },
                {
                  offset: 1,
                  color: '#c7eef3'
                }
              ]),
              opacity: 0.3
            }
          }
        ]
      }
    },
    setOptions(
      xAxisList,
      upperDate,
      seriesNumDataList,
      seriesLinkRatioDataList,
      title
    ) {
      this.xAxis = xAxisList
      this.upperDate = upperDate
      this.seriesNumData = seriesNumDataList
      this.seriesLinkRatioData = seriesLinkRatioDataList
      this.title = title
      let arr = [{ name: this.title }]
      if (Array.isArray(this.title)) {
        arr = this.title.map(item => ({ name: item }))
      }
      const series = this.initSeries()
      if (this.checked) {
        arr.push({ name: '环比' })
      }
      this.chart.setOption({
        color: ['#3382F6',
          '#cefccc',
          '#2EB2EB',
          '#1CD6E2',
          '#24DBAF',
          '#19f1c3',
          '#86482a',
          '#cefccc'],
        title: {
          text: '',
          textStyle: {
            color: '#333',
            fontWeight: '400',
            fontSize: 16
          },
          left: 16,
          top: 6
        },
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
          formatter: params => {
            if (!params || params.length === 0) {
              return ''
            }
            const newArr = params.sort(this.sortArr('value'))?.sort((a, b) => a.componentIndex - b.componentIndex)
            let str = `<p >${params[0].axisValue}</p>`
            newArr.forEach((ele, index) => {
              const upperDateTiem = this.upperDate[ele.dataIndex]
              if (ele.seriesName === '环比') {
                str += `
                  <p style="margin-top: 8px;">
                      <span class="circle" style="border:1px solid ${ele.color}"></span>
                      <span>${newArr[index - 1]?.seriesName}${ele.seriesName}</span>
                      <span style="color: #777">${ele.data}</span>
                      <span>(${upperDateTiem})</span>
                  </p>`
              } else {
                str += `
                  <p style="margin-top: 8px;">
                      <span class="circle" style="background:${ele.color}"></span>
                      <span>${ele.seriesName}</span>
                      <span style="color: #777">${ele.data}</span>
                  </p>`
              }
            })
            return str
          }
        },
        legend: {
          data: arr.map(e => e.name)
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: this.xAxis
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          }
        },
        series: series
      }, true)
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
.broken {
  margin-top: 20px;
  width: 100%;
  height: 380px;
  border-radius: 10px;
  padding: 10px 20px;
  padding-top: 50px;
  background: #ffffff;
  box-sizing: border-box;
  position: relative;
  .qoq {
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 999999;
    left: 40px;
    img {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
}
</style>
