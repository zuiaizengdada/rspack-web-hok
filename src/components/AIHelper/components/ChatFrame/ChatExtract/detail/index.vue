<template>
  <div class="chatExtract-detail">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="backToIndex">首页</span>
      <i class="breadcrumb-item separator el-icon-arrow-right" />
      <span class="breadcrumb-item current">记录详情</span>
    </div>

    <!-- 提取内容 -->
    <div class="extract-content">
      <!-- 提取模板 -->
      <div class="extract-content-template">
        <el-tooltip
          effect="dark"
          :content="title"
          placement="top"
          :disabled="isShowTooltip"
          popper-class="custom-zyq-prpper"
        >
          <!-- 模板标题 -->
          <p
            ref="titleRef"
            class="template-title"
            @mouseenter="mouseEnterShowTooltip('titleRef')"
          >
            {{ title }}
          </p>
        </el-tooltip>
        <!-- 模板关键字 -->
        <div class="keywords-box">
          <el-tooltip
            v-for="(item, index) in keyword"
            :key="index"
            effect="dark"
            :content="item"
            placement="top"
            :disabled="isShowTooltip"
            popper-class="custom-zyq-prpper"
          >
            <div
              :ref="`keywordRef${index}`"
              class="keywords-box-item"
              @mouseenter="mouseEnterShowTooltip(`keywordRef${index}`)"
            >
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
        <div class="content">
          <!-- 模板内容 -->
          <textarea
            v-model="content"
            style="width: 100%; height: 100%; resize: none"
            @input="handleInputClick"
          />
          <!-- 全文字数 -->
          <div class="words">全文：{{ content.length }}字</div>
        </div>
      </div>

      <!-- AI对话 -->
      <div class="extract-ai">
        <chat-frame
          ref="chatFrameRefs"
          class="chat-frame"
          :custom="true"
          :word-extract-index="wordExtractIndex"
          :conversation-id="conversationId"
          @setInput="setInput"
          @resetAnswer="resetAnswer"
          @createTopic="createTopic"
          @openRevision="openRevision"
          @addTemp="addTemp"
          @clearHistory="clearHistory"
        />
        <div class="center-bottom">
          <div class="tip-area">
            <div class="tip-options-left">
              <div class="tip-button" @click="restartSession">
                <svg-icon class="type-icon" icon-class="dialogue" />
                <span>全新对话</span>
              </div>

              <div
                class="tip-button"
                @click="isShowTipPannel = !isShowTipPannel"
              >
                <svg-icon class="type-icon" icon-class="temp" />
                <span>提示词模版</span>
              </div>

              <div class="tip-button" @click="addOriginal">
                <svg-icon class="type-icon" icon-class="original" />
                <span>加入原文</span>
              </div>
            </div>
            <div class="tip-options-right">
              <div class="flex flex-middle">
                <span class="model-title">模型切换</span>
                <div class="model">
                  <div class="display-name">
                    <img src="@/assets/image/aigc/model-icon.png" alt="" />
                    {{ getModelName }}
                  </div>
                  <div ref="modelpopoverai" class="model-popover">
                    <div class="model-list">
                      <div
                        v-for="(item, index) in getModelList()"
                        :key="index"
                        :class="{
                          'model-item': true,
                          'model-item-select': item.isSelect
                        }"
                        @click="setAIModelType(item, index)"
                      >
                        {{ item.displayName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <transition name="tip-dialog">
              <!-- 自定义提示词模板 -->
              <TipDialog
                v-if="isShowTipPannel"
                ref="tipDialogRef"
                @close="isShowTipPannel = false"
                @delete="handleDeleteClick"
                @tempClick="handleTemplateClick"
              />
            </transition>
          </div>

          <chat-input
            ref="chatInputRefs"
            :content="inputContent"
            :original="content"
            :conversation-id="conversationId"
            placeholder="请输入问题或提出要求"
            :chat-value-limit="10000"
            @userInput="handleUserInput"
            @changeInput="handleChangeInput"
          />
        </div>
      </div>
    </div>

    <!-- 删除模板弹框 -->
    <CustomDialog
      v-bind="dialogDetailObj"
      :visiable.sync="showDeleteDialog"
      @close="showDeleteDialog = false"
      @confirm="handleDeleteConfirm"
    />

    <!-- 清除历史对话模板弹框 -->
    <CustomDialog
      v-bind="dialogDetailObj"
      :is-clear-history="true"
      :visiable.sync="showClearHistoryDialog"
      @close="showClearHistoryDialog = false"
      @confirm="handleClearHistoryConfirm"
    />

    <!-- 创建/编辑模板弹框 -->
    <CreateUpdateDialog
      ref="createUpdateDialogRef"
      :dialog-show.sync="showCreateOrUpdateDialog"
      @updata:dialogShow="showCreateOrUpdateDialog = $event"
    />

    <div v-if="showCreateOrUpdateDialog" class="mask2" />
  </div>
</template>

<script>
import ChatFrame from '../../index.vue'
import ChatInput from '../../ChatInput/index.vue'
import TipDialog from './components/tip-dialog.vue'
import CustomDialog from '../components/custom-dialog.vue'
import CreateUpdateDialog from './components/create-update-dialog.vue'
import { deleteTemplateList } from '@/api/aigc/callWord'
import { clearHistory } from '@/api/aigc/chatExtract'

export default {
  provide: {
    customWelcome: true,
    welcomeContent: `<h4 >
          你好,我是伏羲云AI小助手~<br />
          我会帮你阅读、总结与分析原文内容。你可以点击【推荐模板】，也可以自由提问，我会努力帮你解答
        </h4>`,
    customAddTemp: true
  },
  components: {
    ChatFrame,
    ChatInput,
    TipDialog,
    CustomDialog,
    CreateUpdateDialog
  },
  props: {
    // 模板标题
    title: {
      type: String,
      default: ''
    },
    // 模板内容
    content: {
      type: String,
      default: ''
    },
    // 关键词数组
    keyword: {
      type: Array,
      default: () => []
    },
    // 会话id
    conversationId: {
      type: String,
      default: ''
    },
    wordExtractIndex: {
      type: Number,
      default: 0
    }
  },
  inject: [
    'getTypeAIList',
    'setModelType',
    'getModelList',
    'resetSessionAI',
    'getIsAIEnd',
    'getHistory',
    'getChatMessageList',
    'setChatMessage',
    'clearChatMessage',
    'getEnableModels',
    'setHints'
  ],
  data() {
    return {
      showCreateOrUpdateDialog: false,
      // 输入文字
      inputContent: '',
      // 消息内容
      custonComponentList: [],
      // 是否显示提示词面板
      isShowTipPannel: false,
      // 是否显示清除历史对话弹框
      showClearHistoryDialog: false,
      // 是否显示删除弹框
      showDeleteDialog: false,
      // 自定义弹框内容
      dialogDetailObj: {},
      // 是否展示Tooltip
      isShowTooltip: false,
      // 光标位置
      cursorIndex: 0,
      // 当前分页
      pageIndex: 1
    }
  },
  computed: {
    getModelName() {
      return this.getModelList()?.find(item => item.isSelect)?.displayName || ''
    }
  },
  async mounted() {
    window.localStorage.setItem('custom', true)
    this.getEnableModels()
    this.setHints()
    this.$uweb?.setAction('Page_ChatExtrac_ViewDetail')
    await this.getHistory(
      undefined,
      this.getTypeAIList[this.wordExtractIndex],
      this.conversationId
    )
    if (this.getChatMessageList.length === 0) {
      this.setChatMessage({
        type: 'welcome',
        test: '',
        hasNew: true
      })
    }
  },
  destroyed() {
    window.localStorage.setItem('custom', false)
    this.setHints()
  },
  methods: {
    // 设置模型
    async setAIModelType(record, index) {
      if (record.llmType === 2) {
        this.$uweb?.setAction('Event_Detail_Model_Toogle_GPT')
      } else if (record.llmType === 10) {
        this.$uweb?.setAction('Event_Detail_Model_Toogle_KIMI')
      }
      if (!this.getIsAIEnd()) return
      this.$refs.modelpopoverai.style.display = 'none'
      setTimeout(() => {
        this.$refs.modelpopoverai.style.display = null
      }, 300)

      this.setModelType(record.llmType, index)
    },
    handleInputClick() {
      this.$uweb?.setAction('Event_History_Original_Edit')
    },
    // 清除历史
    clearHistory() {
      this.showClearHistoryDialog = true
      const isScene = this.$store?.getters['ai/isScene']
      this.dialogDetailObj = {
        id: isScene.templateId,
        title: '清除历史对话',
        content: '确认清除历史对话，清除后将不再能查看历史对话记录'
      }
    },
    // 确认清除历史对话
    async handleClearHistoryConfirm(id) {
      this.$uweb?.setAction('Event_History_Clear')
      this.showClearHistoryDialog = false
      const data = {
        sceneId: id,
        conversationId: this.conversationId
      }
      const { code } = await clearHistory(data)

      if (code === 1) {
        await this.getHistory(
          undefined,
          this.getTypeAIList[this.wordExtractIndex],
          this.conversationId
        )
        this.$message.success({
          message: '清除历史对话成功',
          center: true,
          customClass: 'amap-sug-result'
        })
      }
    },
    // 记录光标位置
    getCaretPosition(input) {
      if (!input) return 0
      if (input.selectionStart !== undefined) {
        return input.selectionStart
      } else if (document.selection) {
        // For IE < 9
        input.focus()
        const range = document.selection.createRange()
        range.moveStart('character', -input.value.length)
        return range.text.length
      }
      return 0
    },
    // 添加我的模版
    addTemp(text) {
      this.$uweb?.setAction('Event_Temp_Add')
      this.$refs.createUpdateDialogRef.form.content = text
      this.showCreateOrUpdateDialog = true
    },
    // 添加原文
    addOriginal() {
      this.$uweb?.setAction('Event_History_Original')
      const input = this.$refs.chatInputRefs.$refs.chatInputRefs.$refs.textarea
      const position = this.getCaretPosition(input) // 获取光标位置
      const currentValue = this.inputContent // 当前输入框的值
      const newValue =
        currentValue.substring(0, position) +
        '【原文内容】' +
        currentValue.substring(position) // 在光标位置插入指定字符串
      this.inputContent = newValue // 更新输入框的值
      this.$nextTick(() => {
        input.setSelectionRange(
          position + '【原文内容】'.length,
          position + '【原文内容】'.length
        ) // 设置光标位置
        input.focus() // 使输入框获取焦点
      })
    },
    // 监听输入框`
    handleChangeInput(val) {
      this.inputContent = val
    },
    // 检查文是否超出哦容器宽度
    isTextOverflow(ref) {
      return ref.scrollWidth > ref.clientWidth
    },
    // 鼠标移入显示tooltip
    mouseEnterShowTooltip(_ref) {
      let ref = ''

      if (this.$refs[_ref]?.length) {
        ref = this.$refs[_ref][0]
      } else {
        ref = this.$refs[_ref]
      }

      this.isShowTooltip = !this.isTextOverflow(ref)
    },
    // 返回首页
    backToIndex() {
      this.$emit('back')
    },
    // 输入文字
    setInput(val) {
      this.inputContent = ''
      this.$nextTick(() => {
        this.setDisabledInput(false)
        this.inputContent = val
      })
    },
    // 全新对话
    async restartSession() {
      if (!this.getIsAIEnd()) return

      this.$uweb && this.$uweb.setAction('Event_new_conversation')
      this.$uweb && this.$uweb.setAction('Event_restart_session')

      this.resetSessionAI()
    },
    // 重置回答
    resetAnswer(index) {
      this.$refs.chatInputRefs.resetAnswer(index)
    },
    // 生成选题稿
    createTopic(text) {
      this.$refs.chatInputRefs.dialogue(text, false, 'selectTopic')
    },
    openRevision(text) {
      this.custonComponentList = this.openCustomComponent(text)
      if (this.custonComponentList.length > 0) {
        this.visibleCustomDialog = true
      }
    },
    // 监听用户输入
    handleUserInput() {
      this.$refs.chatFrameRefs && (this.$refs.chatFrameRefs.isToBottom = true)
      this.$refs.chatFrameRefs && this.$refs.chatFrameRefs.scrollToBottom()
      this.isShowTipPannel = false
      this.inputContent = ''
    },
    // 监听删除按钮点击
    handleDeleteClick(item) {
      this.dialogDetailObj = {
        ...item,
        content: `确认要删除"${item.templateTitle}"我的模板吗?`
      }
      this.showDeleteDialog = true
    },
    // 监听删除确认按钮点击
    async handleDeleteConfirm(id) {
      this.showDeleteDialog = false

      const params = {
        id,
        isSystem: false
      }

      const { code, message } = await deleteTemplateList(params)

      if (code === 1) {
        this.$refs.tipDialogRef.getTemplateList(
          this.$refs.tipDialogRef.pageParams
        )
        this.$message({
          message: '删除成功',
          type: 'success',
          customClass: 'amap-sug-result'
        })
      } else {
        this.$message({
          message,
          type: 'error',
          customClass: 'amap-sug-result'
        })
      }
    },
    // 监听模板点击
    handleTemplateClick(item) {
      this.$uweb?.setAction('Event_Template_Click')
      this.inputContent = item.content
    }
  }
}
</script>

<style lang="scss">
.custom-zyq-prpper {
  z-index: 99999 !important;
}
</style>

<style scoped lang="scss">
.tip-dialog-enter-active,
.tip-dialog-leave-active {
  transition: opacity 0.5s;
}

.tip-dialog-enter,
.tip-dialog-leave-to {
  opacity: 0;
}

.chatExtract-detail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(224.7deg, #f8fbff 0%, #f9fcff 100%);
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  min-width: 1200px;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 20px;

    &-item {
      color: #a6a6a6;
      font-size: 16px;
      cursor: pointer;
    }

    .current {
      color: #313233;
    }

    .separator {
      color: #333333;
    }
  }

  .extract-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;

    &-template {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .template-title {
        font-size: 20px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .keywords-box {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;

        &-item {
          width: calc(12.5% - 9px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          border: 1px solid #d3d7d8;
          background-color: #e6efff;
          border-radius: 8px;
          color: #383838;
          font-size: 14px;
          padding: 5px 10px;
        }
      }

      .content {
        position: relative;
        flex: 1;
        width: 100%;
        height: 100%;
        border: 1px solid #d3d7d8;
        background-color: #fff;
        border-radius: 8px;
        color: #000000;
        font-size: 14px;
        padding: 20px 20px 40px;

        .words {
          position: absolute;
          right: 25px;
          bottom: 10px;
          color: #777777;
          font-size: 13px;
        }
      }
    }

    .extract-ai {
      width: 50%;
      height: 100%;
      overflow: auto;
      position: relative;
      margin: auto;
      display: flex;
      flex-direction: column;

      .chat-frame {
        height: calc(100% - 175px);
        flex: 1 0 0;
        overflow-y: auto;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0px 10px 10px -12px rgba(0, 0, 0, 0.1); /* 仅在上边框添加内阴影 */
          pointer-events: none; /* 确保伪元素不会干扰用户操作 */
          z-index: 1; /* 确保伪元素的阴影在堆叠顺序中处于父元素之上 */
        }
      }

      .center-bottom {
        width: 100%;
        padding-top: 10px;

        .tip-area {
          position: relative;
          width: 100%;
          margin-bottom: 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          .tip-options-left,
          .tip-options-right {
            display: flex;
            align-items: center;
            gap: 10px;

            .model-title {
              font-size: 14px;
              color: #313233;
              margin-right: 8px;
              user-select: none;
            }
            .model {
              width: 128px;
              height: 32px;
              user-select: none;
              display: flex;
              align-items: center;
              justify-content: left;
              cursor: pointer;
              border-radius: 15px;
              position: relative;
              padding-left: 2px;
              background: #e0e4e6;
              .model-popover {
                display: block;
              }
              .display-name {
                display: flex;
                align-items: center;
                img {
                  width: 24px;
                  height: 24px;
                  margin-right: 8px;
                }
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #313233;
              }
              .model-popover {
                display: none;
                position: absolute;
                padding-bottom: 2.9rem;
                bottom: 0;
                right: 0;
                z-index: 1002;
                .model-list {
                  width: 128px;
                  background-color: #fff;
                  border-radius: 4px;
                  padding: 4px;
                  box-shadow: 0px 2px 4px 0px rgba(225, 225, 225, 0.5);
                  .model-item {
                    padding: 10px 0;
                    text-align: center;
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #313233;
                    &:hover {
                      background: #e8ebee !important;
                    }
                  }
                  .model-item-select {
                    background: #e8ebee;
                  }
                  &:hover {
                    .model-item-select {
                      background-color: #fff;
                    }
                  }
                }
              }
              &:hover {
                background: #e0e4e6;
                .model-popover {
                  display: block;
                }
              }
            }
          }
          .tip-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            height: 32px;
            border-radius: 8px;
            opacity: 1;
            border: 1px solid #d3d7d8;
            color: #313233;
            font-size: 14px;
            cursor: pointer;
            padding: 0 8px;
            gap: 3px;

            .type-icon {
              width: 20px;
              height: 20px;
            }

            &:hover {
              background: #e6efff;
            }

            .active {
              border: 1px solid #3a7fff;
              color: #5696ff;
            }
          }
        }
      }
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.9);
    backdrop-filter: blur(5px);
  }

  .mask2 {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1020;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

::v-deep .chat-input-container {
  margin-bottom: 0 !important;
}
</style>
