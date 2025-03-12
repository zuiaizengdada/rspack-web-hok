<template>
  <!-- 部门学员 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      row-key="deliveryInfoId"
      keys="package_department_student"
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
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop
          ref="filterTop"
          :loading="loading"
          :columns="config.tableColumns"
          @searchFn="searchFn"
          @change="handleCheckedTableColumnsChange"
          @clear="searchClear"
          @openChangeRead="openChangeReadSettings"
        />
      </template>
      <!-- <template slot="footer">
        <el-button
          :disabled="isCanShowSaleBtn"
          type="text"
          @click="handleBatchAdjustSchedule"
        >批量调整班期</el-button>
      </template> -->
      <template slot="courseWorkStatus" slot-scope="{ row }">
        <span class="courseWorkStatus" :class="`status${row.courseWorkStatus}`">
          {{ courseWorkStatus[row.courseWorkStatus] }}
        </span>
      </template>
      <template slot="deliveryStatusName" slot-scope="{ row }">
        <deliveryStatusSpan :key="tableKey" :current="row">
          <el-popover placement="top-start" trigger="hover">
            <div>
              <span>
                {{
                  row.deliveryStatus === 4 ? row.lockReason : row.closeReason
                }}
              </span>
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
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['web:allStudent:detail', permsList]"
          type="text"
          @click="handleClickDetail(row)"
        >
          详情
        </el-button>
        <!--        <el-button-->
        <!--          v-permission="['web:allRecorded:postpone', permsList]"-->
        <!--          :disabled="!row.allowDelayFailureTime"-->
        <!--          type="text"-->
        <!--          @click="handleOpenDelay(row)"-->
        <!--        >延期</el-button>-->
        <el-button
          v-if="[4].includes(row.orderType)"
          v-permission="['web:allRecorded:closeDelivery', permsList]"
          :disabled="row.deliveryStatusName === '已关闭'"
          type="text"
          @click="handleOpenCloseDeliver(row)"
          >关闭交付</el-button
        >
        <el-button
          v-if="[1].includes(row.orderType) && row.deliveryStatus !== 5"
          v-permission="['web:allRecorded:alter', permsList]"
          :disabled="
            row.isGive ||
            ['已关闭', '锁定交付'].includes(row.deliveryStatusName)
          "
          type="text"
          @click="handleOpenChangeRead(row)"
        >
          换人就读
        </el-button>
        <el-button
          v-if="
            [1, 2, 3].includes(row.deliveryStatus) &&
            [1, 5, 4].includes(row.orderType) &&
            row.deliverySubject !== 2
          "
          v-permission="['web:allRecorded:lock', permsList]"
          type="text"
          @click="handleClickLockOrder(row)"
          >锁单</el-button
        >
        <el-button
          v-if="row.deliveryStatus === 4 && row.deliverySubject !== 2"
          v-permission="['web:allRecorded:lock', permsList]"
          type="text"
          @click="handleClickUnlockOrder(row)"
          >解锁单</el-button
        >
        <!-- <el-button
          v-if="
            ((row.deliveryStatus === 4 && row.shiftFlag === 2) ||
              ([1, 3, 6].includes(row.deliveryStatus) &&
                row.orderType === 1)) &&
              row.deliverySubject !== 2
          "
          v-permission="['web:allRecorded:transfer', permsList]"
          type="text"
          @click="handleClickTransfer(row)"
        >转课</el-button> -->
        <el-button type="text" @click="handleClickRemake(row)">备注</el-button>
        <el-button
          v-if="[1, 3].includes(row.deliveryStatus)"
          v-permission="['web:allRecorded:moveClass', permsList]"
          type="text"
          @click="handleClickSchedule(row)"
          >调班</el-button
        >
        <!--        <el-button type="text" @click="call(row)">呼叫</el-button>-->
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
    <detailOnlineDrawer
      :id="detailDrawerConfig.id"
      :user-id="detailDrawerConfig.userId"
      :sub-order-id="detailDrawerConfig.subOrderId"
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
    />
    <!-- 备注弹框 -->
    <remakeDialog
      :config="remakeConfig"
      @success="closeDialog('remakeConfig')"
    />

    <!-- 换人就读弹窗 -->
    <changeReadDialog ref="changeReadDialog" />

    <!-- 延期弹窗 -->
    <delayPeriodsDialog ref="delayPeriodsDialog" @success="getList" />

    <!-- 关闭交付弹窗 -->
    <closeDeliverDialog ref="closeDeliverDialog" @success="getList" />

    <!-- 换人就读设置弹窗 -->
    <changeReadSettingDialog ref="changeReadSettingDialog" />

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
    <!-- 批量调整班期 -->
    <batchAdjustScheduleDialog
      :config="batchAdjustScheduleConfig"
      type="live"
      @success="closeDialog('batchAdjustScheduleConfig')"
    />
    <!-- 调整班期弹框 -->
    <adjustScheduleDialog
      :config="adjustScheduleConfig"
      type="3"
      @success="closeDialog('adjustScheduleConfig')"
    />
  </div>
