<template>
  <div class="chat-tools-container flex justify-between items-center">
    <div class="tools-btns">
      <el-popover
        v-if="!getIsShowImageGeneration && !getIsShowDouyinBZhangGuide"
        placement="top"
        title="全新对话"
        trigger="hover"
        popper-class="custom-chat-tools-popover"
      >
        <div slot="reference" class="btn-tool" @click="restartSession">
          <img src="@/assets/image/aigc/refresh2.png" alt="" />
        </div>
      </el-popover>
      <!-- <el-popover
        v-if="!isAI"
        placement="top"
        title="重新生成"
        trigger="hover"
        popper-class="custom-chat-tools-popover"
      >
        <div slot="reference" class="btn-tool" @click="restRender">
          <img src="@/assets/image/aigc/rest-render2.png" alt="" />
        </div>
      </el-popover> -->
      <!-- <el-popover
        placement="top"
        title="猜你想要"
        trigger="hover"
        popper-class="custom-chat-tools-popover"
        @mousedown="allowTextSelection"
      >
        <div slot="reference" class="btn-tool" @click="handleClick(1)">猜</div>
      </el-popover>
      <el-popover
        placement="top"
        title="我的收藏"
        trigger="hover"
        popper-class="custom-chat-tools-popover"
        @mousedown="allowTextSelection"
      >
        <div slot="reference" class="btn-tool" @click="handleClick(2)">藏</div>
      </el-popover> -->
    </div>

    <div
      v-if="!getIsShowImageGeneration && !getIsShowDouyinBZhangGuide"
      class="flex flex-middle cursor-pointer"
      @mousedown="allowTextSelection"
    >
      <span class="model-title">模型切换</span>
      <div class="model">
        <img src="@/assets/image/aigc/model-icon2.png" alt="" />
        {{ getModelName }}
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
</template>
<script>
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
    'setModelType',
    'getModelList',
    'getTypeAIList',
    'resetSessionAI'
  ],
  data() {
    return {}
  },
  computed: {
    getModelName() {
      return this.getModelList()?.find(item => item.isSelect)?.displayName || ''
    },
    isAI() {
      return !!this.getTypeAIList?.find(
        item => item.type === 'AI' && item.checked
      )
    },
    getIsShowImageGeneration() {
      return this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )
    },
    getIsShowDouyinBZhangGuide() {
      return this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    getIsShowHotspot() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'Hotspot'
      )
    }
  },
  methods: {
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    restRender() {},
    async setAIModelType(record, index) {
      if (!this.getIsAIEnd()) return
      this.$refs.modelpopoverai.style.display = 'none'
      setTimeout(() => {
        this.$refs.modelpopoverai.style.display = null
      }, 300)

      this.setModelType(record.llmType, index)
    },
    async restartSession() {
      this.$uweb && this.$uweb.setAction('Event_restart_session')
      if (this.isAI) {
        this.resetSessionAI()
      } else {
        this.$emit('restRender')
      }
    },
    handleClick(type) {
      if (type === 1) {
        this.$uweb && this.$uweb.setAction('Event_click_sell_btn')
      } else {
        this.$uweb && this.$uweb.setAction('Event_click_collect_btn_list')
      }
      this.$emit('handleClick', type)
    }
  }
}
</script>
<style lang="scss">
.custom-chat-tools-popover {
  min-width: 64px;
  width: 64px;
  padding: 4px 8px;
  text-align: initial;
  margin-top: 10px !important;
  cursor: pointer;
  .el-popover__title {
    line-height: initial;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #67686b;
    margin-bottom: 0;
    white-space: nowrap;
  }
  .popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.chat-tools-container {
  padding: 16px 24px;
  border-top: 1px solid #d3d7d8;
  .btn-tool {
    // 禁止选择
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #e0e4e6;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #313233;
    margin-right: 20px;
    img {
      width: 30px;
      height: 30px;
    }
    &:hover {
      cursor: default;
      background: #dbe9ff;
      color: #3a7fff;
    }
  }
  .tools-btns {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.model-title {
  font-size: 14px;
  color: #313233;
  margin-right: 8px;
  user-select: none;
}
.model {
  // 禁止选择
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: left;
  width: 126px;
  background: #e0e4e6;
  border-radius: 15px;
  position: relative;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #313233;
  padding-right: 2px;
  img {
    width: 30px;
    height: 30px;
  }
  &:hover {
    .model-popover {
      display: block;
    }
    background: #e0e4e6;
  }
  .model-popover {
    display: none;
    position: absolute;
    padding-bottom: 2.7rem;
    bottom: 0;
    right: 0;
    .model-list {
      width: 120px;
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
}
</style>
