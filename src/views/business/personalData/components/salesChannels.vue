<template>
  <div class="salesChannels">
    <div class="top-data">
      <span
        class="left-title"
      ><i /><span class="tit-name">售卖渠道</span><el-tooltip
        class="item"
        effect="dark"
        :content="'渠道所产生的成交金额汇总。'"
        placement="top"
      >
        <img src="@/assets/image/product/icon.png" /> </el-tooltip></span>
    </div>
    <div class="sales-content flexbox">
      <div class="all-sales">
        <div
          v-for="(item, index) in sellTotalData"
          :key="index"
          style="width: 587px"
        >
          <div
            v-if="
              [1, 2, 4, 10, 11, 12, 13, 15, 14, 16, 17, 20].includes(
                item.orderChannel
              )
            "
            :style="{
              width: widthMap.get(index),
              marginBottom: index === sellTotalData.length - 1 ? '0px' : '20px'
            }"
            :class="[
              'flexBox',
              {
                doudian: item.orderChannel == 1,
                ks: item.orderChannel == 2,
                xet: item.orderChannel == 4,
                sph: item.orderChannel == 10,
                fy: item.orderChannel == 11,
                dou: item.orderChannel == 12,
                zbj: item.orderChannel == 13,
                wxxcx: item.orderChannel == 15,
                ptzy: item.orderChannel == 14,
                xhs: item.orderChannel == 16,
                xxld: item.orderChannel == 17,
                bdxd: item.orderChannel == 20
              }
            ]"
            @click="goDoudian(item)"
          >
            <div class="flexbox">
              <img style="width: 30px; height: 30px" :src="item.channelImg" />
              <span>{{ item.name }}</span>
              <span>￥ {{ filterPrice(item.totalCount) }}</span>
            </div>
            <span class="flexbox">
              <span>{{ fillDataString(item.totalRatio) }}</span>
              <!--              <span class="right-enter" />-->
            </span>
          </div>
        </div>
      </div>
      <div class="sales-broken">
        <div id="salesCharts" style="width: 100%; height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import doudian from '@/assets/svg/panel/doudian_icon.svg'
import sph from '@/assets/svg/panel/sph_icon.svg'
import ks from '@/assets/svg/panel/ks_icon.svg'
import xet from '@/assets/svg/panel/xet_icon.svg'
import fy from '@/assets/svg/panel/fy_icon.svg'
import dou from '@/assets/svg/panel/dou_icon.svg'
import echarts from 'echarts'
import { getDayAll, getFilterPrice } from '@/utils'
import mixin from '@/components/AppPanelData/mixin'
export default {
  name: 'SalesChannels',
  mixins: [mixin],
  props: {
    brokenData: {
      type: Array,
      default: () => {
        return []
      }
    },
    sellTotalData: {
      type: Array,
      default: () => {
        return []
      }
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    sellTotalDayData: {
      type: Array,
      default: () => {
        return []
      }
    },
    timeList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      srcList: new Map([
        [1, doudian],
        [2, sph],
        [3, ks],
        [4, xet],
        [11, fy],
        [12, dou]
      ]),
      widthMap: new Map([
        [0, '587px'],
        [1, '537px'],
        [2, '487px'],
        [3, '437px'],
        [4, '387px'],
        [5, '337px']
      ])
    }
  },
  watch: {
    sellTotalDayData: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    },
    timeList: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    }
  },
  created() {},
  mounted() {
    if (this.sellTotalData) {
      this.initChart()
    }
  },
  methods: {
    fillDataString(num) {
      const nums = Math.abs(num * 1).toFixed(2)
      return nums + '%'
    },
    // 过滤所有的数值
    filterPrice(num) {
      if (num === null) {
        return 0
      } else {
        const newNum = num / 100
        if (newNum < 10000000) {
          return newNum
        } else {
          return (newNum / 10000).toFixed(2) + '万'
        }
      }
    },
    sortArr(attr) {
      return function (a, b) {
        return b[attr] - a[attr]
      }
    },
    // 售卖渠道跳转
    goDoudian(item) {
      this.$emit('goPage', item)
    },
    // 初始化echarts
    initChart() {
      const timeList = getDayAll(this.timeList.startTime, this.timeList.endTime)
      this.chart = echarts.init(document.getElementById('salesCharts'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 10,
          textStyle: {
            color: '#777',
            lineHeight: 20,
            fontSize: 12
          },
          borderColor: '#75A0F9',
          borderWidth: 1,
          formatter: params => {
            if (!params || params.length === 0) {
              return ''
            }
            const newArr = params.sort(this.sortArr('value'))
            let str = `<p >${params[0].axisValue}</p>`
            newArr.forEach(ele => {
              str += `
                <p style="margin-top: 8px;">
                    <span class="circle" style="background:${ele.color}"></span>
                    <span>${ele.seriesName}</span>
                    <span style="color: #777">${getFilterPrice(ele.data)}</span>
                </p>`
            })
            return str
          }
        },
        legend: {
          data: this.sellTotalDayData.map(e => e.name)
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeList
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     start: 0,
        //     end: 100
        //   }
        // ],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          }
        },
        series: this.sellTotalDayData
      }
      this.chart.setOption(option, true)
    }
  }
}
</script>

