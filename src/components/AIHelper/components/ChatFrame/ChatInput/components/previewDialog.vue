<template>
  <div v-if="visiable" class="preview-dialog">
    <!-- 遮罩层 -->
    <div class="mask" />

    <!-- 弹框主体 -->
    <div class="dialog-main">
      <!-- 弹框头部 -->
      <header class="dialog-header">
        <span class="title">{{ title }}</span>
        <svg-icon class="close-icon" icon-class="close2" @click="close" />
      </header>
      <!-- 弹框内容 -->
      <div class="dialog-content">
        <img class="preview-img" :src="imgSrc" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    imgSrc: {
      type: String,
      default: ''
    },
    visiable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-dialog {
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
      padding-bottom: 20px;

      .title {
        color: #333333;
        font-size: 16px;
        font-weight: 700;
      }

      .close-icon {
        width: 10px;
        height: 10px;
        cursor: pointer;
      }
    }

    .dialog-content {
      width: 100%;
      height: 700px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
