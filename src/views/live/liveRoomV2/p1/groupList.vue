<template>
  <div class="liveRoomChat">
    <div class="grounpList" :class="{current: chatUser.type === 2}" @click="$emit('onClick')">
      <img class="grounp_avatar" src="~@/assets/image/liveRoom/group_chat_icon.png" alt="" />
      <span class="grounp_name">公共聊天室</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  props: {
    item: {
      type: [Object, null],
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveGroupDetail: state => state.im.liveGroupDetail
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.liveRoomChat {
  padding: 10px 10px 0px;
  .grounpList {
    display: flex;
    height: 36px;
    border-radius: 4px;
    // background: #EAF2FF;
    // border: 1px solid #C7E3DF;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .grounp_avatar {
      width: 16px;
      height: 16px;
    }
    .grounp_name {
      margin-left: 12px;
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      /* line-height: 36px; */
    }
    &:hover {
      background: #F7F7F7;
    }
  }
  .current {
    background: #EAF2FF!important;
    border: 1px solid #C7E3DF!important;
    .onlinePeople {
      color: #fff!important;
    }
  }
}
</style>
