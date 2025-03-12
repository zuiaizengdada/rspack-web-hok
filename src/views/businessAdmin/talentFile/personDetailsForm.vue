<template>
  <div
    class="personDetailsForm-container personDetailsForm-item"
    id="baseInfoRef"
    ref="personDetailsFormRef"
  >
    <div class="personDetailsForm-left" v-loading="loading">
      <personalInfo
        :detailBaseInfo="detailBaseInfo"
        :info="detailBaseInfo.personnelBaseInfo"
        :canEdit="showType === 'waitingEntryList' ? true : false"
        @refresh="getDetailBaseInfo()"
        @avatarRefresh="handleAvatarRefresh()"
      ></personalInfo>
      <template v-if="showType === 'waitingEntryList'">
        <curSalary :detailBaseInfo="detailBaseInfo"></curSalary>
        <MTitle class="personDetailsForm-title">基本信息</MTitle>
        <baseInfo
          :detailBaseInfo="detailBaseInfo"
          :info="detailBaseInfo.personnelBaseInfo"
        ></baseInfo>
        <MTitle
          class="personDetailsForm-title personDetailsForm-item"
          id="workInfoRef"
          >工作及学历经验</MTitle
        >
        <workInfo :detailBaseInfo="detailBaseInfo"></workInfo>
        <MTitle
          class="personDetailsForm-title personDetailsForm-item"
          id="familyInfoRef"
          >亲属信息</MTitle
        >
        <familyInfo
          :detailBaseInfo="detailBaseInfo"
          :info="detailBaseInfo.personnelKinshipList"
          @refresh="getDetailBaseInfo()"
        ></familyInfo>
      </template>

      <MTitle
        class="personDetailsForm-title personDetailsForm-item"
        id="documentInfoRef"
        >入职资料</MTitle
      >
      <documentInfo
        @refresh="getDetailBaseInfo()"
        :detailBaseInfo="detailBaseInfo"
        :showType="showType"
        :info="detailBaseInfo.enteringInformation"
      ></documentInfo>
      <template v-if="showType === 'waitingEntryList'">
        <MTitle
          class="personDetailsForm-title personDetailsForm-item"
          id="evaluateInfoRef"
          >自我评价</MTitle
        >
        <evaluateInfo
          ref="evaluateInfo"
          :detailBaseInfo="detailBaseInfo"
          :info="detailBaseInfo.personnelSelfEvaluation"
        ></evaluateInfo>
      </template>
    </div>
    <div class="personDetailsForm-right">
<!--      <pdfCardView-->
<!--        @add="pdfCardViewAdd($event, 'resume')"-->
<!--        @del="handleDel($event, 'resume')"-->
<!--        :disabledTitleHover="resumeUrlFileList.length > 0 ? false : true"-->
<!--        titleHover="仅支持上传一个简历，重新上传时将更新简历"-->
<!--        type="resume"-->
<!--        :showAddBtn="true"-->
<!--        title="简历"-->
<!--        :showDelBtn="true"-->
<!--        :list="resumeUrlFileList"-->
<!--        v-if="showType === 'waitingEntryList' ? true : false"-->
<!--      />-->
<!--      <pdfCardView-->
<!--        @add="pdfCardViewAdd($event, 'file')"-->
<!--        :list="fileContractList"-->
<!--        v-if="showPdfCardView"-->
<!--        :showAddBtn="showType === 'waitingEntryList' ? true : false"-->
<!--        title="合同协议"-->
<!--        type="file"-->
<!--      />-->
<!--      <pdfCardView-->
<!--        @add="pdfCardViewAdd($event, 'company')"-->
<!--        :list="companyContractList"-->
<!--        v-if="showPdfCardView"-->
<!--        :showAddBtn="showType === 'waitingEntryList' ? true : false"-->
<!--        title="公司制度"-->
<!--        type="file"-->
<!--      />-->
    </div>
    <batchAddSignDialog
      :select-list="[detailBaseInfo.personnelBaseInfo]"
      v-if="batchAddSignDialogVisable"
      :visible.sync="batchAddSignDialogVisable"
      :showCompany="batchAddSignDialogType === 'company' ? true : false"
      :showFile="batchAddSignDialogType === 'file' ? true : false"
      :showName="false"
      :filterFileByInfoId="true"
      :title="
        batchAddSignDialogType === 'file' ? '添加合同协议' : '添加公司制度'
      "
      @close="batchAddSignDialogVisable = false"
      @success="batchAddSignDialogSuccess"
    />
  </div>
</template>
<script>
import personalInfo from './components/personDetails/personalInfo.vue'
import baseInfo from './components/personDetails/baseInfo.vue'
import workInfo from './components/personDetails/workInfo.vue'
import familyInfo from './components/personDetails/familyInfo.vue'
import documentInfo from './components/personDetails/documentInfo.vue'
import evaluateInfo from './components/personDetails/evaluateInfo.vue'
import pdfCard from './components/personDetails/pdfCard.vue'
// import pdfCardView from './components/personDetails/pdfCardView.vue'
import curSalary from './components/personDetails/curSalary.vue'
import {
  detailBaseInfoAjax,
  resumeHandleAjax
} from '@/api/businessAdmin/talentFile'
import { batchAddSignAjax } from '@/views/oaMannagement/api/staff.js'
import batchAddSignDialog from '@/views/oaMannagement/staffManagement/components/organization/components/batchAddSignDialog'

