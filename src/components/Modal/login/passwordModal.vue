<template>
  <AppDialog
    v-if="config.visible"
    v-model="config.visible"
    :title="title"
    width="600px"
    height="165px"
    top="10vh"
  >
    <div v-loading="loading" class="choose_resource">
      <el-form v-if="isPhoneVerification" ref="phoneForm" :model="phoneForm" :rules="rules" label-width="100px">
        <el-form-item label="手机号码" prop="phoneNumber">
          {{ phoneForm.phoneNumber }}
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-row :gutter="10" style="height: 40px">
            <el-col :span="11">
              <el-input
                v-model.trim="phoneForm.code"
                clearable
                maxlength="6"
                show-word-limit
              />
            </el-col>
            <el-col :span="6" style="height: 40px">
              <span v-if="sendDisabled" class="login-send-code">{{ time + '秒后获取' }}</span>
              <span
                v-else
                v-loading="btnLoading"
                class="login-send-code"
                style="width: 100%"
                @click="_sendCode"
              >{{ btnText }}</span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-form v-else ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
          <div>
            <el-input v-model.trim="form.newPassword" show-password class="w-300" auto-complete="new-password" @input="(e) => nickNameInput(e, 'newPassword')" />
            <div>（密码必须包含英文和数字，长度不能少于8位。）</div>
          </div>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model.trim="form.confirmPassword" show-password class="w-300" @keyup.enter.native="successFn" @input="(e) => nickNameInput(e, 'confirmPassword')" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="password-modal-footer">
      <el-button v-if="isPhoneVerification" type="primary" @click="verificationFn">下一步</el-button>
      <el-button v-else type="primary" @click="successFn()">确定</el-button>
      <el-button @click="close()">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { updatePwdCode, updatePwdVerify, loginV1UpdatePassword } from '@/api/login'
export default {
  name: 'PasswordModal',
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          id: ''
        }
      }
    }
  },
  data() {
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$)[0-9A-Za-z\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{8,}$/.test(value)) {
        callback(new Error('密码格式不正确!'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      title: '修改密码',
      loading: false,
      form: {
        newPassword: '', // 新密码
        confirmPassword: '' // 确认新密码
      },
      phoneForm: {
        phoneNumber: '',
        code: ''
      },
      isPhoneVerification: true,
      btnText: '发送验证码',
      btnLoading: false,
      time: 60,
      sendDisabled: false,
      rules: {
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        newPassword: [{ validator: validateNewPass, trigger: 'blur' }],
        confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
      },
      secret: '',
      interval: null
    }
  },
  //   computed: {
  //     ...mapGetters([
  //       'goodsType_obj'
  //     ])
  //   },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          console.log(val, '打开弹框')
          this.init()
        }
      },
      deep: true
    }
  },
  methods: {
    nickNameInput(e, key) {
      this.form[key] = e.replace(/(?:[\u4e00-\u9fa5·])/g, '')
    },
    successFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.updatePassword()
        } else {
          return false
        }
      })
      // this.visible = false
    },
    _sendCode() {
      this.$refs.phoneForm.validateField('phoneNumber', async(valid) => {
        if (!valid) {
          this.btnLoading = true
          try {
            await updatePwdCode(this.phoneForm.phoneNumber)
            this.sendDisabled = true
            this.interval = setInterval(() => {
              if (this.time-- <= 0) {
                this.time = 60
                this.sendDisabled = false
                this.btnLoading = false
                this.btnText = '重新发送'
                clearInterval(this.interval)
              }
            }, 1000)
          } catch (e) {
            this.sendDisabled = false
            this.btnLoading = false
            this.btnText = '重新发送'
          }
        }
      })
    },
    init() {
      this.form = {
        newPassword: '', // 新密码
        confirmPassword: '' // 确认新密码
      }
      this.phoneForm = {
        phoneNumber: this.$store.getters.userInfo?.phoneNumber,
        code: ''
      }
      this.secret = ''
      this.isPhoneVerification = true
      this.btnText = '发送验证码'
    },
    async verificationFn() {
      this.loading = true
      this.$refs.phoneForm.validate(async(valid) => {
        if (valid) {
          try {
            const { data } = await updatePwdVerify(this.phoneForm)
            this.secret = data.secret
            this.isPhoneVerification = false
            this.loading = false
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          this.loading = false
        }
      })
    },
    updatePassword() {
      this.loading = true
      const params = {
        newPassword: this.form.newPassword,
        confirmPassword: this.form.confirmPassword,
        phoneNumber: this.phoneForm.phoneNumber,
        secret: this.secret
      }
      loginV1UpdatePassword(params)
        .then(async (res) => {
          this.config.visible = false
          this.loading = false
          this.$notify.success('修改密码成功！')
          this.$store.dispatch('user/resetToken')
            .then(() => {
              location.reload()
            })
          await this.$store.dispatch('user/logout')
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
        .catch((err) => {
          this.loading = false
          console.log(err, '修改失败')
        })
    },
    close() {
      this.config.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
.choose_resource {
  padding: 20px;
}
.password-modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
.login-send-code {
  cursor: pointer;
  color: #1890ff;
}
</style>
