<template>
  <div class="messageBox">
    <messageHeader />
    <div id="chatList" class="chatList">
      <!-- 直播间置顶消息 -->
      <toppingMsg />
      <!-- <virtualList v-if="showList" ref="ScroollPane" v-slot="{item}" :loading="loading" class="chatList2" :list-data="messageData" :estimated-item-size="21" @load="rollEnd" @rollTop="rollTop">
        <chatView v-if="!item.message.isRevoked" :key="item.id" :item="item" :chat-user-type="chatUserType" @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="imgLoadSuccess" />
      </virtualList> -->
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
        <template v-slot="{item, index, active}">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <chatView v-if="!item.message.isRevoked" :key="item.id" :item="item" :chat-user-type="chatUserType" @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="imgLoadSuccess" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <!-- 直播间弹窗 -->
    <liveRoomPopBox />
  </div>
</template>

<script>
import messageHeader from './messageHeader.vue'
import { mapState } from 'vuex'
import chatView from './chatView.vue'
// import virtualList from '../virtualList/index.vue'
import liveRoomPopBox from './liveRoomPopBox.vue'
import toppingMsg from './toppingMsg.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
export default {
  components: {
    messageHeader,
    chatView,
    // virtualList,
    DynamicScroller,
    DynamicScrollerItem,
    liveRoomPopBox,
    toppingMsg
  },
  data() {
    return {
      loading: false,
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
    rollEnd() {
      console.log('触底了~')
      this.$store.dispatch('im/clearLiveData')
    },
    rollTop() {
      this.$store.commit('im/set_ifScrollBottom', false)
      console.log('滚动到顶部了')
      if (!this.isCompleted && this.chatUser.type !== 2 && this.chatListArr.length > 0) {
        // 有更多数据，可以继续加载
        console.loog()
        const id = `comment_${this.chatListArr[0].id}`
        this.$store.dispatch('im/getMessageListMore', this.chatUser.conversationID).then(() => {
          this.$nextTick(() => {
            const index = this.messageData.findIndex(v => v.id === id)
            index > -1 && this.$refs.ScroollPane.scrollToItem(index)
          })
        })
      } else if (!this.isCompleted && this.chatUser.type === 2 && this.chatListArr.length > 0) {
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
        this.$store.dispatch('im/getChatRecordPage', msgSeq).then(() => {
          this.$nextTick(() => {
            // this.$refs.ScroollPane && this.$refs.ScroollPane.scrollTo(id)
            const index = this.messageData.findIndex(v => v.id === id)
            index > -1 && this.$refs.ScroollPane.scrollToItem(index)
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
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
    imgLoadSuccess() {
      setTimeout(() => {
        this.scrollBottom()
      }, 200)
    },
    resize(res) {
      console.log('resize', res)
      console.log(this.ifCanScrollBottom)
    },
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
    }
  }
}
</script>

<style lang='scss' scoped>
.messageBox {
    flex: 1 0 0;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    .chatList {
      position: relative;
      flex:  1 0 0;
      background: #f2f2f2;
      .chatList2 {
        // margin-top: 20px;
        padding: 0 14px;
        box-sizing: border-box;
        position: relative;
      }
    }
}
.scorllPaneChatList {
  height: calc(100vh - 219px - 68px - 65px);
}
</style>
