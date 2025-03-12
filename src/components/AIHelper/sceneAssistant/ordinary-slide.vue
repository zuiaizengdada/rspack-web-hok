<template>
  <div class="aiHelper-slide-container">
    <div class="slide-top flex justify-between items-center">
      <TitleType @change="changeConversation" />
      <p class="icons flex">
        <img
          src="@/assets/image/aigc/full.png"
          alt=""
          @click="activeFullScreen"
        />
        <img
          src="@/assets/image/aigc/close.png"
          alt=""
          @click="closeSlideBar"
        />
      </p>
    </div>
    <div class="slide-content">
      <chat-frame
        ref="chatFrameRefs"
        class="chat-frame"
        @setInput="setInput"
        @createTopic="createTopic"
        @resetAnswer="resetAnswer"
        @openRevision="openRevision"
        @collectSearch="topicSearch"
      />
      <div class="slide-bottom">
        <chat-tools
          v-if="!getisDeleted"
          @restRender="restRender"
          @handleClick="handleClick"
        />
        <chat-input
          v-if="!getisDeleted"
          ref="chatInputRefs"
          :content="activeItemContent"
          @userInput="userInput"
        />
        <div v-else class="chatDeletedInput">
          助手已停止使用，请更换其他助手。
        </div>
      </div>
    </div>
    <!-- 底部抽屉 -->
    <drawer
      ref="topicRef"
      v-model="visibleDrawer"
      :type="drawerType"
      @selectItem="selectItem"
      @close="visibleDrawer = false"
    />
    <customDialog
      v-model="visibleCustomDialog"
      :list="custonComponentList"
      @close="visibleCustomDialog = false"
    />
  </div>
