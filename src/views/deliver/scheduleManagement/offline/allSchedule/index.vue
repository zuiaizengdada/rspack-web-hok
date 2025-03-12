<template>
  <!-- 全部班期 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      keys="scheduleOfflineALL"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['web:allSchedule:detail', permsList]"
          type="text"
          @click="handleClickDetail(row)"
        >详情</el-button>
        <el-button
          v-permission="['web:allSchedule:signCode', permsList]"
          type="text"
          @click="handleClickSignCode(row)"
        >签到码</el-button>
        <el-button
          v-permission="['web:allSchedule:assistant', permsList]"
          type="text"
          @click="handleClickAssistant(row)"
        >助教</el-button>
        <el-button
          v-if="row.scheduleStatus === 1 || row.scheduleStatus === 2"
          v-permission="['web:allSchedule:edit', permsList]"
          type="text"
          @click="handleClickEdit(row)"
        >编辑</el-button>
        <el-button
          v-if="row.scheduleStatus === 2 || row.scheduleStatus === 3"
          v-permission="['web:allSchedule:signLog', permsList]"
          type="text"
          @click="handleClickSignLog(row)"
        >签到记录</el-button>
        <el-button
          v-if="row.costCheckStatus === 2"
          v-permission="['web:allSchedule:costConfirm', permsList]"
          type="text"
          @click="handleClickCostConfirm(row)"
        >成本确认</el-button>
        <el-button
          v-if="row.costCheckStatus === 3"
          v-permission="['web:allSchedule:costDetail', permsList]"
          type="text"
          @click="handleClickCostDetail(row)"
        >成本详情</el-button>
      </div>
      <template slot="search">
        <filterTop
          :search="search"
          :loading="loading"
          @searchFn="searchFn"
          @clear="searchClear"
        />
      </template>
      <template slot="footer" />
      <template slot="goodsNameList" slot-scope="{ row }">
        <AppIconClipboard v-if="row.goodsNameList" :src="row.goodsNameList">
          <span
            v-if="row.goodsNameList && row.goodsNameList.join(',').length < 15"
          >{{ row.goodsNameList.join(',') }}</span>
          <template v-else>
            <el-tooltip placement="top-end">
              <div slot="content">
                <div v-for="(item, index) in row.goodsNameList" :key="index">
                  {{ item }}
                </div>
              </div>
              <span>{{
                row.goodsNameList &&
                  row.goodsNameList.join(',').substring(0, 15) + '...'
              }}</span>
            </el-tooltip>
          </template>
        </AppIconClipboard>
      </template>
      <template slot="scheduleNum" slot-scope="{ row }">
        <AppIconClipboard :src="String(row.scheduleNum)">
          <span>{{ row.scheduleNum }}</span>
        </AppIconClipboard>
      </template>
      <template slot="scheduleStatus" slot-scope="{ row }">
        <span class="scheduleStatus" :class="`status${row.scheduleStatus}`">
          {{ scheduleStatus[row.scheduleStatus] }}
        </span>
      </template>
      <template slot="totalCost" slot-scope="{ row }">
        <template v-if="row.costCheckStatus === 2 || row.costCheckStatus === 3">
          <span
            class="wordBreak"
            :style="{ color: row.totalCost >= 0 ? '#777777' : '#F53F3F' }"
          >
            ￥<span v-if="row.totalCost < 0">-</span>
            {{ row.totalCost | filtersMoneyByZero }}
          </span>
        </template>
        <template v-else>—</template>
      </template>
      <template slot="expectProfit" slot-scope="{ row }">
        <template v-if="row.costCheckStatus === 2 || row.costCheckStatus === 3">
          <span
            class="wordBreak"
            :style="{ color: row.expectProfit >= 0 ? '#777777' : '#F53F3F' }"
          >
            ￥<span v-if="row.expectProfit < 0">-</span>
            {{ row.expectProfit | filtersMoneyByZero }}
          </span>
        </template>
        <template v-else>—</template>
      </template>
      <template slot="costCheckStatus" slot-scope="{ row }">
        <template v-if="row.costCheckStatus !== 0">
          <AppStatus
            :status="
              { 1: 'error', 2: 'info', 3: 'success' }[row.costCheckStatus]
            "
          >
            <span>{{ costCheckStatus[row.costCheckStatus] }}</span>
          </AppStatus>
        </template>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <!-- 详情弹框 -->
    <detailDrawer
      :schedule-id="detailDrawerConfig.id"
      :current="current"
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
    />
    <!-- 签到码弹框 -->
    <signCodeDialog :config="signCodeConfig" />
    <!-- 签到记录弹框 -->
    <signLogDrawer
      :visible.sync="signLogConfig.visible"
      append-to-body
      :schedule-id="signLogConfig.scheduleId"
    />
    <!-- 成本确认弹框 -->
    <costConfirmDrawer
      :visible.sync="costConfirmConfig.visible"
      :title="costConfirmConfig.title"
      :schedule-id="costConfirmConfig.scheduleId"
      @sure="costConfirmFn"
    />
    <!-- 成本详情弹框 -->
    <costDetailDrawer
      :visible.sync="costDetailConfig.visible"
      :title="costDetailConfig.title"
      :schedule-id="costDetailConfig.scheduleId"
    />
    <!-- 编辑班期弹框 -->
    <editSchedule :config="editScheduleConfig" @success="editSchedule" />
    <studentGroupDialog ref="studentGroupDialog" />
  </div>
