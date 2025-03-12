import { mapGetters } from 'vuex'

export const mixinsAllOperations = {
  watch: {
    'channel.id': {
      handler() {
        if (typeof this.initData === 'function') {
          this.initData()
        } else {
          console.error('initData 方法不存在')
        }
      },
      immediate: true,
      deep: true
    },
    'publishChannelData.activeData': {
      handler(newVal, oldVal) {
        if (typeof this.initData === 'function') {
          this.initData()
        } else {
          console.error('initData 方法不存在')
        }
        this.isInitData = true
        this.activeAccountFail = this.publishChannelData?.activeData?.account?.status === -1
      },
      immediate: true
    },
    'publishChannelData.activeData.account': {
      handler(newVal, oldVal) {
        console.log('账号发生了变化了')
        this.activeAccountFail = newVal?.status === -1
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    merchantToken () {
      return this.getMerchantToken()
    },
    ...mapGetters(['allChannelSwitch'])
  },
  data() {
    return {
      activeAccountFail: false // 账号是否失效
    }
  },
  inject: ['getMerchantToken', 'publishChannelData', 'channel', 'updataPublishActiveData', 'publishForm', 'video', 'alginLoginClient', 'recordAccount'],
  methods: {
    handleClickAlginLogin() {
      const data = this.publishChannelData?.activeData?.account
      this.alginLoginClient(data)
    }
  }
}
