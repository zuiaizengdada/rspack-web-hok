<template>
  <el-dialog
    :modal="false"
    :visible.sync="dialogVisible"
    width="400px"
    @close="handleClose"
  >
    <div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="意向名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            maxlength="20"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="颜色设置" prop="color">
          <el-color-picker v-model="ruleForm.color" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleOk">保 存</el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveIntentConfigPage } from '@/api/privateArea/clue'
const objColor = {
  name: '',
  color: ''
}
export default {
  data: () => ({
    dialogVisible: false,
    ruleForm: { ...objColor },
    rules: {
      name: [{ required: true, message: '请输入意向名称', trigger: 'blur' }],
      color: [{ required: true, message: '请设置颜色', trigger: 'change' }]
    }
  }),
  methods: {
    open(data = { ...objColor }) {
      this.dialogVisible = true
      this.ruleForm = data
    },
    async handleOk() {
      await this.$refs.ruleForm.validate()
      const { code } = await saveIntentConfigPage(this.ruleForm)
      if (code === 1) {
        this.$message.success('保存成功!')
        this.$emit('success', !!this.ruleForm?.id)
        this.handleClose()
      }
    },
    handleClose() {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
