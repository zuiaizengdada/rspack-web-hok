<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">订单转让</p>
      </div>
      <div class="add-group-center">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm account-group-block"
        >
          <el-form-item label="转让须知">
            <p>
              1.订单转让要求：只支持线下扫码录单并且订单已全额付款，未产生退款。
            </p>
            <p>2.单个订单只支持转让一次，请谨慎转让。</p>
          </el-form-item>
          <el-form-item label="订单接收人" prop="userName">
            <el-select
              v-model="ruleForm.userName"
              style="font-size: 14px"
              class="select-teacher"
              filterable
              clearable
              remote
              :remote-method="queryByName"
              :popper-append-to-body="false"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.userId"
                :disabled="item.status > 0"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addGrounpBtn('ruleForm')"
        >确认转让</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span></el-dialog>
  </div>
</template>
<script>
import { transferQrcode, searchUser } from '@/api/business'
export default {
  name: 'AddAccount',
  components: {},
  props: {},
  data() {
    return {
      options: [],
      isBuji: true,
      row: {},
      canJiaoyan: false,
      canComplete: false,
      addAccountFlag: false,
      errorTips: true,
      type: 'add',
      groundId: '',
      ruleForm: {
        orderId: '',
        userName: '',
        phone: '',
        phoneAreaCode: '86'
      },
      errorTip: '',
      rules: {
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            required: true,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    queryByName(query) {
      if (query === '') {
        this.options = []
      }
      searchUser({ searchKeyword: query }).then(res => {
        this.options = res.data.map(i => ({
          ...i,
          text: `${i.userName}(${i.phoneNumber})${i.deptChainName}`
        }))
      })
    },
    show(e) {
      this.row = e
      if (this.$refs.ruleForm) {
        this.ruleForm = {
          orderId: '',
          userName: '',
          phone: '',
          phoneAreaCode: '86'
        }
        this.$refs.ruleForm.resetFields()
        this.$refs.ruleForm.clearValidate()
      }
      this.errorTips = true
      this.isBuji = true
      this.addAccountFlag = true
      this.canJiaoyan = false
      this.canComplete = false
    },
    submitBtn() {
      const params = {
        qrcodeOrderNo: this.row.qrcodeOrderNo,
        newEnrollmentTeacherId: this.ruleForm.userName
      }
      transferQrcode(params).then(res => {
        if (res.code === 1) {
          this.$message.success('订单转让成功！')
          this.addAccountFlag = false
          this.$emit('formLastLoadData')
          this.ruleForm = {
            orderId: '',
            userName: '',
            phone: '',
            phoneAreaCode: '86'
          }
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
            this.$refs.ruleForm.clearValidate()
          }
        } else {
          this.$message.error(res.message)
          this.$emit('formLastLoadData')
          this.ruleForm = {
            orderId: '',
            userName: '',
            phone: '',
            phoneAreaCode: '86'
          }
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
            this.$refs.ruleForm.clearValidate()
          }
        }
      })
    },
    handleClose() {
      this.addAccountFlag = false
      this.ruleForm = {
        orderId: '',
        userName: '',
        phone: '',
        phoneAreaCode: '86'
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
        this.$refs.ruleForm.clearValidate()
      }
    },
    addGrounpBtn(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.submitBtn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

  <style scoped lang="scss">
.add_account_page {
  width: 100%;
  height: 100%;
  position: absolute;
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
  }
  .p-title {
    font-size: 16px;
  }
  .plat_array_content {
    width: 100%;
    height: 280px;
    .plat_content {
      float: left;
      margin-right: 54px;
      width: 64px;
      height: 64px;
      cursor: pointer;
      img {
        width: 64px;
        height: 64px;
      }
      p {
        font-size: 16px;
        line-height: 30px;
        height: 30px;
        width: 100%;
        text-align: center;
        color: #333;
        float: left;
        margin-top: 5px;
      }
    }
  }
}
.add-group-center {
  p {
    font-size: 14px;
    color: #777;
  }
  .demo-ruleForm {
    margin-top: 10px;
  }
  .w-300 {
    width: 230px;
  }
  .w-100 {
    width: 100px;
  }
}
.tips-span {
  margin-left: 10px;
  font-size: 12px;
  color: #0c6fff;
}
.btn-cls {
  margin-left: 10px;
}

.tips-block {
  width: 100%;
  padding: 20px;
  background: #f7f8f9;
  border-radius: 8px;
  margin-bottom: 20px;
  i {
    float: left;
    font-size: 22px;
    margin-right: 15px;
    margin-top: 3px;
    color: #f18649;
  }
  span {
    width: 500px;
    display: inline-block;
    .title {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
}

.goods-img-info {
  display: flex;
  align-items: center;
  .goods-img {
    width: 64px;
    height: 64px;
    min-width: 64px;
    background: #eee;
    margin-right: 10px;
  }
}
.from-line-ban {
  width: 50%;
  float: left;
}
.add-group-center p.tips-reds {
  font-size: 12px;
  color: #ff4949;
  position: absolute;
  bottom: -25px;
}
</style>
