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
    <div class="wecomApply">
      <div class="wecomApplyTitle">扫码绑定</div>
      <div class="wecomApplyTips">
        请使用 <span style="color: #2c3242">【企微】</span> 移动端扫描二维码
      </div>
      <div v-loading="loading" class="new-scan-qrcode-container">
        <div
          v-if="showFeiShuQr"
          id="wecomApply_wecom_login_container"
          style="width: 182px; height: 182px"
        />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import {
  orgToWecomAppIdApi,
  wecomToTenantId,
  saveBindWechatUser
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
      wecomConfig: {
        appid: 'ww5bdb695e9e3551c6', // 企业的CorpID
        agentid: '1000030', // 应用agentid，建议填上该参数
        redirect_uri:
          'https://test.cloud.hokkj.cn/cloud/edata-user/enterprise/wechat/authorization/back', // 授权后重定向的回调链接地址
        response_type: 'code', // 返回类型，此时固定为：code
        scope: 'snsapi_privateinfo', // 应用授权作用域。 snsapi_base：静默授权 / snsapi_privateinfo：手动授权
        state: '' // 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值
      },
      showFeiShuQr: true
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getWecomAppId()
        }
      },
      immediate: true
    },
    showFeiShuQr: {
      handler(val) {
        val && this.initWecom()
      },
      immediate: true
    }
  },
  created() {
    // 企微扫码登录回调方法
    window.Hok_WecomLogin = this.wecomLogin
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 450) / 2 + 'px'
    this.getWecomAppId()
  },
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
    refresh() {
      this.loading = true
      this.showFeiShuQr = false
      setTimeout(() => {
        this.showFeiShuQr = true
        this.loading = false
      }, 200)
    },
    sure() {},
    // 根据登录地址获取企微appId
    async getWecomAppId() {
      this.loading = true
      try {
        const orgInfo = getItem('orgInfo')
        const res = await orgToWecomAppIdApi({
          tenantId: orgInfo.organizationId
        })
        if (res.data) {
          this.wecomConfig.appid = res.data.appId
          this.wecomConfig.agentid = res.data.agentId
          this.wecomConfig.redirect_uri = res.data.redirectUrl
          this.initWecom()
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 初始化企微扫码登陆
    initWecom() {
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          new WwLogin({
            ...this.wecomConfig,
            id: 'wecomApply_wecom_login_container'
          })
          this.$forceUpdate()
        } catch (error) {
          console.log('initWecom-------', error)
        }
      })
    },
    // 企微扫码后回调
    async wecomLogin(url) {
      const params = this.getUrlParams(url)
      this.wecomBind(params.code, 'wecom')
    },
    wecomBind(code) {
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
      wecomToTenantId(data)
        .then(res => {
          if (res?.data?.sysUserDto) {
            arr = res.data.sysUserDto
            return saveBindWechatUser(res.data.sysUserDto)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.wecomApply {
  height: 398px;
  padding-top: 22px;
  .wecomApplyTitle {
    text-align: center;
    font-size: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 28px;
  }
  .wecomApplyTips {
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
    margin: 25px auto 27px;
    padding: 9px;
    overflow: hidden;
  }
}
</style>
