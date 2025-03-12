<template>
  <div class="revenue-chart">
    <div id="monthRefundChart" class="revenue-chart-im" />
  </div>
</template>

<script>
import { filterPrice } from '@/utils/index.js'
import echarts from 'echarts'
import { getRefundChart } from '@/api/liveRoom/kanban.js'
import { debounce } from '@/utils'
export default {
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      $_resizeHandler: null,
      xArray: [],
      yDataArray: [],
      yDataSortArray: [], // 用于排序
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
    filterPrice,
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    init(data) {
      const params = {
        comparisonWay: data.comparisonWay,
        deptId: data.deptId,
        monthYear: data.monthYear ? data.monthYear + '-01' : '',
        sortBy: data.sortBy,
        userIdList: data.userIdList
      }
      getRefundChart(params).then(res => {
        if (res.code === 1 && res.data) {
          this.xArray = []
          this.yDataArray = []
          this.arrayString = []
          res.data.some(item => {
            var tbString = data.comparisonWay === 1 ? '环比：' : '同比：'
            let pdString = ''
            if (item.compareRatio && item.compareRatio > 0) {
              pdString = '↗' + item.compareRatio + '%'
            } else if (item.compareRatio && item.compareRatio === 0) {
              pdString = item.compareRatio + '%'
            } else if (item.compareRatio && item.compareRatio < 0) {
              pdString = '↘' + item.compareRatio + '%'
            }
            if (data.comparisonWay === 1) {
              tbString += !item.compareRatio ? '-' : pdString // + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            } else if (data.comparisonWay === 2) {
              tbString += !item.compareRatio ? '-' : pdString // + item.compareRatio != null ? (item.compareRatio > 0 ? ' ↗ ' : ' ↘ ' + (item.compareRatio ? item.compareRatio + '%' : '')) : '-'
            }
            const str = item.userName + '\n\n' + tbString
            this.xArray.push(item.userName)
            this.arrayString.push(str)
            // this.xArray.push(item.userName)
            this.yDataArray.push(
              // item.refundAmount ? this.filterPrice(item.refundAmount) : 0
              item.refundAmount ? item.refundAmount / 100 : 0
            )
          })
        }
        this.loadData()
      })
    },
    loadData: function () {
      this.chart = echarts.init(document.getElementById('monthRefundChart'))
      const arrayStringReturn = this.arrayString
      this.option = {
        dataZoom: [
          {
            type: 'slider', // 使用滑动条形式的区间选择 inside 'slider'：滑动条型数据区域缩放组件。
            start: 0, // 默认数据初始选择范围为 0% 到 100%
            end:
              !this.xArray?.length || this.xArray?.length < 12
                ? 100
                : Math.floor((11 / this.xArray?.length) * 100) - 1, // 可以通过滑动来改变这个选择范围
            textStyle: false,
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
        tooltip: {
          // 触发类型，默认数据触发，可选为：'item' | 'axis'
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: arrayStringReturn,
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
          type: 'value',
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
          left: 70,
          right: 50,
          bottom: 50,
          containLabel: true // 确保标签不被遮挡
        },
        series: [
          {
            data: this.yDataArray,
            type: 'bar',
            barWidth: '20px',
            color: '#FFA260',
            label: {
              show: true, // 显示数值
              position: 'top' // 在顶部显示
            }
          }
        ]
      }
      this.chart.setOption(this.option)
    }
  }
}
</script>

    <style lang='scss' scoped>
.revenue-chart {
  width: 100%;
  height: 460px;
}
.revenue-chart-im {
  width: 100%;
  height: 100%;
}
</style>

