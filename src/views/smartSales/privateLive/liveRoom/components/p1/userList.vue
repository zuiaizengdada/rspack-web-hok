<template>
  <div class="userList" :class="{current: item.memberId === chatUser.userId}">
    <div class="user_avatar" @click="handleChatClick({item: item, message: item.message, type: 1})" @contextmenu.prevent.stop="openMenu($event,item)">
      <el-badge :value="item.message.unreadCount <= 99 ? item.message.unreadCount : '99+'" class="item" :hidden="item.message.unreadCount === 0">
        <AppAvatar :avatar="item.message.userProfile.avatar || item.memberPic" :class="{leave: !item.isOnline}" :name="item.memberName || item.message.userProfile.nick || item.message.userProfile.userID" :width="40" class="m-r-10" :no-name="true" />
      </el-badge>
      <img v-if="!item.isOnline" src="~@/assets/image/liveRoom/likai.png" alt="" class="userStateIcon" />
      <img v-else-if="item.isShutUp" src="~@/assets/image/liveRoom/jiyan.png" alt="" class="userStateIcon" />
      <img v-else-if="item.isAmuse" src="~@/assets/image/liveRoom/zihai.png" alt="" class="userStateIcon" />
      <img v-if="item.isVisitor" src="~@/assets/image/liveRoom/visitor.png" alt="" :class="`user_info_role${item.memberType}`" />
    </div>
    <div class="user_info_box">
      <div class="user_info" @click="handleChatClick({item: item, message: item.message, type: 1})" @contextmenu.prevent.stop="openMenu($event,item)">
        <div class="user_info_nick">
          <el-tooltip effect="dark" :disabled="renderUserName(item).length <= 6" :content="renderUserName(item)" placement="top-start">
            <span :class="{leave: !item.isOnline}" class="user_info_nickName">
              {{ renderUserName(item) | filterTextLength }}
              <img v-if="item.isV" src="~@/assets/image/liveRoom/vip.png" alt="" class="tips_vip" />
              <span v-if="item.receiveCouponNum" class="userCollectedCoupon" @click.stop="onhandleUserCollectedCoupon">已领{{ item.receiveCouponNum > 99 ? '99+' : item.receiveCouponNum }}</span>
              <el-badge v-if="item.goodsClickNum" :value="item.goodsClickNum" class="userClickNum" :max="99" type="primary" @click.native.stop="onhandleClickGoods" />
            </span>
          </el-tooltip>
        </div>
        <div v-if="item.message.lastMessage.messageForShow" class="user_info_message">
          <div class="user_info_message_text text_hidden_1">{{ renderLAstMessageName(item.message) }}{{ renderMessageForShow(item.message) }}</div>
          <div v-if="item.message.lastMessage.lastTime" class="user_info_message_time">{{ item.message.lastMessage.lastTime | formatLastTime }}</div>
        </div>
      </div>
      <el-popover :value="popoverShow" placement="right" trigger="manual" width="606" popper-class="p-0 border_none ov-h" @show="show = true" @hide="show = false">
        <liveLog :user-id="item.memberId" :show="show" @close="popoverLock = false" @open="popoverLock = true" />
        <div slot="reference" class="user_liveinfo" @click="popoverShowFn">
          <div class="user_liveinfo_sum">
            <img v-if="item.memberId === chatUser.userId" src="~@/assets/image/liveRoom/zixunchishu_c.png" class="renshutiaozhengIcon" />
            <img v-else src="~@/assets/image/liveRoom/zixunchishu.png" class="renshutiaozhengIcon" />
            {{ item.speechTimes || 0 }}次
          </div>
          <div class="user_liveinfo_time">
            <img v-if="item.memberId === chatUser.userId" src="~@/assets/image/liveRoom/xuexicishu_c.png" class="renshutiaozhengIcon" />
            <img v-else src="~@/assets/image/liveRoom/xuexicishu.png" class="renshutiaozhengIcon" />
            {{ item.listenDuration | filterformLabel }}
          </div>
        </div>
      </el-popover>
    </div>
    <div v-if="item.colorMark" class="colorMark" :style="{'border-bottom-color': getOptionsValueByKey('value', 'color', item.colorMark, markColor)}" />
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import contextmenu from '../contextmenu/index'
import Dialog from '../Dialog/index.js'
import { mapState, mapGetters } from 'vuex'
import liveLog from '../Dialog/liveLog.vue'
import { markColor } from '../../../columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import { filtersTextPhone } from '@/utils/index'
import goodsClickLog from '../Dialog/goodsClickLog'
import couponLog from '../Dialog/couponLog'

