<template>
  <!-- 线索管理 -->
  <div class="page_wrap">
    <VxeTable
      ref="tableRef"
      type="tablePage"
      keys="clue_department"
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
          type="department"
          :permission-key="[
            'placeholder',
            'web:departmentClue:followUp',
            'web:departmentClue:taskReport',
            'web:departmentClue:followUp'
          ]"
          @searchFn="handleSearch"
          @clear="onhandleClear"
          @onTask="onhandleClickTask"
          @change="filterTopChange"
          @drawerChange="initSelect"
        />
      </template>
      <template slot="footer">
        <bottomBtns
          :intent-config-page="intentConfigPage"
          :permission-key="[
            'web:departmentClue:intention',
            'web:departmentClue:changePerson',
            'web:departmentClue:partExport',
            'web:departmentClue:allExport',
            'web:departmentClue:massTexting'
          ]"
          :multiple-selection="multipleSelection"
          type="department"
          :search="search"
          :list-loading.sync="loading"
          @refreshList="getList"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          v-permission="['web:departmentClue:details', permsList]"
          type="text"
          @click="onhandleDetail(scope.row)"
        >详情</el-button>
        <el-button
          v-if="
            scope.row.email ||
              (scope.row.phoneAreaCode === '86' && scope.row.phone)
          "
          v-permission="['web:departmentClue:sendCode', permsList]"
          :disabled="
            scope.row.isAddQw === 1 ||
              scope.row.clueType === 3 ||
              (scope.row.clueType === 2 && scope.row.withoutTask) ||
              scope.row.clueType === 5
          "
          type="text"
          @click="handleMsg(scope.row)"
        >发送信息</el-button>
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
      <template slot="intentName" slot-scope="{ row }">
        <div class="remarkBox">
          <div class="boxColor" :style="{ background: row.intentColor }">
            {{ row.intentName || '__' }}
          </div>
        </div>
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
    </VxeTable>

    <!-- 弹框层 -->
    <!-- 发送短信弹框 -->
    <msgDrawer :msg-config.sync="msgConfig" @handleOk="handleOk" />
    <detailDrawer
      :visible.sync="detailConfig.visible"
      :row-index="detailConfig.index"
      :page-size="config.pageSize"
      :current-page="config.currentPage"
      :row="detailConfig.row"
      :total="config.total"
      :config-table-data="config.tableData"
      :config-total-pages="config.totalPages"
      :search-type="3"
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
import {
  getColumns,
  followWechatStatus,
  followPrivateWechatStatus,
  followStatus
} from './columns'
import { setTime } from './utils.js'
import detailDrawer from './components/detailDrawer.vue'
import taskKanban from './components/taskKanban.vue'
import msgDrawer from './components/msgDrawer.vue'
import {
  getCluePageList,
  addClueFollowRecord,
  editIsAddGw,
  updateRemark,
  updateWechatNickName,
  clueRemark,
  updateAvailable,
  getIntentConfigPage
} from '@/api/privateArea/clue'
import { getOptionsValueByKey } from '@/filters/index'
import AppStatus from '@/components/AppStatus/index'
import VxeTable from '@/components/VxeTable'
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
      msgConfig: {
        visible: false,
        data: {}
      },
      followWechatStatus,
      editRow: '',
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
        tableColumns: getColumns.call(this, 'web:departmentClue:setPhone'),
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
        intentIdList: [],
        time: { label: 'addGwTime', value: '' },
        productCategory: '',
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        followUserId: '', // 跟进人伏羲云用户userId
        lastFollowTime: ['', ''], // 跟进时间
        taskIdList: [], // 任务Id
        hasReceiverAddress: '',
        taskName: '',
        goodsId: '',
        orderNo: '',
        goodsName: '',
        remark: '', // 微信备注名
        teacherId: '',
        teacherName: '',
        classStatus: '',
        tagName: '',
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
      intentConfigPage: [],
      multipleSelection: [],
      editText: '',
      permsList: this?.$route?.meta?.permsList || []
    }
  },
  computed: {
    isShowAvailable() {
      return this.permsList.includes('web:departmentClue:isAvailable')
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
    callPhoneEmit(record) {
      this.call({
        ...record,
        list: [],
        isAutoCall: false
      })
    },
    async initSelect() {
      const { data } = await getFollowType({
        isShowNotFollow: false
      })
      this.followTypeList = data || []
      console.log(data || [])
    },
    getOptionsValueByKey,
    init() {
      this.getIntentConfigPage()
      if (this.$route.query.taskId && this.$route.query.taskName) {
        this.search.taskIdList = [this.$route.query.taskId]
        this.search.taskName = this.$route.query.taskName
      }
      this.$uweb && this.$uweb.setAction('Event_salseClue_page')
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
        searchType: 3,
        orderStatus: this.search.orderStatus,
        channelId: this.search.channelId,
        isAvailable: this.search.isAvailable,
        intentIdList: this.search.intentIdList,
        productCategory: this.search.productCategory,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        [this.search.user.label]: this.search.user.value,
        [this.search.wxKey.label]: this.search.wxKey.value || null,
        isAddQwAndGw: this.search.isAddQwAndGw,
        ...setTime(this.search.time),
        clueType: this.search.clueType || 0,
        startCreateTime:
          this.search?.createTime && this.search?.createTime[0]
            ? `${this.search?.createTime[0]} 00:00:00`
            : '',
        endCreateTime:
          this.search?.createTime && this.search?.createTime[1]
            ? `${this.search.createTime[1]} 23:59:59`
            : '',
        startLastFollowTime: this.search?.lastFollowTime
          ? this.search?.lastFollowTime[0]
          : '',
        endLastFollowTime: this.search?.lastFollowTime
          ? this.search?.lastFollowTime[1]
          : '',
        startPayTime:
          this.search.payTime && this.search?.payTime[0]
            ? this.search?.payTime[0] + ' 00:00:00'
            : '',
        endPayTime:
          this.search.payTime && this.search?.payTime[1]
            ? this.search?.payTime[1] + ' 23:59:59'
            : '',
        tags: this.search.tags,
        followRecordTypes: this.search.followRecordTypes || [],
        repeatBuy: this.search.repeatBuy,
        hasReceiverAddress: this.search.hasReceiverAddress,
        refundStatus: this.search.refundStatus,
        followUserId: this.search.followUserId,
        orderNo: this.search.orderNo,
        classStatus: this.search.classStatus,
        sortName: this.search.sortName,
        sortType: this.search.sortType,
        goodsId: this.search.goodsId,
        taskIdList: this.search.taskIdList,
        teacherId: this.search.teacherId,
        goodsName: this.search.goodsName,
        tagName: this.search.tagName,
        tagInfoVo: this.search.tagInfoVo
      }
      getCluePageList(params)
        .then(res => {
          res.data.items.map(v => {
            v.lastFollowRecordType = v.lastFollowRecordType
              ? v.lastFollowRecordType
              : ''
            v.lastFollowRecordTypeLoading = false
            v.editIntent = false
            v.edit = false
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
    handleSearch(data) {
      this.search = data
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
        intentIdList: [],
        time: { label: 'addGwTime', value: '' },
        productCategory: '',
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        followUserId: '', // 跟进人伏羲云用户userId
        isAddQwAndGw: '',
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
        teacherName: '',
        classStatus: '',
        tagName: '',
        wxKey: { label: 'wechatNickName', value: '' },
        tagInfoVo: [],
        user: { label: 'phone', value: '' } // 学员搜索
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
          console.log(res)
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
