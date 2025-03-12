<template>
  <div
    id="typeProportion"
    v-loading="loading"
    class="typeProportion"
    element-loading-spinner="el-icon-loading"
  >
    <div v-if="!logoName" class="title">{{ getMapLabel }}</div>
    <div v-else class="title-t">
      <div class="label-t">
        <img class="icon-t" :src="logo" alt="">
        <span>{{
          queryParams.channelLevel > 2 ? '店铺业绩组成' : getMapLabel
        }}</span>
      </div>
    </div>
    <div ref="eEchartId" style="width: 100%; height: 88%" />
    <div ref="legendCustom" class="legendCustom">
      <div v-for="(item, i) in op.series.data" :id="i" :key="i" class="item-l">
        <div
          :id="i"
          class="round"
          :style="{ 'background-color': item.itemStyle.color }"
        />
        <span :id="i">{{ item.name }}</span>
      </div>
    </div>
    <div
      v-if="op.series.data.length < 1"
      style="width: 100%; position: absolute; top: 24%"
    >
      <el-empty :image-size="70" description="暂无数据" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {
  channeRevenuelData,
  shopData
} from '@/api/business/board-hk/businessData'
import { debounce } from '@/utils'
export default {
  data() {
    return {
      colors: new Map([
        [0, '#00B1FF'],
        [1, '#FFB323'],
        [2, '#00D6CA'],
        [3, '#00EB9D'],
        [4, '#35C2FF'],
        [5, '#FF1EBF'],
        [6, '#A31EFF'],
        [7, '#1EFFC7'],
        [8, '#FF6464'],
        [9, '#FF6B1E'],
        [10, '#1E73FF'],
        [11, '#1EFFEE'],
        [12, '#00E235'],
        [13, '#FF1E61'],
        [14, '#D800FF'],
        [15, '#1E9EFF'],
        [16, '#FF6BD7'],
        [17, '#CC5DFF'],
        [18, '#2FEFFF'],
        [19, '#00E235']
      ]),
      colorList: new Map([
        [1, '#0050FF'], // 抖店
        [2, '#FFBE69'], // 视频号
        [3, '#FF6A49'], // 快手
        [4, '#3691FF'], // 小鹅通
        [11, '#93DDFF'], // 枫页小店
        [12, '#1F0A1C'], // 抖音小程序
        [13, '#FF1E61'], // 直播间
        [14, '#FF0000'], // 平台自营
        ['未知', '#FF3B91'], // 小红书
        [15, '#00D700'], // 微信小程序
        [16, '#FF2741'], // 小红书
        [17, '#CC5DFF'] // 线下录单
      ]),
      loading: false,
      op: {
        grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        series: {
          name: '占比',
          type: 'pie',
          radius: [50, 80],
          center: ['40%', '50%'],
          startAngle: 270,
          emphasis: {
            label: {
              rotate: true,
              show: true
            },
            labelLine: {
              lineStyle: {
                color: '#D0D0D0'
              }
            }
          },
          data: [],
          label: {
            show: false,
            formatter: params => {
              return `{name|${params.data.name}}\n{value|${this.filterPrice(
                params.data.value
              )}}{name|-}{value|${params.data.percent + '%'}}`
            },
            lineHeight: 15,
            rich: {
              name: {
                fontSize: 12,
                color: '#2C3242'
              },
              value: {
                fontSize: 12,
                color: '#2C3242'
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#D0D0D0'
            }
          }
        }
      },
      chart: undefined,
      $_resizeHandler: null,
      index: 3,
      logo: '',
      logoName: '',
      oldIndex: -1,
      queryParams: {}
    }
  },
  computed: {
    getMapLabel() {
      const t = {
        1: '总营收',
        2: '退款金额',
        3: 'GMV',
        10: '直播带货',
        5: '视频带货',
        9: '线下录单',
        11: '私域线上成交'
      }[this.index]
      return (
        t +
        (!this.queryParams.channelLevel ||
        (this.queryParams.channelLevel < 2 && !this.queryParams.orderChannel)
          ? '渠道'
          : '店铺') +
        '占比'
      )
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
    document
      .getElementById('typeProportion')
      .addEventListener('mouseover', e => this.hoverLegendCustom(e))
  },
  methods: {
    hoverLegendCustom(e) {
      if (this.oldIndex > -1) {
        this.chart.dispatchAction({
          type: 'downplay',
          dataIndex: this.oldIndex
        })
      }
      this.chart.dispatchAction({
        type: 'highlight',
        dataIndex: e.target.id
      })
      this.oldIndex = Number(e.target.id)
    },
    initData(record) {
      if (record) {
        this.queryParams = {
          bizType: record.bizType,
          employeeUid:
            record.employeeUid || this.$store.getters.userInfo.userId,
          endTime: record.endTime,
          expertId: undefined,
          itemIdList:
            record.goodsId && record.goodsId.length > 0
              ? record.goodsId
              : undefined,
          productCategory: record.productCategory,
          orderChannel: record.orderChannel,
          startTime: record.startTime,
          teacherIdList: record.teacherIdList,
          employeeDeptId: record.deptId,
          timeType: record.type,
          shopId: record.shopId,
          channelLevel: record.channelLevel
        }
      }
      if (this.queryParams.isShowLogo) {
        this.logo = this.queryParams.logoImgUrl
        this.logoName = this.queryParams.channelLogoName
      } else {
        this.logo = ''
        this.logoName = ''
      }
      this.index = this.queryParams.bizType
      this.chart = echarts.init(this.$refs.eEchartId)
      if (this.chart) {
        this.chart.resize()
      }
      this.loading = true
      const api = this.queryParams.orderChannel ? shopData : channeRevenuelData
      api({ ...this.queryParams, channelLevel: undefined })
        .then(res => {
          this.loading = false
          this.op.series.data = res.data
            .filter(f => f.amount > 0)
            .map((m, i) => ({
              ...m,
              name: this.formatLabel(m.orderChannelName || m.shopName),
              value: m.amount,
              itemStyle: {
                color:
                  (!this.queryParams.channelLevel ||
                    this.queryParams.channelLevel === 1) &&
                  !this.queryParams.orderChannel
                    ? this.colorList.get(m.orderChannel)
                    : this.colors.get(i)
              }
            }))

          this.chart.setOption(this.op, true)
        })
        .catch(() => {
          this.op.series.data = []
          this.chart.setOption(this.op, true)
          this.loading = false
        })
    },
    // 递归字符 超过8个字符换行显示
    formatLabel(str) {
      if (str.length > 7) {
        return str.substring(0, 7) + '...'
      } else {
        return str
      }
    },

    // 过滤所有的数值
    filterPrice(value) {
      const v = Number((Number(value) / 100).toFixed(2))
      if (v < 10000) {
        return v
      }
      if (v >= 10000) return (v * 0.0001).toFixed(2) + '万'
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
      document
        .getElementById('typeProportion')
        .removeEventListener('mouseover', e => this.hoverLegendCustom(e))
    }
  }
}
</script>
<style lang="scss" scoped>
.typeProportion {
  width: 36%;
  min-width: 420px;
  height: 315px;
  margin-left: 0.5%;
  background-color: #fff;
  position: relative;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2c3242;
    padding: 24px 24px 0 24px;
  }
  .title-t {
    padding: 24px 24px 0 24px;
    .label-t {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2c3242;
      display: flex;
      align-items: center;
      .icon-t {
        width: 28px;
        height: 28px;
        margin-right: 16px;
      }
    }
  }
  .legendCustom {
    position: absolute;
    right: 5%;
    top: 30%;
    height: 190px;
    overflow-y: auto;
    z-index: 999;
    width: 113px;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d0d0d0;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
    .item-l {
      display: flex;
      align-items: center;
      padding: 4px 0;
      width: 110px;

      span {
        font-size: 10px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #2c3242;
        &:hover {
          cursor: default;
        }
      }
      .round {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 6px;
      }
    }
  }
}
</style>
