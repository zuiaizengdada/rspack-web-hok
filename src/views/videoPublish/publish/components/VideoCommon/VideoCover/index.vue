<template>
  <div class="cover-container flex items-center w-full">
    <publish-title title="作品封面" />
    <video-cover :src="coverSrc" @editCover="editCover" />
    <app-cut-out :visible="cutOutFlag" :cut-out-img="coverSrc" @close="closeCutOut" @success="cutOutSuccess" />
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
import VideoCover from '../../Common/Cover.vue'
import AppCutOut from '../../Common/AppCutOut/index.vue'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
export default {
  components: {
    PublishTitle,
    VideoCover,
    AppCutOut
  },
  inject: ['updatePublishCover', 'updataPublishAllList'],
  mixins: [mixinsAllOperations],
  data() {
    return {
      coverSrc: '',
      cutOutFlag: false
    }
  },
  computed: {
    getVideoData() {
      return this.video.data
    },
    getPublishFormCover() {
      return this.publishForm.cover
    }
  },
  watch: {
    getVideoData: {
      handler(val) {
        console.log(val, this.publishForm.cover, '改变封面2')
        this.coverSrc = this.publishForm.cover || val.posterUrl
        // this.updatePublishCover(val.posterUrl)
        // this.$set(this.publishForm, 'cover', val)
        // this.publishForm.cover = val.posterUrl
      },
      deep: true
    },
    getPublishFormCover: {
      handler(val) {
        this.changeCover()
      }
    }
  },
  methods: {
    initData() {

    },
    changeCover() {
      console.log('改变封面1')
      this.coverSrc = this.getPublishFormCover
    },
    closeCutOut() {
      this.cutOutFlag = false
    },
    editCover() {
      this.cutOutFlag = true
      this.$uweb && this.$uweb.setAction('Event_videoPublish_clickCover')
    },
    // 封面裁剪成功
    cutOutSuccess(e) {
      console.log(e, '封面裁剪成功')
      this.coverSrc = e
      this.publishForm.cover = e
      // this.$set(this.publishForm, 'cover', e)
      this.updatePublishCover(e)
      this.updataPublishAllList('cover', e)
      this.cutOutFlag = false
    }
  }
}
</script>
