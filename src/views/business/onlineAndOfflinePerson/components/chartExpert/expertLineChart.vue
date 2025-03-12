<template>
  <div class="wrapper-online-expert-line">
    <MTitle class="expert-mtitle" :title="title" />
    <div class="select-cls">
      <el-select v-if="darenArray.length > 0" v-model="activeDaren" size="small" placeholder="请选择" @change="changeActiveDaren()">
        <template #prefix>
          <img style="float: left; width: 20px; height: 20px; margin-right: 10px; margin-top: 5px; border-radius: 100%;" :src="activeImg" />
        </template>
        <el-option
          v-for="item in darenArray"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <img style="float: left; width: 20px; margin-top: 7px;margin-right: 10px; border-radius: 100%;" :src="item.img" />
          <span>{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
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
    <div v-show="huanbiFlag === '100'" id="lineChartCanvasForBottom" class="line-chart-canvas" />
    <div v-show="huanbiFlag === '0'" id="lineChartNoCanvasForBottom" class="line-chart-canvas" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { filterPrice } from '@/utils'
import {
  getGmvTrendData,
  getRevenueTrendData, // getOnlineTrendData,
  getOfflineTrendData,
  getRufundTrendData,
  getLiveTrendData,
  getVideoTrendData,
  getPrivateTrendData,
  getExpertLandscapeForPerson,
  getDailyPerformanceExpert
} from '@/api/business/onlineAndOffline.js'
export default {
  components: {
  },
  props: {
    chooseType: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      huanbiFlag: '100',
      option: {},
      chart: '',
      title: '',
      darenArray: [],
      activeDaren: '',
      activeImg: '',
      formExpertLineChart: {},
      nowShowArr: [],
      chartNohb: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
    // this.init()
  },
  methods: {
    filterPrice,
    loadData(arrObject) {
      let titleS = ''
      if (this.formExpertLineChart.bizTypeActive === 1) {
        if (this.formExpertLineChart.chooseType === 1) {
          titleS = '总营收'
        } else {
          titleS = '总业绩'
        }
      } else {
        titleS = this.formExpertLineChart.bizTypeActiveName
      }
      this.$nextTick(() => {
        this.chart = echarts.init(document.getElementById('lineChartCanvasForBottom'))
        this.chartNohb = echarts.init(document.getElementById('lineChartNoCanvasForBottom'))
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
            data: [titleS, '环比'],
            left: 'center',
            top: 'bottom',
            bottom: '60px',
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
              name: titleS,
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
    changeHuanbiFlag() {
      this.$nextTick(() => {
        this.chartNohb.resize()
      })
    },
    loadDarenData(item) {
      const params = {}
      params.bizType = item.bizTypeActive
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]
      if (this.chooseType === 1) {
        getExpertLandscapeForPerson(params).then(res => {
          if (res.code === 1 && res.data) {
            this.hanlderChannelData(res.data)
          }
        })
      } else if (this.chooseType === 2) {
        getDailyPerformanceExpert(params).then(res => {
          if (res.code === 1 && res.data) {
            this.hanlderChannelData(res.data)
          }
        })
      }
    },
    hanlderChannelData(arr) {
      this.darenArray = []
      arr.some(item => {
        if (item.expertName !== '总计') {
          const obj = {
            label: item.expertName,
            value: item.expertId,
            img: item.channelAppImg
          }
          this.darenArray.push(obj)
        }
      })
      if (this.darenArray.length > 0) {
        this.activeDaren = this.darenArray[0].value
        this.activeImg = this.darenArray[0].img
        this.loadTheLineData()
      }
    },
    changeActiveDaren() {
      this.darenArray.some(obj => {
        if (obj.value === this.activeDaren) {
          this.activeImg = obj.img
        }
      })
      this.loadTheLineData()
    },
    loadTheLineData() {
      const item = this.formExpertLineChart
      const params = {}
      params.bizType = item.bizTypeActive
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (this.activeDaren) {
        params.teacherIdList = []
        // params.teacherIdList.push(this.activeDaren)
        params.expertId = this.activeDaren
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
    init(item) {
      this.darenArray = []
      this.activeDaren = {}
      this.$nextTick(() => {
        if (this.chart) {
          this.chart.clear()
          this.chartNohb.clear()
        }
      })

      this.title = '达人'
      if (item.bizTypeActive === 1) {
        if (item.chooseType === 1) {
          this.title += '总营收'
        } else {
          this.title += '总业绩'
        }
      } else if (item.biz) {
        this.title += item.bizTypeActiveName
      }
      this.title += '趋势图'
      this.formExpertLineChart = item
      this.loadDarenData(item)
    },
    loadGmvData(params) {
      getGmvTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    loadOnlineTrendData(params) {
      getRevenueTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    loadOfflineTrendData(params) {
      getOfflineTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    getRufundTrendData(params) {
      getRufundTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    getLiveTrendData(params) {
      getLiveTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    getVideoTrendData(params) {
      getVideoTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    getPrivateTrendData(params) {
      getPrivateTrendData(params).then(res => {
        if (res.code === 1) {
          this.handleData(res.data)
        }
      })
    },
    handleData(arr) {
      this.nowShowArr = []
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
  .wrapper-online-expert-line {
    width: 100%;
    padding: 20px;
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

  .select-cls {
    margin-top: 25px;
  }
  .huanbi-cls {
    position: absolute;
    right: 20px;
    top: 15px;
    z-index: 999;
    span {
      margin-left: 10px;
      font-size: 12px;
      color: #9c9c9c;
    }
  }
  </style>
