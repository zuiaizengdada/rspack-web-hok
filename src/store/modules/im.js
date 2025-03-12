// im即时通信
import TIM from '@tencentcloud/chat'
import GroupModule from '@tencentcloud/chat/modules/group-module.js'
import SignalingModule from '@tencentcloud/chat/modules/signaling-module.js'
// import TIM from 'tim-js-sdk'
// import TSignaling from 'tsignaling'
import TIMUploadPlugin from 'tim-upload-plugin'
import { Message, Notification } from 'element-ui'
import { getLiveRoomInfo, operationLogsWriteAjax } from '@/api/liveRoom/index.js'
import { sysUserWrite } from '@/api/liveRoom/setting'
import { leftUserList } from '@/api/liveRoom/liveRoom.js'
import {
  getUserSig,
  groupOnlineCount,
  getLeftList,
  markUserColor,
  userTrainee,
  updateUserRemarks,
  getImOperationAccountInfo,
  getGroupScript,
  chatRecordPageAjax,
  groupMsgRecallAjax,
  mymemberoffline,
  normalmemberoffline,
  normalmemberonline,
  mymemberonline,
  teacheronline
} from '@/api/liveRoom/im.js'
import { getLiveRoomAmuse } from '@/api/liveRoom/index.js'
import { getSensitiveSettingsAjax } from '@/api/liveRoom/setting'
import { filtersTextPhone } from '@/utils/index'
import delModal from '@/components/delModal/index'
import liveRoomDialog from '@/views/live/liveRoom/components/Dialog/index'
import axios from 'axios'
// 直播间详情
const LiveRoomDetail = {
  code: '', // 直播间ID
  createTime: '', // 创建时间
  announcement: '', // 直播间公告(文本)
  announcementUrl: '', // 直播间公告(图片)
  createUserName: '', // 创建人
  imgUrl: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg', // 直播封面
  isShow: true, // 是否显示人数 true显示, false不显示
  groupId: '',
  heatButton: false, // 加热按钮展示 false-不展示 true-展示
  liveModel: 'PERSON_LIVE', // 直播模式 PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播
  liveRoomPersonInfo: { // 真人直播信息
    broadcastInfo: {
      appName: '',
      streamName: '',
      txSecret: '',
      txTime: '',
      url: ''
    },
    // broadcastStreamAddr: '', // 播流地址
    // broadcastStreamSecretKey: '', // 播流密匙
    groupId: '', // 直播群Id
    pushInfo: { appName: '', streamName: '', txSecret: '', txTime: '', url: '' },
    pushFlowAddr: '', // 推流地址
    mainScreenCharacters: { // 主屏人物，竖屏才有
      headImgUrl: '',
      inviteCode: '',
      liveRoomAlias: '',
      teacherId: '',
      teacherName: '',
      teacherRole: '',
      teacherTel: ''
    },
    landscapeModel: 1,
    verticalScreenModel: 1, //
    teacherMicStatus: true,
    studentMicStatus: false,
    roundTableStatus: false,
    roundTableMasterId: '',
    pushFlowSecretKey: '' // 推流秘钥
  },
  liveRoomIntelligentInfo: { // 智能直播配置信息
    broadcastInfo: {
      appName: '',
      streamName: '',
      txSecret: '',
      txTime: '',
      url: ''
    },
    isRepeatedViewing: true, // 是否重复观看 0:否 1:是
    pushInfo: {
      appName: '',
      streamName: '',
      txSecret: '',
      txTime: '',
      url: ''
    }, // 推流信息
    scriptInterscriptIdactionId: '', // 互动脚本ID
    videoId: '', // 录制视频ID
    videoTeacherId: '',
    videoTeacherName: ''
  },
  isAllowSendPic: 0, // 是否允许学员发送图片 1允许 0不允许
  isShowNotice: 0, // 是否显示系统消息 1：显示 0:不显示
  showShoppingCart: false, // 是否展示购物车
  showLikeIcon: true, // 是否显示点赞
  isShutUp: 0, // 是否禁言  1: 禁言 0：不禁言
  isVoiceChat: 0, // 是否允许学员连麦 0:不允许 1：允许
  playbackSet: 0, // 回放设置：0无回放，1云端录制
  warmUp: '', // 直播暖场 1-暖场图片 2-暖场视频
  warmUpUrl: '', // 直播暖场文件url
  name: '', // 直播间名称
  realityTeacherUserName: '', // 讲师（真人讲师信息，以，分割）
  startTime: '', // 直播时间
  status: '-1', // 直播状态 0:未开始 1:直播中 2:？？？ 9:直播结束
  teacherInfoList: [], // 讲师列表
  myTraineesOnlineSum: 0, // 我的学员在线人数
  generalTraineesOnlineSum: 0, // 普通学员在线人数
  tabrBitrates: 'hd,Standard,smooth', // 直播自适应码率code
  tabrStartBitrate: 'smooth', // 直播自适应码率默认code
  totalTime: 0, // 总时长
  playEndTime: '', // 结束时间
  playTime: '' // 正在播放的时间
}
// 直播群详情
const LiveGroupDetail = {
  groupID: '', // 直播群Id
  currentOnlineCount: 0, // 实际在线人数
  adjustCount: 0 // 调整后的显示在线人数
}
const state = {
  tim: null,
  tsignaling: null,
  // im基础属性
  imConfig: {
    SDKAppID: '',
    secretKey: '',
    modules: {
      'group-module': GroupModule, // 群和群成员
      'signaling-module': SignalingModule // 信令
    },
    imReady: false // 系统是否初始化成功
  },
  // 用户信息(当前登录人)
  imUserInfo: {
    userId: '', // 当前的用户userId
    nickName: '',
    userSig: '', // 用户通信密码
    ifLogin: false, // 是否登录
    liveRoom: '', // 当前所在直播间
    roleId: '', // 当前角色 0-讲师 1-助教 2-普通学员
    roleName: '',
    deptId: [], // 当前登录人的部门链
    headImgUrl: '' // 头像
  },
  // 当前的聊天对象
  chatUser: {
    type: '', // type为1表示学员私聊，type为2表示公共聊天室，type为3表示老师私聊
    userId: '',
    userName: '',
    conversationID: '' // 会话id，如果没有说明从未聊过，无聊天数据
  },
  // 直播间详情
  liveRoomDetail: JSON.parse(JSON.stringify(LiveRoomDetail)),
  // 直播群详情
  liveGroupDetail: JSON.parse(JSON.stringify(LiveGroupDetail)),
  // 左侧列表数据
  leftList: {
    currentTrainees: [], // 所有学员数据
    onlineTeachers: [], // 在线老师
    myTrainees: [], // 我的学员
    generalTrainees: [], // 普通学员
    onlineMyTrainees: [], // 我的学员在线
    offMyTrainees: [], // 我的学员离线
    onlineGeneralTrainees: [], // 普通学员在线
    offGeneralTrainees: [], // 普通学员离线
    optionMemberOfflineSum: 0, // 离线人数
    optionMemberOnlineSum: 0 // 在线人数
  },
  // 聊天框
  chatView: {
    nextReqMessageID: '', // 下一个请求的messageId
    isCompleted: false, // 消息是否加载完全
    ifCanScrollBottom: true, // 是否能滚动到底部
    ifScorllBottom: false, // 是否触底
    messageData: [], // 私人聊天数据
    groupMessageData: [] // 群消息聊天记录
  },
  // 单人聊天框
  privateChatView: {
    nextReqMessageID: '', // 下一个请求的messageId
    isCompleted: false, // 消息是否加载完全
    ifCanScrollBottom: true, // 是否能滚动到底部
    ifScorllBottom: false, // 是否触底
    messageData: [], // 私人聊天数据
    privateMessageData: [] // 私人聊天记录
  },
  // im会话数据
  conversationList: [],
  // 直播间会话数据(im)
  AVliveRoomConversationList: [],
  memberQueryType: 1,
  // groupMessageData: [], // 群消息聊天记录缓存
  pushFlowSwitch: 0, // 推流切换用来监听，自动触发刷新,1:开始推流 2:推流中断 0:直播结束
  videoUrl: '', // 播放地址
  scriptSetting: { // 脚本数据
    isRelateScript: false, // 是否引用脚本 true是 false否
    delayTime: 0, // 脚本互动延时时间
    scriptInteractStatus: 1 // 脚本互动状态 1正常互动 2暂停互动
  },
  ifReadStudent: Boolean(localStorage.getItem('liveRoom_ifReadStudent')), // 是否查看真实学员发言
  ifAddLiveRoom: false, // 是否是新进入新增直播间页面
  liveSensitiveSetting: {
    filtrationPhoneNum: false, // 过滤手机号
    filtrationType: 1, // 拦截类型
    workToSpeRole: false // 过滤老师、助教
  }, // 敏感词设置
  replySetting: { // 回复
    ifReply: false, // 是否点击了回复
    data: {
      messageFeature: { needTyping: 1, version: 1 },
      messageReply: {
        cloudCustomData: '', // 自定义字段
        messageAbstract: '', // 发送的消息内容
        messageSender: '', // 发送者ID
        messageSenderName: '', // 发送者姓名
        // messageRootID: '', // 根ID
        messageID: '',
        messageType: 1, // 消息类型 1: 文本 3: 图片
        version: 1
      },
      payload: {}
    }
  },
  liveDataThreshold: 200, // 聊天记录阈值
  liveDataThresholdDiscard: 100, // 聊天记录丢弃阈值
  playTime: 0, // 直播间的播放时长
  ifDrawPrizeDrawPrizeId: '', // 开奖的drawPrizeId
  signForm: {
    id: '',
    isStop: false,
    liveRoomId: '',
    signDuration: 0,
    signEndTime: '',
    signGuideWord: '',
    signSendTime: '',
    signType: 1,
    systemTime: '', // 系统时间
    ifSignStart: 0 // 0: 未开始 1: 签到开始 2: 签到结束 3: 签到中
  },
  // 自嗨设置
  selfHiSettings: {
    assistantVisible: true, // 助教可见
    liveRoomId: '',
    teacherVisible: true // 讲师可见
  },
  ifLiveRoomSignId: '', // 当前签到的signId
  popoverCoupon: {
    visible: false
  }, // 直播间推送的优惠劵
  popoverGoods: {
    visible: false
  }, // 直播间推送的商品
  Topping: { // 直播间置顶的消息
    id: '',
    show: false,
    text: '',
    avatar: '',
    nick: '',
    countdownTime: 20
  },
  cmd: {
    enable: false,
    cmd: ''
  },
  attendanceRateSetting: '', // 到课率 1.计划看播用户 2.计划看播用户-退款用户
  activeChangeType: { // 直播间某些状态变更，需要对应的组件去更新对应的状态，获取对应的数据
    flag: true, // 切换标示，每次变更换为另一个状态
    type: '' // HEAT_PEOPLE_STATUS_CHANGE（加热人气状态变更）， COUPON_CHANGE（优惠券变更），GOODS_CHANGE（直播间商品变更），SUBSCRIBE_LIVE_ROOM_CHANGE (预约直播间变更)
  },
  noticeArray: [
    // {
    //   'userId': 1559808297762131969,
    //   'content': '通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容',
    //   orderStatus: 1
    // }
  ], // 购买记录
  cancelToken: axios.CancelToken
}

