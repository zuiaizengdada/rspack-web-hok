<!-- 内容审核 -->
<template>
  <div v-loading="loading" :class="{ wrapper: true, isNullInfo: !info.id }">
    <div class="title">内容审核</div>
    <div class="switch-custom">
      <div
        :class="{ 'switch-item': true, 'switch-item-checked': index === 0 }"
        @click="changeIndex(0)"
      >
        待处理
      </div>
      <div
        :class="{ 'switch-item': true, 'switch-item-checked': index === 1 }"
        @click="changeIndex(1)"
      >
        已驳回
      </div>
    </div>

    <div v-if="!!info.id" class="row">
      <div class="label">
        <div>标题</div>
        <div class="time-t">
          <span>{{
            index === 0 ? info.submissionReviewTime : info.rejectedTime
          }}</span>
          <span v-if="index === 0" style="margin-left: 10px">
            来源：{{ getSource() }}
          </span>
          <span v-if="index === 1" style="margin-left: 10px">
            操作人：{{ info.operator }}
          </span>
        </div>
      </div>
      <div class="content">{{ info.question }}</div>

      <template v-if="index === 1">
        <div class="label">原因</div>
        <div class="content">{{ info.reason }}</div>
      </template>

      <div class="label">
        <div>内容</div>
        <el-button
          v-if="!info.oldAnswer && index === 0"
          size="small"
          type="danger"
          @click="del"
        >
          删除
        </el-button>
      </div>
      <div style="position: relative; margin-top: 21px">
        <Editor
          ref="editor"
          v-model="info.answer"
          :default-config="editorConfig1"
          :mode="mode"
          placeholder="请输入回答"
          class="answer"
          @onCreated="onCreated"
          @onChange="handleChange"
        />
        <div class="ai-btn">
          <el-button :loading="aiLoading" @click="aiGeneration">
            AI生成
          </el-button>
          <div
            class="count"
            :style="{ color: textLength > 5000 ? 'red' : '#777777' }"
          >
            <span v-if="textLength > 5000" style="margin-right: 5px">
              内容不能超过5000字</span
            >
            {{ textLength }}/5000
          </div>
        </div>
      </div>
      <div v-if="!loading" class="flex flex-middle" style="margin-top: 20px">
        <el-button
          :loading="sensitiveLoading"
          class="sensitive-btn"
          size="small"
          @click="sensitiveChecking"
        >
          <div class="sensitive-row">
            <img src="@/assets/image/aigc/execl-import.png" alt="" />
            敏感词检测
          </div>
        </el-button>
        <span v-if="sensitiveList.length > 0" class="sensitive-content">
          {{ sensitiveList.join(',') }}
        </span>
        <span
          v-if="isNotSensitive"
          style="color: #00b42a; margin-left: 10px; font-size: 14px"
        >
          暂无敏感词
        </span>
      </div>
    </div>
    <el-empty v-else description="暂无审批数据" :image-size="405">
      <template slot="image">
        <img
          class="null-img"
          src="@/assets/image/aigc/examine-null.png"
          alt=""
        />
      </template>
    </el-empty>
    <div v-if="!!info.id" class="footer">
      <el-button
        :loading="saveLoading"
        type="primary "
        size="small"
        @click="submit"
      >
        通过并处理下一条
      </el-button>
      <el-button :loading="saveLoading" size="small" @click="next">
        跳过
      </el-button>
    </div>
  </div>
