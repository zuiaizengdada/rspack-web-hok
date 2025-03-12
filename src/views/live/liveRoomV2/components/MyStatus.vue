<template>
  <!-- 状态组件 -->
  <div class="MyStatus" :class="[status]">
    <svg-icon :icon-class="statesPop[status]" class-name="icon" />
    <div class="title">{{ title }}<slot /></div>
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
      type: 'success' | 'error' | 'warning' | 'info', // success: 成功；error: 失败; warning: 警告
      default: 'success'
    }
  },
  data() {
    return {
      statesPop: {
        success: 'audit_success',
        error: 'audit_fail',
        warning: 'audit_wait',
        info: 'audit_info'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.MyStatus {
    // width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: default;
    line-height: 24px;
    border-radius: 12px;
    .title {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 20px;
    }
    .icon {
        width: 14px;
        height: 14px;
        font-size: 14px;
        margin-right: 3px;
    }
}
.success {
    background: #E6F7EA;
    color: #00B42A;
}
.error {
    background: #FEECEC;
    color: #F53F3F;
}
.info {
    background: #F5F5F5;
    color: #999999;
}
.warning {
    background: #FFF2E6;
    color: #FF7D00;
}
</style>
