<template>
  <!-- 我的直播班期管理页面 -->
  <div class="page_wrap">
    <!-- 页面布局组件 -->
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      keys="scheduleLiveMy"
      v-bind="config"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="goodsNameList" slot-scope="{ row }">
        <div>
          {{ row.goodsNameList.length ? row.goodsNameList.join(',') : '' }}
        </div>
      </template>
      <!-- 表格操作按钮列 -->
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['web:depClass:detail', permsList]"
          type="text"
          @click="handleClickDetail(row)"
        >详情</el-button>
        <el-button
          v-permission="['web:depClass:edit', permsList]"
          type="text"
          @click="handleClickEdit(row)"
        >编辑</el-button>
        <!-- v-permission="['web:mySchedule:signLog', permsList]" -->
        <!-- <el-button type="text" @click="handleClickCopy(row)"> 复制 </el-button> -->
        <el-button
          v-permission="['web:depClass:share', permsList]"
          type="text"
          @click="handleClickShareDetail(row)"
        >
          分享
        </el-button>
      </div>

      <!-- 顶部搜索过滤区域 -->
      <template slot="search">
        <filterTop
          :loading="loading"
          :search="search"
          @handleClickAdd="handleClickAddSchedule"
          @searchFn="getList"
          @clear="searchClear"
        />
      </template>
    </MPageLayout>

    <!-- 详情弹框 -->
    <detailDrawer
      :type="3"
      :current="current"
      :schedule-id="detailDrawerConfig.id"
      :goods-id="detailDrawerConfig.goodsId"
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
    />
    <!-- 分享详情弹框 -->
    <shareDetail
      :current="current"
      :schedule-id="shareDetailConfig.id"
      :visible.sync="shareDetailConfig.visible"
      append-to-body
    />
    <!-- 新增排期弹框 -->
    <addStudentDrawer
      ref="addStudentDrawerRef"
      :config="scheduleDrawerConfig"
      @success="addSchedule"
    />
  </div>
</template>

<script>
/**
 * 我的直播班期管理页面
 * @description 用于管理讲师个人的直播班期信息，包含查看、编辑、复制、分享等功能
 */
import detailDrawer from '../components/detailDrawer'
import shareDetail from '../components/shareDetail'
import addStudentDrawer from '../components/addStudentDrawer'
import filterTop from './filterTop'
import { getColumns, scheduleStatus, costCheckStatus } from './columns.js'
import { getDeliveryDepartmentScheduleList } from '@/api/deliver/scheduleManagement'

