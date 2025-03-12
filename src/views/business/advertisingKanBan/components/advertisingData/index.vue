<template>
  <div class="warpper">
    <dataOverview
      :search="search"
      :search-active="searchActive"
      :title="'广告数据'"
      @submit="query"
    />
    <div class="row">
      <dimension
        ref="dimensionRef"
        style="margin-right: 20px"
        @onSearch="query"
      />
      <target
        ref="targetRef"
        style="margin-right: 20px"
        @targetValue="targetValue"
      />
      <div>
        <el-button type="primary" size="small" @click="query"> 查询 </el-button>
        <el-button size="small" @click="onClear">重置</el-button>
      </div>
    </div>
    <div class="eEcharts">
      <div class="filter-e">
        <div>
          <el-checkbox v-model="checked" @change="selectHB">环比</el-checkbox>
        </div>
        <div class="total">
          <span class="f-l">总计：</span><span class="f-v">{{ numberFormat(total, targetKey) }} </span>
          <span v-if="checked">
            <span class="f-l">环比：</span><span class="f-v">{{ numberFormat(totalQOQ, targetKey) }}</span>
            <i :class="fillClassString(totalHB)" />
            <span
              class="f-v"
              style="margin-left: 2px"
            >{{ Math.abs(totalHB) }}%</span>
          </span>
        </div>
      </div>
      <div ref="eEchartId" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>
<script>
import dataOverview from '../timeSearch'
import echarts from 'echarts'
import target from './components/target.vue'
import dimension from './components/dimension'
import {
  getAdvertisingData,
  getAdvertisingDataTotal
} from '@/api/advertisingKanBan'
import { getDayAll } from '@/utils/index'
import { debounce } from '@/utils'
import moment from 'moment'

