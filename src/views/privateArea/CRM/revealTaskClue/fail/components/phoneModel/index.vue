<template>
  <el-dialog
    title="修改跟进人手机号码"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    class="warp"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="跟进人手机号码" prop="phone">
        <el-input
          v-model.number="form.phone"
          type="text"
          maxlength="11"
          show-word-limit
          placeholder="请输入跟进人手机号码"
        />
        <div class="text">
          请先确保员工手机号已经是绑定了企业微信，且企业微信已经认证通过！
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="handleOk"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {},
  data: () => ({
    submitLoading: false,
    rules: {
      phone: [
        {
          required: true,
          message: '请输入跟进人手机号码',
          trigger: 'change'
        }
      ]
    },
    dialogVisible: false
  }),
  created() {},
  methods: {
    handleClose(done) {
      this.submitLoading = false
      done()
    },
    close(bol = true) {
      if (bol) this.dialogVisible = false
      this.submitLoading = false
    },
    async handleOk() {
      await this.$refs.formRef.validate()
      this.submitLoading = true
      const { phone } = this.form
      const strFollowPhone = phone + ''
      if (strFollowPhone?.length !== 11) {
        this.submitLoading = false
        this.$message.warning('请输入正确的手机号')
        return
      }
      this.onSubmit && this.onSubmit(this.form, this.close)
    }
  }
}
</script>
<style lang="scss" scoped>
.warp::v-deep {
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .text {
    line-height: 1.2;
    margin-top: 5px;
  }
}
</style>
