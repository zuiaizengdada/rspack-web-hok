<template>
  <div class="wrapper">
    <div class="content">
      <!--  查询条件 -->
      <Head ref="headRef" :new-time="newTime" @change="submitSearch" />
      <!--  数据分类——成交金额,退款金额,内容带货,直播带货,自然成交 -->
      <grid ref="gridChunkRef" @gridChage="gridChage" />
      <div v-if="queryParams.isRevenue" class="row">
        <!-- 渠道业绩 -->
        <channel ref="channelRef" @checkItem="checkItem" />
        <!-- 占比饼图 -->
        <typeProportion ref="typeProportionRef" />
        <!-- 免费/付费占比饼图 -->
        <payProportion ref="payProportionRef" />
      </div>
      <!-- 折线图 -->
      <lineChart v-if="queryParams.isRevenue" ref="lineChartRef" />
      <member-data ref="memberDataRef" />
    </div>
  </div>
</template>
<script>
import Head from './components/head/index.vue'
import grid from './components/grid/index.vue'
import channel from './components/channel/index.vue'
import typeProportion from './components/typeProportion/index.vue'
import payProportion from './components/payProportion/index.vue'
import lineChart from './components/lineChart/index.vue'
import memberData from './components/memberData/index.vue'
export default {
  components: {
    Head,
    grid,
    channel,
    typeProportion,
    payProportion,
    lineChart,
    memberData
  },
  data() {
    return {
      newTime: '',
      queryParams: {
        isRevenue: true,
        startTime: '',
        endTime: '',
        type: 1,
        bizType: 3,
        deptId: undefined,
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
      }
    }
  },
  created() {
    this.$nextTick(() => {
      console.log(this.queryParams.deptId, 'this.queryParams.deptId')
      const tmpInfo = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      this.$refs.headRef.form.changeIsRevenue = undefined
      this.queryParams.deptIsRevenue = undefined
      if (tmpInfo) {
        this.queryParams.isRevenue = tmpInfo?.isRevenue
      }
      this.init({
        ...this.$refs.headRef.form,
        isRevenue: this.queryParams.isRevenue,
        isSearchGrid: true,
        deptId: tmpInfo?.deptId,
        employeeUid: this.$route.query?.uId
          ? this.$route.query?.uId
          : this.$store.getters.userInfo.userId,
        productCategory: tmpInfo?.productCategory,
        goodsId: tmpInfo?.goodsId,
        teacherIdList: tmpInfo?.teacherIdList,
        time: tmpInfo?.time ? tmpInfo?.time : this.$refs.headRef.form.time
      })
      this.$refs.headRef.form.time = tmpInfo.time
      if (tmpInfo.refsValue) {
        this.$nextTick(() => {
          console.log('sssssss:', this.$refs.gridChunkRef.$refs[tmpInfo.refsValue])
          setTimeout(() => {
            this.$refs.gridChunkRef.$refs[tmpInfo.refsValue].handleClick(tmpInfo.refKey, tmpInfo.refsValue)
          }, 300)
        })
      }
      if (tmpInfo.isShowLogo) {
        setTimeout(() => {
          this.queryParams.isShowLogo = tmpInfo.isShowLogo
          this.$refs.channelRef.toDetail(tmpInfo.quDaoDetailRecord)
        }, 500)
      } else {
        if (tmpInfo.quDaoRecord) {
          setTimeout(() => {
            this.$refs.channelRef.checkItem(tmpInfo.quDaoRecord)
          }, 500)
        }
      }
    })
    // 监听页面刷新
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('tmpFormPersonBoardHK')
    })
  },

  methods: {
    // 渠道业绩组件 选择回调
    checkItem(record) {
      this.queryParams.isSearchGrid = true
      this.queryParams.isShowLogo = record.isShowLogo
      this.queryParams.logoImgUrl = record.logoImgUrl
      this.queryParams.isCheckChannel = record.isCheck
      this.queryParams.shopId = record.shopId
      this.queryParams.orderChannel = record.orderChannel
      this.queryParams.channelLogoName = record.name
      this.queryParams.channelLevel = record.channelLevel

      this.init()
    },
    // 订单来源组件 选择回调
    gridChage(key) {
      this.queryParams.isSearchGrid = true
      this.queryParams.bizType = key
      this.init()
    },
    // 搜索提交回调
    submitSearch(data, goodsInfo) {
      this.queryParams.isCheckChannel = false
      if (data.bizType) {
        this.queryParams.bizType = data.bizType
      }
      const params = {
        ...data,
        isSearchGrid: true,
        deptId: this.queryParams.deptId
      }
      if (data.changeIsRevenue) {
        this.$refs.headRef.form.changeIsRevenue = undefined
        this.queryParams.deptIsRevenue = undefined
        this.queryParams.bizType = this.$refs.gridChunkRef.getBizType({
          ...data,
          bizType: this.queryParams.bizType
        })
      }
      this.init({
        ...params
      })
    },
    // 时间组件 重置回调
    resetFormSearch(record) {
      this.queryParams.isCheckChannel = false
      this.queryParams.channelLevel = undefined
      this.queryParams.shopId = undefined
      this.queryParams.isShowLogo = false
      this.init({
        ...record,
        isSearchGrid: true
      })
    },
    // 初始化
    init(record) {
      if (record) {
        this.queryParams = {
          ...record,
          bizType: this.queryParams.bizType,
          isShowLogo: this.queryParams.isShowLogo,
          logoImgUrl: this.queryParams.logoImgUrl,
          shopId: this.queryParams.shopId,
          channelLogoName: this.queryParams.channelLogoName,
          channelLevel: this.queryParams.channelLevel,
          orderChannel: this.queryParams.orderChannel,
          startTime: record.time.time[0],
          endTime: record.time.time[1],
          type: record.time.active,
          isCheckChannel: this.queryParams.isCheckChannel,
          isRevenue: record.isRevenue,
          deptId: record.deptId
        }
        // delete this.queryParams.time
      }
      console.log('queryParams::::::', this.queryParams)
      this.$nextTick(() => {
        // isSearchGrid为true时，查询grid组件
        if (this.queryParams.isSearchGrid) {
          this.$refs.gridChunkRef.initData(this.queryParams)
        }

        // 判断渠道业绩是否查询
        if (this.queryParams.isRevenue) {
          this.$refs.channelRef.initData(this.queryParams)
        }
        if (this.queryParams.isRevenue) {
          this.$refs.typeProportionRef.initData(this.queryParams)
          this.$refs.payProportionRef.initData(this.queryParams)
          this.$refs.lineChartRef.initData(this.queryParams)
        }
        this.$refs.memberDataRef.initData(this.queryParams)
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
