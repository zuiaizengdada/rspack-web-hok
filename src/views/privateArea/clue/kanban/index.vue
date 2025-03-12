<template>
  <div class="kabanWarp">
    <div class="titleBox">
      <span class="gopath" @click="handleGoPath">线索管理</span>
      <img
        v-if="taskName"
        src="@/assets/image/left_icon.png"
        alt=""
        @click="handleGoPath"
      />
      <span v-if="taskName">{{ taskName }}</span>
    </div>
    <div class="contentBox">
      <filterTop
        ref="filterTop"
        :card-list="cardList"
        :data-type="dataType"
        :stat-date="statDate"
        @handleOk="handleSeach"
      />
      <pieChart :select-ratio="selectRatio" />
      <tableList
        :loading="loading"
        style="margin-top: 32px"
        :list-data="followerDetail"
        :page-data.sync="pageData"
        :total="total"
        @handleClue="handleClue"
        @updateList="getTaskFollowerDetail"
        @orderChange="orderChange"
      />
      <!-- <addQwProcessTable ref="addQwProcessTable" /> -->
    </div>
  </div>
</template>
<script>
import filterTop from './components/filterTop.vue'
import tableList from './components/tableList.vue'
import pieChart from './components/pieChart.vue'
// import addQwProcessTable from './components/addQwProcessTable'
import { mapGetters, mapActions } from 'vuex'
import { saleTaskPage } from '@/api/privateArea/toolbox'
import cardList from './cardList.js'
import {
  getTaskSelectData,
  getTaskFollowerDetail,
  getTaskSelectRatio
} from '@/api/privateArea/clue'
import { getLiveRoomOrgConfig } from '@/api/liveRoom/index.js'
export default {
  components: {
    filterTop,
    tableList,
    pieChart
    // addQwProcessTable
  },
  data: () => ({
    taskName: '',
    dataType: 1,
    taskId: '',
    loading: false,
    statDate: '',
    cardList,
    taskLiveDetail: '',
    total: 0,
    selectRatio: [
      {
        label: '来源渠道占比',
        text: '按线索转化率',
        data: []
      },
      {
        label: '直播成交占比',
        text: '按成交金额',
        data: []
      }
    ],
    search: {},
    followerDetail: [],
    // 分页器
    pageData: {
      pageIndex: 1,
      pageSize: 10
    }
  }),
  created() {
    this.init()
    console.log(this.$store.state.user)
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  methods: {
    ...mapActions('user', ['setSingleHistory']),
    getRouteInfo(routeName) {
      let routeInfo = null
      this.$router?.matcher?.match?.forEach(routeRecord => {
        if (routeRecord.name === routeName) {
          routeInfo = routeRecord
        }
      })
      return routeInfo
    },
    authority(path) {
      return this.$router.matcher
        .match(path)
        ?.meta?.permsList?.includes('web:clue:list')
    },
    handleClue(data) {
      const params = {
        ...data,
        channelId: this.search.channelId,
        teacherId: this.search.teacherId,
        isAddQw: 0,
        isAddGw: 0,
        taskId: this.taskId
      }
      const isAvailable = this.$refs?.filterTop?.form.isAvailable
      params.isAvailable = isAvailable
      const isClueMy = this.authority('/privateArea/clue/clueMy')
      const isClueDepartment = this.authority(
        '/privateArea/clue/clueDepartment'
      )
      const isClueAll = this.authority('/privateArea/clue/clueAll')
      const userId = this.$store.state?.user?.userInfo?.userId
      this.setSingleHistory('/privateArea/clue')
      if (params.followUserId === userId && isClueMy) {
        this.$router.replace({ name: 'clueMy', params })
        return
      }
      if (isClueAll) {
        this.$router.replace({ name: 'clueAll', params })
        return
      }
      if (!isClueAll && isClueDepartment) {
        this.$router.replace({ name: 'clueDepartment', params })
        return
      }
      if (isClueMy) {
        this.$router.replace({ name: 'clueMy', params })
        return
      }
    },
    handleGoPath() {
      this.$router.go(-1)
    },
    init() {
      // 存储传递信息
      this.taskName = this.$route.query.taskName
      this.taskId = this.$route.query.taskId
      this.dataType = Number(this.$route.query.dataType)
      // 数据查询
      this.handleSeach()
      this.getLiveRoomOrgConfig()
    },
    // 查询详情
    async getTaskFollowerDetails(value) {
      if (this.taskLiveDetail) return this.getTaskSelectRatio(value) // 占比
      const { code, data } = await saleTaskPage({ taskId: this.taskId })
      if (code === 1) this.taskLiveDetail = data
      this.getTaskSelectRatio(value) // 占比
    },
    async getLiveRoomOrgConfig() {
      const { data } = await getLiveRoomOrgConfig()
      this.cardList[6].tips = `在直播间中观看时长大于等于${data.attendClassTime}分钟的线索数`
      this.cardList[7].tips = `在直播间中观看时长大于等于${data.finishClassTime}分钟的线索数`
    },
    // 数据概括数据处理
    dataformatting(data) {
      const {
        statDate,
        clueNum,
        addInvitationsNum,
        addInvitationsRatio,
        coursesNum,
        coursesRatio,
        completedCoursesNum,
        completedCoursesRatio,
        registrationsNum,
        registrationsRatio,
        coursesTransRatio,
        completedCoursesTransRatio,
        conversionsNum,
        convertedOrdersNum,
        convertedOrdersRatio,
        conversionAmount,
        refundAmount,
        revenueAmount,
        totalAmount,
        callNum = 0,
        sendSmsNum = 0,
        addWxNum,
        addQwNum,
        addQwAutoNum,
        addQwManualNum,
        addGwNum,
        addWxRatio,
        addQwRatio,
        addQwAutoRatio,
        addQwManualRatio,
        addGwRatio,
        refundNum,
        refundRatio
      } = data
      this.statDate = statDate
      this.cardList[0].value = clueNum
      this.cardList[1].value = callNum
      // this.cardList[1].basisRatio = this.filtersMoneyByZero(callSucessRatio)
      this.cardList[2].value = sendSmsNum
      // this.cardList[2].basisRatio = this.filtersMoneyByZero(smsSucessNumRatio)
      this.cardList[3].value = [
        addWxNum,
        addQwNum,
        addQwAutoNum,
        addQwManualNum,
        addGwNum
      ]
      this.cardList[3].addWxRate = [
        this.filtersMoneyByZero(addWxRatio),
        this.filtersMoneyByZero(addQwRatio),
        this.filtersMoneyByZero(addQwAutoRatio),
        this.filtersMoneyByZero(addQwManualRatio),
        this.filtersMoneyByZero(addGwRatio)
      ]
      this.cardList[4].value = addInvitationsNum
      this.cardList[4].basisRatio = [
        this.filtersMoneyByZero(addInvitationsRatio)
      ]
      this.cardList[5].value = registrationsNum
      this.cardList[5].basisRatio = [
        this.filtersMoneyByZero(registrationsRatio)
      ]
      this.cardList[6].value = coursesNum
      this.cardList[6].basisRatio = [
        this.filtersMoneyByZero(coursesRatio),
        this.filtersMoneyByZero(coursesTransRatio)
      ]
      this.cardList[7].value = completedCoursesNum
      this.cardList[7].basisRatio = [
        this.filtersMoneyByZero(completedCoursesRatio),
        this.filtersMoneyByZero(completedCoursesTransRatio)
      ]
      this.cardList[8].value = conversionsNum
      this.cardList[9].value = convertedOrdersNum
      this.cardList[9].basisRatio = [
        this.filtersMoneyByZero(convertedOrdersRatio)
      ]

      this.cardList[10].value = this.initNum(conversionAmount)
      this.cardList[11].value = this.initNum(refundAmount)
      this.cardList[12].value = this.initNum(revenueAmount)
      this.cardList[13].value = this.initNum(totalAmount)
      this.cardList[14].value = refundNum
      this.cardList[14].basisRatio = [
        this.filtersMoneyByZero(refundRatio)
      ]
    },
    initNum(num = 0) {
      return (Number(num) / 100).toFixed(2)
    },
    // 饼图数据处理
    selectRatioFormatting(data) {
      const { inLiveAmountRatio, outLiveAmountRatio, channelRatioList } = data
      let dataTwo = []
      // 存在直播间
      if (this.taskLiveDetail.length) {
        dataTwo = [
          {
            name: '非直播间',
            value: outLiveAmountRatio
          },
          {
            name: '直播间',
            value: inLiveAmountRatio
          }
        ]
      }
      const newDataTwo = dataTwo?.filter(item => item.value > 0) || []
      this.selectRatio[1].data = newDataTwo
      if (!this.taskLiveDetail?.length || Number(this.dataType) === 2) {
        this.selectRatio[0].data = []
        return
      }
      const dataOne =
        channelRatioList?.map(item => {
          const { channelId, ratio } = item
          const label = this.channelSourceType.find(
            items => items.value === channelId
          )?.label
          return {
            name: label,
            value: ratio
          }
        }) || []
      const newDataOne = dataOne?.filter(item => item.value > 0) || []
      this.selectRatio[0].data = [...newDataOne]
    },
    // 数据概括
    async getTaskSelectData(dataForm = {}) {
      if (!this.taskId) return
      const param = {
        taskId: this.taskId,
        ...dataForm
      }
      const { code, data } = await getTaskSelectData(param)
      if (code === 1 && data) this.dataformatting(data)
    },
    // 跟进人数据汇总
    async getTaskFollowerDetail(dataForm = {}) {
      if (!this.taskId) return
      this.loading = true
      const param = {
        taskId: this.taskId,
        ...dataForm,
        column: dataForm?.sort ? dataForm?.column : '',
        ...this.pageData
      }
      try {
        const { code, data } = await getTaskFollowerDetail(param)
        if (code === 1 && data) {
          this.followerDetail = data.items
          this.total = data.total
        }
      } catch {
        this.loading = false
      }
      this.loading = false
    },
    // 占比
    async getTaskSelectRatio(dataForm = {}) {
      if (!this.taskId) return
      const param = {
        taskId: this.taskId,
        ...dataForm
      }
      const { code, data } = await getTaskSelectRatio(param)
      if (code === 1 && data) this.selectRatioFormatting(data)
    },

    handleSeach(data = {}) {
      this.search = data
      this.getTaskSelectData(data) // 数据概括
      this.getTaskFollowerDetail(data) // 跟进人数据汇总
      this.getTaskFollowerDetails(data)
    },
    orderChange(sortData) {
      this.getTaskFollowerDetail({ ...this.search, ...sortData })
    },
    filtersMoneyByZero(num) {
      return `${((num || 0) / 100).toFixed(2)}%`
    }
  }
}
</script>
<style lang="scss" scoped>
.gopath {
  cursor: pointer;
}
.kabanWarp {
  position: relative;
  top: 0;
  height: calc(100vh - 240px);
}
.contentBox {
  padding-bottom: 20px;
  background: #f6faff;
}
.titleBox {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  padding-left: 19px;
  padding-bottom: 20px;
  > span:nth-of-type(1) {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
  }
  > img {
    height: 16px;
    margin: 0 20px;
  }
  > span:nth-of-type(2) {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    line-height: 24px;
  }
}
</style>
