<template>
  <formPage title="合同档案" sub-title="编辑合同" @click="$router.push('/teacherCenter/contractFile/list')">
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="IP姓名" prop="teacherName">
          <el-input v-model="form.teacherName" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          {{ form.contractType | getOptionsValue(CONTRACT_TYPE) }}
        </el-form-item>
        <el-form-item label="合同主体" prop="subjectId">
          <el-select v-model="form.subjectId" style="width: 380px">
            <el-option
              v-for="item in CompanyList"
              :key="item.subjectId"
              :label="item.contractSubject"
              :value="item.subjectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="form.contractName" style="width: 224px" />
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="甲方单位名称" prop="companyPartOne">
              <el-autocomplete
                v-model="form.companyPartOne"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                style="width: 380px"
                :maxlength="20"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方经办人" prop="companyPartOneOperator">
              <el-input v-model="form.companyPartOneOperator" style="width: 224px" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="乙方单位名称" prop="companyPartTwo">
              <el-autocomplete
                v-model="form.companyPartTwo"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                style="width: 380px"
                :maxlength="20"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方经办人" prop="companyPartTwoOperator">
              <el-input v-model="form.companyPartTwoOperator" style="width: 224px" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="丙方单位名称" prop="companyPartThree">
              <el-input v-model="form.companyPartThree" style="width: 380px" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="丙方经办人" prop="companyPartThreeOperator">
              <el-input v-model="form.companyPartThreeOperator" style="width: 224px" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="合作方式" prop="contractCategory">
          <el-radio-group v-model="form.contractCategory">
            <el-radio v-for="(item, index) in CONTRACT_CATEGORY" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="单位合作模式" prop="cooperativeSharingModel">
          <el-input
            v-model="form.cooperativeSharingModel"
            style="width: 888px"
            type="textarea"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 3 }"
          />
        </el-form-item>

        <el-form-item label="IP联系方式" prop="teacherPhoneNumber">
          <el-input v-model="form.teacherPhoneNumber" style="width: 224px" maxlength="11" />
        </el-form-item>

        <el-form-item label="IP身份证号" prop="teacherIdentityNumber">
          <el-input v-model="form.teacherIdentityNumber" style="width: 224px" maxlength="18" />
        </el-form-item>

        <el-form-item label="合同开始日期" prop="contractStartTime">
          <el-date-picker
            v-model="form.contractStartTime"
            style="width: 224px"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerStartTimeOptions"
            @change="contractStartTimeChange"
          />
        </el-form-item>

        <el-form-item label="合同到期日期" prop="contractEndTime">
          <el-date-picker
            v-model="form.contractEndTime"
            style="width: 224px"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerEndTimeOptions"
            @change="contractEndTimeChange"
          />
        </el-form-item>

        <el-form-item label="合同年限" prop="contractExpirationTime">
          <el-input
            v-model="form.contractExpirationTime"
            type="number"
            style="width: 120px"
            :min="0"
            class="m-r-8"
            :disabled="true"
          />月
        </el-form-item>

        <el-form-item label="结算周期" prop="settlementInterval">
          <el-radio-group v-model="form.settlementInterval">
            <el-radio v-for="(item, index) in SETTLEMENT_INTERVAL" :key="index" :label="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-row>
          <el-form-item label="合同电子附件" prop="teacherContractMediaList">
            <!-- 电子附件 -->
            <upload ref="upload" style="width: 717px" :max-show-length="4" @change="fileChange" />
            <div class="tips">注：图片文件jpg,png格式 大小限10M以内，PDF文件50M以内</div>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button :loading="loading" size="small" type="primary" @click="checkForm()">保存</el-button>
      <el-button :loading="loading" size="small" plain @click="goBack">取消</el-button>
    </div>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { CONTRACT_TYPE, SETTLEMENT_INTERVAL, CONTRACT_CATEGORY, CONTRACT_STATE } from '../enum'
