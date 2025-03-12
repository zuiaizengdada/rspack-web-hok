<template>
  <el-dialog
    title="文案详情"
    :visible.sync="dialogVisible"
    :before-close="
      () => {
        $emit('close')
      }
    "
  >
    <div id="contentId" v-loading="loading" class="content">
      {{ content }}
    </div>

    <div slot="footer">
      <el-button type="primary" size="small" @click="copyText">
        复制文案
      </el-button>
      <el-button
        size="small"
        @click="
          () => {
            $emit('close')
          }
        "
      >
        关闭
      </el-button>
    </div></el-dialog>
</template>
<script>
import { copy } from '@/utils'
import { getVideoDetail } from '@/api/aiVideoManage'
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      copy: copy,
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {
    // this.getVideoDetail()
  },
  methods: {
    getText() {
      const dom = document.getElementById('contentId')
      let text = ''
      const children = dom?.childNodes || []
      console.log(children, 'children')
      if (children.length > 0) {
        children.forEach(item => {
          if (item.nodeType === 1) {
            const type = item.attributes?.tags?.value
            if (type === 'number-tag' || type === 'chinese-tag') {
              text += item.childNodes[0].innerText
            }
            if (type === 'sensitive') {
              text += item.innerText
            }
            if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
              text += this.mapTags(item)
            }
            if (!type) {
              const children2 = item.childNodes || []
              if (children2.length > 0) {
                children2.forEach(item2 => {
                  if (item2.nodeType === 1) {
                    const type = item2.attributes?.tags?.value
                    if (type === 'number-tag' || type === 'chinese-tag') {
                      text += item2.childNodes[0].innerText
                    }
                    if (type === 'sensitive') {
                      text += item2.innerText
                    }
                    if (
                      type === 'ys-tag' ||
                      type === 'yd-tag' ||
                      type === 'yl-tag'
                    ) {
                      text += this.mapTags(item2)
                    }
                    if (!type) {
                      text += item2.innerText || ''
                    }
                  } else if (item2.nodeType === 3) {
                    text += item2.data
                  }
                })
              } else {
                text += item.innerText
              }
            }
          } else if (item.nodeType === 3) {
            text += item.data
          }
        })
      } else {
        text = dom.innerText
      }
      console.log(text.trim(), 'text')
      return text
    },
    mapTags(item) {
      let text = ''
      const label = item.childNodes[0]
      label.childNodes.forEach(child => {
        if (child.nodeType === 1) {
          const type = child.attributes?.tags?.value
          if (type === 'number-tag' || type === 'chinese-icon') {
            text += child.childNodes[0].innerText
          }
          if (type === 'ys-tag' || type === 'yd-tag' || type === 'yl-tag') {
            text += this.mapTags(child)
          }
        } else {
          text += child.data
        }
      })
      return text
    },
    getVideoDetail() {
      getVideoDetail({ videoId: this.id })
        .then(res => {
          this.loading = false
          this.mapOldGenerateContent(res.data.generateContent)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 兼容旧数据（组件更换）
    mapOldGenerateContent(val) {
      if (!val || val.length < 1) return
      let htmlText = val
      const parser = new DOMParser()
      const parserHtml = parser.parseFromString(htmlText, 'text/html').body
        .firstChild

      parserHtml.childNodes.forEach(item => {
        if (
          item.attributes &&
          item.attributes['data-w-e-type']?.value === 'tags'
        ) {
          const type = Number(item.attributes['data-type'].value)
          const id = new Date().getTime()
          const info = JSON.parse(
            decodeURIComponent(item.attributes['data-info'].value)
          )
          if (type === 1) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                info.value
              }" data-info=${JSON.stringify(
                info
              )} tags="pause-tag"> <span id="${id}_tag" data-value="${
                info.value
              }" tags="pause-icon" contenteditable="false" class="pause-icon">${
                info.label
              }</span></span>`
            )
          }
          if (type === 2) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                info.value
              }" data-info=${JSON.stringify(
                info
              )} tags="mute-tag"> <span id="${id}_tag" data-value="${
                info.value
              }" tags="mute-icon" contenteditable="false" class="pause-icon">${
                info.label
              }</span></span>`
            )
          }
          if (type === 3) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                item.attributes['data-value']?.value
              }" data-info=${JSON.stringify(
                info
              )} tags="chinese-tag"> <span id="${id}_label" data-value="${
                info.label
              }" tags="chinese-label" contenteditable="false" class="chinese-label">${
                info.text
              }</span><span id="${id}_tag" data-value="${
                info.label
              }" tags="chinese-icon" contenteditable="false" class="chinese-icon">${
                info.label
              }</span></span></span>`
            )
          }
          if (type === 4) {
            htmlText = htmlText.replace(
              item.outerHTML,
              `<span id="${id}_parent" data-value="${
                item.attributes['data-value']?.value
              }" data-info=${JSON.stringify(
                info
              )} tags="number-tag"> <span id="${id}_label" data-value="${
                info.label
              }" tags="number-label" contenteditable="false" class="number-label">${
                info.text
              }</span><span id="${id}_tag" data-value="${
                info.label
              }" tags="number-icon" contenteditable="false" class="number-icon">${
                info.label
              }</span></span></span>`
            )
          }
        }
      })
      document.getElementById('contentId').innerHTML = htmlText
        .replace('<p>', '')
        .replace('</p>', '')
    },
    copyText() {
      this.copy(this.content)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 12px 20px;
  border-bottom: 1px solid #e7e7e7;

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    i {
      font-size: 20px;
      color: #000;
    }
  }
}
::v-deep {
  .el-dialog__body {
    padding: 20px !important;
  }
}
.content {
  padding: 16px;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
  font-size: 14px;
  color: #666666;
  height: 500px;
  overflow-y: auto;
  white-space: pre-line;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d8d8d8;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep {
  .emptyStr {
    margin: 0 0.5px;
  }
  .label {
    padding-bottom: 1px;
    margin-right: 1px;
  }
  .icon {
    font-size: 12px;
    border-radius: 3px;
    user-select: none;
    pointer-events: none;
    padding-left: 2px;
    padding-right: 2px;
    white-space: nowrap;
  }
  .pause-icon {
    @extend .icon;
    background-color: #e7f0ff;
    margin: 0 6px;
  }
  .number-label {
    @extend .label;
    border-bottom: 1px solid rgb(255, 152, 0);
  }
  .number-icon {
    @extend .icon;
    background-color: rgb(255, 152, 0);
  }
  .chinese-label {
    @extend .label;
    border-bottom: 1px solid rgb(255, 152, 0);
  }
  .chinese-icon {
    @extend .icon;
    background-color: rgb(255, 152, 0);
  }
  .ys-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #21a8c2;
    // .number-label {
    //   user-select: none;
    // }
  }
  .ys-icon {
    @extend .icon;
    background-color: #21a8c2;
  }
  .yd-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #00c6a1;
  }
  .yd-icon {
    @extend .icon;
    background-color: #00c6a1;
  }
  .yl-label {
    @extend .label;
    padding-bottom: 3px;
    border-bottom: 1px solid #00d2ff;
  }
  .yl-icon {
    @extend .icon;
    background-color: #00d2ff;
  }
}
</style>
