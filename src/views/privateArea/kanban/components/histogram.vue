<template>
  <div class="warpBox">
    <div class="btnBox">
      <span>{{ search.names ? search.names[0] : '' }}</span><span v-if="depRela.length" @click="handleGoBack">返回</span>
    </div>
    <div v-if="!xAxisData.length" class="nullBox">暂无数据</div>
    <div id="histogramCharts" class="histogramCharts" />
  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import {
  getClueStatHourlineChart,
  getClueStatPaylineChart
} from '@/api/privateArea/kanban'
export default {
  props: {
    type: {
      type: String,
      default: 'all'
    },
    tabType: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    depRela: [],
    chart: null,
    xAxisData: [],
    isData: {},
    tier: 1,
    $_resizeHandler: null, // 页面尺寸变化回调函数,
    search: {}
  }),
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
    async getData(search, isInit = false, isClick = false) {
      this.search = search
      this.getDepartmentQuery(isInit, isClick)
    },
    async getDepartmentQuery(isInit, isClick) {
      if (isInit) this.depRela = []
      const query =
        this.tabType === 0 ? getClueStatHourlineChart : getClueStatPaylineChart
      try {
        const { data } = await query({
          ...this.search,
          followDeptId: this.depRela.length
            ? this.depRela[this.depRela.length - 1].followDeptId
            : ''
        })
        this.scrollToTop()
        // 过滤数字为0 的参数
        const { fieldNames } = this.search
        const newData = data.filter(item => fieldNames.some(n => item[n])) || []
        // 如果没有数据删除存储的depRela
        this.depRela = [...new Set(this.depRela)]
        if (isClick) {
          console.log(this.depRela[this.depRela.length - 1])
          this.$emit('handleFollowDept', this.depRela[this.depRela.length - 1])
        }

        // const bol = this.depRela.length && newData.length === 1 && this.depRela[this.depRela.length - 1].followDeptId === newData[0].followDeptId
        // const boltwo = this.depRela.length && !newData.length
        // if (bol || boltwo) {
        //   this.depRela.pop()
        //   return
        // }
        this.isData = newData
        // 横坐标
        const xAxisData = newData?.map(item => item.followDeptName) || []
        // 纵坐标
        const values =
          this.search.fieldNames?.map(item => {
            return newData?.map(n => n[item])
          }) || []
        this.setOptions(xAxisData, values)
      } catch {
        if (this.depRela.length) this.depRela.pop()
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 可选，平滑滚动
      })
    },
    setOptions(xAxisData, valueList) {
      const bgColor = [
        '#0D42CC',
        '#0C6FFF',
        '#2EB2EB',
        '#1CD6E2',
        '#24DBAF',
        '#86482a'
      ]
      const series =
        valueList?.map((item, index) => {
          return {
            name: this.search?.names[index],
            data: item.map(n => (n % 1 === 0 ? n : n.toFixed(2))),
            type: 'bar',
            stack: 'total',
            barMaxWidth: 80,
            barMinHeight: 10,
            label: {
              normal: {
                show: true,
                // color: bgColor[index], // 数值颜色
                formatter: function (num) {
                  return num.value || ''
                },
                textBorderWidth: 0
              }
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: bgColor[index] },
                { offset: 1, color: bgColor[index] }
              ])
            }
          }
        }) || []
      this.xAxisData = xAxisData || []
      this.chart.setOption(
        {
          dataZoom: [
            // {
            //   type: 'inside', // 使用滑动条形式的区间选择 inside 'slider'：滑动条型数据区域缩放组件。
            //   start: 0, // 默认数据初始选择范围为 0% 到 100%
            //   end: !valueList?.length || valueList?.length === 1 ? 100 : 40 // 可以通过滑动来改变这个选择范围
            // 设置背景颜色
            // backgroundColor: 'rgb(19, 63, 100)'
            // // 设置选中范围的填充颜色
            // fillerColor: 'rgb(16, 171, 198)',
            // // 设置边框颜色
            // borderColor: 'rgb(19, 63, 100)',
            // // 是否显示detail，即拖拽时候显示详细数值信息
            // showDetail: false,
            // // 数据窗口范围的起始数值
            // startValue: 0,
            // // 数据窗口范围的结束数值（一页显示多少条数据）
            // endValue: 5,
            // // empty：当前数据窗口外的数据，被设置为空。
            // // 即不会影响其他轴的数据范围
            // filterMode: 'empty',
            // // 设置滚动条宽度，相对于盒子宽度
            // width: '50%',
            // // 设置滚动条高度
            // height: 8,
            // // 设置滚动条显示位置
            // left: 'center',
            // // 是否锁定选择区域（或叫做数据窗口）的大小
            // zoomLoxk: true,
            // // 控制手柄的尺寸
            // handleSize: 0
            // // dataZoom-slider组件离容器下侧的距离
            // }
          ],
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
            borderWidth: 1
          },
          grid: {
            left: 20,
            right: 20,
            bottom: 30,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.xAxisData,
            axisLine: {
              lineStyle: {
                // color: '#588698', // 颜色
                width: 1 // 突出显示
              }
            },
            axisLabel: {
              // show: true, // 显示横坐标标签
              // rotate: '20', // x轴数据标签旋转角度
              interval: 0, // 强制显示所有标签,
              // formatter: function (value, index) {
              //   const bol = series.some(item => item.data[index])
              //   console.log(bol ? value : '')
              //   return bol ? value : ''
              // },
              show: function (index) {
                return series.some(item => item.data[index])
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            }
          },
          series
        },
        true
      )
    },
    async initChart() {
      this.chart = echarts.init(
        document.getElementById('histogramCharts'),
        'macarons'
      )
      this.chart.on('click', 'series', params => {
        const dep = this.isData.find(
          item => item.followDeptName === params.name
        )
        if (
          !this.depRela?.find(item => item.followDeptId === dep.followDeptId)
        ) {
          this.depRela.push(dep)
          this.getData({ ...this.search }, false, true)
        }
      })
    },
    handleGoBack() {
      if (!this.depRela?.length) return
      this.depRela.pop()
      this.$emit(
        'handleFollowDept',
        this.depRela.length
          ? this.depRela[this.depRela.length - 1].followDeptId
          : ''
      )
      this.getData({ ...this.search })
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
.warpBox {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  margin-top: 20px;
  padding: 0 20px;
  position: relative;
  padding-top: 20px;
  .nullBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .histogramCharts {
    width: 100%;
    height: 340px;
  }
  .btnBox {
    position: absolute;
    left: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    z-index: 200;
    > span:nth-of-type(1) {
      font-size: 18px;
      font-weight: bold;
    }
    > span:nth-of-type(2) {
      margin-left: 20px;
      color: #188df0;
      cursor: pointer;
    }
  }
}
</style>
