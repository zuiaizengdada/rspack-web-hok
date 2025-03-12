<template>
  <div class="liveRoom black-select">
    <div class="liveRoomBg" />
    <div class="liveRoomHeader" :class="{ fixHeader: pageWrapScroll }">
      <p0 />
    </div>
    <div class="liveRoomContent">
      <div class="screenMain screen1">
        <div class="screen1_second screen_left" @contextmenu.prevent.stop>
          <p1 @onGrounpClick="liveRoomClick" />
        </div>
        <div
          v-if="liveRoomDetail.displayMode === 1"
          class="screen1_second screen_center"
          style="overflow: hidden"
        >
          <splitPane
            direction="column"
            :min="5"
            :max="95"
            :trigger-length="1"
            :pane-length-percent.sync="paneLengthPercent"
            :append-to-body="true"
          >
            <template v-slot:one>
              <div class="screen_center_video"><p2 /></div>
            </template>
            <template v-slot:two>
              <div class="screen_center_chat" @contextmenu.prevent.stop>
                <p3 />
              </div>
            </template>
          </splitPane>
        </div>
        <div
          v-else-if="liveRoomDetail.displayMode === 2"
          class="screen1_second screen_center screen_center_v2"
        >
          <p7 />
        </div>
        <div v-else class="screen1_second screen_center">
          <MLoading :visible="!liveRoomDetail.displayMode" />
        </div>
        <div class="screen1_second screen_right">
          <splitPane
            direction="column"
            :min="5"
            :max="95"
            :trigger-length="1"
            :pane-length-percent.sync="paneLengthPercent1"
            :append-to-body="true"
          >
            <template v-slot:one>
              <div style="height: 100%;">
                <p4 />
              </div>
            </template>
            <template v-slot:two>
              <div style="height: 100%;" @contextmenu.prevent.stop>
                <p5 />
              </div>
            </template>
          </splitPane>
        </div>
      </div>
      <div v-if="isP6" class="screenMain screen2">
        <div class="screen2_p6">
          <div ref="screen2_p6_hidden" class="screen2_p6_hidden">
            用来判断P6区域是否再视图内
          </div>
          <p6 />
        </div>
      </div>
    </div>
    <div
      v-if="isP6"
      v-show="showScreen2Btn"
      class="showScreen2"
      @click="onHandleScrollPage"
    >
      <img
        class="showScreen2Icon"
        src="~@/assets/image/liveRoom/click_more_icon.png"
        alt=""
      />
      <span>点击更多数据</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import p0 from './p0'
