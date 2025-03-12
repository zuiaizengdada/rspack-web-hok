<template>
  <!-- 我的学员 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      row-key="deliveryInfoId"
      keys="offline_my_student"
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
          :can-export="canExport"
          @searchFn="searchFn"
          @clear="searchClear"
          @change="handleCheckedTableColumnsChange"
        />
      </template>
      <template slot="footer">
        <el-button
          v-permission="['web:myStudent:batchAdjust', permsList]"
          :disabled="isFootBtn"
          type="text"
          @click="handleBatchAdjustSchedule"
          >批量调整班期</el-button
        >
        <el-button
          v-permission="['web:myStudent:batchHelpSign', permsList]"
          :disabled="isFootBtn"
          type="text"
          @click="handleBatchClickBehalfSign"
          >批量代签</el-button
        >
        <el-button
          v-permission="['web:myStudent:batchDownWork', permsList]"
          type="text"
          :disabled="isFootBtn"
          @click="handleClickDownJob"
          >批量下载作业</el-button
        >
        <el-button
          v-permission="['web:myStudent:batchUploadWork', permsList]"
          type="text"
          :disabled="isFootBtn"
          @click="handleClickUploadCoureWork"
          >批量上传作业</el-button
        >
        <el-button
          type="text"
          :disabled="isCanShowSaleBtn"
          @click="handleClickChangeSale"
          >更换销售人员</el-button
        >
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          v-if="scope.row.deliverySubject !== 2"
          v-permission="['web:myStudent:detail', permsList]"
          type="text"
          @click="handleClickDetail(scope.row)"
          >详情</el-button
        >
        <el-button
          v-if="[5].includes(scope.row.deliveryStatus)"
          v-permission="['web:myRenewDeal', permsList]"
          type="text"
          @click="handleRecoverDeal(scope.row)"
          >恢复交付</el-button
        >
        <!-- <el-button
          v-permission="['web:myStudent:remark', permsList]"
          type="text"
          @click="handleClickRemake(scope.row)"
        >备注</el-button> -->
        <el-button
          v-if="
            [1, 3].includes(scope.row.deliveryStatus) &&
            scope.row.goodsType === 5 &&
            scope.row.deliverySubject !== 2
          "
          v-permission="['web:myStudent:adjust', permsList]"
          type="text"
          @click="handleClickSchedule(scope.row)"
          >调整班期</el-button
        >
        <el-button
          v-if="
            [1, 2, 3].includes(scope.row.deliveryStatus) &&
            [1, 5].includes(scope.row.orderType) &&
            scope.row.deliverySubject !== 2 &&
            !scope.row.isPackage
          "
          v-permission="['web:myStudent:lock', permsList]"
          type="text"
          @click="handleClickLockOrder(scope.row)"
          >锁单</el-button
        >
        <el-button
          v-if="
            [1, 2].includes(scope.row.deliveryStatus) &&
            scope.row.goodsType === 5 &&
            scope.row.scheduleNum &&
            scope.row.deliverySubject !== 2
          "
          v-permission="['web:myStudent:helpSign', permsList]"
          type="text"
          @click="handleClickBehalfSign(scope.row)"
          >代签</el-button
        >
        <el-button
          v-if="
            [1, 2, 3].includes(scope.row.deliveryStatus) &&
            [2, 3, 4].includes(scope.row.orderType) &&
            scope.row.deliverySubject !== 2
          "
          v-permission="['web:myStudent:close', permsList]"
          type="text"
          @click="handleClickCloseDelivery(scope.row)"
          >关闭交付</el-button
        >
        <el-button
          v-if="transferFilter(scope.row)"
          v-permission="['web:myStudent:shift', permsList]"
          type="text"
          @click="handleClickTransfer(scope.row)"
          >转课</el-button
        >
        <!-- sessionCount存在表示线下课，已入班 -->
        <el-button
          v-if="
            (scope.row.sessionCount || scope.row.sessionCount === 0) &&
            scope.row.deliverySubject !== 2
          "
          v-permission="['web:myStudent:uploadWork', permsList]"
          type="text"
          @click="handleClickCourseWork(scope.row)"
          >作业</el-button
        >
        <el-button
          v-if="scope.row.deliverySubject !== 2"
          v-permission="['web:myStudent:followUp', permsList]"
          type="text"
          @click="handleClickFollowUp(scope.row)"
          >跟进</el-button
        >
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
                    >上一张</el-button
                  >
                  <el-button
                    type="text"
                    :disabled="row.srcUrlIndex === row.images.length - 1"
                    @click="next(row)"
                    >下一张</el-button
                  >
                </div>
              </div>
            </div>
            <span
              v-if="[4, 6].includes(row.deliveryStatus)"
              slot="reference"
              style="color: #0c6fff; margin-left: 10px"
              >原因</span
            >
          </el-popover>
        </deliveryStatusSpan>
      </template>
      <template slot="userName" slot-scope="scope">
        <span
          class="a_link hiddenText"
          @click="handleClickStudentInfo(scope.row)"
        >
          {{ scope.row.userName || '未知' }}
        </span>
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
      :order-no="detailDrawerConfig.orderNo"
    />
    <!-- 调整班期弹框 -->
    <adjustScheduleDialog
      :config="adjustScheduleConfig"
      type="2"
      @success="closeDialog('adjustScheduleConfig')"
    />
    <!-- 锁单弹框 -->
    <lockOrderDialog
      :config="lockOrderConfig"
      @success="closeDialog('lockOrderConfig')"
    />
    <!-- 解除锁单弹框 -->
    <unlockOrderDialog
      :config="unlockOrderConfig"
      @success="closeDialog('unlockOrderConfig')"
    />
    <!-- 代签弹框 -->
    <behalfSignDialog
      :config="behalfSignConfig"
      @success="closeDialog('behalfSignConfig')"
    />
    <!-- 关闭交付弹框 -->
    <closeDeliveryDialog
      :config="closeDeliveryConfig"
      @success="closeDialog('closeDeliveryConfig')"
    />
    <!-- 备注弹框 -->
    <remakeDialog
      :config="remakeConfig"
      @success="closeDialog('remakeConfig')"
    />
    <!-- 转课弹框 -->
    <transferDrawer
      :user-name="transferDrawerConfig.userName"
      :user-phone="transferDrawerConfig.userPhone"
      :order-no="transferDrawerConfig.orderNo"
      :user-id="transferDrawerConfig.userId"
      :visible.sync="transferDrawerConfig.visible"
      append-to-body
      :delivery-info-id="transferDrawerConfig.deliveryInfoId"
    />
    <!-- 单个上传作业弹框 -->
    <uploadCourseWorkDrawer
      :id="courseWorkConfig.deliveryInfoId"
      :config="courseWorkConfig"
      :visible.sync="courseWorkConfig.visible"
      append-to-body
      @close="closeDialog('courseWorkConfig')"
    />
    <!-- 批量上传作业弹框 -->
    <batchUploadCoureWorkDrawer
      :config="batchCourseWorkConfig"
      :visible.sync="batchCourseWorkConfig.visible"
      append-to-body
      @close="closeDialog('batchCourseWorkConfig')"
    />
    <!-- 批量调整班期 -->
    <batchAdjustScheduleDialog
      :config="batchAdjustScheduleConfig"
      @success="closeDialog('batchAdjustScheduleConfig')"
    />
    <!-- 批量下载作业弹框 -->
    <downJobDialog :config="downJobConfig" />
    <!-- 用户基本信息弹框 -->
    <studentInfoDialog
      :config="studentInfoConfig"
      @success="closeDialog('studentInfoConfig')"
    />
    <!-- 签到记录弹框 -->
    <signDetailDialog :config="signDetailConfig" />
    <!-- 跟新弹框 -->
    <followUpDialog :config.sync="followUpConfig" @handleOk="handleOkDiaLog" />
  </div>
