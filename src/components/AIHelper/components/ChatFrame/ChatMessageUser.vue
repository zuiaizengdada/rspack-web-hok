<template>
  <div>
    <div
      class="message-user-container flex"
      :style="{ 'margin-left': isFullScreen() ? '94px' : '32px' }"
    >
      <div v-if="isSensitive" class="content-sensitive">
        <p>{{ text }}</p>
        <div class="divider" />
        <div class="err-item">
          <div class="status-i">
            <img src="@/assets/image/aigc/send-err.png" alt="" />
            <span class="err-span">发送失败</span>
          </div>
          <div class="status-i add-hover" @click="editSensitive">
            <img src="@/assets/image/aigc/edit.png" alt="" />
            <span class="edit-span">重新编辑</span>
          </div>
          <span class="err-content">包含敏感词：{{ isSensitiveReply }}</span>
        </div>
        <div class="triangle">
          <div class="border" />
        </div>
      </div>
      <div class="flex">
        <div
          v-if="!isSensitive"
          class="content"
          @mousedown="allowTextSelection"
        >
          <!-- 上传文件卡片 -->
          <div
            v-if="
              messageType === 'file' &&
                !['jpg', 'jpeg', 'png', 'bmp', 'webp'].includes(format)
            "
            class="file-card"
          >
            <!-- 文件图标 -->
            <div class="file-icon">
              <img
                class="icon"
                :src="require(`@/assets/svg/file/${fileExtension}.svg`)"
              />
            </div>
            <!-- 文件信息 -->
            <div class="file-info">
              <!-- 文件标题 -->
              <div class="file-title">{{ fileName }}</div>
              <!-- 文件详情 -->
              <span
                class="file-detail"
              >{{ fileExtension }} {{ fileSize }}</span>
            </div>
          </div>
          <!-- 上传图片 -->
          <div
            v-if="
              messageType === 'file' &&
                ['jpg', 'jpeg', 'png', 'bmp', 'webp'].includes(format)
            "
            class="img-box"
          >
            <img
              class="upload-image"
              :src="fileImageUrl || fileUrl"
              @click="showDialog = true"
            />
          </div>
          <p>{{ text }}</p>
          <div class="float-op">
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
            <div
              v-if="customAddTemp"
              style="
                width: 1px;
                height: 20px;
                background-color: #cccccc;
                margin: 0 10px;
              "
            />
            <div
              v-if="customAddTemp"
              class="float-tools"
              @click="$emit('addTemp')"
            >
              <img
                class="img-default"
                src="@/assets/image/aigc/add_temp.png"
                alt=""
              />
              <img
                class="img-hover"
                src="@/assets/image/aigc/add_temp_active.png"
                alt=""
              />
              <div class="tip">添加模版</div>
            </div>
          </div>
        </div>
        <div v-if="isFullScreen()" class="head flex">{{ userName }}</div>
      </div>
    </div>

    <PreviewDialog
      :title="fileName"
      :img-src="fileImageUrl || fileUrl"
      :visiable="showDialog"
      @close="showDialog = false"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PreviewDialog from './ChatInput/components/previewDialog.vue'
