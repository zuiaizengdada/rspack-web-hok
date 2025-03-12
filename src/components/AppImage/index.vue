
<template>
  <el-image
    style="width: 100%; height: 100%"
    :src="src"
    fit="contain"
    :preview-src-list="previewSrcList"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    previewSrcList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>

</style>
