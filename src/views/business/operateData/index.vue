<template>
  <div class="wrapper">
    <div class="content">
      <!--  查询条件 -->
      <Head
        ref="headRef"
        :new-time="newTime"
        @change="submitSearch"
        @resetForm="resetFormSearch"
      />
      <!--  数据分类——成交金额,退款金额,内容带货,直播带货,自然成交 -->
      <grid ref="gridChunkRef" @gridChage="gridChage" />
      <div class="row">
        <!-- 渠道业绩 -->
        <channel ref="channelRef" @checkItem="checkItem" />
        <!-- 占比饼图 -->
        <typeProportion ref="typeProportionRef" />
        <!-- 免费/付费占比饼图 -->
        <payProportion ref="payProportionRef" />
      </div>
      <!-- 折线图 -->
      <lineChart ref="lineChartRef" />
      <!-- 柱状图 -->
      <department
        ref="departmentRef"
        @deptIdEmit="setDeptId"
        @goPage="goPersonalPage"
      />
      <member-data
        v-if="queryParams.deptId"
        :person-total-data="personTotalData"
        :person-total-count="personTotalCountall"
        @goPage="goPersonalPage"
      />
    </div>
  </div>
</template>
<script>
import {
  getPersonTotalData,
  getPersonTotalCount,
  getSystemUserRole
} from '@/api/business'
import Head from './components/head/index.vue'
import grid from './components/grid/index.vue'
import channel from './components/channel/index.vue'
import typeProportion from './components/typeProportion/index.vue'
import payProportion from './components/payProportion/index.vue'
import lineChart from './components/lineChart/index.vue'
import department from './components/departmentChart/index.vue'
import memberData from './components/memberData/index.vue'
import { orderSourceFilter } from './components/utils'
export default {
  components: {
    Head,
    grid,
    channel,
    typeProportion,
    payProportion,
    lineChart,
    department,
    memberData
  },
  data() {
    return {
      newTime: '',
      queryParams: {
        startTime: '',
        endTime: '',
        type: 1, // 时间组件状态
        orderSource: '-1', // 订单来源
        pageType: 1, // 页面位置
        isSearchGrid: false // 是否查询grid组件
      },
      goodsInfo: {},
      personTotalData: [],
      personTotalCountall: {
        contentGoodsCountTotal: 0,
        contentCountOrder: 0,
        liveGoodsCountTotal: 0,
        liveCountOrder: 0,
        personTotalCount: 0,
        personOrderTotalCount: 0,
        refundCountRatio: 0
      },
      pageType: 1 // 页面位置 1.企业 2.部门 3.个人 4.渠道 5.店铺
    }
  },
  created() {
    // 判断是否有权限 企业管理员 部门管理员
    getSystemUserRole().then(res => {
      if (res.code === 1) {
        const { corpMangerFlag, deptManagerFlag, subDeptId } = res.data
        if (corpMangerFlag === 1 && deptManagerFlag === 1) {
          this.$message({
            message: '没有权限访问',
            type: 'warning'
          })
          return
        }

        if (corpMangerFlag === 1 && deptManagerFlag === 2) {
          this.$refs.headRef.form.deptId = subDeptId
        }
        this.init({ ...this.$refs.headRef.form, isSearchGrid: true })
      }
    })
  },
  methods: {
    // 部门柱状图 选择回调
    setDeptId(id) {
      this.queryParams.isSearchGrid = true
      this.queryParams.isDeptId = true
      this.queryParams.deptId = id
      this.$refs.headRef.form.deptId = id
      this.init()
    },
    // 跳转个人经营数据
    goPersonalPage(record) {
      const searchQuery = { ...this.$refs.headRef.form }
      sessionStorage.setItem(
        'personalDataQuery',
        JSON.stringify({
          ...searchQuery,
          time: {
            active: searchQuery.time.active,
            time: searchQuery.time.time
              ? [searchQuery.time.time[0], searchQuery.time.time[1]]
              : []
          },
          ...{ goodsInfo: this.goodsInfo }
        })
      )
      this.$router.push({
        path: `/business/personalData?type=${record.staffId}&name=${record.personName}`
      })
    },
    // 渠道业绩组件 选择回调
    checkItem(record) {
      this.queryParams.isDeptId = false
      this.queryParams.isSearchGrid = true
      this.queryParams.isShowLogo = record.isShowLogo
      this.queryParams.logoImgUrl = record.logoImgUrl
      this.queryParams.channelId = record.orderChannel
      this.queryParams.isCheckChannel = record.isCheck
      this.queryParams.shopId = record.shopId
      this.queryParams.channelLogoName = record.name
      this.queryParams.channelLevel = record.channelLevel
      this.$refs.headRef.form.channelId = record.orderChannel

      this.init()
    },
    // 订单来源组件 选择回调
    gridChage(key) {
      this.queryParams.isSearchGrid = false
      this.queryParams.isDeptId = false
      // 判断渠道层级 清空id
      // if (
      //   !this.queryParams.channelLevel ||
      //   this.queryParams.channelLevel === 1
      // ) {
      //   this.queryParams.channelId = undefined
      //   this.$refs.headRef.form.channelId = undefined
      // }
      this.queryParams.orderSource = key
      this.init()
    },
    // 搜索提交回调
    submitSearch(data, goodsInfo) {
      if (data.channelId !== this.queryParams.channelId) {
        this.queryParams.isShowLogo = false
        this.queryParams.isCheckChanne = false
        this.queryParams.channelLevel = 1
        this.queryParams.shopId = undefined
      }
      this.queryParams.isDeptId = false
      this.goodsInfo = { ...goodsInfo }
      this.queryParams.isShowLogo = this.queryParams.isShowLogo
        ? !!data.channelId
        : false
      // this.queryParams.channelLevel = data.channelId
      //   ? this.queryParams.channelLevel
      //   : undefined
      this.queryParams.isCheckChannel = false
      // this.queryParams.shopId = data.channelId
      //   ? this.queryParams.shopId
      //   : undefined
      this.init({ ...data, isSearchGrid: true })
    },
    // 时间组件 重置回调
    resetFormSearch(record) {
      this.queryParams.isCheckChannel = false
      this.queryParams.channelLevel = undefined
      this.queryParams.channelId = undefined
      this.queryParams.shopId = undefined
      this.queryParams.isShowLogo = false
      this.init({
        ...record,
        isSearchGrid: true,
        orderSource: this.queryParams.orderSource
      })
    },
    // 初始化
    init(record) {
      if (record) {
        this.queryParams = {
          ...record,
          isShowLogo: this.queryParams.isShowLogo,
          logoImgUrl: this.queryParams.logoImgUrl,
          channelId: record.channelId,
          shopId: record.channelId ? this.queryParams.shopId : undefined,
          channelLogoName: this.queryParams.channelLogoName,
          channelLevel: this.queryParams.channelLevel,
          orderSource: this.queryParams.orderSource,
          startTime: record.time.time[0],
          endTime: record.time.time[1],
          type: record.time.active,
          isCheckChannel: this.queryParams.isCheckChannel
        }
        delete this.queryParams.time
      }
      // 判断页面位置 依次判断
      this.queryParams.pageType = this.queryParams.shopId
        ? 5
        : this.queryParams.channelId
          ? 4
          : this.queryParams.deptId
            ? 2
            : 1

      this.$nextTick(() => {
        // isSearchGrid为true时，查询grid组件
        if (this.queryParams.isSearchGrid) {
          this.$refs.gridChunkRef.initData(this.queryParams)
        }

        // 判断渠道业绩是否查询
        if (
          !this.queryParams.isCheckChannel ||
          this.$refs.channelRef.queryParams.orderSource !==
            this.queryParams.orderSource ||
          this.$refs.channelRef.queryParams.deptId !== this.queryParams.deptId
        ) {
          this.$refs.channelRef.initData(this.queryParams)
        }

        this.$refs.typeProportionRef.initData(this.queryParams)
        this.$refs.payProportionRef.initData(this.queryParams)
        this.$refs.lineChartRef.initData(this.queryParams)
        if (!this.queryParams.isDeptId) {
          this.$refs.departmentRef.initData(this.queryParams)
        } else {
          this.queryParams.isDeptId = false
        }
        if (this.queryParams.deptId) {
          getPersonTotalData({
            ...this.queryParams,
            orderSource: orderSourceFilter(this.queryParams.orderSource),
            type: this.queryParams.type === 0 ? 1 : this.queryParams.type
          }).then(res => {
            this.personTotalData = Object.assign([], res.data)
          })
          getPersonTotalCount({
            ...this.queryParams,
            orderSource: orderSourceFilter(this.queryParams.orderSource),
            type: this.queryParams.type === 0 ? 1 : this.queryParams.type
          }).then(res => {
            this.personTotalCountall = {
              ...this.personTotalCountall,
              ...res.data
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #f8fafb;
  position: relative;
  border-radius: 10px;
  min-width: 1300px;

  .content {
    width: 100%;
    padding: 20px;

    .row {
      display: flex;
      align-items: center;
      margin: 24px 0;
    }
  }
}
</style>