export default {
  components: {
    personalInfo,
    baseInfo,
    workInfo,
    familyInfo,
    documentInfo,
    evaluateInfo,
    pdfCard,
    // pdfCardView,
    curSalary,
    batchAddSignDialog
  },
  props: {
    showType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detailBaseInfo: {
        educationExperienceList: [],
        workExperienceList: [],
        personnelSelfEvaluation: {},
        personnelBaseInfo: {},
        enteringInformation: {},
        educationExperienceList: []
      },
      fileContractList: [],
      companyContractList: [],
      resumeUrlFileList: [],
      companyAgreementList: [],
      contractAgreementList: [],
      batchAddSignDialogVisable: false,
      batchAddSignDialogType: '',
      loading: false
    }
  },
  methods: {
    //获取人员详情
    getDetailBaseInfo() {
      const params = {
        personnelInfoId: this.$route.query.candidateId
      }
      this.loading = true
      return detailBaseInfoAjax(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            res.data.personnelInfoId = this.$route.query.candidateId
            res.data.personnelBaseInfo &&
              (res.data.personnelBaseInfo.positionIds = [
                res.data.personnelBaseInfo.positionId
              ])
            this.detailBaseInfo = res.data || {}
            const resumeUrl = this.detailBaseInfo.personnelBaseInfo?.resumeUrl
            this.resumeUrlFileList =
              (this.detailBaseInfo.personnelBaseInfo?.resumeUrlFileList
                ?.length &&
                JSON.parse(
                  this.detailBaseInfo.personnelBaseInfo?.resumeUrlFileList
                )) ||
              []
            this.resumeUrlFileList?.length > 0 &&
              (this.resumeUrlFileList[0].resumeUrl = resumeUrl)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    //获取合同列表
    getContractList() {
      const params = {
        personnelBaseInfoId: this.$route.query.candidateId
      }
      this.$store.dispatch('oaManage/getContractList', params).then(res => {
        const contractList = res || []
        this.fileContractList =
          contractList.filter(item => item.contractType === 1) || []
        this.companyContractList =
          contractList.filter(item => item.contractType === 2) || []
      })
    },
    pdfCardViewAdd(data, type) {
      if (type === 'resume') {
        //获取
        this.resumeHandle(1, data.fileUrl, data.fileList)
      } else if (type === 'file') {
        this.batchAddSignDialogType = 'file'
        this.batchAddSignDialogVisable = true
      } else if (type === 'company') {
        this.batchAddSignDialogType = 'company'
        this.batchAddSignDialogVisable = true
      }
    },
    handleDel(e, type) {
      if (type === 'resume') {
        this.resumeHandle(2, '', [])
      }
    },
    resumeHandle(type, resumeUrl, resumeUrlFileList) {
      const params = {
        handleType: type, //	处理类型(1-修改 2-删除)
        personnelBaseInfoId: this.$route.query.candidateId,
        resumeUrl,
        resumeUrlFileList: JSON.stringify(resumeUrlFileList)
      }
      resumeHandleAjax(params).then(res => {
        if (res.code === 1) {
          this.getDetailBaseInfo()
        }
      })
    },
    batchAddSign() {
      const params = {
        personnelBaseInfoIds: ''
      }
      batchAddSignAjax(params).then(res => {
        if (res.code === 1) {
          this.getDetailBaseInfo()
        }
      })
    },
    contractList() {
      const params = {}
      this.$store.dispatch('oaManage/getContractList', params).then(res => {
        this.companyAgreementList = res
        this.contractAgreementList = res
      })
    },
    batchAddSignDialogSuccess() {
      this.batchAddSignDialogVisable = false
      this.getDetailBaseInfo()
      this.getContractList()
    },
    handleAvatarRefresh() {
      this.getDetailBaseInfo().then(() => {
        const { avatar, employeeId } = this.detailBaseInfo.personnelBaseInfo
        const userInfo = this.$store.state.userInfo || {}
        if (avatar && userInfo.employeeId === employeeId) {
          //只有修改自己的头像更新首页头像
          const newUserInfo = {
            ...userInfo,
            avatar
          }
          this.$store.commit('user/SET_USERINFO', newUserInfo)
        }
      })
    },
    scrollHandlerThrottled(e) {
      console.log(e, '+++')
    }
  },
  computed: {
    showPdfCardView() {
      return (
        [1, 2].includes(
          this.detailBaseInfo.personnelBaseInfo.entryRegisterAuditStatus
        ) ||
        [1, 2, 3].includes(this.detailBaseInfo.personnelBaseInfo.employeeType)
      )
    }
  },
  created() {
    this.getDetailBaseInfo()
    this.getContractList()
  },
  mounted() {},
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.personDetailsForm-container {
  display: flex;
  // height: 800px;
  // overflow: auto;
  .personDetailsForm-left {
    position: relative;
    margin: 20px 0 0 20px;
    padding: 16px;
    min-width: 1100px;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .personDetailsForm-right {
    width: 341px;
    margin: 20px 0 0 20px;
    > div {
      margin-bottom: 20px;
    }
  }
  .personDetailsForm-title {
    color: #000000;
    font-size: 16px;
    font-weight: 600;
    font-family: '微软雅黑';
    margin-bottom: 16px;
  }
}
</style>
