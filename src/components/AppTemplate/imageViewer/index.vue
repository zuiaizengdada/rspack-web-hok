<template>
  <div>
    <el-image-viewer
      v-if="show"
      :on-close="closeViewer"
      :url-list="urlList"
    />
  </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ImageView',
  components: { ElImageViewer },
  data() {
    return {
      urlList: [],
      show: false
    }
  },
  methods: {
    open(urlList) {
      this.urlList = urlList
      this.show = true
    },
    closeViewer() {
      this.show = false
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-image-viewer__close{
  color:white;
}
</style>
