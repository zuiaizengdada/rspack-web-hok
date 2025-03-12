<template>
  <div class="detail-intro-container">
    <template-title title="作品简介" />
    <div class="intro-content">
      <el-input v-model="publishIntro" class="intro-content-el-tet" type="textarea" show-word-limit :maxlength="max" @input="publishIntroInput" />
    </div>

  </div>
</template>
<script>
import TemplateTitle from '../TemplateTitle.vue'

import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    TemplateTitle
  },
  mixins: [mixinsAllOperations],
  inject: ['publishForm', 'updataPublishActiveData', 'publishChannelData'],
  props: {
    max: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      publishIntro: '',
      topics: [],
      friends: [],
      addTopics: []
    }
  },
  computed: {
    getPublishFormIntro() {
      return this.publishChannelData.activeData.intro
    }

  },
  watch: {
    getPublishFormIntro(val) {
      this.publishIntro = val
    }
  },
  methods: {
    initData() {
      this.publishIntro = this.publishChannelData.activeData.intro
    },
    publishIntroInput(val) {
      console.log(val, '发生了改变')
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'intro', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.intro-content{
  margin-bottom:12px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  padding:8px;
}
.topic-item,.friend-item{
  margin-right:8px;
}
.topic-friend-add{
  margin-bottom:12px;
  span{
     margin-right:20px;
    width: 124px;
    height: 28px;
    background: #F1F5FC;
    border-radius: 4px;
    font-size: 14px;
    color: #777777;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
  }
}
.intro-content{
  .limit{
    color:#999;
    font-size:12px;
  }
}
::v-deep .el-textarea__inner{
  border:none;
  padding:0;
}

.intro-content-el-tet {
  height: 110px;
  ::v-deep .el-textarea__inner {
    height: 110px;
  }
}
</style>
