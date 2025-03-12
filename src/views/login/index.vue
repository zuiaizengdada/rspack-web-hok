<template>
  <div class="page_wrap">
    <div class="logo2" />
    <div class="loginDialog">
      <div class="loginLogo">
        <!-- <template v-if="pageConfig.ifUrlOrgid && pageConfig.orgInfo.mediaDtoList && pageConfig.orgInfo.mediaDtoList.length > 1 && pageConfig.orgInfo.mediaDtoList[1].url">
          <img :src="pageConfig.orgInfo.mediaDtoList[1].url" alt="">
        </template>
        <template v-else>
        </template> -->
        <img src="@/assets/image/login/logo3.png" alt="" />
      </div>

      <!-- 验证码登录/扫码登录 -->
      <div v-if="isLogin" class="loginForm">
        <div class="errTops">
          {{ errTips }}
        </div>
        <!-- 右上角切换 -->
        <div
          v-if="pageConfig.orgFeisu || pageConfig.orgWecom"
          class="login-qr-switch-box"
        >
          <div class="switch-login-mode-wrapper">
            <div class="web-v3-custom-tooltip">
              <div class="switch-login-mode-container">
                <div class="switch-login-mode-box">
                  <img
                    v-if="active === 3 || active === 4"
                    src="@/assets/image/login/logoPc.png"
                    alt=""
                    class="universe-icon"
                    @mouseenter="mouseenter"
                    @mouseleave="mouseleave"
                    @click="active = 2"
                  />
                  <img
                    v-if="active === 2"
                    src="@/assets/image/login/qrCode.png"
                    alt=""
                    class="universe-icon"
                    @mouseenter="mouseenter"
                    @mouseleave="mouseleave"
                    @click="active = oldActive"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="login-qr-switch-tips">
            <img
              v-if="active === 3 || active === 4"
              src="@/assets/image/login/loginTips1.png"
              alt=""
            />
            <img
              v-if="active === 2"
              src="@/assets/image/login/logoTips2.png"
              alt=""
            />
          </div>
        </div>

        <!-- 账号密码登录 -->
        <template v-if="active === 2">
          <div class="loginFormTitle">验证码登录</div>

          <el-form
            ref="loginForm"
            key="login"
            v-loading="pageConfig.urlParams.loading"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            label-position="top"
          >
            <el-form-item
              v-if="codeLoginType === 1"
              prop="phone"
              label="请输入你的手机号码"
            >
              <el-input
                v-model.trim="loginForm.phone"
                type="text"
                auto-complete="off"
                placeholder="手机号"
                style="color: #333"
              >
                <img
                  slot="prefix"
                  :src="phoneIcon"
                  alt=""
                  style="margin-top: 10px"
                />
              </el-input>
            </el-form-item>
            <el-form-item v-else prop="email" label="请输入你的邮箱号">
              <el-input
                v-model.trim="loginForm.email"
                type="text"
                auto-complete="off"
                placeholder="邮箱号"
                style="color: #333"
              >
                <img
                  slot="prefix"
                  :src="emailIcon"
                  alt=""
                  style="width:20px;height:20px;margin-top: 10px"
                />
              </el-input>
            </el-form-item>
            <el-form-item prop="verifyCode" label="请输入验证码">
              <el-input
                v-model.trim="loginForm.verifyCode"
                :maxlength="6"
                placeholder="验证码"
                class="verifyCode"
                style="color: #333"
                @keyup.enter.native="handleLogin"
              >
                <img
                  slot="prefix"
                  :src="codeIcon"
                  alt=""
                  style="margin-top: 10px"
                />
                <span slot="suffix">
                  <span v-if="sendDisabled" class="getSendCodetime">
                    重新发送（{{ time }}s）
                  </span>
                  <span
                    v-else
                    :class="sendDisabled ? 'getSendCodetime' : 'getSendCode'"
                    style="width: 100%"
                    @click="_sendCode"
                  >
                    {{ btnText }}
                  </span>
                </span>
              </el-input>
            </el-form-item>

            <el-form-item style="margin-bottom: 0px">
              <el-button
                type="primary"
                class="logoBtn"
                :loading="loading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
            <el-form-item>
              <div class="new-scan-qrcode-txt m-t-8">
                <span @click="checkMailLogin">
                  <img
                    slot="prefix"
                    :src="codeLoginType === 1 ? emailIcon : phoneIcon"
                    alt=""
                    style="width:20px;height:20px;margin-right:5px"
                  />
                  {{
                    codeLoginType === 1 ? '切换为邮箱登录' : '切换为手机号登录'
                  }}
                </span>
              </div>
            </el-form-item>
          </el-form>
        </template>

        <!-- 飞书3/扫码登录  -->
        <template v-if="pageConfig.orgFeisu && active === 3">
          <div class="loginFormTitle">扫码登录</div>
          <div class="loginFormTips">
            请使用
            <span style="color: #2c3242">【飞书】</span>
            移动端扫描二维码
          </div>

          <div
            v-loading="loading || feiloading"
            class="new-scan-qrcode-container"
          >
            <div
              id="feisu_login_container"
              key="1"
              style="width: 182px; height: 182px"
            />
          </div>
          <div v-if="pageConfig.orgWecom" class="new-scan-qrcode-txt">
            <span @click="selectActive(active === 3 ? 4 : 3)">
              <svg-icon icon-class="wecom" class-name="new-scan-qrcode-icon" />
              切换企微登录
            </span>
          </div>
        </template>
        <!-- 企微4/扫码登录   -->
        <template v-if="pageConfig.orgWecom && active === 4">
          <div class="loginFormTitle">扫码登录</div>
          <div class="loginFormTips">
            请使用
            <span style="color: #2c3242">【企微】</span>
            移动端扫描二维码
          </div>
          <div
            v-loading="loading || feiloading"
            class="new-scan-qrcode-container"
          >
            <div
              id="wecom_login_container"
              key="2"
              style="width: 182px; height: 182px"
            />
          </div>
          <div v-if="pageConfig.orgFeisu" class="new-scan-qrcode-txt">
            <span @click="selectActive(active === 3 ? 4 : 3)">
              <svg-icon icon-class="feishu" class-name="new-scan-qrcode-icon" />
              切换飞书登录
            </span>
          </div>
        </template>
      </div>

      <!-- 登录完成之后，  -->
      <template v-else>
        <!-- 选择机构 -->
        <div
          v-if="orgList.length > 0 && pageConfig.accountBindingStatus === 0"
          class="selectOrg"
        >
          <div class="selectOrgTitle">选择机构</div>

          <div class="orgList">
            <div
              v-for="(item, index) in orgList"
              :key="index"
              class="orgItem"
              :class="{
                active:
                  organizationId === item.organizationId && item.status !== 1,
                disabled: item.status === 1
              }"
              @click="handleChangeOrg(item)"
            >
              <div class="orgLogo">
                <img v-if="item.organizationUrl" :src="item.organizationUrl" />
              </div>
              <div class="orgName">{{ item.name }}</div>

              <img
                v-if="
                  organizationId === item.organizationId && item.status !== 1
                "
                src="~@/assets/image/login/check.png"
                alt=""
                class="checkIcon"
              />
            </div>
          </div>

          <div style="margin-top: 24px">
            <el-button
              type="primary"
              class="logoBtn"
              :loading="loading"
              :disabled="!organizationId"
              style="width: 328px"
              @click.native.prevent="handleIntoSystem"
            >
              进入系统
            </el-button>
          </div>
        </div>

        <!-- 选择账号 -->
        <div v-else-if="accountList.length > 0" class="selectAccount">
          <div class="selectAccountTitle">请选择登录账号</div>

          <div v-loading="loading" class="accountList">
            <div
              v-for="(item, index) in accountList"
              :key="index"
              class="orgItem"
              :class="{ active: selectUserId === item.userId }"
              @click="handleChangeUser(item, index)"
            >
              <AppAvatar
                :avatar="item.userImg"
                :name="item.nikeName"
                :width="48"
                class="m-r-10"
                :no-name="true"
              />
              <div class="accountName">
                <div style="margin-bottom: 4px">{{ item.nikeName }}</div>
                <div style="color: #999999">{{ item.phone }}</div>
              </div>
              <div class="rightIcon"><i class="el-icon-arrow-right" /></div>
            </div>
          </div>
        </div>

        <!-- 账号未绑定 -->
        <div
          v-if="[2, 4, 5, 7].includes(pageConfig.accountBindingStatus)"
          class="accountNotBound accountBinding"
        >
          <div class="accountBindingTitle">绑定账号</div>

          <div class="accountNotBoundImg">
            <img src="~@/assets/image/login/accountNotBound.png" />
            <!-- <div class="noDataText">暂无可绑定的账号</div> -->
          </div>
          <div class="noDataText">
            {{
              {
                2:
                  active === 3
                    ? `当前飞书手机号【${pageConfig.userInfo[0].phoneNumber.replace(
                      /^(\d{3})\d{4}(\d{4})$/,
                      '$1****$2'
                    )}】，未找到匹配的伏羲云账号。`
                    : `当前企微账号未找到匹配的伏羲云账号。`,
                4:
                  active === 3
                    ? `你的伏羲云账号【${pageConfig.userInfo[0].phoneNumber.replace(
                      /^(\d{3})\d{4}(\d{4})$/,
                      '$1****$2'
                    )}】状态已设置为离职，无法绑定。`
                    : `你的伏羲云账号状态已设置为离职，无法绑定`,
                5:
                  active === 3
                    ? `你的伏羲云账号【${pageConfig.userInfo[0].phoneNumber.replace(
                      /^(\d{3})\d{4}(\d{4})$/,
                      '$1****$2'
                    )}】已删除，无法绑定。`
                    : `你的伏羲云账号已删除，无法绑定。`,
                7:
                  active === 3
                    ? `你的伏羲云账号【${pageConfig.userInfo[0].phoneNumber.replace(
                      /^(\d{3})\d{4}(\d{4})$/,
                      '$1****$2'
                    )}】已被其他飞书绑定。`
                    : `你的伏羲云账号已被其他企微绑定。`
              }[pageConfig.accountBindingStatus]
            }}
          </div>
          <div class="accountNotBoundTips">
            {{
              {
                2: '解决办法：请联系人力资源，前往伏羲云创建账号',
                4: '解决办法：请联系人力资源，恢复账号在职状态。',
                5: '解决绑法：请联系人力资源，重新创建账号。',
                7: '解决办法：请联系人力资源，先解绑账号'
              }[pageConfig.accountBindingStatus]
            }}
          </div>
          <div class="accountBindingBtn">
            <el-button
              style="
                border: 1px solid #0c6fff;
                width: 100%;
                height: 40px;
                margin-left: 0;
              "
              class="m-t-20"
              @click="loginCancel"
            >
              取消
            </el-button>
          </div>
        </div>

        <!-- 飞书扫码绑定-选择机构 -->
        <div
          v-if="orgList.length > 0 && pageConfig.accountBindingStatus === 6"
          class="selectOrg"
        >
          <div class="selectOrgTitle">选择机构</div>

          <div class="orgList">
            <div
              v-for="(item, index) in orgList"
              :key="index"
              class="orgItem"
              :class="{
                active:
                  pageConfig.orgInfo.organizationId === item.organizationId &&
                  item.status !== 1,
                disabled: item.status === 1
              }"
              @click="onhandleChangeOrg(item)"
            >
              <div class="orgLogo">
                <img v-if="item.organizationUrl" :src="item.organizationUrl" />
              </div>
              <div class="orgName">{{ item.name }}</div>

              <img
                v-if="
                  item.organizationId === pageConfig.orgInfo.organizationId &&
                    item.status !== 1
                "
                src="~@/assets/image/login/check.png"
                alt=""
                class="checkIcon"
              />
            </div>
          </div>

          <div style="margin-top: 24px">
            <el-button
              type="primary"
              class="logoBtn"
              :loading="loading"
              :disabled="!pageConfig.orgInfo.organizationId"
              style="width: 328px"
              @click="gotoByFeishuSystem"
            >
              进入系统
            </el-button>
          </div>
        </div>
      </template>
    </div>

    <div ref="iframe" style="display: none" />
  </div>
