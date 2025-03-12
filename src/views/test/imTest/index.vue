<template>
  <MCard>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="腾讯IM测试" name="first">
        <div>腾讯IM测试</div>
        <div v-if="!ifLogin">
          <label>userId:</label><el-input v-model="userID" />
          <el-button @click="loginFn">登录</el-button>
        </div>

        <div v-if="ifLogin">
          <el-button @click="loginOutFn">登出</el-button>
          <div>
            <label>接收消息的userId:</label><el-input v-model="userID2" class="w-200" />
            <div>
              <el-input v-model="myMessage" class="w-200" />
              <el-button @click="sendMessage">发送消息</el-button>
            </div>
          </div>
          <MCard class="m-t-20">
            <div>
              <el-tag v-for="(item, index) in conversationList" :key="index" @click="handleClick(item)">{{ item.toAccount }}</el-tag>
              <el-tag v-if="groupDetail.name" type="warning" @click="joinGroup">{{ groupDetail.name }}</el-tag>
            </div>
            <div>
              <div v-for="(item, index) in list" :key="index" class="messageBox">
                <div>发送者:{{ item.from }}</div>
                <div>接收者:{{ item.to }}</div>
                <div>消息类型: {{ item.type }}</div>
                <div>发送内容:
                  <template v-if="item.type === 'TIMTextElem'">
                    {{ item.payload.text }}
                  </template>
                  <template v-else-if="item.type === 'TIMGroupTipElem'">
                    [系统消息]{{ item.payload.operatorID }}{{ item.payload.groupJoinType === 1 ? '加入' : '离开' }}群聊
                  </template>
                </div>
              </div>
            </div>
          </MCard>
        </div>
      </el-tab-pane>
      <el-tab-pane label="火山播放测试" name="second">
        <div>
          <div>播放测试</div>
          播放地址
          <el-input v-model="videoUrl" class="w-200" />
          <el-button @click="play">播放</el-button>
          <div id="player" class="player-content" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="腾讯云播放器测试" name="third">
        <div>
          播放地址
          <el-input v-model="videoUrl2" class="w-200" />
          <el-button @click="play2">播放</el-button>
          <video id="myVideo" style="width: 100%;height: 600px;background: #010001;" preload="auto" playsinline webkit-playsinline />
        </div>
      </el-tab-pane>
    </el-tabs>
  </MCard>
</template>

