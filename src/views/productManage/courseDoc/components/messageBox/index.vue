<template>
  <transition v-if="visible" name="dialog-fade">
    <div class="message-box__wrapper">
      <div class="message-box" :style="{ width, marginTop: top }">
        <div class="message-box__header">
          <div class="el-message-box__title">
            <span>{{ title }}</span>
          </div>
          <button type="button" aria-label="Close" class="message-box__headerbtn">
            <i class="message-box__close el-icon-close" />
          </button>
        </div>
        <div class="message-box__content">
          <slot />
        </div>
        <div class="message-box__btns">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    // 弹框宽度
    width: {
      type: String,
      default: '30%'
    },
    // 弹框距离顶部距离
    top: {
      type: String,
      default: '15vh'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.message-box__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(125, 125, 125, 0.5);
  z-index: 200;
  .message-box {
    display: inline-block;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    .message-box__header {
      position: relative;
      padding: 15px 15px 10px;
      border-bottom: 1px solid #e7e7e7;
      .el-message-box__title {
        padding-left: 0;
        margin-bottom: 0;
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
      }
      .message-box__headerbtn {
        position: absolute;
        top: 8px;
        right: 15px;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 16px;
        cursor: pointer;
        .message-box__headerbtn .el-message-box__close {
          color: #333333;
        }
      }
    }
    .message-box__content {
      padding: 10px 15px;
      color: #606266;
      font-size: 14px;
    }
    .message-box__btns {
      padding: 5px 15px 0;
      text-align: right;
    }
  }
}
// 进入动画
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.4s;
}
// 离开动画
.dialog-fade-leave-active {
  animation: dialog-fade-out 0.4s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>
