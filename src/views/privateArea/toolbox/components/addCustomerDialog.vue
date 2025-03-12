<template>
  <!-- 新增/编辑转课弹框 -->
  <AppDialog
    v-model="config.visible"
    title="客服"
    width="510px"
    height="200px"
    :loading="loading"
    :top="top"
    @success="sure"
  >
    <div class="addCustomerDialog overflowOuto">
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="客服名称" prop="customerName">
          <el-input
            v-model="form.customerName"
            placeholder="请输入"
            class="w-200"
          />
        </el-form-item>
        <el-form-item label="过期时间" prop="expirationDate">
          <el-date-picker
            v-model="form.expirationDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item v-if="config.type === 1" label="选择人员" prop="userId">
          <el-tag
            v-if="form.userId"
            closable
            @click="onhandleChange"
            @close="close"
          >{{ form.userName }}</el-tag>
          <el-button v-else @click="onhandleChange">选择</el-button>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addCustomer, editCustomer } from '@/api/privateArea/toolbox'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 2,
          row: {},
          deliveryInfoId: '',
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      top: '114px',
      form: {
        customerName: '',
        expirationDate: '',
        userId: '',
        userName: ''
      },
      rules: {
        customerName: [
          { required: true, message: '请输入客服名称', trigger: 'change' }
        ],
        expirationDate: [
          { required: true, message: '请选择过期时间', trigger: 'change' }
        ],
        userId: [{ required: true, message: '请选择人员', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      }
    }
  },
  watch: {
    'config.visible'(val) {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      if (val) {
        if (this.config.type === 1) {
          this.form = {
            customerName: '',
            expirationDate: '',
            userId: '',
            userName: ''
          }
        } else {
          this.form = JSON.parse(JSON.stringify(this.config.row))
        }
      }
    }
  },
  created() {},
  mounted() {
    this.top = Math.abs(window.innerHeight - 318) / 2 + 'px'
  },
  methods: {
    sure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.config.type === 1 ? this.onAdd() : this.onEdit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onAdd() {
      this.loading = true
      const data = {
        customerName: this.form.customerName,
        expirationDate: this.form.expirationDate,
        userId: this.form.userId
      }
      addCustomer(data)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    onEdit() {
      this.loading = true
      const data = {
        customerName: this.form.customerName,
        expirationDate: this.form.expirationDate,
        userId: this.form.userId
      }
      editCustomer(data)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击选择人员
    onhandleChange() {
      const checkUser = []
      if (this.form.userId) {
        checkUser.push({
          userId: this.form.userId,
          userName: this.form.userName
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        minlength: 1,
        type: [1],
        checkUser: checkUser,
        success: res => {
          console.log(res)
          if (res && res.user.length > 0) {
            this.form.userId = res.user[0].userId
            this.form.userName = res.user[0].userName
          }
        }
      })
    },
    close() {
      this.form.userId = ''
      this.form.userName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.addCustomerDialog {
  height: 200px;
  padding: 20px;
  box-sizing: border-box;
  .alertTips {
    background: #fff2e6;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #ff7d00;
    line-height: 22px;
    margin-bottom: 27px;
  }
  .formView {
    display: flex;
    margin-bottom: 20px;
    .formViewLabel {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
    .formViewValue {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 20px;
    }
  }
}
.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  font-weight: 500;
}
.tips {
  margin-top: 8px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}

::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 90px;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    font-weight: normal;
  }
}
.upload {
  width: 540px;
  display: flex;
  flex-wrap: wrap;
  .uploadView {
    width: 160px;
    height: 90px;
    background: #fbfcfe;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
      margin-top: 12px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .tips {
    margin-top: 5px;
    margin-left: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.el-icon-plus {
  font-weight: 700;
  font-size: 14px;
  color: #333333;
}

.myInput {
  width: 532px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer !important;
  background-color: #fff !important;
  border: 1px solid #d8dce6;
  border-radius: 4px;
  height: 32px;
  padding: 0 10px;
  color: #606266;
  display: flex;
}
.m-l-5 {
  margin-left: 5px;
}
</style>
