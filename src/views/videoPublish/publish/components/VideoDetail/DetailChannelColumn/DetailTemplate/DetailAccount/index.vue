<template>
  <div
    class="content items-center flex"
    :style="accountList.length>0?'border-bottom: 1px solid #eee':''"
  >
    <div class="account-name">
      <span>账号</span>
    </div>
    <div class="account-list">
      <div
        v-for="(item, index) in accountList"
        :key="item.accountId"
        :class="[
          'account-details',
          selectId == item.accountId ? 'accountActive' : '',
          errId == item.accountId ? 'errActive' : ''
        ]"
        @click="selectAccount(item)"
      >
        <img
          :src="close"
          class="close-btn"
          @click="deleteAccount(index, item)"
        />
        <div class="avatar">
          <img :src="item.avatar" class="account-avatar" />
          <img v-if="item.otherErr" :src="warn" class="warn" />
        </div>
        <div class="name-details">
          <div
            :class="
              item.status ? 'name-box text_hidden_1' : 'name-box text_hidden'
            "
          >
            {{ item.name }}
          </div>
          <div v-if="item.status == -1">
            <div
              v-if="errId == item.accountId"
              class="signInAgain"
              @click="signInAgain(item)"
            >
              重新登录
            </div>
            <div v-else class="beDefeated">
              <span><img :src="warn" /></span><span>授权失效</span>
            </div>
          </div>
        </div>
      </div>
      <div class="add-popup">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          class="btn-sty"
          @click="showAd"
        />
        <addAccount
          :title="`选择${tamplateDataName.get(channel.id)}账号`"
          :visible="addFlag"
          :select-id-list="selectIdList"
          @success="successAddAccount"
          @close="closeAa"
        />
      </div>
    </div>
  </div>
</template>

