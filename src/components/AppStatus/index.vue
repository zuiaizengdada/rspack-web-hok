<template>
  <!-- 状态组件 -->
  <div class="AppStatus">
    <div class="circular shelf" :class="[status]" />
    <div class="title">
      {{ title }}
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    status: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: 'success' | 'error' | 'warning' | 'info' | 'dou-success' | 'dou-info', // success: 成功；error: 失败; warning: 警告
      default: 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
.AppStatus {
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    // cursor: pointer;
    cursor: default;
    .circular {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 3px;
    }
    .success {
      background: #27C000
    }
    .error {
      background: #F53F3F
    }
    .warning {
      background:#FF7D00
    }
    .info {
      background: #909399
    }
    .dou-success{
      background: #00B42A;
    }
    .dou-info{
      background: #C7C7C7;
    }
}
</style>
