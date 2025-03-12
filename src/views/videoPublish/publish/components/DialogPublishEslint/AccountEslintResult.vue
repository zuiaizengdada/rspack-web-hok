<template>
  <div class="eslint-result-container">
    <div class="eslint-result-content">
      <div v-show="accountErrorList.length" class="account-error-list">
        <p class="title flex items-center">账号检测状态异常 <span>请将鼠标移至头像点击登录授权</span></p>
        <div class="flex items-center flex-wrap">
          <account-info v-for="(item) in accountErrorList" :key="item.accountId" :account="item" class="account-item" :class="{'isErrorXiaohongshu':item.errorMsg}">
            <p slot="accountStatus" class="account-status cursor-pointer">
              <span class="txt"><i class="el-icon-warning" />{{ item.errorMsg||'登录失效' }}</span>
              <span class="reload" @click="signInAgain(item)">重新登录</span>
            </p>
          </account-info>
        </div>
      </div>
      <div class="account-check-list">
        <p class="title">以下账号可以同步至平台 <span>点击头像左侧取消勾选后则不会同步</span></p>
        <el-checkbox-group v-model="accountChecked">
          <el-checkbox v-for="item in accountSuccessList" :key="item.AuthorId" :label="item.AuthorId" style="margin-bottom:20px">
            <account-info :account="item" class="account-info relative">
              <i slot="iconStatus" class="el-icon-circle-check icon-success absolute" />
            </account-info>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="account-result-bottom text-center">
      <el-button type="primary" :loading="syncPlatformLoading" @click="handleClickSyncPlatform">同步至平台 <span>(将登录成功的账号发布)</span></el-button>
    </div>
  </div>
