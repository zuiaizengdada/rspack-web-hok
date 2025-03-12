<template>
  <AppDialog
    v-model="visible"
    :footer-text="['确定', '取消']"
    title="换人就读"
    width="620px"
    height="600px"
    top="60px"
    :loading="loading"
    @success="onSubmit"
    @close="handleClose"
  >
    <el-scrollbar style="height: 600px">
      <div class="dialog-container">
        <div class="dialog-title">
          传订单截图
          <span
            class="tips"
          >只能上传1张大小在2M以下格式为jpg,png,jpeg的图片</span>
        </div>
        <div class="dialog-content flex image-container">
          <Upload2OSS
            ref="uploadImg"
            v-model="form.url"
            :max-m="2"
            class="order-upload"
            tips=""
            @change="handleChange"
          />
          <div class="tips-content">
            <div>原订单号：{{ form.orderNo }}</div>
            <!-- <div>原手机号：{{ form.phone }}</div> -->
          </div>
        </div>
        <div class="dialog-title">变更后账号</div>
        <div class="radioBox">
          <el-radio v-model="form.accountType" :label="1" @change="handleAccountType">手机号</el-radio>
          <el-radio v-model="form.accountType" :label="2" @change="handleAccountType">邮箱</el-radio>
        </div>
        <div v-if="form.accountType === 1" class="dialog-content content_bg">
          <div class="flex flex-middle">
            <div class="form-title">手机号</div>
            <el-input
              v-model="form.newPhone"
              size="small"
              style="width: 270px"
              clearable
              :maxlength="phoneMaxlength(form.newPhoneAreacode)"
              @input="e => delNoNumber(e,'newPhone')"
            >
              <el-select
                slot="prepend"
                v-model="form.newPhoneAreacode"
                placeholder="请选择"
                filterable
                style="width: 100px"
              >
                <el-option-group
                  v-for="group in smsAreaList"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.areaCode"
                    :label="`+${item.areaCode} ${item.areaChineseName}`"
                    :value="item.areaCode"
                  >
                    <span style="float: left">{{ item.areaChineseName }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >+{{ item.areaCode }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-input>
          </div>
          <div v-if="setMsg.bType === 1" class="flex flex-middle top10">
            <div class="form-title">再次输入手机号</div>
            <el-input
              v-model="form.copyPhone"
              size="small"
              style="width: 270px"
              clearable
              :maxlength="phoneMaxlength(form.phoneAreaCode)"
              @input="e => delNoNumber(e,'copyPhone')"
            >
              <el-select
                slot="prepend"
                v-model="form.phoneAreaCode"
                filterable
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option-group
                  v-for="group in smsAreaList"
                  :key="group.label"
                  filterable
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.areaCode"
                    :label="`+${item.areaCode} ${item.areaChineseName}`"
                    :value="item.areaCode"
                  >
                    <span style="float: left">{{ item.areaChineseName }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >+{{ item.areaCode }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-input>
          </div>
          <div v-if="setMsg.bType === 2" class="flex btn">
            <el-button
              size="small"
              type="primary"
              :loading="codeLoading"
              @click="handleCode"
            >{{ codeBtnText }}</el-button>
            <el-button
              v-if="
                codeBtnVoiceText === '获取语音验证码' &&
                  form.newPhoneAreacode === '86'
              "
              size="small"
              type="primary"
              :loading="codeLoading"
              maxlength="4"
              @click="handleVoiceCode"
            >{{ codeBtnVoiceText }}</el-button>
          </div>
          <div v-if="setMsg.bType === 2" class="flex flex-middle">
            <div class="form-title">验证码</div>
            <el-input
              v-model="form.code"
              size="small"
              style="width: 270px"
              clearable
            />
          </div>
        </div>
        <div v-else class="dialog-content content_bg">
          <div class="flex flex-middle">
            <div class="form-title">邮箱号</div>
            <el-autocomplete
              v-model="form.newEmail"
              :trigger-on-focus="false"
              style="width: 270px"
              :fetch-suggestions="querySearch"
              placeholder="请输入邮箱号"
            />
          </div>
          <div v-if="setMsg.bType === 1" class="flex flex-middle top10">
            <div class="form-title">再次输入邮箱</div>
            <el-autocomplete
              v-model="form.copyEmail"
              :trigger-on-focus="false"
              style="width: 270px"
              :fetch-suggestions="querySearch"
              placeholder="请输入邮箱号"
            />
          </div>
          <div v-if="setMsg.bType === 2" class="flex btn">
            <el-button
              size="small"
              type="primary"
              :loading="codeLoading"
              @click="handleCode"
            >{{ codeBtnText }}</el-button>
            <!-- <el-button
              v-if="codeBtnVoiceText === '获取语音验证码'"
              size="small"
              type="primary"
              :loading="codeLoading"
              maxlength="4"
              @click="handleVoiceCode"
            >{{ codeBtnVoiceText }}</el-button> -->
          </div>
          <div v-if="setMsg.bType === 2" class="flex flex-middle">
            <div class="form-title">验证码</div>
            <el-input
              v-model="form.emailCode"
              size="small"
              style="width: 270px"
              clearable
            />
          </div>
        </div>
        <div class="dialog-title mt-20">操作原因</div>
        <div class="dialog-content">
          <m-select
            v-model="form.operatortType"
            :request="getDeliveryDict"
            :param="{ value: 'type', label: 'label' }"
            style="margin-bottom: 16px; width: 328px"
            size="small"
            placeholder="请选择"
          />
          <el-input
            v-model="form.remark"
            maxlength="200"
            show-word-limit
            size="small"
            :rows="4"
            type="textarea"
            clearable
          />
        </div>
        <div class="m-20">
          <span class="dialog-title" style="margin-right: 10px">上传凭证</span>
          <span
            class="tips"
          >1.图片格式限制为jpg,png,jpeg；2.单图片大小2M以下；3.最多上传6张</span>
        </div>
        <div class="dialog-content">
          <Upload2OSS
            ref="uploadImgList"
            v-model="form.urls"
            :limit="6"
            :max-m="2"
            class="order-upload"
            tips=""
            @change="handleUrlsChange"
          />
        </div>
      </div>
    </el-scrollbar>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import Upload2OSS from '@/components/AppTemplate/Upload2OSS'
import { handleEmailValid } from '@/utils'
import { mapGetters } from 'vuex'
import {
  safeSettingGet,
  getOrderAnalysis,
  getDeliveryDict,
  saveEnrollment,
  changePermissionSmsCode,
  changePermissionVoiceCode,
  changeEmailCode,
  packageSaveEnrollment
} from '@/api/deliver/studentManagement'
let timer = null
export default {
  name: 'ChangeReadDialog',
  components: {
    AppDialog,
    Upload2OSS
  },
  props: {
    isPackage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areaList: [
        {
          label: '热门城市',
          options: [
            {
              value: 'Shanghai',
              label: '上海'
            },
            {
              value: 'Beijing',
              label: '北京'
            }
          ]
        },
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            },
            {
              value: 'Shenzhen',
              label: '深圳'
            },
            {
              value: 'Guangzhou',
              label: '广州'
            },
            {
              value: 'Dalian',
              label: '大连'
            }
          ]
        }
      ],
      form: {
        accountType: 1
      },
      loading: false,
      codeLoading: false,
      time: 60,
      codeBtnText: '获取验证码',
      codeBtnVoiceText: '获取语音验证码',
      visible: false,
      row: {},
      setMsg: {},
      options: ['客户不愿意配合', '客户不愿意配合']
    }
  },
  computed: {
    ...mapGetters(['smsAreaList', 'mailSuffixesList'])
  },
  methods: {
    verifyMaxPhone(code) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const data = smsAreaList.find(item => item.areaCode === code)
      return data
    },
    phoneMaxlength(code) {
      const maxObj = this.verifyMaxPhone(code)
      return maxObj?.length || 15
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    querySearch(queryString, cb) {
      const mailSuffixesList = [...this.mailSuffixesList]
      let list = []

      if (!queryString.includes('@')) {
        list = mailSuffixesList.map(suffix => ({
          value: `${queryString}${suffix}`,
          address: `${queryString}${suffix}`
        }))
      } else {
        const [strOne, strTwo] = queryString.split('@')
        const filteredSuffixes = strTwo
          ? mailSuffixesList.filter(suffix => suffix.includes(strTwo))
          : mailSuffixesList

        list = filteredSuffixes.map(suffix => ({
          value: `${strOne}${suffix}`,
          address: `${strOne}${suffix}`
        }))
      }

      cb(list)
    },
    handleAccountType(value) {
      if (this.codeBtnText !== '获取验证码') {
        this.$message.warning('验证码正在发送中')
        this.form.accountType = value === 1 ? 2 : 1
        return
      }
    },
    async handleCode() {
      if (this.codeBtnText !== '获取验证码') {
        this.$message.warning('验证码正在发送中')
        return
      }
      if (this.form.accountType === 1) {
        if (!this.form.newPhone) {
          return this.$message.warning('请填写变更后手机号')
        }
        if (!this.form.newPhoneAreacode) {
          return this.$message.warning('请选择国际区号')
        }
        const verifyPhone = this.verifyPhone(
          this.form.newPhone,
          this.form.newPhoneAreacode
        )
        if (!verifyPhone) return this.$message.error('请输入完整的手机号!')
      } else {
        if (!this.form.newEmail) {
          return this.$message.warning('请填写邮箱号')
        }
      }
      this.codeLoading = true
      if (this.form.accountType === 1) {
        try {
          const { code } = await changePermissionSmsCode({
            phone: this.form.newPhone,
            phoneAreaCode:
              this.form.accountType === 1
                ? this.form.newPhoneAreacode
                : undefined
          })
          this.codeLoading = false
          if (code === 1) {
            this.$message.success('验证码发送成功')
            this.setTime()
          }
        } catch {
          this.codeLoading = true
        }
      } else {
        try {
          if (!handleEmailValid(this.form.newEmail)) {
            this.$message.warning('请填写正确的邮箱号')
            this.codeLoading = false
            return
          }
          const { code } = await changeEmailCode({
            email: this.form.newEmail
          })
          this.codeLoading = false
          if (code === 1) {
            this.$message.success('验证码发送成功')
            this.setTime()
          }
        } catch {
          this.codeLoading = true
        }
      }
    },
    async handleVoiceCode() {
      if (this.codeBtnVoiceText !== '获取语音验证码') {
        this.$message.warning('验证码正在发送中')
        return
      }
      if (!this.form.newPhone) {
        return this.$message.warning('请填写变更后手机号')
      }
      if (this.form.accountType === 1 && !this.form.newPhoneAreacode) {
        return this.$message.warning('请选择国际区号')
      }
      const verifyPhone = this.verifyPhone(
        this.form.newPhone,
        this.form.newPhoneAreacode
      )
      if (!verifyPhone) return this.$message.warning('请输入完整的手机号!')
      this.codeLoading = true
      try {
        const { code } = await changePermissionVoiceCode({
          phone: this.form.newPhone,
          phoneAreaCode:
            this.form.accountType === 1 ? this.form.newPhoneAreacode : undefined
        })
        this.codeLoading = false
        if (code === 1) {
          this.$message.success('验证码发送成功')
          this.time = 120
          this.setTime()
        }
      } catch {
        this.codeLoading = false
      }
    },
    setTime() {
      this.time--
      this.codeBtnText = `验证码发送中 ${this.time}s`
      this.codeBtnVoiceText = `验证码发送中 ${this.time}s`
      timer = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(timer)
          this.time = 60
          this.codeBtnText = `获取验证码`
          this.codeBtnVoiceText = `获取语音验证码`
          return
        }
        this.time--
        this.codeBtnText = `验证码发送中 ${this.time}s`
        this.codeBtnVoiceText = `验证码发送中 ${this.time}s`
      }, 1000)
    },
    open(row) {
      this.codeBtnText = '获取验证码'
      this.codeBtnVoiceText = '获取语音验证码'
      this.time = 60
      this.getDetails()
      this.row = row
      this.form = {
        accountType: 1
      }
      this.visible = true
    },
    getDeliveryDict() {
      return getDeliveryDict({ key: 'ReplacementEnrollmentRemarkType' })
    },
    async getDetails() {
      const { code, data = {} } = await safeSettingGet()
      if (code === 1 && data) this.setMsg = data
      if (data.bType === 1) {
        this.$uweb?.setAction('Event_PlayNCode_Btn')
      } else {
        this.$uweb?.setAction('Event_PlayYCode_Btn')
      }
    },
    handleUrlsChange(fileList) {
      if (!fileList.length) {
        this.form.urls = []
        return
      }
      const urls = fileList.map(item => item.url)
      this.form.urls = urls
    },
    async handleChange(fileList) {
      if (!fileList.length) {
        this.form = {
          ...this.form,
          phone: '',
          orderNo: ''
        }
        this.form.url = ''
        return
      }
      const url = fileList[0]?.url
      this.form.url = url
      const params = {
        url,
        id: this.row.id || this.row.deliveryInfoId
      }
      try {
        const { code, data } = await getOrderAnalysis(params)
        if (code === 1) {
          this.form = {
            ...this.form,
            orderNo: data.orderNo
          }
          if (!data.orderNo) {
            this.$message.warning('订单号解析失败，请检查订单号是否与图片一致!')
          }
        } else {
          this.form = {
            ...this.form,
            phone: '',
            orderNo: ''
          }
        }
      } catch {
        this.form = {
          ...this.form,
          phone: '',
          orderNo: ''
        }
      }
    },
    handleClose() {
      this.init()
    },
    verifyPhone(phone, areaCode) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const isRegex = smsAreaList.find(
        item => item.areaCode === areaCode
      )?.regex
      if (!isRegex) return true
      return new RegExp(isRegex).test(phone)
    },
    async onSubmit() {
      if (!this.form.url) return this.$message.warning('请上传订单截图')
      if (this.form.url && !this.form.orderNo) {
        return this.$message.warning('订单截图识别错误')
      }
      if (this.form.accountType === 1) {
        if (!this.form.newPhone) {
          return this.$message.warning('请填写变更后手机号')
        }
        if (!this.form.newPhoneAreacode) {
          return this.$message.warning('请选择手机区号')
        }
        const verifyPhone = this.verifyPhone(
          this.form.newPhone,
          this.form.newPhoneAreacode
        )
        if (!verifyPhone) return this.$message.warning('请输入完整的手机号!')
        if (this.setMsg?.bType === 2 && !this.form.code) {
          return this.$message.warning('请填写验证码')
        }
        if (this.setMsg.bType === 1) {
          if (!this.form.copyPhone) {
            return this.$message.warning('请再确认手机号码')
          }
          if (this.form?.copyPhone !== this.form.newPhone) {
            return this.$message.warning('变更后手机号两次输入不一致')
          }
          if (!this.form.phoneAreaCode) {
            return this.$message.warning('请选择手机区号')
          }
          const verifyPhone = this.verifyPhone(
            this.form.copyPhone,
            this.form.phoneAreaCode
          )
          if (!verifyPhone) return this.$message.warning('请输入完整的手机号!')
        }
      } else {
        if (!this.form.newEmail) {
          return this.$message.warning('请填写邮箱号')
        }
        if (!handleEmailValid(this.form.newEmail)) {
          return this.$message.warning('请填写正确的邮箱号')
        }
        if (this.setMsg?.bType === 2 && !this.form.emailCode) {
          return this.$message.warning('请填写验证码')
        }
        if (this.setMsg.bType === 1) {
          if (!this.form.copyEmail) {
            return this.$message.warning('请再确认邮箱号')
          }
          if (!handleEmailValid(this.form.copyEmail)) {
            return this.$message.warning('请填写正确的邮箱号')
          }
          if (this.form?.newEmail !== this.form.copyEmail) {
            return this.$message.warning('变更后邮箱号两次输入不一致')
          }
        }
      }
      if (!this.form.operatortType) {
        return this.$message.warning('请选择操作原因')
      }
      if (!this.form.urls) return this.$message.warning('请上传凭证')
      const api = this.isPackage ? packageSaveEnrollment : saveEnrollment
      const formData = {
        ...this.form,
        newEmail: this.form.accountType === 1 ? undefined : this.form.newEmail,
        copyEmail:
          this.form.accountType === 1 ? undefined : this.form.copyEmail,
        code:
          this.form.accountType === 1 ? this.form.code : this.form.emailCode,
        newPhoneAreacode:
          this.form.accountType === 1 ? this.form.newPhoneAreacode : undefined,
        newPhone: this.form.accountType === 1 ? this.form.newPhone : undefined,
        copyPhone: this.form.accountType === 1 ? this.form.copyPhone : undefined
      }
      const { code, msg } = await api({
        ...formData,
        id: this.row.id || this.row.deliveryInfoId
      })
      if (code !== 1) {
        this.$message.error(msg)
      } else {
        this.visible = false
        if (timer) clearInterval(timer)
        this.$message.success('换人就读成功')
        this.init()
      }
    },
    init() {
      if (timer) clearInterval(timer)
      this.form = {}
      this.codeBtnText = `验证码发送中`
      this.codeBtnVoiceText = `验证码发送中`
      this.$nextTick(() => {
        this.$refs.uploadImg.setFileList([])
        this.$refs.uploadImgList.setFileList([])
      })
      this.time = 60
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  padding: 20px;
  .radioBox {
    margin-top: -10px;
    margin-bottom: 12px;
  }
  .dialog-title {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .content_bg {
    background: #fafafa;
    padding: 16px;
    display: inline-block;
    border-radius: 4px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .form-title {
    width: 110px;
  }
  .btn {
    margin: 16px 50px 16px;
    margin-left: 110px;
  }
  .tips {
    font-size: 12px;
    color: #777777;
    font-weight: 400;
  }
  .tips-content {
    border-radius: 8px;
    background: #fafafa;
    padding: 16px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #333333;
    font-size: 14px;
    font-weight: 400;
  }
  .image-container {
    height: 90px;
    margin-bottom: 16px;
  }
  .order-upload {
    .el-upload-dragger,
    .image_poster,
    .uploadView {
      height: 90px;
      width: 120px;
    }
  }
  .m-20 {
    margin: 20px 0;
  }
  .top10 {
    margin-top: 10px;
  }
}
</style>
