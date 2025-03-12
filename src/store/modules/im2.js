// im即时通信
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import { genTestUserSig } from '@/views/test/imTest/GenerateTestUserSig'
import { Message } from 'element-ui'
import { getMyLiveRoom } from '@/api/liveRoom/index.js'
import { getUserSig, groupOnlineCount, getLeftList } from '@/api/liveRoom/im.js'
const state = {
  tim: null,
  // im基础属性
  imConfig: {
    SDKAppID: 1400799041, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    secretKey: 'b476e64a52c80fbae45513b7c9178451fd689f3fa07d338901a7c7eb11bd3bbb',
    imReady: false // 系统是否初始化成功
  },
  // 用户信息(当前登录人)
  imUserInfo: {
    userId: '', // 当前的用户userId
    nick: '',
    userSig: '', // 用户通信密码
    ifLogin: false, // 是否登录
    liveRoom: '' // 当前所在直播间
  },
  chatUser: { // 当前聊天对象,type为1表示学员私聊，type为2表示聊天室，type为3表示老师私聊
    type: '',
    userId: '',
    userName: '',
    conversationID: ''
  },
  // 个人会话数据(im)
  conversationList: [],
  // 直播间会话数据(im)
  AVliveRoomConversationList: [],
  // 系统消息会话数据(im)
  systemConversationList: [],
  // 直播间详情数据
  liveRoomDetail: {},
  // 公共直播间(直播群)数据(im+系统数据)
  groupDetail: {},
  // 当前人的聊天数据
  chatListArr: [],
  // 全部未读消息数量
  totalUnreadCount: 0,
  // 人员列表数据
  personnelList: [],
  // 在线老师
  onlineTeachers: [],
  // 我的学员
  myTrainees: [],
  // 普通学员
  generalTrainees: [],
  // 单人会话数据列表
  isCompleted: false, // 是否加载完全
  nextReqMessageID: '', // 下一个请求的messageId
  ifScrollBottom: false // 是否能滚动到底部
}

const mutations = {
  SET_tim: (state, data) => {
    state.tim = data
  },
  SET_imConfig: (state, { data, key }) => {
    state.imConfig[key] = data
  },
  SET_imUserInfo: (state, { data, key }) => {
    state.imUserInfo[key] = data
  },
  SET_groupDetail: (state, data) => {
    state.groupDetail = data
  },
  // 会话列表更新，type: GROUP 群消息 @TIM#SYSTEM 系统消息 C2C 个人消息
  SET_conversationList: (state, data) => {
    const conversationList = []
    const AVliveRoomConversationList = []
    const systemConversationList = []
    data.map((v) => {
      if (v.type === 'GROUP') {
        AVliveRoomConversationList.push(v)
      } else if (v.type === '@TIM#SYSTEM') {
        systemConversationList.push(v)
      } else if (v.type === 'C2C') {
        conversationList.push(v)
      }
    })
    state.conversationList = conversationList
    state.AVliveRoomConversationList = AVliveRoomConversationList
    state.systemConversationList = systemConversationList
  },
  SET_chatListArr: (state, data) => {
    state.chatListArr = data
  },
  SET_chatUser: (state, data) => {
    state.chatListArr = []
    state.chatUser = data
  },
  chatListArr_push: (state, data) => {
    if (data.conversationID === state.chatUser.conversationID) {
      const index = state.chatListArr.findIndex(v => v.id === data.id)
      index === -1 && state.chatListArr.push(data)
    }
  },
  chatListArr_unshift: (state, data) => {
    state.chatListArr.unshift(data)
  },
  chatListArr_updata: (state, { index, key, value }) => {
    state.chatListArr[index][key] = value
  },
  chatListArr_updataById: (state, { item, key, value }) => {
    const index = state.chatListArr.findIndex(v => v.id === item.id)
    index > -1 && (state.chatListArr[index][key] = value)
  },
  setGroupDetail: (state, { key, value }) => {
    state.groupDetail[key] = value
  },
  chatListArr_del: (state, item) => {
    const index = state.chatListArr.findIndex(v => v.id === item.id)
    index > -1 && state.chatListArr.splice(index, 1)
  },
  set_totalUnreadCount: (state, data) => {
    state.totalUnreadCount = data
  },
  set_isCompleted: (state, data) => {
    state.isCompleted = data
  },
  set_nextReqMessageID: (state, data) => {
    state.nextReqMessageID = data
  },
  set_ifScrollBottom: (state, data) => {
    state.ifScrollBottom = data
  },
  set_liveRoomDetail: (state, data) => {
    state.liveRoomDetail = data
  },
  set_onlineTeachers: (state, data) => {
    state.onlineTeachers = data
  },
  set_myTrainees: (state, data) => {
    state.myTrainees = data
  },
  set_generalTrainees: (state, data) => {
    state.generalTrainees = data
  }
}

