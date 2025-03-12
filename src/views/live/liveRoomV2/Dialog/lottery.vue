<template>
  <AppDialog
    v-model="visible"
    title="抽奖"
    width="584px"
    :loading="loading"
    height="auto"
    :show-close="false"
    :top="top"
    :drag="drag"
    :modal="false"
  >
    <div class="lottery">
      <div v-if="!ifCountdown" class="pageWrapForm">
        <!-- 抽奖选择页面 -->
        <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
          <el-form-item label="抽奖名称" prop="prizeDrawId">
            <el-select v-model="form.prizeDrawId" style="width: 245px" @change="changePrizeDraw">
              <el-option v-for="(item) in prizeDrawOption" :key="item.id" :label="item.prizeDrawName" :value="item.id" />
            </el-select>
            <el-button type="text" class="m-l-20" @click="onhandleAdd">添加抽奖</el-button>
          </el-form-item>
          <el-form-item label="参与条件" prop="participationCondition">
            <span>{{ {1: '用户在线', 2:'参与任意评论', 3:'参与指定评论'}[form.participationCondition] }}</span>
            <el-input v-if="form.participationCondition === 3" v-model="form.assignedComment" disabled />
          </el-form-item>
          <el-form-item label="开奖时间" prop="drawPrizeType">
            <el-radio-group v-model="form.drawPrizeType" @change="drawPrizeTypeChange">
              <el-radio :label="1" class="radioClass">
                <span>倒计时开奖</span>
                <template v-if="form.drawPrizeType === 1">
                  <el-input v-model="form.countdown" style="width: 77px;margin-left: 16px;" clearable @input="delNumber" />
                  秒
                </template>
              </el-radio>
              <el-radio :label="2" class="radioClass">
                <span>定时开奖</span>
                <el-date-picker
                  v-if="form.drawPrizeType === 2"
                  v-model="form.drawPrizeStamp"
                  type="datetime"
                  style="width: 180px;margin-left: 30px;"
                  :picker-options="pickerOptions"
                  placeholder="任意时间点"
                />
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="m-t-40">
            <el-button size="small" type="primary" @click="onhandleStart">开始抽奖</el-button>
            <el-button size="small" @click="onhandleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="pageWrapCountDown">
        <!-- 抽奖倒计时页面 -->
        <div class="pageWrapCountDownTime">
          <template v-if="countNumber >= 0 && !loading && !ifDrawPrize">
            <div class="pageWrapCountDownTimeTips">抽奖倒计时</div>
            <div class="pageWrapCountDownTimeNumber">{{ countNumber | filterWaitingTime }}</div>
          </template>
          <template v-if="loading && !ifDrawPrize">
            <div class="pageWrapTextTips">开奖中</div>
          </template>
          <template v-if="ifDrawPrize">
            <div class="pageWrapTextTips">已开奖</div>
          </template>
        </div>
        <div class="pageWrapCountDownPeople">当前参与人数{{ drawParticipateCount }}人</div>
        <div class="pageWrapCountDownBtn">
          <el-button v-if="!ifDrawPrize" type="primary" size="small" :loading="loading" @click="drawPrizeAhead">提前开奖</el-button>
          <el-button v-if="ifDrawPrize" type="primary" size="small" :loading="loading" @click="onhandleBack">返回</el-button>
          <el-button size="small" @click="onhandleCancel">取消</el-button>
        </div>
      </div>
    </div>
    <div slot="footer" />
    <div slot="title" class="lotteryUserInfo" @click="openDialog">
      <span v-if="ifDrawPrize">中奖结果</span>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { checkDraw, getDrawCountdown, getDrawParticipateCount, drawPrizeAhead, sendPrizeDraw } from '@/api/liveRoom/im.js'
