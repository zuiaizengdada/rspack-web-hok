<template>
  <!-- 全部学员 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      row-key="deliveryInfoId"
      keys="offline_all_student"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      :empty-slot="emptySlot"
      empty-slot-text="请按条件查询您需要看的结果"
      checkbox
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <filterTop
          :loading="loading"
          :columns="config.tableColumns"
          :search="search"
          @searchFn="searchFn"
          @change="handleCheckedTableColumnsChange"
          @clear="searchClear"
        />
      </template>
      <template slot="courseWorkStatus" slot-scope="{ row }">
        <span class="courseWorkStatus" :class="`status${row.courseWorkStatus}`">
          {{ courseWorkStatus[row.courseWorkStatus] }}
        </span>
      </template>
      <template slot="deliveryStatusName" slot-scope="{ row }">
        <deliveryStatusSpan :key="tableKey" :current="row">
          <el-popover placement="top-start" trigger="hover">
            <div>
              <span>{{
                row.deliveryStatus === 4 ? row.lockReason : row.closeReason
              }}</span>
              <div v-if="row.images && row.images.length">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="row.images[row.srcUrlIndex]"
                  :preview-src-list="row.images"
                />
                <div>
                  <el-button
                    type="text"
                    :disabled="row.srcUrlIndex === 0"
                    @click="prev(row)"
                  >上一张</el-button>
                  <el-button
                    type="text"
                    :disabled="row.srcUrlIndex === row.images.length - 1"
                    @click="next(row)"
                  >下一张</el-button>
                </div>
              </div>
            </div>
            <span
              v-if="[4, 6].includes(row.deliveryStatus)"
              slot="reference"
              style="color: #0c6fff; margin-left: 10px"
            >原因</span>
          </el-popover>
        </deliveryStatusSpan>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="row.deliverySubject !== 2"
          v-permission="['web:allStudent:detail', permsList]"
          type="text"
          @click="handleClickDetail(row)"
        >详情</el-button>
        <el-button
          v-if="[5].includes(row.deliveryStatus)"
          v-permission="['web:allRenewDeal', permsList]"
          type="text"
          @click="handleRecoverDeal(row)"
        >恢复交付</el-button>
        <el-button
          v-if="
            [1, 2, 3].includes(row.deliveryStatus) &&
              row.goodsType === 5 &&
              row.deliverySubject !== 2
          "
          v-permission="['web:allStudent:adjust', permsList]"
          type="text"
          @click="handleClickSchedule(row)"
        >调整班期</el-button>
        <el-button
          v-if="
            [1, 2, 3].includes(row.deliveryStatus) &&
              [2, 3, 4].includes(row.orderType) &&
              row.deliverySubject !== 2
          "
          v-permission="['web:allStudent:close', permsList]"
          type="text"
          @click="handleClickCloseDelivery(row)"
        >关闭交付</el-button>
        <el-button
          v-permission="['web:allStudent:remark', permsList]"
          type="text"
          @click="handleClickRemake(row)"
        >备注</el-button>
        <el-button
          v-if="row.deliveryStatus === 4 && row.deliverySubject !== 2 && row.goodsType !== 7 && !row.isPackage"
          v-permission="['web:allStudent:unlock', permsList]"
          type="text"
          @click="handleClickUnlockOrder(row)"
        >解除锁单</el-button>
        <el-button
          v-if="
            [1, 2, 3].includes(row.deliveryStatus) &&
              [1, 5].includes(row.orderType) &&
              row.deliverySubject !== 2 &&
              !row.isPackage
          "
          v-permission="['web:allStudent:lock', permsList]"
          type="text"
          @click="handleClickLockOrder(row)"
        >锁单</el-button>
        <el-button
          v-permission="['web:allStudent:call', permsList]"
          type="text"
          @click="call(row)"
        >呼叫</el-button>
      </template>
      <template slot="footer">
        <el-button
          v-permission="['web:allStudent:batchReplaceHeadteacher', permsList]"
          :disabled="isCanShowHeadTeacherFootBtn"
          type="text"
          @click="handleClickReplaceHeadTeacher"
        >批量更换班主任</el-button>
        <el-button
          v-permission="['web:allStudent:batchReplaceAssistant', permsList]"
          :disabled="isCanShowAssistantsFootBtn"
          type="text"
          @click="handleClickReplaceAssistants"
        >批量更换助教</el-button>
        <el-button
          v-permission="['web:allStudent:batchDownWork', permsList]"
          type="text"
          :disabled="isCanShowDownJobFootBtn"
          @click="handleClickDownJob"
        >批量下载作业</el-button>
        <el-button
          type="text"
          :disabled="isCanShowSaleBtn"
          @click="handleClickChangeSale"
        >更换销售人员</el-button>
      </template>
      <template slot="signedCount" slot-scope="{ row }">
        <span
          :class="row.signedCount && row.signedCount > 0 ? 'a_link' : ''"
          @click="handleClickSignDetail(row)"
        >
          {{ row.signedCount || 0 }}
        </span>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <!-- 详情弹框 -->
    <detailDrawer
      :id="detailDrawerConfig.id"
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
    />
    <!-- 调整班期弹框 -->
    <adjustScheduleDialog
      :config="adjustScheduleConfig"
      type="1"
      @success="closeDialog('adjustScheduleConfig')"
    />
    <!-- 解除锁单弹框 -->
    <unlockOrderDialog
      :config="unlockOrderConfig"
      @success="closeDialog('unlockOrderConfig')"
    />
    <!-- 锁单弹框 -->
    <lockOrderDialog
      :config="lockOrderConfig"
      @success="closeDialog('lockOrderConfig')"
    />
    <!-- 批量更换班主任 -->
    <replaceHeadTeacherDialog
      :config="replaceHeadTeacherConfig"
      @success="closeDialog('replaceHeadTeacherConfig')"
    />
    <!-- 批量更换助教 -->
    <replaceAssistantsDialog
      :config="replaceAssistantsConfig"
      @success="closeDialog('replaceAssistantsConfig')"
    />
    <!-- 批量下载作业弹框 -->
    <downJobDialog :config="downJobConfig" />
    <!-- 签到记录弹框 -->
    <signDetailDialog :config="signDetailConfig" />

    <!-- 备注弹框 -->
    <remakeDialog
      :config="remakeConfig"
      @success="closeDialog('remakeConfig')"
    />
    <!-- 关闭交付弹框 -->
    <closeDeliveryDialog
      :config="closeDeliveryConfig"
      @success="closeDialog('closeDeliveryConfig')"
    />
    <!-- 恢复交付弹框 -->
    <renewDealDialog :config="renewDealConfig" />
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { getColumns } from './columns.js'
import detailDrawer from '../../components/detailDrawer.vue'
import adjustScheduleDialog from '../../components/adjustScheduleDialog.vue'
import unlockOrderDialog from '../../components/unlockOrderDialog.vue'
import lockOrderDialog from '../../components/lockOrderDialog.vue'
import replaceAssistantsDialog from '../../components/replaceAssistants'
import replaceHeadTeacherDialog from '../../components/replaceHeadTeacher'
import downJobDialog from '../../components/downJobDialog'
import signDetailDialog from '../../components/signDetailDialog.vue'
import closeDeliveryDialog from '../../components/closeDeliveryDialog'
import { courseWorkStatus } from '@/utils/enum'
import remakeDialog from '../../components/remakeDialog'
import deliveryStatusSpan from '../../../components/deliveryStatusSpan'
import renewDealDialog from '../../components/renewDealDialog'
import { getDeliveryPage, userSalesChange } from '@/api/deliver/studentManagement'
import eventBus from '@/utils/eventBus'
export default {
  components: {
    filterTop,
    detailDrawer,
    adjustScheduleDialog,
    unlockOrderDialog,
    lockOrderDialog,
    remakeDialog,
    closeDeliveryDialog,
    replaceAssistantsDialog,
    replaceHeadTeacherDialog,
    signDetailDialog,
    downJobDialog,
    deliveryStatusSpan,
    renewDealDialog
  },
  data() {
    return {
      slotArr: [
        'search',
        'action',
        'footer',
        'signedCount',
        'courseWorkStatus',
        'deliveryStatusName'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      courseWorkStatus,
      loading: false,
      // 详情弹框
      detailDrawerConfig: {
        visible: false,
        id: ''
      },
      // 调整班期弹框
      adjustScheduleConfig: {
        visible: false,
        row: {}
      },
      // 备注弹框
      remakeConfig: {
        visible: false,
        deliveryInfoId: '',
        remark: '',
        type: 'offline'
      },
      renewDealConfig: {
        visible: false,
        row: {}
      },
      // 解除锁单弹框
      unlockOrderConfig: {
        deliveryInfoId: '',
        visible: false
      },
      // 锁单弹框
      lockOrderConfig: {
        deliveryInfoId: '',
        visible: false
      },
      // 关闭交付弹框
      closeDeliveryConfig: {
        visible: false,
        deliveryInfoId: ''
      },
      // 批量更换班主任弹框
      replaceHeadTeacherConfig: {
        visible: false,
        scheduleId: '',
        deliveryInfoId: []
      },
      // 批量更换助教弹框
      replaceAssistantsConfig: {
        visible: false,
        deliveryInfoId: [],
        goodsId: ''
      },
      // 是否显示批量下载作业
      downJobConfig: {
        visible: false,
        multipleSelection: []
      },
      // 签到记录弹框
      signDetailConfig: {
        visible: false,
        scheduleId: '' // 班期编号
      },
      // 筛选栏对象
      search: {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        // userName: '', // 学员姓名
        // userPhone: '', // 学员电话
        lecturerName: '', // 教师名称
        lecturerId: '', // 教师编号
        goodsId: '', // 课程编号
        goodsName: '', // 课程名称
        scheduleNum: '', // 班期数
        enrollment: { label: 'enrollmentDeptName', value: '' },
        // enrollmentDeptName: '', // 招生部门名字
        // enrollmentUserName: '', // 招生老师用户名字
        channelSource: '', // 渠道来源
        orderType: '', // 订单类型
        headteacherUserName: '', // 班主任
        deliveryStatus: '', // 交付状态
        assistantUserName: '', // 助教
        orderNo: '', // 订单号
        deliveryTime: ['', ''], // 交付日期
        courseWorkStatus: '',
        notInScheduleStatus: 1, // 未入班状态，1为入班 2未入班
        curriculumType: '',
        saleUserId: ''
      },

      emptySlot: true, // 是否开始筛选
      canShowHeadTeacher: false, // 是否显示批量更换班主任
      canShowAssistants: false, // 是否显示批量更换助教
      canShowDownJob: false, // 是否显示批量下载作业
      multipleSelection: [], // 批量选择的数据
      permsList: this.$route.meta.permsList || [],
      tableKey: 0,
      srcUrlIndex: 0
    }
  },
  computed: {
    isCanShowHeadTeacherFootBtn() {
      const bol =
        !this.canShowHeadTeacher ||
        !this.multipleSelection.length ||
        this.multipleSelection?.some(item => item?.deliverySubject === 2)
      return bol
    },
    isCanShowAssistantsFootBtn() {
      const bol =
        !this.multipleSelection.length ||
        this.multipleSelection?.some(item => item?.deliverySubject === 2)
      return bol
    },
    isCanShowDownJobFootBtn() {
      const bol =
        !this.canShowDownJob ||
        !this.multipleSelection.length ||
        this.multipleSelection?.some(item => item?.deliverySubject === 2)
      return bol
    },
    isCanShowSaleBtn() {
      const bol =
        !this.multipleSelection.length
      return bol
    }
  },
  mounted() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    // const list = JSON.parse(localStorage.getItem('tableColumns_deliverAllStudentColumns4'))
    // this.config.tableColumns = list || getColumns.call(this)
    this.$uweb && this.$uweb.setAction('Event_studentManagementAllStudent_page')
    // this.getList()
  },
  methods: {
    call(record) {
      if (!record.userPhone) {
        this.$message.error('学员手机号为空，无法呼叫!')
        return
      }
      if (record.phoneAreaCode !== '86') {
        this.$message.error(' 暂不支持国际号码呼叫!')
        return
      }
      eventBus.$emit('handleCallAllStudent', {
        id: record.deliveryInfoId,
        callPhone: record.userPhone
      })
    },
    prev(row) {
      row.srcUrlIndex -= 1
    },
    next(row) {
      row.srcUrlIndex += 1
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击详情按钮
    handleClickDetail(val) {
      this.detailDrawerConfig = {
        visible: true,
        id: val.deliveryInfoId
      }
    },
    // 点击恢复交付
    handleRecoverDeal(value) {
      this.renewDealConfig = {
        visible: true,
        row: value
      }
    },
    // 点击调整班期按钮
    handleClickSchedule(val) {
      this.adjustScheduleConfig = {
        visible: true,
        row: val
      }
    },
    // 点击关闭交付按钮
    handleClickCloseDelivery(val) {
      this.closeDeliveryConfig = {
        deliveryInfoId: val.deliveryInfoId,
        visible: true
      }
    },
    // 点击解除锁单按钮
    handleClickUnlockOrder(row) {
      this.unlockOrderConfig.deliveryInfoId = row.deliveryInfoId
      this.unlockOrderConfig.visible = true
    },
    // 点击锁单按钮
    handleClickLockOrder(row) {
      this.lockOrderConfig.deliveryInfoId = row.deliveryInfoId
      this.lockOrderConfig.visible = true
    },
    // 点击批量更换班主任
    handleClickReplaceHeadTeacher() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中至少1个学员')
      }
      let scheduleId = ''
      const deliveryInfoId = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.deliveryInfoId)
        scheduleId = next.scheduleId || ''
        return pre
      }, [])
      this.replaceHeadTeacherConfig = {
        visible: true,
        deliveryInfoId,
        scheduleId: scheduleId
      }
    },
    // 点击批量更换助教
    handleClickReplaceAssistants() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中至少1个学员')
      }
      const deliveryInfoId = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.deliveryInfoId)
        return pre
      }, [])
      this.replaceAssistantsConfig = {
        visible: true,
        goodsId: this.search.goodsId,
        deliveryInfoId: deliveryInfoId
      }
    },
    // 点击备注按钮
    handleClickRemake(val) {
      this.remakeConfig = {
        deliveryInfoId: val.deliveryInfoId,
        remark: val.remark,
        visible: true,
        type: 'offline'
      }
    },
    handleClickChangeSale() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: async res => {
          const ids = this.multipleSelection?.map(i => i.deliveryInfoId) ?? []
          const userId = res.user[0]?.userId
          const { code, data } = await userSalesChange({
            ids,
            userId
          })
          if (code === 1) {
            const msg = data.code === 20010 ? data.msg : '更换成功'
            this.$message.success(msg)
            this.getList()
          }
        }
      })
    },
    // 点击批量作业
    handleClickDownJob() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中至少1个学员')
      }
      const deliveryInfoId = []
      this.multipleSelection.forEach(item => {
        deliveryInfoId.push(item.deliveryInfoId)
      })
      this.downJobConfig = {
        visible: true,
        deliveryInfoId: deliveryInfoId
      }
    },
    // 获取列表数据
    getList() {
      this.emptySlot = false
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        ...this.search,
        [this.search.user.label]: this.search.user.value,
        [this.search.enrollment.label]: this.search.enrollment.value,
        deliveryStartTime: this.search.deliveryTime
          ? this.search.deliveryTime[0]
          : '',
        deliveryEndTime: this.search.deliveryTime
          ? this.search.deliveryTime[1]
          : '',
        orderStartTime: this.search.orderTime ? this.search.orderTime[0] : '',
        orderEndTime: this.search.orderTime ? this.search.orderTime[1] : '',
        saleUserId: this.search.saleUserId
      }
      delete params.user
      delete params.enrollment
      delete params.deliveryTime
      delete params.orderTime
      getDeliveryPage(params)
        .then(res => {
          res.data.records.forEach((v, index) => {
            v.index =
              (this.config.currentPage - 1) * this.config.pageSize + index + 1
            v.uid = v.userId
            v.srcUrlIndex = 0
          })
          this.tableKey++
          this.config.tableData = res.data.records
          this.config.total = Number(res.data.total)
          this.canShowAssistants = Boolean(this.search.goodsId)
          this.canShowHeadTeacher = Boolean(this.search.scheduleNum)
          this.loading = false
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选栏点击筛选按钮
    searchFn(search) {
      this.search = search
      this.config.currentPage = 1
      this.getList()
    },
    // 筛选条件清空
    searchClear(search) {
      this.emptySlot = true
      this.canShowHeadTeacher = false
      this.canShowAssistants = false
      this.canShowDownJob = false
      this.config.currentPage = 1
      this.searchFn(search)
    },
    // 自定义表头改变触发
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    },
    // 点击打开签到详情弹框
    handleClickSignDetail(row) {
      this.signDetailConfig = {
        visible: true,
        scheduleId: row.scheduleId,
        deliveryInfoId: row.deliveryInfoId
      }
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
      const sameScheduleIds = row.filter(
        i => row[0].scheduleId === i.scheduleId && i.scheduleId !== '0'
      ).length
      this.canShowDownJob = sameScheduleIds === row.length
    },
    // 关闭弹框并请求数据
    closeDialog(key) {
      this[key].visible = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap::v-deep {
  height: calc(100vh - 282px);
  padding: 0 20px;
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      height: 12px;
    }
  }
  .el-table__fixed-body-wrapper{
    height:calc(100% - 50px) !important;
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.courseWorkStatus {
  width: 56px;
  display: inline-block;
  height: 22px;
  border-radius: 12px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  line-height: 22px;
  text-align: center;
}
// 1未开班
.status1 {
  background: #eff2f6;
  color: #777777;
}
// 已完结
.status2 {
  color: #00b42a;
  background: #e6f7ea;
}
</style>
