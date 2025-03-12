<template>
  <div class="title-container">
    <template-title v-if="type === 'bilibili'" title="作品标题"> <em slot="required" class="required">*</em></template-title>
    <Title :title="commonTitle" :max="max" @change="changeTit" />
  </div>
</template>
<script>
import Title from '../../../Common/Title.vue'
import TemplateTitle from './TemplateTitle.vue'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    Title,
    TemplateTitle
  },
  mixins: [mixinsAllOperations],
  props: {
    max: {
      type: Number,
      default: 20
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      commonTitle: '',
      isRequired: false
    }
  },
  computed: {
    getPublishFormTitle() {
      return this.publishChannelData.activeData.title
    }
  },
  watch: {
    getPublishFormTitle: {
      handler(val) {
        this.commonTitle = val
      },
      deep: true
    }
  },
  methods: {
    initData() {
      this.commonTitle = this.publishChannelData.activeData.title
    },
    // 改变了标题
    changeTit(e) {
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'title', e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.required{
  color: #F53F3F;
  font-size: 16px;
  margin-right:8px;
}
</style>
