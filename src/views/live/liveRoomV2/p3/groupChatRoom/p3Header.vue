<template>
  <div class="p3_box_header">
    <div class="p3_box_header_left">
      <div class="left_title">互动消息</div>
    </div>
    <div class="p3_box_header_right">
      <el-tooltip effect="dark" placement="bottom">
        <div
          slot="content"
          v-html="
            '1、当勾选后，只展示邀约学员的发言。<br/>2、只对当前进入直播间的当前老师有影响。不影响其他老师'
          "
        />
        <el-checkbox :value="ifReadStudent" @change="onhandleifReadStudent">
          查看邀约学员发言
        </el-checkbox>
        <!-- <div
          :class="['hok-check', ifReadStudent ? 'check' : '']"
          @click="onhandleifReadStudent(ifReadStudent)"
        >
          <span :class="['hok-check-box']" />
          <span class="hok-check-text">仅查看邀约学员</span>
        </div> -->
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  inject: ['liveRoomClick', 'chatClick'],
  data() {
    return {
      activeChat: ''
    }
  },
  computed: {
    ...mapState({
      AVliveRoomConversationList: state => state.im.AVliveRoomConversationList,
      ifReadStudent: state => state.im.ifReadStudent,
      chatUser: state => state.im.chatUser,
      conversationList: state => state.im.conversationList,
      chatRoomUserList: state => state.im.chatRoomUserList
    })
  },
  watch: {
    chatUser: {
      handler(val) {
        console.log(val)
        if (val.type === 2) {
          this.activeChat = '公共聊天'
        } else {
          this.activeChat = val.userId
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    onhandleifReadStudent(value) {
      this.$store.commit('im/set_ifReadStudent', value)
      this.$store.dispatch('im/refreshChatRecord')
    },
    selectTab(item) {
      console.log(item, 'item')
      if (item.label === '公共聊天') {
        // 切换到公共聊天室
        this.liveRoomClick(
          this.AVliveRoomConversationList.length > 0
            ? this.AVliveRoomConversationList[0]
            : null
        )
      } else {
        // 切换到私人聊天室
        const obj = this.chatRoomUserList.find(
          v => v.userInfo.memberId === item.label
        )
        if (obj) {
          this.chatClick({ item: obj.userInfo, message: obj.message, type: 1 })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p3_box_header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  background: #fff;
  box-shadow: 0 0 10px 0 #0000001a;
  .p3_box_header_left {
    flex: 1 0 0;
    width: 0;
    height: 40px;
    position: relative;
    .left_title {
      line-height: 40px;
      padding-left: 22px;
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
    }
    .left_chatUserBox {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #fff;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ebebeb;
      .groupAvatar {
        border-radius: 50%;
        border: 1px solid #0c6fff;
      }
      .chatItem {
        animation-name: slide-left;
        animation-duration: 0.3s;
        width: 40px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      ::v-deep .el-tabs--card > .el-tabs__header {
        border: none;
        .el-tabs__nav {
          background: #fff;
          padding: 2px 0 0;
          height: 38px;
          border-radius: 8px 8px 8px 8px;
          box-sizing: border-box;
        }
        .el-tabs__nav,
        .el-tabs__item,
        .el-tabs__item:first-child {
          border: none;
        }
        .el-tabs__item:first-child {
          border-radius: 8px 8px 0 0px;
        }
        .el-tabs__item:last-child {
          border-radius: 8px 8px 0 0;
        }
        .el-icon-close {
          font-size: 14px;
          color: #333;
        }
      }
      ::v-deep .el-tabs__item:not(:first-child) {
        transform: translateY(8px);
      }
      ::v-deep .el-tabs__item {
        border-radius: 8px 8px 0 0;
        height: 36px;
        line-height: 36px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        font-style: normal;
        text-transform: none;
        padding: 0 4px 0 4px;
        position: relative;
        /* &.is-active:not(:first-child)::after {
            border: none;
          }
          &.is-active:first-child::before {
            border: none;
          } */
        &.is-active {
          background: #e7f0ff;
          &::before {
            content: '';
            position: absolute;
            width: 11px;
            height: 10px;
            left: -10px;
            bottom: 0;
            background: radial-gradient(
              circle at 0 0,
              transparent 10px,
              #e7f0ff 11px
            );
          }
          &::after {
            content: '';
            position: absolute;
            width: 11px;
            height: 10px;
            right: -10px;
            bottom: 0;
            background: #000;
            background: radial-gradient(
              circle at 100% 0,
              transparent 10px,
              #e7f0ff 11px
            );
          }
          &:first-child::before,
          &:last-child::after {
            height: 0;
            width: 0;
          }
        }
        /* 去除下一个元素的边框 */
        &.is-active + .el-tabs__item::before {
          width: 0;
        }
        &:hover {
          color: #0c6fff;
        }
      }
      ::v-deep .el-tabs__nav-next,
      ::v-deep .el-tabs__nav-prev {
        line-height: 58px;
      }
    }
  }
  .p3_box_header_right {
    padding: 0 12px;
    .hok-check {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      cursor: pointer;
      &-box {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid #c2c6ce;
      }
      &-text {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
        padding-left: 7px;
      }
      &:hover {
        .hok-check-box {
          border-color: #0c6fff;
        }
        .hok-check-text {
          color: #0c6fff;
        }
      }
      &.check {
        .hok-check-box {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 9px;
            width: 10px;
            background: url('~@/assets/image/live/big_check_icon@2x.png')
              no-repeat;
            background-size: 100% auto;
          }
        }
      }
    }
  }
}
@keyframes slide-left {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

::v-deep .el-tabs__nav-wrap {
  // padding-top: 10px;
  .el-tabs__nav-scroll {
    padding: 10px 0;
  }
  .el-tabs__nav {
    transition: box-shadow 1.5s ease;
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
      box-shadow: none;
    }
  }
}

::v-deep .history-fixed-shadow {
  .el-tabs__nav {
    box-shadow: 0 5px 10px 0 #0000001a;
  }
}
</style>