</template>

<script>
import filterTop from './filterTop'
import detailDrawer from '../../components/detailDrawer'
import adjustScheduleDialog from '../../components/adjustScheduleDialog'
import followUpDialog from '../../components/followUpDialog'
import { getColumns } from './columns.js'
import lockOrderDialog from '../../components/lockOrderDialog'
import unlockOrderDialog from '../../components/unlockOrderDialog'
import behalfSignDialog from '../../components/behalfSignDialog'
import closeDeliveryDialog from '../../components/closeDeliveryDialog'
import transferDrawer from '../../components/transferDrawer'
import remakeDialog from '../../components/remakeDialog'
import batchAdjustScheduleDialog from '../../components/batchAdjustScheduleDialog'
import studentInfoDialog from '../../components/studentInfoDialog'
import signDetailDialog from '../../components/signDetailDialog'
import downJobDialog from '../../components/downJobDialog'
import uploadCourseWorkDrawer from '../../components/uploadCoureWorkDrawer'
import batchUploadCoureWorkDrawer from '../../components/batchUploadCoureWorkDrawer'
// import { isAllEqual } from '@/utils'
import { courseWorkStatus } from '@/utils/enum'
import deliveryStatusSpan from '../../../components/deliveryStatusSpan'
import {
  getDeliveryMyPage,
  userSalesChange
} from '@/api/deliver/studentManagement'
export default {
  components: {
    filterTop,
    detailDrawer,
    lockOrderDialog,
    unlockOrderDialog,
    adjustScheduleDialog,
    behalfSignDialog,
    closeDeliveryDialog,
    transferDrawer,
    remakeDialog,
    batchAdjustScheduleDialog,
    studentInfoDialog,
    followUpDialog,
    signDetailDialog,
    downJobDialog,
    uploadCourseWorkDrawer,
    batchUploadCoureWorkDrawer,
    deliveryStatusSpan
  },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'userName',
        'userPhone',
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
        orderType: '', // 1新购 2转课 3赠送
        shiftStatus: '', // 转课状态
        deliveryStatus: '', // 交付状态
        deliveryTime: ['', ''], // 交付日期
        orderTime: ['', ''], // 订单创建日期
        orderNo: '', // 订单号
        notInScheduleStatus: 1, // 未入班状态，1为入班 2未入班
        courseWorkStatus: '',
        curriculumType: ''
      },
      // 详情弹框
      detailDrawerConfig: {
        visible: false,
        id: ''
      },
      // 锁单弹框
      lockOrderConfig: {
        visible: false,
        deliveryInfoId: ''
      },
      // 解除锁单弹框
      unlockOrderConfig: {
        visible: false,
        deliveryInfoId: ''
      },
      // 调整班期弹框
      adjustScheduleConfig: {
        visible: false,
        row: {}
      },
      // 代签弹框
      behalfSignConfig: {
        visible: false,
        scheduleId: '',
        deliveryInfoId: '',
        isBatch: false
      },
      // 关闭交付弹框
      closeDeliveryConfig: {
        visible: false,
        deliveryInfoId: ''
      },
      // 转课弹框
      transferDrawerConfig: {
        deliveryInfoId: '',
        userName: '',
        userId: '',
        orderNo: '',
        userPhone: '',
        visible: false
      },
      // 单个上传作业
      courseWorkConfig: {
        deliveryInfoId: '',
        visible: false,
        userName: '',
        userPhone: ''
      },
      // 跟进弹框
      followUpConfig: {
        visible: false,
        row: ''
      },
      // 批量上传作业
      batchCourseWorkConfig: {
        visible: false,
        userList: []
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
      // 批量调整班期弹框
      batchAdjustScheduleConfig: {
        visible: false,
        goodsName: '',
        goodsId: '',
        scheduleId: '',
        userList: []
      },
      // 是否显示批量下载作业
      downJobConfig: {
        visible: false,
        multipleSelection: []
      },
      // 用户基本信息弹框
      studentInfoConfig: {
        visible: false,
        userId: '',
        platformUserId: ''
      },
      // 签到记录弹框
      signDetailConfig: {
        visible: false,
        scheduleId: '' // 班期编号
      },

      emptySlot: true, // 是否开始筛选
      canShowAdjustSchedule: false, // 是否显示批量调整班期
      canExport: false, // 能否导出数据
      multipleSelection: [], // 批量选择的数据
      permsList: this.$route.meta.permsList || [],
      canShowDownJob: false, // 是否显示批量下载作业
      tableKey: 0,
      srcUrlIndex: 0
    }
  },
  computed: {
    isFootBtn() {
      const bol =
        !this.canShowAdjustSchedule ||
        !this.multipleSelection.length ||
        this.multipleSelection?.some(item => item?.deliverySubject === 2)
      return bol
    },
    isCanShowSaleBtn() {
      const bol = !this.multipleSelection.length
      return bol
    }
  },
  mounted() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    // const list = JSON.parse(localStorage.getItem('tableColumns_deliverMystudentColumns4'))
    // this.config.tableColumns = list || getColumns.call(this)
    this.$uweb && this.$uweb.setAction('Event_studentManagementMyStudent_page')
    this.getList()
  },
  methods: {
    isMoreThan90Days(date) {
      const currentDate = new Date() // 获取当前时间
      const targetDate = new Date(date) // 将传入的时间转换为Date对象
      const timeDifference = currentDate - targetDate // 计算时间差（毫秒）
      const daysDifference = timeDifference / (1000 * 3600 * 24) // 将毫秒转换为天数
      return daysDifference > 90 // 返回是否大于90天
    },
    transferFilter(row) {
      if ([3, 4].includes(row.goodsType)) {
        const isDays = this.isMoreThan90Days(row.orderCreateTime)
        if (isDays) {
          return [1].includes(row.deliveryStatus)
        } else {
          return [1, 2, 5, 6].includes(row.deliveryStatus)
        }
      } else {
        const bol =
          [1, 3, 6].includes(row.deliveryStatus) && row.orderType === 1
        return (
          ((row.deliveryStatus === 4 && row.shiftFlag === 2) || bol) &&
          row.deliverySubject !== 2 &&
          row.isPackage === false
        )
      }
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
        id: val.deliveryInfoId,
        orderNo: val.orderNo
      }
    },
    // 点击恢复交付
    handleRecoverDeal(value) {
      this.renewDealConfig = {
        visible: true,
        row: value
      }
    },
    // 点击锁单按钮
    handleClickLockOrder(row) {
      this.lockOrderConfig = {
        deliveryInfoId: row.deliveryInfoId,
        visible: true
      }
    },
    // 点击解除锁单弹框
    handleClickUnLockOrder(row) {
      this.unlockOrderConfig = {
        deliveryInfoId: row.deliveryInfoId,
        visible: true
      }
    },
    // 点击调整班期按钮
    handleClickSchedule(val) {
      this.adjustScheduleConfig = {
        visible: true,
        row: val
      }
    },
    // 点击代签按钮
    handleClickBehalfSign(val) {
      this.behalfSignConfig = {
        deliveryInfoId: val.deliveryInfoId,
        scheduleId: val.scheduleId,
        visible: true,
        isBatch: false
      }
    },
    // 点击批量代签按钮
    handleBatchClickBehalfSign() {
      const deliveryInfoIds = this.multipleSelection
        .filter(
          i =>
            [1, 2].includes(i.deliveryStatus) &&
            i.goodsType === 5 &&
            i.scheduleNum
        )
        .map(i => i.deliveryInfoId)
      if (!deliveryInfoIds.length) {
        this.$notify.error({
          title: '操作失败',
          message: '请至少选择一个符合条件代签的学员'
        })
        return
      }
      this.behalfSignConfig = {
        deliveryInfoIds,
        deliveryInfoId: deliveryInfoIds[0],
        scheduleId: this.multipleSelection[0].scheduleId,
        visible: true,
        isBatch: true
      }
    },
    // 点击关闭交付按钮
    handleClickCloseDelivery(val) {
      this.closeDeliveryConfig = {
        deliveryInfoId: val.deliveryInfoId,
        visible: true
      }
    },
    // 点击转课按钮
    handleClickTransfer(val) {
      this.transferDrawerConfig = {
        deliveryInfoId: val.deliveryInfoId,
        userName: val.userName,
        userId: val.userId,
        orderNo: val.orderNo,
        userPhone: val.userPhone,
        visible: true
      }
    },
    // 点击单个上传作业按钮
    handleClickCourseWork(val) {
      this.courseWorkConfig = {
        deliveryInfoId: val.deliveryInfoId,
        visible: true,
        userName: val.userName,
        userPhone: val.userPhone
      }
    },
    handleClickFollowUp(val) {
      this.$uweb && this.$uweb.setAction('Event_follow_click')
      this.followUpConfig = {
        row: val,
        visible: true
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
    // 自定义表头改变触发
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    },
    // 点击批量调整班期弹框
    handleBatchAdjustSchedule() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中至少1个学员')
      }
      let goodsName = ''
      let goodsId = ''
      let scheduleId = ''
      const userList = this.multipleSelection.reduce((pre, next) => {
        pre.push({
          userId: next.userId,
          deliveryInfoId: next.deliveryInfoId,
          userName: next.userName
        })
        goodsName = next.goodsName
        goodsId = next.goodsId
        scheduleId = next.scheduleId
        return pre
      }, [])
      this.batchAdjustScheduleConfig = {
        visible: true,
        goodsName,
        goodsId,
        scheduleId,
        userList
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
    // 点击批量下载作业
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
    // 批量上传作业
    handleClickUploadCoureWork() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中至少1个学员')
      }
      const userList = this.multipleSelection
        .filter(item => item.courseWorkStatus !== 2)
        .map(item => {
          return {
            deliveryInfoId: item.deliveryInfoId,
            userPhone: item.userPhone,
            userName: item.userName
          }
        })
      this.batchCourseWorkConfig = {
        visible: true,
        userList
      }
    },
    // 点击用户姓名展示用户基本信息弹框
    handleClickStudentInfo(row) {
      this.studentInfoConfig = {
        userId: row.userId,
        platformUserId: row.platformUserId,
        visible: true
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
        orderEndTime: this.search.orderTime ? this.search.orderTime[1] : ''
      }
      delete params.user
      delete params.enrollment
      delete params.deliveryTime
      delete params.orderTime
      getDeliveryMyPage(params)
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
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.canShowAdjustSchedule = Boolean(this.search.scheduleNum)
          this.canExport = Boolean(this.search.scheduleNum)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选栏点击筛选按钮
    searchFn(search) {
      this.config.currentPage = 1
      this.search = search
      this.getList()
    },
    // 筛选条件清空
    searchClear(search) {
      this.emptySlot = true
      this.canShowAdjustSchedule = false
      this.config.currentPage = 1
      this.searchFn(search)
    },
    // 关闭相应弹框并请求列表
    closeDialog(key) {
      this[key].visible = false
      this.getList()
    },

    handleOkDiaLog() {
      this.getList()
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
      //   // 有0表示无班期禁止下载
      //   this.canShowDownJob = false
      //   return
      // }
      // const scheduleId = row.map(item => {
      //   item.scheduleId
      // })
      // // 判断是否禁用批量下载作业
      // if (!isAllEqual(scheduleId)) {
      //    this.canShowDownJob = false
      // } else {
      //   this.canShowDownJob = true
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 282px);
  padding: 0 20px;
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      height: 12px;
    }
  }
  .el-table__fixed-body-wrapper {
    height: calc(100% - 56px) !important;
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
.hiddenText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100px;
}

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
