<template>
  <div class="revenue-chart">
    <div id="revenueChart" class="revenue-chart-im" />
  </div>
</template>

<script>
import { filterPrice } from '@/utils/index.js'
import { getRevenueRankingBoard } from '@/api/liveRoom/kanban.js'
import { debounce } from '@/utils'
import echarts from 'echarts'
export default {
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      $_resizeHandler: null,
      rawData: [
        [100, 302, 301],
        [320, 132, 101],
        [220, 182, 191]
      ],
      totalData: [],
      option: {},
      chart: '',
      xAxisData: [],
      xTearcherArray: [],
      yZhenrenArray: [],
      yShuziArray: [],
      yXianxiaArray: [],
      yHeji: [],
      chartData: [],
      formData: {},
      arrayString: []
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  methods: {
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    filterPrice,
    init(data) {
      this.formData = { ...data }
      const params = {
        deptId: data.deptId,
        comparisonWay: data.comparisonWay,
        startTime: data.time.time[0] ? data.time.time[0] : '',
        endTime: data.time.time[1] ? data.time.time[1] : '',
        liveModel: data.liveModel,
        sortBy: data.sortBy,
        teacherId: data.teacherId
      }
      getRevenueRankingBoard(params).then(res => {
        if (res.code === 1 && res.data) {
          this.xAxisData = []
          this.xTearcherArray = []
          this.yZhenrenArray = []
          this.arrayString = []
          this.yShuziArray = []
          this.yXianxiaArray = []
          this.yHeji = []
          res.data.some(item => {
            // var tbString = data.comparisonWay === 1 ? '环比：' : '同比：'
            var tbString = ''
            let pdString = ''
            if (item.compareRatio && item.compareRatio > 0) {
              pdString = '↗' + item.compareRatio + '%'
            } else if (item.compareRatio && item.compareRatio === 0) {
              pdString = item.compareRatio + '%\n\n'
            } else if (item.compareRatio && item.compareRatio < 0) {
              pdString = '↘' + item.compareRatio + '%'
            }
            if (data.comparisonWay === 1) {
              tbString += !item.compareRatio ? '-' : pdString // + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            } else if (data.comparisonWay === 2) {
              tbString += !item.compareRatio ? '-' : pdString // + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            }
            // const str = '{p|' + item.teacherName + '\n\n' + tbString + '}'

            const str = item.teacherName + '\n\n' + tbString + '\n\n'
            this.arrayString.push(str)
            this.xAxisData.push(item.teacherName)
            this.xTearcherArray.push(item.teacherId)
            this.yZhenrenArray.push(
              item.personRevenue ? this.filterPrice(item.personRevenue) : 0
            )
            this.yShuziArray.push(
              item.digitalPersonRevenue
                ? item.digitalPersonRevenue / 100
                : 0
            )
            this.yXianxiaArray.push(
              item.offlineRevenueAmount
                ? this.filterPrice(item.offlineRevenueAmount)
                : 0
            )
            this.yHeji.push(
              item.totalRevenue ? this.filterPrice(item.totalRevenue) : 0
            )
          })
          this.chartData = res.data
        }
        this.loadData()
      })
    },
    loadData: function () {
      console.log('yHeji-----', this.yZhenrenArray, this.xAxisData)
      this.chart = echarts.init(document.getElementById('revenueChart'))
      const xAxisData = this.xAxisData
      const data1 = this.yZhenrenArray
      const data2 = this.yShuziArray
      const data3 = this.yXianxiaArray
      const markPoint = this.yHeji
      const arrayStringReturn = this.arrayString
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
      this.option = {
        backgroundColor: '#fff',
        legend: {
          data: ['真人直播', '数字直播'],
          left: 'center',
          top: 'bottom',
          bottom: '20px',
          selectedMode: false
        },
        brush: {
          toolbox: {
            show: false
          },
          xAxisIndex: 0
        },
        toolbox: {
          show: false,
          feature: {
            magicType: {
              type: ['stack']
            },
            dataView: {}
          }
        },
        tooltip: {},
        dataZoom: [
          {
            type: 'slider', // 使用滑动条形式的区间选择 inside 'slider'：滑动条型数据区域缩放组件。
            start: 0, // 默认数据初始选择范围为 0% 到 100%
            end:
              !xAxisData?.length || xAxisData?.length < 12
                ? 100
                : Math.floor((11 / xAxisData?.length) * 100) - 1, // 可以通过滑动来改变这个选择范围
            zoomLock: true, // 禁用缩放
            textStyle:false,
            // backgroundColor: 'rgb(19, 63, 100)',
            // // 设置选中范围的填充颜色
            // fillerColor: 'rgb(16, 171, 198)',
            // // 设置边框颜色
            // borderColor: 'rgb(19, 63, 100)',
            // // 是否显示detail，即拖拽时候显示详细数值信息
            // showDetail: false,
            // // 数据窗口范围的起始数值
            // startValue: 0,
            // // 数据窗口范围的结束数值（一页显示多少条数据）
            // endValue: 11,
            // // empty：当前数据窗口外的数据，被设置为空。
            // // 即不会影响其他轴的数据范围
            // filterMode: 'empty',
            // // 设置滚动条宽度，相对于盒子宽度
            // width: '50%',
            // // 设置滚动条高度
            height: 12
            // // 设置滚动条显示位置
            // left: 'center'
            // // 是否锁定选择区域（或叫做数据窗口）的大小
            // zoomLoxk: true,
            // // 控制手柄的尺寸
            // handleSize: 0
            //  'dataZoom-slider':'10px'//组件离容器下侧的距离
          }
        ],
        series: [
          {
            name: '真人直播',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            barWidth: '20px',
            color: '#EB424C',
            data: data1
          },
          {
            name: '数字直播',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            barWidth: '20px',
            color: '#FFA809',
            data: data2,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#777',
                    fontSize: 12
                  },
                  formatter: function (params) {
                    var index = params.dataIndex
                    return markPoint[index]
                  }
                }
              }
            }
          }
        ],
        xAxis: {
          data: arrayStringReturn,
          name: '',
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false },
          axisLabel: {
            interval: 0,
            formatter: function (params, index) {
              return params
            },
            rich: {
              p: {
                color: '#000',
                width: '100%'
              },
              br: {}
            }
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#E0E6ED'
            }
          }
        },
        grid: {
          top: 40,
          left: 50,
          right: 50,
          bottom: 50,
          containLabel: true // 确保标签不被遮挡
        }
      }
      this.chart.setOption(this.option)
      this.chart.off('click')
      this.chart.on('click', params => {
        const tearcherId = this.xTearcherArray[params.event.target.dataIndex]
        this.chartData.some(item => {
          if (tearcherId === item.teacherId) {
            this.changeDetailStauts(false, item)
          }
        })
      })
    },
    changeDetailStauts(type, obj) {
      this.$emit('changeDetailStatus', type, obj)
    }
  }
}
</script>

<style lang='scss' scoped>
.revenue-chart {
  width: 100%;
  height: 440px;
}
.revenue-chart-im {
  width: 100%;
  height: 100%;
}
</style>

