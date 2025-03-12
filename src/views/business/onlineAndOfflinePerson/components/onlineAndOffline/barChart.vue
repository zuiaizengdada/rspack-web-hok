<template>
  <div class="wrapper-online-bar-chart">
    <span class="bar-span">{{ title }}付费占比</span>
    <div id="barChartData" class="bar-chart-data" />
    <div class="font-block">
      <div v-for="(obj,index) in dataArray" :key="index" class="font-block-row">
        <span><em :class="'em-cls-'+index" /><i>{{ obj.name }} {{ obj.ratio }}%</i></span>
        <p style="width: 100%;">
          <span style="margin-right: 10px;">￥{{ filterPrice(obj.value) }}</span>
          <span v-if="obj.amountLinkRatio > 0"><img src="../../../../../assets/image/business/icn_green_up.png" /><i class="green-i">{{ obj.amountLinkRatio>1000?'1000%+':obj.amountLinkRatio+'%' }}</i></span>
          <span v-else-if="obj.amountLinkRatio < 0"><img src="../../../../../assets/image/business/icn_red_up.png" /><i class="red-i">{{ obj.amountLinkRatio>1000?'1000%+':obj.amountLinkRatio+'%' }}</i></span>
          <span v-else-if="obj.amountLinkRatio === 0"><i>{{ obj.amountLinkRatio>1000?'1000%+':obj.amountLinkRatio+'%' }}</i></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { filterPrice } from '@/utils'
import { revenueDealTypeRatio } from '@/api/business/onlineAndOffline'
export default {
  components: {
  },
  props: {
    bizDataArray: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      chartDom: '',
      dataArray: [],
      item: {},
      option: {},
      title: '',
      formBarCharFor: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    filterPrice,
    init(item) {
      this.formBarCharFor = item
      this.title = ''
      if (item.productCategory === 0) {
        this.title += '视频课'
      } else if (item.productCategory === 1) {
        this.title += '直播课'
      } else if (item.productCategory === 2) {
        this.title += '线下课'
      } else if (item.productCategory === 3) {
        this.title += '组合课'
      }
      if (item.bizTypeActive === 1) {
        if (item.chooseType === 1) {
          this.title += '总营收'
        } else {
          this.title += '总业绩'
        }
      } else {
        this.title += item.bizTypeActiveName
      }

      const params = {
      }
      params.bizType = item.bizTypeActive
      if (item.employeeDeptId) {
        params.employeeDeptId = item.employeeDeptId
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (item.itemIdList && item.itemIdList.length > 0) {
        params.itemIdList = item.itemIdList
      }
      if (item.orderChannel && item.orderChannel.length > 0) {
        params.orderChannel = item.orderChannel[0]
      }
      if (item.orderChannel && item.orderChannel.length > 1) {
        params.shopId = item.orderChannel[1]
      }
      if ((item.productCategory && item.productCategory !== 999) || item.productCategory === 0) {
        params.productCategory = item.productCategory
      }
      if (item.teacherIdList && item.teacherIdList.length > 0) {
        params.teacherIdList = item.teacherIdList
      }
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]
      revenueDealTypeRatio(params).then(res => {
        console.log('饼图数据@@@####￥：：：', res)
        this.dataArray = []
        if (res.code === 1 && res.data) {
          res.data.some(itemObj => {
            let color = ''
            if (itemObj.payTypeName === '免费') {
              color = '#0091FF'
            } else if (itemObj.payTypeName === '直接付费') {
              color = '#FFBC00'
            } else if (itemObj.payTypeName === '间接付费') {
              color = '#FF1212'
            }
            const obj = {
              name: itemObj.payTypeName,
              value: itemObj.amount,
              chazhi: itemObj.amountDiffer,
              ratio: itemObj.ratio,
              amountLinkRatio: itemObj.amountLinkRatio,
              itemStyle: {
                color: color
              }
            }
            this.dataArray.push(obj)
          })
        }
        this.loadData()
      })
    },
    loadData() {
      this.$nextTick(() => {
        console.log('LLL:', document.getElementById('barChartData'))
        this.chartDom = echarts.init(document.getElementById('barChartData'))
        this.option = {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 1)', // 设置 tooltip 的背景色
            borderColor: '#fff', // 设置 tooltip 的边框颜色
            borderWidth: 1, // 设置 tooltip 的边框宽度
            textStyle: {
              color: '#666666' // 设置 tooltip 文本的颜色
            },
            extraCssText: 'box-shadow: 0 0 10px 0 #05050526;',
            formatter: (params) => {
              return '<div><p>付费占比</p><p>' + params.name + '：' + this.filterPrice(params.data.value) + '</p></div>'
            }
          },
          series: [
            {
              name: '付费占比',
              type: 'pie',
              radius: ['40%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: this.dataArray
            }
          ]
        }

        console.log('@@@@@@@:', this.chartDom)
        // this.option.series.data = this.dataArray
        /* [
          {
            name: '免费',
            value: 565,
            ratio: 25,
            itemStyle: {
              color: '#0091FF'
            }
          },
          {
            name: '直播付费',
            value: 787,
            ratio: 45,
            itemStyle: {
              color: '#FFBC00'
            }
          },
          {
            name: '间接付费',
            value: 258,
            ratio: 8,
            itemStyle: {
              color: '#FF1212'
            }
          }
        ] */
        this.chartDom.setOption(this.option)
        this.chartDom.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-bar-chart {
    width: 100%;
    padding: 15px;
    position: relative;
    .bar-span {
      flex-shrink: 0;
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      position: absolute;
      left: 15px;
      top: 15px;
    }
    .bar-chart-data {
      float: left;
      margin-left: 0px;
      width: 260px;
      height: 300px;
      margin-top: 40px;
    }
    .font-block {
      position: absolute;
      width: 200px;
      height: 230px;
      right: 10px;
      top: 90px;
      .font-block-row {
        float: left;
        margin-bottom: 40px;
        span {
          float: left;
          flex-shrink: 0;
          color: #000000;
          font-family: "Microsoft YaHei";
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          em {
            width: 20px;
            height: 4px;
            flex-shrink: 0;
            border-radius: 5px;
            background: #0091FF;
            margin-right: 8px;
            float: left;
            margin-top: 10px;
          }
          em.em-cls-1 {
            background: #FFBC00;
          }
          em.em-cls-2 {
            background: #FF1212;
          }
          i {
            float: left;
            font-style: normal;
          }
        }
        p {
          color: #666666;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-style: normal;
          float: left;
          padding-left: 20px;
          margin-top: 3px;
          span {
            color: #666666;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            i {
              float: left;
            }
            i.red-i {
              color: #D43030;
            }
            i.green-i {
              color: #43CF7C;
            }
            img {
              float: left;
              width: 16px;
              margin-right: 5px;
              margin-top: 3px;
            }
          }
        }
      }
    }
}
</style>