<style lang="scss" scoped>
$w100: 587;
.top-data {
  margin-top: 32px;
}
.flexbox {
  display: flex;
  align-items: center;
}
.sales-broken {
  width: 100%;
  max-width: 940px;
  margin-left: 32px;
  height: 340px;
  border: 1px solid #cbcfd3;
  padding: 10px;
  box-sizing: border-box;
}
.sales-content {
  width: 100%;
  //height: 336px;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
  margin-top: 16px;
  padding: 16px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: flex-start;
  .all-sales {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .doudian,
    .dou,
    .sph,
    .hkzy,
    .xet,
    .fy,
    .ks,
    .wxxcx,
    .ptzy,
    .xhs,
    .xxld,
    .bdxd,
    .zbj {
      //height: 52px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 10px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border: 1px solid transparent;
      :nth-child(1) {
        :nth-child(1) {
          margin-right: 8px;
        }
        :nth-child(2) {
          height: 24px;
          font-size: 16px;
          font-family: MicrosoftYaHei;
          line-height: 24px;
          margin-right: 16px;
        }
      }
      :nth-child(2) {
        font-size: 20px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        :nth-child(2) {
          width: 10px;
          height: 10px;
          margin-left: 12px;
          transform: rotate(45deg);
        }
      }
    }
    .ks {
      width: 587px;
      background: #ffd7c9;

      :nth-child(1) {
        :nth-child(2) {
          color: #ff4905;
        }
        :nth-child(3) {
          color: #ff4905;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #ff4905;
        :nth-child(2) {
          border-top: 1px solid #ff4905;
          border-right: 1px solid #ff4905;
        }
      }
    }
    .ks:hover {
      box-shadow: 0px 2px 4px 0px rgba(255, 105, 49, 0.2);
      border: 1px solid #ff6931;
    }
    .xet {
      width: 587px;
      background: #ccdcff;

      :nth-child(1) {
        :nth-child(2) {
          color: #0051ff;
        }
        :nth-child(3) {
          color: #0051ff;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #0051ff;
        :nth-child(2) {
          border-top: 1px solid #0051ff;
          border-right: 1px solid #0051ff;
        }
      }
    }
    .xet:hover {
      box-shadow: 0px 2px 6px 0px rgba(0, 81, 255, 0.2);
      border: 1px solid #0051ff;
    }
    .fy {
      width: 587px;
      background: #e7f0ff;

      :nth-child(1) {
        :nth-child(2) {
          color: #0099ff;
        }
        :nth-child(3) {
          color: #0099ff;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #0099ff;
        :nth-child(2) {
          border-top: 1px solid #0099ff;
          border-right: 1px solid #0099ff;
        }
      }
    }
    .fy:hover {
      box-shadow: 0px 2px 4px 0px rgba(0, 153, 255, 0.2);
      border: 1px solid #0099ff;
    }
    .wxxcx {
      width: 587px;
      background: #9cdab9;

      :nth-child(1) {
        :nth-child(2) {
          color: #30b06b;
        }
        :nth-child(3) {
          color: #30b06b;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #30b06b;
        :nth-child(2) {
          border-top: 1px solid #30b06b;
          border-right: 1px solid #30b06b;
        }
      }
    }
    .wxxcx:hover {
      box-shadow: 0px 2px 4px 0px rgba(48, 176, 107, 1);
      border: 1px solid #30b06b;
    }
    .xhs {
      width: 587px;
      background: #ffdddd;

      :nth-child(1) {
        :nth-child(2) {
          color: #ff2741;
        }
        :nth-child(3) {
          color: #ff2741;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #ff2741;
        :nth-child(2) {
          border-top: 1px solid #ff2741;
          border-right: 1px solid #ff2741;
        }
      }
    }
    .xhs:hover {
      box-shadow: 0px 2px 4px 0px rgba(218, 20, 48, 1);
      border: 1px solid #ff2741;
    }
    .ptzy {
      width: 587px;
      background: #ffdddd;

      :nth-child(1) {
        :nth-child(2) {
          color: #da1430;
        }
        :nth-child(3) {
          color: #da1430;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #da1430;
        :nth-child(2) {
          border-top: 1px solid #da1430;
          border-right: 1px solid #da1430;
        }
      }
    }
    .ptzy:hover {
      box-shadow: 0px 2px 4px 0px rgba(218, 20, 48, 1);
      border: 1px solid #da1430;
    }
    .dou {
      width: 587px;
      background: rgba(102, 54, 69, 0.2);
      :nth-child(1) {
        :nth-child(2) {
          color: #663645;
        }
        :nth-child(3) {
          color: #663645;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #663645;
        :nth-child(2) {
          border-top: 1px solid #663645;
          border-right: 1px solid #663645;
        }
      }
    }
    .dou:hover {
      box-shadow: 0px 2px 6px 0px rgba(102, 54, 69, 0.2);
      border: 1px solid #663645;
    }
    .doudian {
      width: 587px;
      background: #ccdcff;

      :nth-child(1) {
        :nth-child(2) {
          color: #0051ff;
        }
        :nth-child(3) {
          color: #0051ff;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #0051ff;
        :nth-child(2) {
          border-top: 1px solid #0051ff;
          border-right: 1px solid #0051ff;
        }
      }
    }
    .doudian:hover {
      box-shadow: 0px 2px 6px 0px rgba(0, 81, 255, 0.2);
      border: 1px solid #0051ff;
    }
    .sph {
      width: 509px;
      background: #fadec1;
      :nth-child(1) {
        :nth-child(2) {
          color: #fa9d3b;
        }
        :nth-child(3) {
          color: #fa9d3b;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #fa9d3b;
        :nth-child(2) {
          border-top: 1px solid #fa9d3b;
          border-right: 1px solid #fa9d3b;
        }
      }
    }
    .sph:hover {
      box-shadow: 0px 2px 6px 0px rgba(250, 157, 59, 0.2);
      border: 1px solid #fa9d3b;
    }
    .hkzy {
      width: 432px;
      background: #ffc9c7;
      :nth-child(1) {
        :nth-child(2) {
          color: #ff423c;
        }
        :nth-child(3) {
          color: #ff423c;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #ff423c;
        :nth-child(2) {
          border-top: 1px solid #ff423c;
          border-right: 1px solid #ff423c;
        }
      }
    }
    .hkzy:hover {
      box-shadow: 0px 2px 6px 0px rgba(255, 66, 60, 0.2);
      border: 1px solid #ff423c;
    }
    .xxld {
      width: 587px;
      background: #ca81c7;
      :nth-child(1) {
        :nth-child(2) {
          color: #570352;
        }
        :nth-child(3) {
          color: #570352;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #570352;
        :nth-child(2) {
          border-top: 1px solid #570352;
          border-right: 1px solid #570352;
        }
      }
      &:hover {
        box-shadow: 0px 2px 6px 0px rgba(197, 7, 188, 0.2);
        border: 1px solid #570352;
      }
    }
    .bdxd {
      width: 587px;
      background: #afc488;
      :nth-child(1) {
        :nth-child(2) {
          color: #7aa034;
        }
        :nth-child(3) {
          color: #7aa034;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #7aa034;
        :nth-child(2) {
          border-top: 1px solid #7aa034;
          border-right: 1px solid #7aa034;
        }
      }
      &:hover {
        box-shadow: 0px 2px 6px 0px rgba(122, 160, 52, 0.2);
        border: 1px solid #7aa034;
      }
    }
    .zbj {
      width: 587px;
      background: #a2dbf1;
      :nth-child(1) {
        :nth-child(2) {
          color: #07aff1;
        }
        :nth-child(3) {
          color: #07aff1;
          font-weight: bold;
        }
      }
      :nth-child(2) {
        color: #07aff1;
        :nth-child(2) {
          border-top: 1px solid #07aff1;
          border-right: 1px solid #07aff1;
        }
      }
      &:hover {
        box-shadow: 0px 2px 4px 0px rgba(8, 134, 184, 0.2);
        border: 1px solid #07aff1;
      }
    }
  }
}
.left-title {
  width: 200px;
  height: 32px;
  line-height: 32px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  font-family: '微软雅黑';
  display: flex;
  align-items: center;
  .tit-name {
    margin-left: 8px;
  }
  i {
    width: 4px;
    height: 24px;
    margin-top: 3px;
    float: left;
    background: #0c6fff;
    border-radius: 8px;
  }
  img {
    float: left;
    width: 16px;
    margin-top: 5px;
    margin-left: 8px;
  }
}
</style>
