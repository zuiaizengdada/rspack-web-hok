<template>
  <div class="account-eslint-container text-center">
    <p v-loading="loading" class="loading" />
    <p class="number"><b>{{ currentEslintAccountIndex }}</b>/{{ accountList.length }}</p>
    <p class="tips">账号检测中…</p>
  </div>
</template>
<script>
import { updateUnLogin, updateLoginStatus } from '@/api/videoManagement/accountManage'
import { mapGetters } from 'vuex'
import { isUseNewClient } from '@/utils'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      accountList: [],
      currentEslintAccountIndex: 0,
      successList: [],
      errorList: []
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'fuxiVersion', 'isNewSocketVideoPublish'])
  },
  watch: {
    list(val) {
      this.accountList = val
      this.currentEslintAccountIndex = 0
      this.successList = []
      this.errorList = []
      if (val.length) {
        this.accountEslint(val)
      }
    }
  },
  methods: {
    accountEslint(list) {
      list.forEach((item, index) => {
        item.newVersion = this.allChannelSwitch[item.platformId]
        isUseNewClient(item.platformId, 'check-account-login-status', item.platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify([item]), (response) => {
          // console.log(JSON.parse(response), '检测账号登录情况。。。')
          const checkAccountLoginStatusRes = JSON.parse(response)
          this.currentEslintAccountIndex = this.currentEslintAccountIndex + 1
          const res = checkAccountLoginStatusRes[0]
          if (res.Code === 200) {
            item.isExpire = false
            this.successList.push(item)
            this.verifyAccount()
            updateLoginStatus({
              platformAccountId: item.platformAccountId,
              name: res.AuthorName,
              avatar: res.AuthorLogo,
              cookie: item.cookie,
              remark: '检测登录自媒体账号',
              type: 1,
              loginStatus: 2
            })
          } else {
            item.isExpire = true
            this.errorList.push(item)
            this.verifyAccount()
            console.log(item, res, '错误的的账号')
            if (res?.PlatformAccountInfo.Code === -1) {
              updateUnLogin({
                loginStatus: 1,
                platformAccountId: item.platformAccountId,
                cookie: item.cookie,
                version: this.fuxiVersion,
                isEscalation: 1
              })
            }
            this.$store.dispatch('videoManage/saveErrorInfo', {
              platformAccountId: item.platformAccountId,
              requestParam: item.cookie,
              planId: item.platformId,
              apiUrl: 'check-account-login-status',
              errorInfo: res?.PlatformAccountInfo.Message
            })
          }
        })
      })
    },
    verifyAccount() {
      if (this.successList.length + this.errorList.length === this.accountList.length) {
        this.$emit('eslint', { successList: this.successList, errorList: this.errorList })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.account-eslint-container{
    .loading{
        height:110px;
        width:110px;
        margin-bottom:40px;
        margin:0 auto 40px;
    }
    .number{
        b{
            font-size:48px;
            color:#0C6FFF;
            font-weight: 400;
        }
        line-height: 56px;
        color:#777;
        font-size: 36px;
        margin-bottom:24px;
        vertical-align: middle;
    }
    .tips{
        color:#333;
        font-size:16px;
        padding-bottom:60px;
    }
}
</style>
