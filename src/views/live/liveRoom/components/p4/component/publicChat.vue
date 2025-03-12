<template>
  <!-- 公共聊天 -->
  <div>
    <messageHeader :chat-user-type="2" />
    <ScroollPane ref="ScroollPane" class="chatList" @load="rollEnd" @rollTop="rollTop">
      <chatList @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="imgLoadSuccess" />
    </ScroollPane>
  </div>
</template>

<script>
import messageHeader from './messageHeader.vue'
import ScroollPane from './ScrollPane.vue'
import chatList from './chatList.vue'
import { mapState } from 'vuex'
export default {
  components: {
    messageHeader,
    ScroollPane,
    chatList
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isCompleted: state => state.im.privateChatView.isCompleted,
      chatUser: state => state.im.chatUser,
      chatListArr: state => state.im.privateChatView.messageData
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        if (val.length > 0) {
          this.scrollBottom()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    rollEnd() {
      console.log('触底了~')
    },
    rollTop() {
      console.log('到顶部了')
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
    scrollBottom() {
      this.$refs.ScroollPane && this.$refs.ScroollPane.scrollBottom()
    },
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
