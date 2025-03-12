<template>
  <div class="page_wrap">
    <div class="page_left">
      <div class="page_bg">
        <div class="page_wrap_title">欢迎使用</div>
        <div class="page_wrap_title m-t-36">伏羲云系统</div>
      </div>
    </div>
    <div class="page_right">
      <div class="login" :style="`top:${isLogin?'304px':'204px'}`">
        <template v-if="isLogin">
          <el-form ref="loginForm" key="login" :model="loginForm" :rules="loginRules" class="login-form">
            <div>
              <div class="form_tabs">
                <div class="form_tab_pane" :class="{ active: !active }" @click="changeTabs(false)">密码登录</div>
                <div class="form_tab_pane" :class="{ active: active }" @click="changeTabs(true)">验证码登录</div>
              </div>

              <transition mode="out-in">
                <div v-if="active">
                  <div class="account">
                    <el-form-item prop="phone">
                      <el-input v-model.trim="loginForm.phone" type="text" auto-complete="off" placeholder="手机号">
                        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="verifyCode">
                      <el-row :gutter="10" style="height: 40px">
                        <el-col :span="18">
                          <el-input v-model.trim="loginForm.verifyCode" placeholder="验证码" @keyup.enter.native="handleLogin">
                            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                          </el-input>
                        </el-col>
                        <el-col :span="6" style="height: 40px">
                          <span v-if="sendDisabled" class="getSendCode">{{ time + '秒后获取' }}</span>
                          <span
                            v-else
                            v-loading="btnLoading"
                            class="getSendCode"
                            style="width: 100%"
                            @click="_sendCode"
                          >{{ btnText }}</span>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                </div>
                <div v-else>
                  <div class="account">
                    <el-form-item prop="username">
                      <el-input v-model.trim="loginForm.username" type="text" auto-complete="off" placeholder="手机号">
                        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input
                        v-model.trim="loginForm.password"
                        type="password"
                        auto-complete="off"
                        placeholder="密码"
                        @keyup.enter.native="handleLogin"
                      >
                        <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
              </transition>

            </div>
            <el-form-item style="width: 100%">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width: 100%"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <div class="title">请选择机构</div>
          <div class="login-box">
            <el-scrollbar ref="scrollContainer" :vertical="false" style="height:100%">
              <div>
                <div
                  v-for="item in orgList"
                  :key="item.organizationId"
                  class="login-item"
                  :class="{active:organizationId === item.organizationId && item.status !== 1,disabled:item.status === 1}"
                  @click="handleChangeOrg(item)"
                >
                  <el-radio
                    v-model="organizationId"
                    :disabled="item.status === 1"
                    :label="item.organizationId"
                  >{{ item.name }}</el-radio>
                </div>
              </div>
            </el-scrollbar>
            <el-button
              :loading="loading"
              :disabled="!organizationId"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleIntoSystem"
            >
              进入系统
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCode, loginSelectOrganization } from '@/api/login'
import { loadMenus } from '@/permission'
import { setItem } from '@/utils/localStorage'
export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入账号'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!/^[0-9]{11}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '', // 手机号
        verifyCode: '', // 验证码
        username: '', // 账号
        password: '' // 密码
      },
      organizationId: '',
      orgList: [],
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        verifyCode: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        username: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      verifyCode: '',
      active: false,
      btnText: '发送验证码',
      btnLoading: false,
      time: 60,
      sendDisabled: false,
      isLogin: true,
      orgToken: '' // 机构Token
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
        console.log(this.redirect, 'this.redirect')
      },
      immediate: true
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleChangeOrg(item) {
      item.status !== 1 && (this.organizationId = item.organizationId)
    },
    handleLogin() {
      console.log('1111')
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            const { data } = await this.$store
              .dispatch('user/getOrganizationList', { userInfo: this.loginForm, active: this.active })
            this.orgToken = data.token
            this.orgList = data.organizationVos
            if (data.organizationVos.length === 1) {
              this.organizationId = data.organizationVos[0].organizationId
              this.handleIntoSystem()
              return
            }
            this.isLogin = false
            this.loading = false
          } catch (e) {
            this.isLogin = true
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleIntoSystem() {
      this.loading = true
      try {
        const obj = this.orgList.find(i => i.organizationId === this.organizationId)
        const { data } = await loginSelectOrganization({ organizationId: this.organizationId, token: this.orgToken })
        if (!data?.token) {
          this.loading = false
          this.isLogin = true
          return
        }
        setItem('logoList', obj.mediaDtoList)
        setItem('orgInfo', obj)
        await this.$store
          .dispatch('user/login', data)
        this.$store.dispatch('user/getDeptId')
        // 主渲染线程空余的时候执行
        // requestAnimationFrame(() => {
        //   loadMenus()
        // })
        await loadMenus()
        if (['/401', '/404'].includes(this.redirect)) {
          this.$router.replace({ path: '/' })
        } else {
          // this.$router.replace({ path: this.redirect || '/' })
          // redirect地址存在不完整和地址访问不了情况，会出现地址报错，从而导致页面访问不了，和产品沟通后，登录后统一跳到首页处理
          this.$router.replace({ path: '/' })
        }
      } catch (e) {
        this.loading = false
        this.isLogin = true
        console.log(e)
      }
    },
    _sendCode() {
      this.$refs.loginForm.validateField('phone', (valid) => {
        if (!valid) {
          this.btnLoading = true
          sendCode(this.loginForm.phone)
            .then((res) => {
              const _this = this
              _this.sendDisabled = true
              const interval = setInterval(function () {
                if (_this.time-- <= 0) {
                  _this.time = 60
                  _this.sendDisabled = false
                  _this.btnLoading = false
                  _this.btnText = '重新发送'
                  clearInterval(interval)
                }
              }, 1000)
            })
            .catch(() => {
              this.sendDisabled = false
              this.btnLoading = false
              this.btnText = '重新发送'
            })
        }
      })
      return
    },
    changeTabs(res) {
      this.$refs.loginForm.resetFields()
      this.active = res
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap ::v-deep{
  width: 100%;
  height: 100%;
  min-width: 1440px;
  display: flex;
  background: #fff;
  .page_left {
    width: 526px;
    min-width: 526px;
    background: linear-gradient(317deg, #0c6fff 0%, #4d86e4 100%);
    .page_bg {
      box-sizing: border-box;
      padding-top: 227px;
      width: 100%;
      height: 100%;
      background-image: url('../../assets/image/chatu.png');
      background-repeat: no-repeat;
      background-size: 472px 205px;
      background-position: center 433px;
      .page_wrap_title {
        text-align: center;
        font-size: 36px;
        color: #ffffff;
        line-height: 44px;
      }
    }
  }
  .page_right {
    width: 100%;
    min-width: 914px;
    position: relative;
  }
}
.m-t-36 {
  margin-top: 36px;
}
.login ::v-deep{
  border-radius: 5px;
  margin: 32px 20px 20px 20px;
  z-index: 3;
  margin-left: -165px;
  position: absolute;
  left: 50%;
  top: 304px;
  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 356px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }

    .getSendCode {
      cursor: pointer;
      color: #1890ff;
    }

    .form_tabs {
      height: 40px;
      display: flex;
      color: #666;
      margin-bottom: 20px;
      .form_tab_pane {
        margin-right: 40px;
        border-bottom: 3px solid #fff;
        cursor: pointer;
      }
      .active {
        color: #333333;
        font-weight: 700;
        border-color: #1472ff;
      }
    }
  }
  .title{
    font-size: 32px;
    font-weight: bold;
    color: rgba(51,51,51,0.9);
    margin-bottom: 40px;
  }
  .login-box{
    height: 193px;
    .login-item{
      height: 40px;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      display: flex;
      align-items: center;
      padding-left:15px;
      width: 356px;
      margin-bottom: 30px;
      cursor: pointer;
      .el-radio{
        display: flex;
        align-items: center;
        .el-radio__input{
          display: flex;
          align-items: center;
          .el-radio__inner{
            width: 12px;
            height: 12px;
          }
        }

        .el-radio__label{
          font-size: 16px;
        }
      }

      &.active{
        background: #E7F0FF;
        border:0px
      }
      &.disabled{
        background: #EFEFEF;
        cursor: not-allowed;
        color: #999999;
      }
    }
  }
}
</style>
