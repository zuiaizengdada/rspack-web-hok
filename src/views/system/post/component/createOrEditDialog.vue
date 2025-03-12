<!-- 岗位管理新增编辑 -->
<template>
  <el-dialog
    :title="!row.id ? '新增岗位' : '编辑岗位'"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="100px">
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="post.name" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位描述" prop="work">
        <!-- 文本域 -->
        <el-input
          v-model="post.work"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          resize="none"
          placeholder="请输入岗位描述"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      post: { name: '', work: '' },
      rules: {
        name: [
          {
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          }
        ],
        work: [
          {
            required: true,
            message: '请输入岗位描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getVisible: {
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
      this.post = { ...this.row }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', this.post)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
