<!-- 新增分类弹窗 -->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="550px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            maxlength="20"
            placeholder="请输入分类名称"
            show-word-limit
            @input="disableEditBtn=false"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" :loading="loading" :disabled="disableEditBtn" @click="submit">{{ submitTxt }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { aiPromptWordTypeAdd, aiPromptWordTypeUpdate } from '@/api/aigc/cueWordType'
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        name: undefined
      },
      title: '新增分类',
      rules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'change'
          }
        ]
      },
      loading: false,
      disableEditBtn: false,
      submitTxt: '确 定'
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  mounted() {
    if (this.row.id) {
      this.form.name = this.row.title
      this.title = '编辑分类'
      this.disableEditBtn = true
    } else {
      this.form.name = undefined
      this.title = '新增分类'
      this.disableEditBtn = false
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit('submit', this.form)
          this.loading = true
          if (this.row.id) {
            this.submitEdit()
          } else {
            this.submitAdd()
          }
        }
      })
    },
    async submitAdd() {
      try {
        this.submitTxt = '新增中...'
        await aiPromptWordTypeAdd({ title: this.form.name })
        this.$message.success('新增成功')
        this.submitTxt = '确 定'
        this.loading = false
        setTimeout(() => {
          this.$emit('close')
        }, 1000)
      } catch {
        this.submitTxt = '确 定'
        this.loading = false
      }
    },
    async submitEdit() {
      try {
        this.submitTxt = '编辑中...'
        await aiPromptWordTypeUpdate({ title: this.form.name, id: this.row.id })
        this.$message.success('编辑成功')
        this.submitTxt = '确 定'
        this.loading = false
        setTimeout(() => {
          this.$emit('close')
        }, 1000)
      } catch {
        this.submitTxt = '确 定'
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea-s {
  position: relative;
  .btn-s {
    position: absolute;
    bottom: -6px;
    left: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
::v-deep .textarea-s {
  .el-form-item__content {
    position: relative;
    .el-textarea {
      .el-textarea__inner {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
