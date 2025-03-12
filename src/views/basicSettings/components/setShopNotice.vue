<template>
  <div class="set-shop-notice">
    <el-drawer
      title="漏单通知提醒"
      :visible.sync="setShopNoticeFlag"
      :direction="direction"
      :before-close="cancelForm"
      size="600px"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="" label-width="10px">
            <span class="title-p">解密额度申请提醒</span>
            <el-switch v-model="form.isFeishuNotice" @change="changeFeishuEd" />
          </el-form-item>
          <el-form-item label="额度在" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.feishuUrgentRemindTime"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>分钟 <em class="tips-em">未恢复使用加急提醒</em></span>
          </el-form-item>
          <el-form-item label="提醒间隔" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.feishuRemindTime"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>分钟</span>
            <span class="span-tips">通知次数</span>
            <el-input
              v-model.number="form.feishuRemindNum"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>次</span>
          </el-form-item>
          <el-form-item label="" label-width="10px">
            <span class="label-span-tips">短信通知</span>
            <el-switch
              v-model="form.isMessageNotice"
              @change="changeEdMessage"
            />
          </el-form-item>
          <el-form-item label="短信提醒在通知" label-width="150px">
            <el-input
              v-model.number="form.messageInterventionNum"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>次 <em class="tips-em">后发送</em></span>
          </el-form-item>
          <el-form-item label="提醒间隔" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.messageRemindTime"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>分钟</span>
            <span class="span-tips">通知次数</span>
            <el-input
              v-model.number="form.messageRemindNum"
              oninput="if(value > 99) value = 99; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>次</span>
          </el-form-item>
          <el-form-item label="" label-width="10px" style="margin-top: 40px">
            <span class="title-p">未解密订单超额提醒</span>
            <el-switch
              v-model="form.isFeishuNoticeWjm"
              @change="wjmChangeFlag"
            />
          </el-form-item>
          <el-form-item label="未解密订单达到" label-width="120px">
            <el-input
              v-model.number="form.dataNum"
              oninput="if(value > 9999) value = 9999; if(value < 1 || value == '' || value == null) value = 1;"
              size="mini"
              class="short-input"
            />
            <span>条 <em class="tips-em">使用加急提醒</em></span>
          </el-form-item>
          <el-form-item label="启动时间" :label-width="formLabelWidth">
            <el-time-picker
              v-model="form.timeArray"
              is-range
              range-separator="-"
              format="HH:mm"
              value-format="HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              :picker-options="{
                selectableRange: '00:00 - 23:59'
              }"
              class="time-choose"
            />
          </el-form-item>
          <el-form-item label="时间间隔" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.remindTimeWjm"
              oninput="if(value > 99) value = 99; if(value < 0 || value == '' || value == null) value = 0;"
              size="mini"
              class="short-input"
            />
            <span>分钟</span>
          </el-form-item>
          <el-form-item label="" label-width="10px">
            <span class="label-span-tips">短信通知</span>
            <el-switch
              v-model="form.isMessageNoticeWjm"
              @change="wjmChangeMessage"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer bottom-cls">
          <el-button type="primary" size="mini" @click="sureToSubmit">
            确定
          </el-button>
          <el-button size="mini" @click="cancelForm">取 消</el-button>
        </div>
      </div></el-drawer
    >
  </div>
</template>

