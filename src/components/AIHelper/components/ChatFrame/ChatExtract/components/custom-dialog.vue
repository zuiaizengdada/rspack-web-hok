<template>
  <div v-if="visiable" class="custom-dialog">
    <!-- 遮罩层 -->
    <div class="mask" />

    <!-- 弹框主体 -->
    <div class="dialog-main">
      <!-- 弹框头部 -->
      <header class="dialog-header">
        <span class="title">{{ title }}</span>
        <svg-icon class="close-icon" icon-class="_close2" @click="close" />
      </header>
      <!-- 弹框内容 -->
      <div class="dialog-content">
        <svg-icon
          class="status-icon"
          :icon-class="isMore || isClearHistory ? 'tip_info' : 'tip_error'"
        />
        <p class="content-text">{{ content }}</p>
      </div>
      <!-- 弹框底部 -->
      <div class="dialog-bottom">
        <div v-if="isMore" class="btn btn-kown" @click="cancle">我知道了</div>
        <template v-else>
          <div class="btn btn-cancel" @click="cancle">取消</div>
          <div
            class="btn"
            :class="{
              'btn-kown': isClearHistory,
              'btn-confirm': !isClearHistory
            }"
            @click="confirm"
          >
            确定
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    visiable: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: false
    },
    isClearHistory: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    cancle() {
      this.close()
    },
    confirm() {
      this.$emit('confirm', this.id)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1020;

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1020;
  }

  .dialog-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1021;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: 24px;
    border-radius: 8px;
    border: 1px solid #979797;
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;

    .dialog-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
      }

      .close-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }

    .dialog-content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      .status-icon {
        width: 20px;
        height: 20px;
      }

      .content-text {
        color: #313233;
        font-size: 14px;
      }
    }

    .dialog-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;

      .btn {
        width: 96px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #d3d7d8;
        font-size: 14px;
        cursor: pointer;
      }

      .btn-cancel {
        background-color: #fff;
        color: #38393a;
      }

      .btn-confirm {
        background-color: #f53f3f;
        color: #fff;
      }

      .btn-kown {
        color: #fff;
        background-color: #5696ff;
      }
    }
  }
}
</style>
