<template>
  <div v-loading="loading" class="goodsAddUser" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <div v-if="visible" class="form">
      <el-radio-group v-model="addtype" @change="addTypeChange">
        <el-radio-button :label="1">新用户</el-radio-button>
        <el-radio-button :label="2">已存在用户</el-radio-button>
      </el-radio-group>

      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <div v-if="addtype === 1">
          <div class="m-t-20">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="#"
              :limit="1"
              accept=".xlsx"
              :http-request="importStudent"
              :show-file-list="false"
            >
              <el-button slot="trigger" v-permission="['user:import', permsList]" size="small" type="primary" class="m-r-20">导入</el-button>
              <el-button :loading="downBtnLoading" @click="downLoadStudent">下载模板</el-button>
            </el-upload>

          </div>
          <div class="tips m-t-10">必须按照模版进行导入,单个模版不超5000个,新用户会自动创建账号</div>

          <el-form-item label="手机号码" prop="phoneList">
            <el-tag
              v-for="(tag, index) in form.phoneList"
              :key="index"
              closable
              :disable-transitions="false"
              class="m-r-10 m-b-10"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible && form.phoneList.length < 5000"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag w-120"
              size="small"
              maxlength="11"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputBlur"
            />
            <el-button v-if="!inputVisible && form.phoneList.length < 5000" size="small" class="button-new-tag" @click="showInput">+ 添加</el-button>
          </el-form-item>

          <el-form-item label="加入类型" prop="joinType">
            <el-select v-model="form.joinType" placeholder="请选择">
              <!-- <el-option label="抖店" :value="1" />
              <el-option label="快手" :value="2" />
              <el-option label="微店" :value="4" /> -->
              <el-option
                v-for="item in thirdShopType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />

              <el-option label="赠送" :value="3" />
              <el-option label="老用户(不发送短信)" :value="5" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addtype === 2">
          <selectUser :out-goods-id="outGoodsId" @handleSelectionChange="handleSelectionChange" />
        </div>
        <el-radio-group v-model="form.validity">
          <el-form-item label="有效期" prop="time1">
            <el-radio :label="0" style="width: 100%">
              <el-input v-model="form.time1" :min="1" type="number" class="w-120 m-b-20" :disabled="form.validity === 1" />
              <span class="m-l-10">天</span>
              <span class="m-l-10 tips">提交当天算起</span>
            </el-radio>
          </el-form-item>
          <el-form-item prop="time2">
            <el-radio :label="1" style="width: 100%">
              <el-date-picker v-model="form.time2" :disabled="form.validity === 0" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-radio>
          </el-form-item>
        </el-radio-group>
        <el-form-item v-if="goodsType && goodsType === '6'" label="期数" prop="periodId">
          <el-tag v-if="form.periodId" closable @close="clearPeriod">{{ form.periodNum }}期</el-tag>
          <el-button v-else size="mini" @click="periodChange">选择</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="close()">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="send()"
      >提交</el-button>
    </div>

  </div>
</template>