export default {
  inject: ['chatClick'],
  components: {
    AppAvatar,
    liveLog
  },
  filters: {
    formatLastTime(time, option) {
      if (!time) {
        return ''
      }
      if (('' + time).length === 10) {
        time = parseInt(time) * 1000
      } else {
        time = +time
      }
      const d = new Date(time)
      const now = Date.now()

      const diff = (now - d) / 1000

      if (diff < 30) {
        return '刚刚'
        // return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 12) {
        return '12小时内'
      } else if (diff < 3600 * 24) {
        return '24小时内'
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      } else {
        return Math.ceil(diff / 3600 / 24) + '天前'
      }
    },
    filterTextLength(val) {
      if (!val) {
        return
      }
      return val.length > 6 ? val.slice(0, 6) + '...' : val
    },
    filterformLabel(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      popoverLock: false,
      popoverShow: false,
      markColor,
      show: false
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      groupID: state => state.im.liveGroupDetail.groupID,
      conversationList: state => state.im.conversationList,
      leftList: state => state.im.leftList,
      memberQueryType: state => state.im.memberQueryType,
      liveSensitiveSetting: state => state.im.liveSensitiveSetting
    }),
    ...mapGetters(['userInfo'])
  },
  watch: {
    popoverShow(value) {
      if (value) {
        setTimeout(() => {
          document.body.addEventListener('click', this.closeLiveLog)
        })
      } else {
        document.body.removeEventListener('click', this.closeLiveLog)
      }
    }
  },
  mounted() {},
  methods: {
    // 点击已领按钮
    onhandleUserCollectedCoupon(e) {
      this.$contextmenu.open({
        left: e.pageX,
        top: e.pageY,
        visible: true,
        markHeight: 404,
        option: {
          liveRoomId: this.$route.params.id,
          studentId: this.item.memberId
        },
        viewComponent: couponLog
      })
    },
    // 点击商品查看按钮
    onhandleClickGoods(e) {
      this.$contextmenu.open({
        left: e.pageX,
        top: e.pageY,
        markHeight: 404,
        visible: true,
        option: {
          liveRoomId: this.$route.params.id,
          studentId: this.item.memberId
        },
        viewComponent: goodsClickLog
      })
    },
    closeLiveLog() {
      if (!this.popoverLock) {
        this.popoverShow = false
      }
    },
    popoverShowFn() {
      this.popoverShow = true
    },
    getOptionsValueByKey,
    // 右键
    openMenu(event, item) {
      console.log(event, item)
      let tools = []
      const ifmyTrainees = this.leftList.myTrainees.findIndex(v => { return v.memberId === item.memberId }) !== -1
      let markHeight = 78
      tools.push(['标记颜色'])
      if (item.isBlackList) {
        tools.unshift(['解除拉黑'])
        markHeight += 53
      } else {
        const arr = ['拉黑并踢出']
        arr.push(`${item.isShutUp ? '解除禁言' : '禁言'}`)
        !item.isShutUp && arr.push(`${item.isAmuse ? '解除自嗨' : '自嗨'}`)
        tools.unshift(arr)
        markHeight += 53 + 42 + 42
      }
      if (ifmyTrainees && item.isBlackList) {
        tools.unshift(['修改备注'])
        markHeight += 53
      } else if (ifmyTrainees && !item.isBlackList) {
        tools.unshift(['私聊Ta', '修改备注'])
        markHeight += 53 + 42
      } else {
        tools.unshift(['私聊Ta'])
        markHeight += 53
      }
      if (item.isVisitor) {
        // 游客
        if (item.isBlackList) {
          tools = [['解除拉黑']]
        } else {
          tools = [['拉黑并踢出']]
        }
        markHeight = 53
      }
      console.log(tools, 'tools', markHeight)
      contextmenu.open({
        left: event.pageX,
        top: event.pageY,
        tools,
        markType: item.colorMark,
        markHeight,
        onClickFn: (el, res) => {
          console.log(el, res)
          if (el === '私聊Ta') {
            console.log(item, '私聊Ta')
            this.onhandleDblclick({ item, message: this.item.message, type: 1 })
          } else if (el === '修改备注') {
            Dialog.open({
              visible: true,
              type: 'EditRemarks',
              value: item.traineeRemark || '',
              success: (val) => {
                this.$store.dispatch('im/updateUserRemarks', { remarksInfo: val, traineeId: item.memberId }).then(() => { this.item.traineeRemark = val })
              }
            })
          } else if (el === '解除禁言') {
            console.log('用户解除了禁言')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 2, traineeId: item.memberId }).then(() => { this.item.isShutUp = false })
          } else if (el === '禁言') {
            console.log('禁言')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 1, traineeId: item.memberId }).then(() => { this.item.isShutUp = true })
          } else if (el === '拉黑并踢出') {
            console.log('拉黑并踢出')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 3, traineeId: item.memberId }).then(() => {
              this.$emit('refresh')
              this.item.isBlackList = true
            })
          } else if (el === '自嗨') {
            console.log('自嗨')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 5, traineeId: item.memberId }).then(() => { this.item.isAmuse = true })
          } else if (el === '解除自嗨') {
            console.log('解除自嗨')
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 6, traineeId: item.memberId }).then(() => { this.item.isAmuse = false })
          } else if (el === '标记颜色') {
            this.$store.dispatch('im/markUserColor', { color: item.colorMark === res.value ? 0 : res.value, traineeId: item.memberId }).then(() => {
              this.$emit('refresh')
              console.log(res, '111111')
              this.item.colorMark = item.colorMark === res.value ? 0 : res.value
            })
          } else if (el === '解除拉黑') {
            this.$store.dispatch('im/operateUserTrainee', { groupId: this.groupID, operateType: 4, traineeId: item.memberId }).then(() => {
              this.$emit('refresh')
              this.item.isBlackList = false
            })
          }
        }
      })
    },
    renderLAstMessageName(item) {
      if (item.lastMessage.fromAccount === this.userInfo.userId) {
        return '我:'
      } else {
        return ''
      }
    },
    // 过滤手机号
    renderMessageForShow(item) {
      const { filtrationPhoneNum, workToSpeRole } = this.liveSensitiveSetting
      const isTeacher = !Number.isNaN(Number(item.lastMessage.fromAccount)) // 老师
      // 过滤手机号
      if ((filtrationPhoneNum && !isTeacher) || (workToSpeRole && isTeacher)) {
        item.lastMessage.messageForShow = filtersTextPhone(item.lastMessage?.messageForShow)
      }
      return item.lastMessage?.messageForShow
    },
    // 双击
    onhandleDblclick({ item, message, type }) {
      console.log('双击')
      if (item.isVisitor) {
        return this.$message.warning('当前学员是游客')
      }
      this.chatClick({ item, message: message, type: type })
    },
    // 渲染用户的显示名
    renderUserName(item) {
      // return this.item.message?.userProfile?.nick || this.item.message?.userProfile?.userID || ''
      const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
      const obj = arr.find(v => v.memberId === item.memberId)
      // console.log(obj, '获取的数据')
      if (!obj || !obj.traineeRemark) {
        return item.traineeRemark || filtersTextPhone(item.memberName) || filtersTextPhone(this.item.message?.userProfile?.nick) || this.item.message?.userProfile?.userID || ''
      } else {
        return obj.traineeRemark || ''
      }
    },
    handleChatClick({ item, message, type }) {
      if (item.isVisitor) {
        return this.$message.warning('当前学员是游客')
      }
      this.chatClick({ item: item, message: message, type: type })
    }
  }
}
</script>

