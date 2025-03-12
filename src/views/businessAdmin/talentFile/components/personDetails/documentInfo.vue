<template>
  <div class="documentInfo-container">
    <div class="documentInfo-top">
      <el-button
        key="handleEdit"
        v-if="!isEdit"
        @click="handleEdit"
        class="documentInfo-editbtn"
      >
        <div class="editbtn-container">
          <img :src="editIcon" class="editbtn" /><span>&nbsp;编辑</span>
        </div>
      </el-button>
      <el-button
        v-if="isEdit"
        class="documentInfo-closetbtn"
        key="handleClose"
        :loading="loading"
        @click="handleClose"
        >取消</el-button
      >
      <el-button
        type="primary"
        v-if="isEdit"
        :loading="loading"
        key="handleSuccess"
        class="documentInfo-successbtn"
        @click="handleSuccess"
        >确定</el-button
      >
    </div>
    <el-form
      ref="form"
      :model="form"
      size="small"
      label-width="78px"
      label-position="top"
      :inline="true"
    >
      <el-form-item label="身份证（正反面）" style="width: 520px">
        <div style="display: flex">
          <upload
            :showAgainBtn="showType === 'waitingEntryList'"
            :disabled="!isEdit"
            @change="fileChange($event, 'idCardFront')"
            :before-upload="beforeUpload"
            ref="uploadIdCardFrontRef"
            :max-length="1"
            :oss-teacher-folder="ossteacherfolder"
          />
          <upload
            :disabled="!isEdit"
            :showAgainBtn="showType === 'waitingEntryList'"
            @change="fileChange($event, 'idCardBack')"
            :before-upload="beforeUpload"
            ref="uploadIdCardBackRef"
            :max-length="1"
            :oss-teacher-folder="ossteacherfolder"
          />
        </div>
      </el-form-item>
      <el-form-item label="毕业证">
        <upload
          @change="fileChange($event, 'graduationCard')"
          :before-upload="beforeUpload"
          ref="uploadGraduationCardRef"
          :showAgainBtn="showType === 'waitingEntryList'"
          :max-length="1"
          :disabled="!isEdit"
          :oss-teacher-folder="ossteacherfolder"
        />
      </el-form-item>
      <el-form-item label="学位证">
        <upload
          @change="fileChange($event, 'academicCard')"
          :before-upload="beforeUpload"
          ref="uploadAcademicCardRef"
          :showAgainBtn="showType === 'waitingEntryList'"
          :max-length="1"
          :disabled="!isEdit"
          :oss-teacher-folder="ossteacherfolder"
        />
      </el-form-item>
      <el-form-item label="银行卡" style="width: 100%">
        <div class="documentInfo-bankCardContainer">
          <upload
            :before-upload="beforeUpload"
            :showAgainBtn="showType === 'waitingEntryList'"
            ref="uploadBankCardRef"
            :max-length="1"
            :disabled="!isEdit"
            @change="fileChange($event, 'bankCard')"
            :oss-teacher-folder="ossteacherfolder"
          />
          <div>
            <div>
              <span class="c_666">银行卡号：</span>{{ form.bankCardNum }}
            </div>
            <div class="documentInfo-inputView">
              <span class="c_666">开户行：</span>
              <span>
                <span v-if="!isEdit || !isBankCardAddressEdit">{{
                  form.bankCardAddress
                }}</span>

                <img
                  :src="editIcon"
                  class="documentInfo-editImg"
                  @click="handleBankCardAddressClick"
                  v-if="
                    isEdit &&
                    !isBankCardAddressEdit &&
                    (showType === 'waitingEntryList' ||
                      (showType !== 'waitingEntryList' &&
                        orgData.bankCardAddress.length === 0))
                  "
                />
              </span>
              <el-input
                style="width: 250px"
                v-model="form.bankCardAddress"
                placeholder="请输入"
                v-if="isBankCardAddressEdit"
              >
                <template slot="append">
                  <el-button type="primary" @click="handleBankCardAddressSave"
                    >保存</el-button
                  >
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="其他证书" style="width: 100%; margin-bottom: 0">
        <upload
          :before-upload="beforeUpload"
          ref="uploadOtherCertificateCardRef"
          :max-length="9"
          :showDelBtn="showType === 'waitingEntryList'"
          :showAgainBtn="showType === 'waitingEntryList'"
          :disabled="!isEdit"
          class="uploadOtherCertificateCard"
          :oss-teacher-folder="ossteacherfolder"
          @change="fileChange($event, 'otherCertificateCard')"
        />
      </el-form-item>
      <el-form-item
        label="体检报告"
        style="margin-bottom: 0"
        :style="form.checkupCard.length > 1 ? 'width: 100%' : 'width: 50%'"
      >
        <upload
          :before-upload="beforeUpload"
          ref="uploadCheckupCardRef"
          @change="fileChange($event, 'checkupCard')"
          :max-length="9"
          :disabled="!isEdit"
          :showAgainBtn="showType === 'waitingEntryList'"
          :showDelBtn="showType === 'waitingEntryList'"
          class="uploadCheckupCard"
          :oss-teacher-folder="ossteacherfolder"
        />
      </el-form-item>
      <el-form-item label="离职证明">
        <upload
          :before-upload="beforeUpload"
          ref="uploadLeaveCardRef"
          @change="fileChange($event, 'leaveCard')"
          :max-length="1"
          :disabled="!isEdit"
          :showAgainBtn="showType === 'waitingEntryList'"
          :oss-teacher-folder="ossteacherfolder"
        />
      </el-form-item>
    </el-form>
    <div class="documentInfo-socialContent">
      <el-form ref="form" size="small" label-width="78px" :inline="true">
        <el-row>
          <el-col :span="13">
            <el-form-item
              label="是否有在本市缴纳过社保？"
              label-width="200px"
              style="width: 100%; margin: 0"
            >
              <div class="documentInfo-inputView">
                <div>
                  <span style="margin-right: 20px" v-if="!isEdit">{{
                    sureType.get(form.socialSecurity)
                  }}</span>
                  <el-radio-group
                    v-model="form.socialSecurity"
                    size="mini"
                    v-else-if="
                      showType === 'waitingEntryList' ||
                      (showType !== 'waitingEntryList' &&
                        orgData.socialSecurity === 0)
                    "
                  >
                    <el-radio :label="2" style="margin-right: 15px"
                      >否</el-radio
                    >
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="form.socialSecurity === 1">
                  <span>&nbsp;社保账号：</span>
                  <span>
                    <span v-if="!isEdit || !isSocialSecurityNumberEdit">{{
                      form.socialSecurityNumber
                    }}</span>
                    <img
                      :src="editIcon"
                      class="documentInfo-editImg"
                      @click="handleSocialSecurityNumberClick"
                      v-if="isEdit && !isSocialSecurityNumberEdit"
                    />
                  </span>
                  <el-input
                    style="width: 200px"
                    v-model="form.socialSecurityNumber"
                    placeholder="请输入"
                    size="mini"
                    v-if="isSocialSecurityNumberEdit"
                  >
                    <template slot="append">
                      <el-button
                        type="primary"
                        @click="handleSocialSecurityNumberSave"
                        >保存</el-button
                      >
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="是否有在本市缴纳过公积金？"
              label-width="200px"
              style="width: 100%; margin: 14px 0 0 0"
            >
              <div class="documentInfo-inputView">
                <div>
                  <span style="margin-right: 20px" v-if="!isEdit">{{
                    sureType.get(form.accumulationFund)
                  }}</span>

                  <el-radio-group
                    v-model="form.accumulationFund"
                    v-else-if="
                      showType === 'waitingEntryList' ||
                      (showType !== 'waitingEntryList' &&
                        orgData.accumulationFund === 0)
                    "
                    size="mini"
                  >
                    <el-radio :label="2" style="margin-right: 15px"
                      >否</el-radio
                    >
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="form.accumulationFund === 1">
                  <span>&nbsp;公积金账号：</span>
                  <span>
                    <span v-if="!isEdit || !isAccumulationFundNumberEdit">{{
                      form.accumulationFundNumber
                    }}</span>
                    <img
                      :src="editIcon"
                      class="documentInfo-editImg"
                      @click="handleAccumulationFundNumberClick"
                      v-if="isEdit && !isAccumulationFundNumberEdit"
                    />
                  </span>
                  <el-input
                    style="width: 200px"
                    v-model="form.accumulationFundNumber"
                    placeholder="请输入"
                    size="mini"
                    v-if="isAccumulationFundNumberEdit"
                  >
                    <template slot="append">
                      <el-button
                        type="primary"
                        @click="handleAccumulationFundNumberSave"
                        >保存</el-button
                      >
                    </template>
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="社保缴纳明细(近一年)"
              label-width="150px"
              label-position="left"
              style="margin: 0"
            >
              <el-upload
                ref="socialSecurityCardUploadFile"
                action="#"
                :before-upload="socialSecurityCardBeforeUpload"
                v-if="form.socialSecurityCard.length === 0 && isEdit"
                :limit="1"
                :multiple="false"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="onChangSocialSecurityCard"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
                <span class="socialSecurityCardUploadFile-tip">
                  只能上传xls,cvs,xlsx,txt,doc,docx格式文件
                </span>
              </el-upload>
              <pdfCard
                v-else-if="form.socialSecurityCard.length"
                :showTitle="false"
                key="socialSecurityCard"
                :url="form.socialSecurityCard[0].url"
                :name="form.socialSecurityCard[0].certificateName"
                :date="form.socialSecurityCard[0].createTime"
                :showBrowseBtn="true"
                :showDelBtn="
                  isEdit &&
                  (showType === 'waitingEntryList' ||
                    (showType !== 'waitingEntryList' &&
                      !orgData.socialSecurityCard.length))
                    ? true
                    : false
                "
                class="socialSecurityCard-view"
                :showDownBtn="true"
                @del="handDelSocialSecurityCard"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <bankCardDialog
      v-if="bankCardDialogVisible"
      :visible.sync="bankCardDialogVisible"
      @success="handleBankCardDialogSuccess"
      @close="bankCardDialogVisible = false"
      :dialogInfo="cardDialogInfo"
      @aginUploadCad="handleAginUploadCad"
    ></bankCardDialog>
  </div>
