<template>
  <div class="sider-avatar">
    <AppAvatar
      :name="userInfo.nickName || userInfo.userName"
      :width="68"
      :avatar="userInfo.avatar"
      :no-name="true"
    />
    <div class="block name">{{ userInfo.userName }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: { AppAvatar },
  data() {
    return {
      feishuAccount: {
        // 飞书账号信息
        loading: false,
        feishuAccount: false, // 当前机构是否开启了飞书扫码的配置
        ifBindUser: false, // 是否绑定了飞书账号
        userInfo: {
          avatar_big: '',
          avatar_middle: '',
          mobile: '',
          name: '',
          open_id: ''
        } // 绑定的飞书账号信息
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // this.getOrghasFeishu()
  }
}
</script>

<style lang="scss" scoped>
.sider-avatar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 31px;
  padding-bottom: 30px;
  .name {
    text-align: center;
    display: block;
    line-height: 18px;
    margin-top: 12px;
    width: 75%;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    font-style: normal;
    text-transform: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