</template>
<script>
import AccountInfo from './AccountInfo.vue'
import { checkLogin, updateLoginStatus } from '@/api/videoManagement/accountManage'
import { mapGetters } from 'vuex'
import { isUseNewClient } from '@/utils'
export default {
  components: {
    AccountInfo
  },
  props: {
    successList: {
      type: Array,
      default: () => []
    },
    accountList: {
      type: Array,
      default: () => []
    },
    errorList: {
      type: Array,
      default: () => []
    }
  },
  inject: ['publishChannelData', 'getMerchantToken'],
  data() {
    return {
      accountErrorList: [],
      accountSuccessList: [],
      accountChecked: [],
      syncPlatformLoading: false,
      // accountCheckedList: [],
      merchantToken: ''
    }
  },
  watch: {
    successList(val) {
      console.log(val, 'successList')
      this.accountChecked = []
      this.accountCheckedList = []
      this.accountSuccessList = val
      val.forEach(item => {
        this.accountChecked.push(item.AuthorId)
        // this.accountCheckedList.push(item)
      })
    },
    errorList(val) {
      this.accountErrorList = val
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'isNewSocketVideoPublish'])
  },
  methods: {
    handleClickSyncPlatform() {
      // console.log(this.accountSuccessList, this.accountErrorList, this.publishChannelData.list, '同步平台')
      // const arr = []
      // // this.accountSuccessList跟this.publishChannelData.list里面的account.accountId对比，如果有相同的就提取this.publishChannelData.list
      // this.accountSuccessList.forEach(item => {
      //   this.publishChannelData.list.forEach(ele => {
      //     if (item.AuthorId === ele.account.accountId) {
      //       arr.push(ele)
      //     }
      //   })
      // })
      // console.log(arr)
      // return
      if (this.accountChecked.length < 1) {
        this.$message.error('请选择平台账号')
      } else {
        this.syncPlatformLoading = true
        setTimeout(() => {
          this.$emit('success', this.accountChecked)
        }, 100)
      }
    },
    // 更新这条信息
    updataInfo(item) {
      this.accountList.forEach((ele) => {
        if (ele.accountId === item.accountId) {
          ele.cookie = item.cookie
          ele.status = 1
          this.errId = ''
        }
      })
      this.resetList(item.accountId)
    },
    // 重新登录
    async signInAgain(item) {
      console.log(this.accountSuccessList, this.accountErrorList, '重新登录')
      // const merchantTokenString = localStorage.getItem('videoPublishMerchantData')
      // const merchantToken = JSON.parse(merchantTokenString)
      this.merchantToken = this.getMerchantToken()
      // 登录账号
      const params = {
        accountId: item.accountId,
        platformId: item.platformId,
        merchantToken: this.merchantToken,
        cookie: null,
        newVersion: this.allChannelSwitch[item.platformId],
        authorizationModel: true
      }
      this.$uweb && this.$uweb.setAction('Event_videoPublish_loginError')
      console.log(params, '登录账号参数。。。')
      this.$store.dispatch('videoManage/saveErrorInfo', {
        platformAccountId: item.platformAccountId,
        requestParam: item.cookie,
        planId: item.platformId,
        apiUrl: 'account-login',
        errorInfo: '登录之前的日志记录'
      })
      // 加上一个remark: '登录自媒体账号'合并到item对面里面
      const checkObj = { ...item, remark: '登录自媒体账号' }
      const cookieRes = await this.$store.dispatch('videoManage/checkCookie', checkObj)
      if (cookieRes) {
        item.cookie = cookieRes
        this.updataInfo(item)
        return
      }
      isUseNewClient(item.platformId, 'account-login', '', '登录自媒体账号').emit('account-login', JSON.stringify(params), (response) => {
        console.log(JSON.parse(response), '账号登录返回参数。。。')
        const loginObj = JSON.parse(response)
        // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'account-login', platformAccountId: item.platformAccountId, 'remark': '登录自媒体账号' })
        if (loginObj.code === 200) {
          const userInfo = loginObj.data?.userInfo ? JSON.parse(loginObj.data?.userInfo) : null
          const short_id = userInfo?.unique_id || userInfo?.short_id
          this.$store.dispatch('videoManage/saveErrorInfo', {
            platformAccountId: item.platformAccountId,
            requestParam: loginObj.data.cookie,
            planId: item.platformId,
            apiUrl: 'account-login',
            errorInfo: '登录之后的日志记录'
          })
          //  登录返回的信息
          const paramsSecord = {
            authorId: loginObj.data.authorId,
            platformAccountId: item.platformAccountId
          }
          checkLogin(paramsSecord).then(res => {
            const obj = {
              cookie: loginObj.data.cookie,
              loginStatus: 2,
              platformAccountId: item.platformAccountId,
              name: loginObj.data.name,
              avatar: loginObj.data.avatar,
              remark: '登录自媒体账号',
              uniqueId: short_id,
              type: 2
            }
            updateLoginStatus(obj).then(res => {
              item.cookie = loginObj.data.cookie
              this.updataInfo(item)
              this.$store.dispatch('videoManage/syncAccountData', item.platformAccountId)
              this.checkAccount()
            })
          })
        }
      })
    },
    allowClicking() {
      this.syncPlatformLoading = false
    },
    // 登录成功之后把失败的这个数组加到成功里面去
    resetList(accountId) {
      console.log(this.accountSuccessList, this.accountErrorList)
      let errInd = ''

      this.accountErrorList.forEach((item, index) => {
        if (item.accountId === accountId) {
          errInd = index
        }
      })
      let obj = null
      this.accountList.forEach(item => {
        if (item.accountId === accountId) {
          obj = item
          obj.AuthorId = obj.accountId
        }
      })
      console.log(obj, '更新cookie..')
      this.accountChecked.push(accountId)
      this.accountErrorList.splice(errInd, 1)
      this.accountSuccessList.push(obj)
      this.$forceUpdate()
    },
    // 账号检测
    checkAccount() {
      const arr = this.accountList.reduce((pre, next) => {
        pre.push({
          platformId: next.platformId,
          platformAccountId: next.platformAccountId,
          cookie: next.cookie,
          newVersion: this.allChannelSwitch[next.platformId],
          token: this.merchantToken
        })
        return pre
      }, [])

      arr.forEach(item => {
        isUseNewClient(item.platformId, 'check-account-login-status', item.platformAccountId, '检测登录自媒体账号').emit(
          'check-account-login-status',
          JSON.stringify([item]),
          response => {
            const checkList = JSON.parse(response)
            console.log(checkList, 'ooooooo')
            this.accountList.forEach((item, index) => {
              this.$set(item, 'status', (checkList[index].PlatformAccountInfo?.Code || 1))
            // item.status =
            })
          }
        )
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.eslint-result-content{
  padding:0 20px 20px 20px;
  .title{
    font-size: 16px;
    margin-bottom:20px;
    span{
      color:#F53F3F;
      margin-left:10px;
      font-size:12px;
    }
  }
  .account-error-list{
    border-bottom:1px solid #E7E7E7;
    padding-bottom:28px;
    margin-bottom:20px;
    .account-item{
      background: #FAFAFA;
      border-radius: 4px;
      margin-right:24px;
      padding:6px;
      min-width: 140px;
      border:1px solid #FAFAFA;
      .account-status{
        font-size:12px;
        line-height: 18px;
        margin-left:10px;
        .reload{
          display: none;
          color:#1778FF;
        }
        .txt{
          color:#F53F3F;
          i{
            font-size:14px;
            margin-right:4px;
          }
        }
      }
      &:hover:not(.isErrorXiaohongshu){
        border:1px solid #F53F3F;
        .reload{
          display: block;
        }
        .txt{
          display: none;
        }
      }
    }
  }
  .account-check-list{
    padding-bottom:30px;

  }
}
.account-result-bottom{
  padding-top:16px;
  box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.05);
  border-radius: 0px 0px 10px 10px;
}
// ::v-deep .el-checkbox{
//     display: flex;
//     justify-items: center;
// }
.icon-success{
  top:4px;
  right:4px;
  font-size:14px;
  color: #00B42A ;
}
</style>
