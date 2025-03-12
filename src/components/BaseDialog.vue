<template>
  <el-dialog
    v-if="visibleDialog"
    :close-on-click-modal="false"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="content" />
    <template v-if="!visibleFooter" #footer>
      <slot name="pre-footer" />
      <el-button type="primary" :loading="loading" size="small" @click="$_handleConfirm">{{
        footerText[0]
      }}</el-button>
      <el-button size="small" :loading="loading" @click="$_handleCancel">{{
        footerText[1]
      }}</el-button>
      <slot name="suf-footer" />
    </template>
  </el-dialog>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    visibleFooter: {
      type: Boolean,
      default: false
    },
    footerText: {
      type: Array,
      default: () => ['确 定', '取 消']
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    $_handleCancel() {
      this.$emit('cancel')
    },
    $_handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