const mutations = {
  SET_activeChangeType: (state, { flag, type }) => {
    state.activeChangeType = { flag, type }
  },
  SET_attendanceRateSetting: (state, data) => {
    state.attendanceRateSetting = data
  },
  SET_cmd: (state, data) => {
    state.cmd = data
  },
  SET_selfHiSettings: (state, data) => {
    state.selfHiSettings = data
  },
  SET_tim: (state, data) => {
    state.tim = data
  },
  SET_playTime: (state, data) => {
    state.playTime = data
  },
  SET_replySetting: (state, { data, key }) => {
    state.replySetting[key] = data
  },
  SET_ifDrawPrize: (state, data) => {
    state.ifDrawPrizeDrawPrizeId = data
  },
  SET_ifSign: (state, data) => {
    state.signForm = JSON.parse(JSON.stringify(data))
  },
  SET_imConfig: (state, { data, key }) => {
    state.imConfig[key] = data
  },
  SET_ifAddLiveRoom: (state, data) => {
    state.ifAddLiveRoom = data
  },
  SET_imUserInfo: (state, { data, key }) => {
    state.imUserInfo[key] = data
  },
  SET_noticeArray: (state, data) => {
    console.log('群系统通知 SET_noticeArray------触发', data)
    state.noticeArray.push(data)
  },
  // 聊天数据全量更新
  SET_messageData: (state, data) => {
    state.chatUser.type === 2 ? (state.chatView.messageData = data) : (state.privateChatView.messageData = data)
  },
  // 聊天数据头部添加
  SET_messageData_unshift: (state, data) => {
    // 过滤手机号
    const filterData = actions.getFiltersTextPhone({ state }, data, 'text')

    if (state.chatUser.type === 2) {
      // 如果开启了查看邀约学员发言，则不在添加非邀约学员
      if (state.ifReadStudent && data.message.cloudCustomData) {
        const cloudCustomData = JSON.parse(data.message.cloudCustomData)
        if (cloudCustomData) {
          if (cloudCustomData.identity && !cloudCustomData.identity.includes('VIP')) {
            return
          }
          if (cloudCustomData.roleId === 2 && !cloudCustomData.identity) {
            return
          }
        }
      }
      state.chatView.messageData.unshift(filterData)
    } else {
      state.privateChatView.messageData.unshift(filterData)
    }
  },
  // 聊天数据尾部添加
  SET_messageData_push: (state, data) => {
    // 过滤手机号
    const filterData = actions.getFiltersTextPhone({ state }, data, 'text')
    // 如果开启了查看邀约学员发言，则不在添加非邀约学员
    if (state.chatUser.type === 2) {
      if (state.ifReadStudent && data.message.cloudCustomData) {
        const cloudCustomData = JSON.parse(data.message.cloudCustomData)
        if (cloudCustomData) {
          if (cloudCustomData.identity && !cloudCustomData.identity.includes('VIP')) {
            return
          }
          if (cloudCustomData.roleId === 2 && !cloudCustomData.identity) {
            return
          }
        }
      }
    }
    // const ifRobot = /^(?=IR-)/.test(data.message.from)
    // if (state.ifReadStudent && ifRobot) {
    //   return
    // }

    if (state.chatUser.type === 2 && !(data.message.conversationType === 'GROUP' || data.message.conversationType === '@TIM#SYSTEM')) {
      return
    } else if (state.chatUser.type !== 2 && (data.message.conversationType === 'GROUP' || data.message.conversationType === '@TIM#SYSTEM')) {
      state.chatView.messageData.push(filterData)
      return
    } else if (state.chatUser.type !== 2 && data.message.conversationType !== 'GROUP' && !(data.message.from === state.imUserInfo.userId && data.message.to === state.chatUser.userId) && data.message.from !== state.chatUser.userId) {
      return
    } else {
      if (data.message.conversationType === 'GROUP') {
        state.chatView.messageData.push(data)
      } else {
        state.privateChatView.messageData.push(filterData)
      }
    }
  },
  // 聊天数据更新
  SET_messageData_updata: (state, { index, key, value }) => {
    state.chatUser.type === 2 ? (state.chatView.messageData[index][key] = value) : state.privateChatView.messageData[index][key] = value
  },
  // 聊天数据更新
  chatListArr_updataById: (state, { item, key, value }) => {
    const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === item.id)
    index > -1 && (state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData[index][key] = value)
  },
  // 聊天数据删除
  chatListArr_del: (state, item) => {
    const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === item.id)
    index > -1 && (state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.splice(index, 1))
  },
  // 设置直播群详情
  SET_liveGroupDetail: (state, data) => {
    state.liveGroupDetail = data
  },
  // 设置直播群详情
  SET_liveGroupDetailByKey: (state, { data, key }) => {
    state.liveGroupDetail[key] = data
  },
  // 设置直播间详情
  SET_liveRoomDetail: (state, data) => {
    state.liveRoomDetail = data
  },
  // 设置直播间详情
  SET_liveRoomDetailByKey: (state, { data, key }) => {
    state.liveRoomDetail[key] = data
  },
  // 更新在线老师数据
  SET_onlineTeachers: (state, data) => {
    state.leftList.onlineTeachers = data
  },
  // 更新我的学员数据
  SET_myTrainees: (state, data) => {
    state.leftList.myTrainees = data
  },
  // 更新普通学员数据
  SET_generalTrainees: (state, data) => {
    state.leftList.generalTrainees = data
  },
  // 更新我的学员在线数据
  SET_onlineMyTrainees: (state, data) => {
    state.leftList.onlineMyTrainees = data
  },
  // 更新我的学员离线数据
  SET_offMyTrainees: (state, data) => {
    state.leftList.offMyTrainees = data
  },
  // 更新普通学员在线数据
  SET_onlineGeneralTrainees: (state, data) => {
    state.leftList.onlineGeneralTrainees = data || 0
  },
  SET_optionMemberOfflineSum: (state, data) => {
    state.leftList.optionMemberOfflineSum = data || 0
  },
  SET_optionMemberOnlineSum: (state, data) => {
    state.leftList.optionMemberOnlineSum = data
  },
  // 更新普通学员离线数据
  SET_offGeneralTrainees: (state, data) => {
    state.leftList.offGeneralTrainees = data
  },
  // 更新所有学员列表
  SET_currentTrainees: (state, data) => {
    state.leftList.currentTrainees = data
  },
  // 会话列表更新，type: GROUP 群消息 @TIM#SYSTEM 系统消息 C2C 个人消息
  SET_conversationList: (state, data) => {
    const conversationList = []
    const AVliveRoomConversationList = []
    data.map((v) => {
      if (v.type === 'GROUP') {
        // 群会话
        v.toAccount === state.liveRoomDetail.groupId && AVliveRoomConversationList.push(v)
      } else if (v.type === '@TIM#SYSTEM') {
        // 系统会话
      } else if (v.type === 'C2C') {
        // 个人会话
        conversationList.push(v)
      }
    })
    state.conversationList = conversationList
    state.AVliveRoomConversationList = AVliveRoomConversationList
  },
  SET_chatUser: (state, data) => {
    // state.chatListArr = []
    state.chatUser = data
  },
  set_ifScrollBottom: (state, data) => {
    state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].ifScrollBottom = data
  },
  set_ifCanScrollBottom: (state, data) => {
    state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].ifCanScrollBottom = data
  },
  set_isCompleted: (state, data) => {
    state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].isCompleted = data
  },
  set_nextReqMessageID: (state, data) => {
    state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].nextReqMessageID = data
  },
  set_memberQueryType: (state, data) => {
    state.memberQueryType = data
  },
  // 教室设置
  set_LiveRoom_liveRoomPersonInfo: (state, { key, data }) => {
    state.liveRoomDetail.liveRoomPersonInfo[key] = data
  },
  // set_groupMessageData: (state, data) => {
  //   state.groupMessageData = data
  // },
  set_pushFlowSwitch: (state, data) => {
    state.pushFlowSwitch = data
  },
  set_videoUrl: (state, data) => {
    state.videoUrl = data
  },
  set_scriptSetting: (state, data) => {
    state.scriptSetting = data
  },
  set_ifReadStudent: (state, data) => {
    localStorage.setItem('liveRoom_ifReadStudent', data ? 'true' : '')
    state.ifReadStudent = data
  },
  update_scriptSetting: (state, { key, data }) => {
    state.scriptSetting[key] = data
    console.log(state.scriptSetting, '改变触发')
  },
  // 设置是否允许学员重复观看
  set_isRepeatedViewing: (state, data) => {
    state.liveRoomDetail.liveRoomIntelligentInfo.isRepeatedViewing = data
  },
  set_liveSensitiveSetting: (state, data) => {
    state.liveSensitiveSetting = {
      ...state.liveSensitiveSetting,
      ...data
    }
  },
  // 推送的优惠劵
  set_popoverCoupon: (state, data) => {
    state.popoverCoupon = {
      ...state.popoverCoupon,
      ...data
    }
  },
  // 推送的商品
  set_popoverGoods: (state, data) => {
    state.popoverGoods = {
      ...state.popoverGoods,
      ...data
    }
  },
  // 设置置顶消息
  set_Topping: (state, data) => {
    state.Topping = data
  }
}

