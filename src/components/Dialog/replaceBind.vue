<template>
  <AppDialog
    v-model="visible"
    title="智能销售账号换绑"
    width="700px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <el-form
        ref="form"
        label-width="auto"
        :model="form"
        size="small"
        style="margin-top: 12px"
        :rules="rules"
      >
        <el-form-item label="换绑方式：" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            style="width: 168px"
            clearable
            @change="onhandleTypeChang"
          >
            <el-option label="手机号" :value="1" />
            <!-- <el-option label="企微二维码换绑" :value="2" /> -->
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="账户手机号：">
          <div style="display: flex; justify-content: space-between">
            <span>{{ phone }}</span>
            <span>请确保当前手机号码对应的企业微信已经完成认证</span>
          </div>
          <div class="thirdAccountsListContent">
            <el-image :src="weChat.bizWechatAvatar" class="imgAvater">
              <template slot="error">
                <img
                  src="~@/assets/image/imgloadError.png"
                  alt=""
                  style="width: 58px; height: 58px"
                />
              </template>
            </el-image>
            <div class="userInfo">
              <span>{{ weChat.bizWechatName }}</span>
              <span>{{ weChat.bizWechatAlias }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="form.type === 2" label="企微二维码绑定：">
          <div class="wecomApplyTips">
            请使用 <span style="color: #2c3242">【企微】</span> 移动端扫描二维码
          </div>
          <div v-loading="loading" class="new-scan-qrcode-container">
            <div
              id="wecomApply_wecom_login_container"
              style="width: 182px; height: 182px"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  getUserBindList,
  changBindWechat,
  orgToWecomAppIdApi
} from '@/api/user/member'
import { getItem } from '@/utils/localStorage'

export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      option: [],
      top: '114px',
      phone: '',
      form: {
        type: ''
      },
      weChat: {
        bizWechatAvatar: '',
        bizWechatName: '',
        bizWechatAlias: ''
      },
      wecomConfig: {
        appid: 'ww5bdb695e9e3551c6', // 企业的CorpID
        agentid: '1000030', // 应用agentid，建议填上该参数
        redirect_uri:
          'https://test.cloud.hokkj.cn/cloud/edata-user/enterprise/wechat/authorization/back', // 授权后重定向的回调链接地址
        response_type: 'code', // 返回类型，此时固定为：code
        scope: 'snsapi_privateinfo', // 应用授权作用域。 snsapi_base：静默授权 / snsapi_privateinfo：手动授权
        state: '' // 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值
      },
      rules: {
        type: [{ required: true, message: '请选择换绑方式', trigger: 'change' }]
      },
      success: () => {}
    }
  },
  mounted() {
    // 企微扫码登录回调方法
    // window.Hok_WecomLogin = this.wecomLogin
  },
  methods: {
    open(weChat) {
      console.log(weChat, 'weChat')
      this.visible = true
      this.phone = this.$store.getters.userInfo?.phoneNumber
      this.weChat = weChat
      this.getList()
    },
    getList() {
      getUserBindList().then(res => {
        this.option = res.data
      })
    },
    sure() {
      if (this.form.type === 2) {
        this.message.error('请扫描二维码绑定')
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.wecomBind()
        } else {
          return false
        }
      })
    },
    handleDisabledFn(item) {
      this.disabledFn && this.disabledFn(item)
    },
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
    // 企微扫码后回调
    async wecomLogin(url) {
      const params = this.getUrlParams(url)
      this.wecomBind(params.code, 'wecom')
    },
    // 第三方平台切换触发
    onhandleTypeChang(res) {
      if (res === 2) {
        this.getWecomAppId()
      }
    },
    wecomBind(code) {
      if (this.loading) {
        return
      }
      this.loading = true
      // 根据code获取飞书详情
      const orgInfo = getItem('orgInfo')
      let params = {}
      if (this.form.type === 2) {
        params = {
          code: code,
          type: 2,
          userId: this.$store.state.user.userInfo.userId,
          tenantId: orgInfo.organizationId
        }
      } else {
        params = {
          type: 1,
          userId: this.$store.state.user.userInfo.userId,
          tenantId: orgInfo.organizationId,
          wechatPhone: this.phone
        }
      }
      changBindWechat(params)
        .then(res => {
          if (res.code === 1) {
            this.$message.success('绑定成功')
            this.visible = false
            this.$emit('success')
          }
        })
        .catch(() => {
          this.loading = false
          if (this.form.type === 2) {
            this.initWecom()
          }
        })
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.editRemarks {
  min-height: 215px;
  padding: 20px;
}
.tips {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
.wecomApplyTips {
  margin-top: 10px;
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
.new-scan-qrcode-container {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #cbcfd3;
  margin: 10px;
  padding: 9px;
  overflow: hidden;
}
.thirdAccountsListContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 110px;
  .imgAvater {
    width: 100px;
    height: 100px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .userInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    > span:nth-child(1) {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 20px;
    }
    > span:nth-child(2) {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
    }
  }
}
</style>
