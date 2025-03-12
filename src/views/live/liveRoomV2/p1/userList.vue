<template>
  <div
    class="userList"
    :class="{ current: item.memberId === chatUser.userId }"
    @dblclick="onhandleDblclick({ item, message: item.message, type: 1 })"
  >
    <div class="user_avatar" @click.stop="onhandleClick">
      <el-badge
        :value="
          item.message.unreadCount <= 99 ? item.message.unreadCount : '99+'
        "
        class="item"
        :hidden="!item.message.unreadCount"
      >
        <AppAvatar
          :avatar="item.message.userProfile.avatar || item.memberPic"
          :class="{ leave: !item.isOnline }"
          :name="
            item.memberName ||
            item.message.userProfile.nick ||
            item.message.userProfile.userID
          "
          :width="48"
          class="m-r-8"
          :no-name="true"
        />
      </el-badge>
      <img
        v-if="item.isV"
        src="~@/assets/image/liveRoom/vip_icon.png"
        alt=""
        class="tips_vip userStateIcon"
      />
    </div>

    <div
      class="user_info_box"
      @click="onhandleDblclick({ item, message: item.message, type: 1 })"
    >
      <div class="user_info" @contextmenu.prevent.stop="openMenu($event, item)">
        <div class="user_info_nick">
          <textShowMore
            class="w-auto"
            :line-clamp="1"
            :text="renderUserName(item)"
            :style="item.phoneNumber ? 'max-width : 80px' : 'flex: 1 0 0'"
          />
          <template v-if="item.phoneNumber">
            <!-- 手机号 -->
            <div class="user_info_userPhone">
              <template
                v-if="
                  isHead() ||
                  !item.sysUserName ||
                  item.sysUserId === userInfo.userId
                "
              >
                <watchPhoneNumber
                  :phone-area-code="item.phoneAreaCode"
                  :default-value="item.phoneNumber"
                  :params="item"
                  :copy="true"
                  :user-id="item.memberId"
                  :get-api="operationLogsWrite"
                />
              </template>
              <template v-else>
                <template v-if="item.phoneAreaCode">
                  +{{ item.phoneAreaCode }}
                </template>
                {{ item.phoneNumber }}
              </template>
            </div>
          </template>
          <template v-else-if="item.email">
            <!-- 邮箱 -->
            <div class="user_info_userEmail">
              <!-- // 负责人可以看所有的邮箱，小伙伴只能看自己邀约人的邮箱，没有邀约人的都可以看 -->
              <template
                v-if="
                  isHead() ||
                  !item.sysUserName ||
                  item.sysUserId === userInfo.userId
                "
              >
                <watchPhoneNumber
                  :default-value="item.email"
                  :params="item"
                  :user-id="item.memberId"
                  :get-api="operationLogsWriteEmail"
                />
              </template>
              <template v-else>
                {{ item.email }}
              </template>
            </div>
          </template>
        </div>
        <div class="user_info_inviter">
          <span>邀请人：</span><span>{{ item.sysUserName || '暂无' }}</span>
        </div>
        <!-- tag标签 -->
        <div class="user_info_markers">
          <div
            v-if="item.speechTimes"
            class="user_info_markers_border mark_b_E0F9FF"
          >
            发言 x{{ item.speechTimes }}
          </div>
          <div
            v-if="item.receiveCouponNum"
            class="user_info_markers_border mark_b_FFEEDD"
          >
            领券 x{{ item.receiveCouponNum }}
          </div>
          <div
            v-if="item.waitOrderCount"
            class="user_info_markers_border mark_b_FFE4E0"
          >
            待支付 x{{ item.waitOrderCount }}
          </div>
          <div
            v-if="item.goodsClickNum"
            class="user_info_markers_border mark_b_DFF6EF"
          >
            查看商品 x{{ item.goodsClickNum }}
          </div>
        </div>
        <div class="user_info_tips" />
      </div>
    </div>
    <div class="user_right">
      <!-- 右侧播放归入 -->
      <div class="user_liveinfo_pop">
        <el-popover
          :value="popoverShow"
          placement="right"
          trigger="manual"
          width="506"
          popper-class="p-0 border_none ov-h "
          @show="show = true"
          @hide="show = false"
        >
          <liveLog
            :user-id="item.memberId"
            :show="show"
            @close="popoverLock = false"
            @open="popoverLock = true"
          />
          <div
            slot="reference"
            class="user_liveinfo"
            @click.stop="popoverShowFn"
          >
            <!-- <div class="user_liveinfo_sum">
                <img src="~@/assets/image/liveRoom/zixunchishu.png" class="renshutiaozhengIcon" />
                {{ item.speechTimes || 0 }}次
              </div> -->
            <div class="user_liveinfo_time">
              <img
                src="~@/assets/image/liveRoom/xuexicishu.png"
                class="renshutiaozhengIcon"
              />
              {{ item.listenDuration | filterformLabel }}
            </div>
          </div>
        </el-popover>
      </div>
      <!-- 拨打 -->
      <outbound
        class="out-bound"
        :item="item"
        :can-call="item.sysUserId === userInfo.userId"
      />
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import contextmenu from '../contextmenu/index'
import Dialog from '../Dialog/index.js'
import { mapState, mapGetters } from 'vuex'
import textShowMore from '@/components/textShowMore/index2.vue'
import liveLog from '../Dialog/liveLog.vue'
import { getOptionsValueByKey } from '@/filters/index.js'
import { filtersTextPhone } from '@/utils/index'
import goodsClickLog from '../Dialog/goodsClickLog'
import couponLog from '../Dialog/couponLog'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import outbound from '@/views/live/liveRoomV2/components/outbound'
export default {
  inject: ['chatClick', 'openUserInfo', 'isHead'],
  components: {
    AppAvatar,
    liveLog,
    textShowMore,
    watchPhoneNumber,
    outbound
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
      return val.length > 3 ? val.slice(0, 3) + '...' : val
    },
    filterformLabel(val) {
      if (!val) {
        return 0 + '分钟'
      }
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
    getOptionsValueByKey,
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
    // 右键
    openMenu(event, item) {
      console.log(item)
      let tools = []
      let markHeight = 0
      var arr = []
      if (item.isBlackList) {
        arr.unshift('解除拉黑')
        markHeight += 53
      } else {
        arr.push('拉黑')
        arr.push(`${item.isShutUp ? '解除禁言' : '禁言'}`)
        !item.isShutUp && arr.push(`${item.isAmuse ? '解除自嗨' : '自嗨'}`)
        markHeight += 53 + 42 + 42
      }
      arr.unshift('发私信')
      tools.unshift(arr)
      console.log(tools, 'tools')
      markHeight += 53
      if (item.isVisitor) {
        // 游客
        if (item.isBlackList) {
          tools = [['解除拉黑']]
        } else {
          tools = [['拉黑']]
        }
        markHeight = 53
      }
      contextmenu.open({
        left: event.pageX,
        top: event.pageY,
        tools,
        markType: item.colorMark,
        markHeight,
        onClickFn: (el, res) => {
          console.log(el, res)
          if (el === '发私信') {
            console.log(item, '发私信')
            this.onhandleDblclick({ item, message: this.item.message, type: 1 })
          } else if (el === '修改备注') {
            Dialog.open({
              visible: true,
              type: 'EditRemarks',
              value: item.traineeRemark || '',
              success: val => {
                this.$store
                  .dispatch('im/updateUserRemarks', {
                    remarksInfo: val,
                    traineeId: item.memberId
                  })
                  .then(() => {
                    this.item.traineeRemark = val
                  })
              }
            })
          } else if (el === '解除禁言') {
            console.log('用户解除了禁言')
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 2,
                traineeId: item.memberId
              })
              .then(() => {
                this.item.isShutUp = false
                this.$emit('refresh')
              })
          } else if (el === '禁言') {
            console.log('禁言')
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 1,
                traineeId: item.memberId
              })
              .then(() => {
                this.item.isShutUp = true
                this.$emit('refresh')
              })
          } else if (el === '拉黑') {
            console.log('拉黑')
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 3,
                traineeId: item.memberId
              })
              .then(() => {
                this.$emit('refresh')
                this.item.isBlackList = true
              })
          } else if (el === '自嗨') {
            console.log('自嗨')
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 5,
                traineeId: item.memberId
              })
              .then(() => {
                this.item.isAmuse = true
                this.$emit('refresh')
              })
          } else if (el === '解除自嗨') {
            console.log('解除自嗨')
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 6,
                traineeId: item.memberId
              })
              .then(() => {
                this.item.isAmuse = false
                this.$emit('refresh')
              })
          } else if (el === '标记颜色') {
            this.$store
              .dispatch('im/markUserColor', {
                color: item.colorMark === res.value ? 0 : res.value,
                traineeId: item.memberId
              })
              .then(() => {
                this.$emit('refresh')
                console.log(res, '111111')
                this.item.colorMark =
                  item.colorMark === res.value ? 0 : res.value
              })
          } else if (el === '解除拉黑') {
            this.$store
              .dispatch('im/operateUserTrainee', {
                groupId: this.groupID,
                operateType: 4,
                traineeId: item.memberId
              })
              .then(() => {
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
        item.lastMessage.messageForShow = filtersTextPhone(
          item.lastMessage?.messageForShow
        )
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
      return filtersTextPhone(item.memberName)
    },
    handleChatClick({ item, message, type }) {
      if (item.isVisitor) {
        return this.$message.warning('当前学员是游客')
      }
      this.chatClick({ item: item, message: message, type: type })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.memberId,
        phoneNum: params.phoneNumber,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 手机号埋点
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.memberId,
        queryType: 2,
        email: params.email,
        phoneNum: params.phoneNumber,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 用户头像点击事件
    onhandleClick() {
      this.openUserInfo(this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-15 {
  margin-top: 15px;
}
.w-auto {
  width: auto;
}
.userList {
  display: flex;
  align-items: center;
  margin: 0 10px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  cursor: pointer;
  min-height: 83px;
  &:hover {
    background: #f7f7f7;
  }
  .user_avatar {
    padding-left: 5px;
    // width: 74px;
    // height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .userStateIcon {
      position: absolute;
      bottom: 0;
      right: 8px;
      width: 16px;
      height: 16px;
      font-size: 16px;
      border-radius: 16px;
      overflow: hidden;
    }
  }
  .user_info_box {
    flex: 1 0 0;
    display: flex;
    .user_info {
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
      justify-items: center;
      padding-top: 10px;
      padding-bottom: 10px;
      .user_info_nick {
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        .user_info_nickName {
          color: #000000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: Normal;
          line-height: 14px;
        }
      }
      .user_info_userPhone {
        margin-left: 7px;
        min-width: 120px;
        flex: 1 0 0;
        color: #333333;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
      }
      .user_info_userEmail {
        margin-left: 7px;
        min-width: 223px;
        flex: 1 0 0;
        color: #333333;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
      }
      .user_info_inviter {
        margin-top: 6px;
        color: #999999;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        font-style: normal;
        line-height: 12px;
      }

      .user_info_markers {
        flex: 1 0 0;
        margin-top: 6px;
        display: flex;
        flex-wrap: wrap;
        .user_info_markers_border {
          height: 20px;
          padding: 3px 5px;
          flex-shrink: 0;
          margin-right: 5px;
          margin-top: 5px;
          border-radius: 4px;
          border: 1px solid;
          font-family: 'Microsoft YaHei';
          font-size: 12px;
          font-style: normal;
          font-weight: Normal;
          line-height: 12px;
        }
        .mark_b_E0F9FF {
          // background: #E0F9FF;
          color: #6cbbce;
          border-color: #e0f9ff;
        }
        .mark_b_FFEEDD {
          // background: #FFEEDD;
          color: #ffab5d;
          border-color: #ffeedd;
        }
        .mark_b_FFE4E0 {
          // background: #FFE4E0;
          color: #f39090;
          border-color: #ffe4e0;
        }
        .mark_b_DFF6EF {
          // background: #DFF6EF;
          color: #70d0b6;
          border-color: #dff6ef;
        }
      }
    }
    .userCollectedCoupon {
      background-color: #ecf5ff;
      display: inline-block;
      padding: 0 4px;
      font-size: 12px;
      line-height: 12px;
      color: #0c6fff;
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
  .user_right {
    min-height: 70px;
    width: 120px;
    .user_liveinfo_pop {
      position: absolute;
      right: 10px;
      top: 13px;
    }
    .user_liveinfo {
      // height: 40px;
      // width: 84px;
      min-width: 80px;
      text-align: right;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      padding-right: 10px;
      .user_liveinfo_sum {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      .user_liveinfo_time {
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
    .out-bound {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
.current {
  background: #eaf2ff !important;
  .user_liveinfo {
    color: #fff;
  }
  .user_info_box {
    border-bottom: none;
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
// .leave {
//   filter: gray;
//   opacity: 0.4;
// }
.user_info_role4 {
  position: absolute;
  bottom: 10px;
  left: 22px;
  width: 14px;
  height: 16px;
  overflow: hidden;
}
</style>
