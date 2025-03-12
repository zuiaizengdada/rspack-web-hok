<!-- 数据源创建 -->
<template>
  <el-dialog
    title="手动录入"
    :visible.sync="getDialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="form" v-loading="pageLoading" :model="form" :rules="rules">
      <el-form-item label="标题" prop="question">
        <el-input
          ref="question"
          v-model="form.question"
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
        />
        <div class="ai-btn">
          <el-button
            :loading="aiLoading"
            :disabled="!form.question"
            @click="aiGeneration"
          >
            AI生成
          </el-button>
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
import { aiQADataAdd } from '@/api/aigc/dataSourceManagment'
import { sensitiveChecking, getAIContent } from '@/api/aigc'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'
import '@wangeditor/editor/dist/css/style.css'
export default {
  name: 'CreatedDialog',
  components: { Editor },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        question: '',
        answer: '',
        isNotSensitive: false
      },
      rules: {
        question: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'change'
          }
        ]
      },
      pageLoading: false,
      loading: false,
      aiLoading: false,
      ruleTmpList: [],
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
          this.$nextTick(() => {
            this.$refs.form.resetFields()
            this.editor.enable()
          })
          this.isNotSensitive = false
          this.sensitiveList = []
          this.aiLoading = false
          this.sensitiveLoading = false
          this.form = {
            question: '',
            answer: ''
          }
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.question.focus()
    })
    this.getTmpRule()
  },
  methods: {
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
      // if (nums >= 5000) {
      //   this.textLength = 5000
      //   this.info.answer.length = 5000
      //   this.editor.clear()
      //   this.editor.setHtml(this.info.answer)
      //   return
      // }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    async getTmpRule() {
      this.pageLoading = true
      const res = await aiBusinessScenePage({
        pageIndex: 1,
        pageSize: 1000
      })
      this.ruleTmpList = res.data.items
      this.pageLoading = false
    },
    aiGeneration() {
      this.aiLoading = true
      const rTmp = this.ruleTmpList.find(item => item.id === '4')
      if (rTmp) {
        let text = rTmp.prompt
        text = text.replace('${QuestionTitle', this.form.question)
        text = text.replace('}', '')
        this.editor.disable()
        getAIContent({ action: 'generation', question: text })
          .then(res => {
            this.editor.enable()
            this.form.answer = res.answer
            this.aiLoading = false
          })
          .catch(() => {
            this.editor.enable()
            this.aiLoading = false
          })
      } else {
        this.aiLoading = false
        this.$message.error('获取组装模板失败')
      }
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
            let test = this.form.answer
            if (this.sensitiveList.length > 0) {
              this.sensitiveList.map(item => {
                const regItem = item.replace(/【/g, '').replace(/】/g, '')
                test = test.replaceAll(
                  regItem,
                  `<span style="color:red">${regItem}</span>`
                )
              })
              this.isNotSensitive = false
              this.editor.setHtml(test)
              this.editor.enable()
            } else {
              this.isNotSensitive = true
              this.editor.enable()
              this.sensitiveList = []
              this.form.answer = this.editor.getText()
            }
          }
        })
        .catch(() => {
          this.editor.enable()
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
          this.loading = true
          aiQADataAdd({ ...this.form, answer: this.editor.getText() })
            .then(res => {
              this.loading = false
              if (res.code === 1) {
                this.$message.success('提交成功')
                this.handleClose()
                this.$emit('success')
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
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
    .w-e-text-placeholder {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c0c4cc;
      font-style: normal;
      top: 12px;
      padding-left: 5px;
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