</template>

<script>
import {
  sendCode2,
  loginSelectOrganization,
  getOrganizationAppId,
  getWecomAppIdApi,
  feishuLoginApi,
  wecomLoginApi,
  saveBindUser,
  sendEmailCode
} from '@/api/login'
import { loadMenus } from '@/permission'
import { setItem } from '@/utils/localStorage'
import AppAvatar from '@/components/AppAvatar/AppAvatar'
const codeIcon = require('@/assets/image/login/phone.svg')
const phoneIcon = require('@/assets/image/login/code.svg')
const emailIcon = require('@/assets/image/login/email.svg')
let interval = null
export default {
  components: {
    AppAvatar
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!/^[0-9]{11}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateMmail = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      switchTips: false,
      active: 2, // 1:密码登录 2: 验证码登录 3: 飞书登录 4: 企微登录
      oldActive: null,
      activeTxt: { 3: '飞书', 4: '企微' },
      codeLoginType: 1, // 1手机号登录  2邮箱登录
      errTips: '', // 错误的提示信息
      phoneIcon,
      codeIcon,
      emailIcon,
      loginForm: {
        phone: '', // 手机号
        email: '', // 邮箱
        verifyCode: '' // 验证码
      },
      organizationId: '', // 选择的机构id
      orgList: [],
      loginRules: {
        phone: [{ required: false, trigger: 'blur', validator: validatePhone }],
        email: [{ required: false, trigger: 'blur', validator: validateMmail }],
        verifyCode: [
          {
            required: false,
            trigger: 'blur',
            message: '请输入验证码',
            validator: validateVerifyCode
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      btnText: '发送验证码',
      btnLoading: false,
      time: 60,
      sendDisabled: false,
      isLogin: true,
      // https://open.feishu.cn/document/common-capabilities/sso/web-application-sso/qr-sdk-documentation
      feisuConfig: {
        client_id: 'cli_a26b45de2838100d', // 应用id
        redirect_uri: 'https://lhhokcp.hokkj.cn', // 重定向url
        response_type: 'code',
        state: ''
      },
      // https://developer.work.weixin.qq.com/document/path/96441
      wecomConfig: {
        appid: '', // 企业的CorpID
        agentid: '', // 应用agentid，建议填上该参数
        redirect_uri: '', // 授权后重定向的回调链接地址
        response_type: 'code', // 返回类型，此时固定为：code
        scope: 'snsapi_privateinfo', // 应用授权作用域。 snsapi_base：静默授权 / snsapi_privateinfo：手动授权
        state: 'loginState' // 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值
      },
      pageConfig: {
        ifUrlOrgid: false, // 进入的url是否携带了orgid
        urlParams: {
          name: '',
          tenantId: '',
          loading: false
        }, // url携带的信息
        orgInfo: {
          mediaDtoList: [],
          name: '',
          status: 0,
          organizationRequestName: '', // 机构对应的url
          sysUserDtoList: [], // 当前机构的用户数据列表
          organizationId: ''
        }, // 携带的orgid的机构信息
        accountBindingStatus: 0, // 账号绑定状态: 0: 不显示 1:没有绑定账号，但是系统有相同手机号需要用户绑定 2: 没有绑定账号，且系统没有 3：有账号且已绑定 4: 离职 5: 已被删除 6：需要选择机构 7 被别人绑定了
        userInfo: [], // 当有绑定账号的时候，展示的用户信息
        orgFeisu: false, // 携带了orgid的机构是否开启了企微扫码登录
        orgWecom: false // 携带了orgid的机构是否开启了企微扫码登录
      },
      accountList: [
        // { userName: '刘辉', avatar: '', userId: '1', phone: '13040805625' },
        // { userName: 'liuhui', avatar: '', userId: '2', phone: '15927745625' },
        // { userName: 'liuhui', avatar: '', userId: '3', phone: '1592770910' }
      ],
      bindUserLoading: false, // 用户绑定的loading
      selectUserId: '',
      feiloading: false,
      QRLoginObj: null,
      iframe: null,
      feishuOrgName: window.origin, // window.origin, // 飞书用的orgName，取值为 window.origin'https://dev.webhok.hokkj.cn'
      orgToken: '' // 机构Token
    }
  },
  watch: {
    active: {
      async handler(val, oldval) {
        this.oldActive = oldval
        this.orgList = []
        this.organizationId = ''
        if (val === 3) {
          this.initFeishu()
        } else if (val === 4) {
          // 初始化会在created中初始化 所以如果没有appId 就跳过
          if (this.wecomConfig.appId) return
          this.initWecom()
        }
      },
      immediate: false
    }
  },
  beforeDestroy() {
    if (typeof window.addEventListener !== 'undefined') {
      window.removeEventListener('message', this.handleMessage, false)
    } else if (typeof window.attachEvent !== 'undefined') {
      window.detachEvent('onmessage', this.handleMessage)
    }
  },
  deactivated() {},
  async created() {
    //   // if (window.location.hostname === 'localhost') {
    //   //   this.feishuOrgName = `https://${process.env.NODE_ENV}.webhok.hokkj.cn`
    //   // }
    if (window.location.hostname === 'localhost') {
      this.feishuOrgName = `https://${
        process.env.NODE_ENV === 'development' ? 'dev' : process.env.NODE_ENV
      }.webhok.hokkj.cn`
    }
    this.errTips = ''
    this.isLogin = true
    this.pageConfig.accountBindingStatus = 0
    // if (this.$route.query && this.$route.query.name) {
    this.pageConfig.ifUrlOrgid = true
    // 获取机构是否开启飞书/企微 登录
    await this.getWecomAppId()
    await this.getOrganizationAppId()

    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', this.handleMessage, false)
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', this.handleMessage)
    }
    // 企微扫码登录回调方法
    window.Hok_WecomLogin = this.wecomLogin
  },
  mounted() {},
  methods: {
    getUrlParams(url) {
      var params = url.match(/\?(.*)/)[1] // 匹配问号后的部分
      var regex = /([^&=]+)=([^&]*)/g
      var match
      var paramObj = {}
      while ((match = regex.exec(params))) {
        paramObj[decodeURIComponent(match[1])] = decodeURIComponent(match[2]) // 存储键值对
      }
      return paramObj
    },
    checkMailLogin() {
      // 在切换的时候清除表单loginForm的错误信息
      this.$refs.loginForm.clearValidate()
      this.loginForm = {
        phone: '',
        email: '',
        verifyCode: ''
      }

      this.time = this.codeLoginType === 1 ? 300 : 60
      this.sendDisabled = false
      this.btnLoading = false
      this.btnText = '发送验证码'
      clearInterval(interval)
      this.codeLoginType = this.codeLoginType === 1 ? 2 : 1
    },
    selectActive(type) {
      this.active = type
    },
    loginCancel() {
      this.orgList = []
      this.accountList = []
      this.selectUserId = ''
      this.selectUserId
      this.pageConfig.orgInfo.organizationId = ''
      this.pageConfig.accountBindingStatus = 0
      const onActive = this.active
      this.active = ''
      setTimeout(() => {
        this.active = onActive
      }, 200)
      this.feiloading = false
      this.isLogin = true
    },
    initFeishu() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        const obj = {
          id: 'feisu_login_container',
          goto: `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${this.feisuConfig.client_id}&redirect_uri=${this.feisuConfig.redirect_uri}&response_type=code&state=${this.feisuConfig.state}`,
          width: '250px',
          height: '270px',
          style: 'transform: translate(-36px,-43px) scale(0.728);' // 可选的，二维码html标签的style属性
        }
        // eslint-disable-next-line no-undef
        this.QRLoginObj = QRLogin(obj)
        this.$forceUpdate()
      })
    },
    handleMessage(event) {
      const _this = this
      const obj = {
        id: 'feisu_login_container',
        goto: `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${this.feisuConfig.client_id}&redirect_uri=${this.feisuConfig.redirect_uri}&response_type=code&state=${this.feisuConfig.state}`,
        width: '250px',
        height: '270px',
        style: 'transform: translate(-36px,-43px) scale(0.728);' // 可选的，二维码html标签的style属性
      }
      // 使用 matchOrigin 和 matchData 方法来判断 message 和来自的页面 url 是否合法
      if (
        _this.QRLoginObj?.matchOrigin(event.origin) &&
        _this.QRLoginObj?.matchData(event.data)
      ) {
        var loginTmpCode = event.data.tmp_code
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
        console.log(loginTmpCode, 'loginTmpCode')
        // window.location.href = `${obj.goto}&tmp_code=${loginTmpCode}`
        const src = `${obj.goto}&tmp_code=${loginTmpCode}`
        if (_this.iframe && _this.$refs.iframe) {
          _this.$refs.iframe.removeChild(_this.iframe)
        }
        _this.iframe = document.createElement('iframe')
        _this.iframe.style = 'display: none'
        document.body.appendChild(_this.iframe)
        _this.iframe.src = src
        _this.$refs.iframe && _this.$refs.iframe.appendChild(_this.iframe)
      }
      if (event.origin === 'https://lhhokcp.hokkj.cn') {
        const res = JSON.parse(event.data.data)
        _this.pageLogin(res.code, 'feishu')
      }
    },
    // 登录
    async pageLogin(code, type = 'feishu') {
      if (this.loading) return
      this.loading = true
      const data = { code }
      try {
        let res = {}
        if (type === 'feishu') {
          data.name = this.feishuOrgName
          res = await feishuLoginApi(data)
        } else {
          data.state = this.feishuOrgName
          res = await wecomLoginApi(data)
        }
        await this.$store.dispatch('user/login', res.data.platformUserDto)
        this.orgToken = res.data?.platformUserDto?.token
        // res.data.bindStatus  0 未绑定 1 已绑定 2 未匹配 3 离职 4 删除"
        if (
          res.data.bindStatus === 1 &&
          res.data.platformUserDto &&
          res.data.platformUserDto.organizationVos.length > 1
        ) {
          console.log('状态1')
          this.isLogin = false
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.orgList = res.data.platformUserDto.organizationVos.map(i => {
            let obj = null
            if (i.mediaDtoList) {
              obj = i.mediaDtoList.find(
                item => item.scope === '1' && item.terminal === 1
              )
            }
            return {
              ...i,
              organizationUrl: obj ? obj.url : ''
            }
          })
          this.pageConfig.accountBindingStatus = 6
          this.loading = false
        } else if (
          res.data.bindStatus === 1 &&
          res.data.platformUserDto &&
          res.data.platformUserDto.organizationVos.length === 1
        ) {
          console.log('状态2')
          // this.pageConfig.orgInfo = res.data.platformUserDto.organizationVos[0]
          // this.isLogin = false
          this.pageConfig.orgInfo.organizationRequestName =
            res.data.platformUserDto.organizationVos[0].organizationRequestName
          this.pageConfig.orgInfo.organizationId =
            res.data.platformUserDto.organizationVos[0].organizationId
          this.pageConfig.orgInfo.sysUserDtoList =
            res.data.platformUserDto.organizationVos[0].sysUserDtoList
          this.pageConfig.orgInfo.mediaDtoList =
            res.data.platformUserDto.organizationVos[0].mediaDtoList

          this.pageConfig.orgInfo.name =
            res.data.platformUserDto.organizationVos[0].name
          // this.gotoByFeishuSystem()
          if (this.pageConfig.orgInfo.sysUserDtoList.length === 1) {
            this.handleChangeUser(this.pageConfig.orgInfo.sysUserDtoList[0], 0)
          } else {
            this.loading = false
            this.isLogin = false
            this.orgList = []
            this.accountList = this.pageConfig.orgInfo.sysUserDtoList
          }
        } else if (res.data.bindStatus === 3) {
          console.log('状态3')
          this.pageConfig.accountBindingStatus = 4
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.isLogin = false
          this.loading = false
          this.feiloading = false
        } else if (res.data.bindStatus === 4) {
          console.log('状态4')
          this.pageConfig.accountBindingStatus = 5
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.isLogin = false
          this.loading = false
          this.feiloading = false
        } else if (res.data.bindStatus === 2) {
          console.log('状态5')
          this.pageConfig.accountBindingStatus = 2
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.isLogin = false
          this.loading = false
          this.feiloading = false
        } else if (res.data.bindStatus === 5) {
          this.pageConfig.accountBindingStatus = 7
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.isLogin = false
          this.loading = false
          this.feiloading = false
        } else if (res.data.bindStatus === 0) {
          this.pageConfig.accountBindingStatus = 2
          this.pageConfig.userInfo = [res.data.platformUserDto]
          this.isLogin = false
          this.loading = false
          this.feiloading = false
        }
      } catch (error) {
        this.orgList = []
        this.loginCancel()
        this.loading = false
        this.isLogin = true
        this.feiloading = false
      }
    },

    // 根据登录地址获取企微appId
    async getWecomAppId() {
      this.pageConfig.urlParams.loading = true
      const params = {
        name: this.feishuOrgName
      }
      try {
        const res = await getWecomAppIdApi(params)
        this.pageConfig.orgWecom = !!res.data.appId
        this.wecomConfig.appid = res.data.appId
        this.wecomConfig.agentid = res.data.agentId
        this.wecomConfig.redirect_uri = res.data.redirectUrl
        this.active = this.pageConfig.orgWecom
          ? 4
          : this.pageConfig.orgFeisu
            ? 3
            : 2
      } catch (error) {
        console.log(error)
      }
      this.pageConfig.urlParams.loading = false
    },
    // 初始化企微扫码登陆
    initWecom() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        new WwLogin({
          ...this.wecomConfig,
          id: 'wecom_login_container'
        })
        this.$forceUpdate()
      })
    },
    // 企微扫码后回调
    async wecomLogin(url) {
      const params = this.getUrlParams(url)
      this.pageLogin(params.code, 'wecom')
    },
    // 账户绑定
    async saveBindUser() {
      if (this.bindUserLoading) {
        return
      }
      try {
        this.bindUserLoading = true
        await saveBindUser(this.pageConfig.userInfo)
        const { data } = await loginSelectOrganization({
          // userId: this.pageConfig.userInfo[0].userId,
          organizationId: this.pageConfig.orgInfo.organizationId,
          isCheckLogin: false,
          loginType: this.active,
          token: this.orgToken,
          loginSource: 1
        })
        if (!data?.token) {
          this.bindUserLoading = false
          this.loading = false
          this.isLogin = true
          return
        }
        setItem('logoList', this.pageConfig.orgInfo.mediaDtoList)
        setItem('orgInfo', this.pageConfig.orgInfo)
        await this.$store.dispatch('user/login', data)
        this.$store.dispatch('user/getDeptId')
        await loadMenus()
        if (['/401', '/404'].includes(this.redirect)) {
          this.$router.replace({ path: '/' })
        } else if (
          this.$route.query &&
          this.$route.query.redirect &&
          ['aiShare'].includes(this.$route.query.redirect)
        ) {
          this.$router.replace({
            path: '/ai/share',
            query: { ...this.$route.query, from: 'login' }
          })
        } else {
          // this.$router.replace({ path: this.redirect || '/' })
          // redirect地址存在不完整和地址访问不了情况，会出现地址报错，从而导致页面访问不了，和产品沟通后，登录后统一跳到首页处理
          this.$router.replace({ path: '/' })
        }
      } catch (e) {
        this.feiloading = false
        this.loading = false
        this.bindUserLoading = false
        // this.isLogin = true
        this.loginCancel()
      }
    },
    mouseenter() {
      this.switchTips = true
    },
    mouseleave() {
      this.switchTips = false
    },
    // 获取账号信息，然后进入系统
    async gotoSystem() {
      try {
        this.loading = true
        const { data } = await loginSelectOrganization({
          userId: this.pageConfig.userInfo[0].userId,
          organizationId: this.pageConfig.orgInfo.organizationId,
          isCheckLogin: false,
          loginSource: 1,
          loginType: this.active,
          token: this.orgToken
        })
        if (!data?.token) {
          this.loading = false
          this.isLogin = true
          this.loginCancel()
          return
        }
        setItem('logoList', this.pageConfig.orgInfo.mediaDtoList)
        setItem('orgInfo', this.pageConfig.orgInfo)
        if (
          this.feishuOrgName !== this.pageConfig.orgInfo.organizationRequestName
        ) {
          const url = `${this.pageConfig.orgInfo.organizationRequestName}/#/desktopToWeb?organizationId=${this.pageConfig.orgInfo.organizationId}&userId=${this.pageConfig.userInfo[0].userId}&path=addLiveRoom&token=${data.token}`
          console.log(url, 'url')
          window.location = `${this.pageConfig.orgInfo.organizationRequestName}/#/desktopToWeb?organizationId=${this.pageConfig.orgInfo.organizationId}&userId=${this.pageConfig.userInfo[0].userId}&path=addLiveRoom&token=${data.token}`
          return
        }
        await this.$store.dispatch('user/login', data)
        this.$store.dispatch('user/getDeptId')
        await loadMenus()
        if (['/401', '/404'].includes(this.redirect)) {
          this.$router.replace({ path: '/' })
        } else if (
          this.$route.query &&
          this.$route.query.redirect &&
          ['aiShare'].includes(this.$route.query.redirect)
        ) {
          this.$router.replace({
            path: '/ai/share',
            query: { ...this.$route.query, from: 'login' }
          })
        } else {
          // this.$router.replace({ path: this.redirect || '/' })
          // redirect地址存在不完整和地址访问不了情况，会出现地址报错，从而导致页面访问不了，和产品沟通后，登录后统一跳到首页处理
          this.$router.replace({ path: '/' })
        }
        // this.$router.replace({ path: '/' })
      } catch (e) {
        this.loading = false
        this.isLogin = true
        this.loginCancel()
      }
    },
    // 获取登录携带的name获取飞书机构信息
    getOrganizationAppId() {
      this.pageConfig.urlParams.loading = true
      const params = {
        name: this.feishuOrgName
      }
      getOrganizationAppId(params)
        .then(res => {
          this.pageConfig.orgFeisu = !!res.data.appId
          this.feisuConfig.client_id = res.data.appId
          this.active = this.pageConfig.orgFeisu
            ? 3
            : this.pageConfig.orgWecom
              ? 4
              : 2
        })
        .catch(() => {
          // this.errTips = err
        })
      this.pageConfig.urlParams.loading = false
    },

    handleLogin() {
      this.errTips = ''
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const { data } = await this.$store.dispatch(
              'user/getOrganizationList',
              { userInfo: this.loginForm, active: this.active === 2 }
            )
            this.orgToken = data.token
            this.orgList = data.organizationVos.map(i => {
              let obj = null
              if (i.mediaDtoList) {
                obj = i.mediaDtoList.find(
                  item => item.scope === '1' && item.terminal === 1
                )
              }
              return {
                ...i,
                organizationUrl: obj ? obj.url : ''
              }
            })
            if (data.organizationVos.length === 1) {
              this.organizationId = data.organizationVos[0].organizationId
              this.handleIntoSystem()
              return
            }
            this.isLogin = false
            this.loading = false
          } catch (e) {
            this.errTips = e.message || e.msg || e || '网络错误'
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
      this.errTips = ''
      this.loading = true
      try {
        const obj = this.orgList.find(
          i => i.organizationId === this.organizationId
        )
        const { data } = await loginSelectOrganization({
          organizationId: this.organizationId,
          token: this.orgToken,
          isCheckLogin: false,
          loginSource: 1,
          loginType: this.active
        })
        if (!data?.token) {
          this.loading = false
          this.isLogin = true
          return
        }
        setItem('logoList', obj.mediaDtoList)
        setItem('orgInfo', obj)
        if (this.feishuOrgName !== obj.organizationRequestName) {
          const url = `${obj.organizationRequestName}/#/desktopToWeb?organizationId=${obj.organizationId}&userId=${data.userId}&path=addLiveRoom&token=${data.token}`
          console.log(url, 'url')
          window.location = `${obj.organizationRequestName}/#/desktopToWeb?organizationId=${obj.organizationId}&userId=${data.userId}&path=addLiveRoom&token=${data.token}`
          return
        }
        await this.$store.dispatch('user/login', data)
        this.$store.dispatch('user/getDeptId')
        // 主渲染线程空余的时候执行
        // requestAnimationFrame(() => {
        //   loadMenus()
        // })
        await loadMenus()
        if (['/401', '/404'].includes(this.redirect)) {
          this.$router.replace({ path: '/' })
        } else if (
          this.$route.query &&
          this.$route.query.redirect &&
          ['aiShare'].includes(this.$route.query.redirect)
        ) {
          this.$router.replace({
            path: '/ai/share',
            query: { ...this.$route.query, from: 'login' }
          })
        } else {
          // this.$router.replace({ path: this.redirect || '/' })
          // redirect地址存在不完整和地址访问不了情况，会出现地址报错，从而导致页面访问不了，和产品沟通后，登录后统一跳到首页处理
          this.$router.replace({ path: '/' })
        }
      } catch (e) {
        this.loading = false
        this.isLogin = true
        // this.feishuCancel()
      }
    },
    _sendCode() {
      this.errTips = ''
      if (this.sendDisabled) {
        return
      }
      const type = this.codeLoginType === 1 ? 'phone' : 'email'
      this.$refs.loginForm.validateField(type, valid => {
        if (!valid) {
          this.btnLoading = true
          const Pro = this.codeLoginType === 1 ? sendCode2 : sendEmailCode
          const code = this.codeLoginType === 1 ? this.loginForm.phone : this.loginForm.email
          Pro(code)
            .then(res => {
              const _this = this
              _this.sendDisabled = true
              interval = setInterval(function () {
                if (_this.time-- <= 0) {
                  _this.time = this.codeLoginType === 1 ? 300 : 60
                  _this.sendDisabled = false
                  _this.btnLoading = false
                  _this.btnText = '重新发送'
                  clearInterval(interval)
                }
              }, 1000)
            })
            .catch(err => {
              this.errTips = err.message || err.msg || err || '网络错误'
              this.sendDisabled = false
              this.btnLoading = false
              this.btnText = '重新发送'
            })
        }
      })
      return
    },
    handleChangeOrg(item) {
      item.status !== 1 && (this.organizationId = item.organizationId)
    },
    handleChangeUser(item, index) {
      this.selectUserId = item.userId
      this.pageConfig.userInfo = [{ ...item }]
      this.gotoSystem()
    },
    // 飞书扫码登录的选择机构的进入系统
    gotoByFeishuSystem() {
      this.loading = true
      if (this.pageConfig.orgInfo.sysUserDtoList.length === 1) {
        this.handleChangeUser(this.pageConfig.orgInfo.sysUserDtoList[0], 0)
      } else if (this.pageConfig.orgInfo.sysUserDtoList.length > 1) {
        this.loading = false
        this.isLogin = false
        this.orgList = []
        this.accountList = this.pageConfig.orgInfo.sysUserDtoList
      } else {
        return this.$message.error(
          '当前所选机构下无用户，请联系人力资源创建账号'
        )
      }
    },
    // 飞书登录选择机构
    onhandleChangeOrg(item) {
      if (!item.sysUserDtoList || item.sysUserDtoList.length === 0) {
        return this.$message.error(
          '当前所选机构下无用户，请联系人力资源创建账号'
        )
      }
      this.pageConfig.orgInfo.organizationRequestName =
        item.organizationRequestName
      this.pageConfig.orgInfo.organizationId = item.organizationId
      this.pageConfig.orgInfo.sysUserDtoList = item.sysUserDtoList
      this.pageConfig.orgInfo.mediaDtoList = item.mediaDtoList
      this.pageConfig.orgInfo.name = item.name
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
  width: 100%;
  height: 100%;
  min-width: 1580px;
  display: flex;
  background: #fff;
  position: relative;
  background: url(../../assets/image/login/logobg.png) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  .logo2 {
    position: absolute;
    left: 10.9375%;
    top: 31.85%;
    width: 759px;
    height: 400px;
    background: url(../../assets/image/login/logoBg2.png) no-repeat;
    background-size: cover;
  }
  .loginDialog {
    position: absolute;
    right: 308px;
    // top: 20.64%;
    top: 20.64%;
    z-index: 10px;
    .loginLogo {
      width: 408px;
      height: 52px;
      margin-bottom: 36px;
      > img {
        height: 100%;
        margin: auto;
      }
    }
    .login-form {
      margin-top: 43px;
      position: relative;
    }
    .loginForm {
      width: 408px;
      height: 455px;
      box-shadow: 0px 6px 19px 0px #d7e6fd;
      border-radius: 10px;
      background: #fff;
      padding-top: 64px;
      padding: 64px 40px;
      overflow: hidden;
      .loginFormTitle {
        font-size: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #2c3242;
        line-height: 28px;
        text-align: center;
      }
    }
    .selectOrg {
      width: 408px;
      height: 440px;
      box-shadow: 0px 6px 19px 0px #d7e6fd;
      border-radius: 10px;
      background: #fff;
      padding: 28px 17px 28px 40px;
      .selectOrgTitle {
        font-size: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: bolder;
        color: #333333;
        line-height: 28px;
        text-align: center;
        padding-right: 23px;
      }
      .orgList {
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 20px;
        height: 263px;
        &::-webkit-scrollbar {
          width: 4px;
          height: 6px;
          // display: none;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .orgItem {
          display: flex;
          width: 328px;
          height: 60px;
          border-radius: 4px;
          border: 1px solid #cbcfd3;
          padding: 18px 16px;
          align-items: center;
          margin-bottom: 18px;
          position: relative;
          cursor: pointer;
          .orgLogo {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            > img {
              height: 100%;
            }
          }
          .orgName {
            flex: 1 0 0;
            margin-left: 10px;
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #44474d;
            line-height: 28px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .checkIcon {
            width: 22px;
            height: 19px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        .active {
          background: #e7f0ff;
          border: 1px solid #0c6fff;
        }
        .disabled {
          background: #efefef;
          cursor: not-allowed;
          color: #999999;
        }
      }
    }
    .selectAccount {
      width: 408px;
      height: 440px;
      box-shadow: 0px 6px 19px 0px #d7e6fd;
      border-radius: 10px;
      background: #fff;
      padding: 64px 40px 28px 40px;
      .selectAccountTitle {
        font-size: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 28px;
        text-align: center;
      }
      .accountList {
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 20px;
        height: 268px;
        &::-webkit-scrollbar {
          width: 4px;
          height: 6px;
          // display: none;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .orgItem {
          display: flex;
          width: 328px;
          height: 80px;
          border-radius: 4px;
          border: 1px solid #cbcfd3;
          padding: 16px;
          align-items: center;
          margin-bottom: 12px;
          position: relative;
          cursor: pointer;
          .accountName {
            flex: 1 0 0;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #44474d;
            line-height: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .rightIcon {
            width: 22px;
            font-size: 22px;
            color: #cbcfd3;
            height: 60px;
            line-height: 60px;
          }
        }
        .active {
          background: #e7f0ff;
          border: 1px solid #0c6fff;
        }
        .disabled {
          background: #efefef;
          cursor: not-allowed;
          color: #999999;
        }
      }
    }
    .accountBinding {
      width: 408px;
      height: 440px;
      box-shadow: 0px 6px 19px 0px #d7e6fd;
      border-radius: 10px;
      background: #fff;
      padding: 64px 40px;
      .accountBindingTitle {
        font-size: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 28px;
        text-align: center;
      }
      .accountBindingForm {
        .formLabel {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 22px;
          color: #333333;
          margin-top: 22px;
          .formValue {
            color: #999999;
          }
        }
      }
      .accountBindingTips {
        margin-top: 36px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }

      .accountNotBoundImg {
        width: 177.92px;
        margin: 27px auto 10px;
        position: relative;
        > img {
          width: 100%;
        }
      }
      .noDataText {
        margin-bottom: 10px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
      }
      .accountNotBoundTips {
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #f54040;
        line-height: 22px;
      }
    }
    .getSendCode {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #0c6fff;
      line-height: 40px;
      cursor: pointer;
      margin-right: 16px;
    }
    .getSendCodetime {
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 40px;
    }
    .logoBtn {
      margin-top: 9px;
      width: 328px;
      height: 40px;
      background: #0c6fff;
      border-radius: 4px;
    }
    .errTops {
      position: absolute;
      bottom: 42px;
      left: 0;
      width: 100%;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #f53f3f;
      line-height: 20px;
      text-align: left;
      padding: 0 40px;
    }
    .login-qr-switch-box {
      position: absolute;
      top: 88px;
      right: 0px;
      border-radius: 10px;
      width: 400px;
      height: 80px;
      overflow: hidden;
      .switch-login-mode-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        z-index: 2;
        font-size: 14px;
        .web-v3-custom-tooltip {
          height: 100%;
          position: relative;
          .switch-login-mode-container {
            .switch-login-mode-box {
              width: 100px;
              height: 100px;
              transform: translate(-50px, -50px) rotate(45deg);
              cursor: pointer;
              background-color: #f3f8ff;
              transition: background-color 0.3s;
              overflow: hidden;
              .universe-icon {
                position: absolute;
                width: 40px;
                font-size: 40px;
                color: #fff;
                bottom: -11px;
                left: 50%;
                transform: translateX(-50%) rotate(-45deg);
              }
            }
          }
        }
      }
    }

    .login-qr-switch-tips {
      position: absolute;
      top: 18px;
      right: 64px;
      height: 28px;
      animation: shou 1.5s linear 120 forwards;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    @keyframes shou {
      25%,
      75% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(-10px);
      }
      0%,
      100% {
        transform: translateX(10px);
      }
    }
    .new-scan-qrcode-container {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      border: 1px solid #cbcfd3;
      margin: 25px auto 25px;
      padding: 9px;
      overflow: hidden;
    }
    .new-scan-qrcode-txt {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #0c6fff;
      font-size: 14px;
      font-weight: 500;
      padding-top: 20px;
      span {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .new-scan-qrcode-icon {
        font-size: 24px;
        margin-right: 10px;
      }
    }
  }
  .loginFormTips {
    margin-top: 28px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
::v-deep {
  .el-form-item__label {
    color: #333;
    font-weight: 400;
    line-height: 20px;
  }
  .el-form-item {
    margin-bottom: 28px;
  }
  .el-input__inner {
    color: #333 !important;
    height: 40px !important;
    line-height: 40px !important;
  }
}
#wecom_login_container {
  .title {
    display: none;
  }
}
</style>