</template>

<script>
import filterTop from './filterTop'
import detailDrawer from '../../components/detailDrawer'
import signLogDrawer from '../../components/signLogDrawer'
import costConfirmDrawer from '../../components/costConfirmDrawer'
import costDetailDrawer from '../../components/costDetailDrawer'
import { getColumns, scheduleStatus, costCheckStatus } from './columns'
import { getDeliveryScheduleList } from '@/api/deliver/scheduleManagement'
import AppIconClipboard from '@/components/AppIconClipboard'
import AppStatus from '@/components/AppStatus'
import editSchedule from '../../components/editSchedule'
import signCodeDialog from '../../components/signCodeDialog'
import studentGroupDialog from '../../components/studentGroupDialog'
export default {
  components: {
    filterTop,
    detailDrawer,
    signLogDrawer,
    costConfirmDrawer,
    AppIconClipboard,
    AppStatus,
    costDetailDrawer,
    editSchedule,
    signCodeDialog,
    studentGroupDialog
  },
  data() {
    return {
      scheduleStatus,
      costCheckStatus,
      slotArr: [
        'action',
        'search',
        'footer',
        'goodsNameList',
        'scheduleNum',
        'scheduleStatus',
        'totalCost',
        'expectProfit',
        'costCheckStatus'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 筛选条件
      search: {
        tearch: {
          lecturerId: '',
          lecturerName: ''
        },
        goodsName: '',
        goodsId: '',
        deliveryTime: '',
        scheduleNum: '',
        scheduleStatus: '',
        costCheckStatus: ''
      },
      current: {},
      // 详情弹框
      detailDrawerConfig: {
        visible: false,
        id: '',
        goodsId: ''
      },
      // 签到记录弹框
      signLogConfig: {
        visible: false,
        scheduleId: ''
      },
      // 签到码弹框
      signCodeConfig: {
        visible: false,
        scheduleId: ''
      },
      // 成本确认弹框
      costConfirmConfig: {
        visible: false,
        title: '',
        scheduleId: ''
      },
      editScheduleConfig: {
        visible: false,
        scheduleStatus: '',
        goodsId: '',
        scheduleId: ''
      },
      // 成本详情弹框
      costDetailConfig: {
        visible: false,
        title: '',
        scheduleId: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.$uweb &&
      this.$uweb.setAction('Event_scheduleManagementAllSchedule_page')
    this.searchFn()
  },
  methods: {
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击签到码按钮
    handleClickSignCode(val) {
      this.signCodeConfig = {
        visible: true,
        scheduleId: val.id
      }
    },
    // 点击编辑按钮打开编辑弹框
    handleClickEdit(row) {
      this.editScheduleConfig = {
        visible: true,
        scheduleStatus: row.scheduleStatus,
        goodsId: row.goodsId,
        scheduleId: row.id
      }
    },
    // 点击详情按钮
    handleClickDetail(val) {
      this.current = val
      this.detailDrawerConfig.visible = true
      this.detailDrawerConfig.goodsId = val.goodsId
      this.detailDrawerConfig.id = val.id
    },
    // 点击签到记录
    handleClickSignLog(val) {
      this.signLogConfig.visible = true
      this.signLogConfig.scheduleId = val.id
    },
    // 点击成本确认按钮
    handleClickCostConfirm(val) {
      this.costConfirmConfig = {
        scheduleId: val.id,
        title: `${val.goodsName || ''}${val.scheduleNum}`,
        visible: true
      }
    },
    // 确认成本
    costConfirmFn() {
      this.costConfirmConfig.visible = false
      this.getList()
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 筛选条件清空
    searchClear() {
      this.search = {
        tearch: {
          lecturerId: '',
          lecturerName: ''
        },
        goodsName: '',
        goodsId: '',
        deliveryTime: '',
        scheduleNum: '',
        scheduleStatus: '',
        costCheckStatus: ''
      }
      this.config.currentPage = 1
      this.searchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const deliveryTime = this.search.deliveryTime
        ? `${this.search.deliveryTime}-01`
        : undefined
      const params = {
        costCheckStatus: this.search.costCheckStatus,
        current: this.config.currentPage,
        goodsId: this.search.goodsId,
        lecturerId: this.search.tearch.lecturerId,
        scheduleNum: this.search.scheduleNum,
        scheduleStatus: this.search.scheduleStatus,
        deliveryTime,
        size: this.config.pageSize
      }
      getDeliveryScheduleList(params)
        .then(res => {
          this.loading = false
          this.config.tableData = res.data.records
          this.config.total = Number(res.data.total)
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 编辑排期成功
    editSchedule() {
      this.editScheduleConfig.visible = false
      this.getList()
    },
    // 点击成本详情按钮
    handleClickCostDetail(row) {
      this.costDetailConfig = {
        scheduleId: row.id,
        title: `${row.goodsName || ''}${row.scheduleNum}`,
        visible: true
      }
    },
    handleClickAssistant(row) {
      this.$refs.studentGroupDialog.open(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 270px);
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 4px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
::v-deep .AppStatus {
  cursor: auto;
}

.scheduleStatus {
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
// 已开班
.status2 {
  color: #3cbfff;
  background: #d8f2ff;
}
// 已完结
.status3 {
  color: #00b42a;
  background: #e6f7ea;
}
.wordBreak {
  display: block;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
}
</style>
