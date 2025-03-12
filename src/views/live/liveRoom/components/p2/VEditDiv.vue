<template>
  <div :ref="`input__container_${id}`" class="im-input">
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
            {{ replySetting.data.messageReply.messageAbstract }}
          </template>
          <template v-else> [图片] </template>
        </div>
      </div>
    </div>
    <div class="input__container overflowOuto">
      <div
        :id="`divEditor_${id}`"
        :ref="`divEditor_${id}`"
        :placeholder="placeholder"
        class="div-editor needsclick"
        :class="{ readonly: readonly }"
        :contenteditable="!readonly"
        :spellcheck="false"
        @input="inputText"
        @keyup.enter.exact="submit"
        @keydown.enter.exact="handleKeydown"
        @paste.prevent="onPaste"
        @focus="focus"
        @blur="blur"
      />
    </div>
    <commandSvg v-show="ifCmdFlag" />
  </div>
</template>
<script>
import commandSvg from './commandSvg.vue'
import onPaste from './utils/paste'
import { mapState } from 'vuex'
export default {
  components: { commandSvg },
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
      id: this.getUuiD(10),
      isBlur: true, // 解决赋值时光标自动定位到起始位置
      text: '',
      ifCmdFlag: false, // 是否命中指令
      selection: null // 记录光标位置
    }
  },
  computed: {
    ...mapState({
      replySetting: state => state.im.replySetting,
      cmd: state => state.im.cmd
    })
  },
  watch: {
    value: {
      handler(val) {
        if (this.isBlur) {
          this.$refs[`divEditor_${this.id}`] &&
            (this.$refs[`divEditor_${this.id}`].innerHTML = val)
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
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.onLoad()
    })
  },
  methods: {
    getUuiD(randomLength) {
      return (
        Number(
          Math.random().toString().substr(2, randomLength) + Date.now()
        ).toString(36) +
        Math.floor(Math.random() * 10) +
        1
      )
    },
    // 聚焦
    focus(e) {
      this.isBlur = false
    },
    // 失焦
    blur() {
      this.isBlur = true
      this.selection = this.saveSelection()
      this.$emit('blurFunc', event)
    },
    submit() {},
    handleKeydown(event) {
      if (event.shiftKey && event.keyCode === 13) {
        document.execCommand('insertLineBreak') // 换行
        this.setFocus(event)
      } else if (event.keyCode === 13) {
        // 回车键
        // console.log('回车发送')
        this.$emit('sendMsg')
        event.preventDefault()
        return false
      }
    },
    // 失焦时保存光标
    saveSelection() {
      if (!window.getSelection) {
        return null
      }
      const sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0)
      }
    },
    // 失焦
    inputBlur(event) {
      this.selection = this.saveSelection()
      this.$emit('blurFunc', event)
    },
    // 注意是异步处理
    async onPaste(event) {
      const result = await onPaste(event) // 传入粘贴事件
      // console.log('处理后的数据', result)
      // console.log('处理后的粘贴数据', result)
      const imgRegx = /^data:image|png|jpg|jpeg|gif|svg|bmp|tif/ // 支持的图片格式
      if (imgRegx.test(result.compressedDataUrl)) {
        // const sel = window.getSelection() // 获取当前光标位置
        // if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
        //   const range = sel.getRangeAt(0)
        //   const img = new Image()
        //   img.src = result.compressedDataUrl // 使用压缩后的图片
        //   img.style = 'display: inline-block;vertical-align: bottom;'
        //   range.insertNode(img)
        //   range.collapse(false)
        //   sel.removeAllRanges()
        //   sel.addRange(range)
        // }
        console.log(result.data, 'result.data')
        this.$emit('sendPicMsg', result)
      } else {
        if (typeof result.data !== 'string') return
        // 插入文本
        document.execCommand('insertText', false, result.data)
      }
      // 插入文本
      // document.execCommand('insertText', false, result.data)
    },
    // 监听输入框内容
    inputText(event) {
      console.log(event, 'event')
      // console.log('子组件输入框的输入内容', this.$refs[`divEditor_${this.id}`].innerText)
      // console.log('子组件输入框的输入内容', this.$refs[`divEditor_${this.id}`].textContent)
      // console.log('子组件输入框的输入内容', this.$refs[`divEditor_${this.id}`].innerHTML)
      this.$emit('input', this.$refs[`divEditor_${this.id}`].innerText)
      const range = window.getSelection().getRangeAt(0) // 获取当前光标
      const position = range.getBoundingClientRect() // 获取当前光标的位置
      this.$emit('inputFunc', position, event)
    },
    insertContent(value, id = '') {
      this.$refs[`divEditor_${this.id}`].focus()
      let range
      this.restoreSelection(this.selection) // 还原失焦前的光标位置
      range = window.getSelection().getRangeAt(0)
      range.collapse(false) // 光标移动到最后

      const node = range.createContextualFragment(value)
      const child = node.lastChild
      range.insertNode(node)

      console.log('child', node, child)

      // 将光标的起始位置设置在当前插入的元素后面
      if (child) {
        range.setEndAfter(child)
        range.setStartAfter(child)
      }

      let sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      this.$nextTick(() => {
        if (
          /@<span name="at"/.test(this.$refs[`divEditor_${this.id}`].innerHTML)
        ) {
          // 使用正则替换，将已经输入的@替换掉
          // 如果直接赋值修改innerHTML，则光标默认会回到开头。因此需要额外处理光标
          this.$refs[`divEditor_${this.id}`].innerHTML = this.$refs[
            `divEditor_${this.id}`
          ].innerHTML.replace(/@<span name="at"/, '<span name="at"')
          this.$emit('input', this.$refs[`divEditor_${this.id}`].innerHTML)
          const el = document.getElementById(id)
          range = document.createRange()
          sel = window.getSelection()
          // 将光标重新定位到自定义的a标签后面
          range.setStartAfter(el)
          range.setEndAfter(el)

          sel.removeAllRanges()
          sel.addRange(range)
        }
      })
      this.$emit('input', this.$refs[`divEditor_${this.id}`].innerHTML)
    },
    // 恢复光标
    restoreSelection(range) {
      if (range) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
    },
    // 插入emoji
    insertEmoji(value) {
      this.$refs[`divEditor_${this.id}`].focus()
      this.restoreSelection(this.selection) // 还原失焦前的光标位置
      document.execCommand('insertText', false, value)
    },
    onfocus() {
      this.$refs[`divEditor_${this.id}`].focus()
    },
    // 输入框清空
    clear() {
      this.$refs[`divEditor_${this.id}`] &&
        (this.$refs[`divEditor_${this.id}`].innerHTML = '')
      this.$refs[`divEditor_${this.id}`].focus()
    },
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
    //
    ignoreDrag(e) {
      // 确保其他元素不会取得该事件
      e.stopPropagation()
      e.preventDefault()
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
        console.log(file, 'file')
        _this.$emit('onDropFile', file)
        // var reader = new FileReader()
        // reader.onload = function(e) {
        //   // dropBox.style.backgroundImage = "url('" + e.target.result + "')"
        //   console.log(e.target.result)
        // }
        // reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.im-input {
  width: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  height: 114px;
  position: relative;
  display: flex;
  flex-direction: column;
  .message_reply {
    // height: 25px;
    padding: 2px 24px 0;
    .messageReply {
      padding: 10px 8px;
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
  .input__container {
    padding-top: 10px;
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
    // height: 100%;
    flex: 1 0 0;
    overflow-x: hidden;
    overflow-y: overlay;
    .div-editor {
      overflow: hidden;
      outline: 0 none;
      min-height: 100%;
      word-break: break-all;
      word-wrap: break-word;
      background-color: transparent;
      border: 0 none;
      font-size: 16px;
      //   font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
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
        font-size: 16px;
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
