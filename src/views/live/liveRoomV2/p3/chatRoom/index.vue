<template>
  <!-- 聊天区域 -->
  <div class="liveChatRoom">
    <!-- <el-scrollbar ref="scrollContainer" :vertical="false" class="liveChatRoom-scroll"> -->
    <DynamicScroller
      v-if="showList"
      key="ScroollPane"
      ref="ScroollPane"
      :items="messageData"
      :min-item-size="21"
      class="scorllPaneChatList"
      @scroll.native="onScroll"
      @resize="resize"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <chatView
            v-if="!item.message.isRevoked"
            :key="item.id"
            :item="item"
            :chat-user-type="2"
            @dblclick="item => $emit('dblclick', item)"
            @imgLoadSuccess="imgLoadSuccess"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { mapState } from 'vuex'
import chatView from './chatView.vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
export default {
  components: {
    DynamicScroller,
    chatView,
    DynamicScrollerItem
  },
  data() {
    return {
      showList: true
    }
  },
  computed: {
    ...mapState({
      messageData: state => state.im.chatView.messageData,
      chatUserType: state => state.im.chatUser.type,
      isCompleted: state => state.im.chatView.isCompleted,
      chatUser: state => state.im.chatUser,
      chatListArr: state => state.im.chatView.messageData,
      ifCanScrollBottom: state => state.im.chatView.ifCanScrollBottom
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        if (val.length > 0) {
          setTimeout(() => {
            this.scrollBottom()
          }, 50)
        } else {
          this.showList = false
          this.showList = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    onScroll() {
      this.$store.commit('im/set_ifScrollBottom', false)
      this.$store.commit('im/set_ifCanScrollBottom', false)
      var wrap = this.$refs.ScroollPane.$el
      const poor = wrap.scrollHeight - wrap.clientHeight
      if (
        poor === parseInt(wrap.scrollTop) ||
        poor === Math.ceil(wrap.scrollTop) ||
        poor === Math.floor(wrap.scrollTop)
      ) {
        this.$store.commit('im/set_ifScrollBottom', true)
        this.$store.commit('im/set_ifCanScrollBottom', true)
        this.rollEnd()
      }
      if (wrap.scrollTop === 0) {
        console.log('滚动到顶部咯')
        this.rollTop()
      }
      console.log('滚动中')
    },
    resize(res) {
      console.log('resize', res)
      this.scrollBottom()
      // console.log(this.ifCanScrollBottom)
    },
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 500)
    },
    scrollBottom() {
      this.$nextTick(() => {
        if (this.ifCanScrollBottom) {
          console.log('手动滚动到底部')
          this.$refs.ScroollPane.scrollToBottom()
          this.$store.commit('im/set_ifCanScrollBottom', true)
        }
      })
    },
    rollEnd() {
      console.log('触底了~')
      this.$store.dispatch('im/clearLiveData')
    },
    rollTop() {
      this.$store.commit('im/set_ifScrollBottom', false)
      console.log('滚动到顶部了')
      if (
        !this.isCompleted &&
        this.chatUser.type !== 2 &&
        this.chatListArr.length > 0
      ) {
        // 有更多数据，可以继续加载
        console.loog()
        const id = `comment_${this.chatListArr[0].id}`
        this.$store
          .dispatch('im/getMessageListMore', this.chatUser.conversationID)
          .then(() => {
            this.$nextTick(() => {
              const index = this.messageData.findIndex(v => v.id === id)
              index > -1 && this.$refs.ScroollPane.scrollToItem(index)
            })
          })
      } else if (
        !this.isCompleted &&
        this.chatUser.type === 2 &&
        this.chatListArr.length > 0
      ) {
        if (this.loading) return
        // 群聊有更多数据，可以继续加载
        this.loading = true
        const id = this.chatListArr[0].id
        let msgSeq = this.chatListArr[0].msgSeq
        console.log(msgSeq, 'msgSeq+++++++++++++++++++')
        if (!msgSeq && !id) {
          this.loading = false
          return
        }
        msgSeq = id
        console.log('群聊消息', 123123123, this.loading)
        this.$store
          .dispatch('im/getChatRecordPage', msgSeq)
          .then(() => {
            this.$nextTick(() => {
              // this.$refs.ScroollPane && this.$refs.ScroollPane.scrollTo(id)
              const index = this.messageData.findIndex(v => v.id === id)
              index > -1 && this.$refs.ScroollPane.scrollToItem(index)
            })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.liveChatRoom {
  height: 100%;
  .liveChatRoom-scroll {
    height: 100%;
  }
  .scorllPaneChatList {
    height: 100%;
  }
}
</style>
