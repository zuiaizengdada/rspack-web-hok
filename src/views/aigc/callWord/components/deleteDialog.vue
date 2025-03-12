<template>
  <el-dialog :visible.sync="visible" width="25%">
    <div class="dialog-content">
      <svg-icon class="icon" icon-class="zhuyi" />
      <div>
        <p class="title">删除提示</p>
        <p class="content">
          确认删除"{{ row.templateTitle || row.classifyName }}"
        </p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" size="mini" @click="handleConfirmClick"
        >确 定</el-button
      >
      <el-button size="mini" @click="handleCancelClick">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    // 取消按钮点击
    handleCancelClick() {
      this.$emit('close')
    },
    // 确定按钮点击
    handleConfirmClick() {
      this.$emit('submit', this.row)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-dialog__body {
    padding: 20px 40px;
  }
}

.dialog-content {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;

  .icon {
    width: 28px;
    height: 28px;
  }

  .title {
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }

  .content {
    font-size: 14px;
    color: #333333;
  }
}

.confirm-btn {
  background-color: #f53f3f;
  color: #ffffff;
}
</style>
