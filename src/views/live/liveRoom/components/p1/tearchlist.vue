<template>
  <div class="userList" :class="{current: item.memberId === chatUser.userId, ifMine: item.memberId === userInfo.userId}" @click="handleChatClick({item: item, message: item.message, type: 3})">
    <div class="user_avatar">
      <el-badge :value="item.message.unreadCount <= 99 ? item.message.unreadCount : '99+'" class="item" :hidden="item.message.unreadCount === 0">
        <AppAvatar :avatar="item.memberPic || item.message.userProfile.avatar" :name="item.teacherLiveRoomAlias || item.memberName || item.message.userProfile.nick || item.message.userProfile.userID" :width="40" class="m-r-10" :no-name="true" />
      </el-badge>
    </div>
    <div class="user_info">
      <div class="user_info_nick">
        <span class="user_info_nickName">{{ item.teacherLiveRoomAlias || item.memberName || item.message.userProfile.nick || item.message.userProfile.userID }}</span>
        <div :class="`user_info_role${item.memberType}`">{{ { 1: '老师', 2: '助教'}[item.memberType] }}</div>
      </div>
      <div v-if="item.memberId === userInfo.userId" class="user_liveinfo">本人</div>
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  inject: ['chatClick', 'onhandleDblclick'],
  components: {
    AppAvatar
  },
  filters: {
    formatLastTime(time, option) {
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
      } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      } else {
        return Math.ceil(diff / 3600 / 24) + '天前'
      }
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
      message: {
        toAccount: null,
        userProfile: {
          nick: '',
          userID: '',
          avatar: ''
        },
        lastMessage: {},
        conversationID: '',
        unreadCount: 0
      } // 会话数据
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      conversationList: state => state.im.conversationList
    }),
    ...mapGetters(['userInfo'])
  },
  mounted() {},
  methods: {
    handleChatClick({ item, message, type }) {
      if (item.memberId === this.userInfo.userId) {
        return
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
  padding: 10px 0 10px 24px;
  position: relative;
  cursor: pointer;
  height: 68px;
  &:hover {
    background: #FAFAFA;
  }
  .user_avatar {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .user_info {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    border-bottom: 1px solid #F5F5F5;
    .user_info_nick {
      display: flex;
      align-items: center;
      .user_info_nickName {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .user_info_message_time {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-left: 4px;
      }
      .user_info_role1 {
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
      }
      .user_info_role2 {
        width: 28px;
        height: 16px;
        // background: #00CD43;
        background: #0091FF;
        border-radius: 2px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 14px;
        text-align: center;
        margin-left: 4px;
      }
    }
    .user_info_message {
      margin-top: 3px;
      width: 162px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 17px;
    }
  }
  .user_liveinfo {
    // width: 60px;
    text-align: right;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0091FF;
    line-height: 17px;
    padding-right: 24px;
    // border-left: 1px solid #333;
  }
  .colorMark {
    position: absolute;
    top: -15px;
    right: -15px;
    width:0px;
    height:0px;
    border:16px solid transparent;/*以下四个样式对应四种三角形，任选其一即可实现*/
    /* border-top-color:lightseagreen; */
    /* border-left-color:lightseagreen; */
    /* border-right-color:lightseagreen; */
    border-bottom-color:lightseagreen;
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
  .user_info {
    border-bottom: none;
  }
}
.ifMine {
  cursor: auto!important;
}
::v-deep {
  .el-badge__content.is-fixed {
    top: 6px;
    right: 28px;
  }
}
</style>
