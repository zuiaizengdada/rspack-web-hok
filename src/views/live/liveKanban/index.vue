<template>
  <!-- 直播看板数据大屏 -->
  <el-row class="page_wrap">
    <el-col class="page_wrap_left" :span="6">
      <div class="page_wrap_left_1"><transactionTrendChart ref="transactionTrendChart" /></div>
      <div class="page_wrap_left_2"><populationTrendChart ref="populationTrendChart" /></div>
      <div class="page_wrap_left_3"><trafficSource ref="trafficSource" /></div>
    </el-col>
    <el-col class="page_wrap_center" :span="12">
      <div class="page_wrap_center_1"><liveScreen :data="liveScreenData" :screen-transaction-amount="screenTransactionAmount" /></div>
      <div class="page_wrap_center_2"><productTransactions :data="productTransactionsData" :order-by="orderBy" @sortFn="sortFn" /></div>
    </el-col>
    <el-col class="page_wrap_right" :span="6">
      <div class="page_wrap_right_1"><liveRoomPeople :data="liveRoomPeopleData" /></div>
      <div class="page_wrap_right_2"><liveBrodcast /></div>
    </el-col>
  </el-row>
</template>

<script>
import liveBrodcast from './components/liveBroadcast.vue'
import liveRoomPeople from './components/liveRoomPeople.vue'
import liveScreen from './components/liveScreen.vue'
import populationTrendChart from './components/populationTrendChart.vue'
import productTransactions from './components/productTransactions.vue'
import trafficSource from './components/trafficSource.vue'
import transactionTrendChart from './components/transactionTrendChart.vue'
import {
  getChannelInfo,
  getGoodsPurchaseRecord,
  getliveBroadcastLargeScreenInfo,
  getliveBroadcastLargeScreenPeopleTrend,
  getliveBroadcastLargeScreenPersonNumber,
  getliveBroadcastLargeScreenPurchaseTrend,
  getliveBroadcastLargeScreenTransactionAmount
} from '@/api/liveRoom/kanban.js'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {
    liveBrodcast,
    liveRoomPeople,
    liveScreen,
    populationTrendChart,
    productTransactions,
    trafficSource,
    transactionTrendChart
  },
  data() {
    return {
      loading: false,
      timer1: null, // 一分钟更新一次数据
      timer2: null,
      timer3: null, // 3分钟更新一次数据
      timer4: null,
      queryDate: moment().format('YYYY-MM-DD'),
      liveRoomPeopleData: {
        commentOnTotalTimes: 0,
        entryPeopleNum: 0,
        leavePeopleNum: 0,
        watchTotalTimes: 0
      },
      liveScreenData: {
        liveDuration: '',
        name: '',
        startTime: ''
      },
      screenTransactionAmount: {
        avgWatchTimes: 0, // 人均观看时长
        clickConversionRate: 0, // 点击转化率
        onlinePersonNumber: 0, // 实时在线人数
        purchaseOrderTotalNum: 0, // 	成交总数
        purchasePeopleTotalNum: 0, // 成交总人数
        watchTotalTimes: 0, // 累计观看次数
        purchaseOrderTotalAmount: 0 // 成交总金额
      },
      productTransactionsData: [],
      orderBy: 0 // 0上架时间排序 1成交金额排序
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      pushFlowSwitch: state => state.im.pushFlowSwitch
    })
  },
  watch: {
    'pushFlowSwitch': {
      handler(val) {
        console.log('pushFlowSwitch改变', val)
        // console.log(this.videoUrl, 'videoUrl')
        // this.videoUrl && this.setUrl()
        if (val === 2) {
          // 直播暂停
          clearInterval(this.timer4)
        } else if (val === 1) {
          // 直播开始
          this.getliveBroadcastLargeScreenInfo()
        } else if (val === 0) {
          // 直播结束
          clearInterval(this.timer4)
        }
      }
    }
  },
  destroyed() {
    this.timer1 && clearInterval(this.timer1)
    this.timer2 && clearInterval(this.timer2)
    this.timer3 && clearInterval(this.timer3)
  },
  mounted() {
    this.getDataTime1()
    this.getDataTime3()
    this.timer1 = setInterval(() => {
      this.getDataTime1()
    }, 1 * 60 * 1000)
    this.timer3 = setInterval(() => {
      this.getDataTime3()
    }, 3 * 60 * 1000)
    this.timer2 = setInterval(() => {
      this.getliveBroadcastLargeScreenInfo()
      this.getGoodsPurchaseRecord()
    }, 3 * 1000)
  },
  methods: {
    init() {
      // this.getliveBroadcastLargeScreenPurchaseTrend()
      // this.getChannelInfo()
      // this.getliveBroadcastLargeScreenPeopleTrend()
    },
    getDataTime1() {
      // this.getliveBroadcastLargeScreenInfo()
      this.getliveBroadcastLargeScreenPersonNumber()
      // this.getGoodsPurchaseRecord()
      this.getliveBroadcastLargeScreenTransactionAmount()
    },
    getDataTime3() {
      this.getliveBroadcastLargeScreenPurchaseTrend()
      this.getliveBroadcastLargeScreenPeopleTrend()
      this.getChannelInfo()
    },
    // 获取直播间详情
    getliveBroadcastLargeScreenInfo() {
      getliveBroadcastLargeScreenInfo({ liveRoomId: this.$route.params.id }).then(res => {
        console.log(res, '获取直播间详情')
        res.data.liveDuration = res.data.liveDuration / 1000
        this.liveScreenData = res.data
        clearInterval(this.timer4)
        if (res.data.status === 1) {
          // 直播未开始
          this.timer4 = setInterval(() => {
            this.liveScreenData.liveDuration += 1
          }, 1000)
        }
      })
    },
    // 获取直播间人数
    getliveBroadcastLargeScreenPersonNumber() {
      getliveBroadcastLargeScreenPersonNumber({ liveRoomId: this.$route.params.id }).then(res => {
        this.liveRoomPeopleData = res.data
        console.log(res, '获取直播间人数')
      })
    },
    // 获取成交趋势图
    getliveBroadcastLargeScreenPurchaseTrend() {
      getliveBroadcastLargeScreenPurchaseTrend({ liveRoomId: this.$route.params.id }).then(res => {
        console.log(res, '获取成交趋势图')
        const data1 = []
        const data2 = []
        res?.data?.map(v => {
          data1.push({ name: new Date(v.statDate), value: [new Date(v.statDate), v.purchaseOrderNum] })
          data2.push({ name: new Date(v.statDate), value: [new Date(v.statDate), v.purchasePeopleNum] })
        })
        this.$refs.transactionTrendChart && this.$refs.transactionTrendChart.setOptions({ data1, data2 })
      })
    },
    // 获取人数趋势图
    getliveBroadcastLargeScreenPeopleTrend() {
      getliveBroadcastLargeScreenPeopleTrend({ liveRoomId: this.$route.params.id }).then(res => {
        console.log(res, '获取人数趋势图')
        const data1 = []
        const data2 = []
        res?.data?.map(v => {
          data1.push({ name: new Date(v.statDate), value: [new Date(v.statDate), v.entryPeopleNum] })
          data2.push({ name: new Date(v.statDate), value: [new Date(v.statDate), v.leavePeopleNum] })
        })
        console.log(data1, data2)
        this.$refs.populationTrendChart && this.$refs.populationTrendChart.setOptions({ data1, data2 })
      })
    },
    // 获取商品交易记录
    getGoodsPurchaseRecord() {
      getGoodsPurchaseRecord({ liveRoomId: this.$route.params.id, orderBy: this.orderBy }).then(res => {
        console.log(res, '获取商品交易记录')
        this.productTransactionsData = res.data
      })
    },
    // 获取流量来源
    getChannelInfo() {
      getChannelInfo({ liveRoomId: this.$route.params.id }).then(res => {
        console.log(res, '获取流量来源')
        this.$refs.trafficSource && this.$refs.trafficSource.setOptions(res?.data)
      })
    },
    // 获取直播间成交金额
    getliveBroadcastLargeScreenTransactionAmount() {
      getliveBroadcastLargeScreenTransactionAmount({ liveRoomId: this.$route.params.id }).then(res => {
        console.log(res, '获取直播间成交金额')
        this.numFun(
          this.screenTransactionAmount.purchaseOrderTotalAmount,
          res.data.purchaseOrderTotalAmount,
          'purchaseOrderTotalAmount',
          'screenTransactionAmount'
        )
        this.screenTransactionAmount.watchTotalTimes = res.data.watchTotalTimes
        this.screenTransactionAmount.purchasePeopleTotalNum = res.data.purchasePeopleTotalNum
        this.screenTransactionAmount.purchaseOrderTotalNum = res.data.purchaseOrderTotalNum
        this.screenTransactionAmount.onlinePersonNumber = res.data.onlinePersonNumber
        this.screenTransactionAmount.clickConversionRate = res.data.clickConversionRate
        this.screenTransactionAmount.avgWatchTimes = res.data.avgWatchTimes
      })
    },
    numFun(startNum, maxNum, key, formKey) {
      const duration = 0.5 * 60 // 时长多少秒执行完毕
      var step = ((maxNum - startNum) / duration)// 步长
      var that = this
      let numText = startNum || 0
      let golb // 为了清除requestAnimationFrame
      function numSlideFun() { // 数字动画
        numText += step// 速度的计算可以为小数 。数字越大，滚动越快
        if (numText >= maxNum) {
          numText = maxNum
          cancelAnimationFrame(golb)
        } else {
          golb = requestAnimationFrame(numSlideFun)
        }
        that[formKey][key] = Math.floor(numText)
      }
      numSlideFun() // 调用数字动画
    },
    sortFn(val) {
      this.orderBy = val === 0 ? 1 : 0
      this.getGoodsPurchaseRecord()
    },
    getUrl({ appName = '', streamName = '', txSecret = '', txTime = '', url = '' }) {
      console.log(url, 'url')
      return {
        RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
      }
    },
    setUrl() {
      if (this.liveRoomDetail.liveModel === 'PERSON_LIVE') {
        this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomPersonInfo.broadcastInfo).auto).webRtc)
      } else if (this.liveRoomDetail.liveModel === 'AI_LIVE') {
        this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(this.liveRoomDetail.liveRoomIntelligentInfo.broadcastInfo).auto).webRtc)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  width: 100vw;
  height: 100vh;
  min-width: 1400px;
  min-height: 800px;
  background-image: url(../../../assets/image/liveKanbanBg.png);
  background-repeat: no-repeat;
  background-color: #083268;
  background-size: 100% 100%;
  padding: 36px;
  // overflow: hidden;
  .page_wrap_left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .page_wrap_left_1 {
      height: 30%;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #09457F;
    }
    .page_wrap_left_2 {
      margin: 20px 0;
      height: 30%;
      border-radius: 20px;
      border: 2px solid #09457F;
    }
    .page_wrap_left_3 {
      height: 30%;
      border-radius: 20px;
      border: 2px solid #09457F;
    }
  }
  .page_wrap_center {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 20px;
    .page_wrap_center_1 {
      height: 520px;
    }
    .page_wrap_center_2 {
      flex: 1 0 0;
      // height: 490px;
      background: #063C70;
      border-radius: 20px;
      overflow: hidden;
    }
  }
  .page_wrap_right {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    .page_wrap_right_1 {
      flex: 1 0 0;
      border-radius: 20px;
      margin-bottom: 20px;
      border: 2px solid #09457F;

    }
    .page_wrap_right_2 {
      height: 64%;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #09457F;
    }
  }
}
</style>