<script>
import selectUser from './selectUser.vue'
import { downLoadStudent, studentImport } from '@/api/user/member'
import { mapGetters } from 'vuex'
export default {
  components: {
    selectUser
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean,
      default: false
    },
    outGoodsId: {
      type: String,
      default: ''
    },
    goodsType: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkTime1 = (rule, value, callback) => {
      if (this.form.validity === 0 && value < 1) {
        this.$refs.ruleForm.validateField('time2')
        this.$message.error('请输入有效期')
        return callback(new Error('请输入有效期'))
      } else {
        callback()
      }
    }
    var checkTime2 = (rule, value, callback) => {
      if (this.form.validity === 1 && !value) {
        this.$refs.ruleForm.validateField('time1')
        this.$message.error('请输入有效期')
        return callback(new Error('请输入有效期'))
      } else {
        callback()
      }
    }
    return {
      addtype: 1,
      selectType: 1,
      validity: 0,
      time1: '',
      time2: '',
      // loading: false,
      joinType: 1,
      inputVisible: false,
      inputValue: '',
      downBtnLoading: false,
      form: {
        phoneList: [],
        time1: '',
        time2: '',
        validity: 0,
        selectType: 1,
        joinType: 1,
        periodId: '',
        periodNum: ''
      },
      rules: {
        phoneList: [
          { type: 'array', required: true, message: '请至少添加一个手机号', trigger: 'blur' }
        ],
        joinType: [
          { required: true, message: '请选择加入类型', trigger: 'change' }
        ],
        time1: [
          { required: true, validator: checkTime1, trigger: 'blur' }
        ],
        time2: [
          { validator: checkTime2, trigger: 'blur' }
        ],
        periodId: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ]
      },
      permsList: this.$route.meta.permsList || [],
      uploadDialog: {
        visible: false,
        data: []
      }
    }
  },
  computed: {
    ...mapGetters(['thirdShopType'])
  },
  methods: {
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        if (!/^[0-9]{11}$/.test(inputValue)) { // 号码格式不正确
          this.$message.error('请填写正确手机号码!')
          return console.log('请填写正确手机号码!')
        }
        this.form.phoneList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.showInput()
    },
    handleInputBlur() {
      const inputValue = this.inputValue
      if (inputValue) {
        if (!/^[0-9]{11}$/.test(inputValue)) { // 号码格式不正确
          this.$message.error('请填写正确手机号码!')
          this.inputVisible = false
          this.inputValue = ''
          return console.log('请填写正确手机号码!')
        }
        this.form.phoneList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose(tag) {
      this.form.phoneList.splice(this.form.phoneList.indexOf(tag), 1)
    },
    // 下载模板
    downLoadStudent() {
      this.downBtnLoading = true
      downLoadStudent().then(res => {
        this.downBtnLoading = false
        window.location = res.data
      }).catch(() => {
        this.downBtnLoading = false
      })
    },
    // 导入模板
    importStudent(e) {
      const selectFile = e.file
      console.log(e)
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      studentImport(formData).then(res => {
        console.log(res)
        this.$refs.upload.clearFiles()
        this.form.phoneList = this.form.phoneList.concat(res.data)
      }).catch((err) => {
        console.log(err, 'err')
        this.$refs.upload.clearFiles()
      })
    },

    // 点击提交
    send() {
      if (this.addtype === 2 && this.form.phoneList.length === 0) {
        return this.$message.error('请选择用户')
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let effectiveTime = ''
          let failureTime = ''
          if (this.form.time1) {
            failureTime = new Date(new Date().getTime() + Number(this.form.time1) * 24 * 60 * 60 * 1000).getTime()
          }
          if (this.form.time2) {
            effectiveTime = new Date(this.form.time2[0]).getTime()
            failureTime = new Date(this.form.time2[1]).getTime()
          }
          const data = {
            effectiveTime,
            failureTime,
            phones: this.form.phoneList,
            type: this.addtype === 2 ? 3 : this.form.joinType
            // periodId: this.form.periodId
          }
          console.log(data)
          // this.clear()
          this.$emit('success', data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清空表单
    clear() {
      this.addtype = 1
      this.form = {
        phoneList: [],
        time1: '',
        time2: '',
        validity: 0,
        selectType: 1,
        joinType: 1
      }
    },
    close() {
      this.clear()
      this.$emit('close')
    },
    // 已有用户选中触发
    handleSelectionChange(res) {
      const phoneList = []
      res.map(v => {
        v.phone && phoneList.push(v.phone)
      })
      this.form.phoneList = phoneList
    },
    // 新用户已有用户切换触发
    addTypeChange() {
      this.form = {
        phoneList: [],
        time1: '',
        time2: '',
        validity: 0,
        selectType: 1,
        joinType: 1
      }
    },
    // 清空选择的期数
    clearPeriod() {
      this.form.periodId = ''
      this.form.periodNum = ''
    },
    // 选择期数
    periodChange() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.outGoodsId },
        success: (res) => {
          console.log(res, 'res')
          this.$set(this.form, 'periodId', res.id)
          this.$set(this.form, 'periodNum', res.periodNum)
          // this.form.periodId = res.id
          // this.form.periodNum = res.periodNum
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 20px 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}
.form_el {
  display: flex;
  margin-top: 20px;
  .form_label {
    width: 80px;
    min-width: 80px;
    line-height: 36px;
    margin-right: 10px;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .form_value {
    // display: flex;
    // flex-wrap: wrap;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.my_table {
  width: 600px;
  display: flex;
  flex-wrap: wrap;
  // border-top: 1px solid #dfe6ec;
  // border-left: 1px solid #dfe6ec;
  .my_table_item {
    // border-bottom: 1px solid #dfe6ec;
    // border-right: 1px solid #dfe6ec;
    width: 25%;
    height: 40px;
  }
}
</style>
