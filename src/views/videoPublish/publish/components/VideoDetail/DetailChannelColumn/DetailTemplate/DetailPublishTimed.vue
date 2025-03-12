<template>
  <div class="address-container">
    <template-title title="定时发布" />
    <publish-timed :type="type" :publish-timed-data="publishTimedData" :tips="tips" @change="handlerChange" />
  </div>
</template>
<script>
import PublishTimed from '../../../Common/PublishTimed.vue'
import TemplateTitle from './TemplateTitle.vue'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    TemplateTitle,
    PublishTimed
  },
  mixins: [mixinsAllOperations],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips: '',
      publishTimedData: {}
    }
  },
  computed: {
    getVideoPublishTimed() {
      return this.publishForm.publishTimed
    }
  },
  watch: {
    getVideoPublishTimed(val) {
      this.publishTimedData = val
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'publishTimed', val)
    }
  },
  created() {
    if (this.type === 'bilibili') {
      this.tips = '提示：当前+2小时 ≤ 可选时间 ≤ 当前+15天，定时发布一经选择不支持修改/取消'
    } else if (this.type === 'wechart') {
      this.tips = '提示：当前+10分钟 ≤ 可选时间 ≤ 当前+7天，定时发布一经选择不支持修改/取消'
    } else if (this.type === 'xiaohongshu') {
      this.tips = '提示：当前+1小时 ≤ 可选时间 ≤ 当前+15天，定时发布一经选择不支持修改/取消'
    } else if (this.type === 'kuaishou') {
      this.tips = '提示：当前+1小时 ≤ 可选时间 ≤ 当前+12天，定时发布一经选择不支持修改/取消'
    } else {
      this.tips = '提示：当前+2小时 ≤ 可选时间 ≤ 当前+15天，定时发布一经选择不支持修改/取消'
    }
  },
  methods: {
    async initData() {
      this.publishTimedData = {}
      this.publishTimedData = this.publishChannelData.activeData?.publishTimed
      const activeData = this.publishChannelData.activeData
      if (Object.keys(activeData).length) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'publishTimed', this.publishTimedData)
      }
    },
    handlerChange(e) {
      this.publishTimedData = {}
      this.publishTimedData = e
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'publishTimed', e)
    }
  }
}
</script>
<style lang="scss" scoped>

.address-container{
  display: flex;
  flex-direction: column;
}
</style>
