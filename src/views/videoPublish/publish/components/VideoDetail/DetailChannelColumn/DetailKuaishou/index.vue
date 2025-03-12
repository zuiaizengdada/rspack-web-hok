<template>
  <div class="detail-container">
    <detail-template type="kuaishou" @delAccount="delAccount" @add="addAccount" @active="activeAccount">
      <Realization slot="detailSlot06" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit">作者变现</div>
      </Realization>
      <Individualization slot="detailSlot06" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit">个性化设置</div>
      </Individualization>
      <Territory slot="detailSlot07" class="m-b-20">
        <div slot="kuaishouTit" class="kuaishouTit">所属领域</div>
      </Territory>
    </detail-template>
  </div>
</template>
<script>
import Realization from './components/Realization.vue'
import Individualization from './components/Individualization.vue'
import DetailTemplate from '../DetailTemplate/index.vue'
import Territory from './components/Territory.vue'
import { kuaishouTemplateData } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'
export default {
  components: {
    DetailTemplate,
    Realization,
    Individualization,
    Territory
  },
  inject: ['updatePublishChanelData', 'publishChannelData', 'updateActivePublishData', 'publishForm'],
  methods: {
    // 添加账号
    addAccount(list) {
      const template = JSON.parse(JSON.stringify(kuaishouTemplateData))
      const data = { ...template, ...this.publishForm }
      const _list = []
      list.forEach(item => {
        const copyData = JSON.parse(JSON.stringify(data))
        copyData.account = item
        _list.push(copyData)
      })
      this.updatePublishChanelData(_list)
    },
    // 选中账号
    activeAccount(accountId) {
      this.updateActivePublishData(accountId)
    },
    // 删除账号
    delAccount() {

    }
  }
}
</script>

<style lang="scss" scoped>
.kuaishouTit{
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-bottom: 12px;
}
</style>
<style lang="scss" scoped>
.detail-container{
  height: 100%;
}
</style>