const actions = {
  // 获取userSig
  getUserSig(userId) {
    const params = { userId: userId }
    return getUserSig(params)
  },
  // 获取im基础配置信息
  getImOperationAccountInfo({ commit }) {
    return getImOperationAccountInfo().then(res => {
      commit('SET_imConfig', { key: 'SDKAppID', data: Number(res.data.sdkAppId) })
      commit('SET_imConfig', { key: 'secretKey', data: res.data.secretKey })
    })
  },
  // 初始化
  imInit({ commit }, userId) {
    return actions.getImOperationAccountInfo({ commit }).then(() => {
      return new Promise((resolve, reject) => {
        commit('SET_imUserInfo', { key: 'userId', data: userId })
        console.log(state.imConfig, 'state.imConfig')
        state.tim = TIM.create(state.imConfig)
        // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel 接口的说明</a>
        state.tim.setLogLevel(4) // 普通级别，日志量较多，接入时建议使用
        // state.tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
        // 注册腾讯云即时通信 IM 上传插件
        state.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
        actions.imLogin({ commit }, userId)
        const onSdkReady = function (event) {
          console.log('SDK 进入ready 状态时触发')
          commit('SET_imConfig', { key: 'imReady', data: true })
          // actions.getConversationList()
          resolve()
        }
        // SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
        const onSdkNotReady = function (event) {
          console.log('SDK 进入 not ready 状态时触发')
          // Notification.warning({
          //   title: '警告',
          //   message: '您的网络不稳定，可能影响您的消息发送，请重新刷新直播间。',
          //   duration: 0
          // })
          // commit('SET_imUserInfo', { key: 'ifLogin', data: false })
          // actions.imLogin({ commit }, state.imUserInfo.userId)
        }
        state.tim.on(TIM.EVENT.SDK_NOT_READY, onSdkNotReady)

        // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息，接入侧可通过遍历 event.data 获取消息列表数据并渲染到页面
        const onMessageReceived = function (event) {
          console.log('SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息', event)
          const messageList = event.data
          messageList.forEach((message) => {
            message.ID = message.sequence
            let roleId = ''
            if (message.cloudCustomData) {
              const cloudCustomData = JSON.parse(message.cloudCustomData)
              roleId = cloudCustomData ? cloudCustomData.roleId : ''
              // hokMsgType 8:学员正在购买,9:已购买,10: 已领取优惠券不显示这个消息
              if (cloudCustomData.hokMsgType && [8, 9, 10].includes(cloudCustomData.hokMsgType)) {
                return
              }
              if (cloudCustomData.isAmuse && ((state.imUserInfo.roleId === 0 && !state.selfHiSettings.teacherVisible) || (state.imUserInfo.roleId === 1 && !state.selfHiSettings.assistantVisible))) {
                if (state.chatUser.type === 2) {
                  return
                }
              }
            }
            if (message.type === TIM.TYPES.MSG_TEXT) {
              const obj = {
                id: message.sequence,
                type: '1', // 1: 普通文本，2：'图片', 3: '系统消息'
                ifSend: false, // 是否发送中
                error: false, // 是否错误
                isMine: message.from === state.imUserInfo.userId,
                message: message,
                memberId: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberId' }),
                memberPic: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberPic' }),
                memberType: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberType' }),
                traineeRemark: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'traineeRemark' }),
                memberName: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberName' }) || message.nick || message.from,
                ifRobot: /^(?=IR-)/.test(message.from),
                roleId
              }
              console.log(actions.getTraineeRemarkByUserId({ commit }, message.from), message.nick, message.from)
              commit('SET_messageData_push', obj)
              // 文本消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.TextPayload
            } else if (message.type === TIM.TYPES.MSG_IMAGE) {
              // 图片消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.ImagePayload
              const obj = {
                id: message.sequence,
                type: '2', // 1: 普通文本，2：'图片', 3: '系统消息'
                ifSend: false, // 是否发送中
                error: false, // 是否错误
                isMine: message.from === state.imUserInfo.userId,
                message: message,
                memberId: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberId' }),
                memberPic: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberPic' }),
                memberType: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberType' }),
                traineeRemark: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'traineeRemark' }),
                memberName: actions.getTraineeRemarkByUserId({ commit }, { userId: message.from, key: 'memberName' }) || message.nick || message.from,
                ifRobot: /^(?=IR-)/.test(message.from),
                roleId
              }
              commit('SET_messageData_push', obj)
            } else if (message.type === TIM.TYPES.MSG_SOUND) {
              // 音频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.AudioPayload
            } else if (message.type === TIM.TYPES.MSG_VIDEO) {
              // 视频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.VideoPayload
            } else if (message.type === TIM.TYPES.MSG_FILE) {
              // 文件消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.FilePayload
            } else if (message.type === TIM.TYPES.MSG_CUSTOM) {
              // 自定义消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.CustomPayload
              console.log('自定义系统消息')
              const extension = JSON.parse(message.payload.extension)
              const ifToGroup = message.to === state.liveRoomDetail.groupId
              console.log(ifToGroup, 'ifToGroup')
              if (message.payload.data === '2') {
                if (!ifToGroup) {
                  return
                }
                message.id = message.sequence
                const obj = {
                  id: message.sequence,
                  type: '3', // 1: 普通文本，2：'图片', 3: '系统消息'
                  content: `${filtersTextPhone(message.nick)} 领取了${extension.content}优惠券`, // 内容
                  ifSend: false, // 是否发送中
                  error: false, // 是否错误
                  isMine: false,
                  message: message
                }
                actions.sendSysMsg({ commit }, obj)
                return
              } else if (message.payload.data === '11' && ifToGroup) {
                // 置顶消息
                commit('set_Topping', {
                  id: extension.id,
                  show: extension.show,
                  text: extension.text,
                  avatar: extension.avatar,
                  nick: extension.nick,
                  countdownTime: extension.countdownTime
                })
              }
            } else if (message.type === TIM.TYPES.MSG_MERGER) {
              // 合并消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.MergerPayload
            } else if (message.type === TIM.TYPES.MSG_LOCATION) {
              // 地理位置消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.LocationPayload
            } else if (message.type === TIM.TYPES.MSG_GRP_TIP) {
              const ifToGroup = message.to === state.liveRoomDetail.groupId
              if (!ifToGroup) {
                return
              }
              // 群提示消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupTipPayload
              const isTourist = /visitor-/.test(message.payload?.operatorID) // 游客
              if ([1, 2].includes(message.payload.operationType) && !isTourist && state.liveRoomDetail.isShowNotice === 1) {
                const obj = {
                  id: message.sequence,
                  type: '3', // 1: 普通文本，2：'图片', 3: '系统消息'
                  content: `${filtersTextPhone(message.nick)}${{ 1: '进入', 2: '离开', 3: '被踢出' }[message.payload.operationType]}直播间`, // 内容
                  ifSend: false, // 是否发送中
                  error: false, // 是否错误
                  isMine: false,
                  message: message
                }
                if (message.payload.operatorID === state.imUserInfo.userId && message.payload.operationType === 2) {
                  // 当前登录用户再其他地方离开直播间
                  console.log('当前登录用户再其他地方离开直播间')
                  state.tim.login({ userID: state.imUserInfo.userId, userSig: state.imUserInfo.userSig }).then((imResponse) => {
                    console.log(imResponse, 'imResponse')
                    if (imResponse.data.repeatLogin === true) {
                      // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
                      state.tim.logout().then(() => {
                        state.tim.login({ userID: state.imUserInfo.userId, userSig: state.imUserInfo.userSig }).then(() => {
                          console.log(state, 'state')
                          actions.joinGroup({ commit }, state.liveRoomDetail.groupId)
                        })
                      })
                    }
                  })
                } else {
                  actions.sendSysMsg({ commit }, obj)
                }
              }
              // 获取左侧列表数据
              // actions.getLeftList({ commit }, { groupId: state.liveRoomDetail.groupId, memberQueryType: 1 })
            } else if (message.type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
              const ifToGroup = message.to === state.liveRoomDetail.groupId
              if (!ifToGroup) {
                return
              }
              // 群系统通知 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupSystemNoticePayload
              if (!message.payload.userDefinedField) {
                return
              }
              const msgObj = JSON.parse(message.payload.userDefinedField)
              console.log('群系统通知', msgObj)
              if (!msgObj || !msgObj.msgCode) {
                return
              } else if (msgObj.msgCode === 1) {
                // 允许学员发图片
                commit('SET_liveRoomDetailByKey', { key: 'isAllowSendPic', data: 1 })
              } else if (msgObj.msgCode === 2) {
                // 不允许学员发图片
                commit('SET_liveRoomDetailByKey', { key: 'isAllowSendPic', data: 0 })
              } else if (msgObj.msgCode === 3) {
                // 显示系统消息
                commit('SET_liveRoomDetailByKey', { key: 'isShowNotice', data: 1 })
              } else if (msgObj.msgCode === 4) {
                // 不显示系统消息
                commit('SET_liveRoomDetailByKey', { key: 'isShowNotice', data: 0 })
              } else if (msgObj.msgCode === 5) {
                // 自嗨
              } else if (msgObj.msgCode === 6) {
                // 解除自嗨
              } else if (msgObj.msgCode === 7) {
                // 全局禁言
                const obj = {
                  id: message.sequence,
                  type: '3', // 1: 普通文本，2：'图片', 3: '系统消息'
                  content: '全员禁言', // 内容
                  ifSend: false, // 是否发送中
                  error: false, // 是否错误
                  isMine: false,
                  message: message
                }
                commit('SET_liveRoomDetailByKey', { key: 'isShutUp', data: 1 })
                actions.sendSysMsg({ commit }, obj)
              } else if (msgObj.msgCode === 8) {
                // 解除全局禁言
                const obj = {
                  id: message.sequence,
                  type: '3', // 1: 普通文本，2：'图片', 3: '系统消息'
                  content: '解除全员禁言', // 内容
                  ifSend: false, // 是否发送中
                  error: false, // 是否错误
                  isMine: false,
                  message: message
                }
                commit('SET_liveRoomDetailByKey', { key: 'isShutUp', data: 0 })
                actions.sendSysMsg({ commit }, obj)
              } else if (msgObj.msgCode === 9) {
                // 编辑群公告
                const notice = JSON.parse(msgObj.content)
                commit('SET_liveRoomDetailByKey', { data: notice.announcement, key: 'announcement' })
                commit('SET_liveRoomDetailByKey', { data: notice.announcementUrl, key: 'announcementUrl' })
              } else if (msgObj.msgCode === 10) {
                // 单个禁言
              } else if (msgObj.msgCode === 11) {
                // 解除单个禁言
              } else if (msgObj.msgCode === 13) {
                // 直播人数显示
                commit('SET_liveRoomDetailByKey', { key: 'isShow', data: true })
              } else if (msgObj.msgCode === 14) {
                // 直播人数隐藏
                commit('SET_liveRoomDetailByKey', { key: 'isShow', data: false })
              } else if (msgObj.msgCode === 15) {
                // 开始推流
                commit('SET_liveRoomDetailByKey', { data: 1, key: 'status' })
                commit('set_pushFlowSwitch', 1)
                actions.getLiveRoomDetail({ commit }, state.liveRoomDetail.liveRoomId)

                // 该弹窗在开播时间点自动打开。只弹一次，且不能自动关闭，只能手动关闭。
                if (state.liveRoomDetail.heatButton) {
                  console.log('11231')
                  delModal.open({
                    tips: `<span style="font-size: 16px;font-weight: 700;">如果您想提升直播间人气氛围，<br />可对当前直播间进行加热人气。</span>`,
                    sureBtnText: '加热直播间',
                    sureBtnBgColor: '#0C6FFF',
                    success: () => {
                      liveRoomDialog.open({
                        visible: true,
                        liveRoomId: state.liveRoomDetail.liveRoomId,
                        type: 'HotLive',
                        liveStatus: state.liveRoomDetail.status,
                        liveStartTime: state.liveRoomDetail.startTime,
                        success: () => {
                          liveRoomDialog.close()
                        }
                      })
                    }
                  })
                }
              } else if (msgObj.msgCode === 16) {
                // 推流结束(直播暂停)
                commit('set_videoUrl', '')
                commit('SET_liveRoomDetailByKey', { data: 2, key: 'status' })
                commit('set_pushFlowSwitch', 2)
                actions.getLiveRoomDetail({ commit }, state.liveRoomDetail.liveRoomId)
                // commit('SET_liveRoomDetailByKey', { key: 'status', data: 9 })
              } else if (msgObj.msgCode === 17) {
                // 拉黑
              } else if (msgObj.msgCode === 18) {
                // 解除拉黑
              } else if (msgObj.msgCode === 19) {
                // 群详情修改触发
                if (msgObj.content) {
                  const detail = JSON.parse(msgObj.content)
                  // detail.liveImgUrl
                  commit('SET_liveRoomDetailByKey', { data: detail.liveName, key: 'name' })
                  commit('SET_liveRoomDetailByKey', { data: detail.liveImgUrl, key: 'imgUrl' })
                  commit('SET_liveRoomDetailByKey', { data: detail.liveStartTime, key: 'startTime' })
                }
              } else if (msgObj.msgCode === 20) {
                // 直播结束
                commit('set_pushFlowSwitch', 0)
                commit('SET_liveRoomDetailByKey', { key: 'status', data: 9 })
                commit('SET_liveRoomDetailByKey', { key: 'isVoiceChat', data: 0 })
              } else if (msgObj.msgCode === 23) {
                // 暂停互动
                commit('update_scriptSetting', { key: 'scriptInteractStatus', data: 2 })
              } else if (msgObj.msgCode === 24) {
                // 启动互动
                commit('update_scriptSetting', { key: 'scriptInteractStatus', data: 1 })
              } else if (msgObj.msgCode === 25) {
                // 紧急下课
                // commit('update_scriptSetting', { key: 'scriptInteractStatus', data: 1 })
                commit('set_pushFlowSwitch', 0)
                commit('SET_liveRoomDetailByKey', { key: 'status', data: 9 })
                actions.getLiveRoomDetail({ commit }, state.liveRoomDetail.liveRoomId)
              } else if (msgObj.msgCode === 26) {
                // 允许学员看同一视频-26
                commit('set_isRepeatedViewing', true)
              } else if (msgObj.msgCode === 27) {
                // 不允许学员看同一视频-27
                commit('set_isRepeatedViewing', false)
              } else if (msgObj.msgCode === 28) {
                // 直播模式改变，重载页面
                location.reload()
              } else if (msgObj.msgCode === 29) {
                // 敏感词设置
                const detail = JSON.parse(msgObj.content)
                commit('set_liveSensitiveSetting', detail)
              } else if (msgObj.msgCode === 32) {
                // Dialog2.close()
                // 开奖
                const content = JSON.parse(msgObj.content)
                // Dialog.open({
                //   type: 'PrizeWinner',
                //   title: `中奖结果`,
                //   liveRoomId: content.liveRoomId,
                //   prizeDrawId: content.drawPrizeId,
                //   visible: true
                // })
                commit('SET_ifDrawPrize', content.drawPrizeId)
              } else if (msgObj.msgCode === 33) {
                // 允许学员连麦
                commit('SET_liveRoomDetailByKey', { key: 'isVoiceChat', data: 1 })
              } else if (msgObj.msgCode === 34) {
                // 禁止学员连麦
                commit('SET_liveRoomDetailByKey', { key: 'isVoiceChat', data: 0 })
              } else if (msgObj.msgCode === 37) {
                // 显示购物车
                commit('SET_liveRoomDetailByKey', { key: 'showShoppingCart', data: true })
              } else if (msgObj.msgCode === 38) {
                // 隐藏购物车
                commit('SET_liveRoomDetailByKey', { key: 'showShoppingCart', data: false })
              } else if (msgObj.msgCode === 44) {
                // 开始签到
                const content = JSON.parse(msgObj.content)
                commit('SET_ifSign', { ...content, ifSignStart: 1 })
              } else if (msgObj.msgCode === 45) {
                // 结束签到
                const content = JSON.parse(msgObj.content)
                commit('SET_ifSign', { ...content, ifSignStart: 2 })
              } else if (msgObj.msgCode === 21) {
                // 商品下架需要撤回推送的商品
                const content = {
                  visible: false
                }
                msgObj.content === state.popoverGoods?.goodsId && commit('set_popoverGoods', content)
              } else if (msgObj.msgCode === 12) {
                // 推送商品
                const content = JSON.parse(msgObj.content)
                content.visible = true
                commit('set_popoverGoods', content)
              } else if (msgObj.msgCode === 35) {
                // 推送优惠券
                const isShow = msgObj.isShow
                const content = JSON.parse(msgObj.content)
                content.visible = isShow
                commit('set_popoverCoupon', content)
              } else if (msgObj.msgCode === 36) {
                // 撤回推送商品
                const content = JSON.parse(msgObj.content)
                content.visible = false
                commit('set_popoverGoods', content)
              } else if (msgObj.msgCode === 48) {
                // 点赞开关
                const isShow = msgObj.isShow
                commit('SET_liveRoomDetailByKey', { key: 'showLikeIcon', data: isShow })
              } else if (msgObj.msgCode === 46) {
                // 修改页面布局
                const content = JSON.parse(msgObj.content)
                commit('set_LiveRoom_liveRoomPersonInfo', { key: 'landscapeModel', data: content.landscapeModel })
                commit('set_LiveRoom_liveRoomPersonInfo', { key: 'verticalScreenModel', data: content.verticalScreenModel })
                commit('set_LiveRoom_liveRoomPersonInfo', {
                  key: 'mainScreenCharacters', data: {
                    headImgUrl: '',
                    inviteCode: '',
                    liveRoomAlias: '',
                    teacherId: content.mainScreenCharacters,
                    teacherName: '',
                    teacherRole: '',
                    teacherTel: ''
                  }
                })
              } else if (msgObj.msgCode === 49) {
                // 显示或隐藏直播间加热按钮
                const isShow = JSON.parse(msgObj.isShow)
                commit('SET_liveRoomDetailByKey', { key: 'heatButton', data: isShow })
              } else if (msgObj.msgCode === 50) {
                const conte = JSON.parse(msgObj.content)
                commit('SET_selfHiSettings', conte)
              } else if (msgObj.msgCode === 52) {
                const conte = JSON.parse(msgObj.content)
                commit('SET_cmd', conte)
              } else if (msgObj.msgCode === 53) {
                const conte = msgObj.content
                // 营销工具数据实时同步 ，
                // 根据content字段判断：
                // HEAT_PEOPLE_STATUS_CHANGE（加热人气状态变更），
                // COUPON_CHANGE（优惠券变更），
                // GOODS_CHANGE（直播间商品变更），
                // SUBSCRIBE_LIVE_ROOM_CHANGE (预约直播间变更)
                console.log(conte, 'conte', state.activeChangeType.flag)
                commit('SET_activeChangeType', { flag: !state.activeChangeType.flag, type: conte })
              } else if (msgObj.msgCode === 56) {
                // 购买记录 订单提醒--需要登录人一起
                const obj = JSON.parse(msgObj.content)
                if (obj.userId === state.imUserInfo.userId) {
                  commit('SET_noticeArray', obj)
                }
              }
            } else if (message.type === 'TIMFaceElem') {
              // im信令消息
              console.log(message, '接收到的信令消息')
            }

            if (state.chatUser.type !== 2 && message.from === state.chatUser.userId) {
              console.log(state.chatUser.conversationID, 'state.chatUser.conversationID')
              state.chatUser.conversationID && actions.sendMessageReadReceipt(state.chatUser.conversationID)
            }
          })

          // actions.clearLiveData({ commit })
          // event.data - 存储 Message 对象的数组 - [Message]
        }
        state.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived)

        // SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
        const onMessageModified = function (event) {
          // event.data - 存储被修改过的 Message 对象的数组 - [Message]
          console.log('收到消息被修改的通知', event)
        }
        state.tim.on(TIM.EVENT.MESSAGE_MODIFIED, onMessageModified)

        // SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。
        const onMessageRevoked = function (event) {
          console.log('消息被撤回通知', event)
          event.data.map(item => {
            if (item.conversationID !== `GROUP${state.liveRoomDetail.groupId}`) return
            const obj = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.find(v => v.id === Number(item.revokeReason))
            console.log(obj, 'obj')
            if (obj) {
              obj.message.isRevoked = true
              commit('chatListArr_del', obj)
            }
          })
          // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
        }
        state.tim.on(TIM.EVENT.MESSAGE_REVOKED, onMessageRevoked)

        // SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。
        const onMessageReadByPeer = function (event) {
          console.log('SDK 收到对端已读消息的通知，即已读回执。', event)
          // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
        }
        state.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer)

        // 会话列表更新，event.data 是包含 Conversation 对象的数组
        const onConversationListUpdated = function (event) {
          console.log('会话列表更新', event.data.length, event.data) // 包含 Conversation 实例的数组
          commit('SET_conversationList', event.data)
        }
        state.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated)

        // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
        const onGroupListUpdated = function (event) {
          console.log(event.data)// 包含 Group 实例的数组
        }
        state.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated)

        // 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
        const onGroupAttributesUpdated = function (event) {
          // const groupID = event.data.groupID // 群组ID
          // const groupAttributes = event.data.groupAttributes // 更新后的群属性
          console.log('群属性更新时触发，可通过', event.data)
        }
        state.tim.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated)

        // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
        const onProfileUpdated = function (event) {
          console.log(event.data) // 包含 Profile 对象的数组
        }
        state.tim.on(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated)

        // SDK 黑名单列表更新时触发
        const onBlacklistUpdated = function (event) {
          console.log(event.data) // 我的黑名单列表，结构为包含用户 userID 的数组
        }
        state.tim.on(TIM.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated)

        // 好友列表更新时触发
        const onFriendListUpdated = function (event) {
          console.log(event.data)
        }
        state.tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated)

        // 好友分组列表更新时触发
        const onFriendGroupListUpdated = function (event) {
          console.log(event.data)
        }
        state.tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, onFriendGroupListUpdated)

        // 用户被踢下线时触发
        const onKickedOut = function (event) {
          console.log(event.data.type)
          // TIM.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一帐号，多页面登录被踢)
          // TIM.TYPES.KICKED_OUT_MULT_DEVICE(同一帐号，多端登录被踢)
          // TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
          // TIM.TYPES.KICKED_OUT_REST_API(REST API kick 接口踢出。v2.20.0起支持)
        }
        state.tim.on(TIM.EVENT.KICKED_OUT, onKickedOut)

        // 网络状态发生改变
        const onNetStateChange = function (event) {
          // v2.5.0 起支持
          // event.data.state 当前网络状态，枚举值及说明如下：
          // TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
          // TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
          // TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
          if (event.data.state === TIM.TYPES.NET_STATE_CONNECTED) {
            console.log('已接入网络')
          } else if (event.data.state === TIM.TYPES.NET_STATE_CONNECTING) {
            Notification.warning({
              title: '警告',
              message: '您当前的网络不稳定，建议您检查您的网络状态。',
              duration: 0
            })
          } else if (event.data.state === TIM.TYPES.NET_STATE_DISCONNECTED) {
            Notification.warning({
              title: '警告',
              message: '请检查您的网络是否可用',
              duration: 0
            })
          }
        }
        state.tim.on(TIM.EVENT.NET_STATE_CHANGE, onNetStateChange)

        // 会话未读总数更新
        const onTotalUnreadMessageCountUpdated = function (event) {
          console.log('会话未读总数更新', event)
        }
        state.tim.on(TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, onTotalUnreadMessageCountUpdated)
        state.tim.on(TIM.EVENT.SDK_READY, onSdkReady)
      })
    })
  },
  // 登录
  imLogin({ commit }, userId) {
    // console.log('登录userId', userId)
    if (!userId) {
      return new Error('缺少userId')
    }
    this.getUserSig(userId).then(res => {
      const userSig = res.data
      commit('SET_imUserInfo', { key: 'userSig', data: userSig })
      // console.log(userSig, 'userSig')
      return state.tim.login({ userID: userId, userSig: userSig }).then((imResponse) => {
        commit('SET_imUserInfo', { key: 'ifLogin', data: true })
        // console.log('登录成功', imResponse.data) // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
          //   console.log('提示', imResponse.data.errorInfo)
          //   _this.$message.warning(imResponse.data.errorInfo)
          actions.imLoginOut({ commit }).then(() => {
            actions.imLogin({ commit }, userId)
          })
        }
      })
    }).catch(function (imError) {
      // 登录失败
      console.warn('login error:', imError) // 登录失败的相关信息
      commit('SET_imUserInfo', { key: 'ifLogin', data: false })
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
    // const { userSig } = genTestUserSig({
    //   SDKAppID: state.imConfig.SDKAppID,
    //   secretKey: state.imConfig.secretKey,
    //   userID: userId
    // })
  },
  // 登出
  imLoginOut({ commit }) {
    return state.tim.logout().then((imResponse) => {
      console.log('登出成功', imResponse.data) // 登出成功
      commit('SET_imUserInfo', { key: 'ifLogin', data: false })
      // 需要将数据初始化
      commit('SET_messageData', [])
      commit('SET_chatUser', { type: '', userId: '', userName: '', conversationID: '' })
      commit('SET_liveGroupDetail', JSON.parse(JSON.stringify(LiveGroupDetail)))
      commit('SET_liveRoomDetail', JSON.parse(JSON.stringify(LiveRoomDetail)))
      commit('SET_onlineTeachers', [])
      commit('SET_myTrainees', [])
      commit('SET_myTrainees', [])
    }).catch(function (imError) {
      console.warn('logout error:', imError)
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 获取会话列表
  getConversationList() {
    // 获取全量的会话列表
    state.tim.getConversationList().then((imResponse) => {
      const conversationList = imResponse.data.conversationList // 全量的会话列表，用该列表覆盖原有的会话列表
      const isSyncCompleted = imResponse.data.isSyncCompleted // 从云端同步会话列表是否完成
      console.log('获取全量的会话列表:', conversationList)
      console.log('从云端同步会话列表是否完成:', isSyncCompleted)
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 获取直播群
  getGroupById({ commit }, groupId) {
    return state.tim.searchGroupByID(groupId).then((imResponse) => {
      const group = imResponse.data.group // 群组信息
      // console.log('im直播群详情', group)
      commit('SET_liveGroupDetail', { ...LiveGroupDetail, ...group })
      return group
    }).catch(function (imError) {
      console.warn('searchGroupByID error:', imError) // 搜素群组失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 加入直播群
  joinGroup({ commit }, groupId) {
    // 加入群聊
    return state.tim.joinGroup({ groupID: groupId }).then(function (imResponse) {
      switch (imResponse.data.status) {
        case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
          break
        case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          // console.log(imResponse.data.group) // 加入的群组资料
          console.log('加入群聊成功')
          break
        case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
          console.log('已经在群中')
          break
        default:
          break
      }
    }).catch(function (imError) {
      // console.warn('joinGroup error:', imError) // 申请加群失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
      return Promise.reject(imError)
    })
  },
  // 退出群聊
  leaveLiveRoom({ commit }, groupId) {
    console.log(groupId, 'groupId')
    return state.tim.quitGroup(groupId).then(function (imResponse) {
      console.log(imResponse.data.groupID) // 退出成功的群 ID
    }).catch(function (imError) {
      console.warn('quitGroup error:', imError) // 退出群组失败的相关信息
    })
  },
  // 获取单人聊天消息数据
  getMessageList({ commit }, conversationID) {
    const params = {
      conversationID: conversationID,
      direction: 0,
      count: 15
    }
    if (state.privateChatView.nextReqMessageID && !state.privateChatView.isCompleted) { params.nextReqMessageID = state.privateChatView.nextReqMessageID }
    return state.tim.getMessageListHopping(params).then((imResponse) => {
      console.log(imResponse, '获取单人聊天消息数据')
      const arr = imResponse.data.messageList.reduce((pre, next) => {
        pre.push({
          id: next.ID,
          type: { 'TIMTextElem': '1', 'TIMImageElem': '2' }[next.type], // 1: 普通文本，2：'图片'
          ifSend: false, // 是否发送中
          error: false, // 是否错误
          isMine: next.from === state.imUserInfo.userId,
          message: next
        })
        return pre
      }, [])
      arr.map(v => {
        commit('SET_messageData_push', v)
      })
      commit('set_isCompleted', imResponse.data.isCompleted)
      commit('set_nextReqMessageID', imResponse.data.nextReqMessageID)
      actions.sendMessageReadReceipt(conversationID)
    })
  },
  // 获取单人更多聊天数据
  getMessageListMore({ commit }, conversationID) {
    const params = {
      conversationID: conversationID,
      nextReqMessageID: state.privateChatView.nextReqMessageID
    }
    return state.tim.getMessageList(params).then((imResponse) => {
      console.log(imResponse, '获取单人聊天消息数据')
      const arr = imResponse.data.messageList.reduce((pre, next) => {
        pre.push({
          id: next.ID,
          type: { 'TIMTextElem': '1', 'TIMImageElem': '2' }[next.type], // 1: 普通文本，2：'图片'
          ifSend: false, // 是否发送中
          error: false, // 是否错误
          isMine: next.from === state.imUserInfo.userId,
          message: next
        })
        return pre
      }, [])
      arr.reverse().map(v => {
        commit('SET_messageData_unshift', v)
      })
      commit('set_isCompleted', imResponse.data.isCompleted)
      commit('set_nextReqMessageID', imResponse.data.nextReqMessageID)
      actions.sendMessageReadReceipt(conversationID)
    })
  },
  // 发送普通文本消息
  sendMessage({ commit }, myMessage) {
    console.log(myMessage, 'myMessage')
    // actions.clearLiveData({ commit })
    return new Promise((resolve, reject) => {
      if (!state.chatUser.userId) {
        return reject()
      }
      console.log(state.imUserInfo, 'imUserInfo')
      const { filtrationType } = state.liveSensitiveSetting
      // 数字不送审
      const isExamine = !!/^[0-9]+.?[0-9]*$/.test(myMessage)

      const cloudCustomData = { hokMsgType: 3, roleId: state.imUserInfo.roleId }
      console.log(state.replySetting, '12111')
      if (state.replySetting.ifReply) {
        cloudCustomData.messageFeature = state.replySetting.data.messageFeature
        cloudCustomData.messageReply = state.replySetting.data.messageReply
        cloudCustomData.payload = state.replySetting.data.payload
      }
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = state.tim.createTextMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          text: myMessage
        },
        cloudCustomData: JSON.stringify(cloudCustomData),
        // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
        needReadReceipt: state.chatUser.type === 1
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      })
      console.log(message, 'message')
      const obj = {
        id: message.sequence || message.ID || new Date().getTime(),
        type: '1', // 1: 普通文本，2：'图片'
        isMine: message.from === state.imUserInfo.userId,
        ifSend: true, // 是否发送中
        error: false,
        message
      }
      // commit('SET_messageData_push', obj)
      // 2. 发送消息
      state.tim.sendMessage(message, {
        messageControlInfo: {
          // 是否审核
          excludedFromContentModeration: isExamine
        }
      }).then(function (imResponse) {
        console.log(imResponse, '消息发送成功')
        // 发送成功
        obj.id = message.sequence
        commit('SET_messageData_push', obj)
        const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
        index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
        resolve(imResponse)
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        if (imError?.code === 80001) {
          // 命中敏感词
          if (filtrationType === 2) {
            // 消息将仅发言人可见
            commit('SET_messageData_push', obj)
            const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
            index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          } else {
            Message({ message: '消息含敏感词', type: 'error', duration: 5 * 1000 })
          }
        } else {
          commit('SET_messageData_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          console.log(index, '错误的index')
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
        }
        reject(imError)
      })
    })
  },
  // 发送图片
  sendPic({ commit }, result) {
    // actions.clearLiveData({ commit })
    return new Promise((resolve, reject) => {
      const { filtrationType } = state.liveSensitiveSetting
      const message = state.tim.createImageMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        payload: { file: result.data },
        cloudCustomData: JSON.stringify({ hokMsgType: 4, roleId: state.imUserInfo.roleId }),
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
        onProgress: function (event) { console.log('file uploading:', event) }
      })
      // message.id = message.sequence
      const obj = {
        id: message.sequence || new Date().getTime(),
        type: '2', // 1: 普通文本，2：'图片'
        isMine: message.from === state.imUserInfo.userId,
        ifSend: true, // 是否发送中
        file: result.file,
        error: false,
        message
      }
      console.log(obj, 'obj')
      commit('SET_messageData_push', obj)
      state.tim.sendMessage(message).then(function (imResponse) {
        // 发送成功
        obj.id = message.sequence
        console.log('发送成功', imResponse)
        const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
        index > -1 ? commit('SET_messageData_updata', { index, key: 'ifSend', value: false }) : commit('SET_messageData_push', obj)
        resolve(imResponse)
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        if (imError?.code === 80001) {
          // 命中敏感词
          if (filtrationType === 2) {
            // 消息将仅发言人可见
            commit('SET_messageData_push', obj)
            const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
            index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          } else {
            Message({ message: '图片含敏感词', type: 'error', duration: 5 * 1000 })
          }
        } else {
          commit('SET_messageData_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
        }

        reject(imError)
      })
    })
  },
  // 重新发送消息
  alignSendMsg({ commit }, item) {
    console.log(item, '重新发送消息item')
    if (item.type === '1') {
      return new Promise((resolve, reject) => {
        // 1. 创建消息实例，接口返回的实例可以上屏
        const message = state.tim.createTextMessage({
          to: state.chatUser.userId,
          conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text: item.message.payload.text
          },
          priority: TIM.TYPES.MSG_PRIORITY_HIGH,
          cloudCustomData: JSON.stringify({ hokMsgType: 3, roleId: state.imUserInfo.roleId }),
          // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
          needReadReceipt: state.chatUser.type === 1
          // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
          // cloudCustomData: 'your cloud custom data'
        })
        // item.ifSend = true
        // 2. 发送消息
        state.tim.sendMessage(message).then(function (imResponse) {
          commit('chatListArr_del', item)
          // 发送成功
          console.log(imResponse)
          resolve(imResponse)
          const obj = {
            id: message.sequence,
            type: '1', // 1: 普通文本，2：'图片'
            isMine: message.from === state.imUserInfo.userId,
            ifSend: true, // 是否发送中
            error: false,
            message: imResponse
          }
          commit('chatListArr_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === item.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
          reject(imError)
        })
      })
    } else if (item.type === '2') {
      return new Promise((resolve, reject) => {
        // 1. 创建消息实例，接口返回的实例可以上屏
        const message = state.tim.createTextMessage({
          to: state.chatUser.userId,
          conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: { file: item.file },
          cloudCustomData: JSON.stringify({ hokMsgType: 4, roleId: state.imUserInfo.roleId }),
          onProgress: function (event) { console.log('file uploading:', event) }
        })
        // 2. 发送消息
        state.tim.sendMessage(message).then(function (imResponse) {
          commit('chatListArr_del', item)
          // 发送成功
          console.log(imResponse)
          resolve(imResponse)
          const obj = {
            id: message.sequence,
            type: '2', // 1: 普通文本，2：'图片'
            isMine: message.from === state.imUserInfo.userId,
            ifSend: true, // 是否发送中
            file: item.file,
            error: false,
            message: imResponse
          }
          commit('chatListArr_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === item.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
          reject(imError)
        })
      })
    }
  },
  // 获取群聊消息列表数据
  getGroupMessageListById({ commit }, conversationID) {
    return state.tim.getMessageList({ conversationID: conversationID }).then((imResponse) => {
      const messageList = imResponse.data.messageList // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
      console.log('获取群聊消息列表数据', messageList, nextReqMessageID, isCompleted)
    })
  },
  // 将某会话下的未读消息状态设置为已读
  sendMessageReadReceipt(conversationID) {
    state.tim.setMessageRead({ conversationID: conversationID }).then(function () {
      // 发送消息已读回执成功
      console.log('已读上报成功')
    }).catch(function (imError) {
      // 发送消息已读回执失败
      console.log('已读上报失败', imError)
    })
  },
  // 获取直播间在线人数
  getGroupOnlineMemberCount({ commit }) {
    if (state.liveGroupDetail.groupID) {
      return groupOnlineCount({ groupId: state.liveGroupDetail.groupID }).then(res => {
        const currentOnlineCount = res.data.currentOnlineCount || 0
        const adjustCount = Number(res.data.adjustCount) + Number(res.data.currentOnlineCount)
        const realUserCount = res.data.realUserCount || 0
        commit('SET_liveGroupDetailByKey', { key: 'currentOnlineCount', data: currentOnlineCount })
        commit('SET_liveGroupDetailByKey', { key: 'adjustCount', data: adjustCount })
        commit('SET_liveGroupDetailByKey', { key: 'realUserCount', data: realUserCount })
      })
    }
  },
  // 获取全部未读消息数量
  getTotalUnreadMessageCount({ commit }) {
    if (!state.imConfig.imReady) {
      return
    }
  },
  // 获取直播间详情数据
  getLiveRoomDetail({ commit }, liveRoomId) {
    const params = { liveRoomId }
    return getLiveRoomInfo(params).then(res => {
      console.log(res, '获取直播间详情数据')
      // res.data.groupId = '8888888888888888'
      let roleId = ''
      if (res.data.liveModel === 'AI_LIVE') {
        // 数字直播
        res.data.liveRoomPersonInfo.pushFlowAdder = ''
        res.data.liveRoomPersonInfo.broadcastStreamSecretKey = ''
      } else if (res.data.liveModel === 'PERSON_LIVE') {
        // 真人直播
        res.data.liveRoomPersonInfo.pushFlowAdder = `rtmp://${res.data.liveRoomPersonInfo.pushInfo.url}/${res.data.liveRoomPersonInfo.pushInfo.appName}` // 服务器rtmp://181573.push.tlivecloud.com/live
        res.data.liveRoomPersonInfo.broadcastStreamSecretKey = `${res.data.liveRoomPersonInfo.pushInfo.streamName}?txSecret=${res.data.liveRoomPersonInfo.pushInfo.txSecret}&txTime=${res.data.liveRoomPersonInfo.pushInfo.txTime}` // 串流密匙LR718828?txSecret=24fac9906a9757a2c7bb84ef85797c2a&txTime=645B08B0
      }
      // 根据userId获取当前用户角色
      if (res.data.teacherInfoList && res.data.teacherInfoList.length > 0) {
        const obj = res.data.teacherInfoList.find(v => v.teacherId === state.imUserInfo.userId)
        obj && (roleId = obj.teacherRole)
        console.log(obj, 'obj')
        console.log(roleId, 'roleId+++++++++++++')
      }
      commit('SET_playTime', res.data.playTime || 0)
      commit('SET_imUserInfo', { data: roleId, key: 'roleId' })
      commit('SET_liveRoomDetail', { ...LiveRoomDetail, ...res.data })
      return res
    })
  },
  // 获取左侧聊天列表数据
  getLeftList({ commit }, { groupId, memberQueryType }) {
    const params = {
      groupId: groupId,
      liveRoomId: state.liveRoomDetail.liveRoomId,
      memberQueryType
    }
    return getLeftList(params).then(res => {
      res.data.myTrainees.map((item) => {
        item.id = item.memberId
        const obj = state.conversationList.find(v => {
          return v.toAccount === item.memberId
        }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
        item['message'] = obj
        item['isVisitor'] = item.memberType === 4
      })
      // res.data.myTrainees.sort((a, b) => {
      //   return (b.message?.lastMessage?.lastTime || 0) - (a.message?.lastMessage?.lastTime || 0)
      // })
      res.data.generalTrainees.map(item => {
        item.id = item.memberId
        const obj = state.conversationList.find(v => {
          return v.toAccount === item.memberId
        }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
        item['message'] = obj
        item['isVisitor'] = item.memberType === 4
      })
      res.data.generalTrainees.sort((a, b) => {
        return (b.message?.lastMessage?.lastTime || 0) - (a.message?.lastMessage?.lastTime || 0)
      })
      res.data.onlineTeachers.map(item => {
        const obj = state.conversationList.find(v => {
          return v.toAccount === item.memberId
        })
        item['message'] = obj || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        item.memberId === state.imUserInfo.userId && commit('SET_imUserInfo', { data: item.memberType ? item.memberType - 1 : '', key: 'roleId' })
      })
      commit('SET_onlineTeachers', res.data.onlineTeachers)
      commit('SET_myTrainees', res.data.myTrainees)
      commit('SET_generalTrainees', res.data.generalTrainees)
      commit('SET_liveRoomDetailByKey', { data: res.data.generalTraineesOnlineSum || 0, key: 'generalTraineesOnlineSum' })
      commit('SET_liveRoomDetailByKey', { data: res.data.myTraineesOnlineSum || 0, key: 'myTraineesOnlineSum' })
      return res
    })
  },
  getLeftListV2({ commit }, { groupId, memberQueryType, behavior, searchParam, inviter = null }) {
    // 取消上一次发出的请求
    console.log(state.source, 'state.source')
    if (state.source) {
      state.source.cancel('cancel')
      state.source = null
      // console.log('取消请求')
    }
    const params = {
      groupId: groupId,
      behavior: behavior, // 行为
      searchParam: searchParam, // 搜索参数
      inviter: inviter, // 邀请人 null-全部 0-无归属邀请人 其他-邀请人ID
      liveRoomId: state.liveRoomDetail.liveRoomId,
      memberQueryType
    }
    state.source = state.cancelToken.source()
    return leftUserList(params, state.source.token).then(res => {
      if (res.data) {
        res.data.optionMember.map((item) => {
          item.id = item.memberId
          const obj = state.conversationList.find(v => {
            return v.toAccount === item.memberId
          }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
          // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
          item['message'] = obj
          item['isVisitor'] = item.memberType === 4
        })
        res.data.optionMember.sort((a, b) => {
          return (b.message?.lastMessage?.lastTime || 0) - (a.message?.lastMessage?.lastTime || 0)
        })
        commit('SET_currentTrainees', res.data.optionMember)
        commit('SET_optionMemberOfflineSum', res.data.optionMemberOfflineSum)
        commit('SET_optionMemberOnlineSum', res.data.optionMemberOnlineSum)
      }

      return res
    })
  },
  // 设置群成员名片(B端老师设置成'admin'，这样可以用来识别右键功能)
  // setGroupMemberNameCard({ commit }, { groupId, userId, nameCard }) {
  //   return state.tim.setGroupMemberNameCard({ groupID: groupId, userID: userId, nameCard: nameCard })
  // },
  // 群聊天记录超过阈值就清楚之前得数据
  clearLiveData({ commit }) {
    const liveLength = state.chatView.messageData.length
    if (liveLength >= state.liveDataThreshold) {
      state.chatView.messageData.splice(0, liveLength - state.liveDataThresholdDiscard)
      state.chatView.nextReqMessageID = state.chatView.messageData[state.chatView.messageData.length - 1].id
      state.chatView.isCompleted = false
      console.log(state.chatView, 'state.chatView')
    }
  },
  // 添加系统消息
  sendSysMsg({ commit }, obj) {
    // if (state.liveRoomDetail.isShowNotice === 0) {
    //   return
    // }
    if (state.chatUser.type !== 2) {
      return
    }
    commit('SET_messageData_push', obj)
  },
  // 根据userId获取用户备注
  getTraineeRemarkByUserId({ commit }, { userId, key }) {
    const arr = state.leftList.myTrainees.concat(
      state.leftList.generalTrainees,
      state.leftList.onlineTeachers,
      state.leftList.onlineMyTrainees,
      state.leftList.offMyTrainees,
      state.leftList.onlineGeneralTrainees,
      state.leftList.offGeneralTrainees
    )
    const obj = arr.find(v => v.memberId === userId)
    // console.log(obj, '获取的数据')
    if (!obj || !obj[key]) {
      return ''
    }
    return obj[key]
  },
  // 标记学员颜色
  markUserColor({ commit }, { color, traineeId }) {
    const params = {
      color, traineeId
    }
    return markUserColor(params).then((res) => {
      actions.getmymemberoffline({ commit })
      actions.normalmemberoffline({ commit })
      return actions.getOnlineStudentList({ commit }, { groupId: state.liveGroupDetail.groupID, memberQueryType: state.memberQueryType })
    })
  },
  // 对学员操作-禁言-解除禁言、拉黑并踢出-解除黑名单、自嗨-解除自嗨
  // 1-禁言 2-解除禁言 3-拉黑并踢出 4-解除拉黑 5-自嗨 6-解除自嗨
  operateUserTrainee({ commit }, { groupId, operateType, traineeId }) {
    const params = {
      groupId, operateType, traineeId,
      liveRoomId: state.liveRoomDetail.liveRoomId
    }
    return userTrainee(params).then((res) => {
      actions.getmymemberoffline({ commit })
      actions.normalmemberoffline({ commit })
      return actions.getOnlineStudentList({ commit }, { groupId: state.liveGroupDetail.groupID, memberQueryType: state.memberQueryType })
    })
  },
  // 修改学员备注
  updateUserRemarks({ commit }, { remarksInfo, traineeId }) {
    const params = {
      remarksInfo, traineeId,
      liveRoomId: state.liveRoomDetail.liveRoomId
    }
    return updateUserRemarks(params).then((res) => {
      actions.getmymemberoffline({ commit })
      actions.normalmemberoffline({ commit })
      return actions.getOnlineStudentList({ commit }, { groupId: state.liveGroupDetail.groupID, memberQueryType: state.memberQueryType })
    })
  },
  // 设置用户资料
  updateMyProfile({ commit }, { nick }) {
    console.log('设置用户资料')
    return state.tim.updateMyProfile({ nick })
  },
  ifSendMessageReadReceipt({ commit }) {
    // 如果当前聊天对象为私聊，判断是否有会话，需要将会话设置为已读
    if ([1, 3].includes(state.chatUser.type)) {
      const obj = state.conversationList.find(v => {
        return v.toAccount === state.chatUser.userId
      })
      console.log(obj, '判断是否发送已读回执')
      obj && actions.sendMessageReadReceipt(obj.conversationID)
    }
  },
  // 查询互动脚本数据
  getGroupScript({ commit }, liveRoomId) {
    if (state.liveRoomDetail.liveModel === 'PERSON_LIVE' || state.liveRoomDetail.status === 9) {
      // 真人直播，直播结束，互动脚本都停止不展示
      return commit('set_scriptSetting', {
        isRelateScript: false, // 是否引用脚本 true是 false否
        delayTime: 0, // 脚本互动延时时间
        scriptInteractStatus: 1 // 脚本互动状态 1正常互动 2暂停互动
      })
    }
    const data = {
      liveRoomId: liveRoomId
    }
    return getGroupScript(data).then(res => {
      commit('set_scriptSetting', res.data)
      return res
    })
  },
  // 获取敏感词配置
  getLiveSensitiveSetting({ commit }) {
    return getSensitiveSettingsAjax().then(res => {
      if (res.code === 1) {
        commit('set_liveSensitiveSetting', res.data)
        return res.data
      }
    })
  },
  // 过滤手机号
  getFiltersTextPhone: ({ commit }, data, type) => {
    const { filtrationPhoneNum, workToSpeRole } = state.liveSensitiveSetting
    const teacherId = type === 'messageForShow' ? data.lastMessage.fromAccount : data.message.from
    const isTeacher = !Number.isNaN(Number(teacherId)) // 老师
    // 过滤手机号
    if ((filtrationPhoneNum && !isTeacher) || (workToSpeRole && isTeacher)) {
      if (type === 'text') {
        data.message.payload.text = filtersTextPhone(data.message?.payload?.text)
      } else if (type === 'messageForShow') {
        data.lastMessage.messageForShow = filtersTextPhone(data.lastMessage?.messageForShow)
      }
    }
    return data
  },

  // 信令通道初始化
  tsignalingInit({ commit }) {
    // const options = {
    //   SDKAppID: state.imConfig.SDKAppID // 接入时需要将0替换为您的云通信应用的 SDKAppID
    // }
    // state.tsignaling = new TSignaling(options)
    // state.tsignaling.setLogLevel(4)
    // const onSdkReady = function (event) {
    //   console.log('信令 进入ready 状态时触发')
    // }
    // state.tsignaling.on(TSignaling.EVENT.SDK_READY, onSdkReady)
    // const onMessageReceived = function (event) {
    //   console.log('收到的信令自定义消息', event.data)
    //   const messageList = event.data
    //   messageList.forEach((message) => {
    //     if (message.payload.data === '1') {
    //       // 删除群会话信令消息
    //       if (message.to !== state.liveRoomDetail.groupId) return
    //       const extension = JSON.parse(message.payload.extension)
    //       const obj = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.find(v => v.id === extension.messageId)
    //       obj.message.isRevoked = true
    //     } else if (message.payload.data === '2') {
    //       const ifToGroup = message.to === state.liveRoomDetail.groupId
    //       if (!ifToGroup) {
    //         return
    //       }
    //       const extension = JSON.parse(message.payload.extension)
    //       const obj = {
    //         id: message.ID,
    //         type: '3', // 1: 普通文本，2：'图片', 3: '系统消息'
    //         content: `${message.nick} 领取了${extension.content}优惠券`, // 内容
    //         ifSend: false, // 是否发送中
    //         error: false, // 是否错误
    //         isMine: false,
    //         message: message
    //       }
    //       actions.sendSysMsg({ commit }, obj)
    //     }
    //   })
    // }
    // state.tsignaling.on(TSignaling.EVENT.CUSTOM_MESSAGE_RECEIVED, onMessageReceived)
    // return actions.getUserSig(state.imUserInfo.userId).then(res => {
    //   const userSig = res.data
    //   return state.tsignaling.login({ userID: state.imUserInfo.userId, userSig }).then(res => {
    //     return state.tsignaling.joinGroup(state.liveRoomDetail.groupId).then(function (imResponse) {
    //       switch (imResponse.data.status) {
    //         case TSignaling.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
    //           break
    //         case TSignaling.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
    //           console.log(imResponse.data.group, '加群成功') // 加入的群组资料
    //           break
    //         case TSignaling.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
    //           console.log(imResponse.data.group, '已经在群中')
    //           break
    //         default:
    //           break
    //       }
    //     })
    //   }).catch(() => {
    //     console.log('信令登录失败')
    //   })
    // })
  },

  // 发送自定义消息
  sendTsignalMessage({ commit }, { data, description, extension }) {
    // 创建消息实例，接口返回的实例可以上屏
    const message = state.tim.createCustomMessage({
      to: state.liveRoomDetail.groupId,
      conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
      payload: {
        data,
        description,
        extension: JSON.stringify(extension)
      },
      priority: TIM.TYPES.MSG_PRIORITY_HIGH
    })
    // 发送消息
    const promise = state.tim.sendMessage(message)
    return promise.then(function (imResponse) {
      // 发送成功
      console.log(imResponse)
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError)
    })
  },
  // 单人聊天删除消息
  deleteMessage({ commit }, message) {
    return state.tim.revokeMessage(message).then(res => {
      console.log('删除消息成功')
    })
  },
  // 单人聊天发送优惠券
  sendCoupon({ commit }, { data, res }) {
    return new Promise((resolve, reject) => {
      if (!state.chatUser.userId) {
        return reject()
      }
      console.log(state.imUserInfo, 'imUserInfo')
      const { filtrationType } = state.liveSensitiveSetting
      // 数字不送审
      const isExamine = true

      const cloudCustomData = {
        hokMsgType: 6,
        roleId: state.imUserInfo.roleId,
        data: data
      }
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = state.tim.createTextMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          text: '[优惠券消息]'
        },
        cloudCustomData: JSON.stringify(cloudCustomData),
        // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
        needReadReceipt: state.chatUser.type === 1
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      })
      const obj = {
        id: message.sequence,
        type: '1', // 1: 普通文本，2：'图片', 3: '系统消息'
        isMine: message.from === state.imUserInfo.userId,
        ifSend: true, // 是否发送中
        error: false,
        message
      }
      // commit('SET_messageData_push', obj)
      console.log(message, 'message +++++++++++++++++++++++++++++++')
      // 2. 发送消息
      state.tim.sendMessage(message, {
        messageControlInfo: {
          // 是否审核
          excludedFromContentModeration: isExamine
        }
      }).then(function (imResponse) {
        // 发送成功
        commit('SET_messageData_push', obj)
        const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
        index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
        resolve(res)
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        if (imError?.code === 80001) {
          // 命中敏感词
          if (filtrationType === 2) {
            // 消息将仅发言人可见
            commit('SET_messageData_push', obj)
            const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
            index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          } else {
            Message({ message: '消息含敏感词', type: 'error', duration: 5 * 1000 })
          }
        } else {
          commit('SET_messageData_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
        }
        reject(imError)
      })
    })
  },
  CloseReply({ commit }) {
    // 清空回复
    const data = {
      messageFeature: { needTyping: 0, version: 0 },
      messageReply: {
        cloudCustomData: '',
        messageAbstract: '', // 发送的消息内容
        messageSender: '', // 发送者ID
        messageSenderName: '', // 发送者姓名
        messageID: '',
        messageType: '', // 消息类型 1: 文本 3: 图片
        version: 0
      },
      payload: {}
    }
    commit('SET_replySetting', { key: 'data', data: data })
    commit('SET_replySetting', { key: 'ifReply', data: false })
  },
  // 单人聊天发送商品
  sendGoods({ commit }, { data }) {
    return new Promise((resolve, reject) => {
      if (!state.chatUser.userId) {
        return reject()
      }
      console.log(state.imUserInfo, 'imUserInfo')
      const { filtrationType } = state.liveSensitiveSetting
      // 数字不送审
      const isExamine = true

      const cloudCustomData = {
        hokMsgType: 7,
        roleId: state.imUserInfo.roleId,
        data: data
      }
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = state.tim.createTextMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          text: '[商品消息]'
        },
        cloudCustomData: JSON.stringify(cloudCustomData),
        // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
        needReadReceipt: state.chatUser.type === 1
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      })
      const obj = {
        id: message.sequence,
        type: '1', // 1: 普通文本，2：'图片', 3: '系统消息'
        isMine: message.from === state.imUserInfo.userId,
        ifSend: true, // 是否发送中
        error: false,
        message
      }
      // commit('SET_messageData_push', obj)
      console.log(message, 'message +++++++++++++++++++++++++++++++')
      // 2. 发送消息
      state.tim.sendMessage(message, {
        messageControlInfo: {
          // 是否审核
          excludedFromContentModeration: isExamine
        }
      }).then(function (imResponse) {
        // 发送成功
        commit('SET_messageData_push', obj)
        const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
        index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
        resolve()
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        if (imError?.code === 80001) {
          // 命中敏感词
          if (filtrationType === 2) {
            // 消息将仅发言人可见
            commit('SET_messageData_push', obj)
            const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
            index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          } else {
            Message({ message: '消息含敏感词', type: 'error', duration: 5 * 1000 })
          }
        } else {
          commit('SET_messageData_push', obj)
          const index = state[state.chatUser.type === 2 ? 'chatView' : 'privateChatView'].messageData.findIndex(v => v.id === obj.id)
          index > -1 && commit('SET_messageData_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('SET_messageData_updata', { index, key: 'error', value: true })
        }
        reject(imError)
      })
    })
  },
  // 直播间数据变化处理

  // 获取直播间历史聊天记录
  getChatRecordPage({ commit }, msgSeq) {
    const groupId = state.liveRoomDetail.groupId
    const params = {
      groupId,
      msgSeq,
      onlyInviteStudent: state.ifReadStudent
    }
    return chatRecordPageAjax(params).then((res) => {
      console.log(res, '获取直播间聊天消息数据')
      const arr = res.data.reduce((pre, next) => {
        const imageMsgContent = {
          imageInfoArray: [{
            imageUrl: next.msgBody[0].imageMsgContent?.origImage?.url,
            height: next.msgBody[0].imageMsgContent?.origImage?.height
          }]
        }
        const cloudCustomData = next.cloudCustomData && JSON.parse(next.cloudCustomData)
        const roleId = cloudCustomData ? cloudCustomData.roleId : ''
        pre.push({
          id: next.msgSeq,
          msgSeq: next.msgSeq,
          ifRobot: /^(?=IR-)/.test(next.fromUserId),
          type: { 'TIMTextElem': '1', 'TIMImageElem': '2' }[next.msgBody[0].msgType], // 1: 普通文本，2：'图片'
          ifSend: false, // 是否发送中
          error: false, // 是否错误
          isMine: next.fromUserId === state.imUserInfo.userId,
          roleId,
          message: {
            ID: next.msgSeq,
            type: next.msgBody[0].msgType,
            from: next.fromUserId,
            cloudCustomData: next.cloudCustomData,
            payload: { 'TIMTextElem': next.msgBody[0].textMsgContent, 'TIMImageElem': imageMsgContent }[next.msgBody[0].msgType],
            avatar: next.fromUserPic,
            conversationID: `GROUP${groupId}`,
            isSystemMessage: false,
            to: groupId,
            isDeleted: false,
            isRead: true,
            isRevoked: false,
            sequence: next.msgSeq,
            time: '',
            nick: next.fromUserName
          },
          memberId: next.fromUserId,
          memberName: next.fromUserName,
          traineeRemark: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'traineeRemark' }),
          memberPic: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'memberPic' }),
          memberType: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'memberType' })
        })
        return pre
      }, [])
      arr.map(v => {
        commit('SET_messageData_unshift', v)
      })
      const isCompleted = arr.length === 0
      commit('set_isCompleted', isCompleted)
    })
  },

  refreshChatRecord({ commit }) {
    const groupId = state.liveRoomDetail.groupId
    const params = { groupId, msgSeq: '', onlyInviteStudent: state.ifReadStudent }
    return chatRecordPageAjax(params).then((res) => {
      const arr = res.data.reduce((pre, next) => {
        const imageMsgContent = {
          imageInfoArray: [{
            imageUrl: next.msgBody[0].imageMsgContent?.origImage?.url,
            height: next.msgBody[0].imageMsgContent?.origImage?.height
          }]
        }
        const cloudCustomData = next.cloudCustomData && JSON.parse(next.cloudCustomData)
        const roleId = cloudCustomData ? cloudCustomData.roleId : ''
        pre.push({
          id: next.msgSeq,
          msgSeq: next.msgSeq,
          ifRobot: /^(?=IR-)/.test(next.fromUserId),
          type: { 'TIMTextElem': '1', 'TIMImageElem': '2' }[next.msgBody[0].msgType], // 1: 普通文本，2：'图片'
          ifSend: false, // 是否发送中
          error: false, // 是否错误
          isMine: next.fromUserId === state.imUserInfo.userId,
          roleId,
          message: {
            ID: next.msgSeq,
            type: next.msgBody[0].msgType,
            from: next.fromUserId,
            cloudCustomData: next.cloudCustomData,
            payload: { 'TIMTextElem': next.msgBody[0].textMsgContent, 'TIMImageElem': imageMsgContent }[next.msgBody[0].msgType],
            avatar: next.fromUserPic,
            conversationID: `GROUP${groupId}`,
            isSystemMessage: false,
            to: groupId,
            isDeleted: false,
            isRead: true,
            isRevoked: false,
            sequence: next.msgSeq,
            time: '',
            nick: next.fromUserName
          },
          memberId: next.fromUserId,
          memberName: next.fromUserName,
          traineeRemark: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'traineeRemark' }),
          memberPic: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'memberPic' }),
          memberType: actions.getTraineeRemarkByUserId({ commit }, { userId: next.fromUserId, key: 'memberType' })
        })
        return pre
      }, [])
      commit('SET_messageData', [])
      arr.map(v => {
        commit('SET_messageData_unshift', v)
      })
      const isCompleted = arr.length === 0
      commit('set_isCompleted', isCompleted)
    })
  },
  // 群消息撤回
  groupMsgRecall({ commit }, msgSeq) {
    const params = {
      groupId: state.liveRoomDetail.groupId,
      msgSeq: msgSeq
    }
    return groupMsgRecallAjax(params).then((res) => {
      if (!res) {
        Message.error({ message: '删除失败' })
      } else {
        console.log(msgSeq, 'msgSeq')
        commit('chatListArr_del', { id: msgSeq })
      }
    })
  },

  // 直播间B端操作日志
  operationLogsWrite({ commit }, val) {
    return operationLogsWriteAjax(val)
  },
  // 直播间B端操作日志2
  sysUserWrite({ commit }, val) {
    return sysUserWrite(val)
  },
  // 获取直播间自嗨设置
  getLiveRoomAmuse({ commit }, liveRoomId) {
    getLiveRoomAmuse({ liveRoomId }).then(res => {
      commit('SET_selfHiSettings', res.data)
    })
  },
  // 获取在线学员列表数据，在线老师数据
  getOnlineStudentList({ commit }, val) {
    const data = {
      groupId: state.liveRoomDetail.groupId,
      liveRoomId: state.liveRoomDetail.liveRoomId
    }
    return Promise.all([
      normalmemberonline(data),
      mymemberonline(data),
      teacheronline(data)
    ]).then(result => {
      console.log(result, '获取在线学员列表数据，在线老师数据res+++++')
      result.map((res, index) => {
        res.data.map(item => {
          item.id = item.memberId
          const obj = state.conversationList.find(v => {
            return v.toAccount === item.memberId
          }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
          // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
          item['message'] = obj
          item['isVisitor'] = item.memberType === 4
        })
        index === 0 && commit('SET_onlineGeneralTrainees', res.data)
        index === 1 && commit('SET_onlineMyTrainees', res.data)
        index === 2 && commit('SET_onlineTeachers', res.data)
      })
    })
  },
  // 获取我的学员离线列表数据
  getmymemberoffline({ commit }, val) {
    const data = {
      groupId: state.liveRoomDetail.groupId,
      liveRoomId: state.liveRoomDetail.liveRoomId
    }
    return mymemberoffline(data).then(res => {
      res.data.map(item => {
        item.id = item.memberId
        const obj = state.conversationList.find(v => {
          return v.toAccount === item.memberId
        }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
        item['message'] = obj
        item['isVisitor'] = item.memberType === 4
      })
      commit('SET_offMyTrainees', res.data)
    })
  },
  // 获取普通学员离线列表数据
  normalmemberoffline({ commit }, val) {
    const data = {
      groupId: state.liveRoomDetail.groupId,
      liveRoomId: state.liveRoomDetail.liveRoomId
    }
    return normalmemberoffline(data).then(res => {
      res.data.map(item => {
        item.id = item.memberId
        const obj = state.conversationList.find(v => {
          return v.toAccount === item.memberId
        }) || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        // const filterData = actions.getFiltersTextPhone({ state }, obj, 'messageForShow')
        item['message'] = obj
        item['isVisitor'] = item.memberType === 4
      })
      commit('SET_offGeneralTrainees', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
