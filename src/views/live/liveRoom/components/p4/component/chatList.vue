<template>
  <div id="chatList" class="chatList">
    <div v-for="(item, index) in messageData" :id="`comment_${item.id}`" :key="index">
      <chatView v-if="!item.message.isRevoked" :key="item.id" :item="item" :chat-user-type="chatUserType" @dblclick="(item) => $emit('dblclick', item)" @imgLoadSuccess="$emit('imgLoadSuccess')" />
    </div>
  </div>
</template>

<script>
import chatView from './chatView.vue'
import { mapState } from 'vuex'
export default {
  components: {
    chatView
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      messageData: state => state.im.privateChatView.messageData,
      chatUserType: state => state.im.chatUser.type
    })
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.chatList {
  margin-top: 20px;
  padding: 0 14px;
  box-sizing: border-box;
  position: relative;
}
</style>
