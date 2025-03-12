<template>
  <div class="video-detail-container">
    <div class="video-detail-title flex items-center">账号发布设置</div>
    <div class="flex w-full right_content">
      <detail-channel-nav @switch="switchDetailChannel" />
      <div class="detail-content  w-full">
        <div class="detail-channel-content" style="padding-bottom:60px;">
          <detail-tiktok v-if="activeDetailChannelName==='抖音'" />
          <DetailTiktokOverseas v-if="activeDetailChannelName==='TikTok'" />
          <detail-wechat v-if="activeDetailChannelName==='视频号'" />
          <detail-kuaishou v-if="activeDetailChannelName==='快手'" />
          <detail-xiaohongshu v-if="activeDetailChannelName==='小红书'" />
          <detail-bilibili v-if="activeDetailChannelName==='B站'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DetailChannelNav from './DetailChannelNav/index.vue'
import DetailKuaishou from './DetailChannelColumn/DetailKuaishou/index.vue'
import DetailTiktok from './DetailChannelColumn/DetailTiktok/index.vue'
import DetailTiktokOverseas from './DetailChannelColumn/DetailTiktokOverseas/index.vue'
import DetailWechat from './DetailChannelColumn/DetailWechat/index.vue'
import DetailXiaohongshu from './DetailChannelColumn/DetailXiaohongshu/index.vue'
import DetailBilibili from './DetailChannelColumn/DetailBilibili/index.vue'
import { getAccountList } from '@/api/videoManagement/videoPublish'
export default {
  components: {
    DetailChannelNav,
    DetailKuaishou,
    DetailTiktok,
    DetailWechat,
    DetailXiaohongshu,
    DetailBilibili,
    DetailTiktokOverseas
  },
  data() {
    return {
      activeDetailChannelName: '', // 当前选中渠道索引值
      accountList: [] // 账号列表
    }
  },
  provide() {
    return {
      getAccountList: () => this.accountList
    }
  },
  inject: ['channel'],
  methods: {
    async getAccountList() {
      const { data } = await getAccountList({ platformId: this.channel.id, type: 1 })
      this.accountList = data
    },
    // 渠道切换
    switchDetailChannel(data) {
      console.log(data, '传进来的data')
      this.activeDetailChannelName = data.platformName
      this.getAccountList()
    }
  }
}
</script>
<style lang="scss" scoped>
.video-detail-container {
  height: 100%;
  position: relative;
  z-index: 999;
  overflow-y: hidden;
}
.video-detail-title{
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  position: relative;
  padding-left:34px;
  height: 64px;
  border: 1px solid #EEEEEE;
  &::before{
    content:"";
    position: absolute;
    width: 4px;
    height: 24px;
    background: #0C6FFF;
    border-radius: 6px;
    left:20px;
  }
}
.right_content{
  height: 100%;
}
.detail-content{
  height: 100%;
}
.detail-channel-content{
  height: 100%;
}
// .detail-content{
//   padding-bottom:50px;
// }
</style>
