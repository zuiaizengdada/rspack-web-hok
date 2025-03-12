<template>
  <div>
    <div class="extendLink">
      扩展链接
    </div>
    <div class="extendLink-input">
      <el-input v-model="input" placeholder="将公众号文章链接或红包封面链接黏贴在此处" style="width: 100%;height: 32px" @change="changeLink" />
    </div>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'ExtendedLink',
  mixins: [mixinsAllOperations],
  data() {
    return {
      input: ''
    }
  },
  methods: {
    initData() {
      this.input = this.publishChannelData.activeData.extendLink || ''
    },
    changeLink() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'extendLink', this.input)
    }
  }
}
</script>

<style lang="scss" scoped>
.extendLink{
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
.extendLink-input{
  margin-top: 12px;
}
</style>