<script>
import {
  getDecryptingReminderDetail,
  getComplementOrderReminderSettingDetail,
  setDecryptingReminderDetail,
  setComplementOrderReminder
} from '@/api/system/dataConfiguration.js'
export default {
  components: {},
  props: {
    setShopNoticeFlag: {
      type: Boolean,
      default: false
    },
    shopNoticeFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      direction: 'rtl',
      form: {
        feishuRemindNum: 1,
        feishuRemindTime: '',
        feishuUrgentRemindTime: '',
        isFeishuNotice: false,
        isMessageNotice: false,
        messageInterventionNum: '',
        messageRemindNum: 1,
        messageRemindTime: 1,
        timeArray: ['00:00', '23:59'],
        isFeishuNoticeWjm: false,
        isMessageNoticeWjm: false,
        remindTimeWjm: '',
        dataNum: ''
      },
      formLabelWidth: '80px'
    }
  },
  mounted() {},
  created() {
    this.getDecryptingReminderDetail()
    this.getComplementOrderReminderSettingDetail()
  },
  methods: {
    wjmChangeFlag() {
      if (!this.shopNoticeFlag) {
        this.$message.error('请先打开店铺漏单通知！')
        this.form.isFeishuNoticeWjm = !this.form.isFeishuNoticeWjm
      }
      const that = this
      setTimeout(function () {
        if (!that.form.isFeishuNoticeWjm) {
          that.form.isMessageNoticeWjm = false
        }
      }, 200)
    },
    wjmChangeMessage() {
      if (!this.form.isFeishuNoticeWjm) {
        this.$message.error('请先打开未解密额度的通知！')
        this.form.isMessageNoticeWjm = !this.form.isMessageNoticeWjm
      }
    },
    changeFeishuEd() {
      if (!this.shopNoticeFlag) {
        this.$message.error('请先打开店铺漏单通知！')
        this.form.isFeishuNotice = !this.form.isFeishuNotice
      }
      const that = this
      setTimeout(function () {
        if (!that.form.isFeishuNotice) {
          that.form.isMessageNotice = false
        }
      }, 200)
    },
    changeEdMessage() {
      if (!this.form.isFeishuNotice) {
        this.$message.error('请先打开解密额度的通知！')
        this.form.isMessageNotice = !this.form.isMessageNotice
      }
    },
    sureToSubmit() {
      if (this.form.messageRemindNum > this.form.feishuRemindNum) {
        this.$message.error('短信提醒需小于等于提醒次数，请重新修改！')
        return
      }
      const params = {
        feishuRemindNum: this.form.feishuRemindNum,
        feishuRemindTime: this.form.feishuRemindTime,
        feishuUrgentRemindTime: this.form.messageRemindTime,
        isFeishuNotice: this.form.isFeishuNotice ? 1 : 0,
        isMessageNotice: this.form.isMessageNotice ? 1 : 0,
        messageInterventionNum: this.form.messageInterventionNum,
        messageRemindNum: this.form.messageRemindNum,
        messageRemindTime: this.form.messageRemindTime
      }
      // 设置解密数据的提醒详情
      setDecryptingReminderDetail(params).then(res => {
        if (res.code === 1) {
          const paramsForComplement = {
            dataNum: this.form.dataNum,
            endTime: this.form.timeArray[1],
            isFeishuNotice: this.form.isFeishuNoticeWjm ? 1 : 0,
            isMessageNotice: this.form.isMessageNoticeWjm ? 1 : 0,
            remindTime: this.form.remindTimeWjm,
            startTime: this.form.timeArray[0]
          }
          setComplementOrderReminder(paramsForComplement).then(res => {
            if (res.code === 1) {
              this.$message.success('提交成功！')
              this.$emit('closeDrawer')
            }
          })
        }
      })
    },
    getDecryptingReminderDetail() {
      getDecryptingReminderDetail().then(res => {
        if (res.code === 1) {
          this.form.feishuRemindNum = res.data.feishuRemindNum
          this.form.feishuRemindTime = res.data.feishuRemindTime
          this.form.feishuUrgentRemindTime = res.data.feishuUrgentRemindTime
          this.form.isFeishuNotice = res.data.isFeishuNotice === 1
          this.form.isMessageNotice = res.data.isMessageNotice === 1
          this.form.messageInterventionNum = res.data.messageInterventionNum
          this.form.messageRemindNum = res.data.messageRemindNum
          this.form.messageRemindTime = res.data.messageRemindTime
        }
      })
    },
    getComplementOrderReminderSettingDetail() {
      getComplementOrderReminderSettingDetail().then(res => {
        if (res.code === 1) {
          this.form.isFeishuNoticeWjm = res.data.isFeishuNotice === 1
          this.form.isMessageNoticeWjm = res.data.isMessageNotice === 1
          this.form.timeArray = [res.data.startTime, res.data.endTime]
          this.form.remindTimeWjm = res.data.remindTime
          this.form.dataNum = res.data.dataNum
        }
      })
    },
    cancelForm() {
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style lang="scss" scoped>
.set-shop-notice {
  ::v-deep .el-drawer__header {
    padding-bottom: 20px;
    font-weight: bold;
    color: #3c3c3c;
    border-bottom: 1px solid #ececec;
  }
  .demo-drawer__content {
    padding: 15px;
  }
  .title-p {
    margin-right: 20px;
    color: #409eff;
    font-weight: bold;
  }
  .short-input {
    width: 100px;
    margin-right: 20px;
  }
  .tips-em {
    margin-left: 20px;
    font-style: normal;
  }
  .span-tips {
    margin-left: 20px;
    margin-right: 15px;
  }
  .label-span-tips {
    width: 60px;
    display: inline-block;
    text-align: right;
    font-weight: bold;
    margin-right: 15px;
    color: #606266;
  }

  .time-choose {
    width: 180px;
  }
  .bottom-cls {
    padding-left: 15px;
  }
}
</style>
