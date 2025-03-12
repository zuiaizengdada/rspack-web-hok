<!-- 新增面试 -->
<template>
  <el-dialog
    :title="row.id ? '修改' : '新增'"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="120px">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="post.name" />
      </el-form-item>
      <el-form-item label="经营范围">
        <el-input
          v-model="post.businessScope"
          type="textarea"
          maxlength="200"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 10 }"
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
      post: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '最多输入30个字符',
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
          this.$emit('submit', {
            ...this.post
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 20px;
}

::v-deep .el-form-item {
  margin-bottom: 15px;
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}

::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
}

::v-deep .el-dialog__footer {
  padding-top: 0 !important;
}

.dialog-footer {
  text-align: right !important;
}

.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
