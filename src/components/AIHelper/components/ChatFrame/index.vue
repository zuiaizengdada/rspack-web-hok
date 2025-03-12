<template>
  <div
    ref="contentScroll"
    class="chat-frame-container"
    :style="{ 'margin-bottom': !getIsAIEnd() ? '20px' : '0' }"
  >
    <div
      :class="{
        'sidebar-loading': !isFullScreen(),
        'full-screen-loading': isFullScreen()
      }"
    >
      <div v-loading="loading" element-loading-spinner="el-icon-loading" />
    </div>
    <template v-for="(item, index) in getChatMessageList">
      <div v-if="custom && item.isNewChat" class="clear-history">
        <span @click="$emit('clearHistory')">清除历史对话</span>
      </div>
      <el-divider
        v-if="isFullScreen() && item.type === 'G'"
        :key="index"
        content-position="center"
        class="divider-full"
        @mousedown="allowTextSelection"
      >
        {{ item.text }}
      </el-divider>
      <el-divider
        v-if="!isFullScreen() && item.type === 'G'"
        :key="index"
        content-position="center"
        class="divider"
        @mousedown="allowTextSelection"
      >
        {{ item.type }}
      </el-divider>
      <chat-welcome
        v-if="item.type === 'welcome'"
        :key="index"
        class="chat-welcome"
        @mousedown="allowTextSelection"
      />

      <chat-message-ai
        v-if="item.type === 'ai'"
        :key="index"
        :data="item"
        :text="item.text"
        :thinking-txt="item.thinkingTxt"
        :type="item.type"
        :img-error="item.imgError"
        :is-skip="item.tmpInfo ? item.tmpInfo.isMust == 2 : false"
        :tmp-is-ok="item.tmpIsOk"
        :is-collect="item.isCollect"
        :is-history="item.isHistory"
        :is-like="item.isLike"
        :is-no-like="item.isNoLike"
        :source="item.source"
        :video-load-text="item.videoLoadText"
        :index="index"
        :is-send-selected-topic="item.isSendSelectedTopic"
        :is-hotspot="item.isHotspot"
        @createTopic="createTopic"
        @openRevision="openRevision"
        @resetAnswer="resetAnswer(index)"
        @collectSearch="collectSearch"
      />
      <chat-message-user
        v-if="item.type === 'user' && !item.hide"
        :key="index"
        :index="index"
        :text="item.text"
        :message-type="item.messageType"
        :file-extension="item.fileExtension"
        :file-name="item.fileName"
        :file-size="item.fileSize"
        :file-image-url="item.fileImageUrl"
        :file-url="item.fileUrl"
        :format="item.format"
        :is-sensitive="item.isSensitive"
        :is-sensitive-reply="item.isSensitiveReply"
        @editSensitive="editSensitive"
        @addTemp="$emit('addTemp', item.text)"
      />
    </template>

    <div v-if="isBacktop" class="backtop" @click="backtop">
      <img class="img-icon" src="@/assets/image/aigc/go-bottom.png" alt="" />
      <img
        class="img-icon-select"
        src="@/assets/image/aigc/go-bottom-select.png"
        alt=""
      />
    </div>
    <div
      v-if="
        !getIsAIEnd() &&
          (!isFullScreen() ||
            getIsShowDouyinBZhangGuide ||
            getIsShowImageGeneration)
      "
      style="height: 64px; width: 100%"
    />
    <div
      v-if="!getIsAIEnd()"
      :class="{
        'stop-out': true,
        'stop-out-full': isFullScreen(),
        'stop-out-ImageGeneration':
          (getIsShowImageGeneration || getIsShowDouyinBZhangGuide) &&
          isFullScreen()
      }"
      :style="{
        bottom: custom ? '175px' : '145px'
      }"
      @click="stopAIOut"
    >
      <img class="stop-icon" src="@/assets/image/aigc/stop-out.png" alt="" />
      <img
        class="stop-icon-hover"
        src="@/assets/image/aigc/stop-out-hover.png"
        alt=""
      />
      <span>停止输出</span>
    </div>
  </div>
