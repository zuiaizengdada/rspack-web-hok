<template>
  <div :id="item.id" class="privateChatView">
    <!-- 系统消息 -->
    <template v-if="item.type === '3'">
      <div class="systemInfo">{{ item.content }}</div>
    </template>

    <!-- 非我的发言 -->
    <template v-else-if="!item.isMine">
      <div class="avatar notIsming">
        <AppAvatar
          :class="{cursorPoninter: chatUser.type === 2}"
          :avatar="userInfo.memberPic || item.message.avatar"
          :name="userInfo.traineeRemark || userInfo.memberName"
          width="40"
          :no-name="true"
          @dblclick.native="onhandleDblclick({item: userInfo, message: item.message})"
          @contextmenu.prevent.stop.native="openMenu($event,item)"
        />
      </div>
      <div class="chatConten m-l-10">
        <div v-if="chatUserType === 2" class="chatUserInfo">
          <div v-if="userInfo.ifRobot" style="margin-right: 2px">
            <svg-icon class="m-r-28" class-name="toolsIcon" icon-class="robot" />
          </div>
          <div :class="`user_info_role${userInfo.roleId}`">
            <el-tag v-if="renderRoleInfo(userInfo.memberId).type" :type="renderRoleInfo(userInfo.memberId).type" size="mini" style="margin-left: 5px;margin-right: 5px;" effect="plain">{{ renderRoleInfo(userInfo.memberId).role }}</el-tag>
            <template v-else>
              {{ { 0: '老师', 1: '助教'}[userInfo.roleId] }}
            </template>
          </div>
          <div class="userName text_hidden_ellipsis" @contextmenu.prevent.stop="openMenu($event,item)" @dblclick="onhandleDblclick({item: userInfo, message: item.message})">
            <!-- {{ item.message.nick || item.message.from }} -->
            {{ filtersTextPhone(userInfo.memberName) }}
          </div>
          <!-- <div class="msgSendTime">
            {{ item.message.time | parseTime }}
          </div> -->
        </div>
        <div class="comment">
          <chatComment
            :content="item.message.payload"
            :cloud-custom-data="item.message.cloudCustomData"
            :is-mine="item.isMine"
            :if-send="item.ifSend"
            :type="getOptionsValue(item.type, commentType)"
            @imgLoadSuccess="$emit('imgLoadSuccess')"
            @contextmenu.prevent.stop.native="openMessageMenu($event,item)"
          />
        </div>

        <!-- 引用 replayMessage ? (cloudCustomDataParse && cloudCustomDataParse.messageReply && !replayMessage.message.isRevoked) : cloudCustomDataParse && cloudCustomDataParse.messageReply-->
        <div v-if="replayMessage ? (cloudCustomDataParse && cloudCustomDataParse.messageReply && !replayMessage.message.isRevoked) : false" class="comment_link">
          <div class="comment_content" @click="onhandleClickReply">
            <span class="comment_content_username">{{ filtersTextPhone(cloudCustomDataParse.messageReply.messageSenderName || cloudCustomDataParse.messageReply.messageSender) }}:</span>
            <template v-if="replayMessage">
              <chatComment
                :content="replayMessage.message.payload"
                :cloud-custom-data="replayMessage.message.cloudCustomData"
                :is-mine="replayMessage.isMine"
                :if-send="replayMessage.ifSend"
                :type="getOptionsValue(replayMessage.type, commentType)"
                @imgLoadSuccess="$emit('imgLoadSuccess')"
                @contextmenu.prevent.stop.native="openMessageMenu($event,replayMessage)"
              />
            </template>
            <template v-else>
              {{ cloudCustomDataParse.messageReply.messageAbstract }}
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- 我的发言 -->
    <template v-else>
      <div class="chatConten m-r-10 is_mind">
        <div class="chatUserInfo chatUserInfo_isMind">
          <!-- <div class="msgSendTime">{{ item.time | parseTime }}</div> -->
          <!-- <div class="userName text_hidden_ellipsis m-l-8">{{ item.name }}</div> -->
          <!-- <div class="userRole" :class="item.role === 1 ? 'userRole_green' : 'userRole_red'">{{ item.roleText }}</div> -->
        </div>
        <div class="comment comment_isMind" @contextmenu.prevent.stop="openMenu($event,item)">
          <!-- <span v-if="item.ifSend" class="msgMsgLoading"><i class="el-icon-loading" /></span> -->
          <!-- <span v-else-if="chatUserType === 1">{{ item.isPeerRead ? '已读' : '未读' }}</span> -->
          <chatComment
            :content="item.message.payload"
            :cloud-custom-data="item.message.cloudCustomData"
            :is-mine="item.isMine"
            :if-send="item.ifSend"
            :type="getOptionsValue(item.type, commentType)"
            @imgLoadSuccess="$emit('imgLoadSuccess')"
            @contextmenu.prevent.stop.native="openMessageMenu($event,item)"
          />
        </div>

        <!-- 发送失败 -->
        <div v-if="item.error" class="sendError" @click="alignSendMsg(item)">
          <svg-icon icon-class="chognxinfasong_icon" />
          <span>重新发送</span>
        </div>

        <!-- 引用 && !replayMessage.message.isRevoked-->
        <div v-if="replayMessage ? (cloudCustomDataParse && cloudCustomDataParse.messageReply && !replayMessage.message.isRevoked) : false" class="comment_link comment_link_isMine">
          <div class="comment_content" @click="onhandleClickReply">
            <span class="comment_content_username">{{ filtersTextPhone(cloudCustomDataParse.messageReply.messageSenderName || cloudCustomDataParse.messageReply.messageSender) }}:</span>
            <template v-if="replayMessage && replayMessage.message">
              <chatComment
                v-if="replayMessage && replayMessage.message"
                :content="replayMessage.message.payload"
                :cloud-custom-data="replayMessage.message.cloudCustomData"
                :is-mine="replayMessage.isMine"
                :if-send="replayMessage.ifSend"
                :type="getOptionsValue(replayMessage.type, commentType)"
                @imgLoadSuccess="$emit('imgLoadSuccess')"
                @contextmenu.prevent.stop.native="openMessageMenu($event,replayMessage)"
              />
            </template>
            <template v-else>
              {{ cloudCustomDataParse.messageReply.messageAbstract }}
            </template>
          </div>
        </div>
      </div>
      <div class="avatar">
        <AppAvatar :avatar="item.message.avatar" :name="userInfo.traineeRemark || item.message.nick" width="40" :no-name="true" />
      </div>
    </template>
  </div>
