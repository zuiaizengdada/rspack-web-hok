<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    />

    <ZBTable
      ref="zbTableRef"
      key="certificate"
      data-key="records"
      :columns="certificateColumns"
      height="545px"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:createdAt="{ scope }">
        <span>
          {{ moment(scope.row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <template v-slot:type="{ scope }">
        {{ findLabelByValue(scope.row.type, certificateTypeOptions) }}
      </template>
      <template v-slot:status="{ scope }">
        {{ findLabelByValue(scope.row.status, certificateStatusOptions) }}
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['certificate-edit', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row, 'edit')"
        >
          编辑
        </el-button>
        <el-button
          v-permission="['certificate-copy', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row, 'copy')"
        >
          复制
        </el-button>
        <el-button
          v-if="scope.row.status === 0"
          v-permission="['certificate-enable', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="handleUpdateStatus(1, scope.row.id)"
        >
          启用
        </el-button>
        <el-button
          v-if="scope.row.status === 1"
          v-permission="['certificate-unable', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="handleUpdateStatus(0, scope.row.id)"
        >
          停用
        </el-button>
        <el-button
          v-permission="['certificate-del', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px; color: #f1330d"
          @click="onhandleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <div />
      </template>
    </ZBTable>
    <CertificateDrawer
      ref="certificateDrawerRef"
      :visible.sync="certificateDialogVisible"
      :type="certificateDialogType"
      :associated-class-type="certificateDialogType"
      :disabled-add-content="disabledAddContent"
      @save="handleSaveCertificate"
    />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import {
  certificateColumns,
  certificateFrom,
  certificateStatusOptions,
  certificateTypeOptions
} from './columns'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { mapGetters } from 'vuex'
import moment from 'moment'
import {
  getCertificateDetail,
  pageCertificate,
  updateCertificateStatus,
  delCertificate,
  createCertificate,
  updateCertificate
} from '@/api/certificate'
import { findLabelByValue } from '@/utils/index.js'
import CertificateDrawer from '@/views/privateArea/CRM/components/liveRoomSetting/components/CertificateDrawer/index.vue'
import { getScheduleClassPage } from '@/api/deliver/scheduleManagement'

export default {
  components: {
    HokSearchForm,
    ZBTable,
    CertificateDrawer
  },
  data() {
    return {
      certificateColumns,
      certificateStatusOptions,
      certificateTypeOptions,
      formOpts: {
        ...certificateFrom,
        operatorList: []
      },
      tableConfig: {
        current: 1,
        size: 10
      },
      config: {
        visible: false,
        data: {}
      },
      certificateDialogVisible: false,
      certificateDialogType: 'create',
      certificateDetailInfo: {},
      disabledAddContent: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    permsList() {
      const obj = this.permission_routes?.find(v => v.path === '/deliver')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'generalSettings')
        if (o && o.children && o.children.length > 0) {
          console.log(o, 'o')
          const p = o.children.find(
            v => v.path === '/deliver/courseInteraction'
          )
          if (p && p.children && p.children.length > 0) {
            const pp = p.children.find(
              v => v.path === '/deliver/courseInteraction/certificate'
            )
            if (
              pp &&
              pp.meta &&
              pp.meta.permsList &&
              pp.meta.permsList.length > 0
            ) {
              return pp.meta.permsList
            }
          }
        }
      }
      return []
    }
  },
  mounted() {
    this.setOperatorList()
    this.searchFn()
  },
  methods: {
    moment,
    findLabelByValue,
    downLoad(row) {},
    handleChangeTeacher(val) {
      this.formOpts.formData.teacherId = val
      this.searchFn()
    },
    setOperatorList() {
      const arr = [
        {
          label: '查询',
          bind: { plain: true },
          fn: () => {
            this.searchFn()
          }
        },
        {
          label: '重置',
          type: 'plain',
          fn: () => {
            this.searchFn(true)
          }
        }
      ]
      if (this.permsList && this.permsList.includes('certificate-add')) {
        arr.push({
          label: '新增',
          fn: () => {
            this.disabledAddContent = false
            this.openCreate()
          },
          className: ['right']
        })
      }
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.current = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.size = val
      this.searchFn()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.current = 1
      }
      if (isClear) {
        this.tableConfig.size = 10
        this.formOpts.formData = {
          name: undefined,
          type: undefined,
          status: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        type: this.formOpts.formData.type,
        status: this.formOpts.formData.status,
        name: this.formOpts.formData.name
      }
      return pageCertificate(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `确定删除？`,
        success: () => {
          delCertificate(row.id).then(res => {
            this.searchFn()
          })
          this.$message.success('删除成功')
        },
        fail: () => {}
      })
    },
    handleUpdateStatus(status, id) {
      this.$delModal({
        tips: `确定${status === 0 ? '停用' : '启用'}？`,
        success: () => {
          updateCertificateStatus(id, {
            status
          }).then(res => {
            this.searchFn()
            this.$message.success('操作成功')
          })
        },
        fail: () => {}
      })
    },
    async getCertificateDetail(certificateId) {
      if (!certificateId) return

      const res = await getCertificateDetail(certificateId)
      if (res.code === 1) {
        this.certificateDetailInfo = res.data
      }
    },
    openCreate() {
      this.certificateDialogVisible = true
      this.certificateDialogType = 'create'
    },
    async onhandleEdit(row, type) {
      await this.getCertificateDetail(row.id)
      const editData = {
        id: this.certificateDetailInfo.id,
        createCertificate: {
          status: this.certificateDetailInfo.status === 1
        },
        basicInfo: {
          name: this.certificateDetailInfo.name,
          type: this.certificateDetailInfo.type,
          scheduleId:
            type === 'copy' ? '' : this.certificateDetailInfo.scheduleId
        },
        rule: {
          conditionType:
            type === 'copy' ? 1 : this.certificateDetailInfo.conditionType,
          conditionTime: this.certificateDetailInfo.conditionTime,
          isFinishContentCount:
            type === 'copy'
              ? false
              : this.certificateDetailInfo.isFinishContentCount,
          isFinishPunchCount:
            type === 'copy'
              ? false
              : this.certificateDetailInfo.isFinishPunchCount,
          finishContentCount:
            type === 'copy'
              ? ''
              : this.certificateDetailInfo.finishContentCount,
          punchCount:
            type === 'copy' ? '' : this.certificateDetailInfo.punchCount
        },
        style: {
          backgroundImage: this.certificateDetailInfo.backgroundImage,
          imageType: this.certificateDetailInfo.imageType
        },
        info: {
          title: this.certificateDetailInfo.title,
          content: this.certificateDetailInfo.content,
          showCourseTitle: this.certificateDetailInfo.showCourseTitle,
          courseTitleType: this.certificateDetailInfo.courseTitleType,
          customTitle: this.certificateDetailInfo.customTitle,
          finishCourse: this.certificateDetailInfo.finishCourse,
          finishPunch: this.certificateDetailInfo.finishPunch,
          finishTask: this.certificateDetailInfo.finishTask,
          encourageContent: this.certificateDetailInfo.encourageContent
        },
        issueInfo: {
          certificateTenant: this.certificateDetailInfo.certificateTenant,
          showTime: this.certificateDetailInfo.showTime,
          certificateNumber: this.certificateDetailInfo.certificateNumber,
          seal: this.certificateDetailInfo.seal
        },
        share: {
          shareContent: this.certificateDetailInfo.shareContent,
          showQrCode: this.certificateDetailInfo.showQrCode,
          qrCodeSetting: this.certificateDetailInfo.qrCodeSetting,
          guidanceContent: this.certificateDetailInfo.guidanceContent,
          customQrCode: this.certificateDetailInfo.customQrCode
        }
      }
      if (type !== 'copy') {
        const params = {
          current: 1,
          scheduleId: this.certificateDetailInfo.scheduleId,
          size: 9999,
          type: 2
        }
        const res = await getScheduleClassPage(params)
        const classInfo = res.data.records[0]
        this.$refs.certificateDrawerRef.handleConfirm(classInfo)
      }
      this.certificateDialogVisible = true
      this.certificateDialogType = type
      if (type === 'edit') {
        this.disabledAddContent = true
      } else {
        this.disabledAddContent = false
      }
      this.$refs.certificateDrawerRef.certificateForm = editData
    },
    async handleSaveCertificate(data, type) {
      const res = await (type === 'edit'
        ? updateCertificate
        : createCertificate)(data)
      if (res.code === 1) {
        this.$message.success(type === 'edit' ? '编辑证书成功' : '创建证书成功')
        this.searchFn()
        this.$refs.certificateDrawerRef.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.live-wrapper {
  position: relative;
  padding: 0 20px;
  background: #ffffff;
  border-radius: 10px;
  .liveType,
  .liveMode {
    display: inline-block;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    padding: 0 8px;
    border-radius: 13px;
    font-size: 10px;
    font-family: MicrosoftYaHei;
    height: 24px;
    line-height: 24px;
    .liveTypeicon,
    .liveModeicon {
      width: 13px;
      height: 13px;
      font-size: 13px;
      margin-right: 4px;
    }
  }
  .liveType0 {
    background: #eef2f9;
    color: #717f99;
  }
  .liveType1 {
    background: #e7f0ff;
    color: #1778ff;
  }
  .liveType2 {
    background: #fff2e6;
    color: #ff7d00;
  }
  .liveType3 {
    background: #feecec;
    color: #f53f3f;
  }
  .liveType9 {
    background: #f5f5f5;
    color: #999999;
  }
}
::v-deep {
  // .pageWrap {
  //   .navHeader {
  //     .navItem {
  //       font-size: 14px;
  //     }
  //   }
  // }

  .filter_teacherSelect {
    .tearchInput {
      width: 270px !important;
    }
  }
}
::v-deep {
  .delisting-tips {
    font-size: 16px;
    color: #333333;
    font-weight: 400;
  }
  .delisting-tips-text {
    color: #f1330d;
    font-weight: 600;
  }
  .el-dialog__title {
    color: #f1330d;
    font-weight: 600;
    font-size: 24px;
  }
}
</style>
