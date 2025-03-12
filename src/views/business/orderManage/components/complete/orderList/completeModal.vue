<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">订单补齐</p>
      </div>
      <div class="add-group-center">
        <el-form
          v-if="isBuji"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm account-group-block"
        >
          <el-form-item label="店铺名" class="posi-relative">
            <p>{{ row.shopName }}</p>
          </el-form-item>
          <el-form-item label="渠道" class="posi-relative">
            <p>{{ row.channelSourceName }}</p>
          </el-form-item>
          <el-form-item label="订单号" class="posi-relative">
            <p>{{ row.orderId }}</p>
          </el-form-item>
          <el-form-item label="用户姓名" prop="userName">
            <el-input
              v-model="ruleForm.userName"
              size="mini"
              class="w-300"
              maxlength="30"
              placeholder="请输入用户姓名"
            />
          </el-form-item>
          <el-form-item label="用户账号" required>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <el-input
                v-model="ruleForm.phone"
                size="small"
                style="width: 270px"
                clearable
                placeholder="请输入用户手机号"
                :maxlength="phoneMaxlength(ruleForm.phoneAreaCode)"
                @input="e => delNoNumber(e, 'phone')"
              >
                <el-select
                  slot="prepend"
                  v-model="ruleForm.phoneAreaCode"
                  placeholder="请选择"
                  filterable
                  style="width: 100px"
                >
                  <el-option-group
                    v-for="group in smsAreaList"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.areaCode"
                      :label="`+${item.areaCode} ${item.areaChineseName}`"
                      :value="item.areaCode"
                    >
                      <span style="float: left">{{
                        item.areaChineseName
                      }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                      >+{{ item.areaCode }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-input>
              <el-input
                v-model="ruleForm.email"
                size="small"
                placeholder="请输入用户邮箱"
                style="width: 270px"
                clearable
              />
            </div>
          </el-form-item>
        </el-form>
        <!-- <div v-else class="mess-content">
          <el-form
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-form-inline"
          >
            <el-row>
              <el-form-item label="订单号：" class="from-line-ban">
                <span>{{ row.orderId }}</span>
              </el-form-item>
              <el-form-item label="买家姓名：" class="from-line-ban">
                <span>{{ ruleForm.userName }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="渠道：" class="from-line-ban">
                <span>{{ row.channelSourceName }}</span>
              </el-form-item>
              <el-form-item label="买家手机号：" class="from-line-ban">
                <span
                  v-if="ruleForm.phoneAreaCode && ruleForm.phone"
                >+{{ ruleForm.phoneAreaCode }}</span>&nbsp;
                <span>{{ ruleForm.phone }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="买家邮箱：" class="from-line-ban">
                <span>{{ ruleForm.email }}</span>
              </el-form-item>
              <el-form-item label="店铺：" class="from-line-ban">
                <span>{{ row.shopName }}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </div> -->
        <div v-if="isBuji" class="tips-block">
          <i class="el-icon-warning" />
          <span>
            <p class="title">注意</p>
            <p>
              请正确填写订单归属客户的姓名、手机号信息，否则将影响用户看课权限。
            </p>
          </span>
        </div>

        <!-- <div v-else class="tips-block">
          <i class="el-icon-warning" />
          <span>
            <p class="title">注意</p>
            <p>请仔细核对清楚输入内容，确保填写的用户信息姓名和手机号正确！</p>
          </span>
        </div> -->
      </div>
      <span v-if="isBuji" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addGrounpBtn('ruleForm')"
        >补齐信息</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
      <!-- <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBtn">确认</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import { checkOrderComplement, submitComplement } from '@/api/business'
import { mapGetters } from 'vuex'
export default {
  name: 'AddAccount',
  components: {},
  props: {},
  data() {
    var checkOrderId = (rule, value, callback) => {
      if (this.row.orderId !== value) {
        this.errorTips = true
        callback(new Error('输入订单是否与选择订单的第三方订单号不一致。!'))
      } else {
        this.canJiaoyan = false
        callback()
      }
    }
    return {
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
        phoneAreaCode: '86',
        email: ''
      },
      errorTip: '',
      rules: {
        orderId: [
          {
            required: true,
            message: '请输入第三方订单号进行校验',
            trigger: 'blur'
          },
          { validator: checkOrderId, trigger: 'change', required: true }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.ruleForm.email) {
                callback(new Error('手机号和邮箱至少填写一个'))
              } else if (value) {
                const verifyPhone = this.verifyPhone(
                  value,
                  this.ruleForm.phoneAreaCode
                )
                if (!verifyPhone) {
                  callback(new Error('请输入正确的手机号码'))
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.ruleForm.phone) {
                callback(new Error('手机号和邮箱至少填写一个'))
              } else if (value) {
                const emailRegex =
                  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|cn|net|org|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum|co\.jp|co\.uk|co\.nz|com\.au|com\.tw|com\.hk)$/
                if (!emailRegex.test(value)) {
                  callback(new Error('请输入正确的邮箱格式'))
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['smsAreaList', 'channelSourceType'])
  },
  watch: {
    'ruleForm.phone': {
      handler(val) {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.validateField('email')
        }
      }
    }
  },
  created() {},
  mounted() {
    this.row.channelSourceName = this.returnChannelName(this.row.channelSource)
  },
  methods: {
    verifyMaxPhone(code) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const data = smsAreaList.find(item => item.areaCode === code)
      return data
    },
    delNoNumber(e, key) {
      this.ruleForm[key] = e.replace(/\D/g, '')
    },
    phoneMaxlength(code) {
      const maxObj = this.verifyMaxPhone(code)
      return maxObj?.length || 15
    },
    returnChannelName(value) {
      let str = ''
      this.channelSourceType.some(item => {
        if (item.value === value) {
          str = item.label
        }
      })
      return str
    },
    toCheckOrder() {
      const params = {
        orderId: this.row.orderId,
        orderNo: this.ruleForm.orderId
      }
      checkOrderComplement(params).then(res => {
        if (res.code === 1 && res.data === null) {
          this.canJiaoyan = true
          this.canComplete = true
        } else {
          this.canComplete = false
          this.errorTips = false
          this.errorTip = res.data
        }
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
        orderId: this.row.orderId,
        postReceiver: this.ruleForm.userName,
        postTel: this.ruleForm.phone,
        phoneAreaCode: this.ruleForm.phone ? this.ruleForm.phoneAreaCode : '',
        email: this.ruleForm.email
      }
      submitComplement(params).then(res => {
        if (res.code === 1 && res.data === null) {
          this.$message.success('订单补齐成功！')
          this.addAccountFlag = false
          this.isBuji = true
          this.$emit('formLastLoadData')
          this.ruleForm = {
            orderId: '',
            userName: '',
            phone: '',
            phoneAreaCode: '86',
            email: ''
          }
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
            this.$refs.ruleForm.clearValidate()
          }
        } else {
          this.$message.error(res.data)
          this.addAccountFlag = false
          this.isBuji = true
          this.$emit('formLastLoadData')
          this.ruleForm = {
            orderId: '',
            userName: '',
            phone: '',
            phoneAreaCode: '86',
            email: ''
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
        phoneAreaCode: '86',
        email: ''
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
        this.$refs.ruleForm.clearValidate()
      }
    },
    verifyPhone(phone, areaCode) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const isRegex = smsAreaList.find(
        item => item.areaCode === areaCode
      )?.regex
      if (!isRegex) return true
      return new RegExp(isRegex).test(phone)
    },
    addGrounpBtn(ruleForm) {
      this.canJiaoyan = true
      this.canComplete = true

      // 如果没有填写手机号，才检查邮箱相关信息
      if (!this.ruleForm.phone) {
        if (!this.ruleForm.email) {
          return this.$message.warning('手机号和邮箱至少填写一个！')
        }
        const emailRegex =
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|cn|net|org|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum|co\.jp|co\.uk|co\.nz|com\.au|com\.tw|com\.hk)$/
        if (!emailRegex.test(this.ruleForm.email)) {
          return this.$message.warning('请输入正确的邮箱格式！')
        }
      }

      // 如果没有填写邮箱，才检查手机号相关信息
      if (!this.ruleForm.email) {
        if (!this.ruleForm.phoneAreaCode) {
          return this.$message.warning('请选择国际区号！')
        }

        const verifyPhone = this.verifyPhone(
          this.ruleForm.phone,
          this.ruleForm.phoneAreaCode
        )
        if (!verifyPhone) return this.$message.warning('请输入完整的手机号!')
      }

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
    margin-top: 20px;
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

.from-line-ban {
  width: 50%;
  float: left;
}

.posi-relative {
  position: relative;
}
.add-group-center p.tips-reds {
  font-size: 12px;
  color: #ff4949;
  position: absolute;
  bottom: -25px;
}
</style>