</template>
<script>
import ChatWelcome from './ChatWelcome.vue'
import ChatMessageUser from './ChatMessageUser.vue'
import ChatMessageAi from './ChatMessageAI.vue'
export default {
  components: {
    ChatWelcome,
    ChatMessageUser,
    ChatMessageAi
  },
  props: {
    custom: {
      type: Boolean,
      default: false
    },
    wordExtractIndex: {
      type: Number,
      default: 0
    },
    // 会话id
    conversationId: {
      type: String,
      default: ''
    }
  },
  inject: [
    'isFullScreen',
    'getChatMessageList',
    'getHistory',
    'getIsAIEnd',
    'setIsAIEnd',
    'closeWS',
    'setDisabledInput',
    'removeChatMessageItem',
    'setIndexChatCustomKeyMessage',
    'setModelType',
    'getModelList',
    'getTypeAIList'
  ],
  data() {
    return { loading: false, isToBottom: true, isBacktop: false }
  },
  computed: {
    getIsShowImageGeneration() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )
    },
    getIsShowDouyinBZhangGuide() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    }
  },
  updated() {
    this.scrollToBottom()
  },
  mounted() {
    // 监听页面缩放
    this.$nextTick(() => {
      window.addEventListener('resize', this.scrollToBottom())
    })
    this.$refs.contentScroll.addEventListener('scroll', e =>
      this.wctchScroll(e)
    )
  },
  destroyed() {
    this.$refs.contentScroll?.removeEventListener('scroll', e =>
      this.wctchScroll(e)
    )
    window.removeEventListener('resize', this.scrollToBottom(false))
  },
  methods: {
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    openRevision(text) {
      this.$emit('openRevision', text)
    },
    resetAnswer(index) {
      this.$emit('resetAnswer', index)
    },
    createTopic(text) {
      this.$emit('createTopic', text)
    },
    stopAIOut() {
      if (
        this.getChatMessageList[this.getChatMessageList.length - 1].text
          .length < 1
      ) {
        this.removeChatMessageItem(this.getChatMessageList.length - 1, 1)
      } else {
        this.setIndexChatCustomKeyMessage(
          'tmpIsOk',
          this.getChatMessageList.length - 1,
          true
        )
        this.setIndexChatCustomKeyMessage(
          'isHistory',
          this.getChatMessageList.length - 1,
          true
        )
      }

      this.setIsAIEnd(true)
      this.setDisabledInput(false)
      this.closeWS()
    },
    backtop() {
      this.$nextTick(() => {
        const srcollE = this.$refs.contentScroll
        const params = {
          top: srcollE.scrollHeight,
          behavior: 'smooth'
        }
        srcollE.scrollTo(params)
      })
    },
    collectSearch() {
      this.$emit('collectSearch')
    },
    wctchScroll(e) {
      // 判断是否用户主动滚动
      const distanceToBottom =
        this.$refs.contentScroll.scrollHeight -
        this.$refs.contentScroll.scrollTop -
        this.$refs.contentScroll.clientHeight
      this.isToBottom = distanceToBottom < 10
      // 监听滚动条距离底部
      if (distanceToBottom < 500) {
        this.isBacktop = false
      } else {
        this.isBacktop = true
      }
      // 监听滚动条到顶部
      if (this.$refs.contentScroll.scrollTop === 0) {
        if (this.loadin) return
        this.loading = true

        if (this.custom) {
          this.getHistory(
            true,
            this.getTypeAIList[this.wordExtractIndex],
            this.conversationId
          ).then(res => {
            this.$refs.contentScroll.scrollTo({
              top: res ? 10 : 0,
              behavior: 'smooth'
            })
            this.loading = false
          })
        } else {
          this.getHistory(true).then(res => {
            this.$refs.contentScroll.scrollTo({
              top: res ? 10 : 0,
              behavior: 'smooth'
            })
            this.loading = false
          })
        }
      }
    },
    editSensitive(item) {
      this.$emit('setInput', item)
    },
    scrollToBottom(isNext = true) {
      if (!isNext || !this.isToBottom) return
      this.$nextTick(() => {
        const srcollE = this.$refs.contentScroll
        const params = {
          top: srcollE.scrollHeight,
          behavior: 'auto'
        }
        srcollE.scrollTo(params)
      })
    },
    setInput(val) {
      this.$emit('setInput', val)
    },
    activeChatTopic(data) {
      this.$emit('activeTopicItem', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-frame-container {
  // position: relative;
  .stop-out {
    position: absolute;
    width: 128px;
    height: 32px;
    box-shadow: 0px 3px 6px 0px rgba(21, 36, 67, 0.1);
    border-radius: 16px;
    // border: 1px solid #0c6fff;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 6.5%;
    bottom: 200px;
    left: 50%;
    margin-left: -64px;
    user-select: none;
    // margin: 16px 22px;
    background-color: #ffffff;
    transition: all 0.3s;
    z-index: 100;
    &:hover {
      background: #1778ff;
      span {
        color: #ffffff;
      }
      .stop-icon {
        display: none;
      }
      .stop-icon-hover {
        display: block;
      }
    }
    .stop-icon {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
    .stop-icon-hover {
      display: none;
      width: 24px;
      height: 24px;
      margin-right: 4px;
      animation: stopIcon 1s infinite;
    }
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #313233;
    }
  }
  .stop-out-full {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    // margin-left: -64px;
    bottom: 145px;
    margin-left: 0;
    z-index: 101;
  }
  .stop-out-ImageGeneration {
    bottom: 182px !important;
  }
  .backtop {
    position: sticky;
    width: 42px;
    height: 42px;
    float: right;
    border-radius: 50%;
    bottom: 8%;
    right: 20px;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #e0e4e6;
    box-shadow: 0px 0px 6px 0px rgba(21, 36, 67, 0.1);
    transition: all 0.3s;
    .img-icon {
      width: 24px;
      height: 24px;
    }
    .img-icon-select {
      display: none;
      width: 24px;
      height: 24px;
    }
    &:hover {
      background: #1778ff;
      .img-icon {
        display: none;
      }
      .img-icon-select {
        display: block;
      }
    }
  }
  .sidebar-loading {
    position: fixed;
    top: 95px;
    right: 12%;
    height: 10px;
  }
  .full-screen-loading {
    position: fixed;
    top: 95px;
    right: 55%;
    height: 10px;
  }
  .chat-welcome {
    margin: 32px;
  }
}
::v-deep {
  width: auto;
  .public-divider {
    .el-divider__text {
      background: #fafafa;
      color: #c7cace;
    }
  }

  .divider {
    @extend .public-divider;
    margin: 24px 16px 24px 14px;
  }
  .divider-full {
    @extend .public-divider;
    margin: 24px;
  }

  .clear-history {
    text-align: center;

    span {
      font-size: 14px;
      color: #3a7fff;
      cursor: pointer;
    }
  }
}
</style>
