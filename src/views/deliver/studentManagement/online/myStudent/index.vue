<template>
  <!-- 全部学员 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      row-key="deliveryInfoId"
      keys="online_my_student"
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
          :current-page="config.currentPage"
          :page-size="config.pageSize"
          @searchFn="searchFn"
          @change="handleCheckedTableColumnsChange"
          @clear="searchClear"
          @openChangeRead="openChangeReadSettings"
        />
      </template>
      <template slot="courseWorkStatus" slot-scope="{ row }">
        <span class="courseWorkStatus" :class="`status${row.courseWorkStatus}`">
          {{ courseWorkStatus[row.courseWorkStatus] }}
        </span>
      </template>
      <template slot="deliveryStatusName" slot-scope="{ row }">
        <deliveryStatusSpan :key="tableKey" :current="row" />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="handleClickDetail(row)">详情</el-button>
        <el-button
          v-permission="['web:myRecorded:postpone', permsList]"
          :disabled="!row.allowDelayFailureTime"
          type="text"
          @click="handleOpenDelay(row)"
        >延期</el-button>
        <el-button
          v-permission="['web:myRecorded:closeDelivery', permsList]"
          :disabled="!row.isGive || row.deliveryStatusName === '已关闭'"
          type="text"
          @click="handleOpenCloseDeliver(row)"
        >关闭交付</el-button>
        <el-button
          v-if="!row.isPackage"
          v-permission="['web:myRecorded:alter', permsList]"
          type="text"
          :disabled="
            row.isGive ||
              ['已关闭', '锁定交付'].includes(row.deliveryStatusName)
          "
          @click="handleOpenChangeRead(row)"
        >换人就读</el-button>
        <el-button type="text" @click="handleClickRemake(row)">备注</el-button>
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
  </div>
</template>

<script>
import filterTop from './filterTop'
import { getColumns } from './columns.js'
import detailOnlineDrawer from '../../components/detailOnlineDrawer'
import changeReadDialog from '../../components/changeReadDialog'
import delayPeriodsDialog from '../../components/delayPeriodsDialog'
import closeDeliverDialog from '../../components/closeDeliverDialog'
import changeReadSettingDialog from '../../components/changeReadSettingDialog'
import { courseWorkStatus } from '@/utils/enum'
import remakeDialog from '../../components/remakeDialog'
import deliveryStatusSpan from '../../../components/deliveryStatusSpan'
import { deliveryOnlinePage } from '@/api/deliver/studentManagement'
export default {
  components: {
    filterTop,
    detailOnlineDrawer,
    remakeDialog,
    deliveryStatusSpan,
    changeReadDialog,
    delayPeriodsDialog,
    closeDeliverDialog,
    changeReadSettingDialog
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
        type: 'online'
      },
      search: {},
      emptySlot: true, // 是否开始筛选
      permsList: this.$route.meta.permsList || [],
      tableKey: 0,
      srcUrlIndex: 0
    }
  },
  activated() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    // this.getLastMonthDateRange()
    // this.getList()
    this.$uweb?.setAction('Event_MyPlay_page')
  },
  mounted() {
    this.$store.dispatch('user/viewingFlag', 'studentManagement')
    // this.getLastMonthDateRange()
    // this.getList()
    this.$uweb?.setAction('Event_MyPlay_page')
  },
  methods: {
    // getLastMonthDateRange() {
    //   const endDate = new Date() // 当前日期
    //   const startDate = new Date() // 当前日期

    //   // 设置开始日期为30天前
    //   startDate.setDate(startDate.getDate() - 30)

    //   const formatDateString = date => {
    //     const year = date.getFullYear()
    //     const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
    //     const day = String(date.getDate()).padStart(2, '0')
    //     return `${year}-${month}-${day}`
    //   }
    //   // 返回开始日期和结束日期
    //   this.search.orderTime = [
    //     formatDateString(startDate),
    //     formatDateString(endDate)
    //   ]
    // },
    handleOpenChangeRead(row) {
      this.$refs.changeReadDialog.open(row)
    },
    openChangeReadSettings(row) {
      this.$refs.changeReadSettingDialog.open(row)
    },
    handleOpenDelay(row) {
      this.$refs.delayPeriodsDialog.open(row)
      this.$uweb?.setAction('Event_PlayPostpone_Btn')
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
        id: val.id,
        userId: val.userId,
        subOrderId: val.subOrderId
      }
    },
    // 点击备注按钮
    handleClickRemake(val) {
      this.$uweb?.setAction('Event_Remark_Btn')
      this.remakeConfig = {
        id: val.id,
        remark: val.remark,
        visible: true,
        type: 'online'
      }
    },
    // 获取列表数据
    getList() {
      this.emptySlot = false
      this.loading = true
      console.log(this.search)
      const params = {
        studentType: 1,
        current: this.config.currentPage,
        size: this.config.pageSize,
        [this?.search?.user?.label]: this.search?.user?.value || undefined,
        teacherId: this.search.teacherId || undefined,
        goodsId: this.search.goodsId || undefined,
        watchClassPermission: this.search.watchClassPermission || undefined,
        orderNo: this.search.orderNo || undefined,
        deliveryStatusList:
          this.search.deliveryStatusList?.join(',') || undefined,
        orderStartDate:
          this.search.orderTime && this.search?.orderTime[0]
            ? this.search?.orderTime[0]
            : undefined,
        orderEndDate:
          this.search.orderTime && this.search.orderTime[1]
            ? this.search.orderTime[1]
            : undefined
      }
      deliveryOnlinePage(params)
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
