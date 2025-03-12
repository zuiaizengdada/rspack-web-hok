<template>
  <!-- 公共聊天室 -->
  <div class="groupChatRoom">
    <p3Header />
    <div class="groupChatRoom_content">
      <div class="charRoom">
        <!-- 直播间置顶消息 -->
        <toppingMsg v-if="chatUser.type === 2" />
        <!-- 公共聊天 -->
        <charRoom @dblclick="dblclick" />
      </div>
      <groupChatInput v-if="chatUser.type" ref="groupChatInput" />
    </div>
  </div>
</template>

<script>
import p3Header from './p3Header.vue'
import groupChatInput from './groupChatInput.vue'
import charRoom from '@/views/live/liveRoomV2/p3/chatRoom'
import { mapState } from 'vuex'
import toppingMsg from './toppingMsg'
export default {
  components: {
    groupChatInput,
    toppingMsg,
    p3Header,
    charRoom
  },
  inject: ['onhandleDblclick'],
  provide() {
    return {
      onfocus: () => this.onfocus()
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      cmd: state => state.im.cmd
    })
  },
  mounted() {
  },
  methods: {
    dblclick(item) {
      this.onhandleDblclick({ item: item.item, message: item.message, type: 1 })
    },
    // 工具栏选择图片
    selectImg(data) {
      this.$refs.VEditDiv2.imgSelection(data)
    },
    onfocus() {
      // console.log('失去焦点触发')
      this.$refs.groupChatInput && this.$refs.groupChatInput.onfocus()
    }
  }
}
</script>

  <style lang='scss' scoped>
  .groupChatRoom {
    width: 100%;
    height: 100%;
    background: #F7F7F7;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .groupChatRoom_content {
      flex: 1 0 0;
      position: relative;
      display: flex;
      flex-direction: column;
      .charRoom {
        flex: 1 0 0;
        overflow: hidden;
        position: relative;
      }
    }
  }
  </style>
