<template>
  <!-- 顶部搜索栏 -->
  <div class="filterTop">
    <el-form ref="form" :model="form" label-width="auto" size="small">
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="任务名称">
              <appTemplate
                ref="optionRef"
                v-model="form.taskIdList"
                multiple
                style="width: 100%"
                :config="{
                  api: getTaskIdPage,
                  nameKey: 'taskName',
                  label: 'taskName',
                  value: 'id'
                }"
                placeholder="请输入任务名称"
                @change="handleTasks"
                @focus="handleChangeTaskIdPage"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="form.orderNo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- <el-form-item label="学员姓名"><el-input v-model="search.userName" /></el-form-item> -->
            <el-form-item label="学员" class="user-select">
              <el-input
                v-model.trim="form.user.value"
                :placeholder="`请输入学员${
                  { userName: '姓名', phone: '电话', email: '邮箱' }[
                    form.user.label
                  ]
                }`"
                clearable
                @keyup.enter.native="handleClickSearch"
              >
                <el-select
                  slot="prepend"
                  v-model="form.user.label"
                  style="width: 80px"
                  placeholder="请选择"
                >
                  <el-option label="电话" value="phone" />
                  <el-option label="姓名" value="userName" />
                  <el-option label="邮箱" value="email" />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分配时间">
              <el-date-picker
                v-model="form.createTime"
                style="width: 100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="show" :gutter="20">
          <el-col :span="6">
            <el-form-item label="跟进时间">
              <el-date-picker
                v-model="form.lastFollowTime"
                style="width: 100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加微状态">
              <m-select
                v-model="form.isAddQwAndGw"
                style="width: 100%"
                clearable
                dict-key="ADD_QW_AND_GW_LIST"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="跟进状态">
              <el-select
                v-model="form.followRecordTypes"
                filterable
                multiple
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in followTypeList"
                  :key="item.followType"
                  :value="item.followType"
                  :label="item.followTypeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="no-pd">
              <template slot="label">
                <m-select
                  v-model="form.wxKey.label"
                  class="mySelect"
                  :clearable="false"
                  style="max-width: 115px; margin-right: -3px"
                  dict-key="WX_TYPE"
                />
              </template>
              <el-input v-model="form.wxKey.value" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="show" :gutter="20">
          <el-col :span="6">
            <el-form-item label="标签">
              <el-input v-model="form.webTagNames" placeholder="请选择标签" @focus="handleInputTagName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线索类型">
              <el-select v-model="form.clueType" style="width: 100%" clearable>
                <el-option value="" label="全部" />
                <el-option
                  v-for="item in clueTypeStatus"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态">
              <m-select v-model="form.orderStatus" :dict-list="orderStatus" />
            </el-form-item>
          </el-col>
          <el-col v-if="type == 'all'" :span="6">
            <el-form-item label="跟进人部门">
              <el-cascader
                ref="deptListRef"
                v-model="form.deptIdList"
                :show-all-levels="false"
                collapse-tags
                size="small"
                filterable
                :options="deptTreeArray"
                style="width: 100%"
                :props="{
                  multiple: true,
                  emitPath: false,
                  checkStrictly: true
                }"
                clearable
                @change="handleDeptIdList"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="type !== 'my'" :span="6">
            <el-form-item label="跟进人">
              <m-select
                v-model="form.followUserId"
                filterable
                placeholder="请选择员工"
                clearable
                style="width: 100%"
                :dict-list="userArray"
                :param="{ value: 'userId', label: 'nickName' }"
                @focus="handleFollowFocus"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源IP">
              <appTemplate v-model="form.teacherId" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="渠道来源">
              <m-select
                v-model="form.channelId"
                :dict-list="channelSourceType"
                :all="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有效">
              <m-select
                v-model="form.isAvailable"
                dict-key="IS_AVAILABLE_STATUS"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品类型">
              <m-select v-model="form.productCategory" dict-key="GOODS_TYPE" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-select
                v-model="form.goodsId"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入商品名称"
                :remote-method="remoteMethodGoods"
                :loading="goodsLoading"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.goodsId"
                  :label="item.goodsName"
                  :value="item.goodsId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.taskIdList.length" :span="6">
            <el-form-item label="到课情况">
              <m-select v-model="form.classStatus" dict-key="CLASS_STATUS" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加个微时间" class="no-pd">
              <template slot="label">
                <m-select
                  v-model="form.time.label"
                  class="mySelect"
                  :clearable="false"
                  style="max-width: 115px; margin-right: -3px"
                  dict-key="TIME_TYPE"
                />
              </template>
              <el-date-picker
                v-model="form.time.value"
                style="width: 100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线索意向">
              <m-select
                v-model="form.intentIdList"
                multiple
                :dict-list="intentConfigPage"
                :param="{ value: 'id', label: 'name' }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否重复">
              <m-select v-model="form.repeatBuy" dict-key="OKISNO_TYPE" />
            </el-form-item>
          </el-col>
          <el-col v-if="showReceiver" :span="6">
            <el-form-item label="收获地址">
              <m-select
                v-model="form.hasReceiverAddress"
                dict-key="IS_ADDRESS_TYPE"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="show" :gutter="20">
          <el-col :span="6">
            <el-form-item label="支付时间">
              <el-date-picker
                v-model="form.payTime"
                style="width: 100%"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button
              size="small"
              type="primary"
              @click="handleClickSearch"
            >查询</el-button>
            <el-button size="small" @click="clear">重置</el-button>
            <div
              style="display: inline-block; margin-left: 10px"
              @mouseenter="handleMouseenter"
            >
              <el-button size="medium" type="text" @click="show = !show">
                {{ show ? '收起' : '更多' }}
                <i
                  class="el-icon-arrow-up btn_more"
                  :class="{ btn_close: show }"
                />
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="custom">
          <el-button
            v-if="type === 'my'"
            v-permission="[permissionKey[0], permsList]"
            size="small"
            type="primary"
            plain
            class="m-r-20"
            @click="personalKit"
          >个人工具箱</el-button>
          <el-button
            v-if="type === 'all'"
            v-permission="[permissionKey[0], permsList]"
            size="small"
            type="primary"
            plain
            class="m-r-20"
            @click="handleActivateTask"
          >兜底任务线索</el-button>
          <el-button
            v-permission="[permissionKey[1], permsList]"
            size="small"
            type="primary"
            class="m-r-20"
            @click="handlefollowUpStatus"
          >跟进状态设置</el-button>
          <el-button
            v-if="type !== 'my'"
            v-permission="[permissionKey[3], permsList]"
            size="small"
            type="primary"
            @click="visible = true"
          >线索意向设置</el-button>
          <el-button
            v-permission="[permissionKey[2], permsList]"
            size="small"
            type="primary"
            :disabled="form.taskIdList.length !== 1"
            @click="onhandleClickTask"
          >任务报表</el-button>
        </el-col>
      </el-row>
    </el-form>
    <followUpStatusDrawer :drawer.sync="drawer" />
    <purposeSet :visible.sync="visible" @success="updateList" />
    <tagName ref="tagNameRef" :visible.sync="showTag" @handleChooseTag="handleChooseTag" />
  </div>
</template>

<script>
// import CustomTabelHeader from './CustomTabelHeader'
import followUpStatusDrawer from './components/followUpStatusDrawer'
import purposeSet from './components/purposeSet'
import {
  followWechatStatus,
  clueTypeStatus,
  followStatus,
  followPrivateWechatStatus
} from './columns'
import { mapGetters } from 'vuex'
import { materialSearchName } from '@/api/privateArea/CRM.js'
import { deptTree, userNoPage } from '@/api/addressBookApi'
import appTemplate from '@/components/AppTemplate/teacherSelect/index'
import { getTeacherPage } from '@/api/shop'
import {
  getSaleTaskPage,
  getClueRefundStatus,
  getFollowType,
  getSaleTaskList
} from '@/api/privateArea/CRM'
import { queryShopReceiver } from '@/api/privateArea/clue'
import TagName from './components/tagName'
import moment from 'moment'
export default {
  components: {
    // CustomTabelHeader,
    appTemplate,
    followUpStatusDrawer,
    purposeSet,
    TagName
    // CourseSelect
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    search: {
      type: Object,
      default: () => {
        return {
          orderStatus: '',
          time: { label: 'addGwTime', value: '' },
          isAddQwAndGw: '',
          wxKey: { label: 'wechatNickName', value: '' },
          channelId: '',
          isAvailable: '',
          intentIdList: [],
          repeatBuy: '',
          hasReceiverAddress: '',
          productCategory: '',
          clueType: '', // 线索类型1订单 2线下表格
          createTime: ['', ''], // 分配时间
          payTime: ['', ''], // 支付时间
          tags: [], // 企微标签Id
          followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
          deptIdList: [],
          followUserId: '', // 跟进人伏羲云用户userId
          isAddQw: '', // 是否添加企微： 0-是 1-否
          isAddGw: '', // 是否添加个微： 0-是 1-否
          lastFollowTime: ['', ''], // 跟进时间
          gwTime: ['', ''], // 个微时间
          qwTime: ['', ''], // 个微时间
          taskIdList: [], // 任务Id
          wechatNickName: '',
          taskName: '',
          remark: '', // 微信备注名
          teacherId: '',
          orderNo: '', // 订单号
          teacherName: '',
          user: { label: 'phone', value: '' }, // 学员搜索
          classStatus: '',
          goodsName: '',
          tagName: '',
          webTagNames: ''
          // phone: '', // 手机号
          // userName: '' // 用户名
        }
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    intentConfigPage: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    isDepTask: {
      type: Number,
      default: undefined
    },
    permissionKey: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deptTreeArray: [],
      orderStatus: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '支付成功', value: 2 },
        { label: '超时已关闭', value: 3 },
        { label: '用户已取消', value: 4 },
        { label: '退款中', value: 5 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 },
        { label: '交易结束', value: 8 },
        { label: '没有向第三方发起支付请求', value: 9 },
        { label: '退款金额异常', value: 10 },
        { label: '部分付款', value: 11 },
        { label: '转课关闭', value: 12 }
      ],
      permsList: this?.$route?.meta?.permsList || [],
      form: {
        orderStatus: '',
        channelId: '',
        isAvailable: '',
        intentIdList: [],
        repeatBuy: '',
        hasReceiverAddress: '',
        time: { label: 'addGwTime', value: '' },
        isAddQwAndGw: '',
        wxKey: { label: 'wechatNickName', value: '' },
        productCategory: '',
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        payTime: ['', ''], // 支付时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        deptIdListValue: [],
        deptIdList: [],
        followUserId: '', // 跟进人伏羲云用户userId
        isAddQw: '', // 是否添加企微： 0-是 1-否
        isAddGw: '', // 是否添加个微： 0-是 1-否
        lastFollowTime: ['', ''], // 跟进时间
        taskIdList: [], // 任务Id
        wechatNickName: '',
        taskName: '',
        remark: '', // 微信备注名
        teacherId: '',
        teacherName: '',
        classStatus: '',
        goodsName: '',
        user: { label: 'phone', value: '' }, // 学员搜索
        goodsId: '',
        tagName: '',
        webTagNames: '',
        tagInfoVo: []
        // phone: '', // 手机号
        // userName: '' // 用户名
      },
      getClueRefundStatus,
      drawer: false,
      visible: false,
      followWechatStatus,
      followPrivateWechatStatus,
      clueTypeStatus,
      followStatus,
      exportLoading: false,
      showReceiver: true,
      show: false,
      userArray: [],
      tabList: [
        { id: '5', name: '线下课', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' }
      ],
      TagOptions: [],
      goodsList: [],
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      timer: null,
      taskList: [],
      goodsLoading: false,
      followTypeList: [],
      showTag: false
    }
  },
  computed: {
    ...mapGetters(['channelsource', 'channelSourceType'])
  },
  watch: {
    search: {
      handler: function () {
        // 回调函数
        this.form = this.search
      },
      deep: true, // 深度监听
      immediate: true // 创建立即执行
    },
    drawer(val) {
      if (!val) {
        this.$emit('drawerChange')
      }
    }
  },
  activated() {
    this.$store.dispatch('option/getChannelsourceType')
    this.queryShopReceiver()
    this.loadTreeData()
    this.initSearch()
  },
  deactivated() {
    this.show = false
  },
  destroyed() {
    this.show = false
    this.timer && clearInterval(this.timer)
  },
  mounted() {
    this.queryShopReceiver()
    this.$store.dispatch('option/getChannelsourceType')
    this.loadTreeData()
    this.initSearch()
    this.initSelect()
    // this.getList()
    this.loadUserNoPage()
    this.timer && clearInterval(this.timer)
  },
  methods: {
    handleChooseTag(tagList) {
      this.form.tags = tagList.map(item => item.id)
      this.form.tagInfoVo = tagList.map(item => ({ tagId: item.id, tagName: item.tagName, tagType: item.isCompany ? 2 : 1 }))
      this.form.webTagNames = tagList.map(item => item.tagName).join(',')
    },
    handleInputTagName() {
      this.showTag = true
    },
    async queryShopReceiver() {
      const { code, data } = await queryShopReceiver()
      if (code === 1) this.showReceiver = data
    },
    handleDeptIdList() {
      this.form.followUserId = ''
      this.loadUserNoPage(this.form?.deptIdList?.join(',') || '')
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      console.log(3333, res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    handleTasks(value) {
      if (!value) this.form.classStatus = ''
    },
    async initSelect() {
      const { data } = await getFollowType({
        isShowNotFollow: true
      })
      this.followTypeList = data || []
    },
    async remoteMethodGoods(goodsName) {
      this.goodsLoading = true
      try {
        const { data } = await materialSearchName({
          goodsName
        })
        this.goodsLoading = false
        this.goodsList = data
      } catch (e) {
        this.goodsLoading = false
      }
    },
    handleMouseenter() {
      if (!this.show) this.show = true
    },
    personalKit() {
      this.$router.push('/privateArea/personalKit')
    },
    initForm() {
      this.form = {
        orderStatus: '',
        channelId: '',
        isAvailable: '',
        intentIdList: [],
        repeatBuy: '',
        hasReceiverAddress: '',
        time: { label: 'addGwTime', value: '' },
        isAddQwAndGw: '',
        wxKey: { label: 'wechatNickName', value: '' },
        clueType: '', // 线索类型1订单 2线下表格
        createTime: ['', ''], // 分配时间
        payTime: ['', ''], // 支付时间
        gwTime: ['', ''], // 个微时间
        qwTime: ['', ''], // 个微时间
        tags: [], // 企微标签Id
        followRecordTypes: [], // 跟进状态1-已加个微待通过、2-不需要、3-在忙、4-未接、5-意向客户、6-未知
        deptIdListValue: [],
        deptIdList: [],
        followUserId: '', // 跟进人伏羲云用户userId
        isAddQw: '', // 是否添加企微： 0-是 1-否
        isAddGw: '', // 是否添加个微： 0-是 1-否
        lastFollowTime: ['', ''], // 跟进时间
        taskIdList: [], // 任务Id
        wechatNickName: '',
        taskName: '',
        remark: '', // 微信备注名
        teacherId: '',
        teacherName: '',
        classStatus: '',
        goodsName: '',
        goodsId: '',
        tagName: '',
        tagInfoVo: [],
        webTagNames: '',
        user: { label: 'phone', value: '' } // 学员搜索
      }

      this.$setPageSearch({ ...this.form })
    },
    getTaskIdPage(params) {
      const data = {
        pageIndex: 1,
        pageSize: 999,
        taskName: params.taskName,
        isDepTask: this.type === 'my' ? '2' : undefined
      }
      return getSaleTaskPage(data).then(res => {
        this.taskList = res.data.items || []
        return {
          data: res.data.items
        }
      })
    },
    handleFollowFocus() {
      this.loadUserNoPage(this.form?.deptIdList?.join(',') || '')
    },
    loadUserNoPage(deptIds = '') {
      const params = {
        deptId: '',
        nickName: '',
        deptIds
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    clear() {
      this.initForm()
      this.handleClickSearch()
      this.$refs.tagNameRef.handleClear()
    },
    handleClickSearch() {
      this.show = false
      this.$setPageSearch({ ...this.form })
      this.$emit('searchFn', {
        ...this.form,
        hasReceiverAddress: this.showReceiver
          ? this.form.hasReceiverAddress
          : ''
      })
    },
    // 点击任务看板
    onhandleClickTask() {
      this.$uweb && this.$uweb.setAction('Event_salseTaskData_click')
      this.$uweb && this.$uweb.setAction('Event_Taskkanban_page')
      const task = this.taskList.find(
        item => item.id === this.search.taskIdList[0]
      )
      this.search.taskName = task.taskName
      this.$emit('onTask')
    },
    handleActivateTask() {
      this.$router.push('/privateArea/CRM/revealTaskClue?success=1&path=clue')
    },
    handlefollowUpStatus() {
      this.drawer = true
    },

    handleExternalInput(value) {
      console.log(value)
    },
    // 获取列表数据
    getList(tagName = '') {
      const type = {
        my: 2,
        department: 3,
        all: 1
      }
      const params = {
        pageIndex: 1,
        pageSize: 999999999,
        tagName,
        sync: true,
        searchType: type[this.type]
      }
      getSaleTaskList(params).then(res => {
        this.TagOptions = res.data.items
      })
    },
    // courseSelect(res) {
    //   if (res.length > 0) {
    //     this.search.goodsId = res[0].goodsId
    //     this.search.goodsName = res[0].contentName
    //     this.$emit('searchFn')
    //   }
    // },
    getTearchPage(params) {
      return getTeacherPage(params).then(res => {
        return {
          items: res.data.records,
          total: res.data.total
        }
      })
    },
    initSearch() {
      // 获取search缓存 数据
      if (this.$route.params && Object.keys(this.$route.params)?.length !== 0) {
        this.form = {
          ...this.search,
          ...this.$route.params,
          taskIdList: [this.$route.params.taskId],
          user: { label: 'phone', value: '' }
        }
        return this.$emit('searchFn', {
          ...this.form,
          hasReceiverAddress: this.showReceiver
            ? this.form.hasReceiverAddress
            : ''
        })
      }
      const initSearchData = this.$getPageSearch()
      // 判断是否智能销售跳转过来的
      if (this.$route.query.taskId && this.$route.query.taskName) {
        initSearchData.taskIdList = [this.$route.query.taskId]
      }
      if (initSearchData) {
        this.form = { ...this.form, ...initSearchData }
      }
      this.$nextTick(() => {
        this.$refs.optionRef.remoteMethod()
      })
      this.remoteMethodGoods()
      this.$emit('searchFn', {
        ...this.form,
        hasReceiverAddress: this.showReceiver
          ? this.form.hasReceiverAddress
          : ''
      })
    },
    handleChangeTaskIdPage() {
      if (!this.form.taskIdList.length) {
        this.$refs.optionRef.remoteMethod()
      }
    },
    updateList() {
      this.$emit('searchFn', {
        ...this.form,
        hasReceiverAddress: this.showReceiver
          ? this.form.hasReceiverAddress
          : ''
      })
      this.$emit('updateIntentConfig')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-select::v-deep {
  // .el-input__suffix{
  //   left:10px;
  // }
  .el-input-group__prepend {
    width: 80px;

    > div {
      width: auto !important;
    }
  }
}

.filterTop::v-deep {
  margin-top: 16px;
  border-bottom: 1px solid #e7e7e7;

  .filterFooter {
    .custom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      float: right;
    }

    .filterBottom {
      display: flex;
      align-items: center;
    }
  }

  .no-pd {
    .el-form-item__label {
      padding: 0px;
    }
  }
}

.custom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  float: right;
}

.btn_close {
  transform: rotate(180deg);
}

::v-deep {
  .el-select {
    width: 100% !important;
  }
  .tearchInput {
    width: 100%;
  }

  label {
    font-weight: normal;
    color: #333;
  }
  .mySelect .el-input__suffix .el-input__suffix-inner {
    pointer-events: none;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
