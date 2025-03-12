<template>
  <div
    v-loading="loading"
    class="departmentChart"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      {{ getTitle }}数据 <span class="dw">(元)</span>
      <div
        v-if="!queryParams.deptId && queryParams.deptId !== 0"
        class="switch-type"
        :class="!isQuanyu?'':'switch-type-qy'"
        @click="changeIsRevenue"
      >
        <div
          v-if="!isQuanyu"
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': isRevenue
          }"
        >
          营收
        </div>
        <div
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': !isRevenue
          }"
        >
          {{ isQuanyu ? "营收":"业绩" }}
        </div>
      </div>
      <span
        v-if="
          (queryParams.employeeDeptId && queryParams.corpMangerFlag) ||
            (!queryParams.corpMangerFlag && deptIds.length > 1)
        "
        class="back"
        @click="back"
      >
        <i class="el-icon-arrow-left" />返回
      </span>
    </div>

    <div ref="eEchartId" style="width: 100%; height: 100%" />
    <div
      v-if="op.series[0].data.length < 1"
      style="width: 100%; position: absolute; top: 24%"
    >
      <el-empty :image-size="70" description="暂无数据" />
    </div>
  </div>
</template>
<script>
import {
  deptVertical,
  depPerformancetVertical
} from '@/api/business/board-hk/businessData'
import { getItem } from '@/utils/localStorage'
import { debounce } from '@/utils'
import echarts from 'echarts'

