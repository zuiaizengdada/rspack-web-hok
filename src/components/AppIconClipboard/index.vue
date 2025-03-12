<template>
  <div class="appIconClipboard" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <el-tooltip v-if="show" class="item" effect="dark" :content="content" placement="top-start">
      <i v-clipboard:copy="src" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy a_link m-l-10" />
    </el-tooltip>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  directives: {
    clipboard
  },
  props: {
    src: {
      type: [String, Array],
      default: ''
    },
    content: {
      type: String,
      default: '点此复制'
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    successFn() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.appIconClipboard {
    display: inline-block;
}
</style>
