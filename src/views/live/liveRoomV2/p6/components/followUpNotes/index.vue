<template>
  <div v-loading="loading" class="followUpNotes">
    <div :id="`followUpNotes_${id}`" style="width: 100%; height: 100%;" />
  </div>
</template>

<script>
import { debounce } from '@/utils'
import echarts from 'echarts'
import moment from 'moment'
import imgSrc from './markPoint.svg'
import Dialog from '@/views/live/liveRoomV2/Dialog'
import markPointDetail from './markPointDetail.vue'
import { mapState } from 'vuex'
import { followClassRecordList } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      id: this.getUuiD(22),
      chart: null,
      // 时间列表
      xData: [],
      // 在线人数
      y1Data: [],
      // 离线人数
      y2Data: [],
      // 成交人数
      y3Data: [],
      // 打点数据(全是0就行)
      yData: [],
      // 标记数据
      markPoint: [],
      list: [],
      liveRoomId: this.$route.params.id,
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    console.log(this.y1Data, this.yData)
    this.getList()
    this.initChart()
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()

    // this.setOptions({ xData: this.xData, yData: this.y1Data })
    this.chart.off('click')
    this.chart.getZr().on('click', (params) => {
      var pointInPixel = [params.offsetX, params.offsetY]
      // 判断点击位置是否在网格区域内
      if (this.chart.containPixel('grid', pointInPixel)) {
        // 将像素坐标转换为 ECharts 坐标系上的数据值
        var pointInGrid = this.chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)

        // 获取数据坐标的 x 值
        var xValue = pointInGrid[0]
        console.log('333', this.list[xValue])
        const item = this.list[xValue]
        if (item.markList.length === 0) {
          console.log(xValue, '打标记', this.list[xValue], this.liveRoomDetail)
          Dialog.open({
            type: 'FollowUpNotesTips',
            ifEdit: false,
            liveRoomDetail: this.liveRoomDetail,
            followClassRecordId: this.list[xValue].id,
            visible: false,
            success: (res) => {
              this.xData = []
              this.y1Data = []
              this.y2Data = []
              this.y3Data = []
              this.yData = []
              this.markPoint = []
              this.list[xValue].markList = [{ ...res }]
              this.list.map((v, index) => {
                this.xData.push(moment(v.statDate).format('yyyy-MM-DD HH:mm'))
                this.y1Data.push(v.onlineNum)
                this.y2Data.push(v.leaveNum)
                this.y3Data.push(v.dealPeopleNum)
                this.yData.push(0)
                if (v.markList.length > 0) {
                  this.markPoint.push({
                    symbol: 'image://' + imgSrc,
                    name: 'Mark',
                    symbolSize: 30,
                    index: index,
                    coord: [moment(v.statDate).format('yyyy-MM-DD HH:mm'), 0]
                  })
                }
              })
              // this.setOptions({ xData: this.xData, yData: this.y1Data })
              this.chart.setOption({ series: [
                {
                  name: '在线人数',
                  data: this.y1Data,
                  type: 'line',
                  seriesLabel: {
                    show: true
                  },
                  smooth: true,
                  color: '#03BE63'
                },
                {
                  name: '离线人数',
                  data: this.y2Data,
                  type: 'line',
                  seriesLabel: {
                    show: true
                  },
                  smooth: true,
                  color: '#FF902F'
                },
                {
                  name: '成交人数',
                  data: this.y3Data,
                  type: 'bar',
                  seriesLabel: {
                    show: true
                  },
                  barMaxWidth: 30,
                  smooth: true,
                  color: '#6E92E4'
                },
                {
                  name: 'noShow',
                  type: 'line',
                  data: this.yData,
                  color: '#E0E6ED',
                  lineStyle: {
                    color: 'rgba(0,0,0,0)'
                  },
                  symbol: 'circle',
                  symbolSize: 10,
                  animation: false,
                  markPoint: {
                    symbol: 'circle',
                    data: this.markPoint,
                    tooltip: {
                      formatter: function (param) {
                        return param.name + '<br>' + (param.data.coord || '')
                      }
                    }
                  }
                }
              ] })
            }
          })
        } else {
          try {
            console.log('点击了第', xValue, '个标记点', params, this.list, params.offsetX)
            this.$contextmenu.open({
              left: params.offsetX + 367 > document.body.clientWidth ? params.offsetX - 367 : params.offsetX,
              position: 'center',
              markHeight: 234,
              visible: true,
              bodyClick: false,
              option: {
                liveRoomId: this.$route.params.id,
                followClassMarkId: this.list[xValue].markList[0].id,
                liveRoomDetail: this.liveRoomDetail,
                videoTime: this.list[xValue].statDate,
                onEdit: () => {
                  return new Promise((resolve, reject) => {
                    Dialog.open({
                      type: 'FollowUpNotesTips',
                      ifEdit: true,
                      form: {
                        ...this.list[xValue].markList[0]
                      },
                      liveRoomDetail: this.liveRoomDetail,
                      visible: false,
                      success: (res) => {
                        this.list[xValue].markList[0] = res
                        resolve()
                      }
                    })
                  })
                },
                onDel: () => {
                  console.log('点击删除', this.list[xValue])
                  this.list[xValue].markList = []
                  this.markPoint = []

                  this.list.map((v, index) => {
                    if (v.markList.length > 0) {
                      this.markPoint.push({
                        symbol: 'image://' + imgSrc,
                        name: 'Mark',
                        symbolSize: 30,
                        index: index,
                        coord: [moment(v.statDate).format('yyyy-MM-DD HH:mm'), 0]
                      })
                    }
                  })
                  // this.setOptions({ xData: this.xData, yData: this.y1Data })
                  this.chart.setOption({ series: [
                    {
                      name: '在线人数',
                      data: this.y1Data,
                      type: 'line',
                      seriesLabel: {
                        show: true
                      },
                      smooth: true,
                      color: '#03BE63'
                    },
                    {
                      name: '离线人数',
                      data: this.y2Data,
                      type: 'line',
                      seriesLabel: {
                        show: true
                      },
                      smooth: true,
                      color: '#FF902F'
                    },
                    {
                      name: '成交人数',
                      data: this.y3Data,
                      type: 'bar',
                      seriesLabel: {
                        show: true
                      },
                      barMaxWidth: 30,
                      smooth: true,
                      color: '#6E92E4'
                    },
                    {
                      name: 'noShow',
                      type: 'line',
                      data: this.yData,
                      color: '#E0E6ED',
                      lineStyle: {
                        color: 'rgba(0,0,0,0)'
                      },
                      symbol: 'circle',
                      symbolSize: 10,
                      animation: false,
                      markPoint: {
                        symbol: 'circle',
                        data: this.markPoint,
                        tooltip: {
                          formatter: function (param) {
                            return param.name + '<br>' + (param.data.coord || '')
                          }
                        }
                      }
                    }
                  ] })
                  this.$contextmenu.close()
                }
              },
              viewComponent: markPointDetail
            })
          } catch (err) {
            console.log(err, 'err')
          }
        }
      }
    })
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
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
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(`followUpNotes_${this.id}`), 'macarons')
    },
    setOptions({ xData = [], yData = [] }) {
      const _this = this
      const option = {
        xAxis: {
          min: 0,
          type: 'category',
          data: xData,
          slient: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#E0E6ED'
            }
          },
          axisTick: {
            alignWithLabel: true,
            show: true,
            lineStyle: {
              color: '#CBCFD3'
            }
          },
          axisLabel: {
            margin: 20,
            color: '#828282',
            formatter: (value, index) => {
              return moment(value).format('HH:mm')
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#00A3FF',
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter(params) {
            if (!params || params.length === 0) {
              return ''
            }
            _this.currentShowTime = params[0].axisValue
            let str = `<span style="color: #fff;">${params[0].axisValue}</span>`
            params.map(v => {
              if (v.seriesName === 'noShow') return
              str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${v.seriesName}:  </span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${v.value}</span>
                  </div>
                `
            })
            return str
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        legend: {
          right: 'center',
          bottom: 0,
          data: ['在线人数', '离线人数', '成交人数']
        },
        grid: {
          left: '29px',
          right: '50px',
          top: '8%',
          bottom: '59px',
          containLabel: true,
          tooltip: {
            show: true,
            formatter(params) {
              let str = `<span style="color: #fff;">${params.name}</span>`
              str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">在线人数:  </span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${this.y1Data[params.dataIndex]}人</span>
                  </div>
                `
              str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">离线人数</span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${_this.y2Data[params.dataIndex] || 0}单</span>
                  </div>
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">成交人数</span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${_this.y3Data[params.dataIndex] || 0}单</span>
                  </div>
                `
              return str
            },
            // formatter: '123456',
            backgroundColor: '#00A3FF',
            padding: 10,
            textStyle: {
              color: '#777',
              lineHeight: 20,
              fontSize: 12
            },
            borderColor: '#75A0F9',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dotted'
              }
            }
          }
        },
        series: [
          {
            name: '在线人数',
            data: _this.y1Data,
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#03BE63'
          },
          {
            name: '离线人数',
            data: _this.y2Data,
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#FF902F'
          },
          {
            name: '成交人数',
            data: _this.y3Data,
            type: 'bar',
            seriesLabel: {
              show: true
            },
            barMaxWidth: 30,
            smooth: true,
            color: '#6E92E4'
          },
          {
            name: 'noShow',
            type: 'line',
            data: _this.yData,
            color: '#E0E6ED',
            lineStyle: {
              color: 'rgba(0,0,0,0)'
            },
            symbol: 'circle',
            symbolSize: 10,
            animation: false,
            markPoint: {
              symbol: 'circle',
              // data: [
              //   {
              //     symbol: 'image://' + imgSrc,
              //     name: 'Mark',
              //     symbolSize: 30,
              //     coord: ['2024-09-25 07:30', 0]
              //   },
              //   {
              //     symbol: 'image://' + imgSrc,
              //     name: 'Mark',
              //     symbolSize: 30,
              //     coord: ['2024-09-25 07:35', 0]
              //   }
              // ],
              data: this.markPoint,
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '')
                }
              }
            }
          }
        ],
        dataZoom: {
          bottom: '30px',
          realtime: true,
          type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
          height: 10, // 表示滚动条的高度，也就是粗细
          startValue: 0, // 从头开始。
          endValue: 20 // 最多10个
        }
      }
      if (xData.length > 20) {
        option.dataZoom.show = true
        option.xAxis.max = ''
      } else {
        option.xAxis.max = xData.length - 1
        option.dataZoom.show = false
      }
      this.chart.setOption(option, true)
    },
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      this.xData = []
      this.y1Data = []
      this.y2Data = []
      this.y3Data = []
      this.yData = []
      this.markPoint = []
      followClassRecordList(data).then(res => {
        console.log(res, '获取跟课记录详情数据', this.liveRoomDetail)
        res.data.map((v, index) => {
          this.xData.push(moment(v.statDate).format('yyyy-MM-DD HH:mm'))
          this.y1Data.push(v.onlineNum)
          this.y2Data.push(v.leaveNum)
          this.y3Data.push(v.dealPeopleNum)
          this.yData.push(0)
          if (v.markList.length > 0) {
            this.markPoint.push({
              symbol: 'image://' + imgSrc,
              name: 'Mark',
              symbolSize: 30,
              index: index,
              coord: [moment(v.statDate).format('yyyy-MM-DD HH:mm'), 0]
            })
          }
        })
        this.list = res.data

        this.setOptions({ xData: this.xData, yData: this.y1Data })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.followUpNotes {
  height: 100%;
  padding-bottom: 40px;
}
</style>
