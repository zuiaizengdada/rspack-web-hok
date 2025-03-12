<template>
  <modal
    v-if="formDialog.visible"
    width="500px"
    :title="formName"
    :type="2"
    :visible.sync="formDialog.visible"
    @close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right">
      <el-form-item v-if="formName !== '赠送'" label="可用余额">
        {{ balance }}
      </el-form-item>
      <el-form-item :label="`${formName}获课币`" prop="amount">
        <el-input-number
          v-model="form.amount"
          :min="0"
          :max="formName === '赠送' ? 500 : balance"
          :precision="2"
          controls-position="right"
          :placeholder="`请输入${formName}获课币`"
        />
      </el-form-item>
      <el-form-item :label="`${formName}原因`" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :placeholder="`请输入${formName}原因`"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import modal from '@/components/Modal/index'
export default {
  name: 'VirtualCurrencyModal',
  components: { modal },
  props: {
    balance: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    const checkAmout = (rule, value, callback) => {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('获课币不能为0'))
      }
    }
    return {
      form: {
        amount: '',
        remark: ''
      },
      formName: '赠送',
      formDialog: {
        visible: false
      },
      rules: {
        amount: [{ required: true, validator: checkAmout, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose() {
      this.formDialog.visible = false
      this.form.amount = ''
      this.form.remark = ''
    },
    open({ type }) {
      this.formDialog.visible = true
      this.formName = type === 'give' ? '赠送' : '冻结'
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit('submit', this.form)
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style></style>
