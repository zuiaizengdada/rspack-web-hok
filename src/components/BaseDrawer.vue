<template>
  <el-drawer
    v-if="visibleDrawer"
    :visible.sync="visibleDrawer"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="content" />
    <div v-if="!visibleFooter" class="bottom-btns">
      <slot name="pre-footer" />
      <el-button size="mini" type="primary" @click="$_handleConfirm">{{
        footerText[0]
      }}</el-button>
      <el-button size="mini" @click="$_handleCancel">{{
        footerText[1]
      }}</el-button>
      <slot name="suf-footer" />
    </div>
  </el-drawer>
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
    }
  },
  computed: {
    visibleDrawer: {
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
::v-deep .el-drawer__title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
}
::v-deep .el-drawer__header {
  border-bottom: 1px solid #e7e7e7;
  padding: 20px;
}
::v-deep .el-drawer__body {
  padding: 20px;
}
.bottom-btns {
  box-shadow: 0 -7px 5px -5px rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  padding: 10px;
}
</style>
