<template>
  <el-dialog
    width="500px"
    title="新建规则库"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="ruleForm"
      label-width="100px"
      :rules="rules"
      :model="form"
      size="small"
    >
      <el-form-item label="规则库名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入规则库名称"
          clearable
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        type="primary"
        @click="handleSave"
      >确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addWarehouse } from '@/api/course'
export default {
  name: 'SaveRule',
  data() {
    return {
      form: {
        name: ''
      },
      config: {},
      visible: false,
      rules: {
        name: [{ required: true, message: '请输入规则库名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open(config) {
      this.config = config
      this.visible = true
      this.reset()
    },
    reset() {
      this.form = {
        name: ''
      }
    },
    async handleSave() {
      await this.$refs.ruleForm.validate()
      await addWarehouse({
        warehouseName: this.form.name,
        goodsId: this.config.goodsId
      })
      this.$message.success('保存成功')
      this.visible = false
    }
  }
}
</script>

<style>
</style>
