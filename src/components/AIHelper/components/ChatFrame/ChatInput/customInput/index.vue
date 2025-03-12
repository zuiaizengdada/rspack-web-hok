<template>
  <div class="input-wrapper">
    <el-input
      v-if="isFocus || !value"
      :id="id"
      v-model="value"
      type="text"
      style="width: 100%"
      @input="autoWidthInput"
      @blur="blur"
    />
    <div v-else class="link-item" @click="linkClick">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    externalValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      customInput: null,
      value: '',
      id: '',
      isFocus: true
    }
  },
  watch: {
    value(val) {
      this.$emit('input', val)
    },
    externalValue(val) {
      //   console.log('externalValue', val)
      this.isFocus = true
      this.value = val
      this.$nextTick(() => {
        // this.autoWidthInput()
        document.getElementById(this.id).focus()
      })
    },
    isFocus(val) {
      if (val) {
        this.$nextTick(() => {
          // this.autoWidthInput()
        })
      }
    }
  },
  created() {
    this.id = new Date().getTime() + Math.random() + 'autoWidthInput'
  },
  methods: {
    linkClick() {
      this.isFocus = true
      this.$nextTick(() => {
        document.getElementById(this.id).focus()
      })
    },
    blur() {
      this.isFocus = false
    },
    autoWidthInput() {
      // const inputElement = document.getElementById(this.id)
      // // 获取输入框中的文本内容
      // var inputText = inputElement.value

      // // 获取文本内容的宽度
      // var textWidth = this.getTextWidth(inputText)
      // //   console.log(
      // //     'autoWidthInput',
      // //     document.getElementById('autoWidthInput').scrollWidth,
      // //     document.getElementById('autoWidthInput').clientWidth
      // //   )

      // // 设置输入框的宽度，加上一些额外的像素作为填充
      // inputElement.style.width = textWidth + 10 + 'px'

      this.isFocus = true
    },
    getTextWidth(text) {
      // 创建一个隐藏的临时元素，用于计算文本宽度
      var tempElement = document.createElement('span')
      tempElement.style.visibility = 'hidden'
      tempElement.style.whiteSpace = 'pre' // 保持空格和换行的格式
      tempElement.style.display = 'inline-block'
      tempElement.textContent = text

      // 将临时元素添加到文档中
      document.body.appendChild(tempElement)

      // 获取文本的宽度
      var width = tempElement.offsetWidth

      // 从文档中移除临时元素
      document.body.removeChild(tempElement)

      return width
    }
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep input {
//   width: 50px;
//   min-width: 50px;
//   max-width: 100%;
//   padding: 0 10px;
//   border-radius: 4px;
//   border: 1px solid #d9d9d9;
// }
.link-item {
  width: auto;
  max-width: fit-content;
  padding: 6px 8px;
  background: #e8ebee;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  user-select: none;
  cursor: pointer;
  margin: 1.5px 0;
}
</style>
