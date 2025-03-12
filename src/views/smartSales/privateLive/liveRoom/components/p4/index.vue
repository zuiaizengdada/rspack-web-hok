<template>
  <!-- p4为私人聊天区域 -->
  <div class="p4">
    <div class="messageBox">
      <messageHeader v-if="chatUser.type === 1" />
      <ScroollPane ref="ScroollPane" class="chatList" @load="rollEnd" @rollTop="rollTop">
        <chatList @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="imgLoadSuccess" />
      </ScroollPane>
    </div>
    <inputBox v-show="imUserInfo.ifLogin" ref="inputBox" @scrollBottom="scrollBottom" />
  </div>
</template>

<script>
import inputBox from './component/InputBox.vue'
import messageHeader from './component/messageHeader.vue'
// import ScroollPane from './component/ScroollPane.vue'
import ScroollPane from './component/ScrollPane.vue'
import chatList from './component/chatList.vue'
import { mapState } from 'vuex'
export default {
  components: {
    inputBox,
    messageHeader,
    ScroollPane,
    chatList
  },
  data() {
    return {}
  },
  provide() {
    return {
      onfocus: () => this.onfocus()
    }
  },
  computed: {
    ...mapState({
      'chatListArr': state => state.im.privateChatView.messageData,
      isCompleted: state => state.im.privateChatView.isCompleted,
      chatUser: state => state.im.chatUser,
      imUserInfo: state => state.im.imUserInfo,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        // 聊天数据改变，需要将滚动条滚动到底部
        this.$nextTick(() => {
          this.scrollBottom()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 滚动到底部
    scrollBottom() {
      this.$refs.ScroollPane && this.$refs.ScroollPane.scrollBottom()
    },
    // 图片加载完成
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    },
    rollEnd() {
      console.log('触底了~')
    },
    rollTop() {
      if (!this.isCompleted && this.chatUser.type !== 2 && this.chatListArr.length > 0) {
        // 有更多数据，可以继续加载
        const id = `comment_${this.chatListArr[0].id}`
        this.$store.dispatch('im/getMessageListMore', this.chatUser.conversationID).then(() => {
          this.$nextTick(() => {
            document.querySelector(`#${id}`).scrollIntoView(true)
          })
        })
      }
    },
    onfocus() {
      this.$refs.inputBox && this.$refs.inputBox.onfocus()
    },
    clearMsg() {
      this.$refs.inputBox && this.$refs.inputBox.clearMsg()
    }
  }
}
</script>

<style lang='scss' scoped>
.p4 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
  .messageBox {
    flex: 1 0 0;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    .chatList {
      flex:  1 0 0;
      background: #f2f2f2;
    }
}
}
</style>
