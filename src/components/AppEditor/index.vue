<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar" />
    <div ref="editor" class="text" />
    <div v-if="showWordCount" class="word-count">
      {{ currentWordCount }}/{{ maximumWords }} 字
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'Editoritem',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    },
    editorConfig: {
      type: Object,
      default: () => ({
        menus: [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          // 'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo', // 重复
          'fullscreen' // 全屏
        ]
      })
    },
    showWordCount: {
      type: Boolean,
      default: false
    },
    maximumWords: {
      type: Number,
      default: 1000
    },
    defaultStyle: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      currentWordCount: 0
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)

      // 基础配置
      this.editor.config.uploadImgShowBase64 = false
      this.editor.config.uploadImgServer =
        process.env.VUE_APP_BASE_URL + 'api/upload/img'
      this.editor.config.uploadImgHeaders = { Authorization: getToken() }
      this.editor.config.uploadFileName = 'file'
      this.editor.config.uploadImgMaxSize = 20 * 1024 * 1024
      this.editor.config.uploadImgMaxLength = 1
      this.editor.config.uploadImgTimeout = 30 * 60 * 1000
      this.editor.config.menus = this.editorConfig.menus
      this.editor.config.styleWithCSS = true

      // 设置默认样式配置
      if (this.defaultStyle) {
        // 设置默认字体大小
        this.editor.config.fontSize = {
          default: this.defaultStyle.fontSize,
          list: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
        }
      }

      // 监听内容变化
      this.editor.config.onchange = html => {
        const styledHtml = this.editor.txt.html()
        this.info_ = styledHtml
        this.$emit('change', this.info_)

        const text = this.editor.txt.text()
        this.currentWordCount = text.length
        if (this.currentWordCount > this.maximumWords) {
          const truncatedText = text.substring(0, this.maximumWords)
          this.editor.txt.text(truncatedText)
          return
        }
      }

      // 创建编辑器
      this.editor.create()

      // 设置初始内容
      const defaultHtml = this.value || '<p><br></p>'
      this.editor.txt.html(defaultHtml)

      // 初始化后应用默认样式
      if (this.defaultStyle) {
        const applyDefaultStyles = () => {
          const $textElem = this.editor.$textElem
          const defaultStyles = {}

          if (this.defaultStyle.fontSize) {
            defaultStyles['font-size'] = this.defaultStyle.fontSize
          }
          if (this.defaultStyle.isBold) {
            defaultStyles['font-weight'] = 'bold'
          }

          $textElem.find('p').css(defaultStyles)
        }

        // 1. 初始化时应用一次
        applyDefaultStyles()

        // 2. 只监听内容变化事件
        if (!this.editor.txt.eventHooks.changeEvents) {
          this.editor.txt.eventHooks.changeEvents = []
        }
        this.editor.txt.eventHooks.changeEvents.push(() => {
          setTimeout(applyDefaultStyles, 0)
        })
      }

      // 处理图片上传
      this.editor.config.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          console.log(result, 'result')
          if (result.code !== 1) {
            return Message({
              message: result.msg || '系统错误',
              type: 'error',
              duration: 5 * 1000
            })
          }
          // 图片上传成功，插入图片的回调
          // result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          // insertImg()为插入图片的函数
          // 循环插入图片
          // for (let i = 0; i < 1; i++) {
          const url = result.data.url
          insertImg(url)
          // }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor::v-deep {
  width: 100%;
  // max-width: 620px;
  position: relative;
  .w-e-text-container {
    ul {
      list-style: disc !important;
    }
    ol {
      list-style: auto !important;
    }
  }
}

.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
.word-count {
  position: absolute;
  right: 9px;
  top: 110px;
  z-index: 1000;
  text-align: right;
  color: #666;
  font-size: 12px;
}
</style>

<style lang="scss">
.editor {
  .w-e-toolbar {
    z-index: 2 !important; // 确保工具栏的下拉菜单在最上层
  }
  .w-e-text-container {
    z-index: 1 !important; // 编辑区域的z-index要低于工具栏
  }
}
</style>
