<template>
  <!-- 新增/编辑收款渠道 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="518px"
    height="226px"
    :loading="loading"
    @success="send"
  >
    <div class="payChannelDialog overflowOuto">
      <!-- 新增/编辑收款渠道 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="91px" size="small">
        <el-form-item label="收款渠道" prop="channel">
          <el-input v-model="form.channel" style="width: 296px" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="收款单位" prop="company">
          <el-input v-model="form.company" style="width: 296px" maxlength="20" show-word-limit />
          <div class="tips m-t-8">收款公司主题，填写全称</div>
        </el-form-item>
        <el-form-item label="收款账号" prop="account">
          <el-input v-model="form.account" style="width: 296px" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addPaymentchannel, editPaymentchannel } from '@/api/deliver/baseSeeting'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        channel: '',
        company: '',
        account: '',
        status: 0
      },
      type: 1,
      title: '新增收款渠道',
      visible: false,
      rules: {
        channel: [
          { required: true, message: '请输入收款渠道', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入收款单位', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入收款账号', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {},
  methods: {
    open(row, type) {
      this.reset()
      if (type === 2) {
        this.form = {
          channel: row.channel,
          company: row.company,
          account: row.account,
          status: row.status
        }
      }
      this.type = type
      this.title = type === 1 ? '新增收款渠道' : '编辑收款渠道'
      this.visible = true
    },
    reset() {
      this.form = {
        channel: '',
        company: '',
        account: '',
        status: 0
      }
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.loading = true
      addPaymentchannel(this.form)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    },
    edit() {
      this.loading = true
      editPaymentchannel(this.form)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  height: 518px;
  padding: 16px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
</style>
