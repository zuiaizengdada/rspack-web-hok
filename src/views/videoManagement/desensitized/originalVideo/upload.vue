<template>
  <origin-info origin="upload" :is-back-callback="true" :status="3" :visible-cancel="false" @back="routeBack" @save="saveSuccess" />
</template>
<script>
import OriginInfo from './components/OriginInfo.vue'
export default {
  components: {
    OriginInfo
  },
  methods: {
    routeBack() {
      const isBackTips = localStorage.getItem('isBackTips')
      if (!isBackTips) {
        this.$confirm('返回不影响视频上传，可前往任务中心查看上传进度。', '提示', {
          type: 'warning',
          confirmButtonText: '我知道了',
          cancelButtonText: '取消'
        }).then(async () => {
          localStorage.setItem('isBackTips', true)
          this.$router.go(-1)
        }).catch(() => {

        })
      } else {
        this.$router.go(-1)
      }
    },
    saveSuccess() {
      this.$message.success('保存成功')
      this.$router.go(-1)
    }
  }
}
</script>
