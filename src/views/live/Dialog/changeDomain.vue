<template>
  <AppDialog
    v-model="visible"
    title="更新域名"
    width="500px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="changeDomain">
      <div class="changeDomainTitile">重点提示</div>
      <div class="changeDomainTips">
        <i class="el-icon-warning-outline fs-16" />
        以下的域名一修改，则所有机构都修改了。请谨慎操作！
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto" class="demo-ruleForm">
        <el-form-item prop="domainUrl" label="更新邀课主域名：">
          <el-input v-model="form.domainUrl">
            <template slot="prepend">https://</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <div class="ss-material-box-bottom">
        <el-button size="small" type="primary" @click="sure">保存</el-button>
        <el-button size="small" @click="closeFn">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { saveOneDomainConfig } from '@/api/liveRoom/setting.js'
export default {
  components: {
    AppDialog
  },
  data() {
    var checkdomainUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入1级域名'))
      } else if (value === 'hokkj.cn') {
        callback(new Error('该域名为保护域名，不可使用'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      top: '10vh',
      form: {
        domainUrl: ''
      },
      rules: {
        domainUrl: [
          { validator: checkdomainUrl, trigger: 'blur' }
        ]
      },
      value: '',
      id: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.form.domainUrl = this.value
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            'domainUrl': this.form.domainUrl,
            'id': this.id,
            'level': 1
          }
          saveOneDomainConfig(data).then(res => {
            this.success && this.success()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    closeFn() {
      this.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.changeDomain {
  padding: 20px;
  .changeDomainTitile {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .changeDomainTips {
    width: 100%;
    background: #FEECEC99;
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    height: 38px;
    line-height: 38px;
    padding: 0 20px;
    margin-bottom: 16px;
  }
}
.ss-material-box-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
