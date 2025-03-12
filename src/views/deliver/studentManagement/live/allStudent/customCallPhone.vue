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
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
      >
        <el-form-item label="被叫号码:" prop="phone">
          <el-input
            v-model="form.phone"
            maxlength="11"
            placeholder="请输入被叫号码"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :loading="loading" @click="call">
          呼叫
        </el-button>
        <el-button size="small" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        phone: undefined,
        oldPhone: undefined
      },
      title: '',
      rules: {
        phone: [
          { required: true, message: '请输入被叫号码', trigger: 'change' },
          {
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'bulr'
          }
        ]
      },
      loading: false,
      isCountLimitObj: {}
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
  watch: {
    visible(val) {}
  },
  methods: {
    call() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          eventBus.$emit('handleCallCustomAllStudent', { phone: this.form.phone })
        }
      })
    },
    handleClose() {
      this.form = {
        phone: undefined
      }
      this.$refs.form.resetFields()
      this.$emit('close')
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
