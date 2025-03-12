<template>
  <div id="app">
    <!-- <chromeMessage /> -->
    <app-agreement />
    <Watermark v-if="showWatermark" v-bind="{ ...form }" />
    <keep-alive v-if="keepAlive">
      <router-view />
    </keep-alive>
    <router-view v-if="!keepAlive" />

    <ai-helper />
    <!-- 外呼业务组件 -->
    <callPhone />
  </div>
</template>

<script>
// import chromeMessage from '@/components/chromeMessage/index'
import appAgreement from '@/components/AppAgreement/index'
import AiHelper from '@/components/AIHelper/index.vue'
import callPhone from '@/views/privateArea/toolbox/outboundSeats/component/callPhone.vue'
import Watermark from '@/components/watermark'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    appAgreement,
    AiHelper,
    Watermark,
    callPhone
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      form: {
        content: ['伏羲云系统'],
        gap: [60, 60],
        offset: [100, 100],
        width: 200,
        height: 50,
        font: {
          fontSize: 16,
          fontFamily: 'sans-serif',
          fontStyle: 'normal',
          fontWeight: 'normal',
          color: 'rgba(0, 0, 0, 0.15)'
        },
        rotate: 25,
        zIndex: 9,
        image: '',
        clockwise: false,
        opacity: 0.3
      },
      showWatermark: true, // 水印白名单
      connectedTimer: null,
      keepAlive: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    userInfo: {
      handler(val) {
        let str = ''
        if (val?.nickName) {
          str += val.nickName + ' '
        }
        if (val?.phoneNumber) {
          str += val.phoneNumber.slice(-4)
        }
        this.form.content = [str]
      },
      deep: true,
      immediate: true
    },
    $route: {
      handler(val, oldval) {
        this.showWatermark = !['/videoEditor'].includes(val.path)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // 进来重复加载一次，阻止ai弹框浏览器返回退出浏览器
    window.history.pushState(null, null, window.location.href)
    // eslint-disable-next-line no-undef
    const newSocket = io('ws://localhost:10154', {
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000
    })
    this.keepAlive = this.$route.meta.keepAlive
    window['videoPublishNewSocket'] = newSocket
    window.videoPublishNewSocket.on('reconnect_attempt', attemptNumber => {
      console.log(attemptNumber, 'attemptNumber重连次数')
      if (attemptNumber <= 5) {
        window.videoPublishNewSocket.opts.reconnectionDelay = 5000
      } else {
        window.videoPublishNewSocket.opts.reconnectionDelay = 10000
      }
    })
    window.videoPublishNewSocket.on('connect', () => {
      if (newSocket.connected) {
        console.log('已连接新的客户端。。。。')
        this.$store.commit('user/SET_UPDATENEWSOCKETVIDEOPUBLISH', true)
        this.$store.dispatch('user/getMediaAccountNew')
        this.$store.dispatch('videoManage/getClientVersion')
        this.connectedTimer = setInterval(() => {
          this.$store.dispatch('user/getMediaAccountNew')
        }, 1000 * 60 * 3)
      }
    })
    window.videoPublishNewSocket.on('disconnect', () => {
      console.log('已断开自己的客户端。。。。')
      this.$store.commit('user/SET_UPDATENEWSOCKETVIDEOPUBLISH', false)
      clearInterval(this.connectedTimer)
      this.connectedTimer = null
    })
    window.videoPublishNewSocket.on('reconnect', () => {
      this.$store.commit('user/SET_UPDATENEWSOCKETVIDEOPUBLISH', true)
      console.log('重连。。。。')
    })
    window.videoPublishNewSocket.on('error', error => {
      console.log('连接错误。。。。', error)
    })
  },
  mounted() {
    // this.$message(
    //   {
    //     type: 'error',
    //     message: '检测到你当前使用的不是Chrome浏览器，可能存在系统不兼容等问题，请下载Chrome浏览器使用伏羲云系统！',
    //     duration: 0
    //   }
    // )
  },
  methods: {
    ...mapActions('user', ['setHistory']),
    reload() {
      this.keepAlive = false
      this.$nextTick(() => {
        this.keepAlive = true
      })
    }
  }
}
</script>
<style lang="scss">
::v-deep {
  .happy-scroll-container {
    width: 100% !important;
    height: 100% !important;
    .happy-scroll-content {
      width: 100%;
      height: calc(100% - 4px);
      border-right: 0px solid transparent !important;
      border-bottom: 0px solid transparent !important;
    }
  }
}
</style>
