<template>
  <el-dialog
    title="保存分配规则"
    :visible.sync="visible"
    class="dialog-container"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      size="small"
      :model="form"
      :rules="rules"
      class="search-form"
    >
      <el-form-item label="分配规则名称" prop="name">
        <el-input
          v-model="form.name"
          type="text"
          placeholder="请输入分配规则名称"
          style="width:100%"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSave">保存</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分配规则名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save', this.form.name)
          this.visible = false
        }
      })
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style>

</style>