</template>
<script>
import upload from '../upload/upload.vue'
import pdfCard from './pdfCard.vue'
import editIcon from '@/assets/image/oa/edit.png'
import {
  personnelDetailOcrRecognizeAjax,
  modifyEntryInfoAjax
} from '@/api/businessAdmin/talentFile'
import { certificateType } from '../../options'
import { uploadFile } from '@/api/file'

import { sureType } from '@/views/businessAdmin/talentFile/options'
import bankCardDialog from './bankCardDialog'
export default {
  components: {
    upload,
    pdfCard,
    bankCardDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    detailBaseInfo: {
      type: Object,
      default: () => {}
    },
    showType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ossteacherfolder: 'hok_oa',
      editIcon,
      ocrBankCardInfo: {}, //银行卡识别信息
      form: {
        idCardFront: [], //身份证正面
        idCardBack: [], //身份证反面
        graduationCard: [], //毕业证
        academicCard: [], //学位证
        bankCard: [], //银行卡
        bankCardNum: '', //银行卡号
        bankCardAddress: '', //银行卡支行
        leaveCard: [], //离职证明
        checkupCard: [], //体检证明
        eleDocuments: [], //电子证件
        otherCertificateCard: [], //其他证书
        socialSecurity: 0, //本市缴纳过社保
        accumulationFund: 0, //本市缴纳公积金
        accumulationFundNumber: '', //公积金号
        socialSecurityNumber: '', //	社保号
        socialSecurityCard: [] //社保缴纳明细
      },
      isEdit: false,
      isSocialSecurityNumberEdit: false,
      isAccumulationFundNumberEdit: false,
      isBankCardAddressEdit: false,
      sureType,
      bankCardDialogVisible: false,
      cardDialogInfo: {}, //银行卡识别信息
      orgData: {
        bankCardAddress: '',
        socialSecurityCard: []
      }, //原始数据
      loading: false
    }
  },
  mounted() {},
  watch: {
    info: {
      handler(val) {
        console.log(val)
        val && this.init()
      },
      deep: true
    }
  },
  methods: {
    beforeUpload(file) {
      const isTypeAllowed = /\.(jpg|png|jpeg|bmp)$/i.test(file.name)
      if (!isTypeAllowed) {
        this.$message.error('只能上传 jpg,png,jpeg,bmp 格式的图片！')
        return false
      }
      return isTypeAllowed
    },
    init() {
      this.form.socialSecurityNumber = this.info.socialSecurityNumber
      this.form.accumulationFundNumber = this.info.accumulationFundNumber
      this.form.accumulationFund = this.info.accumulationFund
      this.form.socialSecurity = this.info.socialSecurity
      this.form.idCardFront = []
      this.form.idCardBack = []
      this.form.graduationCard = []
      this.form.academicCard = []
      this.form.bankCard = []
      this.form.leaveCard = []
      this.form.checkupCard = []
      this.form.eleDocuments = []
      this.form.otherCertificateCard = []
      this.form.socialSecurityCard = []
      this.info.personnelCertificateList.forEach(cert => {
        const imageObject = {
          status: 3,
          url: cert.url,
          certificateType: cert.certificateType,
          certificateLocation: cert.certificateLocation,
          certificateNumber: cert.certificateNumber,
          name: cert.certificateName,
          certificateName: cert.certificateName,
          side: cert.side,
          createTime: cert.createTime
        }

        switch (cert.certificateType) {
          case 1:
            if (cert.side === 1) {
              this.form.idCardFront.push(imageObject)
            } else if (cert.side === 2) {
              this.form.idCardBack.push(imageObject)
            }
            break
          case 2:
            this.form.graduationCard.push(imageObject)
            break
          case 3:
            this.form.academicCard.push(imageObject)
            break
          case 4:
            this.form.bankCard.push(imageObject)
            this.form.bankCardAddress = imageObject.certificateLocation
            this.form.bankCardNum = imageObject.certificateNumber
            break
          case 5:
            this.form.leaveCard.push(imageObject)
            break
          case 6:
            this.form.checkupCard.push(imageObject)
            break
          case 7:
            this.form.eleDocuments.push(imageObject)
            break
          case 8:
            this.form.socialSecurityCard.push(imageObject)
            break
          case 99:
            this.form.otherCertificateCard.push(imageObject)
            break
        }
      })
      this.orgData = JSON.parse(JSON.stringify(this.form))
      this.$refs.uploadIdCardFrontRef?.setFileList(this.form.idCardFront)
      this.$refs.uploadIdCardBackRef?.setFileList(this.form.idCardBack)
      this.$refs.uploadGraduationCardRef?.setFileList(this.form.graduationCard)
      this.$refs.uploadAcademicCardRef?.setFileList(this.form.academicCard)
      this.$refs.uploadBankCardRef?.setFileList(this.form.bankCard)
      this.$refs.uploadLeaveCardRef?.setFileList(this.form.leaveCard)
      this.$refs.uploadCheckupCardRef?.setFileList(this.form.checkupCard)
      this.$refs.uploadOtherCertificateCardRef?.setFileList(
        this.form.otherCertificateCard
      )
    },
    handleEdit() {
      this.isEdit = true
    },
    handleClose() {
      this.isEdit = false
      this.isSocialSecurityNumberEdit = false
      this.isAccumulationFundNumberEdit = false
      this.isBankCardAddressEdit = false
      this.$emit('refresh')
    },
    handleSuccess() {
      console.log(this.form)
      const personnelBaseInfoId = this.detailBaseInfo.personnelInfoId
      const list = [
        ...this.form.idCardFront,
        ...this.form.idCardBack,
        ...this.form.graduationCard,
        ...this.form.academicCard,
        ...this.form.bankCard,
        ...this.form.leaveCard,
        ...this.form.eleDocuments,
        ...this.form.checkupCard,
        ...this.form.otherCertificateCard,
        ...this.form.socialSecurityCard
      ]
      const certificateList = list.map(item => {
        return {
          side: item.side,
          certificateType: item.certificateType,
          url: item.url,
          certificateNumber: item.certificateNumber,
          ...(item.certificateType === 4 && {
            certificateLocation: this.form.bankCardAddress
          }),
          personnelBaseInfoId,
          certificateName: item.certificateName
        }
      })
      const params = {
        accumulationFund: this.form.accumulationFund,
        accumulationFundNumber: this.form.accumulationFundNumber,
        socialSecurity: this.form.socialSecurity,
        socialSecurityNumber: this.form.socialSecurityNumber,
        personnelBaseInfoId,
        certificateList
      }
      this.loading = true
      modifyEntryInfoAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.isSocialSecurityNumberEdit = false
            this.isAccumulationFundNumberEdit = false
            this.isBankCardAddressEdit = false
            this.isEdit = false
            this.$emit('refresh')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    fileChange(res, type) {
      const arr = []
      console.log(res, '图片上传')
      res.map(v => {
        arr.push({
          url: v.url,
          certificateType: certificateType.get(type),
          certificateName: v.name
        })
      })
      if (type === 'bankCard' && arr.length) {
        console.log(arr)
        const params = {
          imageUrl: arr[0].url,
          personnelBaseInfoId: this.detailBaseInfo.personnelInfoId,
          type: 'BankCardOCR'
        }
        personnelDetailOcrRecognizeAjax(params).then(res2 => {
          this.bankCardDialogVisible = true
          if (res2.code === 1) {
            res2.data.bankCardOcr.url = params.imageUrl
            this.cardDialogInfo = res2.data.bankCardOcr
            this.form.bankCard[0].certificateNumber =
              res2.data.bankCardOcr.cardNo
            this.form.bankCardNum = res2.data.bankCardOcr.cardNo
          }
        })
      }
      if (type === 'idCardBack' && arr.length) {
        arr[0].side = 2
      } else if (arr.length) {
        arr[0].side = 1
      }
      this.form[`${type}`] = arr
    },
    //删除明细
    handDelSocialSecurityCard() {
      this.form.socialSecurityCard = []
    },
    socialSecurityCardBeforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(xls|csv|xlsx|txt|doc|docx)$/i.test(file.name)
      if (!isTypeAllowed) {
        this.$message.error('只能上传 xls,csv,xlsx,txt,doc,docx 格式的文件！')

        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！')

        return false
      }

      return isLt10M && isTypeAllowed
    },
    onChangSocialSecurityCard(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.socialSecurityCardBeforeUpload(file)
      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            if (res.code === 1) {
              const fileData = [
                {
                  url: res.data.url,
                  name: file.name
                }
              ]
              this.fileChange(fileData, 'socialSecurityCard')
            }
            this.$refs.socialSecurityCardUploadFile.clearFiles()
          })
          .catch(() => {
            this.$refs.socialSecurityCardUploadFile.clearFiles()
            this.$message.error(file.name + '上传失败')
          })
      } else {
        this.$refs.socialSecurityCardUploadFile.clearFiles()
      }
    },
    handleSocialSecurityNumberClick() {
      this.isSocialSecurityNumberEdit = true
    },
    handleSocialSecurityNumberSave() {
      this.isSocialSecurityNumberEdit = false
    },
    handleAccumulationFundNumberClick() {
      this.isAccumulationFundNumberEdit = true
    },
    handleAccumulationFundNumberSave() {
      this.isAccumulationFundNumberEdit = false
    },
    handleBankCardAddressSave() {
      this.isBankCardAddressEdit = false
    },
    handleBankCardAddressClick() {
      this.isBankCardAddressEdit = true
    },
    handleBankCardDialogSuccess() {
      this.bankCardDialogVisible = false
    },
    handleAginUploadCad() {}
  }
}
</script>
<style lang="scss" scoped>
.documentInfo-container {
  margin-bottom: 20px;
  position: relative;
  .documentInfo-top {
    margin: 0 16px 0 0;
    text-align: right;
    .documentInfo-editbtn {
      width: 90px;
      height: 32px;
      border-color: #0c6fff;
      color: #0c6fff;
      .editbtn-container {
        display: flex;
        align-items: center;
        margin-top: -2px;
      }
      .editbtn {
        width: 16px;
        height: 16px;
      }
    }
    .documentInfo-closetbtn,
    .documentInfo-successbtn {
      width: 88px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  .documentInfo-bankCardContainer {
    display: flex;
  }
}
.documentInfo-socialContent {
  border: 1px solid #f2f2f2;
  background: #fffaf5;
  border-radius: 10px;
  padding: 14px 0;
  > div {
    width: calc(50% - 20px);
  }
  ::v-deep .el-form-item__label {
    color: #666;
    font-weight: 400;
    font-family: '微软雅黑';
  }
}

.socialSecurityCardUploadFile-tip {
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  font-family: '微软雅黑';
}
.socialSecurityCard-view {
  width: 320px;
  height: 79px;
}
.documentInfo-editImg {
  width: 16px;
  height: 16px;
  margin-left: 5px;
  display: inline-block;
  cursor: pointer;
}
.documentInfo-inputView {
  display: flex;
  align-items: center;
}
.uploadOtherCertificateCard ::v-deep,
.uploadCheckupCard ::v-deep {
  > div {
    margin-bottom: 16px;
  }
}
.c_666 {
  color: #666;
}

::v-deep .el-input-group__append {
  background: #0c6fff;
  color: #fff;
  border-color: #0c6fff;
}
</style>