import p1 from './p1'
import p2 from './p2'
import p3 from './p3'
import p4 from './p4'
import p5 from './p5'
import p6 from './p6'
import p7 from './p7'
import splitPane from './components/splitPane/index.vue'
import { mapGetters, mapState } from 'vuex'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import { liveOperationType } from '@/views/live/columns.js'
import { getUserAli } from '@/api/liveRoom/im.js'
import { debounce } from '@/utils'
import { liveRoomMenuOpts } from './p6/data.js'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import {
  getPersonSetUpRecord,
  queryEmployeeType
} from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    p0,
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    splitPane
  },
  data() {
    return {
      loading: false,
      paneLengthPercent: 35,
      paneLengthPercent1: 45,
      timer: null,
      timer2: null,
      p2show: false,
      groupId: '',
      enterLiveRoom: false,
      toolBar: [
        {
          key: 'liveToolAnnouncement',
          label: '公告',
          toolFn: 'onhandleAnnouncement',
          icon: 'liveToolAnnouncement',
          show: row => {
            return true
          }
        },
        {
          key: 'liveToolReservation',
          label: '预约下一场',
          toolFn: 'onhandleOpenNextLive',
          icon: 'liveToolReservation',
          show: row => {
            return true
          }
        },
        {
          key: 'liveToolPurchaseRecord',
          label: '购买记录',
          type: 'purchaseRecord',
          toolFn: 'onhandlePurchaseRecord',
          show: row => {
            return true
          }
        },
        {
          key: 'liveToolSign',
          label: '签到',
          toolFn: 'onhandleOpenSign',
          icon: 'liveToolSign',
          show: row => {
            return true
          }
        },
        {
          key: 'liveToolLottery',
          label: '抽奖',
          toolFn: 'onhandleOpenLottery',
          icon: 'liveToolLottery',
          show: row => {
            return true
          }
        },
        // { key: 'liveToolLianmaiRecord', label: '连麦记录', toolFn: 'onhandleOpenLianmaiRecord', icon: 'liveToolMicrophone', show: (row) => { return true }, tips: '' },
        {
          key: 'liveToolDesensitization',
          label: '敏感词',
          toolFn: 'onhandleDesensitization',
          icon: 'liveToolDesensitization',
          show: () => {
            return true
          }
        },
        {
          key: 'liveToolPopularity',
          label: '加热人气',
          toolFn: 'heatPopularity',
          icon: 'liveToolPopularity',
          show: row => {
            return this.liveRoomDetail.heatButton
          },
          tips: '当直播间开启加热后，系统将自动在我们平台的终端上展示对应的直播间广告，直播间将根据加热时长进行定时推广 ，实际加热效果受到直播间内容质量、投放时间等因素影响，预计提升观众数和下单数仅供参考，不作为加热效果的保证。'
        },
        {
          key: 'liveToolCoupon',
          label: '加热领券',
          toolFn: 'heatingCollar',
          icon: 'liveToolCoupon',
          show: row => {
            return this.liveRoomDetail.heatButton
          },
          tips: '当直播间开启加热后，系统将自动在我们平台的终端上展示对应的直播间广告，直播间将根据加热时长进行定时推广 ，实际加热效果受到直播间内容质量、投放时间等因素影响，预计提升观众数和下单数仅供参考，不作为加热效果的保证。'
        },
        {
          key: 'liveToolPlaceOrder',
          label: '加热下单',
          toolFn: 'heatingOrder',
          icon: 'liveToolPlaceOrder',
          show: row => {
            return this.liveRoomDetail.heatButton
          },
          tips: '当直播间开启加热后，系统将自动在我们平台的终端上展示对应的直播间广告，直播间将根据加热时长进行定时推广 ，实际加热效果受到直播间内容质量、投放时间等因素影响，预计提升观众数和下单数仅供参考，不作为加热效果的保证。'
        }
      ],
      // 直播间工具栏
      liveToolBar: [],
      // 营销工具栏
      marketingToolbar: [],
      isHead: false, // 当前登录人是否为负责人
      $_resizeHandler: null, // 页面尺寸变化回调函数
      pageWrapHeight: '100vh', // 直播间页面的高度
      pageWrapScroll: false, // 页面是否滚动
      showScreen2Btn: true, // 是否显示点击更多按钮
      isP6: true, // 是否显示p6取悦
      permsList: Vue.observable([]) // 权限合集
    }
  },
  provide() {
    return {
      chatClick: data => this.chatClick(data),
      liveRoomClick: data => this.liveRoomClick(data),
      onhandleDblclick: data => this.onhandleDblclick(data),
      getLiveToolBar: () => this.getLiveToolBar(),
      getMarketingToolbar: () => this.getMarketingToolbar(),
      setLiveToolBar: res => this.setLiveToolBar(res),
      setMarketingToolbar: res => this.setMarketingToolbar(res),
      openUserInfo: res => this.openUserInfo(res),
      isHead: res => this.getIsHead(),
      permsList: this.permsList
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail,
      liveGroupDetail: state => state.im.liveGroupDetail,
      memberQueryType: state => state.im.memberQueryType,
      chatUser: state => state.im.chatUser
    })
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
    this.timer2 && clearInterval(this.timer2)
  },
  mounted() {
    this.initPermsList()
    queryEmployeeType().then(res => {
      console.log(res, '获取当前登录人是否为负责人的状态res1-负责人 2-小伙伴')
      this.isHead = res.data === 1
    })
    // console.log('this.liveRoomDetail.heatButton', this.liveRoomDetail.heatButton)
    this.pageInit()
    this.getLiveRoomSetting()
    this.$store.dispatch('im/getLiveRoomAmuse', this.$route.params.id)
    // 埋点
    const params = {
      liveRoomId: this.$route.params.id,
      operationType: liveOperationType.type102
    }
    this.$store.dispatch('im/operationLogsWrite', params)
    this.$nextTick(() => {
      this.canEnterLiveRoom().then(() => {
        this.init()
      })
    })
    this.$_resizeHandler = debounce(() => {
      this.pageInit()
    }, 100)
    this.$_initResizeEvent()
    this.$_initScrollEvent()
  },
  methods: {
    // 获取中控台 配置权限
    initPermsList(key) {
      const obj = this.permission_routes.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoomV2')
        if (o) {
          this.permsList.push(...(o.meta.permsList || []))
        }
      }

      const baseArr = liveRoomMenuOpts()
      this.isP6 = baseArr.some(s => this.permsList.includes(s.perms))
    },
    getPermsList() {
      return this.permsList
    },
    getIsHead() {
      return this.isHead
    },
    // 获取直播间的初始设置项
    getLiveRoomSetting() {
      this.getPersonSetUpRecord('LIVE_ROOM_MARKETING_TOOLS_TAB')
      this.getPersonSetUpRecord('LIVE_ROOM_ATTENDANCE_RATE_SELECTOR')
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 注册页面滚动监听
    $_initScrollEvent() {
      const _this = this
      window.onscroll = function () {
        var scrollDistance =
          document.documentElement.scrollTop || document.body.scrollTop
        _this.pageWrapScroll = scrollDistance > 0
        _this.showScreen2Btn = !_this.isInViewport(
          _this.$refs.screen2_p6_hidden
        )
      }
    },
    // 获取页面基本属性
    pageInit() {
      // 获取屏幕高度
      // 获取视口高度
      var screenHeight =
        window.innerHeight || document.documentElement.clientHeight
      console.log('屏幕高度为：' + screenHeight + '像素')
      if (screenHeight >= 1590) {
        this.pageWrapHeight = screenHeight + 'px'
        console.log('不展示拉取按钮')
      } else {
        this.pageWrapHeight = '100vh'
        console.log('展示拉取按钮')
      }
    },
    getLiveToolBar() {
      return this.liveToolBar
    },
    getMarketingToolbar() {
      return this.marketingToolbar
    },
    setLiveToolBar(res) {
      this.liveToolBar = res
    },
    setMarketingToolbar(res) {
      console.log(res)
      this.marketingToolbar = res
    },
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
          // 初始化直播间
          this.$store.dispatch('im/imInit', this.userInfo.userId).then(() => {
            this.$store
              .dispatch('im/getGroupById', res.data.groupId)
              .then(() => {
                return this.$store.dispatch('im/joinGroup', res.data.groupId)
              })
              .then(() => {
                // 更新用户资料
                getUserAli().then(res => {
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
              })
              .then(() => {
                this.$store.dispatch('im/getGroupScript', this.$route.params.id)
                this.$store.dispatch('im/getGroupOnlineMemberCount')
                this.timer = setInterval(() => {
                  this.$store.dispatch('im/getGroupOnlineMemberCount')
                }, 5000)

                this.$store.dispatch('im/getOnlineStudentList')
                this.$store.dispatch('im/getmymemberoffline')
                this.$store.dispatch('im/normalmemberoffline')

                // this.$store.dispatch('im/getLeftListV2', { groupId: res.data.groupId, memberQueryType: 2 })
                this.$store.dispatch('im/tsignalingInit')
                // 获取直播间历史记录
                this.$store.dispatch('im/getChatRecordPage')
              })
              .catch(error => {
                console.log(error, 'error')
              })
          })
        })
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
    },
    getUrl({
      appName = '',
      streamName = '',
      txSecret = '',
      txTime = '',
      url = ''
    }) {
      console.log(url, 'url', process.env.NODE_ENV, 'process.env.NODE_ENV')
      if (process.env.NODE_ENV === 'test') {
        // test环境
        return {
          RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}`
        }
      } else {
        return {
          RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
          webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
        }
      }
    },
    // 单人聊天点击触发
    chatClick({ item, message, type = 1 }) {
      console.log(item)
      console.log(message)
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
      if (!item) {
        return this.$message.error('当前公共聊天室不存在')
      }
      console.log(item, 'item')
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
    // 点击更多数据
    onHandleScrollPage() {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    },
    // 判断是否在视图内
    isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
      )
    },
    // 点击打开用户信息弹框
    openUserInfo(res) {
      console.log(res, 'res')
      Dialog.open({
        type: 'UserInfo',
        visible: true,
        userId: res.memberId,
        liveRoomId: this.$route.params.id
      })
    },
    // 获取用户直播间自定义设置
    // LIVE_ROOM_MARKETING_TOOLS_TAB: 营销工具记忆 LIVE_ROOM_ATTENDANCE_RATE_SELECTOR: 到课率切换记忆
    getPersonSetUpRecord(code) {
      const data = {
        code: code
      }
      return getPersonSetUpRecord(data)
        .then(res => {
          console.log('获取用户直播间自定义设置', res)
          if (code === 'LIVE_ROOM_MARKETING_TOOLS_TAB') {
            const liveToolBar = []
            const marketingToolbar = []
            // 营销工具

            const mockData = JSON.parse(res.data)
            console.log(mockData, 'mockData')
            mockData.liveToolBar.map(v => {
              const obj = this.toolBar.find(e => e.key === v)
              obj && liveToolBar.push(obj)
            })

            mockData.marketingToolbar.map(v => {
              const obj = this.toolBar.find(e => e.key === v)
              obj && marketingToolbar.push(obj)
            })

            this.liveToolBar = liveToolBar
            this.marketingToolbar = marketingToolbar
          } else if (code === 'LIVE_ROOM_ATTENDANCE_RATE_SELECTOR') {
            // 到课率
            const mockData = JSON.parse(res.data)
            // this.attendanceRateSetting = mockData
            this.$store.commit('im/SET_attendanceRateSetting', mockData)
          }
        })
        .catch(err => {
          console.log(err, 'errrrrr')
          if (code === 'LIVE_ROOM_MARKETING_TOOLS_TAB') {
            const liveToolBar = []
            const marketingToolbar = []
            // 营销工具
            const mockData = {
              liveToolBar: [
                'liveToolAnnouncement',
                'liveToolReservation',
                'liveToolPurchaseRecord',
                'liveToolSign',
                'liveToolLottery',
                'liveToolDesensitization'
              ],
              marketingToolbar: [
                'liveToolPopularity',
                'liveToolCoupon',
                'liveToolPlaceOrder'
              ]
            }

            mockData.liveToolBar.map(v => {
              const obj = this.toolBar.find(e => e.key === v)
              obj && liveToolBar.push(obj)
            })

            mockData.marketingToolbar.map(v => {
              const obj = this.toolBar.find(e => e.key === v)
              obj && marketingToolbar.push(obj)
            })

            this.liveToolBar = liveToolBar
            this.marketingToolbar = marketingToolbar
          } else if (code === 'LIVE_ROOM_ATTENDANCE_RATE_SELECTOR') {
            // 到课率
            const mockData = 2
            // this.attendanceRateSetting = mockData
            this.$store.commit('im/SET_attendanceRateSetting', mockData)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.liveRoom {
  min-width: 1280px;
  min-height: 744px;
  background: linear-gradient(0deg, #f4f6f9 65.79%, #e5f0ff 100%);
  position: relative;
  .liveRoomBg {
    position: absolute;
    width: 369px;
    height: 290px;
    background-image: url(~@/assets/image/liveRoom/liveRoomBg.png);
    background-repeat: no-repeat;
    background-size: 450px 250px;
    transform: translate(-34px, -115px);
  }
  .liveRoomHeader {
    position: relative;
    height: 53px;
    z-index: 2;
  }
  .fixHeader {
    position: sticky;
    top: 0;
    background: #fff;
    box-shadow: 0 4px 4px 0 #0000000d;
    z-index: 10;
  }
  .liveRoomContent {
    padding: 0 10px 10px;
    .screen1 {
      height: calc(100vh - 63px);
      min-height: 671px;
      max-height: 850px;
      display: flex;
      gap: 11px;
      .screen1_second {
        height: 100%;
        position: relative;
      }
      .screen_left {
        width: 24%;
        max-width: 450px;
        min-width: 312px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #dcdee1;
      }
      .screen_center {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 1px solid #dcdee1;
        border-radius: 10px;
        // overflow: hidden;
        background: #fff;
        .screen_center_video {
          height: 100%;
        }
        .screen_center_chat {
          height: 100%;
        }
      }
      .screen_center_v2 {
        background: transparent;
        border: none;
        border-radius: 0;
      }
      .screen_right {
        width: 28%;
        min-width: 526px;
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        border: 1px solid #dcdee1;
        border-radius: 10px;
        overflow: hidden;
      }
    }
    .screen2 {
      height: 636px;
      flex-shrink: 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #dcdee1;
      background: #fff;
      position: relative;
      margin-top: 10px;
      .screen2_p6 {
        width: 100%;
        height: 100%;
        padding-top: 15px;
        .screen2_p6_hidden {
          opacity: 0;
          height: 0;
        }
      }
    }
    .screenMain + .screenMain {
      margin-top: 10px;
    }
  }
}
.showScreen2 {
  cursor: pointer;
  position: fixed;
  bottom: 0px;
  left: 50%;
  width: 163px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 10px 10px 0 0;
  border: 1px solid #0c6fff;
  border-bottom: 0;
  background: linear-gradient(0deg, #fff 50%, #eff5ff 100%);
  box-shadow: 0 -4px 10px 0 #0000000d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transform: translateX(-50%);
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 12px;
  .showScreen2Icon {
    width: 20px;
    height: 20px;
    margin-right: 13px;
  }
}
@media screen and (min-height: 937px) {
  .showScreen2 {
    display: none !important;
  }
}
::v-deep {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #0c6fff;
    background: #fff;
    &.el-radio__inner::after {
      background: #0c6fff;
      height: 7px;
      width: 7px;
    }
  }
  .el-radio__label {
    padding-left: 5px;
  }
}
</style>
