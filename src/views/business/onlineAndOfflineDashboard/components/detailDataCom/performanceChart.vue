<template>
  <div class="wrapper-online-performance-chart">
    <div
      id="gmvTableDataPerformance"
      class="gmv-table-data-chart"
      :style="chartStyle"
      @wheel="handleWheel"
    />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { filterPrice } from '@/utils'
import {
  getRevenueExpertVertical, // 部门数据中达人 竖屏接口
  // getExpertLandscapeForPerson, // 部门数据中达人数据访问接口
  getDailyPerformanceExpert, // 部门数据中 业绩 达人数据
  getRevenueDeptVertical, // 营收部门的竖屏接口
  // getDeptLandscape, // 营收的部门数据
  getDailyPerfomanceDeptDataVertical, // 业绩的部门数据 竖屏
  // getDailyPerfomanceDeptData, // 业绩的部门数据
  getRevenueEmployeeVertical, // 营收的员工 竖屏数据
  // getEmployeeLandscape, // 营收的员工数据
  getPerformanceEmployeeSimpleDetailList // 查询业绩的员工业绩竖屏
  // getDailyPerfomanceDetailYj // 业绩的员工数据
} from '@/api/business/onlineAndOffline.js'
import redUp from '@/assets/image/business/icn_red_down.png'
import greenUp from '@/assets/image/business/icn_green_up.png'
import redDown from '@/assets/image/business/icn_red_up.png'
import greenDown from '@/assets/image/business/icn_green_down.png'
export default {
  components: {
  },
  data() {
    return {
      redUp,
      greenUp,
      redDown,
      greenDown,
      nowChoose: 0, // 营收还是业绩选项开关，决定调哪个接口
      $_resizeHandler: null,
      chart: {},
      option: {},
      xArray: [],
      yDataArray: [],
      deptArrayData: [],
      formDataChart: {},
      nowChartDataArray: []
    }
  },
  provide() {
  },
  computed: {
    chartStyle() {
      // 获取屏幕宽度
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      let width = screenWidth - 40 // 默认宽度为屏幕宽度减去边距

      // 当数据长度大于15时，设置宽度为数组长度的100倍
      if (this.nowChartDataArray.length > 15) {
        width = this.nowChartDataArray.length * 100
      }

      return {
        width: width + 'px',
        height: '360px'
      }
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
  created() {
    // this.loadData()
  },
  methods: {
    filterPrice,
    init(item, type, typePart) {
      this.formDataChart = item
      this.nowChoose = type
      const params = this.returnParams()
      if (type === 1) {
        if (item.employeeDeptId && typePart === 3) { // 默认查的员工数据
          this.loadEmplyoeeData(params) // 部门 营收数据 查员工的数据集
        } else if (item.employeeDeptId && typePart === 4) { // 去查达人数据
          this.getExpertLandscapeForPerson(params) // 部门 营收数据 查员工的数据集
        } else {
          this.loadRevenueData(params) // 企业 营收数据 查部门的数据集
        }
      } else if (type === 2) {
        if (item.employeeDeptId && typePart === 3) { // 查员工的数据
          this.getDailyPerfomanceDetailYj(params) // 部门 业绩数据 查员工的数据集
        } else if (item.employeeDeptId && typePart === 4) { // 查达人的数据
          this.getDailyPerformanceExpert(params) // 部门 业绩数据 查员工的数据集
        } else {
          this.loadYjData(params) // 部门 业绩数据 查部门的数据集
        }
      }
    },
    returnParams() {
      const item = this.formDataChart
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
      return params
    },

    handleWheel(event) {
      // 阻止默认的垂直滚动
      event.preventDefault()

      // 获取容器元素
      const container = document.querySelector('.wrapper-online-performance-chart')

      // 根据滚轮方向设置滚动距离
      // deltaY 为正值时向下滚动，为负值时向上滚动
      // 这里我们将垂直滚动转换为水平滚动
      container.scrollLeft += event.deltaY
    },
    getExpertLandscapeForPerson(params) {
      getRevenueExpertVertical(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderDataForIp(res.data)
        }
      })
    },
    getDailyPerformanceExpert(params) {
      getDailyPerformanceExpert(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderDataForIp(res.data)
        }
      })
    },
    getDailyPerfomanceDetailYj(params) {
      getPerformanceEmployeeSimpleDetailList(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderDataEmplyoee(res.data)
        }
      })
    },
    loadEmplyoeeData(params) {
      getRevenueEmployeeVertical(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderDataEmplyoee(res.data)
        }
      })
    },
    loadRevenueData(params) {
      getRevenueDeptVertical(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderData(res.data.dataList)
        }
      })
    },
    loadYjData(params) {
      getDailyPerfomanceDeptDataVertical(params).then(res => {
        if (res.code === 1 && res.data) {
          this.hanlderData(res.data)
        }
      })
    },
    hanlderDataForIp(arr) {
      this.nowChartDataArray = arr
      this.xArray = []
      this.yDataArray = []
      this.deptArrayData = arr
      if (this.nowChoose === 1) {
        arr.some(item => {
          if (item.expertName !== '总计') {
            this.xArray.push(item.expertName)
            this.yDataArray.push(item.amount / 100)
            /* if (this.formDataChart.bizTypeActive === 3) {
                this.yDataArray.push(item.gmv / 100)
              } else if (this.formDataChart.bizTypeActive === 2) {
                this.yDataArray.push(item.refundAmount / 100)
              } else {
                this.yDataArray.push(item.totalAmount / 100)
              } */
          }
        })
      } else if (this.nowChoose === 2) {
        arr.some(item => {
          if (item.expertName !== '总计') {
            this.xArray.push(item.expertName)
            this.yDataArray.push(item.gmv / 100)
          }
        })
      }

      this.loadData()
    },
    hanlderDataEmplyoee(arr) {
      this.nowChartDataArray = arr
      this.xArray = []
      this.yDataArray = []
      this.deptArrayData = arr
      if (this.nowChoose === 1) {
        arr.some(item => {
          if (item.employeeName !== '总计') {
            this.xArray.push(item.employeeName)
            this.yDataArray.push(item.amount / 100)
            /* if (this.formDataChart.bizTypeActive === 3) {
                this.yDataArray.push(item.gmv / 100)
              } else if (this.formDataChart.bizTypeActive === 2) {
                this.yDataArray.push(item.refundAmount / 100)
              } else {
                this.yDataArray.push(item.totalAmount / 100)
              } */
          }
        })
      } else if (this.nowChoose === 2) {
        arr.some(item => {
          if (item.employeeName !== '总计') {
            this.xArray.push(item.employeeName)
            this.yDataArray.push(item.amount / 100)
          }
        })
      }

      this.loadData()
    },
    hanlderData(arr) {
      this.nowChartDataArray = arr
      this.xArray = []
      this.yDataArray = []
      this.deptArrayData = arr
      if (this.nowChoose === 1) {
        arr.some(item => {
          if (item.deptName !== '总计') {
            this.xArray.push(item.deptName)
            this.yDataArray.push(item.amount / 100)
            /* if (this.formDataChart.bizTypeActive === 3) {
                this.yDataArray.push(item.gmv / 100)
              } else if (this.formDataChart.bizTypeActive === 2) {
                this.yDataArray.push(item.refundAmount / 100)
              } else {
                this.yDataArray.push(item.revenue / 100)
              }*/
          }
        })
      } else if (this.nowChoose === 2) {
        arr.some(item => {
          if (item.deptName !== '总计') {
            this.xArray.push(item.deptName)
            this.yDataArray.push(item.amount / 100)
          }
        })
      }

      this.loadData()
    },
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    calculateMarkArea(data, threshold) {
      var markAreaData = []
      for (var i = 0; i < data.length; i++) {
        if (data[i] > threshold) {
          markAreaData.push([{ xAxis: this.xArray[i] }, { xAxis: data[i] }])
        }
      }
      return markAreaData
    },
    loadData() {
      this.$nextTick(() => {
        this.chart = echarts.init(document.getElementById('gmvTableDataPerformance'))
        this.option = {
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
              const jine = this.nowChartDataArray[params[0].dataIndex].amount
              const danliang = this.nowChartDataArray[params[0].dataIndex].orderCount
              const mianfei = this.nowChartDataArray[params[0].dataIndex].freeAmount
              const zhijiefufei = this.nowChartDataArray[params[0].dataIndex].directAmount
              const jianjiefufei = this.nowChartDataArray[params[0].dataIndex].indirectAmount
              let zengzhangString = ''
              if (this.nowChartDataArray[params[0].dataIndex].amountLinkRatio > 1000) {
                zengzhangString = '1000%+'
              } else {
                zengzhangString = this.nowChartDataArray[params[0].dataIndex].amountLinkRatio + '%'
              }
              /*
                console.log('this.formDataChart:::', this.formDataChart)
                if (!this.formDataChart.employeeDeptId && this.nowChoose === 1) {
                  mianfei = this.nowChartDataArray[params[0].dataIndex].freeRevenue
                  zhijiefufei = this.nowChartDataArray[params[0].dataIndex].directAmount
                  jianjiefufei = this.nowChartDataArray[params[0].dataIndex].indirectAmount
                  if (this.formDataChart.bizTypeActive === 3) {
                    jine = this.nowChartDataArray[params[0].dataIndex].gmv
                    danliang = this.nowChartDataArray[params[0].dataIndex].revenueOrderCount + this.nowChartDataArray[params[0].dataIndex].refundOrderCount
                  } else if (this.formDataChart.bizTypeActive === 2) {
                    jine = this.nowChartDataArray[params[0].dataIndex].refundAmount
                    danliang = this.nowChartDataArray[params[0].dataIndex].refundOrderCount
                  } else {
                    jine = this.nowChartDataArray[params[0].dataIndex].revenue
                    danliang = this.nowChartDataArray[params[0].dataIndex].revenueOrderCount
                  }
                  // let imgSrc = ''
                  if (this.nowChartDataArray[params[0].dataIndex].amountLinkRatio > 1000) {
                    zengzhangString = '1000%+'
                  } else {
                    zengzhangString = this.nowChartDataArray[params[0].dataIndex].amountLinkRatio + '%'
                  }
                } else if (!this.formDataChart.employeeDeptId && this.nowChoose === 2) {
                  jine = this.nowChartDataArray[params[0].dataIndex].totalPerformance
                  danliang = this.nowChartDataArray[params[0].dataIndex].directOrderCount + this.nowChartDataArray[params[0].dataIndex].freePerformanceOrderCount + this.nowChartDataArray[params[0].dataIndex].indirectOrderCount
                  mianfei = this.nowChartDataArray[params[0].dataIndex].freePerformance
                  zhijiefufei = this.nowChartDataArray[params[0].dataIndex].directAmount
                  jianjiefufei = this.nowChartDataArray[params[0].dataIndex].indirectAmount
                  if (this.nowChartDataArray[params[0].dataIndex].linkRatio > 1000) {
                    zengzhangString = '1000%+'
                  } else {
                    zengzhangString = this.nowChartDataArray[params[0].dataIndex].linkRatio + '%'
                  }
                } else if (this.formDataChart.employeeDeptId) {
                  mianfei = this.nowChartDataArray[params[0].dataIndex].freeAmount
                  zhijiefufei = this.nowChartDataArray[params[0].dataIndex].directAmount
                  jianjiefufei = this.nowChartDataArray[params[0].dataIndex].indirectAmount
                  if (this.formDataChart.bizTypeActive === 3) {
                    jine = this.nowChartDataArray[params[0].dataIndex].gmv
                    danliang = this.nowChartDataArray[params[0].dataIndex].orderCount + this.nowChartDataArray[params[0].dataIndex].refundOrderCount
                  } else if (this.formDataChart.bizTypeActive === 2) {
                    jine = this.nowChartDataArray[params[0].dataIndex].refundAmount
                    danliang = this.nowChartDataArray[params[0].dataIndex].refundOrderCount
                  } else {
                    jine = this.nowChartDataArray[params[0].dataIndex].totalAmount
                    danliang = this.nowChartDataArray[params[0].dataIndex].orderCount
                  }
                  if (this.nowChartDataArray[params[0].dataIndex].growthPercent > 1000) {
                    zengzhangString = '1000%+'
                  } else {
                    zengzhangString = this.nowChartDataArray[params[0].dataIndex].growthPercent + '%'
                  }
                } */

              /* if (this.nowChartDataArray[params[0].dataIndex].amountLinkRatio > 0) {
                  if (this.formDataChart.bizTypeActive === 2) {
                    imgSrc = '<img style="width: 18px; height: 18px; border: 1px solid red; display: inline-block;" :src=' + this.redUp + '/>'
                  } else {
                    imgSrc = '<img :src=' + this.greenUp + '/>' // this.greenUp
                  }
                } else {
                  if (this.formDataChart.bizTypeActive === 2) {
                    imgSrc = '<img :src=' + this.greenDown + '/>' // this.greenDown
                  } else {
                    imgSrc = '<img :src=' + this.redDown + '/>'// this.redDown
                  }
                } */
              let returnString = ''
              if (this.formDataChart.offlineFlag === 0) {
                returnString = '<div style="padding: 5px 10px;"><p>' +
                  params[0].axisValueLabel + '</p><p>金额：' +
                     this.filterPrice(jine) + '</p><p>增长：' +
                        zengzhangString + '</p><p>免费：' +
                       this.filterPrice(mianfei) + '</p><p>直接付费：' +
                        this.filterPrice(zhijiefufei) + '</p><p>间接付费：' +
                          this.filterPrice(jianjiefufei) + '</p><p>总订单数：' +
                            danliang + '</p></div>'
              } else {
                returnString = '<div style="padding: 5px 10px;"><p>' +
                  params[0].axisValueLabel + '</p><p>金额：' +
                     this.filterPrice(jine) + '</p><p>增长：' +
                        zengzhangString + '</p><p>总订单数：' +
                            danliang + '</p></div>'
              }
              return returnString
            }
          },
          xAxis: {
            type: 'category',
            data: this.xArray,
            axisLabel: {
              interval: 0
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
            left: 10,
            right: 50,
            bottom: 20
          },
          series: [
            {
              data: this.yDataArray,
              type: 'bar',
              barWidth: '20px',
              color: '#0091FF',
              label: {
                show: true, // 显示数值
                position: 'top', // 在顶部显示
                formatter: function(params) {
                  return filterPrice(params.value * 100)
                }
              },
              markArea: {
                silent: false,
                itemStyle: {
                  color: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(0, 0, 0, 0)'
                },
                data: this.calculateMarkArea(this.yDataArray, 10)
              }
            }
          ]
        }
        this.chart.setOption(this.option)
        this.chart.off('click')
        this.chart.on('click', (params) => {
          if (params.componentType === 'markArea') {
            const deptObj = this.deptArrayData[params.event.target.dataIndex]
            if (this.formDataChart.employeeDeptId) {
              if (!deptObj.employeeUid) {
                return
              }
              this.$router.push({ path: '/business/onlineAndOfflinePerson', query: {
                employeeId: deptObj.employeeUid + '',
                employeeDeptId: this.formDataChart.employeeDeptId,
                employeeSecondDeptId: this.formDataChart.employeeSecondDeptId,
                timeActive: this.formDataChart.time.active,
                startTime: this.formDataChart.time.time[0],
                endTime: this.formDataChart.time.time[1],
                chooseType: this.formDataChart.chooseType,
                offlineFlag: this.formDataChart.offlineFlag
              } })
            } else {
              this.$emit('changeDeptMent', deptObj, this.nowChoose)
            }
          } else {
            const deptObj = this.deptArrayData[params.event.target.dataIndex]
            if (this.formDataChart.employeeDeptId) {
              if (!deptObj.employeeUid) {
                return
              }
              this.$router.push({ path: '/business/onlineAndOfflinePerson', query: {
                employeeId: deptObj.employeeUid + '',
                employeeDeptId: this.formDataChart.employeeDeptId,
                employeeSecondDeptId: this.formDataChart.employeeSecondDeptId,
                timeActive: this.formDataChart.time.active,
                startTime: this.formDataChart.time.time[0],
                endTime: this.formDataChart.time.time[1],
                chooseType: this.formDataChart.chooseType,
                offlineFlag: this.formDataChart.offlineFlag
              } })
            } else {
              this.$emit('changeDeptMent', deptObj, this.nowChoose)
            }
          }
        })
      })
    }
  }
}
</script>

    <style lang="scss" scoped>
    .wrapper-online-performance-chart{
      width: 100%;
      overflow-x: auto; // 启用水平滚动
      scroll-behavior: smooth; // 添加平滑滚动效果
      .gmv-table-data-chart {
          height: 360px;
      }
    }
    </style>
