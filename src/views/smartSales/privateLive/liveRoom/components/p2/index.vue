<template>
  <div class="p2">
    <messageBox ref="messageBox" @dblclick="(item) => $emit('dblclick', item)" />
    <inputBox v-show="imUserInfo.ifLogin" ref="inputBox" @scrollBottom="scrollBottom" />
  </div>
</template>

<script>
import inputBox from './InputBox.vue'
import messageBox from './messageBox.vue'
import { mapState } from 'vuex'

export default {
  components: {
    inputBox,
    messageBox
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      'chatListArr': state => state.im.chatView.messageData,
      imUserInfo: state => state.im.imUserInfo,
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    chatListArr: {
      handler(val) {
        // // 聊天数据改变，需要将滚动条滚动到底部
        // this.$nextTick(() => {
        //   this.scrollBottom()
        // })
        setTimeout(() => {
          this.scrollBottom()
        }, 10)
      },
      deep: true,
      immediate: true
    }
  },
  provide() {
    return {
      onfocus: () => this.onfocus()
    }
  },
  mounted() {},
  methods: {
    scrollBottom() {
      this.$refs.messageBox && this.$refs.messageBox.scrollBottom()
    },
    clearMsg() {
      this.$refs.inputBox && this.$refs.inputBox.clearMsg()
    },
    onfocus() {
      this.$refs.inputBox && this.$refs.inputBox.onfocus()
    }
  }
}
</script>

<style lang='scss' scoped>
.p2 {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
