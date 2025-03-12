<template>
  <div class="userList" :class="{current: item.conversationID === chatUser.conversationID}" @click="$emit('onClick')">
    <div class="user_avatar">
      <AppAvatar :name="item.toAccount" :width="34" class="m-r-5" :no-name="true" />
    </div>
    <div class="user_info">
      <div class="user_info_nick">
        <div class="user_info_nickName">系统消息</div>
        <div class="user_info_message text_hidden_1">{{ item.lastMessage.messageForShow }}</div>
      </div>
      <div class="user_info_message_time">{{ item.lastMessage.lastTime | formatLastTime }}</div>
      <div>未读: {{ item.unreadCount }}</div>
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapState } from 'vuex'
export default {
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
    return {}
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.userList {
    display: flex;
    border: 1px solid #333;
    align-items: center;
   .user_avatar {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
   }
   .user_info {
    flex: 1 0 0;
   }
   .user_liveinfo {
    width: 80px;
    text-align: center;
    border-left: 1px solid #333;
   }
}
.current {
  background: #fff!important;
}
</style>