</template>

<script>
import filterTop from './filterTop'
import { getColumns } from './columns.js'
import detailOnlineDrawer from '../components/detailOnlineDrawer'
import changeReadDialog from '../../components/changeReadDialog'
import delayPeriodsDialog from '../../components/delayPeriodsDialog'
import closeDeliverDialog from '../../components/closeDeliverDialog'
import changeReadSettingDialog from '../../components/changeReadSettingDialog'
import { courseWorkStatus } from '@/utils/enum'
import remakeDialog from '../../components/remakeDialog'
import deliveryStatusSpan from '../../../components/deliveryStatusSpan'
import batchAdjustScheduleDialog from '../../components/batchAdjustScheduleDialog'
import adjustScheduleDialog from '../../components/adjustScheduleDialog.vue'
import {
  deliveryLivePage,
  packageUserSalesChange
} from '@/api/deliver/studentManagement'
import lockOrderDialog from '@/views/deliver/studentManagement/components/lockOrderDialog.vue'
import unlockOrderDialog from '@/views/deliver/studentManagement/components/unlockOrderDialog.vue'
import transferDrawer from '@/views/deliver/studentManagement/components/transferDrawer.vue'

export default {
  components: {
    transferDrawer,
    unlockOrderDialog,
    lockOrderDialog,
    filterTop,
    detailOnlineDrawer,
    remakeDialog,
    deliveryStatusSpan,
    changeReadDialog,
    delayPeriodsDialog,
    closeDeliverDialog,
    changeReadSettingDialog,
    batchAdjustScheduleDialog,
    adjustScheduleDialog
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
        id: '',
        userId: '',
        subOrderId: ''
      },
      // 备注弹框
      remakeConfig: {
        visible: false,
        deliveryInfoId: '',
        remark: '',
        type: 'live'
      },
      search: {},
      emptySlot: true, // 是否开始筛选
      permsList: this.$route.meta.permsList || [],
      tableKey: 0,
      srcUrlIndex: 0,
      // new
      multipleSelection: [], // 批量选择的数据
      // 锁单弹框
      lockOrderConfig: {
        visible: false,
        deliveryInfoId: ''
      },
      // 解除锁单弹框
      unlockOrderConfig: {
        deliveryInfoId: '',
        visible: false
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
      // 批量调整班期弹框
      batchAdjustScheduleConfig: {
        visible: false,
        goodsName: '',
        goodsId: '',
        scheduleId: '',
        userList: []
      },
      // 调整班期弹框
      adjustScheduleConfig: {
        visible: false,
        row: {}
      }
    }
  },
  computed: {
    isCanShowSaleBtn() {
      return !this.multipleSelection.length
    }
  },
  activated() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    this.getLastMonthDateRange()
    this.getList()
    this.$uweb?.setAction('Event_MyPlay_page')
  },
  mounted() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    this.getLastMonthDateRange()
    this.getList()
    this.$uweb?.setAction('Event_MyPlay_page')
  },
  methods: {
    // 点击调整班期按钮
    handleClickSchedule(val) {
      this.adjustScheduleConfig = {
        visible: true,
        row: val
      }
    },
    // 点击批量调整班期弹框
    handleBatchAdjustSchedule() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择课程再进行批量调整班级')
      }
      // multipleSelection不是同一个课程
      if (
        this.multipleSelection.some(
          i => i.goodsId !== this.multipleSelection[0].goodsId
        )
      ) {
        return this.$message.error('请选中同一个课程')
      }
      const arr = this.multipleSelection.filter(i =>
        [1, 3].includes(i.deliveryStatus)
      )
      if (arr.length === 0) {
        return this.$message.error('请选择待交付、延期交付的班级')
      }
      let goodsName = ''
      let goodsId = ''
      let scheduleId = ''

      const userList = arr.reduce((pre, next) => {
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
    getLastMonthDateRange() {
      const endDate = new Date() // 当前日期
      const startDate = new Date() // 当前日期

      // 设置开始日期为30天前
      startDate.setDate(startDate.getDate() - 30)

      const formatDateString = date => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      // 返回开始日期和结束日期
      this.search.orderTime = [
        formatDateString(startDate),
        formatDateString(endDate)
      ]
    },
    handleOpenChangeRead(row) {
      this.$refs.changeReadDialog.open(row)
    },
    openChangeReadSettings(row) {
      this.$refs.changeReadSettingDialog.open(row)
    },
    handleOpenDelay(row) {
      this.$uweb?.setAction('Event_PlayPostpone_Btn')
      this.$refs.delayPeriodsDialog.open(row)
    },
    handleOpenCloseDeliver(row) {
      this.$uweb?.setAction('Event_CloseDelivery_Btn')
      this.$refs.closeDeliverDialog.open(row)
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
      this.$uweb?.setAction('Event_PlayDetails_page')
      this.detailDrawerConfig = {
        visible: true,
        id: val.deliveryInfoId,
        userId: val.userId,
        subOrderId: val.subOrderId
      }
    },
    // 点击备注按钮
    handleClickRemake(val) {
      this.$uweb?.setAction('Event_Remark_Btn')
      this.remakeConfig = {
        id: val.deliveryInfoId,
        remark: val.remark,
        visible: true,
        type: 'live'
      }
    },
    // 获取列表数据
    getList() {
      this.emptySlot = false
      this.loading = true
      const params = {
        studentType: 2,
        current: this.config.currentPage,
        size: this.config.pageSize,
        [this?.search?.user?.label]: this.search?.user?.value || undefined,
        lecturerId: this.search.lecturerId || undefined,
        goodsId: this.search.goodsId || undefined,
        orderNo: this.search.orderNo || undefined,
        deliveryStatus: this.search.deliveryStatus || '',
        orderStartTime:
          this.search.orderTime && this.search?.orderTime[0]
            ? this.search?.orderTime[0]
            : undefined,
        orderEndTime:
          this.search.orderTime && this.search.orderTime[1]
            ? this.search.orderTime[1]
            : undefined,
        watchClassPermission: this.search.watchClassPermission || undefined,
        saleUserId: this.search.saleUserId, // 销售跟进
        enrollmentUserId: this.search.enrollmentUserId, // 招生老师
        joinClassStatus: this.search.joinClassStatus,
        joinScheduleStartTime:
          this.search.joinTime && this.search?.joinTime[0]
            ? this.search?.joinTime[0]
            : undefined,
        joinScheduleEndTime:
          this.search.joinTime && this.search.joinTime[1]
            ? this.search.joinTime[1]
            : undefined
      }
      // Test 后端接口部署之前用 录播课接口
      // deliveryOnlinePage(params)
      deliveryLivePage(params, 2)
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
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选栏点击筛选按钮
    searchFn(val) {
      this.search = val
      this.config.currentPage = 1
      this.getList()
    },
    // 筛选条件清空
    searchClear() {
      this.emptySlot = true
      this.$refs.filterTop.reset()
    },
    // 自定义表头改变触发
    handleCheckedTableColumnsChange() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    },
    // 关闭弹框并请求数据
    closeDialog(key) {
      this[key].visible = false
      this.getList()
    },
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    handleClickChangeSale() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: async res => {
          const ids = this.multipleSelection?.map(i => i.id) ?? []
          const userId = res.user[0]?.userId
          const { code, data } = await packageUserSalesChange({
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
    // 点击锁单按钮
    handleClickLockOrder(row) {
      this.lockOrderConfig = {
        deliveryInfoId: row.deliveryInfoId,
        visible: true
      }
    },
    // 点击解除锁单按钮
    handleClickUnlockOrder(row) {
      this.unlockOrderConfig.deliveryInfoId = row.deliveryInfoId
      this.unlockOrderConfig.visible = true
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
  .el-table__fixed-body-wrapper {
    height: calc(100% - 60px) !important;
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
