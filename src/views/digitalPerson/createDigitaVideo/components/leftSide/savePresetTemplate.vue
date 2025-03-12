<template>
  <el-dialog
    title="新增预设模版"
    :visible.sync="getDialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="预设模版名称：" prop="name">
        <el-input
          v-model="form.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="handleClose">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="submit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入预设模版名称', trigger: 'blur' },
          // 最少不能2个字符
          { min: 2, message: '最少不能少于2个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    getDialogVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.loading = false
          this.form.name = ''
          this.$refs.form.resetFields()
        })
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$emit('submit', this.form.name)
        }
      })
    },
    handleClose() {
      this.loading = false
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #e6e6e7;
    .el-dialog__title {
      font-size: 16px;
    }
  }
}
</style>
