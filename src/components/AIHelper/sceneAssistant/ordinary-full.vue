<template>
  <div class="full-screen-container flex justify-between">
    <div class="full-left">
      <conversation
        ref="conversation"
        @change="changeConversation"
        @setWordExtractIndex="setWordExtractIndex"
      />
    </div>
    <div class="full-center relative">
      <div class="full-center-header">
        <i
          v-if="!isAICenter && isScene && !isScene.isDeleted"
          class="el-icon-more"
          @click="openAidetail"
        />
        <img
          v-if="!isIgnore"
          src="@/assets/image/aigc/slidebar.png"
          alt=""
          @click="closeFullScreen"
        />
        <img src="@/assets/image/aigc/close.png" alt="" @click="closeALL" />
      </div>
      <div
        ref="fullCenterContentRef"
        :class="[
          'full-center-content',
          isShowDragMask ? 'child-disable-click' : ''
        ]"
        style="position: relative"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent
        @dragleave.stop="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <ChatExtract
          v-if="getIsShowWordExtract && isShow"
          style="width: 100%"
          :word-extract-index="wordExtractIndex"
        />
        <!-- 内容区 -->
        <div v-else class="full-center-content-chat">
          <aiCenter
            v-if="isAICenter"
            @openAi="openAi"
            @onAdd="onhandleAdd"
            @editAi="editAi"
          />
          <Hotspot v-if="getIsShowHotspot" />
          <EMOVideo v-if="getIsShowEMOVideo" />

          <template
            v-if="
              !isAICenter &&
                !getIsShowHotspot &&
                !getIsShowWordExtract &&
                !getIsShowEMOVideo
            "
          >
            <chat-frame
              ref="chatFrameRefs"
              :class="{
                'chat-frame': true,
                'chat-frame-is':
                  getIsShowImageGeneration || getIsShowDouyinBZhangGuide
              }"
              @setInput="setInput"
              @resetAnswer="resetAnswer"
              @createTopic="createTopic"
              @openRevision="openRevision"
              @collectSearch="collectSearch"
            />
            <div
              class="center-bottom"
              :style="{
                'padding-top':
                  getIsShowImageGeneration || getIsShowDouyinBZhangGuide
                    ? '24px'
                    : '0px'
              }"
            >
              <div
                v-if="!getIsShowImageGeneration && !getIsShowDouyinBZhangGuide"
                class="operate-row"
              >
                <div class="flex left-operate">
                  <div
                    v-if="!getIsShowDouyinBZhangGuide && !getisDeleted"
                    class="left-fn"
                    @click="restartSession"
                  >
                    <img src="@/assets/image/aigc/refresh.png" alt="" />
                    全新对话
                  </div>
                </div>

                <div v-if="!getisDeleted" class="flex flex-middle">
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
              <chat-input
                v-if="!getisDeleted && !getIsShowVideoExtractInput"
                ref="chatInputRefs"
                :content="activeItemContent"
                @userInput="userInput"
              />
              <div v-else class="chatDeletedInput">
                {{
                  getIsShowVideoExtractInput
                    ? '助手已停止使用，请使用新版视频文案提取助手。'
                    : '助手已停止使用，请更换其他助手。'
                }}
              </div>
            </div>
          </template>
        </div>
        <aiDrawer :visbile="drawerConfig.visbile">
          <component
            :is="drawerConfig.type"
            v-if="drawerConfig.visbile"
            @close="openAidetail"
          />
        </aiDrawer>
        <!-- 拖拽遮罩层 -->
        <DragMask v-if="getModelType() === 2" :visible.sync="isShowDragMask" />
      </div>

      <wrapPage :visbile="wrapPageConfig.visbile && isAICenter">
        <component
          :is="wrapPageConfig.type"
          v-if="wrapPageConfig.visbile && isAICenter"
          :config="wrapPageConfig"
          @closePage="wrapPageConfig.visbile = false"
          @success="onhandleReshreList"
          @addSuccess="addSuccess"
        />
      </wrapPage>
    </div>

    <customDialog
      v-model="visibleCustomDialog"
      :list="custonComponentList"
      @close="visibleCustomDialog = false"
    />
  </div>
</template>

