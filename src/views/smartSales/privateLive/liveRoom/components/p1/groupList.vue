<template>
  <div class="grounpList" :class="{current: chatUser.type === 2}" @click="$emit('onClick')">
    <div class="grounpContent">
      <div class="grounp_avatar">
        <groupAvatar name="公共聊天" :width="40" class="groupAvatar m-r-5" :no-name="true" />
      </div>
      <div class="grounp_name">公共聊天室</div>
    </div>
    <!-- <div class="onlinePeople">{{ liveGroupDetail.currentOnlineCount || 1 }}人</div> -->
  </div>
</template>

<script>
// import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import groupAvatar from './groupAvatar.vue'
import { mapState } from 'vuex'
export default {
  components: {
    // AppAvatar
    groupAvatar
  },
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
.grounpList {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 10px 24px;
  background: #E7F0FF;
  .grounpContent {
    flex: 1 0 0;
    display: flex;
    .grounp_avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      .groupAvatar {
        border-radius: 50%;
        border: 1px solid #0C6FFF;
      }
    }
    .grounp_name {
      padding-left: 10px;
      flex: 1 0 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      line-height: 40px;
    }
  }
  .onlinePeople {
    width: 60px;
    text-align: right;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
  }
}
.current {
  background: #0C6FFF!important;
  color: #fff;
  .onlinePeople {
    color: #fff!important;
  }
}
</style>
