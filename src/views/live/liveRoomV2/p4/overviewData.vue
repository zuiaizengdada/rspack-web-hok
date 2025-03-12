<template>
  <div class="overviewData">
    <div class="overviewDataTitle">直播间成交金额</div>
    <div class="overviewDataNumber">
      <span>¥</span><numberChange :value="formData.gmv / 100" />
    </div>
    <div class="dataBox">
      <div class="dataItem">
        <div class="dataItemView" style="height: 90px">
          <div class="dataItemViewLabel">未付款人数</div>
          <div
            class="dataItemViewValue unpaidPeopleNum"
            @click="onhandleDialog"
          >
            {{ formData.unpaidPeopleNum || 0 }}
          </div>
          <div class="dataItemViewTips" />
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView" style="height: 90px">
          <div class="dataItemViewLabel">已付款订单数</div>
          <div class="dataItemViewValue">
            {{ formData.paidOrderCount || '0' }}
          </div>
          <div class="dataItemViewTips">
            已付款人数 {{ formData.paidPeopleNum || '0' }}
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView" style="height: 90px">
          <div class="dataItemViewLabel">到课率</div>
          <div class="dataItemViewValue">{{ renderDaoke() }}%</div>
          <div class="dataItemViewTips" style="margin-top: 5px">
            <el-select
              v-model="detail.attendanceRateSetting"
              class="attendanceSelect"
              size="mini"
              @change="onChange"
            >
              <el-option label="计划看播用户" :value="1" />
              <el-option label="计划看播用户-退款用户" :value="2" />
              <el-option label="所有用户" :value="0" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <MTips
            text="实时在线人数"
            tips="本场直播间现在在线的人数"
            align="center"
            :img-src="tipsImg"
          >
            <div class="dataItemViewLabel">实时在线人数</div>
          </MTips>
          <div class="dataItemViewValue">
            {{ formData.realTimeOnlineNum || 0 }}
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <MTips
            text="最高在线人数"
            tips="本场直播间最高同时在线人数"
            align="center"
            :img-src="tipsImg"
          >
            <div class="dataItemViewLabel">最高在线人数</div>
          </MTips>
          <div class="dataItemViewValue">{{ formData.maxOnlineNum || 0 }}</div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <template v-if="attendClassTime !== ''">
            <MTips
              text="总到课人数"
              :tips="`指从开播时间开始，观看时长大于${attendClassTime}分钟（时长为自定义）的人数，人数去重。`"
              align="center"
              :img-src="tipsImg"
            >
              <div class="dataItemViewLabel">总到课人数</div>
            </MTips>
          </template>
          <template v-else
            ><div class="dataItemViewLabel">总到课人数</div></template
          >
          <div class="dataItemViewValue">
            {{ formData.totalAttendPeopleNum || 0 }}
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <MTips
            text="到课转化率"
            tips="已付款人数除以总到课人数*100%"
            align="center"
            :img-src="tipsImg"
          >
            <div class="dataItemViewLabel">到课转化率</div>
          </MTips>
          <div class="dataItemViewValue">
            {{ (formData.transformUserRatio || 0).toFixed(2) }}%
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <template v-if="finishClassTime !== ''">
            <MTips
              text="完课人数"
              :tips="`指在直播间听了${finishClassTime}分钟（时长为自定义）的人数`"
              align="center"
              :img-src="tipsImg"
            >
              <div class="dataItemViewLabel">完课人数</div>
            </MTips>
          </template>
          <template v-else
            ><div class="dataItemViewLabel">完课人数</div></template
          >
          <div class="dataItemViewValue">
            {{ formData.finishPeopleNum || 0 }}
          </div>
        </div>
      </div>
      <div class="dataItem">
        <div class="dataItemView">
          <MTips
            text="人均观看时长"
            tips="所有人员的观看时长除以所有人员数"
            align="center"
            :img-src="tipsImg"
          >
            <div class="dataItemViewLabel">人均观看时长</div>
          </MTips>
          <div class="dataItemViewValue">
            {{ formData.perViewTime | renderAvgWatchTimesM
            }}<span class="dataItemViewTime">分钟</span
            >{{ formData.perViewTime | renderAvgWatchTimesS
            }}<span class="dataItemViewTime">秒</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import numberChange from './components/numberChange.vue'
