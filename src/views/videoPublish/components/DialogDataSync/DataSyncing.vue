<template>
  <div class="account-list overflowOuto">
    <div v-for="item in accountList" :key="item.authorId" class="account-details">
      <div class="select-list">
        <div class="accountInfo">
          <span class="avatar-details">
            <img :src="item.avatar" alt="" class="select-avatar" />
            <img :src="item.platformIcon" class="platform-icon" />
          </span>
        </div>
        <div class="userInfo">
          <span>
            {{ item.name }}
          </span>
          <span :class="{'status1':item.syncStatus===1,'status2':item.syncStatus===2,'status3':item.syncStatus===3}">
            <span class="statusFont">
              <el-button v-if="item.syncStatus === 2" style="color: #FF7D00;" loading type="text" size="mini">同步中</el-button>
              <div v-else class="statusSus">{{ syncStatusMap[item.syncStatus] }}</div>
            </span>
            <el-button v-if="item.syncStatus === 3" type="text" size="mini" style="margin-left: 4px;" @click="resetSyncData(item)">重新同步</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { updateSyncTime, qryLoginMerchant } from '../../publish/api/index'
import { account, accountContent, contents1 } from './templateData'
import { mapGetters } from 'vuex'

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    accountErrorList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      syncStatusMap: {
        1: '同步成功',
        2: '同步中...',
        3: '同步失败'
      },
      accountList: [],
      overTime: false,
      errorList: [],
      envList: {
        'development': 'https://dev.cloud.hokkj.cn',
        'staging': 'https://dev.cloud.hokkj.cn',
        'test': 'https://test.cloud.hokkj.cn',
        'beta': 'https://beta.cloud.hokkj.cn',
        'production': 'https://cloud.hokkj.cn'
      },
      currentSyncDataIndex: 0,
      total: 0,
      time: null,
      listNums: 0,
      merchantData: {}
    }
  },
  watch: {
    list: {
      handler(val, oldVal) {
        const data = [...val]
        console.log(val, oldVal, 'listlistl')
        this.time = new Date().getTime()
        this.currentSyncDataIndex = 0
        this.total = 0
        this.accountList = JSON.parse(JSON.stringify(val))
        this.listNums = val.length
        this.syncAccountData(data)
      }
    },
    // list(val) {
    //   console.log(val, val1, 'listlistl')

    // },
    accountErrorList(val) {
      this.errorList = val
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch'])
  },
  mounted() {
    this.getLoginMerchant()
  },
  methods: {
    async getLoginMerchant() {
      const res = await qryLoginMerchant()
      this.merchantData = res.data
    },
    async resetSyncData(data) {
      this.overTime = false
      this.syncAccountData([data])
    },
    syncAccountData(list) {
      console.log('触发了数据同步')
      // eslint-disable-next-line no-undef
      const socket = io('ws://localhost:10153', {
        reconnectionDelay: 5000,
        reconnectionDelayMax: 10000
      })
      socket.on('connect', () => {
        if (socket.connected) {
          console.log('已连接')
        }
      })
      const syncAccountInfo = []
      this.accountList.map(item => {
        this.$set(item, 'syncStatus', 2)
        // console.log(item, this.envList[process.env.NODE_ENV], process.env, '环境变量', '数据回传账号信息。。。。。')
        const { platformId, cookie, platformAccountId } = item
        this.updateSyncTimeApi(item)
        syncAccountInfo.push({
          accountId: `${platformAccountId}&${this.time}`,
          time: new Date().getTime(),
          platformId,
          cookie,
          syncAction: [
            'SyncAccountReportListData',
            'SyncAccountData',
            'SyncAccountNotificationList',
            'SyncAccountContentList'
          ],
          newVersion: this.allChannelSwitch[platformId],
          token: this.merchantData.merchantToken,
          callbackUrl: this.envList[process.env.NODE_ENV] + '/cloud/edata-wemedia/callBack/syncData',
          startTime: item.startDate,
          endTime: item.endDate
        })
        this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'platforms-data-sync', 'remark': '平台数据同步', platformAccountId: platformAccountId })
      })
      // console.log(JSON.stringify(syncAccountInfo), 'syncAccountInfosyncAccountInfo')
      // 设置超时
      setTimeout(() => {
        this.overTime = true
        // 把所有this.accountList里面syncStatus为2的改成3
        this.accountList.forEach(item => {
          if (item.syncStatus === 2) {
            this.$set(item, 'syncStatus', 3)
          }
        })
      }, 1000 * 60 * 5)
      socket.emit('platforms-data-sync', JSON.stringify(syncAccountInfo), (response) => {
        console.log(response, '数据回传参数返回值')
        // 监听数据同步回调
      })
      socket.on('sync-data-complete', (data) => {
        console.log(JSON.parse(data), '数据同步回调')
        // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'sync-data-complete', 'remark': '监听数据同步回调' })
        const res = JSON.parse(data)
        if (res.code === 200) {
          const userArr = res.accountId.split('&')
          console.log(userArr[0])
          // 改变this.accountList里面platformAccountId跟userArr[0]一样的syncStatus
          if (!this.overTime) {
            this.accountList.forEach(item => {
              if (item.platformAccountId === userArr[0]) {
                this.$set(item, 'syncStatus', 1)
              }
            })
          }
          console.log(this.accountList, 'this.accountList')
        }
        // 手动同步数据
        // this.manualSyncDataApi(JSON.parse(data))
      })
    },
    async updateSyncTimeApi(data) {
      const { accountId, platformId } = data
      await updateSyncTime({ accountId, platformId })
    },
    // 首字母转换成小写
    convertJsonKey(json) {
      const result = {}
      for (let key in json) {
        const keyval = json[key]
        key = key.replace(key[0], key[0].toLowerCase())
        result[key] = keyval
      }
      return result
    },
    async manualSyncDataApi(data) {
      const userArr = data.syncAccountData.platformAccountId.split('&')
      // 是本次同步的
      // if (userArr[1] === String(this.time)) {

      // }
      const obj = Object.assign({}, data)
      const syncAccountData = { ...account, ...this.convertJsonKey(obj.syncAccountData) }
      syncAccountData.jobject = syncAccountData.jObject
      delete syncAccountData.jObject
      const contents = []
      obj.syncAccountReportListData.contentListResult.syncContentListDataDetails.forEach((item) => {
        if (item.DateTime) {
          item.DateTime = item.DateTime.substring(0, 10)
        }
        // if (item.FrontCoverImage) {
        //   item.FrontCoverImage = item.FrontCoverImage[0]
        // }
        // if (item.Title) {
        //   item.Title = item.Title[0]
        // }
        contents.push({ ...accountContent, ...this.convertJsonKey(item) })
      })
      const newArr = []
      obj.syncAccountContentList.syncOperationContentListDataDetails.forEach((item) => {
        if (item.ReleaseTime) {
          item.ReleaseTime = item.ReleaseTime.substring(0, 19).replace('T', ' ')
        }
        if (item.FrontCoverImage) {
          item.FrontCoverImage = item.FrontCoverImage[0]
        }
        if (item.Title) {
          item.Title = item.Title[0]
        }
        newArr.push({ ...contents1, ...this.convertJsonKey(item) })
      })
      // const params = {
      //   account: syncAccountData,
      //   accountContent: contents,
      //   contents: newArr,
      //   platformAccountId: userArr[0],
      //   accountId: accountId,
      //   platformId: obj.platformId
      // }
      // await manualSyncData(params)
      // 同步失败数据
      if (obj.code !== 200) {
        const arr = Object.assign([], this.accountList)
        arr.forEach((item, index) => {
          if (obj.syncAccountData.platformAccountId === item.platformAccountId) {
            this.accountList.splice(index, 1)
            this.errorList.push(item)
          }
        })
      }
      // 是本次同步的
      if (userArr[1] === String(this.time)) {
        this.currentSyncDataIndex = this.currentSyncDataIndex + 1
      }
      // 拿到全部回调之后进行第三步
      // if (this.total === this.listNums) {
      //   this.$emit('allSyncResult', this.accountList, this.errorList)
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.account-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-height: 300px;
    padding: 14px 22px;
    box-sizing: border-box;
    .account-details{
      width: 50%;
      padding: 20px 8px;
      box-sizing: border-box;
      border-bottom: 1px solid #f3f3f3;
      // flex: 1;
    }
  }
  .statusFont{
    display: flex;
    align-items: center;
    .statusSus{
      height: 28px;
      line-height: 28px;
    }
  }
  .status1,.status2,.status3{
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #00B42A;
  }
  .status2{
    color: #FF7D00;
  }
  .status3{
    color: #F53F3F;
  }
  .synchronized,.notSynchronized{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #00B42A;
  }
  .notSynchronized{
    color: #F53F3F;
  }
  .accountInfo{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .expire{
    width: 53px;
    height: 18px;
    line-height: 16px;
    text-align: center;
    border-radius: 9px;
    border: 1px solid #D5D8DE;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    margin-top: 8px ;
  }
  .userInfo{
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  }
  .select-list {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    line-height: 20px;
    .avatar-details{
      position: relative;
      .platform-icon{
        position: absolute;
        bottom: 0px;
        right: 4px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
      }
    }
    .el-checkbox__label {
      margin-bottom: 0px;
    }
    .select-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
</style>
