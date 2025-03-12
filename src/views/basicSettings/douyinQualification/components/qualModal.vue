<template>
  <AppDialog
    v-model="visible"
    title="补充资质"
    width="618px"
    height="580px"
    top="10vh"
    :loading="loading"
    @success="send"
  >
    <div v-if="visible" class="payChannelDialog overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="机构名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入机构名称"
            maxlength="30"
            clearable
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="机构昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="请输入机构昵称"
            clearable
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="机构介绍" prop="institutionIntroduction">
          <el-input
            v-model="form.institutionIntroduction"
            placeholder="请输入机构相关介绍信息"
            type="textarea"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="机构场景类型" prop="institutionSceneType">
          <el-radio-group v-model="form.institutionSceneType">
            <el-radio label="线上机构" />
            <el-radio label="线下机构" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构主体类型" prop="institutionSubjectType">
          <el-radio-group v-model="form.institutionSubjectType">
            <el-radio label="企业工商户" />
            <el-radio label="个体工商户" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input
            v-model="form.companyName"
            placeholder="请输入企业名称"
            maxlength="30"
            clearable
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="机构备案名称" prop="institutionRecordName">
          <el-input
            v-model="form.institutionRecordName"
            placeholder="请输入机构备案名称"
            maxlength="30"
            clearable
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="执照有效期" prop="validityType">
          <el-radio-group v-model="form.validityType" @change="handleSelectChange">
            <el-radio :label="0" style="margin-right: 8px;">固定时间</el-radio>
            <el-date-picker
              v-model="form.validityDate"
              :disabled="form.validityType !== 0"
              value-format="yyyy-MM-dd"
              style="margin-right: 30px;"
              type="date"
              placeholder="选择执照有效期"
            />
            <el-radio :label="1">长期有效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执照编号" prop="licenseId">
          <el-input
            v-model="form.licenseId"
            clearable
            placeholder="请输入执照编号"
          />
        </el-form-item>
        <el-form-item label="法人姓名" prop="legalPersonName">
          <el-input
            v-model="form.legalPersonName"
            placeholder="请输入法人姓名"
            maxlength="10"
            clearable
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="法人身份证号码" prop="legalPersonIdNumber">
          <el-input
            v-model="form.legalPersonIdNumber"
            placeholder="请输入法人身份证号码"
            clearable
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { qualificationinfoAdd, qualificationinfoEdit } from '@/api/system/institution'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        name: '',
        nickname: '',
        institutionIntroduction: '',
        institutionSceneType: '',
        institutionSubjectType: '',
        companyName: '',
        institutionRecordName: '',
        validityType: '',
        validityDate: '',
        licenseId: '',
        legalPersonName: '',
        legalPersonIdNumber: ''
      },
      type: 1,
      visible: false,
      row: {},
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 2, message: '机构名称不能少于2个字' }
        ],
        nickname: [
          { required: true, message: '请输入机构昵称', trigger: 'blur' }
        ],
        institutionIntroduction: [
          { required: true, message: '请输入机构介绍', trigger: 'blur' },
          { min: 6, message: '机构介绍不能少于6个字' }
        ],
        institutionSceneType: [
          { required: true, message: '请选择机构场景类型', trigger: 'change' }
        ],
        institutionSubjectType: [
          { required: true, message: '请选择机构主体类型', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 2, message: '企业名称不能少于2个字' }
        ],
        institutionRecordName: [
          { required: true, message: '请输入机构备案名称', trigger: 'blur' },
          { min: 2, message: '机构备案名称不能少于2个字' }
        ],
        validityType: [
          { required: true, message: '请选择执照有效期', trigger: 'change' }
        ],
        licenseId: [
          { required: true, message: '请输入执照编号', trigger: 'change' }
        ],
        legalPersonName: [
          { required: true, message: '请输入法人姓名', trigger: 'change' },
          { min: 2, message: '法人姓名不能少于2个字' }
        ],
        legalPersonIdNumber: [
          { required: true, message: '请输入法人身份证号码', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  mounted() {},
  methods: {
    open(row, type) {
      this.reset()
      this.row = row
      if (type === 'edit') {
        const douQualificationInfoVos = (row.douQualificationInfoVos && row.douQualificationInfoVos[0]) ?? {}
        this.form = {
          ...row,
          licenseId: douQualificationInfoVos.licenseId,
          validityType: 0
        }
        if (douQualificationInfoVos.validityDate === '长期有效') {
          this.form.validityDate = ''
          this.form.validityType = 1
        }
      }
      this.type = type
      this.visible = true
    },
    handleSelectChange() {
      if (this.form.validityType === 1) {
        this.form.validityDate = ''
      }
    },
    reset() {
      this.form = {
        name: '',
        nickname: '',
        institutionIntroduction: '',
        institutionSceneType: '',
        institutionSubjectType: '',
        companyName: '',
        institutionRecordName: '',
        validityType: '',
        validityDate: '',
        licenseId: '',
        legalPersonName: '',
        legalPersonIdNumber: ''
      }
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.loading = true
      const douQualificationInfoVos = (this.row.douQualificationInfoVos && this.row.douQualificationInfoVos[0]) ?? {}
      const params = {
        ...this.row,
        ...this.form,
        legalPersonIdImgUris: JSON.parse(this.row.legalPersonIdImgUris),
        appId: this.row.appId,
        qualificationInfoLst: {
          ...douQualificationInfoVos,
          licenseId: this.form.licenseId,
          validityDate: this.form.validityType === 0 ? this.form.validityDate : '长期有效',
          type: 1
        },
        douQualificationInfoVos: undefined,
        id: undefined
      }
      qualificationinfoAdd(params)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    },
    edit() {
      this.loading = true
      const douQualificationInfoVos = (this.form.douQualificationInfoVos && this.form.douQualificationInfoVos[0]) ?? {}
      const params = {
        ...this.form,
        appId: this.row.appId,
        objectId: this.form.objectId,
        legalPersonIdImgUris: JSON.parse(this.row.legalPersonIdImgUris),
        qualificationInfoLst: {
          ...douQualificationInfoVos,
          licenseId: this.form.licenseId,
          validityDate: this.form.validityType === 0 ? this.form.validityDate : '长期有效',
          type: 1
        },
        douQualificationInfoVos: undefined
      }
      qualificationinfoEdit(params)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  padding: 16px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
</style>
