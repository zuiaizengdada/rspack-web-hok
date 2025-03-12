<template>
  <div class="revenue-chart">
    <div style="margin-top: 10px">
      <img style="width: 30px;height: 30px; float: left;" src="../../../../assets/image/live/icn_userimg.png" />
      <span style="float: left; margin-left: 10px; color: #000; line-height: 30px;">{{ userName }}</span>
    </div>
    <div id="revenueChartForDetailChart" class="revenue-chart-im-detail-chart" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { filterPrice } from '@/utils/index.js'
import {
  getDailyDetail
} from '@/api/liveRoom/kanban.js'

export default {
  filters: {
  },
  components: {},
  props: {
    chooseType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      totalData: [],
      userName: '',
      option: {
      },
      chart: '',
      xLineFont: [],
      yYingshouArray: [],
      yHuanbiArray: [],
      hbString: '环比'
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    init(data) {
      this.userName = data.userName
      if (data.comparisonWay === 1) {
        this.hbString = '环比'
      } else {
        this.hbString = '同比'
      }
      const params = {
        comparisonWay: data.comparisonWay,
        endTime: data.time.time ? data.time.time[1] : '',
        startTime: data.time.time ? data.time.time[0] : '',
        type: this.chooseType + 1,
        userId: data.userId
      }
      getDailyDetail(params).then(res => {
        if (res.code === 1 && res.data) {
          this.xLineFont = []
          this.yYingshouArray = []
          this.yHuanbiArray = []
          res.data.dailyDetailList?.some(item => {
            this.xLineFont.push(item.date)
            if (this.chooseType === 0) {
              this.yYingshouArray.push(item.revenueAmount ? this.filterPrice(item.revenueAmount) : 0)
              this.yHuanbiArray.push(item.compareRevenueRatio ? item.compareRevenueRatio : 0)
            } else if (this.chooseType === 1) {
              this.yYingshouArray.push(item.refundAmount ? this.filterPrice(item.refundAmount) : 0)
              this.yHuanbiArray.push(item.compareRefundRatio ? item.compareRefundRatio : 0)
            } else if (this.chooseType === 2) {
              this.yYingshouArray.push(item.gmv ? this.filterPrice(item.gmv) : 0)
              this.yHuanbiArray.push(item.compareGmvRatio ? item.compareGmvRatio : 0)
            }
          })
        }
        console.log('ddddddd:', this.yHuanbiArray)
        this.loadData()
      })
    },
    filterPrice,
    loadData: function() {
      this.chart = echarts.init(document.getElementById('revenueChartForDetailChart'))
      let strTitle = ''
      if (this.chooseType === 0) {
        strTitle = '营收'
      } else if (this.chooseType === 1) {
        strTitle = '退款'
      } else if (this.chooseType === 2) {
        strTitle = 'GMV'
      }

      this.option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            console.log('paramsparams::', params)
            let value1 = ''
            let string1 = ''
            let value2 = ''
            let string2 = ''
            let timeString = ''
            params.some(item => {
              console.log('itemsss:', item)
              timeString = item.axisValueLabel
              if (item.seriesName === '环比' || item.seriesName === '同比') {
                value2 = item.value + '%'
                string2 = item.seriesName
              } else {
                value1 = item.value
                string1 = item.seriesName
              }
            })
            return '<div style="padding: 5px"><p>' + timeString + '</p><p>' + string1 + ': ' + value1 + '</p><p>' + string2 + ': ' + value2 + '</p></div>'
          }
        },
        legend: {
          data: [strTitle, this.hbString],
          left: 'center',
          top: 'bottom',
          bottom: '20px'
        },
        grid: {
          top: 40,
          left: 70,
          right: 50,
          bottom: 70
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xLineFont
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: strTitle,
            type: 'line',
            stack: 'Total',
            color: '#FFA809',
            radius: '100%',
            data: this.yYingshouArray
          },
          {
            name: this.hbString,
            type: 'line',
            stack: 'Total',
            color: '#03BE63',
            data: this.yHuanbiArray
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
        height: 430px;
    }
    .revenue-chart-im-detail-chart {
        width: 100%;
        height: 430px;
    }
    </style>