export default {
  name: 'LiveMySchedule',
  components: { filterTop, addStudentDrawer, detailDrawer, shareDetail },

  // 组件数据
  data: () => ({
    // 班期状态常量
    scheduleStatus,
    // 成本审核状态常量
    costCheckStatus,
    // 插槽配置数组
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
    // 表格配置
    config: {
      tableData: [], // 表格数据
      tableColumns: null, // 表格列配置
      pageSizes: [10, 20, 50, 100], // 分页大小选项
      pageSize: 10, // 当前分页大小
      currentPage: 1, // 当前页码
      total: 0 // 总数据量
    },
    loading: false, // 加载状态
    // 搜索条件对象
    search: {
      tearch: { lecturerId: '', lecturerName: '' }, // 讲师信息
      goodsId: '', // 商品ID
      goodsName: '', // 商品名称
      scheduleNum: '', // 班期编号
      scheduleStatus: '', // 班期状态
      deliveryTime: '', // 开课时间
      costCheckStatus: '', // 成本审核状态
      type: 2 // 类型 1: 直播 2: 录播
    },
    current: {},
    permsList: [], // 权限列表
    scheduleDrawerConfig: {
      visible: false,
      editStatus: false,
      copyStatus: false
    },
    detailDrawerConfig: {
      visible: false,
      id: '',
      goodsId: ''
    },
    shareDetailConfig: {
      visible: false,
      id: '',
      goodsId: ''
    }
  }),

  created() {
    // 初始化表格列配置
    this.config.tableColumns = getColumns.call(this)
    // 获取路由中的权限列表
    this.permsList = this.$route.meta.permsList || []
  },

  mounted() {
    // 设置页面访问埋点
    // this.$uweb?.setAction('Event_scheduleManagementMySchedule_page')
    // 获取列表数据
    this.getList()
  },

  methods: {
    /**
     * 处理分页大小变化
     * @param {number} val - 新的分页大小
     */
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },

    /**
     * 处理页码变化
     * @param {number} val - 新的页码
     */
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },

    /**
     * 查看班期详情
     * @param {Object} row - 当前行数据
     */
    handleClickDetail(row) {
      this.current = row
      this.detailDrawerConfig = {
        visible: true,
        id: row.id,
        goodsId: row.goodsId
      }
    },

    /**
     * 查看分享详情
     * @param {Object} param0 - 解构的行数据
     * @param {string} param0.id - 班期ID
     */
    handleClickShareDetail(current) {
      this.current = current
      this.shareDetailConfig = { scheduleId: current.id, visible: true }
    },

    /**
     * 查看签到记录
     * @param {Object} param0 - 解构的行数据
     * @param {string} param0.id - 班期ID
     */
    handleClickCopy({ id }) {
      this.scheduleDrawerConfig = {
        visible: true,
        editStatus: false,
        copyStatus: true,
        type: 'copy',
        id
      }
      // init edit data
      console.log('-------------------------')
      console.log(this.$refs.addStudentDrawerRef.configData)
      console.log('-------------------------')
    },

    /**
     * 新增班期
     * @returns {Promise<void>}
     */
    async handleClickAddSchedule() {
      // const res = await this.$store.dispatch('user/viewingFlag', 'newScheduleManagement')
      // if (res) return
      this.scheduleDrawerConfig = { visible: true, editStatus: false }
    },

    /**
     * 编辑班期信息
     * @param {Object} row - 当前行数据
     */
    handleClickEdit(row) {
      this.scheduleDrawerConfig = {
        visible: true,
        editStatus: true,
        copyStatus: false,
        type: 'edit',
        id: row.id,
        ...row
      }
      // init edit data
      console.log('-------------------------')
      console.log(this.$refs.addStudentDrawerRef.configData)
      console.log('-------------------------')
      // this.$refs.addStudentDrawerRef.configData
    },

    /**
     * 获取班期列表数据
     * @returns {Promise<void>}
     */
    async getList(flag) {
      try {
        this.loading = true
        const params = {
          ...this.search,
          current: flag ? 1 : this.config.currentPage,
          size: flag ? 9999 : this.config.pageSize,
          type: 2,
          deliveryTime: this.search.deliveryTime
            ? `${this.search.deliveryTime}-01`
            : undefined
        }
        const { data } = await getDeliveryDepartmentScheduleList(params)
        this.config.tableData = data.records
        this.config.total = Number(data.total)
        this.$nextTick(() => this.$refs.MPageLayout?.doLayout())
      } finally {
        this.loading = false
      }
    },

    /**
     * 搜索列表
     */
    searchFn() {
      console.log('searchFn')
      this.config.currentPage = 1
      this.getList()
    },

    /**
     * 清空搜索条件
     */
    searchClear() {
      this.search = {
        tearch: { lecturerId: '', lecturerName: '' },
        goodsName: '',
        goodsId: '',
        deliveryTime: '',
        scheduleNum: '',
        scheduleStatus: '',
        costCheckStatus: '',
        type: 2
      }
      this.searchFn()
    },

    /**
     * 关闭弹窗
     * @param {string} key - 弹窗配置对象的key
     */
    closeDialog(key) {
      this[key].visible = false
      this.getList()
    },
    addSchedule() {
      this.refReshList()
    },
    refReshList() {
      this.config.currentPage = 1
      this.scheduleDrawerConfig = {
        visible: false,
        editStatus: false,
        copyStatus: false
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
/* 页面容器样式 */
.page_wrap {
  height: calc(100vh - 270px);
}

/* 深度选择器样式 */
::v-deep {
  /* 页脚样式 */
  .tablePage .page_footer {
    justify-content: space-between;
    box-shadow: none;
    padding: 6px 0 4px;
    height: auto;
  }

  /* 页头样式 */
  .page_header {
    padding: 0 !important;
  }

  /* 表格样式 */
  .my-table {
    margin: 0 !important;
  }
}

/* 班期状态样式 */
.scheduleStatus {
  width: 56px;
  display: inline-block;
  height: 22px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 22px;
  text-align: center;

  /* 未开班状态 */
  &.status1 {
    background: #eff2f6;
    color: #777;
  }

  /* 已开班状态 */
  &.status2 {
    color: #3cbfff;
    background: #d8f2ff;
  }

  /* 已完结状态 */
  &.status3 {
    color: #00b42a;
    background: #e6f7ea;
  }
}
</style>
