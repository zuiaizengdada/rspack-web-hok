<template>
  <div class="text-content markdown-body">
    <div v-highlight v-html="renderedMarkdown" />
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
export default {
  components: {
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    renderedMarkdown() {
      return this.md.render(this.source)
    }
  },
  created() {
    this.md = new MarkdownIt()
  }
}
</script>
<style lang="scss" scoped>
.text-content {
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-track {
    background: null;
  }
  &::-webkit-scrollbar-thumb {
    background: #c2d9ff;
  }
  .markdownBox::v-deep {
  }
}
.markdown-body::v-deep {
  > p:nth-last-of-type(1) {
    margin: 0 !important;
  }
  table {
    margin-top: 10px !important;
  }
  ul {
    li::before {
      content: '\2022'; /* 使用 Unicode 或其他字符表示小点 */
      color: #3a7fff; /* 设置小点颜色 */
      display: inline-block; /* 使小点与文本在同一行 */
      width: 1em; /* 调整小点的宽度，以适应需要的大小 */
      font-size: 16px;
      margin-left: -1em; /* 负的左边距使小点与文本对齐 */
    }
  }
  ol > li::marker {
    color: #3a7fff;
  }
  pre{
    font-size: 70%;
  }
  h3 {
    font-size: 20px;
  }
}
</style>

