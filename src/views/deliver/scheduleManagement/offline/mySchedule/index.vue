<template>
  <!-- 我的班期 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      keys="scheduleOfflineMy"
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
      <div slot="action" slot-scope="scope">
        <el-button
          v-permission="['web:mySchedule:detail', permsList]"
          type="text"
          @click="handleClickDetail(scope.row)"
        >详情</el-button>
        <el-button
          v-permission="['web:mySchedule:signCode', permsList]"
          type="text"
          @click="handleClickSignCode(scope.row)"
        >签到码</el-button>
        <el-button
          v-permission="['web:allSchedule:assistant', permsList]"
          type="text"
          @click="handleClickAssistant(scope.row)"
        >助教</el-button>
        <el-button
          v-if="
            scope.row.scheduleStatus === 1 || scope.row.scheduleStatus === 2
          "
          v-permission="['web:mySchedule:edit', permsList]"
          type="text"
          @click="handleClickEdit(scope.row)"
        >编辑</el-button>
        <el-button
          v-if="
            scope.row.scheduleStatus === 2 || scope.row.scheduleStatus === 3
          "
          v-permission="['web:mySchedule:signLog', permsList]"
          type="text"
          @click="handleClickSignLog(scope.row)"
        >签到记录</el-button>
        <el-button
          v-if="
            scope.row.scheduleStatus === 3 && scope.row.costCheckStatus !== 3
          "
          v-permission="['web:mySchedule:recordCost', permsList]"
          type="text"
          @click="handleClickEnterCost(scope.row)"
        >录入成本</el-button>
        <el-button
          v-if="scope.row.costCheckStatus === 3"
          v-permission="['web:mySchedule:costDetail', permsList]"
          type="text"
          @click="handleClickCostDetail(scope.row)"
        >成本详情</el-button>
        <el-button
          v-if="scope.row.scheduleStatus === 1"
          v-permission="['web:mySchedule:del', permsList]"
          type="text"
          @click="handleClickDel(scope.row)"
        >删除</el-button>
      </div>
      <template slot="search">
        <filterTop
          :loading="loading"
          :search="search"
          @handleClickAdd="handleClickAddSchedule"
          @searchFn="getList"
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
      :current="current"
      :schedule-id="detailDrawerConfig.id"
      :goods-id="detailDrawerConfig.goodsId"
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
    />
    <!-- 录入成本弹框 -->
    <enterCostDialog
      :config="enterCostConfig"
      @success="closeDialog('enterCostConfig')"
    />
    <!-- 成本详情弹框 -->
    <costDetailDrawer
      :visible.sync="costDetailConfig.visible"
      :title="costDetailConfig.title"
      :schedule-id="costDetailConfig.scheduleId"
    />
    <!-- 签到码弹框 -->
    <signCodeDialog :config="signCodeConfig" />
    <!-- 签到记录弹框 -->
    <signLogDrawer
      :visible.sync="signLogConfig.visible"
      append-to-body
      :schedule-id="signLogConfig.scheduleId"
    />
    <!-- 新增排期弹框 -->
    <addSchedule :config="addScheduleConfig" @success="addSchedule" />
    <!-- 编辑班期弹框 -->
    <editSchedule :config="editScheduleConfig" @success="editSchedule" />
    <studentGroupDialog ref="studentGroupDialog" />
  </div>
</template>

<script>
import filterTop from './filterTop'
import detailDrawer from '../../components/detailDrawer'
import enterCostDialog from '../../components/enterCostDialog'
import costDetailDrawer from '../../components/costDetailDrawer'
import signCodeDialog from '../../components/signCodeDialog'
import signLogDrawer from '../../components/signLogDrawer'
import addSchedule from '../../components/addSchedule'
import editSchedule from '../../components/editSchedule'
import { getColumns, scheduleStatus, costCheckStatus } from './columns.js'
import {
  getScheduleMyPage,
  delDeliverySchedule
} from '@/api/deliver/scheduleManagement'
import AppIconClipboard from '@/components/AppIconClipboard'
import AppStatus from '@/components/AppStatus'
import studentGroupDialog from '../../components/studentGroupDialog'
export default {
  components: {
    filterTop,
    detailDrawer,
    enterCostDialog,
    costDetailDrawer,
    signCodeDialog,
    signLogDrawer,
    addSchedule,
    editSchedule,
    AppIconClipboard,
    AppStatus,
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
      // 查询条件
      search: {
        tearch: {
          lecturerId: '',
          lecturerName: ''
        },
        goodsId: '',
        goodsName: '',
        scheduleNum: '',
        scheduleStatus: '',
        deliveryTime: '',
        costCheckStatus: ''
      },
      current: {},
      // 详情弹框
      detailDrawerConfig: {
        visible: false,
        id: '',
        goodsId: ''
      },
      // 录入成本弹框
      enterCostConfig: {
        scheduleId: '',
        visible: false
      },
      // 成本详情弹框
      costDetailConfig: {
        visible: false,
        scheduleId: '',
        title: ''
      },
      // 签到码弹框
      signCodeConfig: {
        visible: false,
        scheduleId: ''
      },
      // 签到记录弹框
      signLogConfig: {
        visible: false,
        scheduleId: ''
      },
      // 新增排期弹框
      addScheduleConfig: {
        visible: false
      },
      editScheduleConfig: {
        visible: false,
        scheduleStatus: '',
        goodsId: '',
        scheduleId: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.$uweb &&
      this.$uweb.setAction('Event_scheduleManagementMySchedule_page')
    this.getList()
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 分页
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击详情按钮
    handleClickDetail(val) {
      this.current = val
      console.log(this.current)
      this.detailDrawerConfig.id = val.id
      this.detailDrawerConfig.goodsId = val.goodsId
      this.detailDrawerConfig.visible = true
    },
    // 点击录入成本按钮
    handleClickEnterCost(val) {
      console.log(val)
      this.enterCostConfig = {
        scheduleId: val.id,
        visible: true
      }
    },
    // 点击成本详情按钮
    handleClickCostDetail(val) {
      console.log(val)
      this.costDetailConfig.visible = true
      this.costDetailConfig.title = val.goodsName
      this.costDetailConfig.scheduleId = val.id
    },
    // 点击删除按钮
    handleClickDel(val) {
      console.log(val)
      this.$delModal({
        tips: '确定要删除？',
        success: () => {
          this.loading = true
          delDeliverySchedule(val.id)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击签到码按钮
    handleClickSignCode(val) {
      console.log(val)
      this.signCodeConfig = {
        visible: true,
        scheduleId: val.id
      }
    },
    // 点击签到记录
    handleClickSignLog(val) {
      console.log(val)
      this.signLogConfig = {
        visible: true,
        scheduleId: val.id
      }
    },
    // 点击新增排期
    async handleClickAddSchedule() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newScheduleManagement'
      )
      if (res) return
      this.addScheduleConfig.visible = true
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
      getScheduleMyPage(params)
        .then(res => {
          this.loading = false
          this.config.tableData = res.data.records
          this.config.total = Number(res.data.total)
          console.log(res)
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
        })
        .catch(() => {
          this.loading = false
        })
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
    // 新增排期成功
    addSchedule() {
      this.addScheduleConfig.visible = false
      this.getList()
    },
    // 编辑排期成功
    editSchedule() {
      this.editScheduleConfig.visible = false
      this.getList()
    },
    // 关闭弹框
    closeDialog(key) {
      this[key].visible = false
      this.getList()
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
