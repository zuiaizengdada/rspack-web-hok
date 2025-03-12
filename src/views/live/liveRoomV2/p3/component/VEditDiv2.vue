<template>
  <div :ref="`input__container_${id}`" class="im-input">
    <div class="input__container overflowOuto">
      <div v-if="replySetting.ifReply" class="message_reply">
        <div class="messageReply text_hidden_ellipsis">
          <div class="messageReplyClose" @click="onhandleClickCloseReply">
            <i class="el-icon-close" />
          </div>
          <div class="text_hidden_ellipsis">
            <span>回复 </span>
            {{
              replySetting.data.messageReply.messageSenderName ||
              replySetting.data.messageReply.messageSender
            }}
            :
            <template v-if="replySetting.data.messageReply.messageType === 1">
              {{ replySetting.data.messageReply.messageAbstract | filterText }}
            </template>
            <template v-else> [图片] </template>
          </div>
        </div>
      </div>

      <div
        :id="`divEditor_${id}`"
        :ref="`divEditor_${id}`"
        :placeholder="placeholder"
        class="div-editor needsclick"
        :class="{ readonly: readonly }"
        :contenteditable="!readonly"
        :spellcheck="false"
        @keyup.enter.exact="submit"
        @keydown.enter.exact="handleKeydown"
        @paste.prevent="onPaste"
        @click="handleClick"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        v-html="editorText"
      />
    </div>

    <commandSvg v-show="ifCmdFlag" />
  </div>
</template>

<script>
import commandSvg from './commandSvg.vue'
import { imgBase64 } from '@/api/course'
import onPaste from './paste'
import { mapState } from 'vuex'
export default {
  components: {
    commandSvg
  },
  filters: {
    filterText(val) {
      console.log(val, '111')
      if (!val) return ''
      var imgTagRegex = /<img\b[^>]*>/gi
      console.log(val.replace(imgTagRegex, '[图片]'))
      return val.replace(imgTagRegex, '[图片]')
    }
  },
  props: {
    value: {
      type: [String, Object, HTMLDivElement],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      urlList: [],
      id: this.getUuiD(10),
      ifCmdFlag: false, // 是否命中指令
      editorText: this.value,
      isChange: true,
      lastCursor: null // 记录光标最后位置
    }
  },
  computed: {
    ...mapState({
      replySetting: state => state.im.replySetting,
      cmd: state => state.im.cmd
    })
  },
  watch: {
    modelValue(val) {
      console.log(val, '123123123123123')
      if (this.isChange) {
        this.editorText = this.value
      }
      if (this.cmd.enable && this.cmd.cmd) {
        const regexStr = '^(' + this.cmd.cmd + '\\d*[:：])'
        const regex = new RegExp(regexStr, 'i')
        if (regex.test(val)) {
          this.ifCmdFlag = true
          return
        }
      }
      this.ifCmdFlag = false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onLoad()
    })
  },
  methods: {
    // 点击删除回复
    onhandleClickCloseReply() {
      const data = {
        messageFeature: { needTyping: 0, version: 0 },
        messageReply: {
          cloudCustomData: '',
          messageAbstract: '', // 发送的消息内容
          messageSender: '', // 发送者ID
          messageSenderName: '', // 发送者姓名
          messageID: '',
          messageType: '', // 消息类型 1: 文本 3: 图片
          version: 0
        },
        payload: {}
      }
      this.$store.commit('im/SET_replySetting', { key: 'data', data: data })
      this.$store.commit('im/SET_replySetting', { key: 'ifReply', data: false })
    },
    getUuiD(randomLength) {
      return (
        Number(
          Math.random().toString().substr(2, randomLength) + Date.now()
        ).toString(36) +
        Math.floor(Math.random() * 10) +
        1
      )
    },
    //
    submit() {},
    // 回车和换行
    handleKeydown(event) {
      if (event.shiftKey && event.keyCode === 13) {
        document.execCommand('insertLineBreak') // 换行
        this.setFocus(event)
      } else if (event.keyCode === 13) {
        // 回车键
        this.$emit('sendMsg')
        event.preventDefault()
        return false
      }
    },
    handleClick() {
      this.$emit('clickFn')
      this.lastCursor = this.getLastCursor()
    },
    handleInput() {
      console.log('12123', this.getValue())
      // this.lastCursor = this.getLastCursor()
      this.$emit('update:modelValue', this.$el.innerHTML)

      const val = this.getValue()
      if (this.cmd.enable && this.cmd.cmd) {
        const regexStr = '^(' + this.cmd.cmd + '\\d*[:：])'
        const regex = new RegExp(regexStr, 'i')
        if (regex.test(val)) {
          this.ifCmdFlag = true
          return
        }
      }
      this.ifCmdFlag = false
    },
    // 获取焦点
    handleFocus() {
      this.isChange = false
      this.$emit('focusFn')
      // this.lastCursor = this.getLastCursor()
    },
    // 失去焦点
    handleBlur() {
      this.ifCmdFlag = false
      console.log('是去焦点')
      this.isChange = true
      this.lastCursor = this.getLastCursor()
      this.$emit('blurFn')
    },
    // 处理粘贴
    // 注意是异步处理
    async onPaste(event) {
      const result = await onPaste(event) // 传入粘贴事件
      // console.log('处理后的数据', result)
      // console.log('处理后的粘贴数据', result)
      const imgRegx = /^data:image|png|jpg|jpeg|gif|svg|bmp|tif/ // 支持的图片格式
      if (imgRegx.test(result.compressedDataUrl)) {
        this.imgSelection(result)
      } else {
        if (typeof result.data !== 'string') return
        // 插入文本
        document.execCommand('insertText', false, result.data)
      }
    },
    // 图片插入
    imgSelection(result) {
      const that = this
      console.log(result, 'result')
      imgBase64({ base64Data: result.url }).then(res => {
        console.log(res, 'res1111111111')
        const img = new Image()
        img.src = res.data.url
        img.onload = function () {
          console.log(img.width, img.height, '图片的宽高')
          const imgWidth = img.width > 300 ? 300 : img.width
          const imgHeight = img.height > 300 ? 300 : img.height
          const url = res.data.url
          const str = `<img src="${url}" style="width: ${imgWidth}px;height: ${imgHeight}px;display: inline-block;vertical-align: bottom;border: 1px solid transparent;object-fit: contain;" class="hok_editor_img"/>`
          console.log(str, 'str')
          that.insertHtmlAtCursor(str)
        }
        img.onerror = function () {
          that.$message.error('获取图片信息失败')
        }
      })
    },
    // 删除内容
    handleDel() {
      const sel = window.getSelection()
      if (this.lastCursor) {
        sel.removeAllRanges()
        sel.addRange(this.lastCursor)
      }
      const range = this.getLastCursor()
      range.collapse(false)
      document.execCommand('delete')
    },
    // 清空编辑器
    handleClear() {
      this.ifCmdFlag = false
      this.$refs[`divEditor_${this.id}`].innerHTML = ''
      this.$refs[`divEditor_${this.id}`].focus()
    },
    // 获取光标最后位置
    getLastCursor() {
      if (!window.getSelection) {
        return null
      }
      const sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0)
      }
    },
    // 光标处插入内容 @param html 需要插入的内容
    insertHtmlAtCursor(html) {
      this.restoreSelection(this.lastCursor) // 还原失焦前的光标位置
      const Editor = this.$refs[`divEditor_${this.id}`]
      Editor.focus()
      const range = window.getSelection().getRangeAt(0)
      range.collapse(false) // 光标移动到最后
      const node = range.createContextualFragment(html)
      const child = node.lastChild
      range.insertNode(node)

      console.log('child', node, child)

      // 将光标的起始位置设置在当前插入的元素后面
      if (child) {
        range.setEndAfter(child)
        range.setStartAfter(child)
      }
    },
    ignoreDrag(e) {
      // 确保其他元素不会取得该事件
      e.stopPropagation()
      e.preventDefault()
    },
    // 恢复光标
    restoreSelection(range) {
      if (range) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
    },
    getValue() {
      const Editor = this.$refs[`divEditor_${this.id}`]
      return Editor.innerHTML
    },
    onLoad() {
      const _this = this
      var dropBox
      if (!this.$refs[`input__container_${this.id}`]) {
        return
      }
      dropBox = this.$refs[`input__container_${this.id}`]
      // 鼠标进入放置区时
      dropBox.ondragenter = this.ignoreDrag
      // 拖动文件的鼠标指针位置放置区之上时发生
      dropBox.ondragover = this.ignoreDrag
      dropBox.ondrop = drop
      function drop(e) {
        e.stopPropagation()
        e.preventDefault()

        // 取得拖放进来的文件
        var data = e.dataTransfer
        var files = data.files
        // 将其传给真正的处理文件的函数

        var file = files[0]
        console.log(e, 'file')
        _this.$emit('onDropFile', file)
        // _this.$emit('onDropFile', file)
        // var reader = new FileReader()
        // reader.onload = function(e) {
        //   // dropBox.style.backgroundImage = "url('" + e.target.result + "')"
        //   console.log(e.target.result)
        // }
        // reader.readAsDataURL(file)
      }
    },
    onFocus() {
      this.$refs[`divEditor_${this.id}`].focus()
    },
    // 插入emoji
    insertEmoji(value) {
      this.$refs[`divEditor_${this.id}`].focus()
      console.log(this.lastCursor)
      this.restoreSelection(this.lastCursor) // 还原失焦前的光标位置
      document.execCommand('insertText', false, value)
    }
  }
}
</script>