export default {
  data() {
    return {
      isQuanyu: false,
      loading: false,
      chart: undefined,
      op: {
        grid: {
          left: 80,
          right: 80,
          top: 30
        },
        xAxis: {
          type: 'category',
          show: true,
          showSymbol: false,
          data: [],
          axisLabel: {
            show: true,
            interval: 0,
            overflow: 'breakAll'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
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
        series: [
          {
            data: [],
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                return `${this.filterPrice(params.data.value)}`
              }
            },
            barWidth: '40%',
            type: 'bar',
            stack: 'Total',
            color: '#00A3FF'
          }
        ]
      },
      $_resizeHandler: null,
      queryParams: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        type: '', // 时间组件状态
        deptId: '', // 部门id
        isRevenue: true
      },
      isRevenue: true,
      level: 1,
      oldLevel: '',
      deptIds: []
    }
  },
  computed: {
    getTitle() {
      return this.level < 3 ? '部门' : '部门成员'
    }
  },
  mounted() {
    const orgItem = getItem('orgInfo')
    if (orgItem.organizationId === 1006) {
      this.isQuanyu = true
    }
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.chart = echarts.init(this.$refs.eEchartId)
    // 柱状图点击事件
    this.chart.on('click', res => {
      console.log('dsssssss:', res)
      console.log('fgfdsgfdsgfdsgfdsgfds', res)
      console.log('deptIds:', this.deptIds)
      const id = Number(res.data.id)
      if (id === 0 || id === this.deptIds[0]) return

      if (res.data.showType === 1) {
        this.deptIds.push(id)
        this.queryParams.deptId = id
        this.queryParams.employeeDeptId = id
        this.getData()
        // if (this.deptIds.length === 2) {
        // 处理三级部门选中
        this.$emit('selectThirdLevelDeptId', this.deptIds)
        // }
        this.$emit('deptIdEmit', id, true, this.isRevenue)
      } else {
        const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
        let checkIndex = ''
        if (setBuObj.isShowLogo) {
          checkIndex = setBuObj.quDaoDetailRecord.index
        } else {
          if (setBuObj.qudaoRecord) {
            checkIndex = setBuObj.qudaoRecord.index
          }
        }
        this.$emit('deptToPerson', {
          id: res.data.id,
          deptId: this.deptIds[this.deptIds.length - 1],
          uName: res.data.name,
          isShowLogo: setBuObj.isShowLogo,
          qdCheckedIndex: checkIndex
        })

        return
      }
    })
    this.$_initResizeEvent()
  },
  methods: {
    back() {
      this.queryParams.employeeDeptId =
        this.deptIds.length === 2 ? this.deptIds[0] : undefined
      this.deptIds = this.deptIds.length === 2 ? [this.deptIds[0]] : []
      this.$emit(
        'backDeptIdEmit',
        this.queryParams.employeeDeptId,
        false,
        this.isRevenue
      )
    },
    changeIsRevenue() {
      this.isRevenue = !this.isRevenue
      this.getData()
      this.$emit(
        'changeIsRevenueEmit',
        this.queryParams.employeeDeptId,
        this.isRevenue
      )
    },
    // 初始化数据
    initData(record) {
      this.queryParams = {
        bizType: record.bizType,
        deptIdChain: undefined,
        employeeUid: undefined,
        endTime: record.endTime,
        expertId: undefined,
        itemIdList:
          record.goodsId && record.goodsId.length > 0
            ? record.goodsId
            : undefined,
        productCategory: record.productCategory,
        orderChannel: record.orderChannel,
        employeeDeptId: record.deptId,
        startTime: record.startTime,
        teacherIdList: record.teacherIdList,
        timeType: record.type,
        isRevenue: record.isRevenue,
        deptId: record.deptId,
        shopId: record.shopId,
        corpMangerFlag: record.corpMangerFlag
      }
      if (this.queryParams.isRevenue !== this.isRevenue && !!this.queryParams.deptId) {
        this.isRevenue = this.queryParams.isRevenue
      }
      this.getData()
    },
    // 获取部门
    getData() {
      this.loading = true
      const api = this.isRevenue
        ? this.queryParams.isRevenue
          ? deptVertical
          : depPerformancetVertical
        : depPerformancetVertical
      // 部门
      api({
        ...this.queryParams,
        isRevenue: undefined,
        deptId: undefined,
        corpMangerFlag: undefined,
        orderChannel:
          !this.queryParams.isRevenue || !this.isRevenue
            ? undefined
            : this.queryParams.orderChannel,
        shopId:
          !this.queryParams.isRevenue || !this.isRevenue
            ? undefined
            : this.queryParams.shopId
      })
        .then(res => {
          this.loading = false
          const data = res?.data || []
          if (res.data.length > 15) {
            data.length = 15
          }
          // if (data.filter(f => f.showType).length > 0 && this.deptIds.length > 1) {
          //   this.deptIds = [this.deptIds[0]]
          // }
          const { xAxis, series } = this.op
          xAxis.data = data.map(e => e.deptName)
          series[0].data = data.map(e => ({
            name: e.deptName,
            value: Number(e.amount) / 100,
            id: e.deptId,
            deptId:
              e.showType === 1 ? this.queryParams.employeeDeptId : undefined,
            isParent: !this.queryParams.employeeDeptId,
            showType: e.showType
          }))

          this.chart.setOption(this.op)
        })
        .catch(() => {
          const { series } = this.op
          series[0].data = []
          this.chart.setOption(this.op)
          this.loading = false
        })
    },
    // 过滤所有的数值
    filterPrice(value) {
      const v = Number(value).toFixed(2)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.departmentChart {
  width: 100%;
  padding: 44px 24px 24px 24px;
  height: 400px;
  background-color: #fff;
  position: relative;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2c3242;
    margin-right: 8px;
    .switch-type {
      width: 146px;
      height: 28px;
      background: #e8ebee;
      border-radius: 4px;
      padding: 1px;
      display: inline-block;
      margin-left: 24px;
      .switch-type-item {
        display: inline-block;
        padding: 4px 24px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #424242;
        cursor: pointer;
        user-select: none;
      }
      .switch-type-item-active {
        background: #ffffff;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2474ff;
      }
    }
    .switch-type-qy {
      width: 75px;
    }
  }
  .dw {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2c3242;
  }
  .title-t {
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
}
.back {
  cursor: pointer;
  user-select: none;
  margin-left: 8px;
  color: #8f8f8f;
  font-weight: initial;
}
</style>
