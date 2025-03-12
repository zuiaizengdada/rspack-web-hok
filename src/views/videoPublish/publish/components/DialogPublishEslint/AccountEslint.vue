
<template>
  <div class="account-eslint-container">
    <div v-show="isEslintAccount" class="account-eslint-content">
      <p class="title">正在检测账号登录状态</p>
      <div class="account-list flex items-center flex-wrap">
        <account-info v-for="item in accountList" :key="item.accountId" :account="item" class="account-item" style="margin-bottom:14px" />
      </div>
    </div>
    <account-eslint-result v-show="!isEslintAccount" ref="eslintResult" :account-list="accountList" :success-list="successAccountList" :error-list="errorAccountList" @success="publishEslintSuccess" />
  </div>
</template>
<script>
import AccountInfo from './AccountInfo.vue'
import AccountEslintResult from './AccountEslintResult.vue'
import { isUseNewClient } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  components: {
    AccountInfo,
    AccountEslintResult
  },
  inject: ['publishChannelData'],

  data() {
    return {
      isEslintAccount: true,
      accountList: [],
      errorAccountList: [],
      successAccountList: []
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'isNewSocketVideoPublish'])
  },
  methods: {
    initAccountList() {
      this.accountList = []
      // const dialogVideoPublishString = localStorage.getItem('videoPublishChannelData')
      // const dialogVideoPublishData = JSON.parse(dialogVideoPublishString)
      this.publishChannelData.list.forEach(item => {
        this.accountList.push(item.account)
      })
      this.accountListEslint()
    },
    accountListEslint() {
      const params = []
      this.accountList.forEach(item => {
        const data = {
          platformId: item.platformId,
          platformAccountId: item.platformAccountId,
          cookie: item.cookie
        }
        params.push(data)
      })
      // 一个一个检测账号
      params.forEach(e => {
        console.log(e, '一个个检测账号')
        e.newVersion = this.allChannelSwitch[e.platformId]
        isUseNewClient(e.platformId, 'check-account-login-status', e.platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify([e]), (response) => {
          // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'check-account-login-status', platformAccountId: e.platformAccountId, 'remark': '检测登录自媒体账号' })
          const checkAccountLoginStatusRes = JSON.parse(response)
          checkAccountLoginStatusRes.forEach((item, index) => {
            if (item.Code === 200) {
              this.successAccountList.push(item)
            } else {
              this.$store.dispatch('videoManage/saveErrorInfo', {
                platformAccountId: e.platformAccountId,
                requestParam: e.cookie,
                planId: e.platformId,
                apiUrl: 'check-account-login-status',
                errorInfo: item?.PlatformAccountInfo.Message
              })
              // 找到this.accountList里面platformAccountId跟e.platformAccountId一样的数据
              this.accountList.forEach((_item, _index) => {
                if (_item.platformAccountId === e.platformAccountId) {
                  if (item.PlatformAccountInfo.Code === -2) {
                    _item.AuthorId = _item.accountId
                    this.successAccountList.push(_item)
                  } else {
                    this.errorAccountList.push(_item)
                  }
                }
              })
            }
          })
          if (this.successAccountList.length + this.errorAccountList.length === params.length) {
            setTimeout(() => {
              this.isEslintAccount = false
            }, 100)
          }
        })
      })
    },
    publishEslintSuccess(list) {
      console.log(list, '校验成功的账号列表。。')
      this.$emit('success', list)
    },
    allowClicking() {
      this.$refs.eslintResult.allowClicking()
    }
  }
}
</script>
<style lang="scss" scoped>
.account-eslint-container{
  .account-eslint-content{
    padding:0 20px 20px 20px;
  }
    .title{
        font-size:16px;
        line-height: 22px;
        margin-bottom:16px;
        color:#333;
    }
}
.account-item{
    background: #E7F0FF;
    border-radius: 4px;
    margin-right:20px;
    padding:6px;
}
</style>