export default {
  name: 'AdvertisingData',
  components: {
    dataOverview,
    target,
    dimension
  },
  data() {
    return {
      search: {
        time: undefined
      },
      searchActive: 0,
      chart: undefined,
      op: {
        legend: {
          bottom: 10,
          data: [
            {
              name: '总成交数量',
              icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAQCAYAAAAFzx/vAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAEAAAAAChTRmjAAABy0lEQVQ4EZ1VzUpCQRQ+5yLSQkSkTRH1AEK9QrQIfIXWEkgtri5cu26Rd5EE0boeIWohvUKBD5AIbUIkXISLO31nnJGZ203vdUDn/HxnvjlzjkemxKq2VG2uqMGKTuHaN+6RYnopMt1PejxMhORS2aJrXVX8mNI19CYpCqzd25li6LcHFWoPuzz3fBkVTWjInkB0kimOaQDS+iakOhOdWVYyuRGw5jUy3c8FBVIzGJquEfI4YDrbYtqVj8hiS2CaJjZhXq0WpEESNRsHAR1993jihD6WW+o5jukNtj1tR51RxAbkloNbKxakG5UDQzadBJn2iq0cqk6s6MHCTSdbNXVHTB0xd+LE2ecF7Lb1dUCR6FULKV/i+/HtXqzvWmiGTL+KyAGymzrA8VfEn47uieJDW8+sEbGl7VDtWD25G9+iBHAithJImpClIaRRRF63Ri4AdTx2dVdO8Y2WP3wXuEouhaqHJgsdTFqTEZqs6jWZBDBFuQnN6Hv/09loNqmxnCuZoV5XEJfPCbIYo/EwN6EciCxvQHghcubF1J9FfKknTeYgA5RZihsPMsctRmFb8BsRygyVWQrSvjzVv8TiA8aduxs9qUuQ9+/sF/wqnx3MDW0TAAAAAElFTkSuQmCC',
              itemStyle: {}
            },
            {
              name: '环比',
              icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAQCAYAAAAFzx/vAAAAAXNSR0IArs4c6QAAAkFJREFUSEutlE9IFHEUx7/fWdEKZ3SXMoTSuhhCSBERCJqXCoMoPHQoioqomzubUh4KNggMQmbnFAXVyQ510FN2KIw6FUiFXYIgqE79wZzdyG3X+cbIrizutjFbv9v83vd9P/Me7/2ICseydcwXzpPYLMAg8IrEcc/hu0r6MHdcKY5eUFsui/cQjNIYgYm0y4Ew5pW05cBhbc3lMLtSTGIqneL+/w4MDE1bdyScKDH/EKnDwPwYZ8y4toDoIfGklhZz/bBafuQxTmAbgRteihcDkJVQrKEJv9pakZ05y1xwFx1WVy6HFwAaQPyksD3t8m2YqmnaGpNwrphkGNjlOQxMy46Z0Ih8jC5ricteislQwEZb0xD6SpJ2Z1w+/QPwoHxMFmMknqVT7A0FNOP6LGDdctIatGRG+aWSSbOt5rzwFUAkiBOYS7uMhQI2xvURwIZC0qeMy43VDExbExIOFTR3My6PVtM3jSjKBbTv6cbs/cNcpGWr3xduBkkGccZLcaqawaakVn37jiMA/I5OjBcHqlKONaSdyuORAIvE845O9JTtYZj2/K0yfwEvJbQXdZE67K0ZKIlWAtclnCo8fc6+btwL2ra0y3HdFnCy5KcWjXp01gxsttWXF6ZXVPkmshq981c51xjXawBdJfFLGZdXagaaCfXIR9n60MDptMNbVkJx30eqMM0PhqI4kEzSrxm41DZb1wQMQqgveTj6PYcPg++mIe0AEEuYeBzACvB/G5O1tlqzwiCIbhKTnkOnmuNvZ2/QTpqaX/MAAAAASUVORK5CYII='
            }
          ]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed'
            },
            crossStyle: {
              color: '#999'
            }
          },
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter: params => {
            if (!params || params.length === 0) {
              return ''
            }
            let str = `
                <p >${params[0].axisValue}</p>
                <p style="margin-top: 8px;">
                    <span class="circle_blue"></span>
                   ${params[0].seriesName}
                    <span style="color: #333">${this.numberFormat(
    params[0].data
  )}</span>
                </p>  \n
            `
            if (params[1]) {
              str += `  <p style="margin-top: 8px;">
                    <span class="circle_blue_empty"></span>
                   ${params[1].seriesName}
                    <span style="color: #333">${this.numberFormat(
    params[1].data
  )}</span>
                </p>  \n`
            }
            return str
          }
        },
        title: { show: false },
        grid: {
          right: 70,
          left: 70
        },
        xAxis: {
          type: 'category',
          show: true,
          showSymbol: false,
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: []
      },
      targetKey: 'totalPayOrderCount',
      targetKeyValue: '总成交数量',
      total: 0,
      totalQOQ: 0,
      checked: false,
      totalHB: 0,
      $_resizeHandler: null,
      ratioObj: {
        payOrderAmount: 'payOrderAmountRatio',
        payOrderCount: 'payOrderCountRatio',
        totalClickCnt: 'totalClickCntRatio',
        totalClickRatio: 'totalClickRatio',
        totalCpmPlatform: 'totalCpmPlatformRatio',
        totalPayOrderAmount: 'totalPayOrderAmountRatio',
        totalPayOrderCount: 'totalPayOrderCountRatio',
        totalPrepayAndPayOrderRoi: 'totalPrepayAndPayOrderRoiRatio',
        totalRoi: 'totalRoiRatio',
        totalShowCnt: 'totalShowCntRatio',
        totalStatCost: 'totalStatCostRatio'
      }
    }
  },
  mounted() {
    this.query()
    this.$nextTick(() => {
      this.chart = echarts.init(this.$refs.eEchartId)
    })
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
    isReservTwo() {
      const key = this.targetKey
      return (
        key !== 'totalShowCnt' &&
        key !== 'totalClickCnt' &&
        key !== 'payOrderCount' &&
        key !== 'totalPayOrderCount'
      )
    },
    numberFormat(value) {
      if (this.targetKey === 'totalClickRatio') {
        return Number(value).toFixed(2) + '%'
      }
      if (Number(value) < 10000) {
        return this.isReservTwo() ? Number(value).toFixed(2) : value
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.0001).toFixed(2) + '万'
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.00000001).toFixed(2) + '亿'
      }
    },
    selectHB(val) {
      this.query()
    },
    targetValue(val) {
      this.targetKey = val.key
      this.targetKeyValue = val.name
      this.op.legend.data[0].name = val.name
      this.chart.resize()
      this.query()
    },
    query() {
      if (this.search.time.active === 7) {
        this.search.time.time[0] = moment()
          .subtract(7, 'd')
          .format('YYYY-MM-DD')
        this.search.time.time[1] = moment()
          .subtract(1, 'd')
          .format('YYYY-MM-DD')
      }
      if (this.search.time.active === 30) {
        this.search.time.time[0] = moment()
          .subtract(1, 'M')
          .format('YYYY-MM-DD')
        this.search.time.time[1] = moment()
          .subtract(1, 'd')
          .format('YYYY-MM-DD')
      }
      let params = { ...this.search }
      if (params.time) {
        params.startTime = params.time.time[0]
        params.endTime = params.time.time[1]
        delete params.time
        delete params.active
      }
      if (this.$refs.dimensionRef) {
        params = { ...params, ...this.$refs.dimensionRef.form }
      }
      this.getAdvertisingData(params)
    },
    async getAdvertisingData(params) {
      const timeList = getDayAll(params.startTime, params.endTime)
      // const isToday = this.search.time.time[0] === this.search.time.time[1]
      // const endIndex = isToday ? moment().hours() : undefined
      this.op.xAxis.data = timeList
      const res = await getAdvertisingData(params)
      const tRes = await getAdvertisingDataTotal(params)
      if (res.code === 1 && tRes.code === 1) {
        const info = res.data

        const tt = tRes.data.adDataTotalResponse
          ? tRes.data.adDataTotalResponse[this.targetKey]
          : 0
        this.total = tt

        if (this.checked) {
          const ttt = tRes.data.adRingDataTotalResponse
            ? tRes.data.adRingDataTotalResponse[this.targetKey]
            : 0
          this.totalQOQ = ttt
          this.totalHB = tRes.data[this.ratioObj[this.targetKey]]
        } else {
          this.totalHB = 0
          this.totalQOQ = 0
        }
        // const o = []
        // const t = []
        // timeList.forEach((r, index) => {
        //   // eslint-disable-next-line eqeqeq
        //   const i = isToday
        //     ? info.advertisingDataList[index]
        //     : info.advertisingDataList.find(f => r.includes(f.daily))
        //   o.push(i ? i[this.targetKey] : 0)
        //   // eslint-disable-next-line eqeqeq
        //   const ii = info.ringAdvertisingDataList[index]
        //   t.push(ii ? ii[this.targetKey] : 0)
        // })
        this.op.series = []
        this.op.series.push({
          name: this.targetKeyValue,
          type: 'line',
          data: info.advertisingDataList.map(m => m[this.targetKey]),
          symbol: 'circle',
          color: '#0C6FFF',
          showSymbol: false,
          lineStyle: { color: '#0C6FFF', width: '2' },
          animationDuration: 1000
        })
        if (this.checked) {
          this.op.series.push({
            name: '环比',
            type: 'line',
            data: info.ringAdvertisingDataList.map(m => m[this.targetKey]),
            symbol: 'circle',
            color: '#D9E3F9',
            showSymbol: false,
            itemStyle: {
              borderColor: '#0C6FFF'
            },
            lineStyle: {
              color: '#0C6FFF',
              width: 2,
              type: 'dashed'
            },
            animationDuration: 1000
          })
        }
      }
      this.chart.setOption(this.op, true)
    },
    countTotal(data) {
      return {
        totalShowCnt: () => {
          const v = data
            .map(m => m.totalShowCnt)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return v
        },
        totalCpmPlatform: () => {
          const hf = data
            .map(m => m.totalStatCost)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          const bg = data
            .map(m => m.totalShowCnt)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf > 0 && bg > 0 ? (hf / bg) * 1000 : 0
        },
        totalClickCnt: () => {
          const db = data
            .map(m => m.totalClickCnt)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return db
        },
        totalClickRatio: () => {
          const hf = data
            .map(m => m.totalClickCnt)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          const bg = data
            .map(m => m.totalShowCnt)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf > 0 && bg > 0 ? (hf / bg) * 100 : 0
        },
        payOrderCount: () => {
          const db = data
            .map(m => m.payOrderCount)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return db
        },
        totalPayOrderCount: () => {
          const hf = data
            .map(m => m.totalPayOrderCount)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf
        },
        totalStatCost: () => {
          const hf = data
            .map(m => m.totalStatCost)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf
        },
        payOrderAmount: () => {
          const hf = data
            .map(m => m.payOrderAmount)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf
        },
        totalPayOrderAmount: () => {
          const hf = data
            .map(m => m.totalPayOrderAmount)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf
        },
        totalPrepayAndPayOrderRoi: () => {
          const hf = data
            .map(m => m.payOrderAmount)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          const bg = data
            .map(m => m.totalStatCost)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf > 0 && bg > 0 ? hf / bg : 0
        },
        totalRoi: () => {
          const hf = data
            .map(m => m.totalRoi)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          const bg = data
            .map(m => m.totalStatCost)
            .reduce((prev, curr) => {
              return prev + curr
            }, 0)
          return hf > 0 && bg > 0 ? hf / bg : '0.00'
        }
      }[this.targetKey]()
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    onClear() {
      this.targetKey = 'totalPayOrderCount'
      this.$refs.dimensionRef.reset()
      this.$refs.targetRef.reset()
      this.query()
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  .row {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  .eEcharts {
    width: 100%;
    height: 386px;
    background: #ffffff;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
    position: relative;
    border-radius: 5px;
    .filter-e {
      position: absolute;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 25px 0 25px;
      .total {
        width: 100%;
        text-align: right;
      }
      div {
        width: 50%;
        .red-p {
          width: 12px;
          height: 12px;
          display: inline-block;
          background-image: url('../../../../../assets/image/product/down.png');
          background-size: 100% 100%;
        }

        .green-p {
          width: 12px;
          height: 12px;
          display: inline-block;
          background-image: url('../../../../../assets/image/product/up.png');
          background-size: 100% 100%;
        }
        .f-l {
          font-size: 0.8rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .f-v {
          font-size: 1rem;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          margin: 0 12px 0 8px;
        }
      }
    }
  }
}
</style>