<style lang='scss' scoped>
.userList {
  display: flex;
  align-items: center;
  padding: 0 0 0 0;
  position: relative;
  cursor: pointer;
  height: 68px;
  &:hover {
    background: #FAFAFA;
  }
  .user_avatar {
    padding-left: 24px;
    width: 74px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .userStateIcon {
      position: absolute;
      bottom: 10px;
      right: 8px;
      width: 16px;
      height: 16px;
      font-size: 16px;
      border-radius: 16px;
      overflow: hidden;
    }
  }
  .user_info_box {
    height: 68px;
    flex: 1 0 0;
    display: flex;
    // padding: 14px 0;
    border-bottom: 1px solid #F5F5F5;
    align-items: center;
    .user_info {
      // height: 40px;
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
      height: 68px;
      justify-content: center;
      .user_info_nick {
        display: flex;
        align-items: center;
        .user_info_nickName {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        // .user_info_message_time {
        //   font-size: 10px;
        //   font-family: PingFangSC-Regular, PingFang SC;
        //   font-weight: 400;
        //   color: #999999;
        //   margin-left: 4px;
        // }
      }
      .user_info_message {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // width: 162px;
        // font-size: 12px;
        // font-family: PingFangSC-Regular, PingFang SC;
        // font-weight: 400;
        // color: #777777;
        // line-height: 17px;
        .user_info_message_text {
          // width: ;
          flex: 1 0 0;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 17px;
        }
        .user_info_message_time {
          text-align: right;
          flex: 1 0 0;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          margin-left: 4px;
          padding-right: 10px;
        }
      }
    }
    .user_liveinfo {
      // height: 40px;
      width: 84px;
      height: 68px;
      padding-top: 14px;
      text-align: left;
      .user_liveinfo_sum {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        display: flex;
        align-items: center;
      }
      .user_liveinfo_time {
        margin-top: 11px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        display: flex;
        align-items: center;
      }
      .renshutiaozhengIcon {
        width: 12px;
        font-size: 12px;
        margin-right: 4px;
      }
      // border-left: 1px solid #333;
    }
    .userCollectedCoupon {
      background-color: #ecf5ff;
      display: inline-block;
      // height: 14px;
      padding: 0 4px;
      font-size: 12px;
      line-height: 12px;
      color: #0C6FFF;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      box-sizing: border-box;
      white-space: nowrap;
    }
    .userClickNum {
      top: 6px;
      margin-left: 5px;
    }
    .tips_vip {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
  }
  .colorMark {
    position: absolute;
    top: -16px;
    right: -16px;
    width:0px;
    height:0px;
    border:16px solid transparent;/*以下四个样式对应四种三角形，任选其一即可实现*/
    /* border-top-color:lightseagreen; */
    /* border-left-color:lightseagreen; */
    /* border-right-color:lightseagreen; */
    // border-bottom-color:lightseagreen;
    transform: rotate(45deg);
  }
}
.current {
  background: #0C6FFF !important;
  .user_liveinfo {
    color: #fff;
  }
  .user_info_nickName {
    color: #fff!important;
  }
  .user_info_message_time {
    color: #C3D9FF!important;
  }
  .user_info_message {
    color: #E7F0FF!important;
  }
  .user_info_box {
    border-bottom: none;
  }
  .user_liveinfo_sum {
    color: #fff!important;
  }
  .user_liveinfo_time {
    color: #fff!important;
  }
}
::v-deep {
  .el-badge__content.is-fixed {
    top: 6px;
    right: 28px;
  }
}
.mypopover {
  padding: 0;
}
.leave {
  filter: gray;
  opacity: 0.4;
}
.user_info_role4 {
   position: absolute;
   bottom: 10px;
   left: 22px;
   width: 14px;
   height: 16px;
   overflow: hidden;
}
</style>
