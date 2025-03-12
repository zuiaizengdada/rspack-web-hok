<template>
  <div class="sign-set-container">
    <base-title title="报名设置" style="margin-bottom: 20px" />
    <div class="flex">
      <preview-content class="preview-content" :data="form.applyConfig" />

      <el-form
        ref="form"
        :model="form.applyConfig"
        :rules="rules"
        size="mini"
        label-width="200px"
        label-position="right"
      >
        <el-form-item label="允许进入直播间">
          <live-room-personnel
            ref="liveRoomRef"
            @change="handleChangeLivePersonnel"
          />
        </el-form-item>
        <el-form-item label="是否需要报名页" prop="applyPageFlag">
          <el-switch
            v-model="form.applyConfig.applyPageFlag"
            :active-value="1"
            :inactive-value="0"
            :disabled="disabledApplyPageFlag"
          />
        </el-form-item>
        <el-form-item label="直播封面">
          <upload-cover @upload="handleUploadCover" />
        </el-form-item>
        <el-form-item label="上传报名详情页">
          <register-upload @upload="handleUploadRegister" />
        </el-form-item>

        <el-form-item label="底部按钮文字" prop="notApplyViewText">
          <span style="color: #333">未报名用户，显示</span>
          <el-input
            v-model="form.applyConfig.notApplyViewText"
            style="width: 160px; margin-left: 6px"
            show-word-limit
            maxlength="10"
          />

          <!-- <p style="width: 400px">
            <span style="color: #333">已报名用户，显示</span>
            <el-input
              v-model="form.applyConfig.applyViewText"
              style="width: 120px; margin-left: 6px"
            />
          </p> -->
        </el-form-item>
        <el-form-item label="需要填写手机号或邮箱登录" prop="applyPhoneFlag">
          <el-switch
            v-model="form.applyConfig.applyPhoneFlag"
            :active-value="1"
            :disabled="disabledApplyPageFlag"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          v-show="form.applyConfig.applyPhoneFlag"
          label="关注公众号"
          prop="applyOfficialFlag"
        >
          <follow-account
            @change="handleChangeFollowAccount"
            @select="handleSelectFollowAccount"
          />
        </el-form-item>
        <el-form-item label="消息通知" prop="msgType">
          <message-notification @select="handleSelectMessage" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import BaseTitle from '../Common/BaseTitle'
import registerUpload from './registerUpload/index'
import UploadCover from './UploadCover/index'
import FollowAccount from './FollowAccount/index'
import MessageNotification from './MessageNotification/index'
import PreviewContent from './PreviewContent/index'
import BackgroundPng from '../../image/background.png'
import LiveRoomPersonnel from './LiveRoomPersonnel/index'
export default {
  components: {
    BaseTitle,
    registerUpload,
    UploadCover,
    FollowAccount,
    MessageNotification,
    LiveRoomPersonnel,
    PreviewContent
  },
  data() {
    return {
      form: {
        applyConfig: {
          name: '',
          startTime: '',
          applyImgUrl: '', // 报面详情页图片
          applyLiveEnd: '', // 是否允许直播结束报名 false-0-不允许；true-1-允许；默认：false-0
          applyMsgs: [
            // {
            //   id: '',
            //   msgTemplateId: '', // 消息模版ID
            //   msgType: '', // 消息类型，1-短信通知；2-公众号通知
            //   sendMsgFlag: '', // 是否发送：0否，1是
            //   timeMinute: '', // 分钟:HH:mm:ss
            //   timeType: '' // 时间类型，1-直播前；2-直播后
            // }
          ],
          applyPageFlag: 1, // 是否需要报名页,0-不需要；1-需要
          applyOfficialFlag: 0, // 报名页关注公众号,0-不需要；1-需要关注;2-强制关注
          applyOfficialId: '', // 报名页公众号ID
          applyPhoneFlag: 1, // 报名页是否需要填写手机号,0-不需要；1-需要
          applyViewText: '立即学习', // 已报名用户底部按钮文字
          coverImgUrl:
            'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg', // 直播间封面图
          liveRoomId: '', // 直播间主键ID
          liveRoomTrailers: [], // 直播下一场直播预告
          notApplyViewText: '立即预约' // 未报名用户底部按钮文字
        },
        id: undefined,
        model: 1 // 允许进入直播间模式：1，所有可进，2，指定人员可进
      },
      rules: {
        notApplyViewText: [
          {
            required: true,
            message: '请输入未报名用户底部按钮文字',
            trigger: 'blur'
          }
        ]
      },
      disabledApplyPageFlag: false,
      BackgroundPng
    }
  },
  inject: ['global'],
  methods: {
    handleUploadCover(url) {
      this.form.applyConfig.coverImgUrl = url
    },
    handleUploadRegister(list) {
      const applyImgUrls = list.map(item => item.url).join(',')

      this.form.applyConfig.applyImgUrl = applyImgUrls
    },
    handleChangeFollowAccount(val) {
      this.form.applyConfig.applyOfficialFlag = Number(val)
    },
    handleSelectFollowAccount(val) {
      this.form.applyConfig.applyOfficialId = val
    },
    handleSelectMessage(list) {
      this.form.applyConfig.applyMsgs = list
    },
    updateFormName(name) {
      this.form.applyConfig.name = name
    },
    updateFormTime(time) {
      this.form.applyConfig.startTime = time
    },
    updateFeesType(val) {
      if (Number(val) === 2) {
        this.$refs.liveRoomRef.model = 2
        this.form.model = 2
        this.$refs.liveRoomRef.modelDisabled = true
        this.form.id = this.global.liveRoomId
        this.form.applyConfig.applyPageFlag = 1
        this.form.applyConfig.applyPhoneFlag = 1
      } else {
        this.$refs.liveRoomRef.modelDisabled = false
      }
      this.disabledApplyPageFlag = Number(val) === 2
    },
    handleChangeLivePersonnel(val) {
      this.form.model = val
      if (val === 2) {
        this.form.id = this.global.liveRoomId
      } else {
        this.form.id = undefined
      }
    },
    submitForm() {
      console.log(this.form, '报名设置提交参数。。。')
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, fields) => {
          if (valid) {
            resolve(this.form)
            // return true
          } else {
            this.$nextTick(() => {
              const firstErrorField = Object.keys(fields)[0]
              const errorElement = this.$el.querySelector(`[for="${firstErrorField}"]`)
              if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth' })
              }
            })
            reject(false)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-content {
  flex-basis: 240px;
  flex-shrink: 0;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  padding-right: 20px;
}
</style>