<script>
import { triggerUsage } from '@/api/aigc'
import { useAssistant } from '@/api/aigc/index.js'
// import TopicList from '../components/TopicList/index.vue'
import ChatFrame from '../components/ChatFrame/index.vue'
import Conversation from '../components/Conversation/index.vue'
import ChatInput from '../components/ChatFrame/ChatInput/index.vue'
import customDialog from '../components/customDialog/index.vue'
import aiCenter from '../components/aiCenter/index.vue'
import aiDrawer from '../components/aiDrawer/index.vue'
import aiDetail from '../components/aiDetail/index.vue'
import { mapState, mapGetters } from 'vuex'
import wrapPage from '../components/wrapPage/index.vue'
import addPage from '../components/wrapPage/addPage.vue'
import editPage from '../components/wrapPage/editPage.vue'
import { PopupManager } from 'element-ui/src/utils/popup'
import Hotspot from '../components/Assistants/Hotspot'
import ChatExtract from '../components/ChatFrame/ChatExtract/index.vue'
import EMOVideo from '../components/Assistants/EMOVideo'
import DragMask from './components/drag-mask.vue'
export default {
  inject: [
    'closeSlideBar',
    'activeFullScreen',
    'getChatMessageList',
    'removeChatMessageItem',
    'setChatMessage',
    'getIsAIEnd',
    'setDisabledInput',
    'setIndexChatCustomKeyMessage',
    'getTypeAIList',
    'setModelType',
    'getModelList',
    'openCustomComponent',
    'resetSessionAI',
    'closeFullScreen',
    'closeALL',
    'getModelType',
    'setTypeAIList',
    'initPage'
  ],
  components: {
    // TopicList,
    ChatFrame,
    ChatInput,
    Conversation,
    customDialog,
    aiCenter,
    aiDrawer,
    aiDetail,
    wrapPage,
    addPage,
    editPage,
    Hotspot,
    ChatExtract,
    EMOVideo,
    DragMask
  },
  data() {
    return {
      zIndex: 6000,
      activeItemContent: '',
      isShow: true,
      visibleCustomDialog: false,
      custonComponentList: [],
      wordExtractIndex: 0,
      drawerConfig: {
        visbile: false,
        type: 'aiDetail'
      },
      wrapPageConfig: {
        visbile: false,
        type: 'addPage',
        row: {}
      },
      // 忽略显示
      ignoreList: ['14'],
      isShowDragMask: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      isAICenter: state => state.ai.isAICenter,
      isScene: state => state.ai.isScene
    }),
    getModelName() {
      return this.getModelList()?.find(item => item.isSelect)?.displayName || ''
    },
    isAI() {
      return !!this.getTypeAIList?.find(
        item => item.type === 'AI' && item.checked
      )
    },
    getIsShowImageGeneration() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )
    },
    getIsShowDouyinBZhangGuide() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    getIsShowHotspot() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'Hotspot'
      )
    },
    getIsShowWordExtract() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'WordExtract'
      )
    },
    getisDeleted() {
      return !!this.getTypeAIList.find(
        // item => !item.isEnabled && !item.isPrivate && item.createdUserId !== this.userInfo.userId
        item => item.checked && item.isDeleted === 1
      )
    },
    getIsShowVideoExtractInput() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex + 1000
    },
    isIgnore() {
      const getInfo = this.getTypeAIList.find(item => item.checked)
      if (!getInfo) return false
      return this.ignoreList.includes(getInfo.id)
    },
    getIsShowEMOVideo() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'EMOVideo'
      )
    }
  },
  watch: {
    isAICenter: {
      handler(val) {
        if (!val) {
          this.isShow = true
          this.drawerConfig.visbile = false
          this.wrapPageConfig.visbile = false
        }
      },
      deep: true,
      immediate: true
    },
    isScene: {
      handler(val) {
        this.drawerConfig.visbile = false
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 鼠标拖拽移入目标区域
    handleDragEnter() {
      if (
        this.getModelType() === 2 &&
        this.$store.state.ai.isScene.id === '1'
      ) {
        this.isShowDragMask = true
      }
    },
    // 鼠标拖拽移出目标区域
    handleDragLeave(event) {
      if (
        this.getModelType() === 2 &&
        this.$store.state.ai.isScene.id === '1'
      ) {
        if (event.target !== this.$refs.fullCenterContentRef) return

        this.isShowDragMask = false
      }
    },
    // 鼠标拖拽松开
    handleDrop(event) {
      if (
        this.getModelType() === 2 &&
        this.$store.state.ai.isScene.id === '1'
      ) {
        const files = event.dataTransfer.files

        if (files.length > 0) {
          this.$refs.chatInputRefs.handleFileUpload(files)
        }

        this.isShowDragMask = false
      }
    },
    setWordExtractIndex(index) {
      this.wordExtractIndex = index
    },
    editAi(item) {
      this.wrapPageConfig = {
        visbile: true,
        type: 'editPage',
        row: item
      }
    },
    resetAnswer(index) {
      console.log('INDEX------------', index)
      this.$refs.chatInputRefs.resetAnswer(index)
    },
    // 生成选题稿
    createTopic(text) {
      this.$refs.chatInputRefs.dialogue(text, false, 'selectTopic')
    },
    restRender() {
      this.custonComponentList = this.openCustomComponent()
      if (this.custonComponentList.length > 0) {
        this.visibleCustomDialog = true
      }
    },
    openRevision(text) {
      this.custonComponentList = this.openCustomComponent(text)
      if (this.custonComponentList.length > 0) {
        this.visibleCustomDialog = true
      }
    },

    async restartSession() {
      if (!this.getIsAIEnd()) return

      this.$uweb && this.$uweb.setAction('Event_new_conversation')
      this.$uweb && this.$uweb.setAction('Event_restart_session')
      if (this.isAI) {
        this.resetSessionAI()
      } else {
        this.custonComponentList = this.openCustomComponent()
        if (this.custonComponentList.length > 0) {
          this.visibleCustomDialog = true
        } else {
          const info = this.getTypeAIList?.find(item => item.checked)
          if (info.type !== 'AI' && info.assistantType === 'systems') {
            this.$refs.chatInputRefs.aiSend({ value: info?.content || '' })
          }
        }
      }
    },
    async setAIModelType(record, index) {
      if (!this.getIsAIEnd()) return
      this.$refs.modelpopoverai.style.display = 'none'
      setTimeout(() => {
        this.$refs.modelpopoverai.style.display = null
      }, 300)

      this.setModelType(record.llmType, index)
    },
    userInput() {
      this.$refs.chatFrameRefs && (this.$refs.chatFrameRefs.isToBottom = true)
      this.$refs.chatFrameRefs && this.$refs.chatFrameRefs.scrollToBottom()
    },
    collectSearch() {
      // this.$refs.topicRef.queryData()
    },
    changeConversation() {
      this.$nextTick(() => {
        const info = this.getTypeAIList?.find(item => item.checked)
        triggerUsage({ id: info.id })
        if (info.isDeleted === 1) {
          return
        }
        this.$refs.chatInputRefs && this.$refs.chatInputRefs.clearChatValue()
        if (info.id === '10') {
          this.$uweb &&
            this.$uweb.setAction('Event_video_copywriting_extract-count')
        }
        if (info.id === '11') {
          this.$uweb && this.$uweb.setAction('Event_generate_image')
        }

        this.custonComponentList = this.openCustomComponent()
        if (this.custonComponentList.length > 0 && info.id !== '20') {
          this.visibleCustomDialog = true
        } else {
          const info = this.getTypeAIList?.find(item => item.checked)
          if (info.type !== 'AI' && info.assistantType === 'systems') {
            this.$refs.chatInputRefs.aiSend({ value: info?.content || '' })
          }
        }
        this.userInput()
        // this.$refs.topicRef.queryData()
      })
    },
    setInput(val) {
      this.activeItemContent = ''
      this.$nextTick(() => {
        this.setDisabledInput(false)
        this.activeItemContent = val
      })
    },
    selectItem(item) {
      this.activeItemContent = ''
      this.$nextTick(() => {
        this.setDisabledInput(false)
        this.activeItemContent = item.content
      })
    },
    openAidetail() {
      this.drawerConfig.visbile = !this.drawerConfig.visbile
    },
    onhandleAdd() {
      this.wrapPageConfig = {
        visbile: true,
        type: 'addPage'
      }
    },
    // 新增/编辑成功之后刷新列表
    onhandleReshreList() {
      this.wrapPageConfig.visbile = false
    },
    // 打开对应的ai
    openAi(id) {
      this.$refs.conversation && this.$refs.conversation.changeAiById(id)
    },
    // 新增成功之后要加入的左侧列表
    addSuccess(res) {
      // this.openAi(res.templateId)
      // this.onhandleReshreList()
      this.onhandleUse(res)
    },
    onhandleUse(item) {
      console.log('5555')
      if (item.hasUsed) {
        return this.useAssistant(item.templateId)
      }
      console.log(item)
      const data = {
        templateId: item.templateId
      }
      useAssistant(data).then(res => {
        item.hasUsed = true
        // this.setTypeAIList().then(() => {
        //   this.$nextTick(() => {
        //     this.$emit('openAi', item.templateId)
        //   })
        // })
        this.$store.dispatch('ai/setScene', item)
        this.initPage(item.templateId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.full-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #05195e;
  z-index: 6000;
  // padding: 24px;

  .iconBox {
    position: absolute;
    right: 48px;
    top: 46px;
    z-index: 999;
    display: flex;
    > img {
      width: 24px;
      height: 24px;
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .full-left {
    width: 280px;
    // border-right: 1px solid #F0F0F0;
    height: 100%;
    // background-color: #f7f7f7;
    background: #ffffff;
    // border-radius: 10px 0px 0px 10px;
  }
  .full-center {
    flex: 1;
    width: calc(100vh - 640px);
    height: 100%;
    background: linear-gradient(225deg, #f8fbff 0%, #f9fcff 100%);
    overflow: hidden;
    > .full-center-content {
      position: relative;
      width: 100%;
      width: 100%;
      height: calc(100% - 50px);
      display: flex;
      overflow: auto;
      .full-center-content-chat {
        flex: 1 0 0;
        position: relative;
        width: 100%;
        max-width: 1183px;
        min-width: 883px;
        margin: auto;
        height: calc(100%);
        display: flex;
        flex-direction: column;
      }
      .full-center-content-drawer {
      }
    }
    .full-center-header {
      height: 50px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 24px;
      border-bottom: 1px solid #f0f0f0;
      > img,
      i {
        width: 24px;
        height: 24px;
        margin-left: 16px;
        cursor: pointer;
        line-height: 24px;
      }
    }
    .center-bottom {
      // background: #f9f9f9;
      width: 100%;
      max-width: 1183px;
      // position: absolute;
      // bottom: 0;
      // border-top: 1px solid #d3d7d8;
      .operate-row {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-operate {
          align-items: center;
          .left-fn {
            padding: 3px 8px;
            padding-left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #313233;
            user-select: none;
            margin-right: 20px;
            cursor: pointer;
            &:hover {
              color: #3a7fff;
            }
            img {
              width: 22.5px;
              height: 22.5px;
              margin-right: 8px;
            }
          }
        }
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
    }
    .chat-frame::v-deep {
      // .markdownBox{
      //   max-width: 800px;
      // }
      .message-ai-container {
        padding-left: 0;
        padding-right: 65px !important;
      }
      .message-user-container {
        padding-right: 0;
        padding-left: 0;
        margin-left: 62px !important;
      }
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #e5e5e5;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      // height: calc(100% - 200px);
      flex: 1 0 0;
      overflow-y: auto;
    }
    .chat-frame-is {
      height: calc(100% - 175px);
      flex: 1 0 0;
    }
  }
  .full-right {
    width: 384px;
    height: 100%;
    background-color: #f7f7f7;
    border-left: 1px solid #d3d7d8;
    background: #f7f7f7;
    border-radius: 0px 10px 10px 0px;
  }
}
.chat-extract {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: linear-gradient(224.7deg, #f8fbff 0%, #f9fcff 100%);
}
.chatDeletedInput {
  height: 114px;
  background: #ececec;
  border-radius: 10px;
  border: 1px solid #c7cace;
  position: relative;
  font-size: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #a2a5a8;
  line-height: 114px;
  text-align: center;
  margin: 0px 0px 16px;
}
</style>
