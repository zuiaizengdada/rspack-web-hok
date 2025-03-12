<template>
  <div
    class="file-card"
    @click="handleClick"
    @mouseenter="handlerMouseenter"
    @mouseleave="handlerMouseleave"
  >
    <!-- 是否查看 -->
    <div v-if="isNew && taskStatus === 'DONE'" class="new-icon">new</div>

    <!-- 文案卡片类型图标 -->

    <svg-icon
      v-if="taskStatus === 'PENDING'"
      class="type-icon"
      :icon-class="iconTypeWaitingMap[taskType]"
    />
    <svg-icon v-else class="type-icon" :icon-class="iconTypeMap[taskType]" />

    <!-- 文案卡片信息 -->
    <div class="file-info">
      <!-- 文案卡片标题 -->
      <el-tooltip
        effect="dark"
        :content="title || taskName"
        placement="top"
        :disabled="isShowTooltip"
        popper-class="custom-zyq-prpper"
      >
        <p
          ref="fileTitleRef"
          class="file-title"
          @mouseenter="mouseEnterShowTooltip('fileTitleRef')"
        >
          {{ title || taskName }}
        </p>
      </el-tooltip>
      <!-- 文案卡片中间 -->
      <div v-if="isShowFileCardCenter" class="file-info-center">
        <div class="file-status">
          <svg-icon :icon-class="fileCardCenterClass.taskStatusIcon" />
          <span
            class="file-status-text"
            :class="{
              'error-text': taskStatus === 'FAILED'
            }"
          >
            {{ fileCardCenterClass.taskStatusText }}
          </span>
          <svg-icon v-if="taskStatus === 'WAITING'" icon-class="_wating" />
          <svg-icon v-if="taskStatus === 'UPLOADING'" icon-class="waiting" />
        </div>
      </div>
      <!-- 文案卡片底部 -->
      <div v-if="isShowFileCardBottom" class="file-info-bottom">
        <div class="file-info-bottom-item">
          <template v-if="taskStatus === 'DONE' || taskStatus === 'FAILED'">
            <el-tooltip
              effect="dark"
              :content="fileCardBottomClass.leftText"
              placement="bottom"
              :disabled="isShowTooltip"
              popper-class="custom-zyq-prpper"
            >
              <p
                ref="bottomTextRef"
                class="file-info-bottom-item-text left-text bottom-text"
                :class="{
                  'error-text': taskStatus === 'FAILED'
                }"
                @mouseenter="mouseEnterShowTooltip('bottomTextRef')"
              >
                {{ fileCardBottomClass.leftText }}
              </p>
            </el-tooltip>
            <span
              class="file-info-bottom-item-text right-text"
              :class="{
                'error-text-btn': taskStatus === 'FAILED'
              }"
              @click="handleRetry"
            >
              {{ fileCardBottomClass.rightText }}
            </span>
          </template>
          <template v-if="taskStatus === 'PENDING'">
            <div
              style="width: 100%; display: flex; align-items: center; gap: 8px"
            >
              <svg-icon :icon-class="fileCardBottomClass.leftText" />
              <span
                class="file-info-bottom-item-text left-text"
                :class="{
                  'error-text': taskStatus === 'FAILED'
                }"
              >
                {{ fileCardBottomClass.rightText }}
              </span>
            </div>
          </template>
          <template v-if="taskStatus === 'UPLOADING'">
            <div
              style="width: 100%; display: flex; align-items: center; gap: 8px"
            >
              <svg-icon :icon-class="fileCardBottomClass.leftText" />
              <span
                class="file-info-bottom-item-text left-text"
                :class="{
                  'error-text': taskStatus === 'FAILED'
                }"
              >
                {{ fileCardBottomClass.rightText }}
              </span>
              <svg-icon :icon-class="fileCardBottomClass.rightIcon" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 删除按钮 -->
    <svg-icon
      v-show="isShowCloseIcon"
      class="close-icon"
      icon-class="_close"
      @click="remove"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 文案标题
    title: {
      type: String,
      default: ''
    },
    // 是否未查看的任务
    isNew: {
      type: Number,
      default: 1
    },
    // 提取文案类型
    taskType: {
      type: String,
      default: ''
    },
    // 提取文案名称
    taskName: {
      type: String,
      default: ''
    },
    // 文案提取状态
    taskStatus: {
      type: String,
      default: ''
    },
    // 文案提取失败原因
    taskFailureDescription: {
      type: String,
      default: ''
    },
    // 文案提取字数
    wordCount: {
      type: Number,
      default: 1254
    },
    // 文案提取时间
    finishedTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 是否展示删除图标
      isShowCloseIcon: false,
      iconTypeMap: {
        LINK: 'file-link_card',
        IMAGE: 'file-pic_card',
        AUDIO: 'file-audio_card',
        VIDEO: 'file-video_card',
        DOC: 'file-file_card'
      },
      iconTypeWaitingMap: {
        LINK: 'file-link-waiting',
        IMAGE: 'file-pic-waiting',
        AUDIO: 'file-audio-waiting',
        VIDEO: 'file-video-waiting',
        DOC: 'file-file-waiting'
      },
      // 是否展示Tooltip
      isShowTooltip: false
    }
  },
  computed: {
    // 是否展示文案卡片中间
    isShowFileCardCenter() {
      return this.taskStatus !== 'DONE'
    },
    // 是否展示文案卡片底部
    isShowFileCardBottom() {
      return (
        this.taskStatus === 'DONE' ||
        this.taskStatus === 'FAILED' ||
        this.taskStatus === 'PENDING'
      )
    },
    // 文案卡片中间Class
    fileCardCenterClass() {
      const obj = {}

      switch (this.taskStatus) {
        case 'WAITING':
          obj.taskStatusText = '等待中'
          obj.taskStatusIcon = 'wait'
          break

        case 'UPLOADING':
          obj.taskStatusText = '上传中'
          obj.taskStatusIcon = 'wait'
          break

        case 'FAILED':
          obj.taskStatusText = '提取失败'
          obj.taskStatusIcon = '_error'
          break
      }

      return obj
    },
    // 文案卡片底部Class
    fileCardBottomClass() {
      const obj = {}

      switch (this.taskStatus) {
        case 'DONE':
          obj.leftText = `${this.wordCount}字`
          obj.rightText = this.finishedTime
          break

        case 'FAILED':
          obj.leftText = this.taskFailureDescription
          obj.rightText = '点击重试'
          break

        case 'PENDING':
          obj.leftText = 'wait'
          obj.rightText = '提取中...'
          break

        case 'UPLOADING':
          obj.leftText = 'wait'
          obj.rightText = '上传中'
          obj.rightIcon = 'waiting'
          break
      }

      return obj
    }
  },
  methods: {
    // 卡片点击
    handleClick() {
      this.$emit('click')
    },
    // 移除卡片
    remove(event) {
      // 阻止事件冒泡到父组件
      event.stopPropagation()
      this.$emit('delete')
    },
    // 点击重试
    handleRetry(event) {
      // 阻止事件冒泡到父组件
      event.stopPropagation()
      if (this.taskStatus === 'FAILED') {
        this.$emit('retry')
      }
    },
    // 鼠标移入
    handlerMouseenter() {
      this.isShowCloseIcon = true
    },
    // 鼠标移出
    handlerMouseleave() {
      this.isShowCloseIcon = false
    },
    // 检查文是否超出哦容器宽度
    isTextOverflow(ref) {
      return ref.scrollWidth > ref.clientWidth
    },
    // 鼠标移入显示tooltip
    mouseEnterShowTooltip(ref) {
      this.isShowTooltip = !this.isTextOverflow(this.$refs[ref])
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
::v-deep .el-progress-bar {
  padding-right: 45px;
}

::v-deep .el-progress-bar__outer {
  background-color: #e5e5e5;
}

::v-deep .el-progress__text {
  color: #5696ff;
  font-size: 12px;
  margin-left: 17px;
}

.file-card {
  position: relative;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid transparent;
  box-shadow: 0 2px 4px 0 #dbdbdb80;
  overflow: hidden;
  cursor: pointer;

  .new-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 16px;
    line-height: 15px;
    text-align: center;
    border-radius: 8px 0 8px 0;
    background: #ff8d1a;
    font-size: 12px;
    color: #ffffff;
  }

  &:hover {
    border: 1px solid #20a9ff;
    background-color: #ebf3ff;
  }

  .type-icon {
    min-width: 60px;
    height: 60px;
  }

  .file-info {
    flex: 1;
    width: calc(100% - 110px);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 5px;

    .file-title {
      width: 100%;
      color: #333333;
      font-size: 15px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .file-info-center {
      width: 100%;

      .file-status {
        display: flex;
        align-items: flex-end;
        gap: 8px;

        .file-status-text {
          font-size: 12px;
          color: #808080;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .error-text {
          color: #ff0000;
        }
      }
    }

    .file-info-bottom {
      width: 100%;

      &-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        .error-text {
          color: #ff0000;
        }

        .error-text-btn {
          color: #5696ff;
        }

        &-text {
          font-size: 12px;
          color: #808080;
        }

        .left-text {
          max-width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .right-text {
          min-width: 30%;
          text-align: right;
        }

        @keyframes widthChange {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
        .container {
          background-color: #e5e5e5;
          height: 8px;
          border-radius: 10px;

          .strip {
            width: 0%;
            height: 8px;
            background-color: #5696ff;
            animation: widthChange 3s infinite;
            border-radius: 10px;
          }
        }
      }
    }
  }

  .close-icon {
    width: 13px;
    height: 13px;
    position: absolute;
    top: 7px;
    right: 7px;
  }
}
</style>
