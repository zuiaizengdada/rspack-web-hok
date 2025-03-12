<template>
  <div class="protect-wrapper">
    <div class="title-wrapp">
      <p>半成品视频保护期</p>
    </div>
    <el-form ref="protectForm" :model="protectForm" :rules="rules" label-width="100px" class="demo-ruleForm demo-form-inline">
      <el-form-item label="保护周期" prop="protectStatus">
        <div class="form-line">
          <el-radio-group v-model="protectForm.protectStatus">
            <el-radio :label="1" :disabled="!isEdit">指定时长</el-radio>
            <el-radio :label="2" :disabled="!isEdit">不保护</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item prop="protectDayNum">
        <div v-if="protectForm.protectStatus === 1" class="fill-in">
          <el-input v-model="protectForm.protectDayNum" :disabled="!isEdit" class="input-ls" placeholder="请输入内容">
            <template slot="append">日</template>
          </el-input>
          <span>从素材上传开始计算，超过保护期后，素材向所有人自动开放。</span>
        </div>
      </el-form-item>
      <el-form-item class="bottom-form">
        <el-button v-if="!isEdit" class="save-p" @click="toEdit">编辑</el-button>
        <el-button v-if="isEdit" class="save-p" type="primary" @click="saveShareSetting('protectForm')">保存</el-button>
        <el-button v-if="isEdit" @click="toEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { settingShare, getProtectDay } from '@/api/videoManagement/vedioSetting'
export default {
  components: {},
  data() {
    var checkDayNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入保护周期（大于0且小于7的正整数）'))
      } else if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else if (value <= 0) {
        callback(new Error('请输入大于0的值'))
      } else if (value > 999) {
        callback(new Error('请输入小于或等于999的值'))
      } else {
        callback()
      }
    }
    return {
      isEdit: false,
      protectForm: {
        protectStatus: 1,
        protectDayNum: 7
      },
      rules: {
        protectStatus: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        protectDayNum: [
          { validator: checkDayNum, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      getProtectDay().then(res => {
        console.log('dddddddddddddddddddd:', res)
        if (res.success) {
          this.protectForm.protectDayNum = res.data.protectDayNum === 0 ? 7 : res.data.protectDayNum
          this.protectForm.protectStatus = res.data.protectStatus
        }
      })
    },
    toEdit() {
      this.isEdit = !this.isEdit
      this.loadData()
    },
    saveShareSetting(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            protectStatus: this.protectForm.protectStatus,
            protectDayNum: this.protectForm.protectStatus === 1 ? this.protectForm.protectDayNum : ''

          }
          settingShare(params).then(res => {
            if (res.success) {
              this.$message.success('修改成功！')
              this.isEdit = false
            } else {
              this.$message.Error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .protect-wrapper {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    .title-wrapp {
      padding-bottom: 15px;
      border-bottom: 1px solid #E7E7E7;
      p {
        font-size: 16px;
        color: #333;
        font-family: '微软雅黑';
      }
    }
    .demo-ruleForm {
      margin-top: 15px;
      ::v-deep .el-form-item__label {
        text-align: left;
      }
    }
    .fill-in {
      width: 100%;
      margin-top: 0px;
      .input-ls {
        float: left;
        width: 180px;
      }
      span {
        float: left;
        margin-left: 10px;
        color: #F53F3F;
        font-size: 14px;
      }
    }
    .nodata-cls {
      width: 100%;
      height: 600px;
      text-align: center;
      padding-top: 180px;
      img {
        display: inline-block;
      }
      p {
        font-size: 14px;
        color: #999;
        padding-top: 5px;
      }
    }
    .bottom-form {
      margin-top: 40px;
    }
    .save-p {
      margin-left: 0px;
    }
  }
</style>
