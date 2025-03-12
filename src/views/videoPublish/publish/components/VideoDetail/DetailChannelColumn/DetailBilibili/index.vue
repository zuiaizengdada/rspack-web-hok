<template>
  <div class="detail-container">
    <detail-template type="bilibili" @delAccount="delAccount" @add="addAccount" @active="activeAccount">
      <Realization slot="detailSlot03" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit"><span class="tips m-r-8">*</span>声明自制</div>
      </Realization>
      <Territory slot="detailSlot03" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit"><span class="tips m-r-8">*</span>分类</div>
      </Territory>
      <!-- <bilibili-label slot="detailSlot03" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit"><span class="tips m-r-8">*</span>标签</div>
      </bilibili-label> -->
      <entertainment slot="detailSlot06" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit">参与活动</div>
      </entertainment>
    </detail-template>
  </div>
</template>
<script>
import DetailTemplate from '../DetailTemplate/index.vue'
import Realization from './components/Realization.vue'
import Territory from './components/Territory.vue'
// import BilibiliLabel from './components/BilibiliLabel'
import Entertainment from './components/Entertainment'
import {
  bilibiliTemplateData
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'

export default {
  components: {
    Entertainment,
    // BilibiliLabel,
    DetailTemplate,
    Realization,
    Territory
  },
  inject: ['updatePublishChanelData', 'publishChannelData', 'updateActivePublishData', 'publishForm'],
  methods: {
    // 添加账号
    addAccount(list) {
      const template = JSON.parse(JSON.stringify(bilibiliTemplateData))
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
    },
    validPublish() {}
  }
}
</script>
<style lang="scss" scoped>
.tips{
  color: #F53F3F;
  font-size: 16px;
}
.kuaishouTit{
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-bottom: 12px;
}
.detail-container{
  height: 100%;
}
</style>