</template>
<script>
import { triggerUsage } from '@/api/aigc'
import ChatFrame from '../components/ChatFrame/index.vue'
import ChatInput from '../components/ChatFrame/ChatInput/index.vue'
import ChatTools from '../SlideBar/ChatTools.vue'
import Drawer from '../SlideBar/Drawer.vue'
import TitleType from '../SlideBar/TitleType.vue'
import customDialog from '../components/customDialog/index.vue'
import { mapGetters } from 'vuex'
export default {
  inject: [
    'closeSlideBar',
    'activeFullScreen',
    'getChatMessageList',
    'removeChatMessageItem',
    'setChatMessage',
    'setDisabledInput',
    'openCustomComponent',
    'getTypeAIList'
  ],
  components: {
    ChatFrame,
    ChatInput,
    ChatTools,
    Drawer,
    TitleType,
    customDialog
  },
  data() {
    return {
      visibleDrawer: false, // 是否显示推荐弹层
      drawerType: 1, // 抽屉类型
      activeItemContent: '', // 选中的话题内容
      custonComponentList: [],
      visibleCustomDialog: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    getisDeleted() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.isDeleted === 1
      )
    },
    getIsShowHotspot() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'Hotspot'
      )
    }
  },
  methods: {
    openRevision(text) {
      this.custonComponentList = this.openCustomComponent(text)
      if (this.custonComponentList.length > 0) {
        this.visibleCustomDialog = true
      }
    },
    resetAnswer(index) {
      this.$refs.chatInputRefs.resetAnswer(index)
    },
    // 生成选题稿
    createTopic(text) {
      this.$refs.chatInputRefs.dialogue(text, false, 'selectTopic')
    },
    changeConversation() {
      this.$nextTick(() => {
        const info = this.getTypeAIList?.find(item => item.checked)
        triggerUsage({ id: info.id })
        this.$refs.chatInputRefs.clearChatValue()
        this.custonComponentList = this.openCustomComponent()
        if (this.custonComponentList.length > 0) {
          this.visibleCustomDialog = true
        } else {
          if (info.type !== 'AI' && info.assistantType === 'systems') {
            this.$refs.chatInputRefs.aiSend({ value: info?.content || '' })
          }
        }
        this.userInput()
      })
    },
    restRender() {
      this.custonComponentList = this.openCustomComponent()
      if (this.custonComponentList.length > 0) {
        this.visibleCustomDialog = true
      } else {
        const info = this.getTypeAIList?.find(item => item.checked)
        if (info.type !== 'AI' && info.assistantType === 'systems') {
          this.$refs.chatInputRefs.aiSend({ value: info?.content || '' })
        }
      }
    },
    topicSearch() {
      this.$refs.topicRef.init()
    },
    userInput() {
      this.$refs.chatFrameRefs.isToBottom = true
      this.$refs.chatFrameRefs.scrollToBottom()
    },
    setInput(val) {
      this.activeItemContent = ''
      this.$nextTick(() => {
        this.setDisabledInput(false)
        this.activeItemContent = val
      })
    },
    selectItem(item) {
      this.visibleDrawer = false
      this.activeItemContent = ''
      this.$nextTick(() => {
        this.setDisabledInput(false)
        this.activeItemContent = item.content
      })
    },
    // 工具栏弹窗激活
    handleClick(type) {
      // this.topicSearch()
      this.drawerType = type
      this.visibleDrawer = true
    }
  }
}
</script>
<style lang="scss" scoped>
.aiHelper-slide-container {
  width: 432px;
  height: 100%;
  position: relative;
  border-radius: 10px;
  background: linear-gradient(180deg, #fcfcfc 0%, #f7f7f7 100%) !important;
  .slide-top {
    height: 73px;
    padding: 24px 30px;
    background: #ffffff;
    border-radius: 10px 10px 0 0;
    .title {
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      position: relative;
      &:hover {
        .title-list {
          display: block;
        }
      }
      .title-icon {
        width: 36px;
        height: 36px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #c2d9ff;
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #313233;
      }
      .title-icon2 {
        width: 10px;
        height: 20px;
        margin-left: 32px;
      }
      .title-list {
        display: none;
        position: absolute;
        width: 208px;
        z-index: 999;
        top: 120%;
        left: -22%;
        background: #f7f7f7;
        box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        .title-item {
          padding: 12px 16px;
          height: 60px;
          line-height: 30px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #313233;
          &:hover {
            border: 1px solid #a3c6ff;
            backdrop-filter: blur(10px);
            background: #f0f6ff;
            border-radius: 6px;
          }
        }
        .title-item-select {
          background: #c2d9ff;
          border-radius: 6px;
          border: 1px solid #a3c6ff;
        }
      }
    }
    .icons {
      font-size: 20px;
      img {
        margin-left: 10px;
        width: 24px;
        height: 24px;
      }
      &:hover {
        img {
          cursor: pointer;
        }
      }
    }
  }
  .slide-content {
    height: 100%;
    .chat-frame::v-deep {
      width: 432px;
      max-width: 432px;
      // position: relative;
      border-top: 1px solid #d3d7d8;
      > div {
        .markdownBox {
          width: 260 !important;
          // overflow-x: scroll;
          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            // display: none;
            background-color: transparent;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #879bf5;
            transition: all 0.4s ease;
          }

          &::-webkit-scrollbar-track {
            background: #fff;
          }
        }
      }
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #879bf5;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }

      height: calc(100% - 265px);
      overflow-y: auto;
      .operate-row {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 22px;
        .left-operate {
          align-items: center;
          .left-fn {
            padding: 3px 8px;
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
              background-color: #e0e4e6;
            }
            img {
              width: 22.5px;
              height: 22.5px;
              margin-right: 8px;
            }
          }
        }
        .model {
          width: 120px;
          height: 32px;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
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
            .model-popover {
              display: block;
            }
            background: #e0e4e6;
          }
        }
      }
    }
  }
  .slide-bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    z-index: 99;
    border-radius: 10px;
  }
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
  margin: 16px 24px 16px 24px;
}
</style>
