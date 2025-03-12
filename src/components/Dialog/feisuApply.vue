<template>
  <AppDialog
    v-model="visible"
    title=""
    width="408px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="feisuApply">
      <div class="feisuApplyTitle">扫码绑定</div>
      <div class="feisuApplyTips">
        请使用 <span style="color: #2c3242">【飞书】</span> 移动端扫描二维码
      </div>
      <div v-loading="loading" class="new-scan-qrcode-container">
        <div
          v-if="showFeiShuQr"
          id="feisuApply_feisu_login_container"
          style="width: 182px; height: 182px"
        />
      </div>

      <div ref="iframe" style="display: none" />
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import {
  getOrganizationIdByAppId,
  callbackByTenantId,
  saveBindUser
} from '@/api/user/member.js'
import AppDialog from '@/components/AppDialog'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: true,
      visible: false,
      top: '114px',
      tenantId: '',
      userId: '',
      feisuConfig: {
        client_id: '',
        redirect_uri: 'https://lhhokcp.hokkj.cn',
        response_type: 'code',
        state: ''
      },
      showFeiShuQr: true,
      iframe: null,
      QRLoginObj: null
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          if (typeof window.addEventListener !== 'undefined') {
            window.addEventListener('message', this.handleMessage, false)
          } else if (typeof window.attachEvent !== 'undefined') {
            window.attachEvent('onmessage', this.handleMessage)
          }
          this.getOrganizationAppId()
        } else {
          if (typeof window.addEventListener !== 'undefined') {
            window.removeEventListener('message', this.handleMessage, false)
          } else if (typeof window.attachEvent !== 'undefined') {
            window.detachEvent('onmessage', this.handleMessage)
          }
          // this.showFeiShuQr = false
        }
      },
      immediate: true
    },
    showFeiShuQr: {
      handler(val) {
        val && this.initFeishu()
      }
      // immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 450) / 2 + 'px'
  },
  methods: {
    refresh() {
      this.loading = true
      this.showFeiShuQr = false
      setTimeout(() => {
        this.showFeiShuQr = true
        this.loading = false
      }, 200)
    },
    sure() {},
    // 获取登录携带的name获取机构信息
    getOrganizationAppId() {
      this.loading = true
      const orgInfo = getItem('orgInfo')
      const params = {
        tenantId: orgInfo.organizationId
      }
      getOrganizationIdByAppId(params)
        .then(res => {
          this.feisuConfig.client_id = res.data.appId
          this.initFeishu()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    initFeishu() {
      console.log('我触发啦-------------')
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        const obj = {
          id: 'feisuApply_feisu_login_container',
          goto: `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${this.feisuConfig.client_id}&redirect_uri=${this.feisuConfig.redirect_uri}&response_type=code&state=${this.feisuConfig.state}`,
          width: '250px',
          height: '270px',
          style: 'transform: translate(-36px,-43px) scale(0.728);' // 可选的，二维码html标签的style属性
        }
        // eslint-disable-next-line no-undef
        this.QRLoginObj = QRLogin(obj)
      })
    },
    feishuLogin(code) {
      if (this.loading) {
        return
      }
      let arr = []
      this.loading = true
      // 根据code获取飞书详情
      const orgInfo = getItem('orgInfo')
      const data = {
        code: code,
        userId: this.userId,
        tenantId: orgInfo.organizationId
      }
      callbackByTenantId(data)
        .then(res => {
          if (res?.data?.sysUserDto) {
            arr = res.data.sysUserDto
            return saveBindUser(res.data.sysUserDto)
          } else {
            this.loading = false
          }
        })
        .then(res => {
          setTimeout(() => {
            this.loading = false
          }, 200)
          this.success && this.success(arr)
        })
        .catch(() => {
          this.refresh()
        })
      // this.
    },
    handleMessage(event) {
      const _this = this
      const obj = {
        id: 'feisuApply_feisu_login_container',
        goto: `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${this.feisuConfig.client_id}&redirect_uri=${this.feisuConfig.redirect_uri}&response_type=code&state=${this.feisuConfig.state}`,
        width: '250px',
        height: '270px',
        style: 'transform: translate(-36px,-43px) scale(0.728);' // 可选的，二维码html标签的style属性
      }
      // 使用 matchOrigin 和 matchData 方法来判断 message 和来自的页面 url 是否合法
      if (
        this?.QRLoginObj?.matchOrigin(event.origin) &&
        this?.QRLoginObj?.matchData(event.data)
      ) {
        var loginTmpCode = event.data.tmp_code
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
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
        // alert('获取到的code为' + res.code)
        _this.feishuLogin(res.code)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.feisuApply {
  height: 398px;
  padding-top: 22px;
  .feisuApplyTitle {
    text-align: center;
    font-size: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 28px;
  }
  .feisuApplyTips {
    margin-top: 28px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    text-align: center;
  }
  .new-scan-qrcode-container {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    border: 1px solid #cbcfd3;
    margin: 36px auto 0;
    padding: 9px;
    overflow: hidden;
  }
}
</style>
