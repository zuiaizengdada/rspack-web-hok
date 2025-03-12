import { qryLoginMerchant, syncData, updateSyncTime } from '@/views/videoPublish/publish/api'
import { updatePublishTaskRecord } from '@/views/videoPublish/publish/api/index'
import { getNeedUpdateTaskRecord } from '@/api/videoManagement/dataApi'
import { account, accountContent, contents1 } from '@/views/videoPublish/components/DialogDataSync/templateData'
import { mapGetters } from 'vuex'
import { isUseNewClient } from '@/utils'
export const mixinsSyncData = {
  data() {
    return {
      visibleDialogDataSync: false,
      merchantData: {}
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch'])
  },
  methods: {
    handleClickSyncData() {
      this.visibleDialogDataSync = true
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
    // 自动同步流程
    async automaticSync(id) {
      console.log('自动同步流程')
      const susList = []
      const res = await qryLoginMerchant()
      const obj = res.data
      if (obj) {
        this.merchantData = res.data
        const { data } = await getNeedUpdateTaskRecord({ taskId: id })
        console.log(data, '需要同步的数据')
        // const arr = data
        data.forEach((item) => {
          const params = {
            token: this.merchantData.merchantToken,
            publishId: item.publishId,
            title: item.title,
            platformId: item.platformId,
            newVersion: this.allChannelSwitch[item.platformId],
            cookie: item.cookie,
            accountId: item.accountId,
            mediaTypeEnum: 'MiniVideo'
          }
          console.log('pppmmmmm:', this.socket, params)
          isUseNewClient(item.platformId, 'get-publish-status', '', '获取文章发布至平台后的状态').emit('get-publish-status', JSON.stringify(params), (response) => {
            const responseObj = JSON.parse(response)
            // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'get-publish-status', 'remark': '获取文章发布至平台后的状态' })
            console.log(responseObj, '账号同步结果。。。')
            if (responseObj.messageType === '0') {
              const obj = {
                accountId: item.accountId,
                openUrl: responseObj.dataBody.openUrl,
                platformId: item.platformId,
                publishId: responseObj.dataBody.publishId,
                publishTime: responseObj.dataBody.publishTime,
                resultDesc: responseObj.dataBody.errorMsg,
                status: responseObj.dataBody.status,
                taskRecordId: item.taskRecordId,
                platDocId: responseObj.dataBody.docId || '',
                taskId: item.taskId
              }
              // susList.push(obj)
              this.updatePublishTaskRecord(obj)
              console.log(susList)
            } else {
              console.log(item, '作品删除了。。。')
              const obj = {
                accountId: item.accountId,
                platformId: item.platformId,
                status: 6,
                platDocId: '',
                taskRecordId: item.taskRecordId,
                taskId: item.taskId
              }
              this.updatePublishTaskRecord(obj)
              // susList.push(obj)
            }
          })
        })
      }
    },
    async updatePublishTaskRecord(data) {
      updatePublishTaskRecord(data).then(res => {
        console.log('sssss:DDDE:)', res)
      })
      this.loadData()
      this.$emit('loadData')
    },
    async manualSyncDataApi(data, arr) {
      let accountId = ''
      arr.forEach(item => {
        if (item.platformAccountId === data.syncAccountData.platformAccountId) {
          accountId = item.accountId
        }
      })
      const obj = Object.assign({}, data)
      const syncAccountData = { ...account, ...this.convertJsonKey(obj.syncAccountData) }
      syncAccountData.jobject = syncAccountData.jObject
      delete syncAccountData.jObject
      const contents = []
      obj.syncAccountReportListData.contentListResult.syncContentListDataDetails.forEach((item) => {
        if (item.DateTime) {
          item.DateTime = item.DateTime.substring(0, 10)
        }
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
      const params = {
        account: syncAccountData,
        accountContent: contents,
        contents: newArr,
        platformAccountId: syncAccountData.platformAccountId,
        accountId: accountId,
        platformId: obj.platformId
      }
      await syncData(params)
    },
    async updateSyncTimeApi(data) {
      const { accountId, platformId } = data
      await updateSyncTime({ accountId, platformId })
    }
  }
}
