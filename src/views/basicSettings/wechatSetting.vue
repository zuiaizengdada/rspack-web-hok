<template>
  <MCard class="wechatSetting">
    <div class="title">企业微信设置</div>
    <div class="tips">
      <div>使用场景：集成伏羲云账号与第三方企业微信账号绑定的企业微信设置。</div>
      <div>绑定路径：企业微信后台-应用管理-自建应用-应用详情。</div>
      <div>接收消息URL：{{ `${url}/cloud/edata-sale/biz/wechat/data/${form.tenantId}` }}
        <el-tooltip v-if="!loading && form.tenantId" class="item" effect="dark" content="点此复制" placement="top-start">
          <span v-clipboard:copy="`${url}/cloud/edata-sale/biz/wechat/data/${form.tenantId}`" v-clipboard:success="clipboardSuccess">
            <i class="el-icon-document myCopy" />
          </span>
        </el-tooltip>
      </div>
    </div>
    <el-form ref="form" label-width="auto" :model="form" :rules="rules" size="small">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" maxlength="100" show-word-limit placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="corpId" prop="corpId">
        <el-input v-model="form.corpId" maxlength="30" show-word-limit placeholder="请输入" />
        <div class="formtips">此为企业id，企业微信管理员登录，企业信息中查找企业id</div>
      </el-form-item>
      <el-form-item label="AgentId" prop="agentId">
        <el-input v-model="form.agentId" maxlength="10" show-word-limit placeholder="请输入" />
        <div class="formtips">此为应用id，需要在应用管理，自建应用创建应用</div>
      </el-form-item>
      <el-form-item label="Secret" prop="corpSecret">
        <el-input v-model="form.corpSecret" maxlength="80" show-word-limit placeholder="请输入" />
        <div class="formtips">此为应用密匙，需要在应用管理，自建应用创建应用</div>
      </el-form-item>
      <el-form-item label="encodingAesKey" prop="encodingAesKey">
        <el-input v-model="form.encodingAesKey" maxlength="100" show-word-limit placeholder="请输入" />
        <div class="formtips">应用详情中，接收消息中设置内容</div>
      </el-form-item>
      <el-form-item label="Token" prop="token">
        <el-input v-model="form.token" maxlength="100" show-word-limit placeholder="请输入" />
        <div class="formtips">应用详情中，接收消息中设置内容</div>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onhandleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </MCard>
</template>

<script>
import { getWechatSetting, editWechatSetting } from '@/api/privateArea/CRM'
import clipboard from '@/directive/clipboard/index.js'
export default {
  directives: {
    clipboard
  },
  components: {},
  data() {
    return {
      form: {
        id: '',
        name: '',
        corpId: '',
        agentId: '',
        corpSecret: '',
        encodingAesKey: '',
        token: '',
        tenantId: ''
      },
      loading: false,
      url: location.origin,
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        corpId: [
          { required: true, message: '请输入corpId', trigger: 'blur' }
        ],
        agentId: [
          { required: true, message: '请输入AgentId', trigger: 'blur' }
        ],
        corpSecret: [
          { required: true, message: '请输入corpSecret', trigger: 'blur' }
        ],
        encodingAesKey: [
          { required: true, message: '请输入encodingAesKey', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '请输入corpSecret', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },
  created() {
    this.getWechatSetting()
  },
  methods: {
    getWechatSetting() {
      this.loading = true
      getWechatSetting().then(res => {
        console.log(res)
        this.form = {
          id: res.data.id,
          name: res.data.name,
          corpId: res.data.corpId,
          agentId: res.data.agentId,
          corpSecret: res.data.corpSecret,
          encodingAesKey: res.data.encodingAesKey,
          token: res.data.token,
          tenantId: res.data.tenantId
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$delModal({
            tips: `保存成功之后有员工绑定企业微信后不能再修改，请谨慎保存！`,
            success: () => {
              this.loading = true
              editWechatSetting(this.form).then(res => {
                this.$notify.success({
                  title: '提示',
                  message: '操作成功'
                })
                this.getWechatSetting()
              }).catch(() => {
                this.loading = false
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wechatSetting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  min-width: 851px;
  overflow-y: auto;
  .title {
    width: 100%;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .tips {
    margin-top: 20px;
    margin-bottom: 20px;
    background: #F2F9FF;
    border-radius: 8px;
    padding: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0C6FFF;
    line-height: 28px;
  }
  .formtips {
    margin-top: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
}
.m-t-36 {
    margin-top: 36px;
}
.myCopy {
  color: #0C6FFF !important;
}
</style>
