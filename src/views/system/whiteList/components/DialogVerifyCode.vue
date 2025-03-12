<template>
  <el-dialog title="手机号码校验" :visible="visibleDialog" :close-on-click-modal="false" @close="closeDialog">
    <div class="flex">
      <el-input v-model="verifyCodeValue" size="mini" placeholder="请输入验证码" :disabled="!isCounting" style="margin-right:10px;width:200px;" />
      <el-button size="mini" :disabled="isCounting" @click="handleClickSend">{{ verifyBtnText }}</el-button>
    </div>
    <div class="footer-btn" style="margin-top:30px;">
      <el-button :loading="loading" size="mini" type="primary" @click="verifyInputCode">确定</el-button>
      <el-button size="mini" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { sendMag, checkCode } from '@/api/system/whiteList'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      verifyCodeValue: '',
      verifyBtnText: '发送验证码',
      countdown: 60,
      isCounting: false,
      visibleDialog: false,
      loading: false,
      isCheck: false,
      isRemind: false
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = val
    }
  },
  methods: {
    async handleClickSend() {
      this.isCounting = true
      this.countdown = 60
      await sendMag()
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
          this.verifyBtnText = `剩余时间:${this.countdown}秒`
        } else {
          this.isCounting = false
          this.verifyBtnText = `发送验证码`
          this.verifyCodeValue = ''
          clearInterval(timer)
        }
      }, 1000)
    },
    async verifyInputCode() {
      if (this.verifyCodeValue) {
        this.loading = true
        try {
          await checkCode({ code: this.verifyCodeValue })

          this.$message.success('验证成功')
          this.isCheck = true
          // await updateStatus({ isRemind: Boolean(this.disabled) })
          this.$emit('update:visible', false)
          this.$emit('success', this.isCheck)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('cancel', this.isCheck)
      this.verifyCodeValue = ''
      this.isCheck = false
    }
  }
}
</script>
