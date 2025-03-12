<template>
  <div class="generalSetting-wrapper">
    <el-form
      ref="ruleForm"
      v-loading="loading"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-width="130px"
    >
      <el-form-item label="开通服务" prop="status">
        <el-switch v-model="ruleForm.status" />
      </el-form-item>
      <el-form-item label="选择服务商" prop="erpType">
        <el-radio-group v-model="ruleForm.erpType">
          <el-radio :label="1">万里牛</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="info">
        请找对应服务商提供如下内容，可联系服务商商务人员让其与对应技术人员提供，伏羲云已与服务商完成了接口对接，提供内容即可完成数据同步。
      </div>
      <el-form-item label="店铺昵称" prop="name">
        <el-input
          v-model="ruleForm.name"
          style="width: 52.3%"
          show-word-limit
          maxlength="80"
        />
      </el-form-item>
      <el-form-item label="账号(appKey)" prop="appKey">
        <el-input
          v-model="ruleForm.appKey"
          style="width: 52.3%"
          show-word-limit
          maxlength="80"
        />
      </el-form-item>
      <el-form-item label="密钥(appSecret)" prop="appSecret">
        <el-input
          v-model="ruleForm.appSecret"
          maxlength="150"
          show-word-limit
          style="width: 52.3%"
        />
      </el-form-item>
      <el-button :loading="loading" type="primary" @click="save()"
        >保存</el-button
      >
    </el-form>
  </div>
</template>
  
  <script>
import {
  getLogisticsSetting,
  saveLogisticsSetting
} from '@/api/business/orderLogistics'
export default {
  data() {
    return {
      ruleFormOld: {},
      ruleForm: {
        status: false,
        erpType: 1,
        name: '',
        appKey: '',
        appSecret: ''
      },
      rules: {
        name: [{ required: true, message: '请输入店铺昵称', trigger: 'blur' }],
        appKey: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入密钥', trigger: 'blur' }]
      },
      loading: false
    }
  },
  mounted() {
    this.getLogisticsSetting()
  },
  methods: {
    save(isTip = false) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            this.ruleFormOld.appSecret &&
            this.ruleFormOld.appSecret !== this.ruleForm.appSecret &&
            !isTip
          ) {
            this.$delModal({
              width: '505px',
              tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">确定修改</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认修改密钥吗？修改之后会影响实物发送物流等信息。</div>`,
              success: () => {
                this.save(true)
              }
            })
            return
          }
          this.loading = true
          saveLogisticsSetting({ ...this.ruleForm })
            .then(res => {
              this.loading = false
              this.$message.success('保存成功')
              this.getLogisticsSetting()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getLogisticsSetting() {
      this.loading = true
      getLogisticsSetting({ erpType: 1 })
        .then(res => {
          this.loading = false
          if (res.data) {
            this.ruleFormOld = { ...res.data }
            this.ruleForm = { ...res.data }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
  }
}
</script>
  
  <style lang="scss" scoped>
.generalSetting-wrapper {
  position: relative;
  background-color: #fff;
  padding: 20px;
}
.myCard {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.crmTitle {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 1.2;
  padding-left: 4px;
  border-left: 3px solid #0c6fff;
  margin-bottom: 20px;
}
.reminderSettingsTitle {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}
.reminderSettingsView {
  padding: 20px;
  > .title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    > span {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 24px;
    }
  }
}
.m-b-32 {
  margin-bottom: 32px;
}

.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  display: inline-block;
  .shop-line {
    float: left;
    width: 100%;
    margin-bottom: 10px;
    ::v-deep .assessBox {
      padding: 0;
      border: none;
    }

    .shop-line-text-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .inputNumber {
        width: 130px;
      }
      > div:nth-of-type(2) {
        padding-left: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 22px;
      }
    }
    .shop-line-label {
      float: left;
      font-size: 12px;
      width: 100px;
      line-height: 28px;
      color: #333;
    }
  }
  .boxText {
    font-size: 14px;
  }
}
.info {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: #e7f0ff;
  padding: 9px;
  font-size: 14px;
  margin-bottom: 12px;
  width: 56%;
}
</style>
  