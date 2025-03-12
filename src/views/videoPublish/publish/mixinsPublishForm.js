import { checkLogin, updateLoginStatus } from '@/api/videoManagement/accountManage'
import { kuaishouTemplateData, bilibiliTemplateData } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'
import { mapGetters } from 'vuex'
import { isUseNewClient } from '@/utils'
export const mixinsPublishForm = {
  data() {
    return {
      agFlag: false, // 选择账号分组
      amFlag: false, // 选择记忆项
      radio: 1, // 记忆项默认值
      groupList: [], // 账号分组
      accountList: [], // 分组账号详情
      activeIndex: 0,
      merchantToken: '', // 商户token
      publishForm: { // 一键设置信息。。
        title: '',
        cover: '',
        intro: '',
        topic: [],
        address: '',
        openScope: 0,
        publishTimed: {
          type: 0,
          value: ''
        }
      },
      channel: {
        id: '', // 当前选中的渠道id
        iconList: [],
        accountData: '', // 当前选中渠道选中的账号信息,
        errList: [], // 所有的错误信息
        isUpdateIndex: 0
      },
      video: {
        data: {}, // 视频信息
        filePathOrUrl: '' // 视频下载到本地后的地址
      },
      publishChannelData: {
        list: [], // 账号信息结合
        activeData: {}, // 当前激活的账号的信息
        finishData: {} // 完成视频信息保存后返回的数据
      }
    }
  },
  provide() {
    return {
      publishForm: this.publishForm,
      video: this.video,
      channel: this.channel,
      publishChannelData: this.publishChannelData,
      getMerchantToken: () => this.merchantToken,
      updatePublishForm: (data) => {
        this.updataPublishForm(data)
      },
      updataErrList: (data, name) => {
        console.log('触发了updataErrList')
        this.updataErrList(data, name)
      },
      updatePublishTitle: title => {
        this.updatePublishTitle(title)
      },
      updatePublishCover: src => {
        this.updatePublishCover(src)
      },
      updatePublishIntro: text => {
        this.updatePublishIntro(text)
      },
      updatePublishTopic: list => {
        this.updatePublishTopic(list)
      },
      updatePublishOpenScope: type => {
        this.updatePublishOpenScope(type)
      },
      updatePublishTimed: data => {
        this.updatePublishTimed(data)
      },
      updateCurrentChannelId: id => {
        this.updateCurrentChannelId(id)
      },
      updateVideoData: data => {
        this.updateVideoData(data)
      },
      updatePublishChanelData: list => {
        this.updatePublishChanelData(list)
      },
      deletePublishChanelData: list => {
        this.deletePublishChanelData(list)
      },
      updataPublishActiveData: (id, change, data) => {
        this.updataPublishActiveData(id, change, data)
      },
      updataPublishAllList: (change, data) => {
        this.updataPublishAllList(change, data)
      },
      updateActivePublishData: id => {
        this.updateActivePublishData(id)
      },
      clearActivePublishData: () => {
        this.clearActivePublishData()
      },
      updateFinishVideoData: data => {
        this.updateFinishVideoData(data)
      },
      updateChannelIconList: list => {
        this.updateChannelIconList(list)
      },
      updateVideoFilePathOrUrl: url => {
        this.updateVideoFilePathOrUrl(url)
      },
      updateChannelAccountData: data => {
        this.updateChannelAccountData(data)
      },
      resetPublishChanelData: list => {
        this.resetPublishChanelData(list)
      },
      alginLoginClient: data => {
        this.alginLoginClient(data)
      },
      recordAccount: () => {
        this.recordAccount()
      },
      updateInitErrorList: list => {
        this.updateInitErrorList(list)
      }
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch'])
  },
  methods: {
    // 更新错误信息 接受参数为一个对象{platformId:'渠道id',accountError:'账号是否过期',contentError:'内容是否没有填写'}
    updataErrList(data, name) {
      console.log(data, '触发了updataErrList')
      this.channel.isUpdateIndex++
      const errList = this.channel.errList
      errList.forEach((item, index) => {
        if (data.platformId === item.platformId) {
          const params = { ...item, ...data }
          const { accountError, contentError } = params
          this.$set(this.channel.errList[index], 'accountError', accountError)
          this.$set(this.channel.errList[index], 'contentError', contentError)
          if (params.isValidTerritory || params.isValidTags) {
            this.$set(this.channel.errList[index], 'contentError', true)
          }
        }
      })
    },
    updateInitErrorList(list) {
      this.channel.errList = list
    },
    updataPublishForm(data) {
      console.log(data, '一键设置配置')
      // this.publishForm = data
      this.$nextTick(() => {
        this.publishForm.title = data?.title || ''
        this.publishForm.cover = data?.cover || ''
        this.publishForm.intro = data?.intro || ''
        this.publishForm.topic = data?.topic || []
        this.publishForm.openScope = data?.openScope || 0
        this.publishForm.publishTimed = data?.publishTimed || { type: 1, value: 0 }
      })
    },
    updatePublishTitle(title) {
      this.publishForm.title = title
      const list = this.publishChannelData.list
      list.forEach(item => {
        item.title = title
      })
    },
    updatePublishCover(src) {
      this.publishForm.cover = src
      const list = this.publishChannelData.list
      list.forEach(item => {
        item.cover = src
      })
    },
    updatePublishIntro(text) {
      this.publishForm.intro = text
      const list = this.publishChannelData.list
      list.forEach(item => {
        item.intro = text
      })
    },
    updatePublishTopic(list) {
      const newList = [...list]
      this.publishForm.topic = newList
      const _list = [...this.publishChannelData.list]
      _list.map(item => {
        item.topic = [...newList]
      })
    },
    updatePublishOpenScope(type) {
      this.publishForm.openScope = type
      const list = this.publishChannelData.list
      list.forEach(item => {
        item.openScope = type
      })
    },
    updatePublishTimed(data) {
      this.publishForm.publishTimed = data
      const list = this.publishChannelData.list
      list.forEach(item => {
        item.publishTimed = data
      })
    },
    updateCurrentChannelId(id) {
      this.channel.id = id
    },
    updateVideoData(data) {
      const obj = { ...data }
      // 有保存过封面就用保存的封面，没有就用视频的封面
      this.video.data = obj
      this.publishForm.title = obj.title
      this.publishForm.intro = obj.title
      this.publishForm.cover = obj.posterUrl
    },
    // 选择账号分组覆盖逻辑
    resetPublishChanelData(list) {
      this.publishChannelData.list = list
      this.recordAccount()
    },
    updatePublishChanelData(list) {
      const newArr = this.publishChannelData.list
      list.map(ele => {
        newArr.push(ele)
      })
      const res = new Map()
      const arr = newArr.filter(
        item =>
          !res.has(item?.account?.accountId) &&
          res.set(item?.account?.accountId, 1)
      )
      this.publishChannelData.list = arr

      setTimeout(() => {
        this.recordAccount()
      }, 100)
    },
    // 更新list的数据 id用户id change改变的参数名 data改变的参数
    updataPublishActiveData(id, change, data) {
      // 修改了详情之后就不读取默认项了
      const newData = JSON.parse(JSON.stringify(data))
      const index = this.publishChannelData.list.findIndex(f => f.account.accountId === String(id))
      this.publishChannelData.list[index][change] = newData
      this.publishChannelData.activeData[change] = data
      localStorage.setItem('videoPublishChannelData', JSON.stringify(this.publishChannelData))
    },
    // 改变lis里面所有的传入属性 用于左边变成改变所有右边默认值
    updataPublishAllList(change, data) {
      const arr = Array.isArray(data) ? [...data] : data
      // 更新所有的list
      this.publishChannelData.list.forEach(item => {
        item[change] = arr
      })
      this.publishChannelData.activeData[change] = data
    },
    deletePublishChanelData(list) {
      this.publishChannelData.list.forEach((item, index) => {
        if (item.account.accountId === list.accountId) {
          this.publishChannelData.list.splice(index, 1)
          this.$set(this.channel.errList[index], 'accountError', false)
        }
      })
      this.recordAccount()
    },
    updateActivePublishData(accountId) {
      const list = this.publishChannelData.list
      list.forEach(item => {
        if (item.account.accountId === accountId) {
          // 是否修改了详情中的某项，修改了取当前的修改项，没有修改，同步公共信息
          this.publishChannelData.activeData = item
        }
      })
    },
    // 清空选择对象 在切换渠道时调用
    clearActivePublishData() {
      this.publishChannelData.activeData = []
    },
    // 记录保存记忆项
    async recordAccount() {
      const arr = []
      this.publishChannelData.list.map(ele => {
        console.log(ele, '记忆项')
        const obj = Object.assign({}, ele)
        // b站额外多存一个分类参数
        if (ele.account.platformId === 15) {
          arr.push({
            accountId: ele.account.accountId,
            platformId: ele.account.platformId,
            content: JSON.stringify({ ...bilibiliTemplateData, ...{ account: obj.account, classifyList: obj.classifyList, title: obj.title, intro: obj.intro, cover: obj.cover } })
          })
        } else if (ele.account.platformId === 24) {
          // 快手额外多存一个领域参数
          arr.push({
            accountId: ele.account.accountId,
            platformId: ele.account.platformId,
            content: JSON.stringify({ ...kuaishouTemplateData, ...{ account: obj.account, fieldList: obj.fieldList, title: obj.title, intro: obj.intro, cover: obj.cover } })
          })
        } else {
          arr.push({
            accountId: ele.account.accountId,
            platformId: ele.account.platformId
          })
        }
      })
      localStorage.setItem('videoPublishChannelData', JSON.stringify(this.publishChannelData))
      this.$store.dispatch('settings/saveAccounts', arr)
    },
    updateFinishVideoData(data) {
      this.publishChannelData.finishData = data
    },
    updateChannelIconList(list) {
      this.channel.list = list
    },
    updateVideoFilePathOrUrl(url) {
      this.video.filePathOrUrl = url
    },
    updateChannelAccountData(data) {
      this.channel.accountData = data
    },
    // 打开客户端重新登陆，并更新当前账号的状态
    alginLoginClient(data) {
      const params = {
        accountId: data.accountId,
        platformId: data.platformId,
        newVersion: this.allChannelSwitch[data.platformId],
        merchantToken: this.merchantToken
      }
      this.$store.dispatch('videoManage/saveErrorInfo', {
        platformAccountId: data.platformAccountId,
        requestParam: data.cookie,
        planId: data.platformId,
        apiUrl: 'account-login',
        errorInfo: '登录之前的日志记录'
      })
      isUseNewClient(data.platformId, 'account-login', '', '登录自媒体账号').emit('account-login', JSON.stringify(params), async response => {
        const accountLoginRes = JSON.parse(response)
        console.log(accountLoginRes, '重新登录返回信息')
        // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'account-login', platformAccountId: data.platformAccountId, 'remark': '登录自媒体账号' })
        if (accountLoginRes.code === 200) {
          const userInfo = accountLoginRes.data?.userInfo ? JSON.parse(accountLoginRes.data?.userInfo) : null
          const short_id = userInfo?.unique_id || userInfo?.short_id
          this.$store.dispatch('videoManage/saveErrorInfo', {
            platformAccountId: data.platformAccountId,
            requestParam: accountLoginRes.data.cookie,
            planId: data.platformId,
            apiUrl: 'account-login',
            errorInfo: '登录之后的日志记录'
          })
          //  登录返回的信息
          const checkLoginParams = {
            authorId: accountLoginRes.data.authorId,
            platformAccountId: data.platformAccountId
          }
          await checkLogin(checkLoginParams)
          const updateLoginParams = {
            cookie: accountLoginRes.data.cookie,
            loginStatus: 2,
            platformAccountId: data.platformAccountId,
            name: accountLoginRes.data.name,
            avatar: accountLoginRes.data.avatar,
            remark: '登录自媒体账号',
            uniqueId: short_id,
            type: 2
          }
          await updateLoginStatus(updateLoginParams)
          const list = this.publishChannelData.list
          list.forEach(item => {
            if (item.account.accountId === data.accountId) {
              item.cookie = accountLoginRes.data.cookie
              item.status = 1
              this.publishChannelData.activeData.account.status = 1
            }
          })
          this.$store.dispatch('videoManage/syncAccountData', data.platformAccountId)
        }
      })
    }
  }
}
