<!-- 知识库修改 -->
<template>
  <el-dialog
    v-if="getDialogVisible"
    title="修改"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="getDialogVisible"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="标题" prop="question">
        <el-input
          v-model="form.question"
          disabled
          maxlength="50"
          placeholder="请输入标题"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="内容" prop="answer" style="margin-bottom: 0" />
      <div style="position: relative; margin-bottom: 20px">
        <Editor
          ref="editor"
          v-model="form.answer"
          :default-config="editorConfig1"
          :mode="mode"
          class="answer"
          @onCreated="onCreated"
          @onChange="handleChange"
          @customPaste="customPaste"
        />
        <div class="ai-btn">
          <div />
          <div
            class="count"
            :style="{ color: textLength > 5000 ? 'red' : '#777777' }"
          >
            <span v-if="textLength > 5000" style="margin-right: 5px">
              内容不能超过5000字</span>
            {{ textLength }}/5000
          </div>
        </div>
      </div>
      <div class="flex flex-middle">
        <el-button
          :loading="sensitiveLoading"
          class="sensitive-btn"
          size="small"
          @click="sensitiveChecking"
        >
          <div class="sensitive-row">
            <img src="@/assets/image/aigc/execl-import.png" alt="">
            敏感词检测
          </div>
        </el-button>
        <span v-if="sensitiveList.length > 0" class="sensitive-content">
          {{ sensitiveList.join(',') }}
        </span>
        <span v-if="isNotSensitive" style="color: #00b42a; margin-left: 10px">
          暂无敏感词
        </span>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" :loading="loading" @click="submit">
        提交审核
      </el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { Editor } from '@wangeditor/editor-for-vue'
import { knowledgeUpdate } from '@/api/aigc/knowledgeManagement'
import { sensitiveChecking } from '@/api/aigc'
import '@wangeditor/editor/dist/css/style.css'
export default {
  name: 'CreatedDialog',
  components: {
    Editor
  },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: { question: '', answer: '' },
      rules: {},
      loading: false,
      sensitiveList: [],
      sensitiveLoading: false,
      mode: 'simple',
      editorConfig1: {
        placeholder: '请输入回答'
      },
      editor: null,
      textLength: 0,
      isNotSensitive: false
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (!val) {
          this.isNotSensitive = false
          this.sensitiveList = []
        }
        if (val && this.row.id) {
          this.form = {
            ...this.row
          }
        }
      }
    }
  },
  methods: {
    customPaste(ed, event) {
      const text = event.clipboardData.getData('text/plain')
      ed.insertText(text)
      event.preventDefault()
      return false
    },
    handleChange() {
      const arr = this.editor.children
      let nums = 0
      arr.forEach(ele => {
        ele.children.forEach(item => {
          if (item.text !== '') {
            if (!item?.type) {
              nums += item.text.length
            }
          }
        })
      })
      this.textLength = nums
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      this.editor.focus(true)
    },
    sensitiveChecking() {
      if (!this.editor.getText()) {
        return
      }
      this.editor.disable()
      this.sensitiveLoading = true
      sensitiveChecking({ content: this.editor.getText() })
        .then(res => {
          this.sensitiveLoading = false
          if (res.code === 1) {
            this.sensitiveList = res.data
            if (this.sensitiveList.length > 0) {
              this.isNotSensitive = false
              this.sensitiveList.map(item => {
                const regItem = item.replace(/【/g, '').replace(/】/g, '')
                this.form.answer = this.form.answer.replaceAll(
                  regItem,
                  `<span style="color:red">${regItem}</span>`
                )
              })
              this.editor.enable()
            } else {
              this.isNotSensitive = true
              this.editor.enable()
              this.sensitiveList = []
              this.form.answer = this.editor.getText()
            }
          } else {
            this.editor.enable()
            this.sensitiveList = []
            this.form.answer = this.editor.getText()
          }
        })
        .catch(() => {
          this.sensitiveLoading = false
        })
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      if (this.textLength > 5000) {
        this.$message.error('内容不能超过5000字')
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false
          knowledgeUpdate({
            id: this.row.id,
            answer: this.editor.getText()
          }).then(res => {
            this.loading = false
            if (res.code === 1) {
              this.$message.success('修改成功')
              this.$emit('close')
              this.$emit('success')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-btn {
  position: absolute;
  left: 13px;
  bottom: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  .count {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
}
::v-deep .el-dialog__header {
  .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
  }
  border-bottom: 1px solid #e7e7e7;
}
::v-deep .el-dialog__body {
  padding-top: 16px;
}
::v-deep .answer {
  height: 400px;
  .w-e-text-container {
    font-size: 14px;
    color: #000;
    background-color: #fafafa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    p {
      margin: 0;
    }
    .w-e-max-length-info {
      bottom: 14px;
    }
    .w-e-scroll {
      padding-top: 10px;
      height: 88%;
      div {
        padding: 0 15px;
      }
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
    .w-e-text-placeholder {
      top: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #C0C4CC;
      font-style: normal;
      padding-left: 8px;
    }
  }
}
.sensitive-btn {
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #333333;
  font-size: 14px;
  display: flex;
  .sensitive-row {
    display: flex;
    align-items: center;
    img {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
  &:hover {
    background-color: #e7f1ff;
    border-color: #b6d4ff;
  }
}
.sensitive-content {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f53f3f;
  margin-left: 10px;
}
::v-deep .el-dialog__headerbtn {
  i {
    font-size: 20px;
  }
}
</style>
