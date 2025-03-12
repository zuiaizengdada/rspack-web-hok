<template>
  <div>
    <div class="pageWrap">
      <div class="titleHeader">
        <MTitle>
          <span>互动趋势图</span>
          <el-tooltip class="item" :content="'统计范围开播时间到直播结束，每5分钟统计一次 。'" placement="top">
            <img src="@/assets/image/product/icon.png" class="iconText" />
          </el-tooltip>
        </MTitle>
      </div>
      <div class="pageContent">
        <div class="navView">
          <div v-for="(item, index) in navList" :key="index" :class="{active: active === item.value}" class="navListLi" @click="tabChange(item.value)">{{ item.label }}</div>
        </div>
        <div :id="id" style="width: 100%; height: 336px" />
      </div>
    </div>

    <div class="pageWrap m-t-20">
      <div class="titleHeader">
        <MTitle>
          <span>待付款已成交对比</span>
        </MTitle>
      </div>
      <div class="pageContent">
        <div :id="id2" style="width: 100%; height: 336px" />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import echarts from 'echarts'
import { interactiveTrend } from '@/api/liveRoom/kanban.js'
import moment from 'moment'
export default {
  components: {},
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    playTime: {
      type: Number,
      default: 0
    },
    startTime: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      timeList: [],
      timeData: ['', ''],
      navList: [
        { value: 'onlineNum', label: '在线人数', unit: '人' },
        { value: 'interactiveNum', label: '互动人数', unit: '人' },
        { value: 'interactiveCount', label: '互动次数', unit: '次' },
        { value: 'avgInteractiveCount', label: '人均互动次数', unit: '次' },
        { value: 'addOneNum', label: '+1人数', unit: '人' },
        { value: 'flowerNum', label: '送花人数', unit: '人' }
        // { value: 'consultantsNum', label: '咨询人数', unit: '人' }
      ],
      pickerOptions: {
        disabledDate: (time) => {
          // 限制开播前
          if (this.startTime && this.detail.endTime) {
            return (
              time.getTime() < new Date(moment(this.startTime).format('YYYY-MM-DD 00:00:00')).getTime() || time.getTime() > new Date(moment(this.detail.endTime).add(48, 'hour').format('YYYY-MM-DD 23:59:59')).getTime()
            )
          } else if (this.startTime && !this.detail.endTime) {
            const startTime = moment(this.startTime).format('YYYY-MM-DD 00:00:00')
            const nowTime = moment(this.startTime).add(48, 'hour').format('YYYY-MM-DD HH:mm:ss')
            return (
              time.getTime() < new Date(startTime).getTime() || time.getTime() > new Date(nowTime).getTime()
            )
          } else {
            return false
          }
        }
      },
      id: this.getUuiD(22),
      id2: this.getUuiD(23),
      loading: false,
      active: 'onlineNum',
      chart: null,
      chart2: null,
      data: [],
      currentShowTime: '', // 当前展示的axisValue
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  watch: {
    playTime: {
      handler(time) {
        this.getKeyPoniter(time)
      },
      deep: true,
      immediate: true
    },
    currentShowTime: {
      handler(val) {
        console.log(val, 'currentShowTimecurrentShowTimecurrentShowTime')
        if (val && this.startTime) {
          const time = moment(val).diff(moment(this.startTime), 'second')
          this.$emit('showTimeChange', time)
          this.getKeyPoniter(time)
        }
      }
    }
  },
  mounted() {
    this.initChart()
    this.initChart2()
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
      this.chart2 && this.chart2.resize()
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    getKeyPoniter(time) {
      if (this.startTime) {
        // 根据开始时间 + 视频时长得出一个真实时间，然后取真实时间在坐标轴附近得一个时间
        const timeList = JSON.parse(JSON.stringify(this.timeList))
        // timeList.reverse()
        const obj = timeList.find(v => v >= moment(this.startTime).add(time, 's').format('YYYY-MM-DD HH:mm:ss'))
        if (obj) {
          this.checkChart(obj)
        } else {
          this.timeList.length > 0 && this.checkChart(this.timeList[0])
        }
      }
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    // 初始化echarts
    initChart() {
      const _this = this
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
      this.chart.on('click', (e) => {
        console.log(e, 'eeee')
        if (e.name) {
          _this.currentShowTime = e.name
        }
      })
    },
    setOptions({ xData = [], yData = [] }) {
      const _this = this
      const obj = _this.navList.find(e => e.value === _this.active)
      const name = obj ? obj.label : ''
      const option = {
        xAxis: {
          min: 0,
          type: 'category',
          data: xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333'
            }
          },
          axisTick: {
            alignWithLabel: true,
            show: true,
            lineStyle: {
              color: '#CBCFD3'
            }
          },
          axisPointer: {
            value: xData[0],
            snap: true,
            lineStyle: {
              color: '#7581BD',
              width: 2
            },
            label: {
              show: true,
              formatter: function (params) {
                return moment(params.value).format('HH:mm')
              },
              backgroundColor: '#7581BD'
            },
            handle: {
              show: true,
              size: 24,
              margin: 34,
              color: '#7581BD'
            }
          },
          axisLabel: {
            formatter: (value, index) => {
              return moment(value).format('HH:mm')
            }
          }
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
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
            console.log(params, '111')
            let str = `<span style="color: #fff;">${params[0].axisValue}</span>`
            params.map(v => {
              if (v.seriesName === 'noShow') {
                return
              } else {
                const obj = _this.navList.find(e => e.value === _this.active)
                const name = obj ? obj.label : ''
                const unit = obj ? obj.unit : ''
                str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${name}:  </span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${v.value}${unit}</span>
                  </div>
                `
              }
            })
            return str
          },
          triggerOn: 'click'
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        legend: {
          right: '50px',
          top: 0,
          data: [name]
        },
        grid: {
          left: '29px',
          right: '50px',
          top: '8%',
          bottom: '34px',
          containLabel: true,
          tooltip: {
            show: true,
            formatter(params) {
              let str = `<span style="color: #fff;">${params.name}</span>`
              if (_this.active === 'onlineNum') {
                str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">在线人数:  </span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${yData[params.dataIndex]}人</span>
                  </div>
                `
              } else {
                const obj = _this.navList.find(e => e.value === _this.active)
                const name = obj ? obj.label : ''
                const unit = obj ? obj.unit : ''
                str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${name}:  </span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${yData[params.dataIndex]}${unit}</span>
                  </div>
                `
              }
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
            // name: '总招生金额',
            name: name,
            data: yData,
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#0C6FFF'
          }
        ]
      }
      this.chart.setOption(option, true)
    },
    // 图标选中效果
    checkChart(val) {
      console.log('图标选中效果')
      this.hide()
      this.chart && this.chart.setOption({
        xAxis: {
          axisPointer: { value: val }
        }
      })
      this.chart2 && this.chart2.setOption({
        xAxis: {
          axisPointer: { value: val }
        }
      })
      const currentIndex = this.timeList.findIndex(v => v === val)
      currentIndex > -1 && this.show(currentIndex)
    },
    hide() {
      this.chart && this.chart.dispatchAction({ type: 'hideTip' })
      this.chart && this.chart.dispatchAction({
        type: 'updateAxisPointer',
        currTrigger: 'leave'
      })

      this.chart2 && this.chart2.dispatchAction({ type: 'hideTip' })
      this.chart2 && this.chart2.dispatchAction({
        type: 'updateAxisPointer',
        currTrigger: 'leave'
      })
    },
    show(currentIndex) {
      console.log('show', currentIndex)
      this.chart && this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: [0, 1, 2, 3] // serieIndex的索引值   可以触发多个
      })
      this.chart && this.chart.dispatchAction({
        type: 'highlight',
        // seriesIndex: [0],
        // dataIndex: currentIndex,
        name: this.timeList[currentIndex]
      })
      this.chart && this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: [0],
        dataIndex: currentIndex
      })

      this.chart2 && this.chart2.dispatchAction({
        type: 'downplay',
        seriesIndex: [0, 1, 2, 3] // serieIndex的索引值   可以触发多个
      })
      this.chart2 && this.chart2.dispatchAction({
        type: 'highlight',
        // seriesIndex: [0],
        // dataIndex: currentIndex,
        name: this.timeList[currentIndex]
      })
      this.chart2 && this.chart2.dispatchAction({
        type: 'showTip',
        seriesIndex: [0],
        dataIndex: currentIndex
      })
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    getData() {
      this.loading = true
      const data = {
        endTime: this.timeData && this.timeData[1] ? this.timeData[1] : '',
        startTime: this.timeData && this.timeData[0] ? this.timeData[0] : '',
        liveRoomId: this.$route.params.id
      }
      interactiveTrend(data).then(res => {
        this.timeList = res.data.reduce((pre, next) => {
          pre.push(moment(next.statDate).format('YYYY-MM-DD HH:mm:ss'))
          return pre
        }, [])
        this.data = res.data
        this.tabChange(this.active)
        this.tabChange2()
        this.loading = false
        this.$emit('dataupdata')
      }).catch(() => {
        this.loading = false
      })
    },
    init(startStr, durationInSeconds) {
      const startTime = moment(this.startTime).format('YYYY-MM-DD HH:mm:00')
      const { endTime } = this.generateTimestampsArray(startStr, durationInSeconds)
      this.timeData = [startTime, endTime]
      // this.timeList = timeList
      this.$nextTick(() => {
        this.getData()
      })
    },
    tabChange(item) {
      this.active = item
      const xData = []
      const yData = []
      this.timeList.map(v => {
        xData.push(moment(v).format('YYYY-MM-DD HH:mm:ss'))
        const obj = this.data.find(e => {
          return moment(e.statDate).format('YYYY-MM-DD HH:mm:ss') === v
        })
        if (obj) {
          yData.push(obj[this.active])
        } else {
          yData.push(0)
        }
      })
      console.log(xData, yData, 'xData, yData')
      this.setOptions({ xData, yData })
      this.playTime && this.getKeyPoniter(this.playTime)
    },
    // 根据开始时间和视频时长，生成时间段落
    generateTimestampsArray(startStr, durationInSeconds) {
      // 将输入的开始时间字符串转换为日期对象
      const startTime = new Date(moment(startStr).format('YYYY-MM-DD HH:mm:00'))

      // 计算出从开始时间到下一个5分钟整点的延迟毫秒数
      const next5MinutePoint = new Date(startTime)
      next5MinutePoint.setMinutes(
        startTime.getMinutes() + (5 - (startTime.getMinutes() % 5)),
        0,
        0
      )
      // 如果已经处于5分钟整点，则不需调整
      if (startTime.getMinutes() % 5 === 0) {
        next5MinutePoint.setMinutes(startTime.getMinutes())
      }
      // 视频结束时间
      const endTime = new Date(startTime.getTime() + durationInSeconds * 1000)
      const endTimenext5MinutePoint = new Date(endTime)
      endTimenext5MinutePoint.setMinutes(
        endTime.getMinutes() + (5 - (endTime.getMinutes() % 5)),
        0,
        0
      )
      const time1 = next5MinutePoint.getTime()
      const time2 = endTimenext5MinutePoint.getTime()
      const timeList = []
      for (let i = time1; i <= time2; i = i + 5 * 60 * 1000) {
        timeList.push(moment(i).format('YYYY-MM-DD HH:mm:ss'))
      }

      return {
        startTime: moment(next5MinutePoint).format('YYYY-MM-DD HH:mm:00'),
        endTime: moment(endTimenext5MinutePoint).format('YYYY-MM-DD HH:mm:00'),
        timeList
      }
    },
    // 获取已购买成交线和待付款线
    getLineByKey(key) {
      const xData = []
      const yData = []
      this.timeList.map(v => {
        xData.push(moment(v).format('HH:mm'))
        const obj = this.data.find(e => moment(e.statDate).format('YYYY-MM-DD HH:mm:ss') === v)
        if (obj) {
          yData.push(obj[key] || 0)
        } else {
          yData.push(0)
        }
      })

      return yData
    },
    // 根据时间获取对应的在线人数
    getOnlineNumber(time) {
      if (this.data.length === 0) {
        return 0
      }
      const data = JSON.parse(JSON.stringify(this.data))

      // data.sort((a, b) => {
      //   return a.statDate > b.statDate
      // })
      console.log(data, time, '根据时间获取对应的在线人数')
      const obj = data.find(v => time < v.time || time === v.time)
      console.log(obj, '取得哪个')
      return obj ? obj.onlineNum : 0
    },

    // 第二个图表-待付款已成交对比
    initChart2() {
      const _this = this
      this.chart2 = echarts.init(document.getElementById(this.id2), 'macarons')
      this.chart.on('click', (e) => {
        if (e.name) {
          _this.currentShowTime = e.name
        }
      })
    },
    setOptions2({ xData = [] }) {
      const _this = this
      let doneOrderCountArr = []
      let waitingOrderCountArr = []
      doneOrderCountArr = this.getLineByKey('doneOrderCount')
      waitingOrderCountArr = this.getLineByKey('waitingOrderCount')
      const option = {
        xAxis: {
          min: 0,
          type: 'category',
          data: xData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333'
            }
          },
          axisTick: {
            alignWithLabel: true,
            show: true,
            lineStyle: {
              color: '#CBCFD3'
            }
          },
          axisPointer: {
            value: xData[0],
            snap: true,
            lineStyle: {
              color: '#7581BD',
              width: 2
            },
            label: {
              show: true,
              formatter: function (params) {
                return moment(params.value).format('HH:mm')
              },
              backgroundColor: '#7581BD'
            },
            handle: {
              show: true,
              size: 24,
              margin: 34,
              color: '#7581BD'
            }
          },
          axisLabel: {
            formatter: (value, index) => {
              return moment(value).format('HH:mm')
            }
          }
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
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
              if (v.seriesName === '已成交') {
                str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">已成交${v.value}单</span>
                  </div>
                `
              } else if (v.seriesName === '待付款') {
                str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">待付款${v.value}单</span>
                  </div>
                `
              }
            })
            return str
          },
          triggerOn: 'click'
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        legend: {
          right: '50px',
          top: 0,
          data: ['已成交', '待付款']
        },
        grid: {
          left: '29px',
          right: '50px',
          top: '8%',
          bottom: '34px',
          containLabel: true,
          tooltip: {
            show: true,
            formatter(params) {
              let str = `<span style="color: #fff;">${params.name}</span>`
              str += `
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">已成交</span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${doneOrderCountArr[params.dataIndex] || 0}单</span>
                  </div>
                  <div>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">待付款</span>
                    <span style="color: #fff;font-size: 12px;line-height: 17px;">${waitingOrderCountArr[params.dataIndex] || 0}单</span>
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
            data: doneOrderCountArr,
            type: 'line',
            name: '已成交',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#ee6666'
          },
          {
            data: waitingOrderCountArr,
            type: 'line',
            name: '待付款',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#73c0de'
          }
        ]
      }
      this.chart2.setOption(option, true)
    },
    tabChange2() {
      const xData = []
      this.timeList.map(v => {
        xData.push(moment(v).format('YYYY-MM-DD HH:mm:ss'))
      })
      this.setOptions2({ xData })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 58px;
    background: #F9FBFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconText {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
    .tips {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
  .pageContent {
    padding: 16px 0;
    background: #fff;
    .navView {
      border-radius: 4px;
      margin-left: 34px;
      background: #F3F3F3;
      overflow: hidden;
      display: inline-block;
      height: 36px;
      padding: 2px;
      .navListLi {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        cursor: pointer;
        border-radius: 2px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &:hover {
          background: #fff;
          // background: red;
          // opacity: 0.8;
        }
      }
      .navListLi + .navListLi {
        margin-left: 2px;
      }
      .active {
        background: #fff;
      }
    }
  }
}
::v-deep {
  .MTitle{
    .title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