</template>
<script>
import { Editor } from '@wangeditor/editor-for-vue'
import {
  contentReviewPending,
  contentReviewRejected,
  contentReviewPass,
  contentReviewSkip,
  aiQADataDel
} from '@/api/aigc/dataSourceManagment'
import { sensitiveChecking, getAIContent } from '@/api/aigc'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'
import { getMapObj } from '../enums'
import '@wangeditor/editor/dist/css/style.css'
export default {
  name: 'ExpertExamine',
  components: { Editor },
  data() {
    return {
      index: 0,
      loading: false,
      saveLoading: false,
      sensitiveLoading: false,
      sensitiveList: [],
      info: {
        answer: undefined,
        id: undefined,
        oldAnswer: undefined,
        question: undefined,
        source: undefined,
        submissionReviewTime: undefined
      },
      aiLoading: false,
      ruleTmpList: [],
      mode: 'simple',
      editorConfig1: {
        placeholder: '请输入内容'
      },
      editor: null,
      textLength: 0,
      isNotSensitive: false
    }
  },
  created() {
    this.getTmpRule()
    this.getWaitOrRejtctInfo()
    this.onunloadWndow()
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
    },
    onunloadWndow() {
      window.onunload = e => {
        contentReviewSkip({ id: this.info.id })
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      this.editor.blur()
    },
    aiGeneration() {
      this.aiLoading = true
      const rTmp = this.ruleTmpList.find(item => item.id === '4')
      if (rTmp) {
        let text = rTmp.prompt
        text = text.replace('${QuestionTitle', this.info.question)
        text = text.replace('}', '')
        this.editor.disable()
        const id = this.info.id
        getAIContent({ action: 'generation', question: text })
          .then(res => {
            this.editor.enable()
            if (id !== this.info.id) return
            this.info.answer = res.answer
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
    async getTmpRule() {
      const res = await aiBusinessScenePage({
        pageIndex: 1,
        pageSize: 1000
      })
      this.ruleTmpList = res.data.items
    },
    sensitiveChecking() {
      return new Promise((resolve, reject) => {
        if (!this.editor.getText()) {
          resolve()
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
                this.sensitiveList.map(item => {
                  const regItem = item.replace(/【/g, '').replace(/】/g, '')
                  this.info.answer = this.info.answer.replaceAll(
                    regItem,
                    `<span style="color:red">${regItem}</span>`
                  )
                })
                this.isNotSensitive = false
                this.editor.enable()
              } else {
                this.isNotSensitive = true
                this.editor.enable()
                this.sensitiveList = []
                this.info.answer = this.editor.getText()
              }
            } else {
              this.editor.enable()
              this.sensitiveList = []
              this.info.answer = this.editor.getText()
            }
            resolve()
          })
          .catch(() => {
            reject()
            this.editor.enable()
            this.sensitiveLoading = false
          })
      })
    },
    getSource() {
      return getMapObj('source')[this.info.source]
    },
    getWaitOrRejtctInfo() {
      this.aiLoading = false
      this.isNotSensitive = false
      this.sensitiveList = []
      this.loading = true
      const api =
        this.index === 0 ? contentReviewPending : contentReviewRejected
      api()
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.info = {
              ...res.data,
              oldAnswer: res.data.answer
            }
            if (this.info.answer) {
              setTimeout(() => {
                this.sensitiveChecking()
              }, 1000)
            }
            if (!this.info.oldAnswer) {
              this.getTmpRule()
            }
          }
        })
        .catch(() => {
          this.info = {}
          this.loading = false
        })
    },
    del() {
      this.$confirm('标题删除后，将无法恢复。确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          aiQADataDel(this.info.id)
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getWaitOrRejtctInfo()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    next() {
      this.$confirm('确定跳过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveLoading = true
          contentReviewSkip({ id: this.info.id })
            .then(res => {
              this.saveLoading = false
              if (res.code === 1) {
                this.$message.success('跳过成功')
                this.getWaitOrRejtctInfo()
              }
            })
            .catch(() => {
              this.saveLoading = false
            })
        })
        .catch(() => {})
    },
    submit() {
      if (this.textLength > 5000) {
        this.$message.error('内容不能超过5000字')
        return
      }
      if (!this.editor?.getText() || this.editor.getText().length < 1) {
        this.$message.error('请输入内容')
        return
      }
      this.sensitiveChecking().then(() => {
        const msg =
          this.sensitiveList.length > 0
            ? '内容包含以下敏感词：' +
              this.sensitiveList.join(',') +
              '。 风控可能无法通过审核，确认提交吗？'
            : '内容提交后，将无法进行查看和修改。确认提交吗？'

        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.saveLoading = true
            contentReviewPass({
              id: this.info.id,
              answer: this.editor.getText()
            })
              .then(res => {
                this.saveLoading = false
                if (res.code === 1) {
                  this.$message.success('提交成功')
                  this.getWaitOrRejtctInfo()
                }
              })
              .catch(() => {
                this.saveLoading = false
              })
          })
          .catch(() => {})
      })
    },
    changeIndex(index) {
      this.index = index
      this.getWaitOrRejtctInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  /* height: 100%; */
  // overflow-y: auto;
  // &::-webkit-scrollbar {
  //   width: 6px;
  //   height: 6px;
  //   // display: none;
  //   background-color: transparent;
  // }
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 6px;
  //   background: #d8d8d8;
  //   transition: all 0.4s ease;
  // }

  // &::-webkit-scrollbar-track {
  //   background: #fff;
  // }
  .title {
    padding: 15px 20px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    width: 100%;
    border-bottom: 1px solid #d3d7d8;
  }
  .switch-custom {
    display: flex;
    width: 182px;
    height: 36px;
    background: #f3f3f3;
    border-radius: 4px;
    padding: 2px;
    margin: 20px 4px 0 20px;
    cursor: pointer;
    user-select: none;
    .switch-item {
      width: 88px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .switch-item-checked {
      background: #ffffff;
      border-radius: 2px;
      color: #0c6fff;
      transition: all 0.2s ease-in-out;
    }
  }

  .row {
    padding: 0 20px 20px 20px;
    .label {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin: 16px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .time-t {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
    .content {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-bottom: 4px;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
}
.ai-btn {
  position: absolute;
  left: 14.5px;
  bottom: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
  .count {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
}
.answer {
  width: 100%;
  height: calc(100vh - 500px);
}
::v-deep .answer {
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
    .w-e-text-placeholder {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      font-style: normal;
    }
    .w-e-scroll {
      padding-top: 16px;
      height: 88%;
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
.footer {
  position: absolute;
  bottom: 16px;
  right: 20px;
}
.isNullInfo {
  height: calc(100vh - 100px);
}
.null-img {
  margin-top: 14vh;
  width: 405px;
  height: 202px;
}
::v-deep .el-empty .el-empty__description {
  p {
    font-size: 18px;
    font-weight: 400;
    color: #919293;
  }
}
</style>
