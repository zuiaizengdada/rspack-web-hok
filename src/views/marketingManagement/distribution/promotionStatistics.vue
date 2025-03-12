<template>
  <div class="promotionStatistics">
    <div class="dataOverView">
      <DataOverView />
    </div>
    <div class="table_wrap">
      <div class="table_wrap_title">推广统计</div>
      <div class="table_wrap_search_time">
        <span
          v-for="(item, index) in timeType"
          :key="index"
          :class="{active: item.value === timeTypeChangeValue}"
          class="m-r-10 time_view"
          @click="changeTimeType(item)"
        >
          {{ item.label }}
        </span>
        <!-- <span class="m-r-10 time_view">本周</span>
        <span class="m-r-10 time_view">本月</span>
        <span class="m-r-10 time_view active">全年</span> -->
        <el-date-picker
          v-if="timeTypeChangeValue === 1"
          key="daterange"
          v-model="search"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :picker-options="expireTimeOption"
        />
        <el-date-picker
          v-if="timeTypeChangeValue === 2"
          key="daterange"
          v-model="search"
          type="daterange"

          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :picker-options="expireTimeOption"
        />
        <!-- <div v-if="timeTypeChangeValue === 2">
          <el-date-picker
            key="week1"
            v-model="search[0]"
            unlink-panels
            type="week"
            format="yyyy 第 WW 周"
            value-format="yyyy-MM-dd"
            prefix-icon="calendar-icon"
            size="small"
            placeholder="选择周"
            align="center"
            :picker-options="expireTimeOption"
          />
          <el-date-picker
            key="week2"
            v-model="search[1]"
            unlink-panels
            type="week"
            placeholder="选择周"
            format="yyyy 第 WW 周"
            value-format="yyyy-MM-dd"
            prefix-icon="calendar-icon"
            size="small"
            align="center"
            :picker-options="expireTimeOption"
          />
        </div> -->
        <el-date-picker
          v-if="timeTypeChangeValue === 3"
          key="monthrange"
          v-model="search"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          :picker-options="expireTimeOption"
        />
        <el-button type="primary" class="m-l-10" size="small" @click="searchFn">搜索</el-button>
      </div>
      <div class="table_wrap_charts">
        <div id="table_wrap_charts" />
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/utils'
import DataOverView from './dataOverview.vue'
import echarts from 'echarts'
import {
  userPropterStatisics
} from '@/api/promotion/promoter'
import { debounce } from '@/utils'
require('echarts/theme/macarons') // echarts theme
export default {
  name: 'PromotionStatistics',
  components: {
    DataOverView
  },
  data() {
    return {
      search: ['', ''],
      chartData: {
        expectedData: [],
        actualData: [],
        time: []
      }, // 图标数据
      timeType: [
        { value: 1, label: '自然日', time: ['', ''] },
        { value: 2, label: '自然周', time: ['', ''] },
        { value: 3, label: '自然月', time: ['', ''] }
      ],
      pickerOptions: {
        firstDayOfWeek: 1
      },
      timeTypeChangeValue: 3,
      expireTimeOption: {
        disabledDate: this.disabledGetTime
      },
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  watch: {
    timeTypeChangeValue: {
      handler(val) {
        switch (val) {
          case 1:
            // 自然日默认30天内
            // eslint-disable-next-line no-case-declarations
            const time = new Date().getTime() - 30 * 24 * 3600000
            // eslint-disable-next-line no-case-declarations
            const newDay = DateFormat(new Date(time), 'yyyy-MM-dd')
            this.search = [newDay, DateFormat(new Date(), 'yyyy-MM-dd')]
            this.userPropterStatisics()
            break
          case 2:
            // 自然周默认8周内
            // eslint-disable-next-line no-case-declarations
            const time2 = new Date().getTime() - 8 * 7 * 24 * 3600000
            // eslint-disable-next-line no-case-declarations
            const newDay2 = DateFormat(new Date(time2), 'yyyy-MM-dd')
            this.search = [newDay2, DateFormat(new Date(), 'yyyy-MM-dd')]
            this.userPropterStatisics()
            // this.userPropterStatisics()
            break
          case 3:
            // eslint-disable-next-line no-case-declarations
            const newYear = new Date().getFullYear()
            // eslint-disable-next-line no-case-declarations
            const newMonth = new Date().getMonth() + 1
            // 自然月默认12个月内
            this.search = [`${newYear - 1}-${newMonth < 10 ? '0' : ''}${newMonth}`, `${newYear}-${newMonth < 10 ? '0' : ''}${newMonth}`]
            this.userPropterStatisics()
            break
        }
      },
      immediate: true,
      deep: true
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
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('table_wrap_charts'), 'macarons')
      // this.userPropterStatisics()
    },
    setOptions({ expectedData, actualData, time } = {}) {
      this.chart.setOption({
        xAxis: {
          data: time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        axisLabel: {
          // x轴文字的配置
          show: true,
          interval: 0, // 使x轴文字显示全
          textStyle: {
            color: 'rgba(219, 225, 255, 1)'
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['推广员', '用户数']
        },
        series: [{
          name: '推广员', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '用户数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    changeTimeType(item) {
      this.timeTypeChangeValue = item.value
      this.search = ''
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },
    // 获取推广统计
    userPropterStatisics() {
      if (!this.search) {
        return this.$message.error('请选择时间段')
      }
      const params = {
        queryType: this.timeTypeChangeValue,
        startTime: this.search ? this.search[0] : '',
        endTime: this.search ? this.search[1] : ''
      }
      userPropterStatisics(params).then(res => {
        console.log(res)
        this.chartData = {
          expectedData: res.data.promoterNum,
          actualData: res.data.customerNum,
          time: res.data.time
        }
        this.setOptions(this.chartData)
      })
    },
    searchFn() {
      console.log(this.search, this.timeType)
      this.userPropterStatisics()
    },
    disabledGetTime(date) {
      if (this.timeTypeChangeValue === 3) {
        const timeyear = date.getFullYear()
        const timemonth = date.getMonth() + 1
        const newYear = new Date().getFullYear()
        const newMonth = new Date().getMonth() + 1
        return timeyear > newYear || (timeyear < newYear - 1) || (timeyear === newYear && timemonth > newMonth) || (timeyear === newYear - 1 && timemonth < newMonth)
      } else if (this.timeTypeChangeValue === 2) {
        return date.getTime() < Date.now() - 8 * 7 * 24 * 60 * 60 * 1000 || date.getTime() > Date.now()
      } else {
        return date.getTime() < (Date.now() - 30 * 24 * 60 * 60 * 1000) || date.getTime() > Date.now()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.promotionStatistics {
  height: 100%;
  min-width: 1000px;
  .dataOverView {
    height: 200px;
    background: #fff;
  }
  .table_wrap {
    margin-top: 10px;
    height: calc(100% - 210px);
    background: #fff;
    padding: 10px;
    .table_wrap_title {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 0.9);
      line-height: 28px;
      position: relative;
      padding-left: 10px;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 5px;
        width: 4px;
        height: 20px;
        background: #0C6FFF;
        border-radius: 3px;
      }
    }
    .table_wrap_search_time {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .time_view {
        font-size: 14px;
        color: #999999;
        height: 24px;
        line-height: 24px;
        padding: 0px 8px 0px 8px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background-color: #F5F9FF;
          border-radius: 4px;
        }
      }
      .active {
        background: #108ee9!important;
        color: #fff!important;
        border-radius: 4px;
      }
    }
    .table_wrap_charts {
      margin-top: 10px;
      height: calc(100% - 82px);
      padding: 20px;
      box-sizing: border-box;
      #table_wrap_charts {
        width: 100%;
        height: 100%;
      }
      // background: pink;
    }
  }
}
</style>
