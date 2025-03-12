<template>
  <!-- 文案 -->
  <div class="copywritingExtract">
    <div class="title" @click="openUrl(obj.linkUrl)">
      {{ obj.title }}
    </div>
    <div class="detail">
      时间：<span style="margin-right: 64px">{{ obj.createdTime }}</span>
      热度：<span>{{ obj.metrics }}</span>
    </div>
    <div class="content">
      <div class="content-span">{{ content }}</div>
      <div class="bottom-op">
        <div
          v-if="
            !isOk &&
            content != '文案提取中...' &&
            content !== '提取视频内容失败'
          "
          class="float-bottom"
        >
          <img class="img-default" src="@/assets/image/aigc/scxt.png" alt="" />
          <!-- <img class="img-hover" src="@/assets/image/aigc/gstr.png" alt=""> -->
          <div class="title-span title-span-reset" @click="generate">
            生成选题
          </div>
        </div>
        <div v-if="isOk || content === '提取视频内容失败'" />

        <div
          v-if="!!content && content.length > 0 && content != '文案提取中...'"
          class="float-bottom-right"
          @click="copyText"
        >
          <img class="img-default" src="@/assets/image/aigc/copy.png" alt="" />
          <img
            class="img-hover"
            src="@/assets/image/aigc/copy-hover.png"
            alt=""
          />
          <div class="tip">复制</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { copy } from '@/utils'
export default {
  inject: ['getWS', 'createWS', 'getTypeAIList'],
  props: {
    /**
     * 详情
     * @type {Object} obj
     * @property {string} title 标题
     * @property {string} createdTime 时间
     * @property {string} metrics 热度
     * @property {string} linkUrl 链接
     * @property {string} id id
     * @property {string} status  文案提取状态 0-文案提取中 1-文案提取成功 2-历史文案提取成功
     */
    obj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      content: '文案提取中...',
      copy,
      isOk: false
    }
  },
  watch: {
    obj: {
      handler(val) {
        console.log(val, 'val====================', val.status === 2)
        this.content = '文案提取中...'
        this.getSocket()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    openUrl(url) {
      window.open(url)
    },
    // 复制内容到剪切板
    async copyText() {
      this.copy(this.content)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
    },
    async getSocket() {
      console.log(this.obj, 'this.obj')
      if (this.obj.status === 2) {
        this.isOk = true
        this.content = this.obj.content
        return
      }
      let ws = this.getWS()
      if (!ws || ws.readyState !== 1) {
        ws = await this.createWS()
        console.log('ws创建完成')
      }
      const tmp = this.getTypeAIList.find(item => item.checked)
      ws.onmessage = event => {
        // if (this.content === '文案提取中...') {
        //   this.content = ''
        // }
        const info = {
          ...JSON.parse(event.data)
        }
        console.log(info, 'info')
        if (
          info.reply === 'check' &&
          info.conversation_id === 'check' &&
          info.status === 'CHECK' &&
          info.source === 'SYSTEM'
        ) {
          return
        }
        // const text = info.reply.split('')
        // let i = 0
        // const interval = setInterval(() => {
        //   if (this.content.length === info.reply.length) {
        //     clearInterval(interval)
        //     this.isOk = false
        //   }
        //   this.content += text[i] ? text[i] : ''
        //   i++
        // }, 10)
        setTimeout(() => {
          this.content = info.reply
          this.isOk = false
        }, 2000)
        if (info.status === 'DONE') {
          this.$emit('copywritingExtractEmit', info.conversation_id)
        }
      }
      ws.send(
        JSON.stringify({
          scene_id: tmp.type,
          qa_mode: 'extract',
          user: this.obj.id
        })
      )
      this.isOk = true
    },
    generate() {
      this.isOk = true
      this.$emit('generate', this.content)
    },
    resetAnswer() {
      this.$emit('resetAnswer')
    }
  }
}
</script>

<style lang="scss" scoped>
.copywritingExtract {
  position: relative;
  .title {
    font-weight: bold;
    font-size: 18px;
    color: #333333;
    margin-bottom: 8px;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #3a7fff;
    }
  }
  .detail {
    font-size: 14px;
    color: #666666;
    span {
      color: #333333;
    }
  }
  .content {
    width: 100%;
    max-height: 290px;
    position: relative;
    margin-top: 20px;
    border-radius: 4px;
    background-color: #f1f8ff;
    border-radius: 6px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    .content-span {
      position: relative;
      width: 100%;
      max-height: 218px;
      padding: 12px 14px 10px 14px;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
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
    }

    .float-bottom-right {
      user-select: none;
      position: relative;
      cursor: pointer;
      .img-default {
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
      &:hover {
        .tip {
          display: block;
        }
        .img-default {
          display: none;
        }
        .img-hover {
          display: block;
        }
      }
    }
    .bottom-op {
      width: 100%;
      height: 70px;
      padding: 0 14px;
      background-color: #f1f8ff;
      border-radius: 0 0 4px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .float-bottom {
      width: 132px;
      height: 40px;
      background: #3a7fff;
      box-shadow: 0px 4px 10px 0px rgba(37, 62, 162, 0.2);
      border-radius: 20px 20px 20px 20px;
      border: 1px solid #488ff6;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .title-span {
        font-size: 16px;
        color: #ffffff;
      }
      .img-default {
        width: 24px;
        min-width: 24px;
        height: 24px;
        margin-right: 8px;
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
      .title-span-reset {
        color: #fff;
      }
      &:hover {
        // .img-default {
        //   display: none;
        // }
        // .img-hover {
        //   display: block;
        // }
        .tip {
          display: block;
        }
      }
    }
  }
}
</style>