import { mapState } from 'vuex'
// import Dialog from '@/views/live/liveRoomV2/Dialog'
import { liveOverview, savePersonSetUpRecord } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    numberChange
  },
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
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return h + '时' + m + '分' + s + '秒'
      }
    },
    renderAvgWatchTimesM(val) {
      if (!val) {
        return 0
      }
      const result = parseInt(val)
      const m =
        Math.floor(result / 60) < 10
          ? '0' + Math.floor(result / 60)
          : Math.floor(result / 60)
      return m
    },
    renderAvgWatchTimesS(val) {
      if (!val) {
        return 0
      }
      const result = parseInt(val)
      const s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)
      return s
    }
  },
  data() {
    return {
      loading: false,
      timer: null,
      detail: {
        attendanceRateSetting: ''
      },
      formData: {
        attendRatio: '', // 到课率-（计划看播用户）
        attendRatioIncludeRefund: '', // 到课率-（计划看播用户-退款用户）
        finishPeopleNum: '', // 完课人数
        gmv: 0, // 直播间成交金额GMV
        maxOnlineNum: '', // 最高在线人数
        paidOrderCount: '', // 已付款订单数
        paidPeopleNum: '', // 已付款人数
        perViewTime: '', // 人均观看时长
        attendRatioInvite: '', // 邀约到课率
        realTimeOnlineNum: '', // 实时在线人数
        totalAttendPeopleNum: '', // 总到课人数
        transformUserRatio: '', // 到课转化率
        unpaidPeopleNum: '' // 待付款人数
      },
      liveRoomId: this.$route.params.id,
      tipsImg: require('../../../../assets/image/liveRoom/tips.png')
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      groupId: state => state.im.liveRoomDetail.groupId,
      attendClassTime: state => state.liveSetting.attendClassTime,
      finishClassTime: state => state.liveSetting.finishClassTime,
      attendanceRateSetting: state => state.im.attendanceRateSetting
    })
  },
  watch: {
    attendanceRateSetting: {
      handler(val) {
        this.detail.attendanceRateSetting = val
      },
      immediate: true
    }
  },
  created() {
    this.$store.dispatch('liveSetting/getLiveRoomOrgConfig')
    console.log(this.attendClassTime, 'attendClassTime')
  },
  mounted() {
    this.getDetail()
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.getDetail()
    }, 3000)
  },
  methods: {
    // 点击打开待付款人数弹框
    onhandleDialog() {
      return
      // Dialog.open({
      //   visible: true,
      //   type: 'PurchaseRecord',
      //   search: {
      //     phone: '',
      //     userInfo: {
      //       label: 'tel',
      //       value: { tel: '', Email: '' }
      //     },
      //     time: [],
      //     orderStatus: 1,
      //     teacherId: '',
      //     existInviteTeacher: true
      //   },
      //   liveRoomId: this.$route.params.id,
      //   liveRoomCode: this.liveRoomDetail.code,
      //   success: row => {}
      // })
    },
    // 获取成交金额
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        groupId: this.groupId
      }
      liveOverview(data)
        .then(res => {
          if (res.data) {
            this.formData = res.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(e) {
      const data = {
        code: 'LIVE_ROOM_ATTENDANCE_RATE_SELECTOR',
        value: JSON.stringify(e)
      }
      savePersonSetUpRecord(data)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 渲染到课率
    renderDaoke() {
      if (this.detail.attendanceRateSetting === 1) {
        return this.formData.attendRatio || 0
      } else if (this.detail.attendanceRateSetting === 2) {
        return this.formData.attendRatioIncludeRefund || 0
      } else if (this.detail.attendanceRateSetting === 0) {
        return this.formData.attendRatioInvite || 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.overviewData {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #d7feff 0%, #fff 100%);
  .overviewDataTitle {
    text-align: center;
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px;
    margin-top: 6px;
    margin-bottom: 7px;
  }
  .overviewDataNumber {
    color: #000000;
    text-align: center;
    font-family: 'DIN Alternate';
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 40px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .dataBox {
    flex: 1 0 0;
    padding: 0 5px;
    .dataItem {
      // display: inline-block;
      float: left;
      width: 33.33%;
      padding: 0 5px 10px;
      .dataItemView {
        border-radius: 10px;
        background: #0000000d;
        text-align: center;
        padding: 15px 10px;
        height: 69px;
        .dataItemViewLabel {
          color: #000000;
          text-align: center;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 14px;
        }
        .dataItemViewValue {
          margin-top: 10px;
          color: #000000;
          text-align: center;
          font-family: 'DIN Alternate';
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
        }
        .dataItemViewTips {
          margin-top: 9px;
          color: #999999;
          text-align: center;
          font-family: 'Microsoft YaHei';
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 12px;
        }
        .dataItemViewTime {
          color: #000000;
          text-align: center;
          font-family: 'DIN Alternate';
          font-size: 14px;
          font-style: normal;
          font-weight: Bold;
          line-height: 20px;
        }
      }
    }
  }
  .unpaidPeopleNum {
    /* text-decoration: underline; */
    cursor: pointer;
  }
}

.attendanceSelect {
  width: 118px;
  ::v-deep {
    .el-input__inner {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
    .el-input__suffix {
      right: 0;
    }
    .el-input--mini .el-input__icon {
      line-height: 20px;
    }
    .el-select__caret {
      font-size: 12px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 23px;
      padding-left: 3px;
      font-size: 11px;
    }
  }
}
::v-deep {
  .dataItem .tips .iconText {
    margin-left: 4px;
  }
}
</style>
