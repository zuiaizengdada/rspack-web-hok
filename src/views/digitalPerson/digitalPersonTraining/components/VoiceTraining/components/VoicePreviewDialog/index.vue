<template>
  <el-dialog
    :visible.sync="config.visible"
    append-to-body
    title="声音预览"
    width="560px"
    top="40vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <audio
      :key="audioKey"
      style="width: 100%"
      :src="audioSrc"
      controls
    />
  </el-dialog>
</template>

<script>
export default {
  name: 'VoicePreviewDialog',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      audioKey: 0
    }
  },
  computed: {
    audioSrc() {
      const { row } = this.config
      return row.activeType === 'training' ? row.audioUrl : row.voiceAudioUrl
    }
  },
  watch: {
    'config.visible'(newVal) {
      if (newVal) {
        // 每次打开弹窗时更新key，强制重新创建audio元素
        this.audioKey++
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px 36px;
  }
}
</style>
