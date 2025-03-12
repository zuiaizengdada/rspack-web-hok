<template>
  <el-dialog
    title="推送配置"
    :visible="visible"
    width="669px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
      <el-form-item
        prop="pushStatus"
        label-width="10px"
        style="margin-bottom: 10px"
      >
        <div style="height: 30px">
          <span style="color: #ff1f00">*</span>
          <span style="font-size: 14px; color: #000000">是否推送数据</span>
        </div>
        <el-radio-group v-model="formData.pushStatus">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="formData.pushStatus"
        prop="pushUrl"
        label-width="10px"
        style="margin-bottom: 10px"
      >
        <div style="display: flex; align-items: center">
          <span style="color: #ff1f00">*</span>
          <span style="font-size: 14px; color: #000000">推送地址</span>
          <el-tooltip placement="top">
            <div slot="content">
              <a
                href="https://doc.weixin.qq.com/doc/w3_AcgAsAYPAD0mx1hu5xjSYK6U0kz14?scode=AGYAVAdhACE34ab0H7AY0AdQY_ACc"
                target="_blank"
              >点击查看推送API文档</a>
            </div>
            <img
              style="
                width: 13px;
                height: 13px;
                margin-left: 5px;
                cursor: pointer;
              "
              src="@/assets/image/wenhao.png"
              alt="提示"
            />
          </el-tooltip>
        </div>
        <el-input
          v-model="formData.pushUrl"
          type="textarea"
          placeholder="请输入推送地址"
          show-word-limit
          maxlength="200"
        />
      </el-form-item>

      <el-form-item
        v-if="formData.pushStatus"
        prop="secretKey"
        label-width="10px"
        style="margin-bottom: 20px"
      >
        <div>
          <span style="color: #ff1f00">*</span>
          <span style="font-size: 14px; color: #000000">密钥</span>
        </div>
        <el-input
          v-model="formData.secretKey"
          placeholder="请输入密钥"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        v-if="formData.pushStatus"
        class="push-template"
        prop="orderDetail"
        label-width="10px"
        required
      >
        <el-checkbox v-model="formData.orderDetail">订单数据</el-checkbox>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        plain
        @click="handleTest"
      >测试</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
      <el-button size="mini" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { testPush } from '@/api/shop/thirdShop'

export default {
  name: 'PushConfigDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        pushStatus: false,
        pushUrl: '',
        orderDetail: false,
        secretKey: '',
        id: ''
      },
      rules: {
        pushStatus: [
          { required: true, message: '请选择是否推送数据', trigger: 'change' }
        ],
        pushUrl: [
          {
            required: true,
            message: '请输入推送地址',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.formData.pushStatus && !value) {
                callback(new Error('请输入推送地址'))
              } else {
                callback()
              }
            }
          }
        ],
        orderDetail: [
          {
            required: true,
            message: '请至少选择一项',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.pushStatus && !this.formData.orderDetail) {
                callback(new Error('请至少选择一项'))
              } else {
                callback()
              }
            }
          }
        ],
        secretKey: [
          { required: true, message: '请输入密钥', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '密钥长度在1到50个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'formData.pushStatus': {
      handler(newVal) {
        if (!newVal) {
          this.formData.pushUrl = ''
          this.formData.secretKey = ''
          this.formData.orderDetail = false

          // 重置表单验证状态
          this.$nextTick(() => {
            this.$refs.form?.clearValidate([
              'pushUrl',
              'secretKey',
              'orderDetail'
            ])
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.$refs.form?.resetFields()
      this.visible = false
    },
    async handleTest() {
      const data = {
        pushUrl: this.formData.pushUrl,
        secretKey: this.formData.secretKey
      }
      const { code } = await testPush(data)
      if (code === 1) {
        this.$message.success('测试成功')
      } else {
        this.$message.error('测试失败')
      }
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const formData = { ...this.formData }
          this.$emit('save', formData)
          this.handleClose()
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

.push-template ::v-deep {
  .el-form-item__error {
    top: 70%;
  }
}

::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 20px;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
    }

    .el-icon-close {
      color: #000000;
      width: 9px;
      height: 9px;
    }
  }

  .el-input {
    input {
      padding-right: 60px;
    }
  }

  .el-dialog__body {
    padding: 10px 20px 0;

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .el-textarea__inner {
    padding-bottom: 36px;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
</style>
