<!-- 新增业务场景模板弹窗 -->
<template>
  <div>
    <el-dialog
      title="编辑业务场景模板"
      :visible.sync="visible"
      width="750px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="功能板块" prop="functionName">
          <span>{{ form.functionName }}</span>
        </el-form-item>
        <el-form-item label="模板名称" prop="title">
          <span>{{ form.title }}</span>
        </el-form-item>
        <el-form-item label="功能描述" prop="description">
          <el-input
            v-model="form.description"
            maxlength="50"
            show-word-limit
            placeholder="请输入功能描述，简要介绍助手功能"
          />
        </el-form-item>
        <el-form-item label="Prompt格式" prop="prompt">
          <!-- 文本域 -->
          <el-input
            ref="textarea"
            v-model="form.prompt"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            resize="none"
            maxlength="500"
            show-word-limit
            placeholder="请输入Prompt格式，不超过500字"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
      default: () => {
        return {
          name: undefined,
          describe: undefined,
          type: undefined,
          postId: undefined
        }
      }
    }
  },
  data() {
    return {
      form: {
        functionName: undefined,
        describe: undefined,
        type: undefined,
        title: '',
        description: ''
      },
      rules: {
        describe: [
          {
            required: true,
            message: '请输入Prompt格式',
            trigger: 'blur'
          }
        ]
      }
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
  created() {
    if (this.row.id) {
      this.form = { ...this.row }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  padding: 16px;
  color: #333;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
</style>