<style lang="scss" scoped>
.im-input {
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .input__container {
    width: 100%;
    padding-left: 15px;
    padding-right: 102px;
    // height: 100%;
    flex: 1 0 0;
    overflow-x: hidden;
    overflow-y: overlay;
    z-index: 2;
    .div-editor {
      overflow: hidden;
      outline: 0 none;
      min-height: 100%;
      word-break: break-all;
      word-wrap: break-word;
      background-color: transparent;
      border: 0 none;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      text-align: left;
      overflow-y: auto;
      &[contenteditable='true'] {
        margin: 0;
        padding: 0;
        -webkit-user-select: text;
        user-select: text;
        -webkit-user-modify: read-write-plaintext-only;
        * {
          -webkit-user-select: text !important;
          user-select: text !important;
        }
      }
      &:empty::after {
        content: attr(placeholder);
        font-size: 14px;
        // font-family: PingFangSC-Regular, PingFang SC;
        line-height: 20px;
        color: #c2c6ce;
        text-align: left;
        pointer-events: none;
      }
      &.readonly {
        &:empty::after {
          display: none;
        }
      }
    }
  }

  .message_reply {
    // height: 25px;
    .messageReply {
      padding: 4px;
      font-size: 14px;
      // background: pink;
      background: #e1e6ed;
      display: flex;
      align-items: center;
      border-radius: 4px;
      color: #666666;
      .messageReplyClose {
        width: 20px;
        height: 20px;
        line-height: 20px;
        padding-right: 8px;
        margin-right: 8px;
        border-right: 1px solid #cbcfd3;
        cursor: pointer;
      }
    }
  }
}

.overflowOuto {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
