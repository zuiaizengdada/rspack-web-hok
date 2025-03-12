<template>
  <!-- 直播间签到 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolCoupon">
      <el-scrollbar ref="P5ScrollContainer" :vertical="false" class="liveToolCoupon_scroll">
        <div ref="formView" class="form sign">
          <div v-if="!ifCountdown" class="pageWrapForm">
            <!-- 签到选择页面 -->
            <el-form ref="form" label-position="top" :model="form" label-width="80px" size="mini" :rules="rules" @submit.native.prevent>
              <el-form-item label="签到方式" prop="signType">
                <el-select v-model="form.signType" style="width: 144px" :disabled="!form.ifEdit" @change="onhandleChangeSignType">
                  <el-option label="立即发送" :value="1" />
                  <el-option label="定时发送" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.signType === 2" label="发送时间" prop="signSendTime">
                <AppTimePicker v-model="form.signSendTime" :picker-options="pickerOptions" :disabled="!form.ifEdit" />
              </el-form-item>
              <el-form-item label="签到引导语" prop="signGuideWord">
                <el-input
                  v-model="form.signGuideWord"
                  :disabled="!form.ifEdit"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="签到时长" prop="signDuration">
                <template v-if="form.ifEdit">
                  <div class="signDurationBox">
                    <div v-for="(item) in signTimeOption" :key="item.value" :class="{active: item.value === form.signDuration}" class="signDurationItem" @click="form.signDuration = item.value">
                      {{ item.label }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="signDurationEdit">{{ (form.signDuration) | getOptionsValue(signTimeOption) }}</div>
                </template>
              </el-form-item>
            </el-form>
          </div>
          <div v-else-if="ifCountdown" class="pageWrapCountDown">
            <!-- 签到倒计时页面 -->
            <div class="pageWrapCountDownTime">
              <template>
                <div class="pageWrapCountDownTimeTips">{{ form.signGuideWord }}</div>
                <div class="pageWrapCountDownTimeNumber">
                  <div v-if="countNumber >= 60" class="downTimeNumber m-r-10">{{ countNumber | filterWaitingTimeM }}</div>
                  <div v-if="countNumber >= 60" class="downTimeUnit m-r-8">分</div>
                  <div class="downTimeNumber m-r-8">{{ countNumber | filterWaitingTimeS }}</div>
                  <div class="downTimeUnit">秒</div>
                </div>
              </template>
            </div>
            <div class="pageWrapCountDownPeople">当前签到人数{{ signCount }}人</div>
          </div>

          <div v-if="signForm.ifSignStart === 0" class="openSignLogDialog" @click="openSignLogDialog">
            签到记录
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <template v-if="!ifCountdown">
        <el-button v-if="form.signId && form.ifEdit" size="small" :loading="loading" type="primary" @click="updateLiveRoomSign">保存</el-button>
        <el-button v-if="form.signId && !form.ifEdit" size="small" type="primary" @click="onhandleEditSign">编辑</el-button>
        <el-button v-if="form.signId" size="small" class="btn_primary" @click="cancalLiveRoomSign(form.signId)">取消签到</el-button>
        <el-button v-if="!form.signId" size="small" :loading="loading" type="primary" @click="onhandleStart">开始签到</el-button>
      </template>
      <template v-if="ifCountdown">
        <el-button v-if="signForm.ifSignStart === 1 || signForm.ifSignStart === 3" type="primary" size="small" :loading="loading || countNumber <= 0" @click="drawPrizeAhead(form.signId)">结束签到</el-button>
        <!-- <el-button v-if="signForm.ifSignStart === 1 || signForm.ifSignStart === 3" size="small" :loading="loading" @click="onhandleCancel">取消</el-button> -->
      </template>
      <el-button v-if="signForm.ifSignStart === 2" type="primary" size="small" :loading="loading" @click="openDialog">签到结果</el-button>
      <el-button v-if="signForm.ifSignStart === 2" size="small" :loading="loading" @click="onhandleCancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AppTimePicker from '@/components/AppTimePicker'
import Dialog from '@/views/live/Dialog/index.js'
import { overLiveRoomSign, isSigning, liveRoomSignCount, liveRoomSignStart, cancalLiveRoomSign, updateLiveRoomSign } from '@/api/liveRoom/index.js'
import { mapState } from 'vuex'
import { signTimeOption } from '@/views/live/columns.js'
export default {
  filters: {
    filterWaitingTimeM(val) {
      if (!val || val < 0) {
        return '00'
      }
      const result = parseInt(val)
      const m = Math.floor((result / 60)) < 10 ? '0' + Math.floor((result / 60)) : Math.floor((result / 60))
      return m
    },
    filterWaitingTimeS(val) {
      if (!val || val < 0) {
        return '00'
      }
      const result = parseInt(val)
      const s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)
      return s
    }
  },
  components: {
    AppTimePicker
  },
  data() {
    var validateSendTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择发送时间'))
      } else if (value.split(' ').length !== 2) {
        callback(new Error('请选择发送时间'))
      } else if (value < moment(this.pickerOptions[0]).format('YYYY-MM-DD HH:mm:ss')) {
        callback(new Error('发送时间要大于当前时间'))
      } else if (value > moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')) {
        callback(new Error('发送时间需要在当前时间+3小时内'))
      } else {
        callback()
      }
    }
    return {
      drag: true,
      signTimeOption,
      loading: false,
      visible: false,
      liveRoomId: this.$route.params.id,
      prizeDrawOption: [],
      top: '114px',
      form: {
        signId: '', // 编辑的时候会有签到id
        ifEdit: true, // 是否编辑状态
        signType: 1,
        signSendTime: '',
        signGuideWord: '各位同学开始签到了',
        signDuration: ''
      },
      defaultForm: {
        signId: '', // 编辑的时候会有签到id
        ifEdit: true, // 是否编辑状态
        signType: 1,
        signSendTime: '',
        signGuideWord: '各位同学开始签到了',
        signDuration: ''
      },
      rules: {
        signType: [
          { required: true, trigger: 'blur', message: '请选择签到方式' }
        ],
        signSendTime: [
          { required: true, validator: validateSendTime }
        ],
        signDuration: [
          { required: true, trigger: 'blur', message: '请选择签到时长' }
        ]
      },
      pickerOptions: ['', ''],
      timer: null,
      countNumber: 0, // 显示的时间
      remainder: 0, // 收到签到开始的剩余时间
      signCount: 0, // 当前签到参与人数
      ifCountdown: false // 是否显示倒计时页面
    }
  },
  computed: {
    ...mapState({
      signForm: state => state.im.signForm,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    'signForm.ifSignStart': {
      handler(val) {
        const nowTime = +new Date()
        console.log(this.signForm, 'signForm')
        // 变为true的时候要停止loading
        if (val === 2) {
          // 签到结束
          this.ifCountdown = true
          // 签到结束
          this.timer && clearInterval(this.timer)
          this.countNumber = 0
          this.loading = false
        } else if (val === 1) {
          // 签到开始
          this.form = {
            signId: this.signForm.signId || this.signForm.id, // 编辑的时候会有签到id
            ifEdit: false, // 是否编辑状态
            signType: this.signForm.signType,
            signSendTime: this.signForm.signSendTime,
            signGuideWord: this.signForm.signGuideWord,
            signDuration: this.signForm.signDuration
          }
          // 需要展示倒计时弹框
          // 当前有签到详情
          this.systemTime = this.signForm.systemTime
          this.remainder = this.signForm.signDuration
          this.countNumber = this.remainder
          !this.timer && this.getSignCountdown(nowTime)
          this.loading = false
          this.ifCountdown = true
        } else if (val === 0) {
          // 签到未开始
        }
      }
    },
    'liveRoomDetail.status': {
      handler(val) {
        if (val === 9) {
          this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: this.form.signDuration * 60, ifSignStart: 2 })
          this.countNumber = 0
          this.timer && clearInterval(this.timer)
        }
      },
      deep: true,
      immediate: true
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.pageInit()
  },
  methods: {
    pageInit() {
      console.log(this.$store, 'store')
      this.form = {
        signId: '', // 编辑的时候会有签到id
        ifEdit: true, // 是否编辑状态
        signType: 1,
        signSendTime: moment().format('YYYY-MM-DD'),
        signGuideWord: '各位同学开始签到了',
        signDuration: ''
      }
      this.pickerOptions = [moment().format('YYYY-MM-DD HH:mm:ss'), moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')]
      this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: this.form.signDuration * 60, ifSignStart: 0 })
      this.loading = true
      this.getSignDetail()
    },
    // 获取签到详情
    getSignDetail() {
      this.loading = true
      return isSigning(this.liveRoomId).then(res => {
        const nowTime = +new Date()
        if (!res.data) {
          // 当前没有签到详情
          this.loading = false
          this.form = {
            signId: '', // 编辑的时候会有签到id
            ifEdit: true, // 是否编辑状态
            signType: 1,
            signSendTime: '',
            signGuideWord: '各位同学开始签到了',
            signDuration: ''
          }
          this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: '', ifSignStart: 0 })
        } else {
          this.form = {
            signId: res.data.id, // 编辑的时候会有签到id
            ifEdit: false, // 是否编辑状态
            signType: res.data.signType,
            signSendTime: res.data.signSendTime,
            signGuideWord: res.data.signGuideWord,
            signDuration: res.data.signDuration / 60
          }
          // 根据系统时间判断是否已经开发倒计时了
          if (res.data.systemTime >= res.data.signSendTime) {
            // 需要展示倒计时弹框
            // 当前有签到详情
            this.systemTime = res.data.systemTime
            this.remainder = Math.floor(((moment(res.data.signEndTime).valueOf() - moment(res.data.systemTime).valueOf()) / 1000))
            console.log(this.remainder, 'this.remainder剩余时间')
            this.countNumber = this.remainder
            !this.timer && this.getSignCountdown(nowTime)
            this.ifCountdown = true
            this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: res.data.signDuration, ifSignStart: 3 })
          } else {
            // 有签到但是没有开始
            this.ifCountdown = false
            this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: res.data.signDuration, ifSignStart: 0 })
          }
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取签到参与人数
    liveRoomSignCount() {
      console.log(this.form, 'this.form')
      return liveRoomSignCount(this.form.signId).then(res => {
        res.data !== -1 && (this.signCount = res.data)
      })
    },
    // 提前结束签到
    drawPrizeAhead(signId, type = 1) {
      this.$delModal({
        tips: '提前结束签到，本次签到将立即结束，请谨慎操作！',
        success: () => {
          this.loading = true
          return overLiveRoomSign(signId).catch(() => {
            this.form = {
              signId: '', // 编辑的时候会有签到id
              ifEdit: true, // 是否编辑状态
              signType: 1,
              signSendTime: '',
              signGuideWord: '各位同学开始签到了',
              signDuration: ''
            }
            this.ifCountdown = false
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    cancalLiveRoomSign(signId) {
      this.$delModal({
        tips: '确定取消签到?',
        success: () => {
          this.loading = true
          cancalLiveRoomSign(signId).then(() => {
            this.loading = false
            // this.visible = false
            this.onhandleCancel()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击取消
    onhandleCancel() {
      this.ifCountdown = false
      this.pageInit()
    },
    // 点击开始签到
    onhandleStart() {
      this.$refs.form && this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            liveRoomId: this.liveRoomId,
            signDuration: this.form.signDuration * 60,
            signGuideWord: this.form.signGuideWord,
            signSendTime: this.form.signSendTime,
            signType: this.form.signType
          }
          this.loading = true
          liveRoomSignStart(data).then(res => {
            this.getSignDetail()
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
        type: 'SignRecord',
        title: `签到结果`,
        liveRoomId: this.liveRoomId,
        liveRoomSignId: this.signForm.signId || this.signForm.id,
        visible: true
      })
    },
    // 点击打开签到记录弹框
    openSignLogDialog() {
      Dialog.open({
        type: 'SignLog',
        title: `签到记录`,
        liveRoomId: this.liveRoomId,
        visible: true
      })
    },
    countDown(time, oldTime) {
      var nowTime = +new Date() // 返回的是当前时间总的毫秒数
      const step = Number(((nowTime - oldTime) / 1000).toFixed(0))
      var times = (time - step) // times是剩余时间总的秒数
      return times
    },
    getSignCountdown(newTime) {
      this.timer && clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(() => {
        // 倒计时
        console.log('倒计时剩余时间', this.remainder)
        this.countNumber = this.countDown(this.remainder, newTime)
        // 获取参与签到人数
        this.liveRoomSignCount()
        if (this.countNumber <= 0) {
          this.$store.commit('im/SET_ifSign', { ...this.form, signDuration: this.form.signDuration * 60, ifSignStart: 2 })
          this.countNumber = 0
          this.timer && clearInterval(this.timer)
          this.success && this.success()
        }
      }, 1000)
    },
    // 点击切换签到方式
    onhandleChangeSignType() {
      console.log('点击切换签到方式')
      if (this.form.signType === 2) {
        this.pickerOptions = [moment().format('YYYY-MM-DD HH:mm:ss'), moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')]
        this.form.signSendTime = moment().format('YYYY-MM-DD')
        console.log('点击切换签到方式', this.form.signSendTime)
      }
    },
    // 点击编辑签到
    onhandleEditSign() {
      if (this.form.signType === 2) {
        this.pickerOptions = [moment().format('YYYY-MM-DD HH:mm:ss'), moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')]
      }
      this.form.ifEdit = true
    },
    // 点击修改签到
    updateLiveRoomSign() {
      this.$refs.form && this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            liveRoomId: this.liveRoomId,
            signDuration: this.form.signDuration * 60,
            signGuideWord: this.form.signGuideWord,
            signSendTime: this.form.signSendTime,
            signType: this.form.signType
          }
          this.loading = true
          updateLiveRoomSign(this.form.signId, data).then(res => {
            this.getSignDetail()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolCoupon {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .liveToolCoupon_scroll {
      height: 100%;
    }
  }
  .sign {
    height: 100%;
    position: relative;
    .openSignLogDialog {
      position: absolute;
      right: 10px;
      top: 10px;
      height: 25px;
      flex-shrink: 0;
      border-radius: 5px;
      border: 1px solid #DCDEE1;
      background: #FFF;
      color: #0c6fff;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: bolder;
      line-height: 25px;
      padding: 0 10px;
      cursor: pointer;
    }
    .pageWrapForm {
      // height: 323px;
      padding: 10px 10px 10px 15px;
    }
    .pageWrapCountDown {
      height: 288px;
      padding: 39px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .pageWrapCountDownTime {
        .pageWrapCountDownTimeTips {
          text-align: center;
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
          margin-top: 24px;
          font-size: 25px;
          font-family: ArialMT;
          color: #0C6FFF;
          line-height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          .downTimeUnit {
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
          }
          .downTimeNumber {
            height: 44px;
            font-size: 25px;
            font-family: ArialMT;
            color: #0C6FFF;
            background: #F5F5F5;
            border-radius: 6px;
            padding: 0 8px;
            line-height: 44px;
          }
        }
      }
      .pageWrapCountDownPeople {
        margin-top: 40px;
        margin-bottom: 24px;
      }
      .pageWrapCountDownBtn {

      }
    }
    .signDurationBox {
      margin-top: 4px;
      display: flex;
      flex-wrap: wrap;
      .signDurationItem {
        width: 72px;
        height: 34px;
        background: #F7F7F7;
        border-radius: 5px;
        line-height: 34px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: bolder;
        color: #333333;
        text-align: center;
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 10px;
        &:hover {
          background: #F0F6FF;
        }
      }
      .active {
        background: #DEEBFF!important;
        color: #0C6FFF!important;
      }
    }
    .signDurationEdit {
      width: 77px;
      height: 32px;
      background: #F5F5F5;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      text-align: center;
    }
  }
  .radioClass {
    width: 400px;
    height: 32px;
    display: flex;
    align-items: center;
  }
  .signUserInfo {
    position: absolute;
    right: 24px;
    top: 0;
    bottom: 0;
    font-weight: 500;
    color: #0c6fff;
    font-size: 16px;
    cursor: pointer;
  }
  .m-t-48 {
    margin-top: 48px;
  }
  .m-r-8 {
    margin-right: 8px;
  }
  .footerBtn {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #DCDEE1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0C6FFF;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
    .revoke {
      border: 1px solid #DCDFE5;
      background: #F9F9F9;
      color: #000000;
    }
  }
}
::v-deep {
  .hotTimeLabelSelect {
    .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }
  .el-form-item {
    padding-bottom: 10px;
    margin-bottom: 0;
    .el-textarea__inner {
      padding: 6px 10px;
      color: #000;
    }
  }
  .el-form-item + .el-form-item {
    // padding-top: 10px;
    // border-top: 1px solid #F2F2F2;
  }
  .el-form-item__label {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-weight: bolder;
    line-height: 14px;
  }
  .hotStartDay {
    .el-input__suffix {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      right: 14px;
    }
  }
}
</style>