<script>
import warn from '@/assets/svg/videoManga/warn_icon.svg'
import close from '@/assets/svg/videoManga/close_icon.svg'
import addAccount from './components/addAccount'
import {
  checkLogin,
  updateLoginStatus,
  updateUnLogin
} from '@/api/videoManagement/accountManage'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { mapGetters } from 'vuex'
import { tamplateDataName } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'
import { isUseNewClient } from '@/utils'
export default {
  name: 'Index',
  components: {
    addAccount
  },
  mixins: [mixinsAllOperations],
  props: {},
  data() {
    return {
      warn,
      close,
      addFlag: false,
      selectId: '',
      tamplateDataName,
      accountList: [],
      userTime: '',
      selectIdList: [],
      errId: '',
      imgsrc:
        'http://tiebapic.baidu.com/forum/w%3D580/sign=9d3fa8074dfa513d51aa6cd60d6f554c/be9cbf5594eef01f3699251ea5fe9925bd317d6b.jpg?tbpicau=2023-03-08-05_63ddd71c18d0bd5caa488512ed575580'
    }
  },
  inject: [
    'publishChannelData',
    'channel',
    'deletePublishChanelData',
    'getMerchantToken',
    'updateChannelAccountData',
    'updataErrList'
  ],
  computed: {
    merchantToken() {
      return this.getMerchantToken()
    },
    ...mapGetters(['allChannelSwitch', 'fuxiVersion'])
  },
  watch: {
    'publishChannelData.list': {
      handler() {
        this.initAccount()
      }
    },
    'channel.id': {
      handler() {
        this.initAccount()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 初始化获取账号
    initAccount() {
      this.userTime = new Date().getTime()
      if (this.publishChannelData.list.length > 0) {
        const arr = this.publishChannelData.list.filter(
          ele => Number(ele.account.platformId) === Number(this.channel.id)
        )
        this.accountList = arr.map(e => e.account)
        this.selectIdList = arr.map(ele => ele.account.accountId)
        this.checkAccount()
        if (arr.length > 0) {
          this.selectAccount(this.accountList[0])
        }
      }
    },
    // 账号检测
    checkAccount() {
      const arr = this.accountList.reduce((pre, next) => {
        pre.push({
          platformId: next.platformId,
          platformAccountId: next.platformAccountId,
          cookie: next.cookie,
          token: this.merchantToken
        })
        return pre
      }, [])
      if (this.accountList.length < 1) {
        this.updataErrList({ platformId: this.channel.id, accountError: false, contentError: false }, '账号检测222')
      }
      arr.forEach(item => {
        item.newVersion = this.allChannelSwitch[item.platformId]
        isUseNewClient(item.platformId, 'check-account-login-status', item.platformAccountId, '检测登录自媒体账号').emit(
          'check-account-login-status',
          JSON.stringify([item]),
          response => {
            const checkList = JSON.parse(response)
            console.log(checkList, '检测登录状态')
            const res = JSON.parse(response)[0]
            // 检测未登录 更改状态
            if (res.Code !== 200) {
              if (res?.PlatformAccountInfo.Code === -1) {
                updateUnLogin({
                  loginStatus: 1,
                  platformAccountId: item.platformAccountId,
                  cookie: item.cookie,
                  version: this.fuxiVersion
                })
                this.updataErrList({
                  platformId: item.platformId,
                  accountError: true
                }, '账号检测1')
              }
              this.$store.dispatch('videoManage/saveErrorInfo', {
                platformAccountId: item.platformAccountId,
                requestParam: item.cookie,
                apiUrl: 'check-account-login-status',
                planId: item.platformId,
                errorInfo: res?.PlatformAccountInfo.Message
              })
            } else {
              this.updataErrList({
                platformId: item.PlatformId,
                accountError: false
              }, '账号检测2')
            }
            const arr = this.accountList
            if (checkList.length >= 1) {
              // 根据错误码重置账号状态：-1 表示网络错误，-2 表示其他错误
              const errorCode = res?.PlatformAccountInfo?.Code || 200
              if (errorCode === -1 || errorCode === -2 || errorCode === 200) {
                arr.forEach((e, ind) => {
                  if (item.platformAccountId === e.platformAccountId) {
                    this.$set(arr[ind], 'status', errorCode === -1 ? -1 : 1)
                  }
                })
              }
            }
            this.$nextTick(() => {
              this.accountList = arr
              if (this.accountList.length) {
                this.selectAccount(this.accountList[0])
              }
            })
          }
        )
      })
    },
    // 选中的账号
    selectAccount(item) {
      console.log(item, this.errId, '选中的账号')
      if (item.status === -1) {
        this.errId = item.accountId
      } else {
        this.selectId = item.accountId
      }
      this.updateChannelAccountData(item)
      this.$emit('active', item.accountId)
    },
    showAd() {
      this.addFlag = true
      this.$uweb && this.$uweb.setAction('Event_videoPublish_accoutAdd')
    },
    closeAa() {
      this.addFlag = false
    },
    successAddAccount(list) {
      this.accountList = list
      this.selectIdList = this.accountList.map(e => e.accountId)
      // 检测账号是否过期
      this.checkAccount()
      this.$emit('add', list)
      setTimeout(() => {
        this.selectAccount(list[0])
      }, 300)
    },
    // 更新这条信息
    updataInfo(item) {
      this.updataErrList({
        platformId: item.platformId,
        accountError: false
      }, '账号检测2')
      const arr = this.accountList
      arr.forEach(ele => {
        if (ele.accountId === item.accountId) {
          ele.cookie = item.cookie
          ele.status = 1
          this.publishChannelData.activeData.account.status = 1
          this.errId = ''
        }
      })
      this.accountList = arr
    },
    // 重新登录
    async signInAgain(item) {
      // 登录账号
      const params = {
        accountId: item.accountId,
        platformId: item.platformId,
        merchantToken: this.merchantToken,
        cookie: null,
        newVersion: this.allChannelSwitch[item.platformId],
        authorizationModel: true
      }
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
      isUseNewClient(item.platformId, 'account-login', item.platformAccountId, '登录自媒体账号').emit(
        'account-login',
        JSON.stringify(params),
        response => {
          const loginObj = JSON.parse(response)
          console.log(loginObj, '重新登录返回信 息')
          if (loginObj.code === 200) {
            const userInfo = loginObj.data?.userInfo ? JSON.parse(loginObj.data?.userInfo) : null
            const short_id = userInfo?.unique_id || userInfo?.short_id
            this.$store.dispatch('videoManage/saveErrorInfo', {
              platformAccountId: item.platformAccountId,
              requestParam: loginObj.data.cookie,
              planId: item.platformId,
              apiUrl: 'account-login',
              errorInfo: '登录之前的日志记录'
            })
            console.log(this.updataErrList, '重新登录')
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
                uniqueId: short_id,
                remark: '登录自媒体账号',
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
        }
      )
      this.$uweb && this.$uweb.setAction('Event_videoPublish_loginError')
    },
    // 删除了
    deleteAccount(index, data) {
      this.deletePublishChanelData(this.accountList[index])
      console.log(this.accountList, '删除了')
      this.accountList.splice(index, 1)
      this.checkAccount()
      this.selectIdList = this.accountList.map(e => e.accountId)
      // this.selectId = ''
      this.errId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.add-popup {
  position: relative;
  z-index: 999;
}
.content {
  display: flex;
  z-index: 99;
  padding-bottom: 20px;
  box-sizing: border-box;
  .account-name {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 16px;
    .account-name-tips {
      color: #f53f3f;
      margin-right: 4px;
    }
  }
  .btn-sty {
    width: 136px;
    height: 48px;
  }
  .account-list {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    .account-details:hover .close-btn {
      display: block;
    }
    .account-details {
      width: 136px;
      height: 48px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid transparent;
      margin-right: 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 6px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      .close-btn {
        position: absolute;
        right: -8px;
        top: -8px;
        font-size: 16px;
        display: none;
      }
      .account-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
      .name-details {
        margin-left: 4px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        .beDefeated {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #f53f3f;
        }
        .name-box {
          width: 84px;
        }
      }
    }
    .accountActive {
      background: #f1f5fc;
      box-shadow: 0px 2px 4px 0px rgba(12, 111, 255, 0.2);
      border: 1px solid #0c6fff;
    }
    .errActive {
      background: #fafafa;
      box-shadow: 0px 2px 4px 0px rgba(255, 12, 12, 0.2);
      border: 1px solid #f53f3f;
    }
    .signInAgain {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1778ff;
    }
    .avatar {
      position: relative;
      .warn {
        position: absolute;
        bottom: -5px;
        right: -6px;
      }
    }
  }
}
</style>
