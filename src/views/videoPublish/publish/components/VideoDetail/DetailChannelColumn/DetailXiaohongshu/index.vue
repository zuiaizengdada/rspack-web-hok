<template>
  <div class="detail-container">

    <detail-template type="xiaohongshu" @delAccount="delAccount" @add="addAccount" @active="activeAccount" />
  </div>
</template>
<script>
import DetailTemplate from '../DetailTemplate/index.vue'
import { xiaohongshuTemplateData } from '../constant'
export default {
  components: {
    DetailTemplate
  },
  inject: ['updatePublishChanelData', 'publishChannelData', 'updateActivePublishData', 'publishForm'],
  methods: {
    // 添加账号
    addAccount(list) {
      const template = JSON.parse(JSON.stringify(xiaohongshuTemplateData))
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
