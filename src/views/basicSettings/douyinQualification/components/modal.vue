<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="694px"
    height="720px"
    top="5vh"
    :footer-text="['提 交','取 消']"
    :loading="loading"
    @success="send"
  >
    <div v-if="visible" class="payChannelDialog overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="小程序ID" prop="appId">
          <el-input v-model="form.appId" style="width: 296px" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="资质类型">
          机构
        </el-form-item>
        <el-form-item label="机构LOGO" prop="INSTITUTIONAL_LOGO_IMG">
          <upload
            ref="upload4"
            style="width: 420px"
            enum="INSTITUTIONAL_LOGO_IMG"
            @change="(res) => fileChange(res, 'INSTITUTIONAL_LOGO_IMG')"
          />
        </el-form-item>
        <el-form-item label="机构头图" prop="INSTITUTIONAL_SHOW_IMG">
          <upload
            ref="upload1"
            style="width: 420px"
            enum="INSTITUTIONAL_SHOW_IMG"
            @change="(res) => fileChange(res, 'INSTITUTIONAL_SHOW_IMG')"
          />
        </el-form-item>
        <el-form-item label="机构资质">
          营业资质
        </el-form-item>
        <el-form-item label="营业执照图片" prop="INSTITUTIONAL_QUALIFICATIONS_IMG">
          <upload
            ref="upload2"
            style="width: 420px"
            enum="INSTITUTIONAL_QUALIFICATIONS_IMG"
            @change="(res) => fileChange(res, 'INSTITUTIONAL_QUALIFICATIONS_IMG')"
          />
        </el-form-item>
        <el-form-item label="法人身份证照片" prop="INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG">
          <upload
            ref="upload3"
            :limit="2"
            enum="INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG"
            tips="注：jpg、jpeg 或png图片，大小限5M以内，正面、反面各一张图片。"
            style="width: 420px"
            @change="(res) => fileChange(res, 'INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG')"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '../components/upload.vue'
import { qualificationinfoAdd, qualificationinfoEdit } from '@/api/system/institution'
export default {
  components: {
    AppDialog,
    upload
  },
  data() {
    return {
      form: {
        appId: '',
        objectId: '',
        INSTITUTIONAL_LOGO_IMG: [],
        INSTITUTIONAL_SHOW_IMG: [],
        INSTITUTIONAL_QUALIFICATIONS_IMG: [],
        INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG: []
      },
      type: '',
      title: '上传资质',
      row: '',
      visible: false,
      rules: {
        INSTITUTIONAL_SHOW_IMG: [
          { type: 'array', required: true, message: '请上传机构头图', trigger: 'change' }
        ],
        INSTITUTIONAL_QUALIFICATIONS_IMG: [
          { type: 'array', required: true, message: '请上传机构LOGO图片', trigger: 'change' }
        ],
        INSTITUTIONAL_LOGO_IMG: [
          { type: 'array', required: true, message: '请上传营业执照图片', trigger: 'change' }
        ],
        INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG: [
          { type: 'array', required: true, message: '请上传法人身份证照片', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请输入小程序ID', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {},
  methods: {
    open(row, type) {
      this.reset()
      this.visible = true
      this.type = type
      if (type === 'edit') {
        this.row = row
        this.form.appId = row.appId
        this.form.objectId = row.objectId
        const fileList = { status: 3, authProgress: 100 }
        const douQualificationInfoVos = (row.douQualificationInfoVos && row.douQualificationInfoVos[0]) ?? {}
        this.form.INSTITUTIONAL_SHOW_IMG = [{ ...fileList, url: row.imgUrl, resourceUrl: row.imgUri }]
        this.form.INSTITUTIONAL_LOGO_IMG = [{ ...fileList, url: row.institutionLogoUrl, resourceUrl: row.institutionLogoUri }]
        this.form.INSTITUTIONAL_QUALIFICATIONS_IMG =
        douQualificationInfoVos?.imageUrl ? [{ ...fileList, url: douQualificationInfoVos?.imageUrl, resourceUrl: douQualificationInfoVos?.imageUris }] : []
        this.form.INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG = row?.legalPersonIdImgUrls?.map((i, index) => {
          const legalPersonIdImgUris = JSON.parse(row?.legalPersonIdImgUris)
          return {
            ...fileList,
            url: i,
            resourceUrl: legalPersonIdImgUris[index]
          }
        }) ?? []
        this.$nextTick(() => {
          this.$refs.upload1.setFileList(this.form.INSTITUTIONAL_SHOW_IMG)
          this.$refs.upload2.setFileList(this.form.INSTITUTIONAL_QUALIFICATIONS_IMG)
          this.$refs.upload3.setFileList(this.form.INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG)
          this.$refs.upload4.setFileList(this.form.INSTITUTIONAL_LOGO_IMG)
        })
      }
    },
    reset() {
      this.form = {
        appId: '',
        objectId: '',
        INSTITUTIONAL_LOGO_IMG: [],
        INSTITUTIONAL_SHOW_IMG: [],
        INSTITUTIONAL_QUALIFICATIONS_IMG: [],
        INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG: []
      }
    },
    fileChange(fileList, key) {
      this.form[key] = fileList
    },
    successFn() {
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.$emit('success')
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
    async add() {
      this.loading = true
      try {
        const legalPersonIdImgUris = this.form.INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG.map(i => i.resourceUrl)
        const params = {
          appId: this.form.appId,
          imgUri: this.form.INSTITUTIONAL_SHOW_IMG[0].resourceUrl,
          legalPersonIdImgUris,
          institutionLogoUri: this.form.INSTITUTIONAL_LOGO_IMG[0].resourceUrl,
          qualificationInfoLst: {
            imageUris: this.form.INSTITUTIONAL_QUALIFICATIONS_IMG[0].resourceUrl
          }
        }
        const { code } = await qualificationinfoAdd(params)
        if (code === 1) {
          this.successFn()
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async edit() {
      this.loading = true
      const legalPersonIdImgUris = this.form.INSTITUTIONAL_LEGAL_PERSON_ID_CARD_IMG.map(i => i.resourceUrl)
      const params = {
        appId: this.form.appId,
        objectId: this.form.objectId,
        imgUri: this.form.INSTITUTIONAL_SHOW_IMG[0].resourceUrl,
        legalPersonIdImgUris,
        institutionLogoUri: this.form.INSTITUTIONAL_LOGO_IMG[0].resourceUrl,
        qualificationInfoLst: {
          imageUris: this.form.INSTITUTIONAL_QUALIFICATIONS_IMG[0].resourceUrl,
          type: 1
        }
      }
      if (JSON.stringify(this.row) !== '{}') {
        const douQualificationInfoVos = (this.row.douQualificationInfoVos && this.row.douQualificationInfoVos[0]) ?? {}
        params.name = this.row.name
        params.nickname = this.row.nickname
        params.institutionIntroduction = this.row.institutionIntroduction
        params.institutionSceneType = this.row.institutionSceneType
        params.institutionSubjectType = this.row.institutionSubjectType
        params.companyName = this.row.companyName
        params.institutionRecordName = this.row.institutionRecordName
        params.qualificationInfoLst.validityDate = douQualificationInfoVos.validityDate
        params.qualificationInfoLst.licenseId = douQualificationInfoVos.licenseId
        params.legalPersonName = this.row.legalPersonName
        params.legalPersonIdNumber = this.row.legalPersonIdNumber
      }
      try {
        const { code } = await qualificationinfoEdit(params)
        if (code === 1) {
          this.successFn()
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
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
