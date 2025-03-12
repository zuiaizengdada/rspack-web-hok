<template>
  <div class="msgSetting">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
      <el-form-item label="通知开启" prop="enable">
        <el-radio-group v-model="form.enable" :disabled="!ifEdit">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.enable" label="消息指令" prop="cmd">
        <template v-if="!ifEdit">
          {{ form.cmd }}:
          <el-tooltip class="item" effect="dark" content="点击复制" placement="top-start">
            <el-button type="text" class="m-l-10" @click="copyText()">复制</el-button>
          </el-tooltip>
        </template>
        <template v-else>
          <el-input v-model="form.cmd" placeholder="请输入" style="width: 200px" maxlength="5">
            <template slot="append">:</template>
          </el-input>
          <div>默认：中文：或英文:结尾</div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!ifEdit" :loading="loading" type="primary" @click="onhandleEdit">编辑</el-button>
        <el-button v-else :loading="loading" type="primary" @click="onhandleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { copy } from '@/utils'
import { getSendMessageCmd, saveSendMessageCmd } from '@/api/liveRoom/setting.js'
export default {
  components: {},
  data() {
    var validateEnglish = (rule, value, callback) => {
      const reg = /^[A-Za-z]+$/
      if (!reg.test(value)) {
        callback(new Error('请输入英文字符'))
      } else {
        callback()
      }
    }
    return {
      ifEdit: false,
      loading: false,
      form: {
        enable: false,
        cmd: ''
      },
      rules: {
        enable: [{ required: true, message: '请选择通知开启', trigger: 'change' }],
        cmd: [
          { required: true, message: '请输入消息指令', trigger: 'blur' },
          { validator: validateEnglish, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 点击保存按钮
    onhandleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ifEdit = false
          this.loading = true
          const data = {
            cmd: this.form.cmd,
            enable: this.form.enable
          }
          saveSendMessageCmd(data).then(() => {
            this.getDetail()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击编辑按钮
    onhandleEdit() {
      this.ifEdit = true
    },
    copyText() {
      const text = `${this.form.cmd}:`
      copy(text)
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    getDetail() {
      this.loading = true
      getSendMessageCmd().then(res => {
        this.form = {
          enable: res.data.enable,
          cmd: res.data.cmd
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.msgSetting {
    padding: 20px 0;
}
</style>
