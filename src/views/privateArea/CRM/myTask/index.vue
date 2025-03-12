<template>
  <!-- 智能销售 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      keys="MyTask"
      class="content"
      style="height: calc(100vh - 210px)"
      :slot-arr="slotArr"
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
      <template slot="search">
        <filterTop
          ref="filterTopRef"
          type="my"
          :columns="config.tableColumns"
          :permission-key="['web:myTask:add']"
          @change="filterTopChang"
          @onClear="onhandleClear"
          @handleAddTask="handleAddTask"
          @handleAddrevealTask="handleAddrevealTask"
          @onSearch="handleSearch"
        />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="row.itaskType !== 2"
          v-permission="['web:myTask:edit', permsList]"
          type="text"
          @click="openEdit(row)"
        >编辑</el-button>
        <el-button
          v-permission="['web:myTask:clue', permsList]"
          type="text"
          @click="gotoClue(row)"
        >线索</el-button>
        <el-dropdown @command="key => handleCommand(key, row)">
          <span class="el-dropdown-link" style="margin-left: 10px">
            <el-button
              v-if="row.dropdownList.length"
              type="text"
            >更多<i
              class="el-icon-arrow-down"
            /></el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in row.dropdownList"
              :key="item.command"
              :command="item.command"
            >
              <span :style="item.command === '3' ? `color: #f53f3f` : ''">{{
                item.label
              }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="tagNames" slot-scope="{ row }">
        <el-tag
          v-for="(item, index) in row.tagNames"
          :key="index"
          :disable-transitions="true"
          class="m-r-10 m-b-10"
        >{{ item }}</el-tag>
      </template>
      <template slot="taskStatus" slot-scope="{ row }">
        <MIconStatus
          :background="
            getOptionsValueByKey(
              'value',
              'background',
              row.taskStatus,
              ChannelOption
            )
          "
          :color="
            getOptionsValueByKey(
              'value',
              'color',
              row.taskStatus,
              ChannelOption
            )
          "
          :icon-class="
            getOptionsValueByKey('value', 'icon', row.taskStatus, ChannelOption)
          "
          :title="
            getOptionsValueByKey(
              'value',
              'label',
              row.taskStatus,
              ChannelOption
            )
          "
        />
      </template>
    </MPageLayout>
    <Add-task
      :visible.sync="addTaskDialog.visible"
      :taskcopy-id="addTaskDialog.taskId"
      @success="onhandleCLostAddTask"
    />
    <editTask
      :visible.sync="detailTaskDialog.visible"
      :task-id="detailTaskDialog.taskId"
      @success="getList"
    />
    <liveDialog ref="liveDialog" />
    <orderClaim ref="orderClaim" />
    <detailTask ref="detailTask" />
    <logTable ref="logTable" />
    <qwWecomeDialog ref="qwWecomeDialog" />
  </div>
</template>

<script>
import filterTop from '../filterTop.vue'
import { getColumns, ChannelOption } from '../columns'
import AddTask from '../components/AddTask'
import detailTask from '../components/detailTask/index'
import editTask from '../components/editTask/index'
import { getOptionsValueByKey } from '@/filters/index'
import { getSaleTaskPage, editSaleTaskStatus } from '@/api/privateArea/CRM'
import liveDialog from '../components/liveDialog/index'
import orderClaim from '../components/orderClaim/index'
import { modelQuery } from '@/api/privateArea/revealTask'
import logTable from '../components/logTable/index'
import qwWecomeDialog from '../components/qwWecomeDialog/index'
export default {
  components: {
    filterTop,
    AddTask,
    detailTask,
    liveDialog,
    orderClaim,
    editTask,
    logTable,
    qwWecomeDialog
  },
  data() {
    return {
      revealTaskVisible: false,
      ChannelOption,
      slotArr: ['action', 'search', 'footer', 'tagNames', 'taskStatus'],
      config: {
        tableData: [],
        tableColumns: getColumns(),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: {
        taskName: '',
        taskStatus: '',
        dataType: '',
        lectureId: '',
        createTime: [],
        ITaskType: 2
      },
      addTaskDialog: {
        visible: false,
        taskId: ''
      },
      detailTaskDialog: {
        taskId: '',
        visible: false
      },
      permsList: this.$route.meta.permsList || [],
      modelType: 1
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    handleCommand(key, row) {
      const keyfn = {
        1: {
          fun: 'handleAddTask',
          params: [row]
        },
        2: {
          fun: 'editTaskStatus',
          params: [row.id, 3]
        },
        3: {
          fun: 'editTaskStatus',
          params: [row.id, 4]
        },
        4: {
          fun: 'editTaskStatus',
          params: [row.id, 2]
        },
        5: {
          fun: 'editTaskStatus',
          params: [row.id, 1]
        },
        6: {
          fun: 'showLiveDialog',
          params: [row]
        },
        7: {
          fun: 'gokanban',
          params: [row]
        },
        8: {
          fun: 'openDetail',
          params: [row]
        },
        9: {
          fun: 'openLog',
          params: [row]
        },
        10: {
          fun: 'openWecomeMsg',
          params: [row]
        }
      }
      this[keyfn[key].fun](...keyfn[key].params)
    },
    handleAddrevealTask() {
      this.revealTaskVisible = true
    },
    initRouter() {
      const { query, path, name } = this.$route
      if (name !== 'privateAreaCRM') return
      if ('isDepTask' in query) {
        setTimeout(() => {
          this.initSearch()
        })
        return
      }
      this.$router.replace(`${path}?isDepTask=${this.active.value}`)
      setTimeout(() => {
        this.initSearch()
      })
    },
    async getType() {
      const { data } = await modelQuery()
      this.modelType = data.type
    },
    getOptionsValueByKey,
    handleTab(item) {
      this.active = item
      const { path } = this.$route
      this.$router.replace(`${path}?isDepTask=${item.value}`)
      setTimeout(() => {
        this.initSearch()
      })
    },
    init() {
      this.getType()
      this.getList()
      this.$uweb && this.$uweb.setAction('Event_salseTask_page')
    },
    handleAddTask(row) {
      if (row) {
        this.addTaskDialog.taskId = row.id
      } else {
        this.addTaskDialog.taskId = ''
      }
      this.addTaskDialog.visible = true
    },
    gokanban(row) {
      this.$uweb && this.$uweb.setAction('Event_IntelligentSales_kanban')
      this.$router.push({
        path: '/privateArea/clue/kanban',
        query: {
          taskId: row.id,
          taskName: row.taskName,
          dataType: row.dataType
        }
      })
    },
    handleOrderClaim(row) {
      this.$refs.orderClaim.open(row)
    },
    showLiveDialog(row) {
      this.$uweb && this.$uweb.setAction('Event_IntelligentSales_live')
      this.$refs.liveDialog.open(row)
    },
    onhandleClear() {
      this.search = {
        taskName: '',
        taskStatus: '',
        dataType: '',
        lectureId: '',
        createTime: [],
        ITaskType: 2
      }
      this.searchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        taskName: this.search.taskName,
        taskStatus: this.search.taskStatus,
        startStartTime:
          this.search.createTime &&
          this.search.createTime[0] &&
          `${this.search.createTime[0]} 00:00:00`,
        endStartTime:
          this.search.createTime &&
          this.search.createTime[1] &&
          `${this.search.createTime[1]} 23:59:59`,
        dataType: this.search.dataType,
        isDepTask: 2,
        lectureId: this.search.lectureId || undefined,
        ITaskType: this.search.ITaskType
      }
      getSaleTaskPage(params)
        .then(res => {
          this.config.tableData = res.data.items?.map(i => {
            return {
              ...i,
              dropdownList: this.getDropdownList(i)
            }
          })
          this.config.total = res.data.total
          this.loading = false
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
        })
        .catch(() => {
          this.config.tableData = []
          this.config.total = 0
          this.loading = false
        })
    },
    getDropdownList(row) {
      const dropdownList = []
      if (this.permsList.includes('web:myTask:detail')) {
        dropdownList.push({
          command: '8',
          label: '详情'
        })
      }
      if (
        this.permsList.includes('web:myTask:copy') &&
        [1, 4].includes(row.dataType) &&
        this.modelType === row.modelType &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '1',
          label: '复制'
        })
      }
      if (
        this.permsList.includes('web:myTask:close') &&
        ['1', '3'].includes(row.taskStatus) &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '2',
          label: '关闭'
        })
      }
      if (
        this.permsList.includes('web:myTask:stop') &&
        ['2'].includes(row.taskStatus) &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '4',
          label: '暂停'
        })
      }
      if (
        this.permsList.includes('web:myTask:restart') &&
        ['3'].includes(row.taskStatus) &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '5',
          label: '重启'
        })
      }
      if (
        this.permsList.includes('web:myTask:live') &&
        row.isLive &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '6',
          label: '直播间'
        })
      }
      if (this.permsList.includes('web:myTask:kanban') && row.dataType !== 4) {
        dropdownList.push({
          command: '7',
          label: '看板'
        })
      }
      if (this.permsList.includes('web:myTask:log') && row.itaskType !== 2) {
        dropdownList.push({
          command: '9',
          label: '日志'
        })
      }
      if (
        this.permsList.includes('web:myTask:qwWelcomeMsg')
      ) {
        dropdownList.push({
          command: '10',
          label: '企微欢迎语'
        })
      }
      if (
        this.permsList.includes('web:myTask:delete') &&
        row.taskStatus === '4' &&
        row.itaskType !== 2
      ) {
        dropdownList.push({
          command: '3',
          label: '删除'
        })
      }
      return dropdownList
    },
    filterTopChang() {
      this.$nextTick(() => {
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    handleSearch(data) {
      this.search = data
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    openEdit(row) {
      this.$uweb && this.$uweb.setAction('Event_IntelligentSales_detail')
      this.detailTaskDialog.taskId = row.id
      this.detailTaskDialog.visible = true
    },
    // 点击打开详情弹框
    openDetail(row) {
      this.$uweb && this.$uweb.setAction('Event_IntelligentSales_detail')
      this.$refs.detailTask.open(row.id)
    },
    // 修改销售任务状态
    editTaskStatus(taskId, handleStatus) {
      if ([2, 3, 4].includes(handleStatus)) {
        this.$delModal({
          tips: `是否确定操作?`,
          success: () => {
            this.editSaleTaskStatus(taskId, handleStatus)
          }
        })
      } else {
        this.editSaleTaskStatus(taskId, handleStatus)
      }
    },
    editSaleTaskStatus(taskId, handleStatus) {
      this.loading = true
      const data = {
        handleStatus,
        taskId
      }
      editSaleTaskStatus(data)
        .then(res => {
          // this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    onhandleCLostAddTask() {
      this.addTaskDialog.visible = false
      this.getList()
    },
    gotoClue(row) {
      this.$uweb && this.$uweb.setAction('Event_IntelligentSales_clue')
      this.$router.push({
        path: '/privateArea/clue/clueMy',
        query: { taskId: row.id, taskName: row.taskName }
      })
    },
    openLog(row) {
      this.$refs.logTable.open(row)
    },
    openWecomeMsg(row) {
      this.$refs.qwWecomeDialog.open(row)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(80px);
  padding: 0 20px;
  min-width: 1300px;
  position: relative;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-top: 20px;
  .navItem {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
    border-bottom: 2px solid #fff;
    padding-bottom: 9px;
    margin-right: 20px;
    cursor: pointer;
  }
  .active {
    color: #0c6fff;
    border-color: #0c6fff;
  }
}
.content {
  height: calc(100% - 36px);
}
</style>
