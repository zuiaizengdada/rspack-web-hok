<template>
  <div class="broken">
    <div class="qoq">
      <el-checkbox v-model="checked" :disabled="selectList.length>1" @change="handleChange">{{ title }}</el-checkbox>
      <el-tooltip class="item" :content="'单指标查看环比'" placement="bottom">
        <img src="@/assets/image/product/icon.png" style="">
      </el-tooltip>
    </div>
    <div id="compared1" style="width: 100%; height: 336px" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { getDayAll } from '@/utils/index'
import mixin from '@/components/AppPanelData/mixin'
export default {
  name: 'DataDiscount',
  mixins: [mixin],
  props: {
    brokenQoqData: {
      type: Array,
      default: () => {
        return []
      }
    },
    brokenCheck: {
      type: Boolean,
      default: false
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    brokenData: {
      type: Array,
      default: () => {
        return []
      }
    },
    timeList: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: '较昨日'
    }
  },
  data() {
    return {
      checked: false
    }
  },
  watch: {
    brokenData: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    },
    brokenCheck: {
      handler(val, val1) {
        if (val1 === undefined) {
          return
        }
        console.log(val, '改变了选中')
        this.checked = val
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      },
      deep: true,
      immediate: true
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
  mounted() {
    this.initChart()
  },
  methods: {
    sortArr(attr) {
      return function (a, b) {
        return b[attr] - a[attr]
      }
    },
    // 改变了环比
    handleChange() {
      this.$emit('changeCheck', !this.brokenCheck)
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
      this.chart = echarts.init(document.getElementById('compared1'))
      let arr = Object.assign([], this.brokenData)
      if (this.brokenCheck) {
        arr = arr.concat(this.brokenQoqData)
      }
      console.log(arr, 'init了')
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
            if (!params || params.length === 0) {
              return ''
            }
            const newArr = params.sort(this.sortArr('value'))
            console.log(newArr, 'newArr')
            let str = `<p >${params[0].axisValue}</p>`
            newArr.forEach(ele => {
              if (ele.seriesName === '环比') {
                str += `
                <p style="margin-top: 8px;">
                    <span class="circle" style="border:1px solid ${ele.color}"></span>
                    <span>${ele.seriesName}</span>
                    <span style="color: #777">${this.filterPrice(ele.data)}</span>
                </p>`
              } else {
                str += `
                <p style="margin-top: 8px;">
                    <span class="circle" style="background:${ele.color}"></span>
                    <span>${ele.seriesName}</span>
                    <span style="color: #777">${this.filterPrice(ele.data)}</span>
                </p>`
              }
            })
            return str
          }
        },
        legend: {
          data: arr.map(e => e.name)
        },
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
        series: arr
      }
      this.chart.setOption(option, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.broken{
  margin-top: 20px;
  //width: 1119px;
  //height: 356px;
  padding: 10px 0;
  border: 1px solid #CBCFD3;
  box-sizing: border-box;
  position: relative;
  .qoq{
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 999;
    left: 30px;
    img{
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
}
</style>
