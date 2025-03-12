<template>
  <div class="detail-cover-container">
    <template-title title="作品封面"> <span v-if="visibleSubTitle" slot="subTitle" class="sub-title">优质的封面会极大增加同城曝光</span></template-title>
    <video-cover :src="coverSrc" @editCover="editCover" />
    <app-cut-out
      :is-bilibili="String(getActiveChannel)"
      :visible="cutOutFlag"
      :cut-out-img="coverSrc"
      @close="closeCutOut"
      @success="cutOutSuccess"
    />
  </div>
</template>
<script>
import VideoCover from '../../../Common/Cover.vue'
import TemplateTitle from './TemplateTitle.vue'
import AppCutOut from '../../../Common/AppCutOut/index.vue'
import { mixinsAllOperations } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    VideoCover,
    TemplateTitle,
    AppCutOut
  },
  mixins: [mixinsAllOperations],
  inject: ['publishForm', 'channel', 'video'],
  data() {
    return {
      coverSrc: '',
      cutOutFlag: false,
      visibleSubTitle: false
    }
  },
  computed: {
    getPublishFormCover() {
      return this.publishForm.cover
    },
    getActiveChannel() {
      return this.channel.id
    }
  },
  watch: {
    getPublishFormCover: {
      handler(val) {
        console.log(val, '详情监听封面变化。。。。')
        this.coverSrc = this.publishForm.cover
      }
    }
  },
  mounted() {
    this.visibleSubTitle = this.channel.id === 15
  },
  methods: {
    initData() {
      setTimeout(() => {
        this.coverSrc = this.publishChannelData.activeData.cover || this.publishForm.cover || this.video.data.posterUrl
      }, 500)
    },
    closeCutOut() {
      this.cutOutFlag = false
    },
    editCover() {
      this.cutOutFlag = true
      this.$uweb && this.$uweb.setAction('Event_videoPublish_editorCover')
    },
    // 封面裁剪成功
    cutOutSuccess(e) {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'cover', e)
      this.coverSrc = e
      this.cutOutFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
.sub-title{
  font-size:12px;
  margin-left:10px;
  color:#777777
}
</style>
