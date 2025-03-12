<template>
  <!-- 直播数据看板 -->
  <div class="pageWrap">
    <MCard>
      <filterTop :search="search" @onSearch="onTimeChange" />
      <el-row :gutter="20" class="p-20" style="display: flex">
        <el-col :span="18">
          <DataProfiling ref="DataProfiling" :nav-view="navView" :search="search" @onLiveTypeChange="onLiveTypeChange" @onNavClick="onNavClick" />
        </el-col>
        <el-col :span="6">
          <performanceRankings :loading="rankingData.loading" :list="rankingData.data" :title="search.title" />
        </el-col>
      </el-row>
      <div class="pageTableWrap">
        <liveDataStatistics ref="liveDataStatistics" :search-obj="search" />
      </div>
      <!-- 直播间数据对比 -->
      <!-- <div class="pageTableWrap">
        <dataComparison />
      </div> -->

      <!-- 私域看板 -->
      <div class="pageTableWrap">
        <privateDashboard />
      </div>
    </MCard>
  </div>
</template>

<script>
// import dataComparison from './components/dataComparison.vue'
import filterTop from './components/filterTop.vue'
import DataProfiling from './components/dataProfiling.vue'
import performanceRankings from './components/performanceRankings.vue'
import liveDataStatistics from './components/liveDataStatistics.vue'
import { getOptionsValueByKey } from '@/filters/index.js'
import privateDashboard from './components/privateDashboard.vue'
import BigNumber from 'bignumber.js'
import {
  allLiveRoomReportSummarize, // 所有直播间数据看板-订单数据
  teacherOrderRanking, // 所有直播间数据看板-业绩排行榜-订单字段
  dataProfiling, // 所有直播间数据看板-到课等数据查询
  performanceRankingBoard // 所有直播间数据看板-业绩排行版 - 到课等数据 查询
} from '@/api/liveRoom/kanban.js'
export default {
  components: {
    privateDashboard,
    filterTop,
    DataProfiling,
    performanceRankings,
    liveDataStatistics
    // dataComparison
  },
  data() {
    return {
      search: {
        time: { active: 1, time: ['', ''] }, // 时间
        active: 2, // 筛选项1:成交订单数 2:成交金额 3:待付款金额 4: 退款金额 5: 营收 6: 转化人数 7 - 完课人数; 8 - 到课人数; 9 - 报名人数; 10 - 邀约人数;
        title: '成交金额排行榜',
        navActive: '' // PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播，不传默认查所有
      },
      navView: [
        {
          key: 'doneOrderCount',
          number: '',
          rate: '',
          rateKey: 'doneOrderCountMoM',
          loading: false,
          value: 1,
          label: '成交订单数',
          tips: '指所有直播间已支付的成交订单数。订单状态为【支付成功】，包含【部分退款】【全部退款】'
        },
        {
          key: 'doneOrderAmount',
          number: '',
          rate: '',
          rateKey: 'doneOrderAmountMoM',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 2,
          label: '成交金额',
          tips: '指所有直播间已支付的成交金额。订单状态为【支付成功】，包含【部分退款】【全部退款】'
        },
        // {
        //   key: 'waitingAmount',
        //   number: '',
        //   rate: '',
        //   rateKey: 'waitingAmountMoM',
        //   render: row => {
        //     return this.filtersMoney(row)
        //   },
        //   loading: false,
        //   value: 3,
        //   label: '待付款金额',
        //   tips: '指所有直播间下了订单，未付款的金额'
        // },
        {
          key: 'refundAmount',
          number: '',
          rate: '',
          rateKey: 'refundAmountMoM',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 4,
          label: '退款金额',
          tips: '指在直播间下了订单发生的退款金额，订单状态为【部分退款】和【全部退款】的。'
        },
        {
          key: 'revenue',
          number: '',
          rate: '',
          rateKey: 'revenueMoM',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 5,
          label: '营收',
          tips: '指【成交金额】减【退款金额】。'
        },
        {
          key: 'invitePeopleNum',
          number: '',
          rate: '',
          rateKey: '',
          loading: false,
          value: 10,
          label: '邀约人数',
          tips: '指发送了邀约链接，并且点击的人数，包含二次分享的人数，以OpenID为主去重。'
        },
        {
          key: 'signUpPeopleNum',
          number: '',
          rate: '',
          rateKey: 'contrastSignUpPeopleNum',
          loading: false,
          value: 9,
          label: '报名人数',
          tips: '所有直播间的报名人数，人数去重。'
        },
        {
          key: 'attendPeopleNum',
          number: '',
          rate: '',
          rateKey: 'contrastAttendPeopleNum',
          loading: false,
          value: 8,
          label: '到课人数',
          tips: '所有直播间听课1分钟以上的人数（含游客），人数去重'
        },
        {
          key: 'finishPeopleNum',
          number: '',
          rate: '',
          rateKey: 'contrastFinishPeopleNum',
          loading: false,
          value: 7,
          label: '完课人数',
          tips: '所有直播间观看直播50分钟的人数（含游客），人数去重'
        },
        {
          key: 'transformUserCount',
          number: '',
          rate: '',
          rateKey: 'transformUserCountMoM',
          loading: false,
          value: 6,
          label: '转化人数',
          tips: '所有直播间下订单的人数，订单状态为已付款的。人数去重。'
        }
      ],
      rankingData: {
        loading: false,
        data: []
      }
    }
  },
  created() {
    this.$store.dispatch('liveSetting/getLiveRoomOrgConfig').then(res => {
      this.navView[7].tips = `所有直播间听课${
        res.data.attendClassTime || 0
      }分钟以上的人数（含游客），人数去重`
      this.navView[8].tips = `所有直播间观看直播${
        res.data.finishClassTime || 0
      }分钟的人数（含游客），人数去重`
    })
  },
  mounted() {
    this.$refs.liveDataStatistics && this.$refs.liveDataStatistics.init()
  },
  methods: {
    onNavClick(val) {
      this.search.active = val
      this.search.title =
        getOptionsValueByKey('value', 'label', val, this.navView) + '排行榜'
      val < 7 ? this.teacherOrderRanking() : this.performanceRankingBoard()
    },
    onLiveTypeChange(val) {
      this.search.navActive = val
      this.navView.map(v => {
        v.loading = true
        v.number = ''
        v.rate = ''
      })
      // 获取订单数据
      this.allLiveRoomReportSummarize()
      // 获取到课数据
      this.dataProfiling()
      this.search.active < 7
        ? this.teacherOrderRanking()
        : this.performanceRankingBoard()
    },
    // 时间改变触发
    onTimeChange(val) {
      this.search.time = val
      this.init()
    },
    init() {
      this.navView.map(v => {
        v.loading = true
        v.number = ''
        v.rate = ''
      })
      // 获取订单数据
      this.allLiveRoomReportSummarize()
      // 获取到课数据
      this.dataProfiling()
      this.search.active < 7
        ? this.teacherOrderRanking()
        : this.performanceRankingBoard()
      // 获取直播数据统计
      this.$refs.liveDataStatistics && this.$refs.liveDataStatistics.init()
    },
    // 所有直播间数据看板-订单数据
    allLiveRoomReportSummarize() {
      console.log(this.search, 'search')
      const data = {
        startTime: this.search.time.time[0], // 开始时间
        endTime: this.search.time.time[1], // 结束时间
        liveModel: this.search.navActive // 直播模式
      }
      allLiveRoomReportSummarize(data)
        .then(res => {
          this.navView.map(v => {
            v.rateKey && res.data[v.rateKey] && (v.rate = res.data[v.rateKey])
            if (typeof res.data[v.key] !== 'undefined') {
              v.number = res.data[v.key]
              v.loading = false
            }
          })
          console.log(this.navView, '订单数据')
        })
        .catch(() => {
          const obj = {
            doneOrderAmount: 0,
            doneOrderAmountMoM: 0,
            doneOrderCount: 0,
            doneOrderCountMoM: 0,
            refundAmount: 0,
            refundAmountMoM: 0,
            revenue: 0,
            revenueMoM: 0,
            transformUserCount: 0,
            transformUserCountMoM: 0,
            waitingAmount: 0,
            waitingAmountMoM: 0
          }
          this.navView.map(v => {
            v.rateKey && obj[v.rateKey] && (v.rate = obj[v.rateKey])
            if (typeof obj[v.key] !== 'undefined') {
              v.number = obj[v.key]
              v.loading = false
            }
          })
        })
    },
    // 所有直播间数据看板-到课等数据查询
    dataProfiling() {
      const data = {
        startTime: this.search.time.time[0] + ' 00:00:00', // 开始时间
        endTime: this.search.time.time[1] + ' 23:59:59', // 结束时间
        liveModel: this.search.navActive // 直播模式
      }
      dataProfiling(data)
        .then(res => {
          console.log('到课等数据查询res', res)
          this.navView.map(v => {
            v.rateKey && res.data[v.rateKey] && (v.rate = res.data[v.rateKey])
            if (typeof res.data[v.key] !== 'undefined') {
              v.number = res.data[v.key]
              v.loading = false
            }
          })
        })
        .catch(err => {
          console.log('到课等数据查询err', err)
          const obj = {
            attendPeopleNum: 0,
            contrastAttendPeopleNum: 0,
            finishPeopleNum: 0,
            contrastFinishPeopleNum: 0,
            invitePeopleNum: 0,
            signUpPeopleNum: 0,
            contrastSignUpPeopleNum: 0
          }
          this.navView.map(v => {
            v.rateKey && obj[v.rateKey] && (v.rate = obj[v.rateKey])
            if (typeof obj[v.key] !== 'undefined') {
              v.number = obj[v.key]
              v.loading = false
            }
          })
        })
    },
    // 所有直播间数据看板-业绩排行榜-订单字段
    teacherOrderRanking() {
      this.rankingData.loading = true
      const data = {
        num: 20,
        startTime: this.search.time.time[0], // 开始时间
        endTime: this.search.time.time[1], // 结束时间
        liveModel: this.search.navActive,
        type: this.search.active
      }
      teacherOrderRanking(data)
        .then(res => {
          this.rankingData.data = []
          // 用定时器将数据置顶
          setTimeout(() => {
            res.data.map(v => {
              v.number = this.filtersMoney(
                v.number,
                [2, 3, 4, 5].includes(this.search.active)
              )
            })
            this.rankingData.data = res.data
            this.rankingData.loading = false
          }, 100)
        })
        .catch(() => {
          this.rankingData.loading = false
        })
    },
    // 所有直播间数据看板-业绩排行版 - 到课等数据 查询
    performanceRankingBoard() {
      this.rankingData.loading = true
      const data = {
        num: 20,
        startTime: this.search.time.time[0] + ' 00:00:00', // 开始时间
        endTime: this.search.time.time[1] + ' 23:59:59', // 结束时间
        liveModel: this.search.navActive,
        type: this.search.active
      }
      performanceRankingBoard(data)
        .then(res => {
          this.rankingData.data = []
          // 用定时器将数据置顶
          setTimeout(() => {
            res.data.map(v => {
              v.userName = v.teacherName
              v.number = this.filtersMoney(
                v.num,
                [2, 3, 4, 5].includes(this.search.active)
              )
            })
            this.rankingData.data = res.data
            this.rankingData.loading = false
          }, 100)
        })
        .catch(() => {
          this.rankingData.loading = false
        })
    },
    // 金额处理：分转元 并添加，分割，以及取小数点后两位
    filtersMoney(money, flag = true) {
      const str = flag
        ? parseFloat(BigNumber(Math.abs(+money || 0)).div(100))
        : parseFloat(BigNumber(Math.abs(+money || 0)))
      return parseFloat(str)
        .toFixed(2)
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\.00)$/, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  min-width: 1000px;
  background: #fff;
  border-radius: 10px;
  .pageTableWrap {
    padding: 0 20px 4px;
  }
  ::v-deep {
    .card {
      height: auto;
    }
  }
}
</style>
