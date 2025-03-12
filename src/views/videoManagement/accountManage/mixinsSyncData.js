import { qryLoginMerchant, querySyncInfo, updateSyncTime } from '@/views/videoPublish/publish/api'
import { updateUnLogin, insertSyncStatus } from '@/api/videoManagement/accountManage'
import { mapGetters } from 'vuex'
import { isGreaterThan, isUseNewClient, isNewClient } from '@/utils/index'
export const mixinsSyncData = {
  data() {
    return {
      isGreaterThan,
      merchantData: {},
      envList: {
        'development': 'https://dev.cloud.hokkj.cn',
        'staging': 'https://test.cloud.hokkj.cn',
        'test': 'https://test.cloud.hokkj.cn',
        'beta': 'https://beta.cloud.hokkj.cn',
        'production': 'https://cloud.hokkj.cn'
      },
      timer: null,
      behaviorTimer: null,
      behaviorTime: 0,
      socket: null
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'fuxiVersion', 'syncDataConfig', 'isNewSocketVideoPublish'])
  },
  created() {
    // this.$openYixiaoer()
    this.automaticSync(1) // 自动同步
    this.timer = setInterval(() => {
      this.automaticSync(1) // 自动同步
    }, 1000 * 60 * 60 * 1)
  },
  methods: {
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
    // 自动同步流程
    async automaticSync(type) {
      if (!this.isNewSocketVideoPublish) return
      const susList = []
      const res = await qryLoginMerchant()
      this.$store.dispatch('videoManage/getAccountData', res.data)
      this.merchantData = res.data
      const { data } = await querySyncInfo({ type: type })
      const arr = data
      const platformAccountIds = []
      arr && arr.forEach((item) => {
        item.newVersion = this.allChannelSwitch[item.platformId]
        isUseNewClient(item.platformId, 'check-account-login-status', item.platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify([item]), (response) => {
          // console.log(JSON.parse(response), '检测账号登录情况。。。')
          const checkAccountLoginStatusRes = JSON.parse(response)
          console.log(checkAccountLoginStatusRes, '检测账号登录情况。。。')
          if (checkAccountLoginStatusRes[0].Code === 200) {
            platformAccountIds.push(item.platformAccountId)
            susList.push(item)
          } else {
            console.log(item, res, '错误的的账号')
            if (checkAccountLoginStatusRes[0]?.PlatformAccountInfo.Code === -1) {
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
              errorInfo: checkAccountLoginStatusRes[0]?.PlatformAccountInfo.Message
            })
          }
        })
        // if (res.Code === 200) {
        // this.updateSyncTimeApi(item)
        // }
      })
      // 根据配置读取哪些渠道需要模拟点击
      const configList = []
      // const newList = []
      const otherList = []
      this.syncDataConfig.forEach(item => {
        configList.push(item.platformId)
      })
      setTimeout(async () => {
        // susList.forEach((item) => {
        //   console.log(this.isGreaterThan, 'isGreaterThan')
        //   if (configList.includes(item.platformId)) {
        //     newList.push(item)
        //   } else {
        //     otherList.push(item)
        //   }
        // })
        // if (this.isGreaterThan(this.fuxiVersion, '1.3.2')) {
        //   if (newList.length) {
        //     this.synConfigData(newList)
        //   }
        // } else {
        if (platformAccountIds.length) {
          await insertSyncStatus({
            platformAccountIds: platformAccountIds,
            version: this.fuxiVersion
          })
        }
        otherList.push(...susList)
        // }
        this.syncDataformYixiaoer(otherList)
      }, 2000)
    },
    async syncDataformYixiaoer(list) {
      // const syncAccountInfo = []
      const newSyncAccountInfo = []
      list.forEach(item => {
        const { platformId, cookie, platformAccountId } = item
        const obj = {
          accountId: platformAccountId,
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
          callbackUrl:
            this.envList[process.env.NODE_ENV] +
            '/cloud/edata-wemedia/callBack/syncData',
          startTime: item.startDate,
          endTime: item.endDate
        }
        if (isNewClient(platformId)) {
          newSyncAccountInfo.push(obj)
          this.$store.dispatch('settings/insertApiStat', {
            apiUrl: 'platforms-data-sync',
            remark: '平台数据同步',
            platformAccountId: platformAccountId,
            type: 2
          })
        }
        // else {
        //   syncAccountInfo.push(obj)
        //   this.$store.dispatch('settings/insertApiStat', {
        //     apiUrl: 'platforms-data-sync',
        //     remark: '平台数据同步',
        //     platformAccountId: platformAccountId
        //   })
        // }
      })
      // if (syncAccountInfo.length) {
      //   window.videoPublishSocket.emit(
      //     'platforms-data-sync',
      //     JSON.stringify(syncAccountInfo),
      //     response => {
      //       console.log(response, '老版数据回传参数返回值')
      //     }
      //   )
      // }
      if (newSyncAccountInfo.length) {
        window.videoPublishNewSocket.emit(
          'platforms-data-sync',
          JSON.stringify(newSyncAccountInfo),
          response => {
            console.log(response, '新版数据回传参数返回值')
          }
        )
      }
    },
    // 同步配置需要模拟点击渠道数据
    synConfigData(configList) {
      // 模拟用户行为
      this.syncDataConfig.forEach(item => {
        configList.forEach(item1 => {
          if (item.platformId === item1.platformId) {
            item1.urls = item.urls
            item1.step = 0
          }
        })
      })
      // 如果五秒钟内没有返回则默认走完了所有模拟
      this.behaviorTimer = setInterval(() => {
        this.behaviorTime++
        if (this.behaviorTime >= 5) {
          clearInterval(this.behaviorTimer)
          this.behaviorTime = 0
          console.log(configList, '结束了的数据')
          this.syncDataOneByOne(configList)
        }
      }, 1000)
      // 轮流调用urls里面的接口 第一个有返回之后再调用第二个
      configList.forEach(item => {
        console.log(item, 'item555555555555555')
        this.emitBehavior(item, configList)
      })
    },
    async emitBehavior(data, configList) {
      console.log(data, 'chufaleyici')
      const obj = {
        platformId: data.platformId,
        accountId: data.accountId,
        cookie: data.cookie,
        merchantToken: this.merchantData.merchantToken,
        url: data.urls ? data.urls[data.step] : '',
        callbackUrl: isNewClient(data.platformId) ? this.envList[process.env.NODE_ENV] + '/cloud/edata-wemedia/open/callbackUpdateCookie' : ''
      }
      console.log(obj, '模拟用户行为参数。。。')
      isUseNewClient(obj.platformId, 'keep-online-sync', obj.platformAccountId, '模拟用户行为').emit(
        'keep-online-sync',
        JSON.stringify(obj),
        response => {
          const newData = response.data
          console.log(response, '模拟用户行为返回。。。')
          this.behaviorTime = 0
          // 根据账号id找到对应的账号 把step+1
          configList.forEach(item => {
            if (item.accountId === String(newData.authorId)) {
              item.step++
              if (item?.step <= item?.urls?.length - 1) {
                this.emitBehavior(item, configList)
              }
            }
          })
          // 所有账号的步骤都走完了 继续下一步
          const isComplete = configList.every(item => {
            console.log(item, '当前第几步')
            return item.step === item.urls.length
          })
          if (isComplete) {
            clearInterval(this.behaviorTimer)
            console.log(configList, '结束了的数据isComplete')
            this.syncDataOneByOne(configList)
          }
        }
      )
      // window.videoPublishSocket.on('keep-online-complete', async data => {
      //   console.log(JSON.parse(data), 'keep-online-complete')
      // })
    },
    // 间隔30s同步一个数据
    async syncDataOneByOne(list) {
      list.forEach((item, index) => {
        setTimeout(() => {
          this.syncDataformYixiaoer([item])
        }, index * 30000)
      })
    },
    async updateSyncTimeApi(data) {
      const { accountId, platformId } = data
      await updateSyncTime({ accountId, platformId })
    }
  }
}
