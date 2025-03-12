<template>
  <div class="wrapper">
    <div class="live-content">
      <goBackHeader
        v-if="pageInfo.type"
        :content="form.deptId ? '部门经营数据' : '企业经营数据'"
        :dept-id="form.deptId"
      />
      <data-overview
        :search="search"
        :search-active="searchActive"
        :title="pageInfo.name"
        :new-time="newTime"
        @submit="queryList"
      />
      <data-panel
        :select-list="selectList"
        :time-list="form"
        :title="panelText"
        :list="list"
        :broken-data="brokenData"
        :broken-qoq-data="brokenQoqData"
        :broken-check="brokenCheck"
        @selectPanel="selectPanel"
        @changeCheck="changeCheck"
      />
      <sales-channels
        :broken-data="brokenData"
        :sell-total-data="sellTotalData"
        :sell-total-day-data="sellTotalDayData"
        :time-list="form"
      />
      <achievement-data :person-total-detail-data="personTotalDetailData" />
    </div>
  </div>
</template>

<script>
import dataOverview from '@/components/AppPanelDataForPerson/dataOverview.vue'
import DataPanel from './components/dataPanel'
import SalesChannels from './components/salesChannels'
import AchievementData from '@/views/business/personalData/components/achievementData'
import goBackHeader from '@/components/goBackHeader'
import { list } from '@/components/AppPanelData/dataList'
import {
  getDataNewTime,
  getExpertSales,
  getExpertSales1,
  getLiveBroadcast,
  getLiveBroadcast1,
  getPersonTotalDetailData,
  getQmv,
  getQmv1,
  getSellTotalData,
  getSellTotalDayData
} from '@/api/business'
import { mapGetters } from 'vuex'
import { typeText } from '@/utils/enum'
export default {
  components: {
    AchievementData,
    SalesChannels,
    DataPanel,
    goBackHeader,
    'data-overview': dataOverview
  },
  data() {
    return {
      selectList: [1],
      newTime: '',
      form: {
        endTime: '',
        startTime: '',
        pageType: 3,
        type: 3,
        userId: '',
        teacherId: ''
        // deptId: 'isTrue', // 部门ID
      },
      pageInfo: null,
      sellTotalData: [],
      searchActive: 0,
      search: {
        time: {
          active: '',
          time: ['', '']
        },
        current: 0
      },
      deptTotalData: [],
      sellTotalDayData: [],
      personTotalDetailData: [],
      brokenQoqData: [],
      brokenCheck: false,
      colorMap: null,
      qoqDataMap: null,
      sellColorMap: null,
      nameMap: null,
      dataMap: null,
      brokenData: [],
      list,
      panelText: '较昨日'
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    // this.chooseDate('week')
    // this.chooseAnLiDate('week')
  },
  created() {
    this.pageInfo = this.$route.query
    this.form.userId = this.pageInfo?.type || this.userInfo.userId
    this.pageInfo.name = this.$route.query.name || this.userInfo.nickName
    this.pageInfo = this.$route.query
    // this.form.channelId = Number(this.$route.query.type) || ''
    // 钻取带进来的参数
    const dataQuery = JSON.parse(sessionStorage.getItem('personalDataQuery'))
    const timeType = new Map([
      [0, ''],
      [1, 0],
      [2, 7],
      [3, 'month'],
      [4, 'year']
    ])
    if (this.$route.query.type) {
      this.form = { ...this.form, ...dataQuery }
      console.log('frsssss', this.form)
      this.form.pageType = 3
      this.searchActive = timeType.get(this.pageInfo.timeType)
        ? timeType.get(this.pageInfo.timeType)
        : this.pageInfo.timeType
      if (this.pageInfo.timeType === 0) {
        this.search = {
          time: {
            active: '',
            time: [this.form.startTime, this.form.endTime]
          },
          current: 0
        }
      } else {
        this.search = {
          time: {
            active: timeType.get(this.pageInfo.timeType)
              ? timeType.get(this.pageInfo.timeType)
              : this.pageInfo.timeType,
            time: [this.form.startTime, this.form.endTime]
          },
          current: 0
        }
      }
    }
    this.colorMap = new Map([
      [1, '#0C6FFF'],
      [2, '#6C27FF'],
      [3, '#FF5962'],
      [4, '#2BC6FE'],
      [5, '#FFCA69'],
      [6, '#00E3DB'],
      [7, '#A5E20D'],
      [8, '#2BC6FE']
    ])
    this.sellColorMap = new Map([
      [1, '#0051FF'],
      [2, '#FA9D3B'],
      [3, '#FF6931'],
      [4, '#0099FF'],
      [10, '#eb800f'],
      [11, '#2BC6FE'],
      [12, '#663645'],
      [13, '#a2dbf1'],
      [14, '#da1430'],
      [15, '#30b06b'],
      [16, '#f57474'],
      [17, '#ca81c7'],
      [20, '#7f9b4c']
    ])

    this.qoqDataMap = new Map([
      [1, ''],
      [2, ''],
      [3, ''],
      [4, ''],
      [5, ''],
      [6, ''],
      [7, ''],
      [8, '']
    ])
    this.nameMap = new Map([
      [1, '个人业绩'],
      [2, '直播带货'],
      [3, '退款金额'],
      [4, '退款订单数'],
      [5, '退款订单数'],
      [6, '直播带货成交金额'],
      [7, '内容带货成交金额'],
      [8, '自然带货成交金额']
    ])
    this.dataMap = new Map([
      [1, ''],
      [2, ''],
      [3, ''],
      [4, ''],
      [5, ''],
      [6, ''],
      [7, ''],
      [8, '']
    ])
    this.list = JSON.parse(JSON.stringify(this.list))
    this.list[0].titleTips = '个人产出业绩总和'
    this.initPage()
    this.updataBroken()

    if (this.$route.query.type) {
      delete this.form.type
      this.queryList(this.form)
    }
  },
  methods: {
    async initPage() {
      // const res = await getDept({})
      const res1 = await getDataNewTime({})
      this.newTime = res1.data
    },
    changeCheck(e) {
      this.brokenCheck = e
    },
    selectPanel(val, list) {
      if (this.brokenCheck) {
        this.selectList = []
        this.selectList.push(val)
        this.updataBroken()
        return
      }
      if (this.selectList.length === 1 && this.selectList.indexOf(val) !== -1) {
        return
      }
      this.brokenCheck = false
      this.selectList.indexOf(val) !== -1
        ? this.selectList.splice(this.selectList.indexOf(val), 1)
        : this.selectList.push(val)
      this.updataBroken()
    },
    setData() {
      this.list.forEach((ele, index) => {
        let arr = []
        let qoqArr = []
        if (ele.orderList) {
          arr = ele.orderList.map(e => e.total)
        }
        if (ele.ringOrderList) {
          qoqArr = ele.ringOrderList.map(e => e.total)
        }
        this.dataMap.set(index + 1, arr)
        this.qoqDataMap.set(index + 1, qoqArr)
      })
      this.list = Object.assign([], this.list)
      this.updataBroken()
    },
    // 查询
    async queryList(item) {
      // this.$loading()
      this.form = { ...this.form, ...item }
      delete this.form.contentName
      delete this.form.lecturerName
      this.panelText = typeText[item.type + '']
      // 内容带货
      getExpertSales(this.form).then(res => {
        this.list[6] = { ...this.list[6], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 内容带货
          getExpertSales1(this.form).then(res => {
            const { orderList, ringOrderList } = res.data
            this.list[6] = { ...this.list[6], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 成交金额
      getQmv(this.form).then(res => {
        this.list[0] = { ...this.list[0], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 成交金额
          getQmv1(this.form).then(res => {
            const { orderList, ringOrderList } = res.data
            this.list[0] = { ...this.list[0], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 直播带货
      getLiveBroadcast(this.form).then(res => {
        this.list[5] = { ...this.list[5], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 直播带货
          getLiveBroadcast1(this.form).then(res => {
            const { orderList, ringOrderList } = res.data
            this.list[5] = { ...this.list[5], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })

      getSellTotalData({ ...this.form, deptId: this.form.deptId }).then(res => {
        const newArr = res.data.filter(item => item.orderChannel !== 5)
        this.sellTotalData = Object.assign([], newArr)
      })
      getSellTotalDayData({ ...this.form, deptId: this.form.deptId }).then(
        res => {
          const newArr = res.data.filter(item => item.orderChannel !== 5)
          // 渠道折线图
          const arr = []
          newArr.forEach((e, ind) => {
            arr.push({
              color: this.sellColorMap.get(e.orderChannel),
              name: e.name,
              type: 'line',
              smooth: true,
              data: e.sellChannelsDayDetailList.map(k =>
                Number(Number(k.totalCount / 100))
              )
            })
          })
          this.sellTotalDayData = Object.assign([], arr)
        }
      )
      getPersonTotalDetailData({
        ...this.form,
        deptId: this.form.deptId,
        teacherId: this.form.teacherId
      }).then(res => {
        this.personTotalDetailData = res.data
      })
    },
    updataBroken() {
      const arr = []
      const qoqArr = []
      this.selectList.forEach(e => {
        if (this.dataMap.get(e)) {
          arr.push({
            color: this.colorMap.get(e),
            name: this.nameMap.get(e),
            type: 'line',
            symbol: 'circle',
            smooth: true,
            data: this.dataMap.get(e).map(k => {
              if (e === 5 || e === 4) {
                return Number(k)
              } else {
                return Number(k / 100)
              }
            })
          })
          qoqArr.push({
            color: this.colorMap.get(e),
            name: '环比',
            type: 'line',
            smooth: true,
            lineStyle: {
              type: 'dashed'
            },
            data: this.qoqDataMap.get(e).map(k => {
              if (e === 5 || e === 4) {
                return Number(k)
              } else {
                return Number(k / 100)
              }
            })
          })
        }
      })
      this.brokenData = arr
      this.brokenQoqData = qoqArr
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

.live-content {
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}

.secord-content {
  margin-top: 20px;
}

::v-deep .el-range__icon {
  display: none;
}

.tearchfor {
  margin-top: 20px;
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
</style>