</template>

<script>
import chatComment from '@/views/live/liveRoom/components/p2/chatComment'
import { getOptionsValue } from '@/filters/index'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import contextmenu from '@/views/live/liveRoom/components/contextmenu/index'
import Dialog from '@/views/live/liveRoom/components/Dialog/index.js'
import { couponRevoke } from '@/api/liveRoom/index.js'
import { mapState } from 'vuex'
import { renderRoleInfo } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
export default {
  components: {
    chatComment,
    AppAvatar
  },
  inject: ['onfocus'],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    chatUserType: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      commentType: [
        { label: 'text', value: '1', des: '普通文本' },
        { label: 'image', value: '2', des: '图片' },
        { label: 'system', value: '3', des: '系统消息' },
        { label: 'coupon', value: '4', des: '优惠券消息' }
      ],
      // 用户数据
      userInfo: {
        colorMark: null,
        isAmuse: false,
        isOnline: true,
        isShutUp: true,
        listenDuration: null,
        memberId: '',
        memberName: null,
        memberPic: null,
        memberType: 1,
        speechTimes: null,
        traineeRemark: null
      },
      cloudCustomDataParse: {}, // 引用消息的数据
      replayMessage: null // 被引用的消息
    }
  },
  computed: {
    ...mapState({
      liveGroupDetail: state => state.im.liveGroupDetail,
      leftList: state => state.im.leftList,
      chatUser: state => state.im.chatUser,
      messageData: state => state.im.privateChatView.messageData
    })
  },
  watch: {
    // 会话更新时触发
    'leftList': {
      handler(val) {
        const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
        const obj = arr.find(v => v.memberId === this.item.message.from)
        let roleId = ''
        if (this.item.message.cloudCustomData) {
          const cloudCustomData = JSON.parse(this.item.message.cloudCustomData)
          roleId = cloudCustomData ? cloudCustomData.roleId : ''
        }
        if (obj) {
          this.userInfo = {
            colorMark: obj.colorMark,
            isAmuse: obj.isAmuse,
            isOnline: obj.isOnline,
            isShutUp: obj.isShutUp,
            listenDuration: obj.listenDuration,
            memberId: this.item.message.from,
            memberName: obj.traineeRemark || obj.memberName || this.item.message.nick || this.item.message.from,
            memberPic: obj.memberPic,
            memberType: obj.memberType,
            speechTimes: obj.speechTimes,
            traineeRemark: obj.traineeRemark,
            roleId,
            ifRobot: /^(?=IR-)/.test(this.item.message.from)
          }
        } else {
          this.userInfo = {
            colorMark: null,
            isAmuse: false,
            isOnline: true,
            isShutUp: true,
            listenDuration: null,
            memberId: this.item.message.from,
            memberName: this.item.message.nick || this.item.message.from,
            memberPic: null,
            memberType: 1,
            speechTimes: null,
            traineeRemark: null,
            roleId,
            ifRobot: /^(?=IR-)/.test(this.item.message.from)
          }
        }

        if (this.cloudCustomDataParse && this.cloudCustomDataParse.messageReply) {
          this.replayMessage = this.messageData.find(v => v.id === this.cloudCustomDataParse.messageReply.messageID)
        } else {
          this.replayMessage = null
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.item?.message.cloudCustomData && (this.cloudCustomDataParse = JSON.parse(this.item.message.cloudCustomData))
    if (this.cloudCustomDataParse && this.cloudCustomDataParse.messageReply) {
      this.replayMessage = this.messageData.find(v => v.id === this.cloudCustomDataParse.messageReply.messageID)
      console.log(this.replayMessage, 'replayMessage', this.cloudCustomDataParse)
    }
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    renderRoleInfo,
    getOptionsValue,
    scroll(linkItem) {
      if (document.getElementById(`comment_${linkItem.id}`)) {
        document.getElementById('chat_content').scrollTop = document.getElementById(`comment_${linkItem.id}`).offsetTop - 191
      }
    },
    handleCommand(comment, item) {
      console.log(comment)
      this.$emit(`${comment}`, item)
    },
    alignSendMsg(item) {
      this.$store.commit('im/chatListArr_updataById', { item: item, key: 'error', value: false })
      this.$store.dispatch('im/alignSendMsg', item)
    },
    // 右键
    openMenu(event, item) {
      console.log(item, '右键item', this.userInfo)
      if (this.$store.state.im.chatUser.type !== 2) {
        return
      }
      if (this.userInfo.memberType === 1 || this.userInfo.memberType === 2) {
        return
      }
      let tools = [['查看资料', '私聊Ta', '修改备注'], ['禁言', '拉黑并踢出', '自嗨'], ['标记颜色']]
      let markHeight = 352
      if (this.userInfo.isShutUp) {
        tools = [
          ['查看资料', '私聊Ta', '修改备注'],
          [`${this.userInfo.isShutUp ? '解除禁言' : '禁言'}`, '拉黑并踢出'],
          ['标记颜色']
        ]
        markHeight = 310
      } else {
        tools = [
          ['查看资料', '私聊Ta', '修改备注'],
          [`${this.userInfo.isShutUp ? '解除禁言' : '禁言'}`, '拉黑并踢出', `${this.userInfo.isAmuse ? '解除自嗨' : '自嗨'}`],
          ['标记颜色']
        ]
        markHeight = 352
      }
      contextmenu.open({
        left: event.pageX,
        top: event.pageY,
        markHeight,
        markType: this.userInfo.colorMark,
        tools,
        onClickFn: (el, res) => {
          if (el === '私聊Ta') {
            this.onhandleDblclick({ item: this.userInfo, message: item.message })
          } else if (el === '修改备注') {
            Dialog.open({
              visible: true,
              type: 'EditRemarks',
              value: this.userInfo.traineeRemark || '',
              success: (val) => {
                this.$store.dispatch('im/updateUserRemarks', { remarksInfo: val, traineeId: this.userInfo.memberId })
              }
            })
          } else if (el === '查看资料') {
            Dialog.open({ visible: true, type: 'UserInfo', left: event.pageX, top: event.pageY, traineeId: this.userInfo.memberId, avatar: item.message.avatar || '', nick: item.message.nick })
          } else if (el === '解除禁言') {
            console.log('用户解除了禁言')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.liveGroupDetail.groupID, operateType: 2, traineeId: this.userInfo.memberId })
          } else if (el === '禁言') {
            console.log('禁言')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.liveGroupDetail.groupID, operateType: 1, traineeId: this.userInfo.memberId })
          } else if (el === '拉黑并踢出') {
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.liveGroupDetail.groupID, operateType: 3, traineeId: this.userInfo.memberId })
          } else if (el === '自嗨') {
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.liveGroupDetail.groupID, operateType: 5, traineeId: this.userInfo.memberId })
          } else if (el === '解除自嗨') {
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.liveGroupDetail.groupID, operateType: 6, traineeId: this.userInfo.memberId })
          } else if (el === '标记颜色') {
            this.$store.dispatch('im/markUserColor', { color: this.userInfo.colorMark === res.value ? 0 : res.value, traineeId: this.userInfo.memberId })
          }
          console.log(el, '右键点击', res)
        }
      })
    },
    // 双击
    onhandleDblclick({ item, message }) {
      console.log('双击', item, message)
      if (item.ifRobot) {
        return
      }
      this.$emit('dblclick', { item: item, message: message })
    },
    // 消息右键
    openMessageMenu(event, item) {
      // if (this.$store.state.im.chatUser.type !== 2 && !item.isMine) { return }
      // 发送中和发送失败，不显示撤回
      if (item.ifSend || item.error) { return }
      let markHeight = 136
      let tools = [[{ icon: 'liveCopy', text: '复制' }, { icon: 'huifu', text: '回复' }, { icon: 'del', text: '删除' }]]
      if (this.$store.state.im.chatUser.type !== 2 && !item.isMine) {
        tools = [[{ icon: 'liveCopy', text: '复制' }, { icon: 'huifu', text: '回复' }]]
        markHeight = 94
      } else if (this.$store.state.im.chatUser.type === 2 && !item.isMine && [0, 1].includes(this.userInfo.roleId)) {
        tools = [[{ icon: 'liveCopy', text: '复制' }, { icon: 'huifu', text: '回复' }]]
        markHeight = 94
      }
      contextmenu.open({
        left: event.pageX,
        top: event.pageY,
        markHeight: markHeight,
        tools: tools,
        onClickFn: (el, res) => {
          if (el.text === '复制') {
            if (item.type === '2') {
              console.log(item)
              this.copyImg(item.message.payload.imageInfoArray[0].imageUrl)
            } else if (item.type === '1') {
              console.log('复制', event, item)
              // 创建元素用于复制
              var aux = document.createElement('textarea')
              aux.readOnly = 'readonly'
              aux.style.position = 'absolute'
              aux.style.left = '-9999px'
              // 设置元素内容
              // aux.setAttribute('value', item.message.payload.text)
              aux.value = item.message.payload.text
              // 将元素插入页面进行调用
              document.body.appendChild(aux)
              // 复制内容
              aux.select()
              aux.setSelectionRange(0, aux.value.length)
              // 将内容复制到剪贴板
              document.execCommand('copy')
              // 删除创建元素
              console.log(aux)
              document.body.removeChild(aux)
              // 提示
              this.$message.success('复制成功')
            }
          } else if (el.text === '回复') {
            console.log('回复', item)
            const data = {
              messageFeature: { needTyping: 1, version: 1 },
              messageReply: {
                // cloudCustomData: item.message.cloudCustomData,
                cloudCustomData: '',
                messageAbstract: item.message.type === 'TIMTextElem' ? item.message.payload.text : '[图片]', // 发送的消息内容
                messageSender: item.message.from, // 发送者ID
                messageSenderName: item.message.nick, // 发送者姓名
                // messageRootID: item.message.ID,
                messageID: item.message.ID,
                messageType: item.message.type === 'TIMTextElem' ? 1 : 3, // 消息类型 1: 文本 3: 图片
                version: 1
              },
              payload: item.message.payload
            }
            this.$store.commit('im/SET_replySetting', { key: 'ifReply', data: true })
            this.$store.commit('im/SET_replySetting', { key: 'data', data: data })

            this.onfocus()
          } else if (el.text === '删除') {
            console.log('删除', item)
            if (this.$store.state.im.chatUser.type !== 2) {
              // 个人聊天删除
              console.log('个人聊天删除')
              this.$store.dispatch('im/deleteMessage', item.message).then(() => {
                item.message.isRevoked = true
                const obj = JSON.parse(item.message.cloudCustomData)
                console.log(obj, 'obj')
                if (obj && obj.hokMsgType && obj.hokMsgType === 6) {
                  this.liveRoomRevokeGoods(obj.data, item.message.to)
                }
              }).catch(() => {
                this.$message.error('删除消息失败')
              })
            } else {
              // 群聊删除
              // this.$store.dispatch('im/sendTsignalMessage', {
              //   data: '1',
              //   description: '删除群会话信令消息',
              //   extension: {
              //     messageId: item.id, // 会话id
              //     type: this.chatUser.type
              //   }
              // })
              item.message.isRevoked = true
            }
          }
          console.log(el, '右键点击', res)
        }
      })
    },
    // 1v1撤回商品
    liveRoomRevokeGoods(row, userId) {
      const data = {
        liveRoomId: this.$route.params.id,
        liveCouponId: row.liveCouponId,
        type: 2,
        userId: userId
      }
      return couponRevoke(data)
    },
    // 复制图片
    copyImg(url) {
      var canvas = document.createElement('canvas') // 创建一个画板
      const image = new Image()
      image.setAttribute('crossOrigin', 'Anonymous') // 可能会有跨越问题
      image.src = url
      image.onload = () => { // img加载完成事件
        canvas.width = image.width // 设置画板宽度
        canvas.height = image.height // 设置画板高度
        canvas.getContext('2d').drawImage(image, 0, 0) // 加载img到画板
        const url = canvas.toDataURL('image/png') // 转换图片为dataURL，格式为png
        this.clipboardImg(url) // 调用复制方法
      }
    },
    async clipboardImg(url) {
      try {
        const data = await fetch(url)
        const blob = await data.blob()
        await navigator.clipboard.write([
          new window.ClipboardItem({
            [blob.type]: blob
          })
        ])
        this.$message.success('复制成功')
      } catch (err) {
        this.$message.error('复制失败')
      }
    },
    // 渲染用户的显示名
    renderUserName(item) {
      const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
      const obj = arr.find(v => v.memberId === item.memberId)
      console.log(obj, '获取的数据')
      if (!obj || !obj.traineeRemark) {
        return item.message.nick || item.message.from
      } else {
        return obj.traineeRemark
      }
    },
    onhandleClickReply() {
      console.log('点击引用的数据', this.replayMessage)
      if (this.replayMessage) {
        // 滚动到指定的位置
        this.$nextTick(() => {
          // console.log(document.querySelector(`#comment_${this.replayMessage.id}`))
          document.querySelector(`#comment_${this.replayMessage.id}`).scrollIntoView(true)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.privateChatView {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  .systemInfo {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  .avatar {
    width: 40px;
  }
  .chatConten {
    width: 100%;
    .chatUserInfo {
      display: flex;
      align-items: center;
      .user_info_role0 {
        width: 28px;
        height: 16px;
        background: #0091FF;
        border-radius: 2px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 14px;
        text-align: center;
        margin-left: 4px;
        margin-right: 4px;
      }
      .user_info_role1 {
        width: 28px;
        height: 16px;
        background: #00CD43;
        border-radius: 2px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 14px;
        text-align: center;
        margin-left: 4px;
        margin-right: 4px;
      }
      .userRole {
        height: 20px;
        line-height: 20px;
        padding: 0 10px;
        border-radius: 4px;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 20px;
        margin-right: 6px;
      }
      .userRole_green {
        background: #27C000;
      }
      .userRole_red {
        background: #EE2E14;
      }
      .msgSendTime {
        color: #999;
        font-size: 14px;
      }
      .userName {
        font-size: 14px;
        color: rgba(51, 51, 51, 0.9);
        line-height: 23px;
        margin-right: 7px;
        max-width: 200px;
        // display: -webkit-box;//对象作为弹性伸缩盒子模型显示
        // overflow: hidden;//溢出隐藏
        // -webkit-box-orient: vertical;//设置伸缩盒子对象的子元素的排列方式
        // -webkit-line-clamp: 1;//设置 块元素包含的文本行数
      }
      .user_more {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    .chatUserInfo_isMind {
      justify-content: flex-end;
    }
    .comment {
      margin-top: 10px;
      display: flex;
      .msgMsgLoading {
        display: flex;
        align-items: center;
        padding-right: 5px;
      }
    }
    .comment_isMind {
      text-align: right;
      display: flex;
      justify-content: flex-end;
    }
    .comment_link {
      background: #f2f2f2;
      margin-top: 6px;
      .comment_content {
        cursor: pointer;
        display: inline-block;
        padding: 6px 10px;
        font-size: 14px;
        color: rgba(51, 51, 51, 0.9);
        line-height: 22px;
        box-sizing: border-box;
        position: relative;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 6px;
        font-size: 12px;
        color: #777777;
        line-height: 20px;
        .comment_content_username {
          float: left;
          margin-right: 5px;
        }
        ::v-deep {
          .chatComment {
            .chatComment_text {
              padding: 0!important;
              background-color: transparent;
              color: #333333;
            }
            // padding: ;
          }
        }
      }
    }
    .comment_link_isMine {
      text-align: right;
    }
    .sendError {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      color: #FF4747;
      line-height: 20px;
      margin-top: 6px;
      cursor: pointer;
      .sendErrorImg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
.is_mind {
  .comment {
    margin-top: 0px!important;
  }
  .chatUserInfo {
    .userName {
      text-align: right;
    }
  }
  .chatComment {
    ::v-deep{
      .chatComment_text {
        background-color: #0C6FFF;
        color: #fff;
      }
    }
  }
}
.notIsming {
  .chatComment {
    ::v-deep{
      .chatComment_text {
        background-color: #fff;
        color: #333333;
      }
    }
  }
}
</style>
