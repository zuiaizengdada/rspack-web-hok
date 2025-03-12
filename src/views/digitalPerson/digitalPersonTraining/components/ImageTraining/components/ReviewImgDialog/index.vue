<template>
  <el-dialog
    title="图片"
    :visible.sync="dialogVisible"
    :append-to-body="appendToBody"
    top="2vh"
    :before-close="
      () => {
        $emit('close')
      }
    "
  >
    <div class="prviewImg">
      <el-image string :src="row.url" fit="scale-down" />
    </div>
  </el-dialog>

</template>
<script>
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 12px 20px;
  border-bottom: 1px solid #e7e7e7;

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    i {
      font-size: 20px;
      color: #000;
    }
  }
}
::v-deep {
  .el-dialog__body {
    padding-top: 17px !important;
  }
}
.prviewImg {
  display: flex;
  justify-content: center;
  div {
    max-width: 100%;
    max-height: 800px;
  }
}
</style>
