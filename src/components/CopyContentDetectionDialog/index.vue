<template>
  <div class="copy-content-detection-dialog" :style="{ right: getRight }">
    <div class="copy-content-detection-header">
      <div class="title-header flex flex-between flex-middle">
        <span>发现文案提取链接</span>
        <img
          class="close-img"
          src="@/assets/image/copyContentDetectionDialog/close.png"
          alt=""
          @click="isShow = false"
        />
      </div>
      <div class="divider-header" />
    </div>
    <div class="copy-content-detection-row flex flex-middle">
      <span class="label">链接来源：</span>
      <div class="text">{{ getTypeText }}</div>
    </div>
    <div class="copy-content-detection-row flex flex-left">
      <span class="label">链接内容：</span>
      <div class="text">{{ text }}</div>
    </div>
    <div class="footer_btn flex flex-right flex-middle">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="openAI">一键提取文案</el-button>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import { videoExtraction } from '@/api/aigc/index.js'
export default {
  name: 'CopyContentDetectionDialog',
  data() {
    return {
      isShow: false,
      i: undefined,
      // 1:抖音 2:B站 3: 小红书 4：快手
      type: undefined,
      text: '',
      typeOptions: {
        1: {
          type: 1,
          label: '抖音',
          Rule: [/https:\/\/v.douyin.com\/[a-zA-Z0-9]+/]
        },
        2: {
          type: 2,
          label: 'B站',
          Rule: [
            /https:\/\/www.bilibili.com\/video\/[a-zA-Z0-9]+/,
            /https:\/\/b23.tv\/[a-zA-Z0-9]+/
          ]
        },
        3: {
          type: 3,
          label: '小红书',
          Rule: [
            /http:\/\/xhslink.com\/[a-zA-Z0-9]+/
          ]
        },
        4: {
          type: 4,
          label: '快手',
          Rule: [
            /https:\/\/www.kuaishou.com\/[a-zA-Z0-9]+/
          ]
        }
      }
    }
  },
  computed: {
    getTypeText() {
      if (this.typeOptions[this.type]) {
        return this.typeOptions[this.type].label
      }
      return ''
    },
    getRight() {
      return this.isShow ? '20px' : '-441px'
    }
  },
  watch: {},
  created() {
    this.i = setInterval(() => {
      // 获取用户剪切板内容
      const clipboardData = navigator.clipboard
      const getOldContent = localStorage.getItem('copyContent')
      clipboardData
        ?.readText()
        .then(text => {
          if (this.getType(text)) {
            if (getOldContent === text) return
            videoExtraction().then((res) => {
              if (res && res.data) {
                this.type = this.getType(text)
                this.text = text
                this.isShow = true
                localStorage.setItem('copyContent', text)
                setTimeout(() => {
                  this.isShow = false
                }, 10000)
              }
            })
          }
        })
        .catch(() => {
        })
    }, 1000)
  },
  destroyed() {
    clearInterval(this.i)
  },
  methods: {
    close() {
      this.isShow = false
      this.$uweb && this.$uweb.setAction('Event_shortcut_video_copywriting_extract_close')
    },
    openAI() {
      this.$uweb && this.$uweb.setAction('Event_shortcut_video_copywriting_extract')
      this.isShow = false
      eventBus.$emit('aiVideoExtractOpen', this.text)
    },
    // 判断来源类型
    getType(text) {
      for (const key in this.typeOptions) {
        const flag = this.typeOptions[key].Rule.some(item => item.test(text))
        if (flag) {
          return this.typeOptions[key].type
        }
      }
    }
  }
}
</script>

<style lang="scss" scope>
.copy-content-detection-dialog {
  position: fixed;
  top: 62px;
  right: 20px;
  z-index: 1199;
  width: 441px;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(185, 185, 185, 0.5);
  transition: all 0.3s;
  .copy-content-detection-header {
    width: 100%;
    height: 64px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    padding-bottom: 6px;
    .title-header {
      width: 100%;
      padding: 20px;
      user-select: none;
      span {
        font-size: 16px;
        color: #333333;
      }
      .close-img {
        width: 25px;
        height: 25px;
        cursor: pointer;
      }
    }

    .divider-header {
      width: 100%;
      border-top: 1px solid #e7e7e7;
    }
  }
  .copy-content-detection-row {
    width: 100%;
    padding: 20px 20px 0 20px;
    font-size: 14px;
    .label {
      color: #777777;
    }
    .text {
      width: 82%;
      color: #333333;
      word-break: break-all;
    }
  }
  .footer_btn {
    width: 100%;
    padding: 36px 20px 16px 20px;
  }
}
</style>
