<template>
  <div class="liveScreen">
    <div class="title">直播大屏</div>
    <div class="liveInfo">
      <span class="liveRoomTitle">{{ data.name }}</span>
      <span class="liveRoomLiveState m-l-10 m-r-20" :class="`liveRoomLiveState${liveRoomDetail.status}`">
        <svg-icon class-name="liveTypeicon" :icon-class="{0: 'livenostart', 1: 'liveIng', 2: 'liveSuspend', 3: 'liveError',9: 'audit_info'}[liveRoomDetail.status]" />{{ liveRoomDetail.status | getOptionsValue(liveStateOption) }}
      </span>
      <span class="liveMode m-r-20"><span>开播时间：</span><span>{{ data.startTime | renderTime }}</span></span>
      <span class="liveTime"><span>直播时间：</span><span>已直播{{ data.liveDuration | renderLiveDuration }}</span></span>
    </div>
    <div class="liveBox">
      <div class="liveBoxTitle">直播间成交金额</div>
      <div class="liveBoxNumber">
        {{ screenTransactionAmount.purchaseOrderTotalAmount | filtersMoneyByZero }}
      </div>
      <div class="dataView">
        <el-row>
          <el-col :span="8">
            <div class="formLabel">成交数量</div>
            <div class="formValue">{{ screenTransactionAmount.purchaseOrderTotalNum }}</div>
          </el-col>
          <el-col :span="8">
            <div class="formLabel">成交人数</div>
            <div class="formValue">{{ screenTransactionAmount.purchasePeopleTotalNum }}</div>
          </el-col>
          <el-col :span="8">
            <div class="formLabel">点击转化率</div>
            <div class="formValue"><div class="conversionRate"><price :price="screenTransactionAmount.clickConversionRate*100" /></div></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="formLabel">实时在线人数</div>
            <div class="formValue">{{ screenTransactionAmount.onlinePersonNumber }}</div>
          </el-col>
          <el-col :span="8">
            <div class="formLabel">累计观看人数</div>
            <div class="formValue">{{ screenTransactionAmount.watchTotalTimes }}</div>
          </el-col>
          <el-col :span="8">
            <div class="formLabel">人均观看时长</div>
            <div class="formValue">
              {{ screenTransactionAmount.avgWatchTimes | renderAvgWatchTimesM }}<span>分钟</span>{{ screenTransactionAmount.avgWatchTimes | renderAvgWatchTimesS }}<span>秒</span>
              <!-- <template v-if="data.status === 9">
                {{ screenTransactionAmount.avgWatchTimes | renderAvgWatchTimesM }}<span>分钟</span>{{ screenTransactionAmount.avgWatchTimes | renderAvgWatchTimesS }}<span>秒</span>
              </template>
              <template v-else>
                --
              </template> -->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { liveStateOption } from '../../columns'
import price from './price.vue'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    renderLiveDuration(val) {
      if (!val || typeof val !== 'number') {
        return '00时00分00秒'
      } else {
        const result = parseInt(val)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        return h + '时' + m + '分' + s + '秒'
      }
    },
    renderAvgWatchTimesM(val) {
      if (!val) {
        return 0
      }
      const result = parseInt(val / 1000)
      const m = Math.floor((result / 60)) < 10 ? '0' + Math.floor((result / 60)) : Math.floor((result / 60))
      return m
    },
    renderAvgWatchTimesS(val) {
      if (!val) {
        return 0
      }
      const result = parseInt(val / 1000)
      const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      return s
    }
  },
  components: { price },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          liveDuration: '', // 直播时间
          name: '', // 直播间名称
          startTime: '' // 开播时间
        }
      }
    },
    screenTransactionAmount: {
      type: Object,
      default: () => {
        return {
          avgWatchTimes: 0, // 人均观看时长
          clickConversionRate: 0, // 点击转化率
          onlinePersonNumber: 0, // 实时在线人数
          purchaseOrderTotalNum: 0, // 	成交总数
          purchasePeopleTotalNum: 0, // 成交总人数
          watchTotalTimes: 0, // 累计观看次数
          purchaseOrderTotalAmount: 0
        }
      }
    }

  },
  data() {
    return {
      liveStateOption,
      groupId: this.$route.params.id,
      liveState: 1
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.liveScreen {
  margin-bottom: 24px;
  .title {
    text-align: center;
    font-size: 26px;
    font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 31px;
  }
  .liveInfo {
    margin-top: 17px;
    .liveRoomTitle {
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
    }
    .liveRoomLiveState {
      display: inline-block;
      background: rgba(0, 145, 255, .2);
      border-radius: 5px;
      height: 28px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #00C2FF;
      line-height: 28px;
      padding: 0 12px;
    }
    .liveRoomLiveState0 {
      background: #EEF2F9;
      color: #717F99;
    }
    .liveRoomLiveState1 {
      background: #E7F0FF;
      color: #1778FF;
    }
    .liveRoomLiveState2 {
      background: #FFF2E6;
      color: #FF7D00;
    }
    .liveRoomLiveState3 {
      background: #FEECEC;
      color: #F53F3F;
    }
    .liveRoomLiveState9 {
      background: #F5F5F5;
      color: #999999;
    }
    .liveMode {
      > span:nth-child(1) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #B6D4FF;
        line-height: 22px;
      }
      > span:nth-child(2) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
      }
    }
    .liveTime {
      > span:nth-child(1) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #B6D4FF;
        line-height: 22px;
      }
      > span:nth-child(2) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
      }
    }
  }
  .liveBox {
    margin-top: 19px;
    width: 100%;
    height: 398px;
    background-image: url(../../../../assets/image/liveBorder.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: linear-gradient(315deg, #025BE0 0%, #0092E6 100%);
    border-radius: 20px;
    .liveBoxTitle {
      padding-top: 32px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 33px;
      text-align: center;
    }
    .liveBoxNumber {
      text-align: center;
      margin-top: 10px;
      font-size: 72px;
      font-family: "微软雅黑";
      font-weight: bold;
      color: #00C2FF;
      line-height: 84px;
    }
    .dataView {
      margin-top: 30px;
      .formLabel {
        margin-top: 10px;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 28px;
        text-align: center;
      }
      .formValue {
        margin-top: 8px;
        text-align: center;
        font-size: 28px;
        font-family: "微软雅黑";
        font-weight: bold;
        color: #FFFFFF;
        line-height: 32px;
        padding-bottom: 10px;
        >span {
          font-size: 14px;
        }
        .conversionRate {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