<script>
import TIM from 'tim-js-sdk'
import { genTestUserSig } from './GenerateTestUserSig'
export default {
  components: {},
  data() {
    return {
      tim: null,
      options: {
        SDKAppID: 1400799041
      },
      activeName: 'first',
      userID: '',
      userID2: '',
      ifLogin: false,
      imReady: false,
      myMessage: '',
      list: [], // 聊天数据
      conversationList: [], // 会话数据
      conversationId: '', // 会话ID
      groupDetail: { // 直播群聊信息
        name: '',
        groupID: '@TGS#aCETUHMME'
      },
      videoUrl: '',
      videoUrl2: '',
      player2: null,
      playerSdk: {},
      playSpeed: '1.0'
    }
  },
  mounted() {
    this.initPlayer2()
    const _this = this
    this.tim = TIM.create(this.options)
    this.tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
    // this.tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

    const onSdkReady = function(event) {
      console.log('SDK 进入ready 状态时触发')
      _this.imReady = true
      _this.getConversationList()
      _this.getGroupById()
    //   const message = this.createTextMessage({ to: 'user1', conversationType: 'C2C', payload: { text: 'Hello world!' } })
    //   this.sendMessage(message)
    }
    this.tim.on(TIM.EVENT.SDK_READY, onSdkReady)

    // SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
    const onSdkNotReady = function(event) {
      console.log('SDK 进入 not ready 状态时触发')
      //   const { userSig } = genTestUserSig({
      //     SDKAppID: 1400799041,
      //     secretKey: 'b476e64a52c80fbae45513b7c9178451fd689f3fa07d338901a7c7eb11bd3bbb',
      //     userID: _this.userID
      //   })
      //   // 如果想使用发送消息等功能，接入侧需驱动 SDK 进入 ready 状态，重新调用 login 接口即可，如下所示：
      //   _this.tim.login({ userID: _this.userID, userSig: userSig })
    }
    this.tim.on(TIM.EVENT.SDK_NOT_READY, onSdkNotReady)

    // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息，接入侧可通过遍历 event.data 获取消息列表数据并渲染到页面
    const onMessageReceived = function(event) {
      console.log('SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息', event)
      //   _this.list.push(event.data[0])
      const messageList = event.data
      messageList.forEach((message) => {
        if (message.type === TIM.TYPES.MSG_TEXT) {
          console.log('文本消息', message)
          _this.joinMessageData(message)
        //   _this.list.push(message)
          // 文本消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.TextPayload
        } else if (message.type === TIM.TYPES.MSG_IMAGE) {
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
          _this.joinMessageData(message)
        //   _this.list.push(message)
        } else if (message.type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
          // 群系统通知 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupSystemNoticePayload
        }
      })
    // event.data - 存储 Message 对象的数组 - [Message]
    }
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived)

    // SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
    const onMessageModified = function(event) {
    // event.data - 存储被修改过的 Message 对象的数组 - [Message]
    }
    this.tim.on(TIM.EVENT.MESSAGE_MODIFIED, onMessageModified)

    // SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。
    const onMessageRevoked = function(event) {
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    }
    this.tim.on(TIM.EVENT.MESSAGE_REVOKED, onMessageRevoked)

    // SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。
    const onMessageReadByPeer = function(event) {
      console.log('SDK 收到对端已读消息的通知，即已读回执。', event)
    //   _this.list.push(event.data[0])
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    }
    this.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer)

    // 会话列表更新，event.data 是包含 Conversation 对象的数组
    const onConversationListUpdated = function(event) {
      console.log('会话列表更新', event.data.length, event.data) // 包含 Conversation 实例的数组
    //   _this.list = event.data[0]
    }
    this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated)

    // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
    const onGroupListUpdated = function(event) {
      console.log(event.data)// 包含 Group 实例的数组
    }
    this.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated)

    // // 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
    // const onGroupAttributesUpdated = function(event) {
    //   const groupID = event.data.groupID // 群组ID
    //   const groupAttributes = event.data.groupAttributes // 更新后的群属性
    //   console.log(event.data)
    // }
    // this.tim.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated)

    // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
    const onProfileUpdated = function(event) {
      console.log(event.data) // 包含 Profile 对象的数组
    }
    this.tim.on(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated)

    // SDK 黑名单列表更新时触发
    const onBlacklistUpdated = function(event) {
      console.log(event.data) // 我的黑名单列表，结构为包含用户 userID 的数组
    }
    this.tim.on(TIM.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated)

    // 好友列表更新时触发
    const onFriendListUpdated = function(event) {
      console.log(event.data)
    }
    this.tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated)

    // 好友分组列表更新时触发
    const onFriendGroupListUpdated = function(event) {
      console.log(event.data)
    }
    this.tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, onFriendGroupListUpdated)

    // 用户被踢下线时触发
    const onKickedOut = function(event) {
      console.log(event.data.type)
      // TIM.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一帐号，多页面登录被踢)
      // TIM.TYPES.KICKED_OUT_MULT_DEVICE(同一帐号，多端登录被踢)
      // TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
      // TIM.TYPES.KICKED_OUT_REST_API(REST API kick 接口踢出。v2.20.0起支持)
    }
    this.tim.on(TIM.EVENT.KICKED_OUT, onKickedOut)

    // 网络状态发生改变
    const onNetStateChange = function(event) {
      // v2.5.0 起支持
      // event.data.state 当前网络状态，枚举值及说明如下：
      // TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      // TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      // TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
    }
    this.tim.on(TIM.EVENT.NET_STATE_CHANGE, onNetStateChange)
  },
  destroyed() {
    this.destroyPlayer()
  },
  methods: {
    loginFn() {
      if (!this.userID) {
        return this.$message.error('请输入userId')
      }
      const _this = this
      const { userSig } = genTestUserSig({
        SDKAppID: 1400799041,
        secretKey: 'b476e64a52c80fbae45513b7c9178451fd689f3fa07d338901a7c7eb11bd3bbb',
        userID: this.userID
      })
      const promise = this.tim.login({ userID: this.userID, userSig: userSig })
      promise.then(function(imResponse) {
        _this.ifLogin = true
        console.log(imResponse.data) // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
        //   console.log('提示', imResponse.data.errorInfo)
        //   _this.$message.warning(imResponse.data.errorInfo)
          return _this.loginOutFn().then(() => {
            _this.loginFn()
          })
        } else {
          _this.$message.success('登录成功')
        }
      }).catch(function(imError) {
        console.warn('login error:', imError) // 登录失败的相关信息
      })
    },
    loginOutFn() {
      return this.tim.logout().then((imResponse) => {
        console.log(imResponse.data) // 登出成功
        this.$message.success('登出成功')
        this.ifLogin = false
      }).catch(function(imError) {
        console.warn('logout error:', imError)
      })
    },
    // 点击发送消息
    sendMessage() {
      const _this = this
      console.log('点击发送消息')
      // 发送文本消息，Web 端与小程序端相同
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = this.tim.createTextMessage({
        to: _this.userID2,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          text: this.myMessage
        },
        // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
        needReadReceipt: false
        // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
        // cloudCustomData: 'your cloud custom data'
      })
      // 2. 发送消息
      const promise = this.tim.sendMessage(message)
      promise.then(function(imResponse) {
        // 发送成功
        console.log(imResponse)
        _this.$message.success('消息发送成功')
        _this.myMessage = ''
      }).catch(function(imError) {
        // 发送失败
        _this.$message.error('消息发送失败', imError)
        console.warn('sendMessage error:', imError)
      })
    },
    // 获取会话列表
    getConversationList() {
      // 获取全量的会话列表
      this.tim.getConversationList().then((imResponse) => {
        const conversationList = imResponse.data.conversationList // 全量的会话列表，用该列表覆盖原有的会话列表
        const isSyncCompleted = imResponse.data.isSyncCompleted // 从云端同步会话列表是否完成
        console.log(conversationList, isSyncCompleted, '获取全量的会话列表')
        this.conversationList = conversationList
      }).catch(function(imError) {
        console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
      })
    },
    // 获取公共群
    getGroupById() {
      this.tim.searchGroupByID('@TGS#aCETUHMME').then((imResponse) => {
        const group = imResponse.data.group // 群组信息
        console.log(group, '获取公共群')
        this.groupDetail = group
      }).catch(function(imError) {
        console.warn('searchGroupByID error:', imError) // 搜素群组失败的相关信息
      })
    },
    handleClick(item) {
      this.conversationId = item.conversationID
      this.getMessageList()
      this.list = []
    },
    joinGroup() {
      // const _this = this
      this.list = []
      // 加入群聊
      this.tim.joinGroup({ groupID: this.groupDetail.groupID }).then(function(imResponse) {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log(imResponse.data.group) // 加入的群组资料
            console.log('加入群聊成功')
            // _this.$message.success('加入群聊成功')
            break
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            console.log('已经在群中')
            // _this.$message.error('已经在群中')
            break
          default:
            break
        }
      }).catch(function(imError) {
        console.warn('joinGroup error:', imError) // 申请加群失败的相关信息
      })
    },
    // 获取消息记录
    getMessageList() {
      console.log(this.conversationId)
      // 打开某个回话时，第一次拉取消息列表
      this.tim.getMessageList({ conversationID: 'C2Ctest' }).then(function(imResponse) {
        const messageList = imResponse.data.messageList // 消息列表。
        const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
        console.log(messageList, nextReqMessageID, isCompleted)
      })
    },
    // 消息记录列表添加一条记录
    joinMessageData(message) {
      console.log(message, 'message')
      const index = this.list.findIndex((res) => { return res.id === message.ID })
      console.log(index, 'index')
      index === -1 && this.list.push({
        id: message.ID,
        from: message.from,
        to: message.to,
        type: message.type,
        payload: message.payload
      })
    },
    initPlayer() {
      return new Promise((resolve) => {
        this.destroyPlayer()
        // eslint-disable-next-line no-undef
        const playerSdk = new VePlayer({
          id: 'player',
          url: this.videoUrl,
          width: 656,
          height: 450,
          // ignores: ['sdkUnmutePlugin', 'loading', 'enter', 'currentTime', 'start'],
          controls: true,
          autoplayMuted: false,
          autoplay: false,
          start: {
            isShowPause: false,
            isShowEnd: false,
            mode: 'hide',
            disableAnimate: true
          }
        })

        playerSdk.on('player_create_finish', (player) => {
          this.playerSdk = playerSdk.getPlayerInstance()
          this.playerSdk.playbackRate = this.playSpeed
          console.log(player, '视频加载完')
          // fn && fn(val)
        })
        playerSdk.on('timeupdate', (player) => {
        })
        playerSdk.on('canplay', (player) => {
          resolve()
          // this.totalTime = getFormatHMS(player.duration * 1000)
        })
        playerSdk.on('seeked', (player) => {
        })
        playerSdk.on('play', (player) => {
          this.isPlay = true
          console.log(player, '视频播放')
        })
        playerSdk.on('pause', (player) => {
          console.log(player, '视频播放暂停')
          this.isPlay = false
        })
        playerSdk.on('ended', (player) => {
          console.log(player, '视频播放结束')
        })
      })
    },
    play() {
      this.initPlayer(this.previewPlayer).then(() => {
        this.playerSdk.play()
      })
    },
    destroyPlayer() {
      this.playList = []
      if (Object.keys(this.playerSdk).length > 0) {
        const dom = document.querySelector('#player')
        dom.innerHTML = ''
        this.playerSdk.destroy()
        this.videoSrc = ''
      }
    },
    play2() {
      // if (!this.player) {
      //   this.initPlayer2()
      // }
      console.log(this.videoUrl2, this.player2)
      this.player2.src(this.videoUrl2)
      this.player2 && this.player2.play()
    },
    initPlayer2() {
      const options = {
        language: 'zh-CN',
        bigPlayButton: false,
        autoplay: false,
        muted: true,
        controlBar: {
          playToggle: true,
          progressControl: true,
          volumePanel: true,
          currentTimeDisplay: true,
          durationDisplay: true,
          timeDivider: true,
          playbackRateMenuButton: true,
          fullscreenToggle: true,
          QualitySwitcherMenuButton: true
        },
        webrtcConfig: {
          connectRetryCount: 50,
          connectRetryDelay: 1,
          receiveVideo: true,
          receiveAudio: true,
          showLog: true
        },
        plugins: {
          ProgressMarker: true
        }
      }
      // eslint-disable-next-line no-undef
      this.player2 = TCPlayer('myVideo', options)
      this.player2.ready(() => {
        console.log('初始化完成')
      })
      this.player2.on('webrtcevent', function(event) {
        // 从回调参数 event 中获取事件状态码及相关数据
        // console.log('event', event)
        const codeState = {
          1001: '开始拉流',
          1002: '已经链接服务器',
          1003: '视频播放开始',
          1004: '停止拉流，结束视频播放',
          1005: '链接服务失败，已启动自动重连恢复',
          1006: '获取流数据为空',
          1007: '开始请求信令服务器',
          1008: '请求信令服务器成功',
          1009: '拉流卡顿等待缓冲中',
          1010: '拉流卡顿结束恢复播放'
        }
        console.log(codeState[event.data.code])
      })
      this.player2.on('canplay', () => {
      })
      this.player2.on('error', (res) => {
        console.log(res, '播放出错')
      })
      this.player2.on('pause', () => {
        console.log('pause播放暂停')
      })
      this.player2.on('canplaythrough', () => {
        console.log('可流畅播放')
      })
      this.player2.on('resolutionswitching', () => {
        console.log('清晰度切换种')
      })
      this.player2.on('resolutionswitched', () => {
        console.log('清晰度切换完成')
      })
      this.player2.on('volumechange', (res) => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.messageBox {
    border: 1px solid #999;
    border-radius: 10px;
}
</style>