const actions = {
  // 获取userSig
  getUserSig(userId) {
    const params = {
      userId: userId
    }
    return getUserSig(params)
  },
  // 初始化
  imInit({ commit }, userId) {
    return new Promise((resolve, reject) => {
      commit('SET_imUserInfo', { key: 'userId', data: userId })
      state.tim = TIM.create(state.imConfig)
      // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel 接口的说明</a>
      state.tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
      // state.tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
      // 注册腾讯云即时通信 IM 上传插件
      state.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
      actions.imLogin({ commit }, userId)
      const onSdkReady = function(event) {
        console.log('SDK 进入ready 状态时触发')
        commit('SET_imConfig', { key: 'imReady', data: true })
        actions.getConversationList()
        resolve()
      }
      state.tim.on(TIM.EVENT.SDK_READY, onSdkReady)

      // SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
      const onSdkNotReady = function(event) {
        console.log('SDK 进入 not ready 状态时触发')
      }
      state.tim.on(TIM.EVENT.SDK_NOT_READY, onSdkNotReady)

      // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息，接入侧可通过遍历 event.data 获取消息列表数据并渲染到页面
      const onMessageReceived = function(event) {
        console.log('SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息', event)
        //   _this.list.push(event.data[0])
        const messageList = event.data
        messageList.forEach((message) => {
          if (message.type === TIM.TYPES.MSG_TEXT) {
            console.log('文本消息', message)
            const obj = {
              id: message.ID,
              type: '1', // 1: 普通文本，2：'图片'
              content: message.payload.text, // 内容
              name: message.nick || message.from,
              userId: message.from,
              avatar: '', // 头像
              role: message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
              roleText: message.from === state.imUserInfo.userId ? '本人' : '学员',
              isMine: message.from === state.imUserInfo.userId,
              conversationID: message.conversationID,
              item: message.time,
              isPeerRead: message.isPeerRead,
              message: message
            }
            commit('chatListArr_push', obj)
            //   _this.list.push(message)
            // 文本消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.TextPayload
          } else if (message.type === TIM.TYPES.MSG_IMAGE) {
            const obj = {
              id: message.ID,
              type: '2', // 1: 普通文本，2：'图片'
              content: message.payload.imageInfoArray, // 内容
              name: message.nick || message.from,
              userId: message.from,
              avatar: '', // 头像
              role: message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
              roleText: message.from === state.imUserInfo.userId ? '本人' : '学员',
              isMine: message.from === state.imUserInfo.userId,
              conversationID: message.conversationID,
              item: message.time,
              isPeerRead: message.isPeerRead,
              message: message
            }
            commit('chatListArr_push', obj)
            // 图片消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.ImagePayload
          } else if (message.type === TIM.TYPES.MSG_SOUND) {
            // 音频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.AudioPayload
          } else if (message.type === TIM.TYPES.MSG_VIDEO) {
            // 视频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.VideoPayload
          } else if (message.type === TIM.TYPES.MSG_FILE) {
            // 文件消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.FilePayload
          } else if (message.type === TIM.TYPES.MSG_CUSTOM) {
            // 自定义消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.CustomPayload
          } else if (message.type === TIM.TYPES.MSG_MERGER) {
            // 合并消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.MergerPayload
          } else if (message.type === TIM.TYPES.MSG_LOCATION) {
            // 地理位置消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.LocationPayload
          } else if (message.type === TIM.TYPES.MSG_GRP_TIP) {
            // 群提示消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupTipPayload
            console.log('群提示消息', message)
            //   _this.list.push(message)
            const obj = {
              id: message.ID,
              type: '1', // 1: 普通文本，2：'图片'
              content: `系统消息:${message.nick}${message.payload.groupJoinType === 1 ? '加入' : '离开'}群聊`, // 内容
              ifSystem: true,
              conversationID: message.conversationID,
              item: message.time,
              isPeerRead: message.isPeerRead,
              message: message
            }
            commit('chatListArr_push', obj)
          } else if (message.type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
            // 群系统通知 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupSystemNoticePayload
          }
        })
        // event.data - 存储 Message 对象的数组 - [Message]
      }
      state.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived)

      // SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
      const onMessageModified = function(event) {
        // event.data - 存储被修改过的 Message 对象的数组 - [Message]
      }
      state.tim.on(TIM.EVENT.MESSAGE_MODIFIED, onMessageModified)

      // SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。
      const onMessageRevoked = function(event) {
        // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      }
      state.tim.on(TIM.EVENT.MESSAGE_REVOKED, onMessageRevoked)

      // SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。
      const onMessageReadByPeer = function(event) {
        console.log('SDK 收到对端已读消息的通知，即已读回执。', event)
        // event.data - 存储消息已读回执信息的数组
        const readReceiptInfoList = event.data
        readReceiptInfoList.forEach((item) => {
          const { ID } = item
          const index = state.chatListArr.findIndex(v => v.id === ID)
          index > -1 && (commit('chatListArr_updata', { index: index, key: 'isPeerRead', value: true }))
        })
        //   _this.list.push(event.data[0])
        // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
      }
      state.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer)

      // 会话列表更新，event.data 是包含 Conversation 对象的数组
      const onConversationListUpdated = function(event) {
        console.log('会话列表更新', event.data.length, event.data) // 包含 Conversation 实例的数组
        commit('SET_conversationList', event.data)
        actions.getTotalUnreadMessageCount({ commit })
        //   _this.list = event.data[0]
      }
      state.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated)

      // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
      const onGroupListUpdated = function(event) {
        console.log(event.data)// 包含 Group 实例的数组
      }
      state.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated)

      // 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
      const onGroupAttributesUpdated = function(event) {
        // const groupID = event.data.groupID // 群组ID
        // const groupAttributes = event.data.groupAttributes // 更新后的群属性
        console.log('群属性更新时触发，可通过', event.data)
      }
      state.tim.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated)

      // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
      const onProfileUpdated = function(event) {
        console.log(event.data) // 包含 Profile 对象的数组
      }
      state.tim.on(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated)

      // SDK 黑名单列表更新时触发
      const onBlacklistUpdated = function(event) {
        console.log(event.data) // 我的黑名单列表，结构为包含用户 userID 的数组
      }
      state.tim.on(TIM.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated)

      // 好友列表更新时触发
      const onFriendListUpdated = function(event) {
        console.log(event.data)
      }
      state.tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated)

      // 好友分组列表更新时触发
      const onFriendGroupListUpdated = function(event) {
        console.log(event.data)
      }
      state.tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, onFriendGroupListUpdated)

      // 用户被踢下线时触发
      const onKickedOut = function(event) {
        console.log(event.data.type)
        // TIM.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一帐号，多页面登录被踢)
        // TIM.TYPES.KICKED_OUT_MULT_DEVICE(同一帐号，多端登录被踢)
        // TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
        // TIM.TYPES.KICKED_OUT_REST_API(REST API kick 接口踢出。v2.20.0起支持)
      }
      state.tim.on(TIM.EVENT.KICKED_OUT, onKickedOut)

      // 网络状态发生改变
      const onNetStateChange = function(event) {
        // v2.5.0 起支持
        // event.data.state 当前网络状态，枚举值及说明如下：
        // TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
        // TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
        // TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
      }
      state.tim.on(TIM.EVENT.NET_STATE_CHANGE, onNetStateChange)

      // 会话未读总数更新
      const onTotalUnreadMessageCountUpdated = function (event) {
        console.log('会话未读总数更新', event)
      }
      state.tim.on(TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, onTotalUnreadMessageCountUpdated)
    })
  },
  // 登录
  imLogin({ commit }, userId) {
    console.log('登录userId', userId)
    if (!userId) {
      return new Error('缺少userId')
    }
    console.log(genTestUserSig, 'genTestUserSig')
    this.getUserSig(userId).then(res => {
      const userSig = res.data
      console.log(userSig, 'userSig')
      return state.tim.login({ userID: userId, userSig: userSig }).then((imResponse) => {
        commit('SET_imUserInfo', { key: 'ifLogin', data: true })
        console.log('登录成功', imResponse.data) // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
          //   console.log('提示', imResponse.data.errorInfo)
          //   _this.$message.warning(imResponse.data.errorInfo)
          actions.imLoginOut({ commit }).then(() => {
            actions.imLogin({ commit }, userId)
          })
        }
      })
    }).catch(function(imError) {
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
    }).catch(function(imError) {
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
      console.log(conversationList, isSyncCompleted, '获取全量的会话列表')
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 发送图片
  sendPic({ commit }, result) {
    return new Promise((resolve, reject) => {
      const message = state.tim.createImageMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        payload: { file: result.data },
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
        onProgress: function(event) { console.log('file uploading:', event) }
      })
      const obj = {
        id: message.ID,
        type: '2', // 1: 普通文本，2：'图片'
        content: [{ imageUrl: result.url }, { imageUrl: result.url }], // 内容
        name: message.nick || message.from,
        userId: message.from,
        avatar: '', // 头像
        role: message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
        roleText: message.from === state.imUserInfo.userId ? '本人' : '学员',
        isMine: message.from === state.imUserInfo.userId,
        conversationID: message.conversationID,
        isPeerRead: message.isPeerRead,
        ifSend: true, // 是否发送中
        file: result.file,
        error: false
      }
      commit('chatListArr_push', obj)
      state.tim.sendMessage(message).then(function(imResponse) {
        // 发送成功
        console.log('发送成功', imResponse)
        const index = state.chatListArr.findIndex(v => v.id === obj.id)
        index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        resolve(imResponse)
      }).catch(function(imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        const index = state.chatListArr.findIndex(v => v.id === obj.id)
        index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        index > -1 && commit('chatListArr_updata', { index, key: 'error', value: true })
        reject(imError)
      })
    })
  },
  // 获取直播群
  getGroupById({ commit }, groupId) {
    return state.tim.searchGroupByID(groupId).then((imResponse) => {
      const group = imResponse.data.group // 群组信息
      console.log(group, '群组信息')
      group.currentOnlineCount = 1
      group.adjustCount = 1
      group.generalTraineesOnlineSum = 0
      group.myTraineesOnlineSum = 0
      commit('SET_groupDetail', group)
      return actions.joinGroup(groupId).then(() => {
        actions.getGroupOnlineMemberCount({ commit })
        actions.getGroupProfile({ commit }, groupId)
      })
    }).catch(function(imError) {
      console.warn('searchGroupByID error:', imError) // 搜素群组失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 加入直播群
  joinGroup(groupId) {
    // 加入群聊
    return state.tim.joinGroup({ groupID: groupId }).then(function(imResponse) {
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
    }).catch(function(imError) {
      console.warn('joinGroup error:', imError) // 申请加群失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 获取单人聊天消息数据
  getMessageList({ commit }, conversationID) {
    // commit('SET_chatListArr', [])
    const params = {
      conversationID: conversationID,
      count: 15,
      direction: 0
    }
    if (state.nextReqMessageID && !state.isCompleted) { params.nextReqMessageID = state.nextReqMessageID }
    return state.tim.getMessageList(params).then((imResponse) => {
      console.log(imResponse, '获取单人聊天消息数据')
      const arr = imResponse.data.messageList.reduce((pre, next) => {
        pre.push({
          id: next.ID,
          type: { 'TIMTextElem': '1', 'TIMImageElem': '2' }[next.type], // 1: 普通文本，2：'图片'
          content: next.payload.text || next.payload.imageInfoArray, // 内容
          name: next.nick || next.from,
          userId: next.from,
          avatar: '', // 头像
          role: next.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
          roleText: next.from === state.imUserInfo.userId ? '本人' : '学员',
          isMine: next.from === state.imUserInfo.userId,
          time: next.time, // 发送时间
          isPeerRead: next.isPeerRead,
          message: next
        })
        return pre
      }, [])
      arr.map(v => {
        commit('chatListArr_unshift', v)
      })
      commit('set_isCompleted', imResponse.data.isCompleted)
      commit('set_nextReqMessageID', imResponse.data.nextReqMessageID)
      actions.sendMessageReadReceipt(conversationID)
    })
  },
  // 发送普通文本消息
  sendMessage({ commit }, myMessage) {
    return new Promise((resolve, reject) => {
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = state.tim.createTextMessage({
        to: state.chatUser.userId,
        conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          text: myMessage
        },
        // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
        needReadReceipt: state.chatUser.type === 1
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      })
      const obj = {
        id: message.ID,
        type: '1', // 1: 普通文本，2：'图片'
        content: message.payload.text, // 内容
        name: message.nick || message.from,
        userId: message.from,
        avatar: '', // 头像
        role: message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
        roleText: message.from === state.imUserInfo.userId ? '本人' : '学员',
        isMine: message.from === state.imUserInfo.userId,
        conversationID: message.conversationID,
        isPeerRead: message.isPeerRead,
        ifSend: true, // 是否发送中
        error: false
      }
      commit('chatListArr_push', obj)
      console.log(message, 'message +++++++++++++++++++++++++++++++')
      // 2. 发送消息
      state.tim.sendMessage(message).then(function(imResponse) {
        // 发送成功
        console.log(imResponse)
        const index = state.chatListArr.findIndex(v => v.id === obj.id)
        index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        resolve(imResponse)
      }).catch(function(imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
        const index = state.chatListArr.findIndex(v => v.id === obj.id)
        index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        index > -1 && commit('chatListArr_updata', { index, key: 'error', value: true })
        reject(imError)
      })
    })
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
  // 退出群聊
  leaveLiveRoom({ commit }, groupId) {
    console.log(groupId, 'groupId')
    return state.tim.quitGroup(groupId).then(function(imResponse) {
      console.log(imResponse.data.groupID) // 退出成功的群 ID
      commit('SET_chatListArr', [])
      commit('SET_chatUser', { type: '', userId: '', userName: '', conversationID: '' })
    }).catch(function(imError) {
      console.warn('quitGroup error:', imError) // 退出群组失败的相关信息
    })
  },
  // 将某会话下的未读消息状态设置为已读
  sendMessageReadReceipt(conversationID) {
    state.tim.setMessageRead({ conversationID: conversationID }).then(function() {
      // 发送消息已读回执成功
      console.log('已读上报成功')
    }).catch(function(imError) {
      // 发送消息已读回执失败
      console.log('已读上报失败', imError)
    })
  },
  // 设置用户资料
  updateMyProfile({ commit }, { nick }) {
    commit('SET_imUserInfo', { key: 'nick', data: nick })
    return state.tim.updateMyProfile({ nick })
  },
  // 获取直播间在线人数
  getGroupOnlineMemberCount({ commit }) {
    if (state.groupDetail.groupID) {
      return groupOnlineCount({ groupId: state.groupDetail.groupID }).then(res => {
        console.log('获取直播间在线人数', res)
        commit('setGroupDetail', { key: 'currentOnlineCount', value: res.data.currentOnlineCount })
        commit('setGroupDetail', { key: 'adjustCount', value: res.data.adjustCount })
      }).catch(() => {
        commit('setGroupDetail', { key: 'adjustCount', value: 60 })
        commit('setGroupDetail', { key: 'currentOnlineCount', value: 10 })
        // console.log(state.groupDetail, 'groupDetail')
      })
    }
  },
  // 重新发送消息
  alignSendMsg({ commit }, item) {
    if (item.type === 1) {
      return new Promise((resolve, reject) => {
        // 1. 创建消息实例，接口返回的实例可以上屏
        const message = state.tim.createTextMessage({
          to: state.chatUser.userId,
          conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text: item.content
          },
          // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
          needReadReceipt: state.chatUser.type === 1
          // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
          // cloudCustomData: 'your cloud custom data'
        })
        // item.ifSend = true
        // 2. 发送消息
        state.tim.sendMessage(message).then(function(imResponse) {
          commit('chatListArr_del', item)
          // 发送成功
          console.log(imResponse)
          resolve(imResponse)
          const obj = {
            id: imResponse.data.message.ID,
            type: '1', // 1: 普通文本，2：'图片'
            content: imResponse.data.message.payload.text, // 内容
            name: item.name,
            userId: imResponse.data.message.from,
            avatar: '', // 头像
            role: imResponse.data.message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
            roleText: imResponse.data.message.from === state.imUserInfo.userId ? '本人' : '学员',
            isMine: imResponse.data.message.from === state.imUserInfo.userId,
            conversationID: message.conversationID,
            isPeerRead: message.isPeerRead,
            ifSend: true,
            error: false
          }
          commit('chatListArr_push', obj)
          const index = state.chatListArr.findIndex(v => v.id === obj.id)
          index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        }).catch(function(imError) {
          // 发送失败
          console.warn('sendMessage error:', imError)
          const index = state.chatListArr.findIndex(v => v.id === item.id)
          index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('chatListArr_updata', { index, key: 'error', value: true })
          reject(imError)
        })
      })
    } else if (item.type === 2) {
      return new Promise((resolve, reject) => {
        // 1. 创建消息实例，接口返回的实例可以上屏
        const message = state.tim.createTextMessage({
          to: state.chatUser.userId,
          conversationType: state.chatUser.type === 2 ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: { file: item.file },
          onProgress: function(event) { console.log('file uploading:', event) }
        })
        // 2. 发送消息
        state.tim.sendMessage(message).then(function(imResponse) {
          commit('chatListArr_del', item)
          // 发送成功
          console.log(imResponse)
          resolve(imResponse)
          const obj = {
            id: message.ID,
            type: '2', // 1: 普通文本，2：'图片'
            content: imResponse.payload.imageInfoArray, // 内容
            name: message.nick || message.from,
            userId: message.from,
            avatar: '', // 头像
            role: message.from === state.imUserInfo.userId ? 2 : 1, // 1.学员2.助教
            roleText: message.from === state.imUserInfo.userId ? '本人' : '学员',
            isMine: message.from === state.imUserInfo.userId,
            conversationID: message.conversationID,
            isPeerRead: message.isPeerRead,
            ifSend: true, // 是否发送中
            error: false
          }
          commit('chatListArr_push', obj)
          const index = state.chatListArr.findIndex(v => v.id === obj.id)
          index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
        }).catch(function(imError) {
          // 发送失败
          console.warn('sendMessage error:', imError)
          const index = state.chatListArr.findIndex(v => v.id === item.id)
          index > -1 && commit('chatListArr_updata', { index, key: 'ifSend', value: false })
          index > -1 && commit('chatListArr_updata', { index, key: 'error', value: true })
          reject(imError)
        })
      })
    }
  },
  // 获取全部未读消息数量
  getTotalUnreadMessageCount({ commit }) {
    if (!state.imConfig.imReady) {
      return
    }
    const totalUnreadCount = state.tim.getTotalUnreadMessageCount()
    commit('set_totalUnreadCount', totalUnreadCount)
  },
  // 获取直播间设置
  getGroupProfile({ commit }, groupID) {
    state.tim.getGroupProfile({ groupID }).then(function(imResponse) {
      console.log(imResponse.data.group, '获取直播间设置')
    }).catch(function(imError) {
      console.warn('getGroupProfile error:', imError) // 获取群详细资料失败的相关信息
      Message({ message: imError, type: 'error', duration: 5 * 1000 })
    })
  },
  // 获取直播间详情数据
  getLiveRoomDetail({ commit }, liveRoomId) {
    const params = {
      liveRoomId
    }
    return getMyLiveRoom(params).then(res => {
      console.log(res, '获取直播间详情数据')
    }).catch(() => {
      const mockData = {
        code: '123',
        createTime: '2023-03-02 16:00:00',
        createUserName: '2023-03-01 14:00:00',
        imgUrl: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
        liveModel: 'PERSON_LIVE',
        liveRoomPersonInfo: {
          broadcastStreamAddr: 'https://dev.live.hokkj.cn/live/kunlun-test.m3u8', // 播流地址
          broadcastStreamSecretKey: '', // 播流秘钥
          groupId: '123', // 直播群Id
          isAllowSendPic: 0, // 是否允许学员发图片
          isShowNotice: '', // 是否显示系统消息
          isShutUp: '', // 是否禁言
          playbackSet: '', // 回放设置: 0无回放 1云端录制
          pushFlowAddr: '', // 推流地址
          pushFlowSecretKey: '' // 推流秘钥
        },
        name: '大白测试直播间',
        realityTeacherUserName: '',
        startTime: '2023-03-04 16:00:00',
        status: 0, // 0：直播未开始 1 ：直播中 9:直播结束
        teacherInfoList: [
          { inviteCode: '', teacherId: '', teacherName: '', teacherRole: '', teacherTel: '' }
        ],
        isShow: 0 // 人数显示 0显示 1不显示
      }
      commit('set_liveRoomDetail', mockData)
    })
  },
  // 获取左侧聊天列表数据
  getLeftList({ commit }, groupID) {
    const params = {
      groupID: groupID,
      memberQueryType: 1
    }
    const mockData = [
      {
        isAmuse: true,
        isOnline: false,
        isShutUp: true,
        listenDuration: 0,
        markType: 0,
        memberId: '100',
        memberName: '刘辉',
        memberPic: '',
        memberType: 1,
        speechTimes: 0
      },
      {
        isAmuse: true,
        isOnline: true,
        isShutUp: false,
        listenDuration: 0,
        markType: 0,
        memberId: '115',
        memberName: 'jiajia',
        memberPic: '',
        memberType: 2,
        speechTimes: 0
      },
      {
        isAmuse: false,
        isOnline: true,
        isShutUp: true,
        listenDuration: 0,
        markType: 0,
        memberId: '1535157661784403969',
        memberName: '张子雄',
        memberPic: '',
        memberType: 1,
        speechTimes: 0
      }
    ]
    getLeftList(params).then(res => {
      console.log(res, '获取左侧列表数据')
      const obj = {
        generalTrainees: res.data.generalTrainees || mockData,
        generalTraineesOnlineSum: res.data.generalTraineesOnlineSum || 0,
        myTrainees: res.data.myTrainees || mockData,
        myTraineesOnlineSum: res.data.myTraineesOnlineSum || 0,
        onlineTeachers: res.data.onlineTeachers || mockData
      }
      commit('set_onlineTeachers', obj.onlineTeachers)
      commit('set_myTrainees', obj.myTrainees)
      commit('set_generalTrainees', obj.generalTrainees)
    }).catch(() => {
      const obj = {
        generalTrainees: [],
        generalTraineesOnlineSum: 0,
        myTrainees: mockData,
        myTraineesOnlineSum: 0,
        onlineTeachers: []
      }
      commit('set_onlineTeachers', obj.onlineTeachers)
      commit('set_myTrainees', obj.myTrainees)
      commit('set_generalTrainees', obj.generalTrainees)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

