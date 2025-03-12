<template>
  <!-- 直播数据看板 -->
  <div class="pageWrap-live-data-kanban">
    <MCard>
      <filterTop :search="search" @onSearch="onTimeChange" />
      <div class="center-content">
        <div class="center-con-d">
          <el-row :gutter="11">
            <el-col :span="19">
              <DataProfiling ref="DataProfiling" :nav-view="navView" :search="search" @onLiveTypeChange="onLiveTypeChange" @onNavClick="onNavClick" />
            </el-col>
            <el-col :span="5" style="float: right;">
              <performanceRankings :loading="rankingData.loading" :list="rankingData.data" :title="search.title" />
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="center-content" style="margin-top: 10px;">
        <div class="center-con-d">
          <rankingData v-if="notDetail" ref="rankingDataModal" @changeDetailStatus="changeDetailStatus" />
          <detailData v-else ref="detailData" @changeDetailStatus="changeDetailStatus" />
        </div>
      </div>
    </MCard>
    <MCard class="line-mcard">
      <div class="pageTableWrap">
        <employeeMonth />
      </div>
    </MCard>
    <MCard class="line-mcard">
      <div class="pageTableWrap">
        <liveDataStatistics ref="liveDataStatistics" :search-obj="search" />
      </div>
    </MCard>
    <MCard class="line-mcard">
      <privateDashboard />
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
import rankingData from './components/rankingData.vue'
import detailData from './components/detailData.vue'
import employeeMonth from './components/employeeMonth.vue'
import {
  allLiveRoomReportSummarize, // 所有直播间数据看板-订单数据
  teacherOrderRankingNew, // 所有直播间数据看板-业绩排行榜-订单字段
  dataProfiling, // 所有直播间数据看板-到课等数据查询
  performanceRankingBoard, // 所有直播间数据看板-业绩排行版 - 到课等数据 查询
  getSummarize // 查询数据概况数据
} from '@/api/liveRoom/kanban.js'
export default {
  components: {
    privateDashboard,
    filterTop,
    DataProfiling,
    performanceRankings,
    liveDataStatistics,
    rankingData,
    detailData,
    employeeMonth
  },
  data() {
    return {
      notDetail: true,
      form: {
        time: {
          active: 1,
          time: ['', '']
        },
        teacherId: '',
        deptId: '',
        liveModel: ''
      },
      search: {
        time: { active: 1, time: ['', ''] }, // 时间
        active: 2, // 筛选项1:成交订单数 2:成交金额 3:待付款金额 4: 退款金额 5: 营收 6: 转化人数 7 - 完课人数; 8 - 到课人数; 9 - 报名人数; 10 - 邀约人数;
        title: '成交金额排行榜',
        navActive: '' // PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播，不传默认查所有
      },
      navView: [
        {
          key: 'revenue',
          number: '',
          rate: '',
          rateKey: 'revenueRatio',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 5,
          label: '营收',
          tips: '指【成交金额】减【退款金额】。'
        },
        {
          key: 'refundAmount',
          number: '',
          rate: '',
          rateKey: 'refundAmountRatio',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 4,
          label: '退款',
          tips: '指在直播间下了订单发生的退款金额，订单状态为【部分退款】和【全部退款】的。'
        },
        {
          key: 'gmv',
          number: '',
          rate: '',
          rateKey: 'gmvRatio',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 2,
          label: 'GMV',
          tips: '指所有直播间已支付的成交金额。订单状态为【支付成功】，包含【部分退款】【全部退款】'
        },
        {
          key: 'doneOrderCount',
          number: '',
          rate: '',
          rateKey: 'doneOrderCountRatio',
          loading: false,
          value: 1,
          label: '成交订单数',
          tips: '指所有直播间已支付的成交订单数。订单状态为【支付成功】，包含【部分退款】【全部退款】'
        },
        {
          key: 'enterRevenueAmount',
          number: '',
          rate: '',
          rateKey: 'enterRevenueAmountRatio',
          render: row => {
            return this.filtersMoney(row)
          },
          loading: false,
          value: 11,
          label: '线下录单营收',
          tips: '指通过录单方式计算的营收业绩'
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
          key: 'applyPeopleNum',
          number: '',
          rate: '',
          rateKey: 'applyPeopleRatio',
          loading: false,
          value: 9,
          label: '报名人数',
          tips: '所有直播间的报名人数，人数去重。'
        },
        {
          key: 'attendPeopleNum',
          number: '',
          rate: '',
          rateKey: 'attendPeopleRatio',
          loading: false,
          value: 8,
          label: '到课人数',
          tips: '所有直播间听课1分钟以上的人数（含游客），人数去重'
        },
        {
          key: 'finishPeopleNum',
          number: '',
          rate: '',
          rateKey: 'finishPeopleRatio',
          loading: false,
          value: 7,
          label: '完课人数',
          tips: '所有直播间观看直播50分钟的人数（含游客），人数去重'
        },
        {
          key: 'transformUserCount',
          number: '',
          rate: '',
          rateKey: 'transformUserRatio',
          loading: false,
          value: 6,
          label: '转化人数',
          tips: '所有直播间下订单的人数，订单状态为已付款的。人数去重。'
        }
      ],
      rankingData: {
        loading: false,
        data: []
      },
      chooseTheTimeDetailObject: {},
      chooseTypeString: ''
    }
  },
  watch: {
    form: {
      handler: function(val) {
        if (val) {
          if (val.deptId === '' || val.deptId === undefined) {
            return
          }
          this.$nextTick(() => {
            this.$refs.rankingDataModal.init(val)
          })
        }
      },
      deep: true,
      immediate: true
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
    // this.$refs.liveDataStatistics && this.$refs.liveDataStatistics.init()
  },
  methods: {
    changeDetailStatus(type, obj, chooseType) {
      this.notDetail = type
      setTimeout(() => {
        if (this.notDetail) {
          this.$refs.rankingDataModal.init(this.form)
        } else {
          this.chooseTheTimeDetailObject = obj
          this.chooseTypeString = chooseType
          this.$refs.detailData.init(this.form, obj, chooseType)
        }
      }, 300)
    },
    onNavClick(val) {
      this.search.active = val
      this.search.title =
        getOptionsValueByKey('value', 'label', val, this.navView) + '排行榜'
      this.teacherOrderRanking()
    },
    onLiveTypeChange(val) {
      this.search.navActive = val
      this.navView.map(v => {
        v.loading = true
        v.number = ''
        v.rate = ''
      })
      // 获取订单数据
      // this.allLiveRoomReportSummarize()
      // 获取到课数据
      this.dataProfiling()
      this.teacherOrderRanking()
    },
    // 时间改变触发
    onTimeChange(val) {
      this.form = val
      const params = {
        deptId: this.form.deptId ? this.form.deptId : '',
        liveModel: this.form.liveModel ? this.form.liveModel : '',
        startTime: this.form.time.time ? this.form.time.time[0] : '',
        endTime: this.form.time.time ? this.form.time.time[1] : '',
        teacherId: this.form.teacherId ? this.form.teacherId : ''
      }
      if (params.deptId === '') {
        return false
      }
      getSummarize(params).then(res => {
        if (res.code === 1 && res.data) {
          this.navView.some((item, index) => {
            item.number = res.data[item.key]
            item.rate = res.data[item.rateKey]
          })
          this.onNavClick(this.search.active)
        }
      })
      if (!this.notDetail) {
        this.$refs.detailData.init(this.form, this.chooseTheTimeDetailObject, this.chooseTypeString)
      }
    },
    init() {
      this.navView.map(v => {
        v.loading = true
        v.number = ''
        v.rate = ''
      })
      // 获取订单数据
      // this.allLiveRoomReportSummarize()
      // 获取到课数据
      this.dataProfiling()
      this.teacherOrderRanking()
      // 获取直播数据统计
      // this.$refs.liveDataStatistics && this.$refs.liveDataStatistics.init()
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
        startTime: this.search.time.time[0], // 开始时间
        endTime: this.search.time.time[1], // 结束时间
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
        startTime: this.search.time.time[0], // 开始时间
        endTime: this.search.time.time[1], // 结束时间
        liveModel: this.form.liveModel,
        deptId: this.form.deptId,
        type: this.search.active
      }
      teacherOrderRankingNew(data)
        .then(res => {
          this.rankingData.data = []
          // 用定时器将数据置顶
          setTimeout(() => {
            res.data.map(v => {
              v.number = this.filtersMoney(
                v.number,
                [2, 3, 4, 5, 11].includes(this.search.active)
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
        startTime: this.search.time.time[0], // 开始时间
        endTime: this.search.time.time[1], // 结束时间
        liveModel: this.search.navActive,
        type: this.search.active
      }
      performanceRankingBoard(data)
        .then(res => {
          this.rankingData.data = []
          // 用定时器将数据置顶
          setTimeout(() => {
            // alert(this.search.active)
            res.data.map(v => {
              v.userName = v.teacherName
              v.number = this.filtersMoney(
                v.num,
                [2, 3, 4, 5, 11].includes(this.search.active)
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
.pageWrap-live-data-kanban {
  min-width: 1000px;
  border-radius: 10px;
  overflow: hidden;
  .pageTableWrap {
    padding: 0 20px 4px;
  }
  ::v-deep {
    .card {
      height: auto;
    }
  }
}

.center-content {
  display: flex;
  padding-top: 10px;
  width: 100%;
  padding: 0 20px;
  .center-con-d {
    width: 100%;
    padding-top: 18px;
    border-top: 1px solid #F2F2F2;
  }
}

.line-mcard {
  margin-top: 18px;
}
</style>
