<template>
  <!-- 线索管理 -->
  <div class="page_wrap">
    <vxe-table
      ref="tableRef"
      keys="clue_my"
      type="tablePage"
      :slot-arr="slotArr"
      :is-seq="true"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :if-index="true"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      checkbox
      :tooltip-config="tooltipConfig"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="sortChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <filterTop
          :search="search"
          :loading="loading"
          :columns="config.tableColumns"
          :intent-config-page="intentConfigPage"
          type="my"
          :permission-key="[
            'web:myClue:personalKit',
            'web:myClue:followUp',
            'web:myClue:taskReport'
          ]"
          @searchFn="handleSearch"
          @clear="onhandleClear"
          @onTask="onhandleClickTask"
          @change="filterTopChange"
          @drawerChange="initSelect"
          @updateIntentConfig="getIntentConfigPage"
        />
      </template>
      <template slot="intentName" slot-scope="{ row }">
        <template v-if="row.editIntent">
          <m-select
            v-model="row.intentId"
            :dict-list="intentConfigPage"
            :param="{ value: 'id', label: 'name' }"
            @change="handleSetIntent(row)"
          />
        </template>
        <template v-else>
          <div class="remarkBox">
            <el-tooltip
              v-if="row.intentName"
              effect="dark"
              :content="row.intentName"
              placement="top"
            >
              <div class="boxColor" :style="{ background: row.intentColor }">
                {{ row.intentName || '__' }}
              </div>
            </el-tooltip>

            <i
              class="el-icon-edit pointer c_0F71FF"
              @click="handleIntentName(row)"
            />
          </div>
        </template>
      </template>
      <template slot="footer">
        <bottomBtns
          :multiple-selection="multipleSelection"
          :intent-config-page="intentConfigPage"
          :permission-key="[
            'web:myClue:intention',
            'web:myClue:changePerson',
            'web:myClue:partExport',
            'web:myClue:allExport',
            'web:myClue:massTexting'
          ]"
          type="my"
          :search="search"
          :list-loading.sync="loading"
          @refreshList="getList"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          v-permission="['web:myClue:details', permsList]"
          type="text"
          @click="onhandleDetail(scope.row)"
        >详情</el-button>
        <el-button
          v-if="
            scope.row.email ||
              (scope.row.phoneAreaCode === '86' && scope.row.phone)
          "
          v-permission="['web:myClue:sendCode', permsList]"
          :disabled="
            scope.row.isAddQw === 1 ||
              scope.row.clueType === 3 ||
              (scope.row.clueType === 2 && scope.row.withoutTask) ||
              scope.row.clueType === 5
          "
          type="text"
          @click="handleMsg(scope.row)"
        >发送信息</el-button>
        <el-button
          v-if="scope.row.phoneAreaCode === '86' && scope.row.phone"
          v-permission="['web:myClue:call', permsList]"
          type="text"
          @click="openCall(scope.row)"
        >呼叫</el-button>
      </template>
      <template slot="isAddQw" slot-scope="{ row }">
        <MIconStatus
          :background="
            getOptionsValueByKey(
              'value',
              'background',
              row.isAddQw,
              followWechatStatus
            )
          "
          :color="
            getOptionsValueByKey(
              'value',
              'color',
              row.isAddQw,
              followWechatStatus
            )
          "
          :icon-class="
            getOptionsValueByKey(
              'value',
              'icon',
              row.isAddQw,
              followWechatStatus
            )
          "
          :title="
            getOptionsValueByKey(
              'value',
              'label',
              row.isAddQw,
              followWechatStatus
            )
          "
        />
      </template>
      <template slot="isAddGw" slot-scope="{ row }">
        <!-- 添加跟进人个人微信 -->
        <MIconStatus
          style="cursor: pointer"
          :background="
            getOptionsValueByKey(
              'value',
              'background',
              row.isAddGw,
              followPrivateWechatStatus
            )
          "
          :color="
            getOptionsValueByKey(
              'value',
              'color',
              row.isAddGw,
              followPrivateWechatStatus
            )
          "
          :icon-class="
            getOptionsValueByKey(
              'value',
              'icon',
              row.isAddGw,
              followPrivateWechatStatus
            )
          "
          :title="
            getOptionsValueByKey(
              'value',
              'label',
              row.isAddGw,
              followPrivateWechatStatus
            )
          "
          class-name="isAddGwIconClass"
          @click.native="editIsAddGw(row)"
        />
      </template>
      <template #isSubscribe="{ row }">
        <AppStatus
          :title="{ 0: '否', 1: '是' }[row.isSubscribe]"
          :status="{ 0: 'error', 1: 'success' }[row.isSubscribe]"
        />
      </template>
      <template slot="lastFollowRecordType" slot-scope="{ row }">
        <!-- 跟进状态 -->
        <m-select
          v-model="row.lastFollowRecordType"
          v-loading="row.lastFollowRecordTypeLoading"
          :dict-list="followTypeList"
          :param="{ value: 'followType', label: 'followTypeName' }"
          clearable
          @change="res => onhandleLastFollowRecordType(row, res)"
        />
      </template>
      <template slot="lastFollowRecordContent" slot-scope="{ row }">
        <el-button
          type="text"
          class="follerBtn"
          @click="openUser(row)"
        >跟进</el-button>
        <!-- 最近跟进记录 -->
        <template
          v-if="
            row.lastFollowRecordContent &&
              row.lastFollowRecordContent.length > 15
          "
        >
          <el-popover
            placement="top-start"
            width="400"
            trigger="hover"
            :content="row.lastFollowRecordContent"
          >
            <span slot="reference">
              {{ `${row.lastFollowRecordContent.slice(0, 15)}...` }}
            </span>
          </el-popover>
        </template>
        <template v-else>
          {{ row.lastFollowRecordContent }}
        </template>
      </template>
      <template slot="personalTagList" slot-scope="{ row }">
        <!-- 企微标签 -->
        <el-tag
          v-for="(item, index) in row.personalTagList"
          :key="index"
          class="m-r-10 m-b-10"
        >{{ item }}</el-tag>
      </template>
      <template slot="isAvailable" slot-scope="{ row }">
        <m-select
          v-if="isShowAvailable"
          v-model="row.isAvailable"
          dict-key="IS_AVAILABLE_STATUS"
          :clearable="false"
          @change="handleIsAvailable(row)"
        />
        <span v-else>{{
          $getdictName('IS_AVAILABLE_STATUS', row.isAvailable)
        }}</span>
      </template>
      <template slot="externalUserTags" slot-scope="{ row }">
        <!-- 企微标签 -->
        <el-tag
          v-for="(item, index) in row.externalUserTags"
          :key="index"
          class="m-r-10 m-b-10"
        >{{ item.tagName }}</el-tag>
      </template>
      <template slot="remark" slot-scope="{ row }">
        <template v-if="!row.edit">
          <div class="remarkBox">
            <div>{{ row.remark || '未知' }}</div>
            <i
              class="el-icon-edit pointer c_0F71FF"
              @click="onhandleRemark(row)"
            />
          </div>
        </template>
        <template v-else>
          <el-input
            v-model.trim="editText"
            v-loading="row.editLoading"
            clearable
            placeholder="请输入"
            size="mini"
            @keyup.enter.native="onhandleEditRemake(row)"
            @blur="onhandleEditRemake(row)"
          />
        </template>
      </template>
      <template slot="wechatNickName" slot-scope="{ row }">
        <template v-if="row.id === editRow.id">
          <el-input
            v-model.trim="row.wechatNickName"
            v-loading="row.editLoading"
            clearable
            placeholder="请输入"
            size="mini"
            @blur="onhandleEditWechatNickName(row)"
          />
        </template>
        <template v-else>
          <div class="remarkBox">
            <div>{{ row.wechatNickName || '未知' }}</div>
            <i
              class="el-icon-edit pointer c_0F71FF"
              @click="onhandleWechatNickName(row)"
            />
          </div>
        </template>
      </template>
    </vxe-table>

    <!-- 弹框层 -->
    <!-- 发送短信弹框 -->
    <msgDrawer :msg-config.sync="msgConfig" @handleOk="handleOk" />
    <detailDrawer
      :visible.sync="detailConfig.visible"
      :row-index="detailConfig.index"
      :page-size="config.pageSize"
      :current-page="config.currentPage"
      :config-table-data="config.tableData"
      :config-total-pages="config.totalPages"
      :row="detailConfig.row"
      :total="config.total"
      :search-type="2"
      :search="search"
      @success="getList()"
      @callPhoneEmit="callPhoneEmit"
    />
    <taskKanban
      :task-name="taskKanbanConfig.taskName"
      :visible.sync="taskKanbanConfig.visible"
      :task-id="taskKanbanConfig.taskId"
    />
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { setTime } from './utils.js'
import {
  getColumns,
  followWechatStatus,
  followPrivateWechatStatus,
  followStatus
} from './columns'
import detailDrawer from './components/detailDrawer.vue'
import taskKanban from './components/taskKanban.vue'
import msgDrawer from './components/msgDrawer.vue'
import VxeTable from '@/components/VxeTable'
import {
  getCluePageList,
  addClueFollowRecord,
  editIsAddGw,
  updateRemark,
  updateWechatNickName,
  clueRemark,
  updateAvailable,
  getIntentConfigPage,
  updateIntentConfig
} from '@/api/privateArea/clue'
import { getOptionsValueByKey } from '@/filters/index'
import AppStatus from '@/components/AppStatus/index'
import Dialog from './Dialog/index.js'
import bottomBtns from './bottomBtns'
import { getFollowType, saleTaskdetail } from '@/api/privateArea/CRM'
export default {
  inject: ['call'],
  components: {
    filterTop,
    detailDrawer,
    msgDrawer,
    taskKanban,
    AppStatus,
    bottomBtns,
    VxeTable
  },
  data() {
    return {
      tooltipConfig: {
        contentMethod: ({ type, column, row, items, _columnIndex }) => {
          // 重写默认的提示内容
          if (column.title === '个人标签') {
            return row?.personalTagList?.map(item => item)?.join(',')
          }
          if (column.title === '企微标签') {
            return row?.externalUserTags?.map(item => item.tagName)?.join(',')
          }
        }
      },
      followTypeList: [],
      editRow: '',
      msgConfig: {
        visible: false,
        data: {}
      },
      followWechatStatus,
      followPrivateWechatStatus,
      followStatus,
      slotArr: [
        'wechatNickName',
        'action',
        'search',
        'footer',
        'isAddQw',
        'isAddGw',
        'lastFollowRecordType',
        'lastFollowRecordContent',
        'personalTagList',
        'externalUserTags',
        'remark',
        'isSubscribe'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this, 'web:myClue:setPhone'),
        pageSizes: [10, 20, 50, 100, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: {
        orderStatus: '',
        channelId: '',
        isAvailable: '',
        productCategory: '',
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        payTime: ['', ''], // 支付时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        followUserId: '', // 跟进人伏羲云用户userId
        repeatBuy: '',
        hasReceiverAddress: '',
        lastFollowTime: ['', ''], // 跟进时间
        taskIdList: [], // 任务Id
        taskName: '',
        orderNo: '',
        goodsId: '',
        goodsName: '',
        remark: '', // 微信备注名
        teacherId: '',
        teacherName: '',
        classStatus: '',
        tagName: '',
        time: { label: 'addGwTime', value: '' },
        wxKey: { label: 'wechatNickName', value: '' },
        isAddQwAndGw: '',
        user: { label: 'phone', value: '' }, // 学员搜索
        tagInfoVo: []
      },
      detailConfig: {
        visible: false
      },
      taskKanbanConfig: {
        visible: false,
        taskId: '',
        taskName: ''
      },
      multipleSelection: [],
      editText: '',
      permsList: this?.$route?.meta?.permsList || [],
      intentConfigPage: []
    }
  },
  computed: {
    isShowAvailable() {
      return this.permsList.includes('web:myClue:isAvailable')
    }
  },
  mounted() {
    this.init()
    this.initSelect()
  },
  activated() {
    this.init()
  },
  methods: {
    async handleIsAvailable(row) {
      const { code, message } = await updateAvailable({ clueId: row.id })
      if (code === 1) return this.$message.success('修改成功')
      if (message) this.$message.error(message)
    },
    handleIntentName(row) {
      this.config.tableData.forEach(v => {
        this.$set(v, 'editIntent', false)
      })
      this.$set(row, 'editIntent', true)
    },
    async getIntentConfigPage() {
      const { code, data } = await getIntentConfigPage({
        pageIndex: 1,
        pageSize: 99999
      })
      if (code === 1) {
        this.intentConfigPage = data.items
      }
    },
    async handleSetIntent(row) {
      const { code } = await updateIntentConfig({
        clueId: [row.id],
        intentId: row.intentId || '0'
      })
      if (code === 1) {
        this.$message.success('修改成功！')
        const isIntent =
          this.intentConfigPage.find(item => item.id === row.intentId) ?? {}
        row.editIntent = false
        row.intentId = isIntent.id
        row.intentName = isIntent.name
        row.intentColor = isIntent.color
      }
    },
    callPhoneEmit(record) {
      this.call({
        ...record,
        list: [],
        isAutoCall: false
      })
    },
    openCall(record) {
      this.$uweb && this.$uweb.setAction('Event_manage_manual_call')
      this.call({
        ...record,
        list: this.config.tableData,
        isAutoCall: true
      })
    },
    async initSelect() {
      const { data } = await getFollowType({
        isShowNotFollow: false
      })
      this.followTypeList = data || []
    },
    getOptionsValueByKey,
    handleSearch(data) {
      this.search = data
      this.config.currentPage = 1
      this.getList()
    },
    init() {
      this.getIntentConfigPage()
      if (this.$route.query.taskId && this.$route.query.taskName) {
        this.search.taskIdList = [this.$route.query.taskId]
        this.search.taskName = this.$route.query.taskName
      }
      this.$uweb && this.$uweb.setAction('Event_salseClue_page')
    },
    onhandleWechatNickName(row) {
      this.editRow = row
    },
    async onhandleEditWechatNickName(row) {
      const { code } = await updateWechatNickName({
        clueId: row.id,
        wechatNickName: row.wechatNickName
      })
      if (code === 1) {
        this.$message.success('微信昵称已修改')
        this.editRow = ''
      }
    },
    // 获取列表数据
    getList() {
      this.loading = true
      this.config.tableData = []
      const params = {
        searchType: 2,
        orderStatus: this.search.orderStatus,
        channelId: this.search.channelId,
        isAvailable: this.search.isAvailable,
        productCategory: this.search.productCategory,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        [this.search.user.label]: this.search.user.value,
        [this.search.wxKey.label]: this.search.wxKey.value || null,
        isAddQwAndGw: this.search.isAddQwAndGw,
        ...setTime(this.search.time),
        clueType: this.search.clueType || 0,
        startCreateTime:
          this.search.createTime && this.search?.createTime[0]
            ? this.search?.createTime[0] + ' 00:00:00'
            : '',
        endCreateTime:
          this.search.createTime && this.search?.createTime[1]
            ? this.search?.createTime[1] + ' 23:59:59'
            : '',
        startPayTime:
          this.search.payTime && this.search?.payTime[0]
            ? this.search?.payTime[0] + ' 00:00:00'
            : '',
        endPayTime:
          this.search.payTime && this.search?.payTime[1]
            ? this.search?.payTime[1] + ' 23:59:59'
            : '',
        startLastFollowTime: this.search?.lastFollowTime
          ? this.search?.lastFollowTime[0]
          : '',
        endLastFollowTime: this.search.lastFollowTime
          ? this.search?.lastFollowTime[1]
          : '',
        tags: this.search.tags,
        followRecordTypes: this.search.followRecordTypes || [],
        refundStatus: this.search.refundStatus,
        orderNo: this.search.orderNo,
        followUserId: this.search.followUserId,
        repeatBuy: this.search.repeatBuy,
        hasReceiverAddress: this.search.hasReceiverAddress,
        sortName: this.search.sortName,
        sortType: this.search.sortType,
        goodsId: this.search.goodsId,
        classStatus: this.search.classStatus,
        taskIdList: this.search.taskIdList,
        teacherId: this.search.teacherId,
        goodsName: this.search.goodsName,
        tagName: this.search.tagName,
        intentIdList: this.search.intentIdList,
        tagInfoVo: this.search.tagInfoVo
      }
      console.log(this.search)

      getCluePageList(params)
        .then(res => {
          res.data.items.map(v => {
            v.lastFollowRecordType = v.lastFollowRecordType
              ? v.lastFollowRecordType
              : ''
            v.lastFollowRecordTypeLoading = false
            v.edit = false
            v.editIntent = false
            v.editLoading = false
          })
          this.config.tableData = res.data.items
          this.config.total = Number(res.data.total)
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    sortChange({ order, property }) {
      this.search = { ...this.search, sortName: property, sortType: order }
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击详情
    onhandleDetail(row) {
      const index = this.config.tableData.findIndex(v => {
        return v.id === row.id
      })
      this.detailConfig = {
        row: row,
        visible: true,
        index: index
      }
    },
    async handleMsg(row) {
      this.msgConfig = {
        visible: true,
        data: row
      }
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    onhandleClear() {
      this.search = {
        orderStatus: '',
        channelId: '',
        isAvailable: '',
        time: { label: 'addGwTime', value: '' },
        productCategory: '',
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        payTime: ['', ''], // 支付时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        followUserId: '', // 跟进人伏羲云用户userId
        repeatBuy: '',
        hasReceiverAddress: '',
        lastFollowTime: ['', ''], // 跟进时间
        taskIdList: [], // 任务Id
        taskName: '',
        goodsId: '',
        orderNo: '',
        goodsName: '',
        remark: '', // 微信备注名
        teacherId: '',
        classStatus: '',
        teacherName: '',
        tagName: this.search.tagName,
        user: { label: 'phone', value: '' }, // 学员搜索
        wxKey: { label: 'wechatNickName', value: '' },
        isAddQwAndGw: ''
      }
      this.searchFn()
    },
    // 发送短信成功回调
    handleOk() {
      this.getList()
    },
    // 点击任务看板按钮
    async onhandleClickTask() {
      const { data } = await saleTaskdetail(this.search.taskIdList[0])
      this.$router.push({
        path: `/privateArea/clue/kanban`,
        query: {
          taskId: this.search.taskIdList[0],
          taskName: this.search.taskName,
          dataType: data.dataType
        }
      })
    },
    filterTopChange() {
      this.$nextTick(() => {
        this.$refs.tableRef && this.$refs.tableRef.refreshColumn()
      })
    },
    openUser(row) {
      Dialog.open({
        type: 'FollowUser',
        form: {
          content: row.lastFollowRecordContent,
          type: row.lastFollowRecordType,
          clueId: row.id
        },
        followTypeList: this.followTypeList,
        success: res => {
          const data = {
            clueId: res.clueId,
            content: res.content,
            type: res.type === '' ? 0 : res.type
          }
          row.lastFollowRecordTypeLoading = true
          addClueFollowRecord(data)
            .then(() => {
              // row.lastFollowRecordType = res.type
              this.$set(row, 'lastFollowRecordType', res.type)
              this.$set(row, 'lastFollowRecordContent', res.content)
              row.lastFollowRecordTypeLoading = false
              Dialog.close()
              // this.getList()
            })
            .catch(() => {
              row.lastFollowRecordTypeLoading = false
            })
          // this.onhandleLastFollowRecordType(row, res.type)
        }
      })
    },
    onhandleLastFollowRecordType(row, res) {
      row.lastFollowRecordTypeLoading = true
      const data = {
        clueId: row.id,
        content: res
          ? getOptionsValueByKey('value', 'label', res, this.followStatus)
          : '',
        type: res === '' ? 0 : res
      }
      addClueFollowRecord(data)
        .then(() => {
          row.lastFollowRecordTypeLoading = false
          row.lastFollowRecordContent = res
            ? getOptionsValueByKey('value', 'label', res, this.followStatus)
            : ''
          Dialog.close()
          // this.getList()
        })
        .catch(() => {
          row.lastFollowRecordTypeLoading = false
        })
    },
    editIsAddGw(row) {
      if (!row.loginIsFollowUser) {
        return this.$message.error('只能操作所属员工是自己的')
      }
      if (row.isAddGw === 0) {
        this.loading = true
        const data = {
          clueId: row.id
        }
        editIsAddGw(data)
          .then(res => {
            this.loading = false
            row.isAddGw = row.isAddGw === 1 ? 0 : 1
            // this.getList()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$delModal({
          tips: { 0: '是否确认已加个微？', 1: '是否确认变更为未加个微？' }[
            row.isAddGw
          ],
          success: () => {
            this.loading = true
            const data = {
              clueId: row.id
            }
            editIsAddGw(data)
              .then(res => {
                this.loading = false
                row.isAddGw = row.isAddGw === 1 ? 0 : 1
                // this.getList()
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
      }
    },
    // selectable(row, index) {
    //   return row.isAddQw === 0
    // },
    // 点击编辑备注名
    onhandleRemark(row) {
      clueRemark(row.id).then(res => {
        this.config.tableData.forEach(v => {
          v.edit = false
        })
        row.edit = true
        this.editText = res.data || ''
      })
    },
    onhandleEditRemake(row) {
      if (!this.editText) {
        return this.$message.error('请输入备注名')
      }
      row.editLoading = true
      const data = {
        clueId: row.id,
        remark: this.editText
      }
      updateRemark(data)
        .then(res => {
          row.edit = false
          row.remark = this.editText
          this.editText = ''
          row.editLoading = false
        })
        .catch(() => {
          row.editLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 235px);
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
.remarkBox {
  display: flex;
  align-items: center;
  > div {
    max-width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .boxColor {
    width: 200px;
    height: 20px;
    display: inline-block;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 隐藏超出的内容 */
    text-overflow: ellipsis; /* 用省略号表示被隐藏的部分 */
    margin-right: 5px;
    font-size: 12px;
    padding: 0 5px;
  }
}
.remarkBox {
  display: flex;
  > div {
    max-width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
::v-deep {
  .IconStatus {
    .isAddGwIconClass {
      width: 24px;
      height: 24px;
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
.follerBtn {
  margin-left: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0c6fff;
  line-height: 22px;
  cursor: pointer;
}
</style>