import { copy } from '@/utils'
export default {
  inject: {
    isFullScreen: {
      default: true
    },
    setIndexChatCustomKeyMessage: {
      default: () => {}
    },
    customAddTemp: {
      default: false
    }
  },
  components: {
    PreviewDialog
  },
  props: {
    index: {
      type: Number,
      default: -1
    },
    text: {
      type: String,
      default: ''
    },
    // 消息类型
    messageType: {
      type: String,
      default: ''
    },
    // 文件后缀
    fileExtension: {
      type: String,
      default: ''
    },
    // 文件名字
    fileName: {
      type: String,
      default: ''
    },
    // 文件大小
    fileSize: {
      type: String,
      default: ''
    },
    // 文件图片地址
    fileImageUrl: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: ''
    },
    // 用户id
    userId: {
      type: String,
      default: ''
    },
    // 用户��称
    nickName: {
      type: String,
      default: ''
    },
    // 用户头像
    avatarUrl: {
      type: String,
      default: ''
    },
    // 发送时间
    sendTime: {
      type: String,
      default: ''
    },
    // 发送状态
    sendStatus: {
      type: String,
      default: ''
    },
    // 发送失败原因
    sendFailReason: {
      type: String,
      default: ''
    },
    // 发送失败次数
    // 是否存在敏感内容
    isSensitive: {
      type: Boolean,
      default: false
    },
    // 敏感内容
    isSensitiveReply: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      copy,
      showDialog: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    userName() {
      let showName = this.userInfo.nickName || ''
      let arr = []
      const _isEnglish = showName.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null

      if (_isEnglish) {
        // 英文名字
        // 将“,.”转为空格 & 将连续空格转换为单个空格
        showName = showName.replace(/,|\./g, ' ').replace(/\s+/g, ' ')
        arr = showName.split(' ')
        if (arr.length === 1) {
          return showName.slice(0, 3)
        }
        return arr[0].slice(0, 1) + arr[1].slice(0, 1)
      }
      // 中文名字 - 取后两位
      return showName.replace(/,|\.|\s+/g, '').slice(-2)
    }
  },
  methods: {
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    // 复制内容到剪切板
    copyText() {
      this.$uweb && this.$uweb.setAction('Event_click_copy_btn')
      this.copy(this.text)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
      // await copyConversation({
      //   conversationId: this.getChatMessageList[this.index].id
      // })
    },
    editSensitive() {
      this.$nextTick(() => {
        this.$emit('editSensitive', this.text)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-card {
  position: relative;
  border-radius: 8px;
  padding: 10px 25px 10px 10px;
  height: 54px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // overflow: hidden;
  gap: 10px;
  max-width: 260px;
  margin-bottom: 10px;

  .file-icon {
    position: relative;
    min-width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 4px;

    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba($color: #333333, $alpha: 0.5);
      z-index: 1000;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      .loading {
        width: 16px;
        height: 16px;
        display: flex;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    .icon {
      display: flex;
      height: 20px;
      width: 20px;
    }
  }

  .file-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .file-title {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
    .file-status,
    .file-detail {
      color: #999999;
      font-size: 12px;
    }
  }
}
.message-user-container {
  padding: 16px 32px;
  position: relative;
  padding-left: 0 !important;
  justify-content: flex-end;
  .head {
    width: 44px;
    min-width: 44px;
    height: 44px;
    margin-left: 18px;
    border-radius: 50%;
    background: #5696ff;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    align-items: center;
    justify-content: center;
  }
  .content {
    background: #c9d1ff;
    padding: 12px 20px 12px 20px;
    border-radius: 6px 0 6px 6px;
    position: relative;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #313233;
    &:before {
      content: '';
      position: absolute;
      top: 2px;
      right: -15px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-left: 10px solid #c9d1ff;
    }

    p {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #313233;
      white-space: pre-line;
      word-break: break-all;
    }
    &:hover {
      .float-op {
        visibility: visible;
        transition: visibility 0s 0.4s;
      }
    }
    .float-op {
      visibility: hidden;
      padding: 6px 14px;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(6, 62, 155, 0.2);
      border-radius: 6px;
      position: absolute;
      left: 0;
      top: -18px;
      display: flex;
      align-items: center;
      .float-tools {
        position: relative;
        user-select: none;
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
          bottom: -32px;
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
    .time {
      position: absolute;
      right: 0;
      font-size: 12px;
      white-space: nowrap;
      bottom: -20px;
      color: #8c8c8cb9;
    }
  }
  .content-sensitive {
    background: #f5f6ff;
    padding: 12px 20px 12px 20px;
    border-radius: 6px 0 6px 6px;
    border: 1px solid #4961ff;
    position: relative;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .triangle {
      position: absolute;
      right: -17px;
      top: 2px;
      .border {
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-left: 10px solid #4961ff;
        position: relative;
        &:before {
          content: '';
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-left: 9px solid #f5f6ff;
          position: absolute;
          top: -5.2px;
          left: -11px;
        }
      }
    }

    p {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #313233;
      white-space: pre-line;
      word-break: break-all;
    }
    .divider {
      border-top: 1px dashed #4961ff;
      margin: 16px 0;
    }
    .err-item {
      display: flex;
      flex-wrap: wrap;
      .status-i {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-right: 32px;
        &:hover {
          cursor: default;
        }
        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        .err-span {
          color: #ff0000;
        }
        .edit-span {
          color: #3975ff;
        }
      }
      .add-hover {
        &:hover {
          cursor: pointer;
        }
      }
      .err-content {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #313233;
      }
    }
  }
}

.img-box {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;

  .upload-image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: cover;
  }
}
</style>