import { getPrizeListEffective } from '@/api/liveRoom/setting.js'
import Dialog from '@/views/live/Dialog/index.js'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  filters: {
    filterWaitingTime(val) {
      if (!val || val < 0) {
        return '0'
      }
      if (val <= 120) {
        return val
      }
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
      return h + ':' + m + ':' + s
    }
  },
  components: {
    AppDialog
  },
  data() {
    var checkPrizeDrawId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择抽奖名称'))
      } else {
        return callback()
      }
    }
    var checkDrawPrizeType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择开奖时间'))
      }
      if (value === 1 && !this.form.countdown) {
        return callback(new Error('请输入倒计时开奖'))
      } else if ((value === 1 && this.form.countdown < 10)) {
        return callback(new Error('开奖倒计时要大于等于10秒'))
      } else if (value === 2 && !this.form.drawPrizeStamp) {
        return callback(new Error('请选择定时开奖'))
      } else {
        if (value === 2 && new Date(this.form.drawPrizeStamp).getTime() < Date.now()) {
          return callback(new Error('开奖时间要大于当前时间'))
        }
        const maxTime = Date.now() + 24 * 2 * 60 * 60 * 1000 - 8.64e7
        if (value === 2 && new Date(this.form.drawPrizeStamp).getTime() > maxTime) {
          return callback(new Error('开奖时间只能选择24h内'))
        }
        return callback()
      }
    }
    return {
      drag: true,
      loading: false,
      visible: false,
      liveRoomId: '',
      prizeDrawOption: [],
      top: '114px',
      form: {
        countdown: '',
        drawPrizeStamp: '',
        drawPrizeType: 1,
        liveRoomId: '',
        prizeDrawId: ''
      },
      rules: {
        prizeDrawId: [
          { required: true, validator: checkPrizeDrawId, trigger: 'blur' }
        ],
        drawPrizeType: [
          { required: true, validator: checkDrawPrizeType, trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          const maxTime = Date.now() + 24 * 2 * 60 * 60 * 1000 - 8.64e7
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > maxTime
        }
      },
      timer: null,
      countNumber: 0,
      drawParticipateCount: 0, // 当前抽奖参与人数
      ifCountdown: false // 是否倒计时

    }
  },
  computed: {
    ...mapState({
      ifDrawPrize: state => state.im.ifDrawPrizeDrawPrizeId
    })
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.form = {
            countdown: '',
            drawPrizeStamp: moment().format('YYYY-MM-DD HH:mm:00'),
            drawPrizeType: 1,
            liveRoomId: '',
            prizeDrawId: ''
          }
          this.$store.commit('im/SET_ifDrawPrize', '')
          this.loading = true
          this.checkDraw().then((res) => {
            this.ifCountdown = res.data
            return this.ifCountdown ? this.getDrawCountdown() : this.getOption()
          }).then(res => {
            this.loading = false
            console.log(res)
          })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.timer && clearInterval(this.timer)
        }
      },
      deep: true
    },
    ifDrawPrize: {
      handler(val) {
        // 变为true的时候要停止loading
        if (val) {
          this.timer && clearInterval(this.timer)
          this.countNumber = 0
          this.loading = false
        }
      }
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 381) / 2 + 'px'
  },
  methods: {
    onhandleAdd() {
      Dialog.open({
        type: 'AddLottery',
        liveRoomId: this.liveRoomId,
        visible: true,
        success: () => {
          this.getOption()
        }
      })
    },
    onhandleBack() {
      this.form = {
        countdown: '',
        drawPrizeStamp: '',
        drawPrizeType: 1,
        liveRoomId: '',
        prizeDrawId: ''
      }
      this.$store.commit('im/SET_ifDrawPrize', '')
      this.loading = true
      this.checkDraw().then((res) => {
        this.ifCountdown = res.data
        return this.ifCountdown ? this.getDrawCountdown() : this.getOption()
      }).then(res => {
        this.loading = false
        console.log(res)
      })
        .catch(() => {
          this.loading = false
        })
    },
    drawPrizeTypeChange() {
      this.$refs.form && this.$refs.form.clearValidate('drawPrizeType')
    },
    delNumber(e) {
      if (Number(e) > 600) {
        this.form.countdown = 600
        return
      }
      this.form.countdown = e.replace(/[^0-9]/g, '')
    },
    // 选择抽奖名称触发
    changePrizeDraw(row) {
      const obj = this.prizeDrawOption.find(v => v.id === row)
      if (obj) {
        this.form.participationCondition = obj.participationCondition
        this.form.assignedComment = obj.assignedComment
      }
    },
    // 根据直播间ID获取当前时刻是否有抽奖
    checkDraw() {
      const data = { liveRoomId: this.liveRoomId }
      return checkDraw(data)
    },
    // 获取抽奖倒计时信息
    getDrawCountdown() {
      const data = { liveRoomId: this.liveRoomId }
      return getDrawCountdown(data).then(res => {
        this.countNumber = res.data
        this.timer && clearInterval(this.timer)
        this.timer = null
        this.timer = setInterval(() => {
          this.countNumber = this.countNumber - 1
          this.getDrawParticipateCount()
          if (this.countNumber <= 0) {
            this.countNumber = 0
            this.timer && clearInterval(this.timer)
            this.success && this.success()
            this.loading = true
            // this.visible = false
          }
        }, 1000)
      })
    },
    // 获取有效抽奖
    getOption() {
      const data = { liveRoomId: this.liveRoomId }
      return getPrizeListEffective(data).then(res => {
        this.prizeDrawOption = res.data
      })
    },
    // 获取抽奖参与人数
    getDrawParticipateCount() {
      const data = { liveRoomId: this.liveRoomId }
      return getDrawParticipateCount(data).then(res => {
        res.data !== -1 && (this.drawParticipateCount = res.data)
      })
    },
    // 提前开奖
    drawPrizeAhead() {
      this.$delModal({
        tips: `<span style="color: #F53F3F">提前开奖，本轮抽奖活动将立即结束，请谨慎操作！</span>`,
        success: () => {
          this.loading = true
          const data = { liveRoomId: this.liveRoomId }
          return drawPrizeAhead(data).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击取消
    onhandleCancel() {
      this.visible = false
    },
    // 点击开始抽奖
    onhandleStart() {
      this.$refs.form && this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            drawPrizeStamp: Math.floor(new Date(this.form.drawPrizeStamp).getTime() / 1000),
            liveRoomId: this.liveRoomId
          }
          this.loading = true
          sendPrizeDraw(data).then(res => {
            this.$store.commit('im/SET_ifDrawPrize', '')
            this.ifCountdown = true
            this.getDrawCountdown()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openDialog() {
      Dialog.open({
        type: 'PrizeWinner',
        title: `中奖结果`,
        liveRoomId: this.liveRoomId,
        prizeDrawId: this.ifDrawPrize,
        visible: true
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.lottery {
  .pageWrapForm {
    // height: 323px;
    padding: 12px 34px;
  }
  .pageWrapCountDown {
    height: 323px;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .pageWrapCountDownTime {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      background: #E6F0FF;
      text-align: center;
      .pageWrapCountDownTimeTips {
        margin-top: 30px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .pageWrapTextTips {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 128px;
      }
      .pageWrapCountDownTimeNumber {
        margin-top: 14px;
        font-size: 25px;
        font-family: ArialMT;
        color: #0C6FFF;
        line-height: 29px;
      }
    }
    .pageWrapCountDownPeople {
      margin-top: 20px;
      margin-bottom: 24px;
    }
    .pageWrapCountDownBtn {

    }
  }
}
.radioClass {
  width: 400px;
  height: 32px;
  display: flex;
  align-items: center;
}
.lotteryUserInfo {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 500;
  color: #0c6fff;
  font-size: 16px;
  cursor: pointer;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
}
</style>
