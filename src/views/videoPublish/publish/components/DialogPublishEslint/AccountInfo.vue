<template>
  <div class="account-info-container flex items-center">
    <slot name="iconStatus" />
    <div class="relative info-img">
      <el-image class="header-img " :src="account.avatar||account.AuthorLogo" />
      <el-image :class="['channel-icon absolute',iconShadowMap.get(account.PlatformId)]" :src="getIconItem(account.PlatformId||account.platformId)" />
    </div>
    <div class="info-content">
      <p class="account-name">{{ account.name||account.AuthorName }}</p>
      <slot name="accountStatus" />
    </div>
  </div>
</template>
<script>
import iconBilibili from '@/views/videoPublish/images/svg/icon-bilibili.svg'
import iconKuaishou from '@/views/videoPublish/images/svg/icon-kuaishou.svg'
import iconWechat from '@/views/videoPublish/images/svg/icon-wechat.svg'
import iconXiaohongshu from '@/views/videoPublish/images/svg/icon-xiaohongshu.svg'
import iconTiktok from '@/views/videoPublish/images/svg/icon-tiktok.svg'
import iconTikTok1 from '@/views/videoPublish/images/svg/icon-TikTok1.svg'
export default {
  props: {
    account: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      iconList: [iconBilibili, iconKuaishou, iconWechat, iconXiaohongshu, iconTiktok, iconTikTok1],
      iconShadowMap: new Map([[19, 'dyShadow'], [32, 'sphShadow'], [24, 'ksShadow'], [31, 'xhsShadow'], [15, 'bliShadow']])
    }
  },
  methods: {
    getIconItem(id) {
      id = Number(id)
      if (id === 19) {
        return this.iconList[4]
      } else if (id === 32) {
        return this.iconList[2]
      } else if (id === 24) {
        return this.iconList[1]
      } else if (id === 31) {
        return this.iconList[3]
      } else if (id === 15) {
        return this.iconList[0]
      } else if (id === 20) {
        return this.iconList[5]
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.account-info-container {
  background: #E7F0FF;
  border-radius: 4px;
  padding:6px;
  min-width: 160px;;
  .info-img{
      width:36px;
      height: 36px;
    .header-img{
      width:100%;
      height:100%;
      border-radius: 50%;
    }
    .channel-icon{
      bottom:0;
      right:-5px;
      width:20px;
      height: 20px;
      box-shadow: 0px 2px 4px 0px rgba(237,93,134,0.4);
      border: 1px solid #FFFFFF;
      border-radius: 50%;;
    }
    .dyShadow{
      box-shadow: 0px 2px 4px 0px rgba(51,51,51,0.4);
    }
    .sphShadow{
      box-shadow: 0px 2px 4px 0px rgba(250,157,59,0.4);
    }
    .ksShadow{
      box-shadow: 0px 2px 4px 0px rgba(255,73,5,0.4);
    }
    .xhsShadow{
      box-shadow: 0px 2px 4px 0px rgba(236,64,74,0.4);
    }
    .bliShadow{
      box-shadow: 0px 2px 4px 0px rgba(237,93,134,0.4);
    }
  }
  .account-name{
    margin-left:10px;
    font-size:12px;
    line-height: 18px;
    color:#333;
  }
}
</style>
