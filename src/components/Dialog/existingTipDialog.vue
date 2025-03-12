<template>
  <el-dialog
    width="495px"
    title="提示"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div>
      该人员信息已存在{{
        errCode === '5145' ? '黑名单' : '简历库'
      }}，无法再新增，可点击“查看详情”了解该员工信息。
    </div>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit">查看详情</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isShow: false,
      errCode: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.success && this.success()
    },
    closeDialog() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
</style>
