<template>
  <div class="wrapper-online-line-chart">
    <span class="bar-span">{{ title }}趋势图（元）</span>
    <div class="huanbi-cls">
      <el-switch
        v-model="huanbiFlag"
        size="mini"
        active-value="100"
        inactive-value="0"
        @change="changeHuanbiFlag"
      />
      <span v-if="huanbiFlag === '100'">隐藏环比</span>
      <span v-else>显示环比</span>
    </div>
    <div v-show="huanbiFlag === '100'" id="lineChartCanvas" class="line-chart-canvas" />
    <div v-show="huanbiFlag === '0'" id="lineChartNoCanvas" class="line-chart-canvas" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { filterPrice } from '@/utils'
import {
  getGmvTrendData,
  getRevenueTrendData, // getOnlineTrendData,
  getOfflineTrendData,
  getRufundTrendData,
  getLiveTrendData,
  getVideoTrendData,
  getPrivateTrendData
} from '@/api/business/onlineAndOffline.js'
export default {
  components: {
  },
  data() {
    return {
      huanbiFlag: '100',
      option: {},
      chart: '',
      chartNohb: {},
      title: '',
      $_resizeHandler: null,
      nowShowArr: []
    }
  },
  provide() {
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  created() {
    // this.init()
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
    changeHuanbiFlag() {
      this.$nextTick(() => {
        this.chartNohb.resize()
      })
    },
    loadData(arrObject) {
      this.$nextTick(() => {
        this.chart = echarts.init(document.getElementById('lineChartCanvas'))
        this.chartNohb = echarts.init(document.getElementById('lineChartNoCanvas'))
        this.option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 1)', // 设置 tooltip 的背景色
            borderColor: '#fff', // 设置 tooltip 的边框颜色
            borderWidth: 1, // 设置 tooltip 的边框宽度
            textStyle: {
              color: '#666666' // 设置 tooltip 文本的颜色
            },
            extraCssText: 'box-shadow: 0 0 10px 0 #05050526;',
            formatter: (params) => {
              if (params.length >= 2) {
                let yuanString = this.nowShowArr.linkTrendItemVoList[params[0].dataIndex].time
                let dangqianString = this.nowShowArr.trendItemVoList[params[0].dataIndex].time
                if (yuanString.length > 11) {
                  yuanString = yuanString.substring(5, 16)
                  dangqianString = dangqianString.substring(5, 16)
                }
                let string = ''
                if (params[1].data > params[0].data) {
                  string = '<div style="padding: 12px 12px; border-radius: 10px;"><p>' + yuanString +
                    '</p><p><em style="float: left;margin-top: 8px; width: 8px;height: 8px; background: #0091FF;margin-right: 10px; border-radius: 100%;"></em>' +
                     params[1].seriesName + ': ' + filterPrice(params[1].data * 100) +
                      '</p><p style="margin-top: 10px;">' + dangqianString + '</p><p><em style="float: left;margin-top: 8px;width: 8px;height: 8px; background: #0C6FFF;margin-right: 10px; border-radius: 100%;"></em>' +
                  params[0].seriesName + ': ' +
                   filterPrice(params[0].data * 100) + '</p></div>'
                } else {
                  string = '<div style="padding: 12px 12px; border-radius: 10px;"><p >' + dangqianString + '</p><p><em style="float: left;margin-top: 8px;width: 8px;height: 8px; background: #0C6FFF;margin-right: 10px; border-radius: 100%;"></em>' +
                  params[0].seriesName + ': ' +
                   filterPrice(params[0].data * 100) + '</p><p style="margin-top: 10px;">' + yuanString +
                    '</p><p><em style="float: left;margin-top: 8px; width: 8px;height: 8px; background: #0091FF;margin-right: 10px; border-radius: 100%;"></em>' +
                     params[1].seriesName + ': ' + filterPrice(params[1].data * 100) +
                      '</p></div>'
                }

                return string
              } else {
                let dangqianString = this.nowShowArr.trendItemVoList[params[0].dataIndex].time
                if (dangqianString.length > 11) {
                  dangqianString = dangqianString.substring(5, 16)
                }
                const string = '<div style="padding: 12px 12px; border-radius: 10px;"><p >' + dangqianString + '</p><p><em style="float: left;margin-top: 8px;width: 8px;height: 8px; background: #0C6FFF;margin-right: 10px; border-radius: 100%;"></em>' +
                  params[0].seriesName + ': ' +
                   filterPrice(params[0].data * 100) + '</p></div>'
                return string
              }
            }
          },
          legend: {
            data: [this.title, '环比'],
            left: 'center',
            top: 'bottom',
            bottom: '40px',
            selectedMode: false
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            borderColor: '#E3E8EF',
            type: 'dashed',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: false
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: arrObject.xArray,
            axisLine: {
              lineStyle: {
                color: '#E0E6ED'
              }
            },
            axisLabel: { // 坐标轴标签
              color: '#828282' // 坐标轴标签颜色
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E3E8EF'],
                type: 'dashed'
              }
            },
            axisLine: { // 坐标轴线
              lineStyle: {
                color: '#E0E6ED' // 坐标轴线颜色
              }
            },
            axisLabel: { // 坐标轴标签
              color: '#828282' // 坐标轴标签颜色
            }
          },
          series: [
            {
              id: 'nohuanbi',
              name: this.title,
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#0091FF'
              },
              itemStyle: {
                color: '#0C6FFF'
              },
              data: arrObject.dataArray
            },
            {
              id: 'huanbi',
              name: '环比',
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#0C6FFF',
                type: 'dashed'
              },
              itemStyle: {
                color: '#85B7FF'
              },
              data: arrObject.ratioArray
            }
          ]
        }
        this.chart.setOption(this.option)
        this.chart.resize()
        this.option.series = [
          {
            id: 'nohuanbi',
            name: this.title,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#0091FF'
            },
            itemStyle: {
              color: '#0C6FFF'
            },
            data: arrObject.dataArray
          }
        ]
        this.chartNohb.setOption(this.option)
        this.chart.on('legendselectchanged', function (params) {
          // 阻止默认的行为
          return false
        })
      })
    },
    init(item) {
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
      const params = {}
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
      if (item.bizTypeActive === 3) {
        this.loadGmvData(params)
      }
      if (item.bizTypeActive === 1) {
        this.loadOnlineTrendData(params)
      }
      if (item.bizTypeActive === 9) {
        this.loadOfflineTrendData(params)
      }
      if (item.bizTypeActive === 2) {
        this.getRufundTrendData(params)
      }
      if (item.bizTypeActive === 4) {
        this.getLiveTrendData(params)
      }
      if (item.bizTypeActive === 5) {
        this.getVideoTrendData(params)
      }
      if (item.bizTypeActive === 12) {
        this.getPrivateTrendData(params)
      }
    },
    loadGmvData(params) {
      getGmvTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    getRevenueTrendData(params) {
      getRevenueTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    loadOnlineTrendData(params) {
      getRevenueTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    loadOfflineTrendData(params) {
      getOfflineTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    getRufundTrendData(params) {
      getRufundTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    getLiveTrendData(params) {
      getLiveTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    getVideoTrendData(params) {
      getVideoTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    getPrivateTrendData(params) {
      getPrivateTrendData(params).then(res => {
        if (res.code === 1 && res.data) {
          this.handleData(res.data)
        }
      })
    },
    handleData(arr) {
      this.nowShowArr = arr
      const arrObject = {
        xArray: [],
        dataArray: [],
        ratioArray: []
      }
      arr.trendItemVoList.some(item => {
        if (item.time && item.time.length > 13) {
          arrObject.xArray.push(item.time.substring(11, item.time.length - 3))
        } else {
          arrObject.xArray.push(item.time)
        }
        arrObject.dataArray.push(item.amount / 100)
      })
      arr.linkTrendItemVoList.some(obj => {
        arrObject.ratioArray.push(obj.amount / 100)
      })
      this.loadData(arrObject)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-line-chart {
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
    .line-chart-canvas {
        width: 100%;
        height: 360px;
    }
  }

  .toolTip {
    padding: 20px;
  }
  .huanbi-cls {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 9;
    span {
      margin-left: 10px;
      font-size: 12px;
      color: #9c9c9c;
    }
  }
  </style>
