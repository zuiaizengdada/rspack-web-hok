<template>
  <div
    ref="container"
    class="message-ai-container flex"
    :style="{ 'padding-right': isFullScreen() ? '94px' : '32px' }"
  >
    <div
      class="flex"
      :style="{ width: !!text && !getIsShowImageGeneration ? '100%' : '' }"
    >
      <!-- 头像 -->
      <div v-if="isFullScreen()">
        <img
          v-if="!!getHeadeImg.icon"
          :src="getHeadeImg.icon"
          alt=""
          class="ai-head"
        />
        <div
          v-else
          class="ai-head-title-span"
          :style="{
            background: getHeadeImg.backgroundColor
          }"
        >
          <span :style="{ color: getHeadeImg.textColor }">{{
            getHeadeImg.title.split('')[0]
          }}</span>
        </div>
      </div>
      <div
        ref="content"
        class="content"
        :style="{
          padding: getIsShowImageGeneration ? '20px' : '12px 20px 12px 20px'
        }"
        @mousedown="allowTextSelection"
      >
        <template v-if="!getIsShowImageGeneration && !getIsShowHotspot">
          <!-- ai回答 -->
          <div v-show="thinkingTxt" class="think-content">
            <div class="thinking-head flex justify-center align-center" style="margin-bottom:8px;">
              <p class="flex items-center" @click="visibleThinkTxt=!visibleThinkTxt"><img :src="deepseekIcon" style="width:14px;height:14px;margin-right:4px;" />{{ thinkTitle }} <i class="el-icon-arrow-down" :class="visibleThinkTxt?'active':''" style="margin-left:4px;" /></p>
            </div>
            <VueMarkdown v-show="visibleThinkTxt" :source="thinkingTxt" style="font-size:14px;color:#8b8b8b" class="think-markdown" />
          </div>
          <div v-show="text" class="text-content">
            <VueMarkdown :source="text" />
            <span v-if="tmpIsOk && source === 'KNOWLEDGE'" class="source-tips">
              {{ sourceMsg }}
            </span>
          </div>
          <div v-if="!text" class="flex flex-middle">
            <span
              v-if="getIsShowDouyinBZhangGuide && !!videoLoadText"
              style="
                margin-right: 8px;
                display: block;
                min-width: 100px;
                color: #313233;
              "
            >
              {{ videoLoadText }}
            </span>
            <img class="loading" src="@/assets/image/aigc/loading.gif" alt="" />
          </div>
          <slot name="custom" />
          <div
            v-if="
              tmpIsOk &&
                text !== '没有提取到文案！请检查下原视频。' &&
                text !== '链接内容无法提取' &&
                text !== '视频无法获取！' &&
                text !== '视频时长超过20分钟，无法处理!'
            "
            ref="floatOp"
            class="float-op"
          >
            <div class="flex flex-middle">
              <div
                v-if="!isHistory && !getIsShowDouyinBZhangGuide"
                class="float-tools"
                @click="resetAnswer"
              >
                <img
                  class="img-default"
                  src="@/assets/image/aigc/r-hover.png"
                  alt=""
                />
                <img
                  class="img-hover"
                  src="@/assets/image/aigc/r-hover.png"
                  alt=""
                />
                <span class="title-span title-span-reset">重新作答</span>
              </div>
              <div
                v-if="
                  getIsShowDouyinBZhangGuide &&
                    text !== '没有提取到文案！请检查下原视频。' &&
                    text !== '链接内容无法提取' &&
                    text !== '视频无法获取！' &&
                    text !== '视频时长超过20分钟，无法处理!'
                "
                class="float-tools"
                @click="openRevision"
              >
                <img
                  class="img-default"
                  src="@/assets/image/aigc/gaigao.png"
                  alt=""
                />
                <img
                  class="img-hover"
                  src="@/assets/image/aigc/gaigao-hover.png"
                  alt=""
                />
                <span class="title-span title-span-gaigao">AI改稿</span>
              </div>
              <div
                v-if="
                  getIsShowDouyinBZhangGuide &&
                    text !== '没有提取到文案！请检查下原视频。' &&
                    text !== '链接内容无法提取' &&
                    text !== '视频无法获取！' &&
                    text !== '视频时长超过20分钟，无法处理!'
                "
                class="float-tools"
                @click="createTopic(text)"
              >
                <img
                  class="img-default"
                  src="@/assets/image/aigc/scxtg.png"
                  alt=""
                />
                <img
                  class="img-hover"
                  src="@/assets/image/aigc/scxtg.png"
                  alt=""
                />
                <span class="title-span title-span-xtg">生成选题稿</span>
              </div>
            </div>
            <div class="flex flex-middle flex-right">
              <!-- 喜欢 -->
              <div
                class="float-tools"
                :style="{
                  'margin-right': '14px',
                  'pointer-events': isLike || isNoLike ? 'none' : ''
                }"
                @click="likeSave"
              >
                <img
                  v-if="isLike"
                  class="img-hover"
                  style="display: block"
                  src="@/assets/image/aigc/ok-like.png"
                  alt=""
                />
                <img
                  v-if="!isLike"
                  class="img-default"
                  src="@/assets/image/aigc/like-s.png"
                  alt=""
                />
                <img
                  v-if="!isNoLike && !isLike"
                  class="img-hover"
                  src="@/assets/image/aigc/like.png"
                  alt=""
                />
                <div class="tip" style="left: -9px">喜欢</div>
              </div>
              <!-- 不喜欢 -->
              <div
                class="float-tools"
                :style="{
                  'margin-right': '14px',
                  'pointer-events': isNoLike || isLike ? 'none' : ''
                }"
                @click="noLikeSave"
              >
                <img
                  v-if="isNoLike"
                  class="img-hover"
                  style="display: block"
                  src="@/assets/image/aigc/ok-no-like.png"
                  alt=""
                />
                <img
                  v-if="!isNoLike"
                  class="img-default"
                  src="@/assets/image/aigc/noLike-s.png"
                  alt=""
                />
                <img
                  v-if="!isNoLike && !isLike"
                  class="img-hover"
                  src="@/assets/image/aigc/noLike.png"
                  alt=""
                />
                <div class="tip" style="left: -18px">不喜欢</div>
              </div>
              <!-- 复制 -->
              <div class="float-tools" @click="copyText">
                <img
                  class="img-default"
                  src="@/assets/image/aigc/copy.png"
                  alt=""
                />
                <img
                  class="img-hover"
                  src="@/assets/image/aigc/copy-hover.png"
                  alt=""
                />
                <div class="tip">复制</div>
              </div>
              <!-- 收藏 -->
              <!-- <div class="float-tools" @click="setCollect">
                <img
                  v-if="isCollect"
                  class="img-default2"
                  src="@/assets/image/aigc/collect-select.png"
                  alt=""
                >
                <img
                  v-if="!isCollect"
                  class="img-default"
                  src="@/assets/image/aigc/collect-ai.png"
                  alt=""
                >
                <img
                  v-if="!isCollect"
                  class="img-hover"
                  src="@/assets/image/aigc/collect-hover.png"
                  alt=""
                >
                <div class="tip" style="left: -23px">点击收藏</div>
              </div> -->
            </div>
          </div>
        </template>
        <template v-if="getIsShowImageGeneration">
          <div
            v-if="!imgError"
            v-loading="!text"
            element-loading-background="rgba(0, 0, 0, 0)"
            :style="{
              background: !text
                ? 'linear-gradient(180deg,#fceffc 0%,#d3dcff 52%,#dff8ff 100%)'
                : ''
            }"
            :class="{
              'image-generation-row': true,
              'image-generation-row-slide': !isFullScreen()
            }"
          >
            <div
              v-if="!text"
              class="percentage-span"
              :style="{
                'font-size': isFullScreen() ? '20px' : '16px'
              }"
            >
              {{ progressValue }}%
            </div>
            <el-progress
              v-if="!text"
              class="percentage-j"
              :percentage="progressValue"
              :show-text="false"
            />
            <div
              v-if="!text"
              class="percentage-title"
              :style="{
                'font-size': isFullScreen() ? '16px' : '14px'
              }"
            >
              AI生成中
            </div>
            <ImageCustom
              v-if="
                !!text &&
                  (text.includes('https') || text.includes('http')) &&
                  getIsShowImageGeneration
              "
              class="generation-image"
              :src="text"
              :preview-src-list="[text]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </ImageCustom>
            <div v-if="tmpIsOk" ref="floatOp" class="float-op">
              <div class="flex flex-middle">
                <div
                  v-if="!isHistory && !imgError"
                  class="float-tools"
                  @click="resetAnswer"
                >
                  <img
                    class="img-default"
                    src="@/assets/image/aigc/r-hover.png"
                    alt=""
                  />
                  <img
                    class="img-hover"
                    src="@/assets/image/aigc/r-hover.png"
                    alt=""
                  />
                  <span class="title-span title-span-reset">重新生成</span>
                </div>

                <div v-if="!imgError" class="float-tools" @click="downloadImg">
                  <img
                    class="img-default"
                    style="margin-right: 0"
                    src="@/assets/image/aigc/download-hover.png"
                    alt=""
                  />
                  <img
                    class="img-hover"
                    style="margin-right: 0"
                    src="@/assets/image/aigc/download-hover.png"
                    alt=""
                  />
                  <span class="title-span title-span-down">下载</span>
                </div>
              </div>
              <div class="flex flex-middle flex-right">
                <!-- 喜欢 -->
                <div
                  class="float-tools"
                  :style="{
                    'margin-right': '14px',
                    'pointer-events': isLike || isNoLike ? 'none' : ''
                  }"
                  @click="likeSave"
                >
                  <img
                    v-if="isLike"
                    class="img-hover"
                    style="display: block"
                    src="@/assets/image/aigc/ok-like.png"
                    alt=""
                  />
                  <img
                    v-if="!isLike"
                    class="img-default"
                    src="@/assets/image/aigc/like-s.png"
                    alt=""
                  />
                  <img
                    v-if="!isNoLike && !isLike"
                    class="img-hover"
                    src="@/assets/image/aigc/like.png"
                    alt=""
                  />
                  <div class="tip" style="left: -9px">喜欢</div>
                </div>
                <!-- 不喜欢 -->
                <div
                  class="float-tools"
                  :style="{
                    'margin-right': '0',
                    'pointer-events': isNoLike || isLike ? 'none' : ''
                  }"
                  @click="noLikeSave"
                >
                  <img
                    v-if="isNoLike"
                    class="img-hover"
                    style="display: block"
                    src="@/assets/image/aigc/ok-no-like.png"
                    alt=""
                  />
                  <img
                    v-if="!isNoLike"
                    class="img-default"
                    src="@/assets/image/aigc/noLike-s.png"
                    alt=""
                  />
                  <img
                    v-if="!isNoLike && !isLike"
                    class="img-hover"
                    src="@/assets/image/aigc/noLike.png"
                    alt=""
                  />
                  <div class="tip" style="left: -18px">不喜欢</div>
                </div>
              </div>
            </div>
          </div>
          <p v-else>{{ imgError }}</p>
        </template>
        <template v-if="getIsShowHotspot" />
      </div>
    </div>
  </div>
