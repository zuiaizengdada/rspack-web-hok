<template>
  <div class="basic-container">
    <div class="basic-header">
      <div class="basic-box" />
      <span class="title">微信公众号</span>
      <div class="tips" @click="handleOpenView">
        <svg-icon
          icon-class="question"
          class="svg-icon"
        />
        <span>帮助</span>
      </div>
    </div>
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="应用AppId：" prop="appId">
        <el-input
          v-model.trim="form.appId"
          :disabled="type === 'edit'"
          maxlength="20"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="公众号Secret：" prop="secret">
        <el-input
          v-model.trim="form.secret"
          maxlength="80"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="公众号名称：" prop="name">
        <el-input
          v-model.trim="form.name"
          maxlength="30"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <div class="basic-header">
        <span class="title">服务器配置</span>
      </div>
      <el-form-item label="回调地址：" prop="callbackUrl">
        <div>
          <el-input v-model.trim="form.callbackUrl" disabled placeholder="请输入" />
          <el-button
            class="basic-btn"
            type="text"
            @click="handleCopy('callbackUrl')"
          >复制</el-button>
        </div>
      </el-form-item>
      <el-form-item label="Token：" prop="token">
        <div>
          <el-input v-model.trim="form.token" disabled placeholder="请输入" />
          <el-button
            class="basic-btn"
            type="text"
            @click="handleCopy('token')"
          >复制</el-button>
        </div>
      </el-form-item>
      <el-form-item label="消息加密密钥：" prop="encodingAesKey">
        <el-input
          v-model.trim="form.encodingAesKey"
          maxlength="80"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="handleSave"
        >保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { bizOfficialInitAddInfo, bizOfficialAddOrUpdate } from '@/api/privateArea/toolbox'
import { copy } from '@/utils/index'
export default {
  data() {
    return {
      form: {
        appId: '',
        secret: '',
        name: '',
        callbackUrl: '',
        token: '',
        encodingAesKey: '',
        id: ''
      },
      rules: {
        appId: [
          {
            required: true,
            message: '请输入应用AppId',
            trigger: 'blur'
          }
        ],
        secret: [
          {
            required: true,
            message: '请输入公众号Secret',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入公众号名称',
            trigger: 'blur'
          }
        ],
        encodingAesKey: [
          {
            required: true,
            message: '请输入消息加密密钥',
            trigger: 'blur'
          }
        ]
      },
      type: 'add'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const query = this.$route.query
      this.type = query.type
      if (this.type === 'add') {
        const { data } = await bizOfficialInitAddInfo()
        this.form.callbackUrl = data?.callbackUrl ?? ''
        this.form.token = data?.token ?? ''
        this.form.id = data?.id ?? ''
      } else {
        this.form = query
      }
    },
    handleCopy(val) {
      copy(this.form[val])
      this.$message.success('复制成功')
    },
    handleOpenView() {
      window.open('https://pv9bg3blkb.feishu.cn/docx/Q5XYduVqkopxg7xFND7cX8uZnif')
    },
    handleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    async  save() {
      const { code } = await bizOfficialAddOrUpdate({
        appId: this.form.appId,
        callbackUrl: this.form.callbackUrl,
        encodingAesKey: this.form.encodingAesKey,
        token: this.form.token,
        name: this.form.name,
        secret: this.form.secret,
        id: this.form.id
      })
      if (code === 1) {
        this.$message.success('操作成功')
        this.$emit('load', {
          ...this.form,
          type: 'edit'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container{
    padding-top: 20px;
    .basic-header{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .basic-box{
            width: 4px;
            height: 20px;
            border-radius: 6px;
            background: #0C6FFF;
        }
        .title{
            color: #333333;
            font-size: 16px;
            margin:0 8px
        }
        .tips{
            font-size: 13px;
            color: #0C6FFF;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .svg-icon{
            fill:currentColor;
            color:#0C6FFF;
            margin-right:4px
        }
    }
    .el-input{
        width: 450px;
    }
    .basic-btn{
        margin-left: 15px;
    }
}
</style>
