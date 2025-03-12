<!-- 风控审核 -->
<template>
  <div
    v-loading="loading"
    :class="{ wrapper: true, isNullInfo: !info.id }"
    @click="globalClick"
  >
    <div class="title">风控审核</div>

    <div v-if="!!info.id" class="row">
      <div class="label">
        <div>标题</div>
        <div class="time-t">
          <span>{{ info.contentReviewTime }}</span>
          <span style="margin-left: 10px">
            评审人：{{ info.contentReviewer }}
          </span>
        </div>
      </div>
      <div class="content">{{ info.question }}</div>

      <div class="label">
        <div>内容</div>
      </div>

      <div class="grid-c">
        <div
          id="contentAnswer"
          class="content content-answer"
          @mousedown="mousedown"
          @mouseup="mouseup"
        >
          <span v-html="info.answer" />
          <div id="copyDialog" class="copy" @click.stop="copySelect">
            <img
              class="copy-img"
              src="@/assets/image/aigc/copy-not.png"
              alt=""
            />
            <img
              class="copy-img-hover"
              src="@/assets/image/aigc/copy2.png"
              alt=""
            />
          </div>
        </div>

        <div class="label">原因</div>
        <el-input
          v-model="info.reason"
          class="reason"
          maxlength="500"
          type="textarea"
          placeholder=""
          resize="none"
          show-word-limit
        />
      </div>

      <div class="flex flex-middle" style="margin-top: 20px">
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
        type="primary"
        size="small"
        @click="submit"
      >
        通过并处理下一条
      </el-button>
      <el-button
        :loading="saveLoading"
        type="danger"
        size="small"
        @click="rejectSubmit"
      >
        驳回并处理下一条
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  contentRiskReviewRejected,
  contentRiskReviewPass,
  contentRiskReviewReject
} from '@/api/aigc/dataSourceManagment'
import { sensitiveChecking } from '@/api/aigc'
import { copy } from '@/utils'
export default {
  name: 'ExpertExamine',
  data() {
    return {
      copy,
      loading: false,
      saveLoading: false,
      sensitiveLoading: false,
      visibleExcelImport: false,
      selectText: '', // 选区文本
      sensitiveList: [],
      info: {
        answer: undefined,
        id: undefined,
        question: undefined,
        source: undefined,
        submissionReviewTime: undefined
      },
      isNotSensitive: false
    }
  },
  created() {
    this.getRiskInfo()
  },
  methods: {
    globalClick(event) {
      // 判断点击的html是否是contentAnswer
      if (event.target.id !== 'contentAnswer') {
        this.$nextTick(() => {
          document.getElementById('copyDialog').style.display = 'none'
        })
      }
    },
    sensitiveChecking() {
      return new Promise((resolve, reject) => {
        this.sensitiveLoading = true
        sensitiveChecking({ content: this.info.answer })
          .then(res => {
            this.sensitiveLoading = false
            if (res.code === 1) {
              this.sensitiveList = res.data
              if (this.sensitiveList.length > 0) {
                this.isNotSensitive = false
                this.sensitiveList.map(item => {
                  const regItem = item.replace(/【/g, '').replace(/】/g, '')
                  this.info.answer = this.info.answer.replaceAll(
                    regItem,
                    `<span style="color:red">${regItem}</span>`
                  )
                })
              } else {
                this.isNotSensitive = true
                this.sensitiveList = []
              }
            } else {
              this.sensitiveList = []
            }
            resolve()
          })
          .catch(() => {
            reject()
            this.sensitiveLoading = false
          })
      })
    },
    getRiskInfo() {
      this.isNotSensitive = false
      this.sensitiveList = []
      this.loading = true
      contentRiskReviewRejected()
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.info = {
              ...res.data
            }
            if (this.info.answer) {
              this.$nextTick(() => {
                this.sensitiveChecking()
              })
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    copySelect() {
      document.getElementById('copyDialog').style.display = 'none'
      this.copy(this.selectText)
      this.$message.success('复制成功')
    },
    mousedown(event) {
      if (
        event.target.classList.contains('copy-img-hover') ||
        event.target.classList.contains('copy')
      ) {
        return
      }
      document.getElementById('copyDialog').style.display = 'none'
    },
    mouseup(event) {
      setTimeout(() => {
        this.setCopyHtml(event)
      })
    },
    setCopyHtml(event) {
      const selection = window.getSelection()
      // 替换\n
      const text = selection.toString().replace(/\n/g, '')
      if (!text) {
        document.getElementById('copyDialog').style.display = 'none'
        return
      }
      this.selectText = text
      const range = selection.getRangeAt(0)
      const rects = range.getClientRects()
      const lastCharRect = rects[rects.length - 1]

      // 获取'content-answer' div滚动条的位置 用于计算弹窗位置(弹窗position: absolute  依赖于父元素position: relative 所以需要加上滚动条的位置)
      const scrollTop = document.getElementById('contentAnswer').scrollTop
      const lastCharX = event.layerX
      const lastCharY =
        lastCharRect.bottom -
        document.getElementById('contentAnswer').clientHeight +
        20 +
        scrollTop
      document.getElementById('copyDialog').style.left = lastCharX + 'px'
      document.getElementById('copyDialog').style.top = lastCharY + 'px'
      document.getElementById('copyDialog').style.zIndex = 10000
      document.getElementById('copyDialog').style.display = 'block'
    },
    rejectSubmit() {
      if (!this.info.reason) {
        return this.$message.warning('请填写驳回原因')
      }
      this.$confirm('确定驳回吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveLoading = true
          contentRiskReviewReject({
            id: this.info.id,
            reason: this.info.reason
          })
            .then(res => {
              this.saveLoading = false
              if (res.code === 1) {
                this.$message.success('驳回成功')
                this.getRiskInfo()
              }
            })
            .catch(() => {
              this.saveLoading = false
            })
        })
        .catch(() => {})
    },

    submit() {
      this.$confirm('确认通过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveLoading = true
          contentRiskReviewPass({
            id: this.info.id
          })
            .then(res => {
              this.saveLoading = false
              if (res.code === 1) {
                this.$message.success('提交成功')
                this.getRiskInfo()
              }
            })
            .catch(() => {
              this.saveLoading = false
            })
        })
        .catch(() => {})
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
  height: 100%;
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

  .row {
    padding: 0px 20px 60px 20px;
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
    .grid-c {
      height: calc(100vh - 400px);
      background: #fafafa;
      border-radius: 4px;
      border: 1px dashed #dcdfe6;
      padding: 20px;
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
    .content-answer {
      position: relative;
      height: 60%;
      padding-bottom: 10px;
      overflow-y: auto;
      // 禁止滚动条外部滚动
      overscroll-behavior: contain;
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
    .copy {
      position: absolute;
      width: 32px;
      height: 32px;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px rgba(204, 203, 203, 0.5);
      padding: 4px;
      padding: 6px;
      display: none;
      border-radius: 4px;
      &:hover {
        .copy-img {
          display: none;
        }
        .copy-img-hover {
          display: block;
        }
      }
      .copy-img {
        width: 20px;
        height: 20px;
      }
      .copy-img-hover {
        width: 20px;
        height: 20px;
        display: none;
      }
    }
  }
}
.ai-btn {
  position: absolute;
  left: 14.5px;
  bottom: 6px;
}
::v-deep .reason {
  width: 100%;
  height: 30%;
  .el-textarea__inner {
    height: 100%;
    padding: 16px;
    color: #000;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
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
  .el-input__count {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    bottom: 12px;
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
