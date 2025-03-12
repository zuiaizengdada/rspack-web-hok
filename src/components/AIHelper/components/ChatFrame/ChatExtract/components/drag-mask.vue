<template>
  <div v-if="visible" class="drag-mask">
    <div class="dashed-box">
      <div class="tip-box">
        <svg-icon class="dashed-box-icon" icon-class="mask-icon" />
        <span>拖入此处后松开鼠标上传</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.drag-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
  backdrop-filter: blur(5px);
  background: linear-gradient(
    90deg,
    rgba(242, 247, 252, 0.8) 0%,
    rgba(242, 248, 255, 0.8) 50%,
    rgba(240, 248, 252, 0.8) 100%
  );

  .dashed-box {
    position: absolute;
    border-radius: 8px;
    top: 24px;
    left: 24px;
    right: 24px;
    bottom: 24px;
    border: 2px dashed #a6a6a6;
    pointer-events: none;

    .tip-box {
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;

      .dashed-box-icon {
        width: 80px;
        height: 80px;
      }

      span {
        font-size: 24px;
        font-weight: 500;
      }
    }
  }
}
</style>
