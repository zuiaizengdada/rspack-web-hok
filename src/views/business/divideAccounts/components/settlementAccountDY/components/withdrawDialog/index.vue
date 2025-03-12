<template>
  <el-dialog
    title="提现"
    :visible.sync="dialogVisible"
    width="475px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :footer="null"
  >
    <div class="sum-row">
      <div class="sum-label">
        <span class="aicon">¥</span>{{ withdrawAbleAmount }}
      </div>
      <div class="sum-amount">可提取额度</div>
    </div>
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="提现金额" prop="amount">
        <el-input-number
          v-model="form.amount"
          style="width: 100%"
          class="amountinput"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="withdrawAbleAmount"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="手机验证码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 100%"
          class="codeinput"
          placeholder=""
          maxlength="10"
        />
        <span class="sendcode" @click.stop="sendCode">
          {{ codeTitle }}
          <span v-if="codeTitle !== '获取验证码'">秒后获取</span>
        </span>
      </el-form-item>
      <div class="info-row">
        <div class="title">结算账户信息</div>
        <div class="label"><span>开户名</span>{{ info.name }}</div>
        <div class="label"><span> 开户支行</span> {{ info.bankBranch }}</div>
        <div class="label"><span> 银行卡号</span>{{ info.bankCard }}</div>
      </div>

      <el-row>
        <el-col :span="24">
          <el-link
            type="info"
            style="font-size: 14px; color: #999999; margin-top: 10px"
            disabled
          >
            1.可提现额度可发起提现，冻结金额不可提现；</el-link>
        </el-col>
        <el-col :span="24">
          <el-link type="info" style="font-size: 14px; color: #999999" disabled>
            2.发起提现后，预计1~3个工作日到账，提交后不允许撤销；</el-link>
        </el-col>
        <el-col :span="24">
          <el-link
            type="info"
            style="font-size: 14px; color: #999999; margin-bottom: 10px"
            disabled
          >3.每天最多可发起5次提现操作；</el-link>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="withdrawClick">提现</el-button>
      </el-row>
    </el-form>
    <el-dialog
      title="提现结果"
      :visible.sync="dialogWithdrawalVisible"
      append-to-body
      width="30%"
      :before-close="
        () => {
          dialogWithdrawalVisible = false
        }
      "
    >
      <el-result
        :icon="isWithdrawal ? 'success' : 'error'"
        :title="'$' + form.amount"
        :sub-title="
          isWithdrawal
            ? '提现受理成功，预计1~3个工作日到账'
            : '提现受理失败，失败原因xxxx'
        "
      >
        <template slot="extra">
          <el-button
            v-if="isWithdrawal"
            type="primary"
            size="medium"
            @click="dialogWithdrawalVisible = false"
          >
            返回
          </el-button>
          <el-button
            v-else
            type="primary"
            size="medium"
            @click="retry"
          >重试</el-button>
        </template>
      </el-result>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { verifyCode, withdrawCash } from '@/api/business/divideAccounts'
export default {
  data() {
    return {
      dialogVisible: false,
      withdrawAbleAmount: 0,
      info: { name: '', bankBranch: '', bankCard: '' },
      form: {
        amount: 0,
        code: ''
      },
      rules: {
        amount: [
          { required: true, message: '请输入提现金额', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value > this.withdrawAbleAmount) {
                callback(new Error('提现金额不能大于可提现额度'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error('提现金额不能小于0'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      codeTitle: '获取验证码',
      interval: 0,
      dialogWithdrawalVisible: false,
      isWithdrawal: false,
      loading: false
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form.amount = 0
        this.form.code = ''
        this.codeTitle = '获取验证码'
        clearInterval(this.interval)
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    retry() {
      this.dialogWithdrawalVisible = false
      this.withdrawClick()
    },
    withdrawClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          withdrawCash({ ...this.form })
            .then(e => {
              this.loading = false
              if (e.a) {
                this.withdrawAbleAmount =
                  this.withdrawAbleAmount - this.form.amount
                this.isWithdrawal = true
                this.dialogWithdrawalVisible = true
              }
              this.dialogVisible = false
              this.$emit('refresh')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    sendCode() {
      if (this.codeTitle !== '获取验证码') {
        return
      }
      if (this.form.amount <= 0) {
        this.$message.warning('请输入提现金额')
        return
      }

      verifyCode().then(() => {
        this.$message.success('验证码已发送')
        this.codeTitle = 60
        this.interval = setInterval(() => {
          if (this.codeTitle <= 0) {
            this.codeTitle = '获取验证码'
            return
          }
          this.codeTitle -= 1
        }, 1000)
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      line-height: 16px;
      font-weight: 500;
      color: #333333;
    }
  }
  .el-dialog__body {
    padding-top: 20px;
  }
  .amountinput {
    input {
      text-align: left;
    }
  }
}
.sendcode {
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #0c6fff;
  cursor: pointer;
}
.sum-row {
  width: 435px;
  padding: 25px 20px;
  margin-bottom: 20px;
  height: 98px;
  border-radius: 5px;
  background: #f0f8ff;

  .sum-label {
    width: 100%;
    font-size: 24px;
    color: #0c6fff;
    text-align: center;
    .aicon {
      font-size: 20px;
    }
  }
  .sum-amount {
    width: 100%;
    font-size: 14px;
    font-style: normal;
    text-align: center;
    font-weight: 500;
    color: #333333;
  }
}
.info-row {
  width: 435px;
  padding: 12px 9px;
  border-radius: 5px;
  background: #f0f3f7;
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: 500;
  }
  .label {
    margin-top: 15px;
    color: #333333;
    font-size: 14px;
    font-weight: 500;
    span {
      width: 75px;
      display: inline-block;
    }
  }
}
</style>