</template>
<script>
import { cancelCollect, feedbackFeedback } from '@/api/aigc'
import { copy } from '@/utils'
import ImageCustom from '../image-custom'
import VueMarkdown from './VueMarkdown'
import myIcon from '@/assets/image/aigc/my_icon.png'
import deepseekIcon from '@/assets/svg/aiManage/deepseek.svg'

export default {
  components: {
    ImageCustom,
    VueMarkdown
  },
  inject: [
    'isFullScreen',
    'getIsAIEnd',
    'getTypeAIList',
    'getChatMessageList',
    'setIndexChatCustomKeyMessage'
  ],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    tmpIsOk: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: ''
    },
    thinkingTxt: {
      type: String,
      default: ''
    },
    isCollect: {
      type: Boolean,
      default: false
    },
    // 点赞按钮状态 是否被点赞
    isLike: {
      type: Boolean,
      default: false
    },
    // 踩按钮状态 是否被踩
    isNoLike: {
      type: Boolean,
      default: false
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: ''
    },
    videoLoadText: {
      type: String,
      default: ''
    },
    imgError: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myIcon,
      copy,
      sourceMsg: '\n\n 以上内容由【伏羲云】知识库提供！',
      isRichText: false,
      progressValue: 0,
      thinkTitle: '思考中...',
      visibleThinkTxt: true,
      thinkTxtEnd: false,
      startThinkTime: 0,
      isCreateEndTime: false,
      isCreateStartTime: false,
      deepseekIcon
    }
  },
  computed: {
    // 视频文案提取助手是否显示
    getIsShowDouyinBZhangGuide() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    getHeadeImg() {
      const obj = this.getTypeAIList.find(item => item.checked)
      if (obj.id === 1) {
        obj.icon = myIcon
      }
      return obj
    },
    // 图片生成助手是否显示
    getIsShowImageGeneration() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'ImageGeneration'
      )
    },
    // 热点助手是否显示
    getIsShowHotspot() {
      return !!this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'Hotspot'
      )
    }
  },
  watch: {
    text: {
      handler(val) {
        if (!val && !this.isHistory && this.getIsShowImageGeneration) {
          console.log(val, this.isHistory, 'cccccccccccccccccccccccccccc')
          this.progressValue = 0
          const interval = setInterval(() => {
            if (this.progressValue + 1 === 100 && !!this.text) {
              clearInterval(interval)
              return
            }
            if (this.progressValue + 1 >= 100 && !val) {
              this.progressValue = 99
            } else {
              this.progressValue += 1
            }
          }, 200)
        }
        if (val.length > 0) {
          if (val.length > 10 && !this.isCreateEndTime) {
            const endTime = Date.now()

            const s = (endTime - this.startThinkTime) / 1000
            this.thinkTitle = `已深度思考(用时 ${s.toFixed(1)} 秒)`
            this.isCreateEndTime = true
          }
        }
        this.$nextTick(() => {
          const dom = document.querySelectorAll('.text-content .markdown-body')
          const dom2 = dom[dom.length - 1]
          if (dom2) {
            const firstP = dom2.querySelector('div:first-child > p:first-child')
            const allP = dom2.querySelectorAll('div:first-child > p').length
            if (allP > 1 && firstP) {
              firstP.style.display = 'none' // 隐藏元素
            }
          }
        })
      },
      immediate: true
    },
    thinkingTxt: {
      handler(val) {
        if (val.length > 10 && !this.isCreateStartTime) {
          this.startThinkTime = Date.now()
          this.isCreateStartTime = true
        }
        // console.log(val, 'thinkingTxt')
      },
      immediate: true
    },
    data: {
      handler(val) {
        // console.log(val, 'ddatataval')
      },
      immediate: true

    }
  },

  methods: {
    isJsonArray(text) {
      try {
        const obj = JSON.parse(text)
        return Array.isArray(obj)
      } catch (e) {
        return false
      }
    },
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    downloadImg() {
      this.$uweb && this.$uweb.setAction('Event_generate_image_down')
      // 通过创建a标签下载文件
      const a = document.createElement('a')
      a.href = this.text
      a.download = 'image.png'
      a.click()
      setTimeout(() => {
        a.remove()
      })
    },
    openRevision() {
      if (!this.getIsAIEnd()) return
      this.$emit('openRevision', this.text)
    },
    createTopic() {
      if (!this.getIsAIEnd()) return
      this.$emit(
        'createTopic',
        `提炼出这段短视频爆款文字中的内容背景和观点概况、文中金句、关键词、可能结合的热点事件是什么？以及可能是通过哪些问题的提问可以得到像下面文字这样一些内容？文字如下:

      ${this.text}`
      )
    },
    noLikeSave() {
      if (this.isLike) {
        // this.$uweb && this.$uweb.setAction('Event_click_cancel_collect_btn')
      } else {
        this.$uweb && this.$uweb.setAction('Event_click_ai_no_like')
        feedbackFeedback({
          action: 'disliked',
          conversationId: this.getChatMessageList[this.index].id
        }).then(res => {
          this.setIndexChatCustomKeyMessage('isNoLike', this.index, true)
        })
      }
    },
    likeSave() {
      if (this.isLike) {
        // this.$uweb && this.$uweb.setAction('Event_click_cancel_collect_btn')
      } else {
        this.$uweb && this.$uweb.setAction('Event_click_ai_like')
        feedbackFeedback({
          action: 'liked',
          conversationId: this.getChatMessageList[this.index].id
        }).then(res => {
          this.setIndexChatCustomKeyMessage('isLike', this.index, true)
        })
      }
    },
    // 复制内容到剪切板
    async copyText() {
      this.$uweb && this.$uweb.setAction('Event_click_copy_btn')
      let tt = this.text
      if (this.getIsShowHotspot && this.isJsonArray(this.text)) {
        tt = JSON.stringify(JSON.parse(this.text), null, 2)
      }
      this.copy(tt)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
      await feedbackFeedback({
        action: 'adopted',
        conversationId: this.getChatMessageList[this.index].id
      })
    },
    resetAnswer() {
      this.$uweb && this.$uweb.setAction('Event_click_reset_answer_btn')
      feedbackFeedback({
        action: 're_answer',
        conversationId: this.getChatMessageList[this.index].id
      })
      this.$emit('resetAnswer')
    },
    setCollect() {
      if (this.isCollect) {
        this.$uweb && this.$uweb.setAction('Event_click_cancel_collect_btn')
        cancelCollect({ id: this.getChatMessageList[this.index].id }).then(
          res => {
            if (res.code === 1) {
              this.setIndexChatCustomKeyMessage('isCollect', this.index, false)
              this.$emit('collectSearch')
            }
          }
        )
      } else {
        this.$uweb && this.$uweb.setAction('Event_click_collect_btn')
        feedbackFeedback({
          action: 'starred',
          conversationId: this.getChatMessageList[this.index].id
        }).then(res => {
          this.setIndexChatCustomKeyMessage('isCollect', this.index, true)
          this.$emit('collectSearch')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.message-ai-container {
  padding: 16px 32px;
  position: relative;
  flex-wrap: wrap;
  cursor: default;
  width: 100%;

  // &:hover {
  //   .content .float-op {
  //     visibility: visible;
  //     transition: visibility 0s 0.5s;
  //   }
  // }
  .ai-head {
    width: 44px;
    min-width: 44px;
    height: 44px;
    margin-right: 18px;
    border-radius: 50%;
  }
  .ai-head-title-span {
    margin-right: 18px;
    width: 44px;
    min-width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .skip-ai {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3a7fff;
    padding-top: 12px;
    white-space: nowrap;
    &:hover {
      cursor: pointer;
    }
  }
  .content {
    background: #fff;
    border-radius: 0 6px 6px 6px;
    position: relative;
    max-width: 100%;
    // max-width:calc(100% - 65px);
    flex: 1;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      display: none;
    }
    .text-content {
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
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
    p {
      position: relative;
      white-space: pre-line;
      word-break: break-all;
    }
    .loading {
      width: 24px;
      height: 24px;
    }
    &:before {
      content: '';
      position: absolute;
      top: 4px;
      left: -15px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-right: 10px solid #fff;
    }
    .float-op {
      // right: 0;
      // top: -22px;
      // visibility: hidden;
      // padding: 6px 14px;
      // background: #ffffff;
      // box-shadow: 0px 3px 6px 0px rgba(6, 62, 155, 0.2);
      // border-radius: 6px;
      // position: absolute;
      // margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .float-tools {
        position: relative;
        user-select: none;
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          .img-default {
            display: none;
          }
          .img-hover {
            display: block;
          }
          .tip {
            display: block;
          }
          .title-span-gaigao {
            color: #ffc6ab;
          }
          .title-span-xtg {
            color: #5696ff86;
          }
          .title-span-reset {
            color: #3a89ff86;
          }
          .title-span-down {
            color: #3a89ff86;
          }
        }
        .title-span {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          margin-left: 4px;
          margin-right: 22px;
        }
        .title-span-gaigao {
          color: #ff8c57;
        }
        .title-span-xtg {
          color: #5696ff;
        }
        .title-span-reset {
          color: #3a7fff;
        }
        .title-span-down {
          color: #3a7fff;
        }
        .tip {
          position: absolute;
          display: none;
          padding: 4px 8px;
          height: 25px;
          background: #f7f7f7;
          box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #67686b;
          top: -32px;
          left: -7px;
          white-space: nowrap;
        }
        .img-default {
          width: 20px;
          min-width: 20px;
          height: 20px;
        }
        .img-default2 {
          width: 20px;
          min-width: 20px;
          height: 20px;
        }
        .img-hover {
          width: 20px;
          min-width: 20px;
          height: 20px;
          display: none;
        }
      }
    }
    .image-generation-row {
      position: relative;
      border-radius: 8px;
      width: 374px;
      min-height: 375px;
      .generation-image {
        width: 374px !important;
        height: 375px !important;
        margin-bottom: 20px;
      }
      .percentage-span {
        color: #8d93b3;
        position: absolute;
        width: 100%;
        text-align: center;
        z-index: 9;
        top: 44%;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #313665;
      }
      .percentage-j {
        position: absolute;
        width: 60%;
        z-index: 9;
        top: 57%;
        left: 20%;
      }
      .percentage-title {
        position: absolute;
        z-index: 9;
        width: 100%;
        text-align: center;
        bottom: 10%;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #8d93b3;
      }
    }
    .image-generation-row-slide {
      width: 257px;
      min-height: 257px;
      .generation-image {
        width: 257px !important;
        height: 257px !important;
      }
    }
    .time {
      position: absolute;
      left: 2px;
      font-size: 12px;
      white-space: nowrap;
      bottom: -20px;
      color: #8c8c8cb9;
    }
  }
  .tools-ai {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 8px;
    .tool-row {
      display: flex;
      align-items: center;
      margin-right: 14px;
      &:hover {
        span {
          color: #3a7fff;
        }
        .img-default {
          display: none;
        }
        .img-hover {
          display: block;
        }
      }
      .img-default {
        width: 22px;
        height: 22px;
        margin-right: 8px;
        &:hover {
          cursor: pointer;
        }
      }
      .img-default2 {
        width: 22px;
        height: 22px;
        margin-right: 8px;
        &:hover {
          cursor: pointer;
        }
      }
      .img-hover {
        display: none;
        width: 22px;
        height: 22px;
        margin-right: 8px;
      }
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #838383;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .source-tips {
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a09696;
  }
}
::v-deep {
  .el-loading-spinner {
    top: 35% !important;
    svg {
      circle {
        stroke-width: 3 !important;
        stroke: #313665 !important;
      }
    }
  }
}

.thinking-head{
  padding:7px 14px;
  background:rgb(245,245,245) ;
  border-radius: 10px;
  width:fit-content;
  cursor: pointer;
  font-size:12px;
  color:rgb(38,38,38)
}
.think-markdown{
  position:relative;
  padding-left:16px;
  &:after{
    content:"";
    position: absolute;
    left:0;
    top:0;
    width:2px;
    background: rgb(229,229,229);
    height:100%;
  }
}
.el-icon-arrow-down{
  transition: .4s;
  transform: rotate(180deg);
  &.active{
    transform: rotate(0deg);
  }
}
</style>
