<template>
  <div class="editor">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :default-config="toolbarConfig"
      mode="default"
    />
    <Editor
      v-model="val"
      style="height: 400px; overflow-y: hidden;"
      :default-config="editorConfig"
      mode="simple"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  name: 'Editoritem',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      toolbarConfig: {
        excludeKeys: [
          'group-image',
          'group-video',
          'fontFamily',
          'insertTable',
          'todo',
          'group-more-style',
          'group-justify',
          'group-indent',
          'undo',
          'redo',
          'fullScreen',
          'divider',
          'codeBlock',
          'insertLink',
          'emotion',
          'bulletedList',
          'numberedList',
          'headerSelect',
          'blockquote',
          'underline',
          'italic',
          'bgColor',
          'lineHeight'
        ]
      },
      editorConfig: { placeholder: '请输入内容...' }
    }
  },
  computed: {
    val: {
      set(data) {
        this.$emit('update:value', data)
      },
      get() {
        console.log(this.value, 'this.value')
        return this.value
      }
    }
  },
  mounted() {

  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    }
  }
}
</script>

<style lang="scss" scoped>
.editor ::v-deep{
  width: 100%;
  max-width: 620px;
  // margin: 0 auto;
  position: relative;
  z-index: 0;
  .w-e-text {
    min-height: 300px;
  }
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 300px;
}
</style>