import { getTeacherContractDetail, teacherContarctUpdate, getCompanyList } from '@/api/tearchCenter'
import upload from '../components/upload.vue'
export default {
  components: {
    formPage,
    upload
  },
  data() {
    return {
      pickerStartTimeOptions: {
        disabledDate: (time) => {
          return this.pickerStartTime(time)
        }
      },
      pickerEndTimeOptions: {
        disabledDate: (time) => {
          return this.pickerEndTime(time)
        }
      },
      selectLoading: false,
      CONTRACT_TYPE,
      SETTLEMENT_INTERVAL,
      CONTRACT_CATEGORY,
      CONTRACT_STATE,
      form: {
        companyPartOne: '', // 甲方单位名称
        companyPartOneOperator: '', // 甲方经办人
        companyPartThree: '', // 丙方单位名称
        companyPartThreeOperator: '', // 丙方经办人
        companyPartTwo: '', // 乙方单位名称
        companyPartTwoOperator: '', // 乙方经办人
        contractCategory: 0, // 合同类别 0[IP流量+课程类] 1[IP流量类] 2[课程合作类]
        contractCode: '', // 合同编码
        contractEndTime: '', // 合同到期日期
        contractExpirationTime: '', // 合同年限 单位月
        contractName: '', // 合同名称
        contractStartTime: '', // 合同开始日期
        contractState: 0, // 合同状态 0[未合作] 1[已合作] 2[合作到期] 4[合作解除]
        subjectId: '', // 合同主体
        contractType: 0, // 0新签 1续签
        cooperativeSharingModel: '', // 单位合作模式
        settlementInterval: 0, // 结算同期 0月结 1季结 2年结
        teacherIDNumber: '', // 老师身份证号
        teacherId: '', // 老师ID
        teacherName: '', // 老师姓名
        teacherPhoneNumber: '', // 老师联系方式
        teacherContractMediaList: [] // 合同附件
      },
      rules: {
        teacherName: [{ required: true, message: '请选择老师姓名', trigger: 'blur' }],
        contractType: [{ required: true, message: '合同类型', trigger: 'blur' }],
        subjectId: [{ required: true, message: '请选择合同主体', trigger: 'blur' }],
        contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        companyPartOne: [{ required: true, message: '请输入甲方单位名称', trigger: 'blur' }],
        companyPartOneOperator: [{ required: true, message: '请输入甲方经办人', trigger: 'blur' }],
        companyPartTwo: [{ required: true, message: '请输入乙方单位名称', trigger: 'blur' }],
        companyPartTwoOperator: [{ required: true, message: '请输入乙方经办人', trigger: 'blur' }],
        contractCategory: [{ required: true, message: '请选择合作方式', trigger: 'blur' }],
        teacherPhoneNumber: [{ required: true, message: '请输入老师联系方式', trigger: 'blur' }],
        teacherIdentityNumber: [{ required: true, message: '请输入老师身份证号', trigger: 'blur' }],
        contractStartTime: [{ required: true, message: '请输入合同开始日期', trigger: 'blur' }],
        contractEndTime: [{ required: true, message: '请输入合同到期日期', trigger: 'blur' }],
        contractExpirationTime: [{ required: true, message: '请输入合同年限', trigger: 'blur' }],
        settlementInterval: [{ required: true, message: '请输入结算周期', trigger: 'blur' }]
      },
      loading: false,
      CompanyList: [] // 合同主体列表
    }
  },
  async activated() {
    await this.getCompanyList()
    this.getDetail()
  },
  async mounted() {
    await this.getCompanyList()
    this.getDetail()
  },
  methods: {
    // 点击返回
    goBack() {
      if (this.$refs.upload.getUploadFile()) {
        return this.$message.error('还有文件在上传哦~')
      }
      this.$router.back()
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        contractCode: this.$route.params.id
      }
      getTeacherContractDetail(params)
        .then((res) => {
          console.log(res)
          this.loading = false
          const fileList = []
          res.data.teacherContractMediaList.map((v) => {
            fileList.push({
              file: '',
              name: '',
              status: 3,
              authProgress: 0,
              photoUrl: v.fileUrl,
              source: null
            })
          })
          this.$refs.upload.setFileList(fileList)
          this.form = {
            ...res.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 文件改变触发
    fileChange(fileList) {
      const teacherContractMediaList = []
      fileList.map((v) => {
        teacherContractMediaList.push({
          fileType: 1,
          fileUrl: v.photoUrl,
          isHave: true
        })
      })
      this.form.teacherContractMediaList = teacherContractMediaList
      this.$refs.form.validateField('teacherContractMediaList')
    },
    // 点击保存核对表单
    checkForm() {
      if (this.$refs.upload.getUploadFile()) {
        return this.$message.error('还有文件在上传哦~')
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击保存
    save() {
      console.log(this.form, 'form')
      let subjectName = ''
      const obj = this.CompanyList.find((v) => v.subjectId === this.form.subjectId)
      obj && (subjectName = obj.contractSubject)
      if (!(this.form.companyPartOne === subjectName || this.form.companyPartTwo === subjectName)) {
        return this.$message.error('甲方或乙方单位名称中必须有一方包含合同主体')
      }
      const teacherContractMediaList = []
      if (this.form.teacherContractMediaList.length > 0) {
        const obj = {
          '.jpg': 0,
          '.png': 1,
          '.pdf': 2
        }
        this.form.teacherContractMediaList.map((v) => {
          teacherContractMediaList.push({
            contractCode: this.$route.params.id,
            fileType: obj[v.fileUrl.match(/.[^.]+$/)[0].toLowerCase()],
            fileUrl: v.fileUrl,
            haveTerminate: 0
          })
        })
      }
      const data = {
        companyPartOne: this.form.companyPartOne,
        companyPartTwo: this.form.companyPartTwo,
        contractCode: this.$route.params.id,
        companyPartOneOperator: this.form.companyPartOneOperator,
        companyPartThree: this.form.companyPartThree,
        companyPartThreeOperator: this.form.companyPartThreeOperator,
        companyPartTwoOperator: this.form.companyPartTwoOperator,
        contractCategory: this.form.contractCategory,
        contractEndTime: this.form.contractEndTime,
        contractExpirationTime: this.form.contractExpirationTime,
        contractName: this.form.contractName,
        contractStartTime: this.form.contractStartTime,
        contractState: this.form.contractState,
        contractType: this.form.contractType,
        cooperativeSharingModel: this.form.cooperativeSharingModel,
        have: this.form.teacherContractMediaList.length > 0,
        settlementInterval: this.form.settlementInterval,
        subjectId: this.form.subjectId,
        teacherContractMediaList: teacherContractMediaList,
        teacherId: this.form.teacherId,
        teacherIdentityNumber: this.form.teacherIdentityNumber,
        teacherName: this.form.teacherName,
        teacherPhoneNumber: this.form.teacherPhoneNumber
      }
      this.loading = true
      teacherContarctUpdate(data)
        .then((res) => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$router.back()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取合同主体
    getCompanyList() {
      this.loading = true
      getCompanyList()
        .then((res) => {
          console.log(res, '公司合同主体')
          this.CompanyList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 合同到期日期改变触发
    contractEndTimeChange(val) {
      if (!this.form.contractStartTime) {
        this.form.contractExpirationTime = ''
        return
      }
      if (!val) {
        this.form.contractExpirationTime = ''
        return
      }
      const time = new Date(this.form.contractEndTime).getTime() - new Date(this.form.contractStartTime).getTime()
      this.form.contractExpirationTime = parseInt(time / 1000 / 60 / 60 / 24 / 30)
      this.$refs.form.clearValidate('contractExpirationTime')
    },
    // 合同开始日期改变触发
    contractStartTimeChange(val) {
      if (!this.form.contractEndTime) {
        this.form.contractExpirationTime = ''
        return
      }
      if (!val) {
        this.form.contractExpirationTime = ''
        return
      }
      const time = new Date(this.form.contractEndTime).getTime() - new Date(this.form.contractStartTime).getTime()
      console.log(time)
      this.form.contractExpirationTime = parseInt(time / 1000 / 60 / 60 / 24 / 30)
      this.$refs.form.clearValidate('contractExpirationTime')
    },
    // 合同时间处理
    pickerStartTime(time) {
      if (!this.form.contractEndTime) {
        return false
      } else {
        return time.getTime() > new Date(this.form.contractEndTime).getTime()
      }
    },
    pickerEndTime(time) {
      if (!this.form.contractStartTime) {
        return false
      } else {
        return time.getTime() < new Date(this.form.contractStartTime).getTime()
      }
    },
    querySearch(queryString, cb) {
      this.CompanyList.forEach((v) => {
        v.value = v.contractSubject
      })
      var restaurants = this.CompanyList
      console.log(restaurants.filter(this.createFilter(queryString)), '123')
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
      }
    },
    handleSelect() {
      this.$refs.form.clearValidate('companyPartOne')
      this.$refs.form.clearValidate('companyPartTwo')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 19px;
}
.footer {
  margin-top: 56px;
  text-align: center;
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
