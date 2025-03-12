<template>
  <div class="detail-container">
    <detail-template type="wechart" @delAccount="delAccount" @add="addAccount" @active="activeAccount">
      <!-- <extendedLink slot="detailSlot06" class="m-b-20" /> -->
      <wechatShop slot="detailSlot06" class="m-b-20" />
      <Entertainment slot="detailSlot06" class="m-b-20" />
      <Isoriginal slot="detailSlot08" class="m-b-20" />
    </detail-template>
  </div>
</template>
<script>
import DetailTemplate from '../DetailTemplate/index.vue'
import Entertainment from './components/Entertainment.vue'
import Isoriginal from './components/Isoriginal.vue'
// import extendedLink from './components/extendedLink.vue'
import wechatShop from './components/wechatShop.vue'
import { wechatTemplateData } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'
export default {
  components: {
    DetailTemplate,
    // extendedLink,
    wechatShop,
    Entertainment,
    Isoriginal
  },
  inject: ['updatePublishChanelData', 'publishChannelData', 'updateActivePublishData', 'publishForm'],
  methods: {
    // 添加账号
    addAccount(list) {
      const template = JSON.parse(JSON.stringify(wechatTemplateData))
      const data = { ...template, ...this.publishForm }
      const _list = []
      list.forEach(item => {
        const copyData = JSON.parse(JSON.stringify(data))
        copyData.account = item
        _list.push(copyData)
      })
      this.updatePublishChanelData(_list)
    },
    // 删除账号
    delAccount() {},
    // 选中账号
    activeAccount(accountId) {
      this.updateActivePublishData(accountId)
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-container{
  height: 100%;
}
</style>
