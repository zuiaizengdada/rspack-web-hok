<template>
  <!-- 直播间 -->
  <div class="liveRoom" @contextmenu.prevent.stop>
    <div class="liveRoomHeader"><p0 /></div>
    <div class="liveRoomContent">
      <div class="p1">
        <p1 @chatClick="chatClick" @liveRoomClick="liveRoomClick" />
      </div>
      <div class="p2">
        <p2 ref="p2Content" @dblclick="onhandleDblclick" />
        <p4 v-if="chatUser.type !== 2" ref="p4Content" />
      </div>
      <div class="p3"><p3 /></div>
    </div>
  </div>
</template>

<script>
import p0 from './components/p0'
import p1 from './components/p1'
import p2 from './components/p2'
import p3 from './components/p3'
import p4 from './components/p4'
import { mapGetters, mapState } from 'vuex'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import { liveOperationType } from '@/views/live/columns.js'
import { getUserAli } from '@/api/liveRoom/im.js'

export default {
  components: {
    p0,
    p1,
    p2,
    p3,
    p4
  },
  data() {
    return {
      timer: null,
      timer2: null,
      p2show: false,
      groupId: '',
      enterLiveRoom: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      liveGroupDetail: state => state.im.liveGroupDetail,
      memberQueryType: state => state.im.memberQueryType,
      chatUser: state => state.im.chatUser
    })
  },
  watch: {
    memberQueryType: {
      handler(val) {
        console.log('memberQueryType改变', val)
        if (val === 1) {
          clearInterval(this.timer2)
          this.liveGroupDetail.groupID && this.$store.dispatch('im/getLeftList', { groupId: this.liveGroupDetail.groupID, memberQueryType: val })
          this.timer2 = setInterval(() => {
            this.liveGroupDetail.groupID &&
              this.$store.dispatch('im/getLeftList', { groupId: this.liveGroupDetail.groupID, memberQueryType: val })
          }, 10000)
        } else {
          clearInterval(this.timer2)
        }
      }
    }
  },
  provide() {
    return {
      chatClick: data => this.chatClick(data),
      liveRoomClick: data => this.liveRoomClick(data),
      onhandleDblclick: data => this.onhandleDblclick(data)
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
    this.timer2 && clearInterval(this.timer2)
    // 离开直播间
    this.$store
      .dispatch('im/leaveLiveRoom', this.liveGroupDetail.groupId)
      .then(() => {
        this.$store.dispatch('im/imLoginOut')
      })
  },
  mounted() {
    this.$store.dispatch('im/getLiveRoomAmuse', this.$route.params.id)
    console.log(this.$route.params.id, '直播间ID123123123')
    // 埋点
    const params = {
      liveRoomId: this.$route.params.id,
      operationType: liveOperationType.type102
    }
    this.$store.dispatch('im/operationLogsWrite', params)
    // 监听浏览器关闭事件
    // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    // window.addEventListener('unload', e => this.unloadHandler(e))
    this.$nextTick(() => {
      this.canEnterLiveRoom().then(() => {
        this.init()
      })
    })
  },
  created() {
    console.log('userInfo', this.userInfo)
  },
  methods: {
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    // 先获取直播间详情，然后通过直播间id获取直播群详情并初始化直播群
    init() {
      this.$store.commit('im/SET_imUserInfo', {
        key: 'userId',
        data: this.userInfo.userId
      })
      this.$store.commit('im/set_ifCanScrollBottom', true)
      this.$store.dispatch('im/getLiveSensitiveSetting')
      this.$store
        .dispatch('im/getLiveRoomDetail', this.$route.params.id)
        .then(res => {
          console.log(res.data, '数据详情')
          // 判断用户有无权限，无权限返回到无权限页面
          if (!this.canShowGotoLiveRoom(res.data)) {
            return this.$router.replace('/401')
          }

          if ([1, 2, 3].includes(res.data.status)) {
            // 开播
            if (res.data.liveModel === 'PERSON_LIVE') {
              this.$store.commit(
                'im/set_videoUrl',
                this.getUrl(
                  JSON.parse(res.data.liveRoomPersonInfo.broadcastInfo).auto
                ).webRtc
              )
            } else if (res.data.liveModel === 'AI_LIVE') {
              this.$store.commit(
                'im/set_videoUrl',
                this.getUrl(
                  JSON.parse(res.data.liveRoomIntelligentInfo.broadcastInfo)
                    .auto
                ).webRtc
              )
            }
            this.$store.commit('im/set_pushFlowSwitch', 1)
          } else if (res.data.status === 9) {
            // 结束
            this.$store.commit('im/set_videoUrl', '')
            this.$store.commit('im/set_pushFlowSwitch', 0)
          }
          // 获取左侧聊天列表数据
          if (!res.data.groupId) {
            return this.$message.error('缺少groupId')
          }

          // this.$store.dispatch('im/getLeftList', { groupId: res.data.groupId, memberQueryType: 1 })
          // 初始化直播间
          this.$store.dispatch('im/imInit', this.userInfo.userId).then(() => {
            // this.$store.commit('im/SET_messageData_unshift', {

            // })
            this.$store
              .dispatch('im/getGroupById', res.data.groupId)
              .then(() => {
                return this.$store.dispatch('im/joinGroup', res.data.groupId)
              })
              .then(() => {
                // 更新用户资料
                getUserAli().then(res => {
                  console.log(res, 'res++++++++++++++')
                  this.$store.dispatch('im/updateMyProfile', {
                    nick:
                      res.data.liveRoomAlias ||
                      this.userInfo.nickName ||
                      this.userInfo.userName,
                    avatar: res.data.headImgUrl || ''
                  })
                  this.$store.commit('im/SET_imUserInfo', {
                    key: 'headImgUrl',
                    data: res.data.headImgUrl || ''
                  })
                })
                this.$store.commit('im/SET_chatUser', {
                  type: 2,
                  userId: res.data.groupId,
                  userName: '公共聊天室',
                  conversationID: `GROUP${res.data.groupId}`
                })
                // this.$store.dispatch('im/setGroupMemberNameCard', { groupId: res.data.groupId, userId: this.userInfo.userId, nameCard: 'admin' })
              })
              .then(() => {
                this.$store.dispatch('im/getGroupScript', this.$route.params.id)
                this.$store.dispatch('im/getGroupOnlineMemberCount')
                this.timer = setInterval(() => {
                  this.$store.dispatch('im/getGroupOnlineMemberCount')
                }, 5000)

                // this.$store.dispatch('im/getLeftList', { groupId: res.data.groupId, memberQueryType: 1 })
                this.$store.dispatch('im/getOnlineStudentList')
                this.$store.dispatch('im/getmymemberoffline')
                this.$store.dispatch('im/normalmemberoffline')

                // this.$store.dispatch('im/getLeftList', { groupId: res.data.groupId, memberQueryType: 1 })

                this.timer2 = setInterval(() => {
                  // this.$store.dispatch('im/getLeftList', { groupId: res.data.groupId, memberQueryType: 1 })
                  this.$store.dispatch('im/getOnlineStudentList')
                  this.$store.dispatch('im/getmymemberoffline')
                }, 10000)

                this.$store.dispatch('im/tsignalingInit')
                // 获取直播间历史记录
                this.$store.dispatch('im/getChatRecordPage')
              })
          })
        })
    },
    // 单人聊天点击触发
    chatClick({ item, message, type = 1 }) {
      this.$store.dispatch('im/CloseReply')
      const conversationID = 'C2C' + item.memberId
      this.$store.commit('im/SET_chatUser', {
        type: type,
        userId: item.memberId || message.from,
        userName: item.traineeRemark || item.memberName,
        conversationID: conversationID
      })
      this.$store.commit('im/SET_messageData', [])
      this.$store.commit('im/set_ifScrollBottom', true)
      this.$store.commit('im/set_ifCanScrollBottom', true)
      if (message && (item.memberId || message.from)) {
        this.$store.dispatch('im/getMessageList', conversationID).then(res => {
          this.$nextTick(() => {
            this.$refs.p4Content && this.$refs.p4Content.scrollBottom()
            this.$refs.p2Content && this.$refs.p2Content.clearMsg()
            this.$refs.p4Content && this.$refs.p4Content.clearMsg()
          })
        })
      }
    },
    // 直播间点击触发
    liveRoomClick(item) {
      this.$store.dispatch('im/CloseReply')
      this.$store.commit('im/set_ifScrollBottom', false)
      this.$store.commit('im/set_ifCanScrollBottom', true)
      // this.$store.commit('im/SET_messageData', [])
      this.$store.commit('im/SET_chatUser', {
        type: 2,
        userId: this.liveGroupDetail.groupID,
        userName: '公共聊天室',
        conversationID: item.conversationID
      })
      // this.$store.commit('im/SET_messageData', JSON.parse(JSON.stringify(this.$store.state.im.groupMessageData)))
      this.$refs.p2Content && this.$refs.p2Content.clearMsg()
    },
    onhandleDblclick({ item, message }) {
      console.log(item, message)
      if (this.$store.state.im.chatUser.type === 1) {
        return
      }
      this.chatClick({ item: item, message: message, type: 1 })
    },
    beforeunloadHandler(e) {
      // debugger
      e = e || window.event
      if (e) {
        e.returnValue = '确定退出直播间?'
      }
      // debugger
      return '确定退出直播间?'
    },
    unloadHandler() {
      clearInterval(this.timer)
      // 离开直播间
      this.$store
        .dispatch('im/leaveLiveRoom', this.liveGroupDetail.groupID)
        .then(() => {
          this.$store.dispatch('im/imLoginOut')
        })
    },
    // 获取播放地址
    // 拼接规则
    // 地址组成 播放域名 + AppName + StreamName + 鉴权信息
    // RTMP rtmp:// dev.live.jokkj.cn / AppName / StreamName ? txSecret= xxx &txTime= xxx
    // Flv  http(s):// dev.live.jokkj.cn / AppName / StreamName .flv? txSecret= xxx &txTime= xxx
    // Hls  http(s):// dev.live.jokkj.cn / AppName / StreamName .m3u8? txSecret= xxx &txTime= xxx
    // WebRtc webtrc:// dev.live.jokkj.cn / AppName / StreamName ? txSecret= xxx &txTime= xxx
    getUrl({
      appName = '',
      streamName = '',
      txSecret = '',
      txTime = '',
      url = ''
    }) {
      console.log(url, 'url')
      return {
        RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
      }
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teacherInfoList || row.teacherInfoList.length === 0) {
        return false
      }
      const obj = row.teacherInfoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.liveRoom {
  width: 100vw;
  height: 100vh;
  min-width: 1380px;
  min-height: 500px;
  overflow: hidden;
  .liveRoomHeader {
    height: 68px;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  .liveRoomContent {
    height: calc(100% - 69px);
    display: flex;
    .p1 {
      width: 340px;
      border-right: 1px solid #ccc;
    }
    .p2 {
      flex: 1 0 0;
      overflow: auto;
      position: relative;
    }
    .p3 {
      width: 368px;
      border-left: 1px solid #ccc;
    }
    .p4 {
    }
  }
}
</style>
