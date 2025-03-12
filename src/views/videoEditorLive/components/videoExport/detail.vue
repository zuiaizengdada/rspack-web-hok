<template>
  <div class="detail">
    <div class="detailLeft">
      <videoSelect
        v-if="projectId"
        ref="videoSelect"
        :cut-line-active-list="cutLineActiveList"
        :project-video-id="projectVideoId"
        :project-id="projectId"
        @preview="preview"
        @getName="(res) => $emit('getName', res)"
        @changeContent="changeContent"
        @previewPause="previewPause"
        @selectLength="(res) => $emit('selectLength', res)"
      />
    </div>
    <div class="detailRight">
      <videoPreview ref="videoPreview" :if-play="ifPlay" :project-id="projectId" :preview-video-data="previewVideoData" :project-video-id="projectVideoId" />
    </div>
  </div>
</template>

<script>
import videoSelect from './videoSelect.vue'
import videoPreview from './videoPreview.vue'
export default {
  components: {
    videoSelect,
    videoPreview
  },
  props: {
    projectId: {
      type: String,
      default: ''
    },
    projectVideoId: {
      type: String,
      default: ''
    },
    cutLineActiveList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      previewVideoData: {
        label: '',
        previewPlayIndex: 0,
        duration: '',
        videoName: '',
        videoUrl: ''
      },
      ifPlay: false
    }
  },
  mounted() {},
  methods: {
    changeGrayExport() {
      this.$refs.videoSelect.changeGrayExport()
    },
    // 点击预览
    preview(data) {
      this.ifPlay = true
      this.previewVideoData = data
    },
    // 点击预览（不播放）
    previewPause(data) {
      this.ifPlay = false
      this.previewVideoData = data
    },
    // 导出
    operateClipsGenerate(projectName) {
      return this.$refs.videoSelect.operateClipsGenerate(projectName)
    },
    destroyPlayer() {
      this.$refs.videoPreview && this.$refs.videoPreview.destroyPlayer()
    },
    changeContent() {
      this.$emit('changeContent')
    },
    init() {
      this.destroyPlayer()
      this.previewVideoData = {
        label: '',
        previewPlayIndex: 0,
        duration: '',
        videoName: '',
        videoUrl: ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.detail {
    background: #1E1F1E;
    display: flex;
    padding: 20px 20px 0;
    .detailLeft {
      width: 586px;
    }
    .detailRight {
      flex: 1 0 0;
      padding-left: 33px;
    }
}
</style>
