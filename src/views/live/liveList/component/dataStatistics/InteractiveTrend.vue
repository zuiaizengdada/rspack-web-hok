<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle>
        <span>互动趋势图</span>
        <el-tooltip class="item" :content="'统计范围开播时间到直播结束，每5分钟统计一次 。'" placement="top">
          <img src="@/assets/image/product/icon.png" class="iconText" />
        </el-tooltip>
      </MTitle>
      <div class="p-r-20 tips">时间段
        <el-date-picker
          v-model="timeData"
          style="width: 320px;margin-left: 8px"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:00"
          size="small"
          type="datetimerange"
          popper-class="z_index_max"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
        <el-button type="primary" size="small" class="m-l-20" style="margin-right: 24px" @click="getData">查询</el-button>
      </div>
    </div>
    <div class="pageContent">
      <div class="navView">
        <div v-for="(item, index) in navList" :key="index" :class="{active: active === item.value}" class="navListLi" @click="tabChange(item.value)">{{ item.label }}</div>
      </div>

      <div :id="id" style="width: 100%; height: 336px" />
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
    }
  },
  data() {
    return {
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
          if (this.detail.startTime && this.detail.endTime) {
            return (
              time.getTime() < new Date(moment(this.detail.startTime).format('YYYY-MM-DD 00:00:00')).getTime() || time.getTime() > new Date(moment(this.detail.endTime).add(48, 'hour').format('YYYY-MM-DD 23:59:59')).getTime()
            )
          } else if (this.detail.startTime && !this.detail.endTime) {
            const startTime = moment(this.detail.startTime).format('YYYY-MM-DD 00:00:00')
            const nowTime = moment(this.detail.startTime).add(48, 'hour').format('YYYY-MM-DD HH:mm:ss')
            return (
              time.getTime() < new Date(startTime).getTime() || time.getTime() > new Date(nowTime).getTime()
            )
          } else {
            return false
          }
        }
      },
      id: this.getUuiD(22),
      loading: false,
      active: 'onlineNum',
      chart: null,
      data: [],
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  watch: {
    detail: {
      handler: function(val) {
        if (val && val.startTime && val.endTime) {
          this.timeData = [moment(val.startTime).format('YYYY-MM-DD HH:mm:00'), moment(val.endTime).format('YYYY-MM-DD HH:mm:00')]
        } else if (val) {
          const startTime = moment(val.startTime).format('YYYY-MM-DD HH:mm:00')
          const nowTime = moment(val.startTime).add(48, 'hour').format('YYYY-MM-DD HH:mm:00')
          this.timeData = [startTime, nowTime]
        }
        console.log(this.timeData, 'this.timeData')
        this.$nextTick(() => {
          this.getData()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initChart()
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
    // this.$nextTick(() => {
    //   // this.getData()
    // })
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    // 初始化echarts
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
    },
    setOptions({ xData = [], yData = [] }) {
      console.log(xData, yData, ' = [] = []')
      const _this = this
      // console.log(xData, yData, '1231239999')
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
            console.log(params, 'params')
            if (!params || params.length === 0) {
              return ''
            }
            let str = `<span style="color: #fff;">${params[0].axisValue}</span>`
            params.map(v => {
              const obj = _this.navList.find(e => e.value === _this.active)
              console.log(obj, 'obj')
              const name = obj ? obj.label : ''
              const unit = obj ? obj.unit : ''
              str += `
                <span style="margin-left: 13px;">
                  <span style="color: #fff;font-size: 12px;line-height: 17px;">${name}:  </span>
                  <span style="color: #fff;font-size: 12px;line-height: 17px;">${v.value}${unit}</span>
                </span>
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
          axisTick: {
            show: false
          },
          minInterval: 1
        },
        grid: {
          left: '29px',
          right: '50px',
          top: '5%',
          bottom: '34px',
          containLabel: true,
          tooltip: {
            show: true,
            formatter: '{b}: {c}<br />{b1}: {c1}',
            backgroundColor: 'rgba(255,255,255,0.9)',
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
            data: yData,
            type: 'line',
            seriesLabel: {
              show: true
            },
            smooth: true,
            color: '#0C6FFF'
          }
        ],
        dataZoom: {
          bottom: '0px',
          realtime: true,
          type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
          height: 10, // 表示滚动条的高度，也就是粗细
          startValue: 0, // 从头开始。
          endValue: 10 // 最多10个
        }
      }
      if (xData.length > 10) {
        option.dataZoom.show = true
        option.xAxis.max = ''
      } else {
        option.xAxis.max = xData.length - 1
        option.dataZoom.show = false
      }
      this.chart.setOption(option, true)
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
        this.data = res.data
        this.tabChange(this.active)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    tabChange(item) {
      this.active = item
      const xData = []
      const yData = []
      this.data.map(v => {
        xData.push(moment(v.statDate).format('HH:mm'))
        yData.push(v[this.active])
      })
      // console.log(xData, yData, '123123')
      this.setOptions({ xData, yData })
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
