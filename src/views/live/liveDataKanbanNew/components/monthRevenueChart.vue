<template>
  <div class="revenue-chart">
    <div id="revenueChartMonth" ref="revenueChartMonth" class="revenue-chart-im" />
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  getMonthRevenue
} from '@/api/liveRoom/kanban.js'
import { filterPrice } from '@/utils/index.js'
import { debounce } from '@/utils'
import moment from 'moment'
import redDown from '@/assets/image/live/icn_red_up.png'
import greenUp from '@/assets/image/live/icn_green_up.png'
export default {
  filters: {
  },
  components: {},
  props: {
  },
  data() {
    return {
      redDown,
      greenUp,
      xTearcherArray: [],
      $_resizeHandler: null,
      xLineData: [],
      yZhenrenArray: [],
      yShuziArray: [],
      yOfflineArray: [],
      yMubiaoArray: [],
      rawData: [
        [100, 302, 301],
        [320, 132, 101],
        [220, 182, 191]
      ],
      totalData: [],
      option: {
        legend: {
          selectedMode: false,
          x: 'center',
          y: 'bottom'
        },
        grid: {},
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: ['文四里', '赵武', '李三']
        },
        series: {}
      },
      chart: '',
      arrayString: [],
      chartData: [],
      compareRatioArray: []
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
    moment,
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
        comparisonWay: data.comparisonWay,
        deptId: data.deptId,
        monthYear: data.monthYear ? data.monthYear + '-01' : '',
        sortBy: data.sortBy,
        userIdList: data.userIdList
      }
      getMonthRevenue(params).then(res => {
        if (res.code === 1 && res.data) {
          this.xLineData = []
          this.yZhenrenArray = []
          this.yShuziArray = []
          this.yOfflineArray = []
          this.yMubiaoArray = []
          this.arrayString = []
          this.xTearcherArray = []
          this.compareRatioArray = []
          res.data.some(item => {
            var tbString = data.comparisonWay === 1 ? '环比：' : '同比：'
            let pdString = ''
            if (item.compareRatio && item.compareRatio > 0) {
              pdString = item.compareRatio + '%'
            } else if (item.compareRatio && item.compareRatio === 0) {
              pdString = item.compareRatio + '%'
            } else if (item.compareRatio && item.compareRatio < 0) {
              pdString = item.compareRatio + '%'
            }
            if (data.comparisonWay === 1) {
              tbString += !item.compareRatio ? '-' : pdString// + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            } else if (data.comparisonWay === 2) {
              tbString += !item.compareRatio ? '-' : pdString // + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            }
            const str = tbString // item.userName + '\n\n' + tbString
            this.xLineData.push(item.userName)
            this.arrayString.push(str)
            this.xTearcherArray.push(item.userId)
            this.compareRatioArray.push(item.completionRatio)
            // this.xLineData.push(item.userName)
            this.yZhenrenArray.push(item.personSum ? this.filterPrice(item.personSum) : 0)
            // this.yShuziArray.push(item.digitalPersonSum ? this.filterPrice(item.digitalPersonSum) : 0)
            this.yShuziArray.push(item.digitalPersonSum ? item.digitalPersonSum / 100 : 0)
            this.yOfflineArray.push(item.offlineSum ? this.filterPrice(item.offlineSum) : 0)
            this.yMubiaoArray.push(item.targetValueSum ? this.filterPrice(item.targetValueSum) : 0)
          })
          this.chartData = res.data
          this.loadData()
        }
      })
    },
    loadData: function() {
      this.chart = echarts.init(document.getElementById('revenueChartMonth'))
      const xAxisData = this.xLineData
      const data1 = this.yZhenrenArray
      const data2 = this.yShuziArray
      const data3 = this.yOfflineArray
      const markPoint = this.yMubiaoArray
      const markPointNewArray = []
      markPoint.some((item, index) => {
        let nums = item - data1[index] - data2[index] - data3[index]
        nums = nums > 0 ? nums.toFixed(2) : 0
        markPointNewArray.push(nums)
      })
      /* const xAxisData = ['张丽莎1', '张丽莎2', '张丽莎3', '张丽莎4', '张丽莎5', '张丽莎6', '张丽莎7']
      const data1 = [100, 302, 301, 334, 390, 330, 320]
      const data2 = [320, 132, 101, 134, 90, 230, 210]
      const data3 = [220, 182, 191, 234, 290, 330, 310]
      const markPoint = [1660, 1582, 1998, 1858, 1789, 1996, 1669]*/
      const arrayStringReturn = this.arrayString
      const compareRatioArray = this.compareRatioArray
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
      this.option = {
        backgroundColor: '#fff',
        dataZoom: [
          {
            type: 'slider', // 使用滑动条形式的区间选择 inside 'slider'：滑动条型数据区域缩放组件。
            start: 0, // 默认数据初始选择范围为 0% 到 100%
            end: (!xAxisData?.length || xAxisData?.length < 12) ? 100 :Math.floor((11 / xAxisData?.length) * 100) - 1,  // 可以通过滑动来改变这个选择范围
            textStyle:false,
            // end: !valueList?.length || valueList?.length === 1 ? 100 : 40, // 可以通过滑动来改变这个选择范围
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
            // endValue: 15,
            // // empty：当前数据窗口外的数据，被设置为空。
            // // 即不会影响其他轴的数据范围
            // filterMode: 'empty',
            // // 设置滚动条宽度，相对于盒子宽度
            // width: '50%',
            // // 设置滚动条高度
            zoomLock: true, // 禁用缩放
            height: 12
            // // 设置滚动条显示位置
            // left: 'center',
            // // 是否锁定选择区域（或叫做数据窗口）的大小
            // zoomLoxk: true,
            // // 控制手柄的尺寸
            // handleSize: 0
            // // dataZoom-slider组件离容器下侧的距离
          }
        ],
        legend: {
          data: ['真人直播', '数字直播', '线下录单', '目标'],
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
        xAxis: {
          data: xAxisData,
          name: '',
          axisLine: { onZero: true },
          splitLine: { show: false }
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
          top: 60,
          left: 70,
          right: 50,
          bottom: 70
        },
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
            data: data2
          },
          {
            name: '线下录单',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            barWidth: '20px',
            color: '#F2D880',
            data: data3
          },
          {
            name: '距离目标',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            barWidth: '10px',
            left: '20px',
            color: '#F7F7F7',
            data: markPointNewArray,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#777',
                    fontSize: 12
                  },
                  formatter: function(params) {
                    var index = params.dataIndex
                    let wcNum = data1[index] + data2[index] + data3[index]
                    wcNum = wcNum.toFixed(2)
                    let returnString = '目标：'
                    returnString += markPoint[index]
                    returnString += '\n完成：'
                    returnString += wcNum
                    returnString += '\n（完成度：'
                    returnString += compareRatioArray[index] ? compareRatioArray[index] + '%' : '-'
                    returnString += '）'
                    return returnString
                  }
                }
              }
            }
          }
        ],
        graphic: []
      }
      /* const xData = this.option.xAxis.data
      const xValueCount = xData.length
      const widthAll = this.$refs.revenueChartMonth.clientWidth - 120
      const sxWindth = widthAll - 110 * xValueCount
      const xInterval = sxWindth / xValueCount
      const xStart = 0
      for (var i = 0; i < xValueCount; i++) {
        var xPosition = xStart + i * xInterval
        var labelPosition = xData.getLabelPosition(xData[i], null, null, null, { index: i })
        this.option.graphic.push({
          type: 'group',
          left: xPosition,
          bottom: 20,
          children: [
            {
              type: 'image',
              style: {
                float: 'left',
                image: this.chartData[i].compareRatio > 0 ? this.greenUp : this.redDown,
                width: 16,
                height: 16
              },
              position: [labelPosition.x - 10, labelPosition.y - 4]
            },
            {
              type: 'text',
              style: {
                float: 'left',
                text: arrayStringReturn[i],
                fill: '#000'
              },
              position: [labelPosition.x - 10, labelPosition.y - 4]
            }
          ]
        })
      }*/

      this.chart.setOption(this.option)
      this.chart.off('click')
      this.chart.on('click', (params) => {
        const userId = this.xTearcherArray[params.event.target.dataIndex]
        this.chartData.some(item => {
          if (userId === item.userId) {
            const userIds = []
            userIds.push(item.userId)
            const paramsObj = {
              month: moment(this.formData.monthYear).format('YYYYMM'),
              deptIds: this.formData.deptId,
              userIds: userIds,
              userName: item.userName
            }
            this.$emit('chooseToDetailPage', true, paramsObj)
            /* this.$router.push({
              name: 'liveTargetSettingEdit',
              params: { month: moment(this.formData.monthYear).format('YYYYMM'), deptIds: this.formData.deptId, userIds: userIds }
            }) */
            // liveTargetSettingEdit
          }
        })
      })
      let isFinished = false
      this.chart.on('finished', () => {
        if (!isFinished) {
          isFinished = true
          var xData = this.option.xAxis.data
          var graphicElements = []

          xData.forEach((value, index) => {
            var pointInPixel = this.chart.convertToPixel({ seriesIndex: index }, [index])
            var xAxisCoord = pointInPixel[0]
            console.log('X轴坐标:', xAxisCoord)

            var xPosition = xAxisCoord // xStart + index * xInterval
            var yPosition = 400// this.chart.convertToPixel({ seriesIndex: 0 }, [null, 0])[1]
            graphicElements.push({
              type: 'image',
              style: {
                image: this.chartData[index].compareRatio > 0 ? this.greenUp : this.redDown, // 图标 URL
                width: 16,
                height: 16
              },
              position: [xPosition + 35, yPosition - 5] // 调整位置使其与标签对齐
            })

            // 创建文本标签
            graphicElements.push({
              type: 'text',
              style: {
                text: arrayStringReturn[index],
                font: '12px Arial',
                fill: '#000'
              },
              position: [xPosition - 40, yPosition] // 与原标签位置相同
            })
          })

          // 更新 graphic 元素
          this.chart.setOption({
            graphic: graphicElements
          })
        }
      })
    },
    changeDetailStauts(type) {
      this.$emit('changeDetailStatus', type)
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

