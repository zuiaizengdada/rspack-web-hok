<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="订单搜索">
            <el-input v-model.trim="search.order.value" placeholder="请输入内容" class="input-with-input" clearable>
              <el-select slot="prepend" v-model="search.order.label" placeholder="请选择" class="input-with-select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单时间">
            <div class="order-time-box">
              <el-select v-model="search.time.label" placeholder="请选择" class="input-with-select input-with-select-chang">
                <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-date-picker
                v-model="search.time.value"
                clearable
                class="input-with-time"
                type="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
              />
            </div>
            <!-- <el-input v-model="search.time.value" placeholder="请输入内容" class="input-with-input" /> -->
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="search.orderType" clearable placeholder="请选择" class="input-with-select select-width-200" @change="sureSearch" @clear="sureSearch">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="订单搜索">
            <el-select v-model="search" placeholder="请选择" class="w-120">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input
              v-model.trim="search"
              class="w-250 m-l-20"
              clearable
              @clear="sureSearch"
              @keyup.enter.native="sureSearch"
            />
          </el-form-item> -->
        </el-row>
        <el-row>
          <el-form-item label="下单场景">
            <el-select
              v-model="search.orderSource"
              clearable
              placeholder="请选择"
              class="input-with-select select-width-200"
              @change="sureSearch"
              @clear="sureSearch"
            >
              <el-option
                label="全部"
                value=""
              />
              <el-option
                v-for="(item,index) in orderSource"
                :key="item"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流量类型">
            <el-select
              v-model="search.orderClassification"
              clearable
              placeholder="请选择"
              class="input-with-select select-width-200"
              @change="sureSearch"
              @clear="sureSearch"
            >
              <el-option
                label="全部"
                value=""
              />
              <el-option
                v-for="(item,index) in orderClassification"
                :key="item"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="带货信息">
            <el-select
              v-model="search.commerceEnum"
              placeholder="请选择"
              class="input-with-select commerce"
              @change="handleChangeSelect"
            >
              <el-option
                v-for="(item,index) in commerceEnum"
                :key="item"
                :label="item"
                :value="index"
              />
            </el-select>
            <el-select
              v-show="['0'].includes(search.commerceEnum)"
              v-model="search.commerceInfoValue"
              style="margin-left:-3px"
              class="input-with-input"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入内容"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in personOptions"
                :key="item.expertId"
                :label="item.expertName"
                :value="item.expertId"
              />
            </el-select>
            <el-select
              v-show="['2','3','4','5','6'].includes(search.commerceEnum)"
              v-model="search.commerceInfoValue"
              style="margin-left:-3px"
              class="input-with-input"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入内容"
              :remote-method="userRemoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
            <el-input
              v-show="['1','7'].includes(search.commerceEnum)"
              v-model.trim="search.commerceInfoValue"
              placeholder="请输入内容"
              style="margin-left:-3px"
              class="input-with-input"
              clearable
              maxlength="30"
              @input="handleValidator"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单状态">
            <div class="common-width">
              <el-select v-model="search.orderStatus" clearable placeholder="请选择" class="input-with-select select-width-200" @change="sureSearch" @clear="sureSearch">
                <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item v-if="search.activeName !== '我的审批'" label="审核状态">
            <div class="common-width common-w336">
              <el-select v-model="search.orderAudit" clearable placeholder="请选择" class="input-with-select select-width-200" @change="sureSearch('audit',search.orderAudit)" @clear="sureSearch">
                <el-option v-for="item in optionsAudit" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="推广订单">
            <div class="common-width" :class="search.activeName === '我的审批' ?'common-w336':''">
              <el-select
                v-model="search.payPromotion"
                placeholder="请选择"
                class="w-200"
                clearable
                @change="sureSearch"
                @clear="sureSearch"
              >
                <el-option v-for="item in payPromotion" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item v-if="search.activeName === '我的审批'" label="订单金额">
            <div class="common-width">
              <el-input
                v-model="search.starPrice"
                placeholder="请输入"
                maxlength="6"
                clearable
                class="price-in"
              />
              -
              <el-input
                v-model="search.endPrice"
                placeholder="请输入"
                maxlength="6"
                clearable
                class="price-in"
              />
              <div />
            </div>
          </el-form-item>
          <!-- <el-form-item label="跟进人员">
            <div class="common-width">
              <el-tag v-if="search.folowerId" closable @close="delFolower">{{ search.folowerNickName }}</el-tag>
              <el-button v-else class="folower-btn" @click="selectUser">选择人员</el-button>
            </div>
          </el-form-item> -->
        </el-row>
        <template v-if="searchOpen">
          <el-row>
            <!-- <el-form-item label="推广订单">
              <div class="common-width">
                <el-select
                  v-model="search.payPromotion"
                  placeholder="请选择"
                  class="w-200"
                  clearable
                  @change="sureSearch"
                  @clear="sureSearch"
                >
                  <el-option v-for="item in payPromotion" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </el-form-item> -->
            <!-- <el-form-item label="支付方式">
              <div class="common-width">
                <el-select v-model="search.paymentType" clearable placeholder="请选择" class="w-200">
                  <el-option label="全部" value="" />
                  <el-option v-for="item in paymentType_options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="订单金额">
              <div class="common-width">
                <el-input
                  v-model="search.starPrice"
                  placeholder="请输入"
                  maxlength="6"
                  clearable
                  class="price-in"
                />
                -
                <el-input
                  v-model="search.endPrice"
                  placeholder="请输入"
                  maxlength="6"
                  clearable
                  class="price-in"
                />
                <div />
              </div>
            </el-form-item> -->
          </el-row>
          <el-row>
            <el-form-item v-if="search.activeName !== '我的审批'" label="订单金额">
              <div class="common-width">
                <el-input
                  v-model="search.starPrice"
                  placeholder="请输入"
                  maxlength="6"
                  clearable
                  class="price-in"
                />
                -
                <el-input
                  v-model="search.endPrice"
                  placeholder="请输入"
                  maxlength="6"
                  clearable
                  class="price-in"
                />
                <div />
              </div>
            </el-form-item>
            <el-form-item label="渠道平台">
              <div class="common-width common-w336">
                <el-select
                  v-model="search.channelSource"
                  clearable
                  placeholder="请选择"
                  class="w-200"
                  @change="channelSourceChange()"
                >
                  <el-option
                    v-for="item in channelSourceType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item
              v-if="search.channelSource && (search.channelSource !== 3 && search.channelSource !== 13 && search.channelSource !== 21)"
              label="渠道来源"
            >
              <div class="common-width">
                <el-input v-model="search.thirdShopName" disabled class="w-200 m-r-10" />
                <el-button type="primary" @click="selectThirdShop()">选择</el-button>
              </div>
            </el-form-item>

            <el-form-item v-if="search.channelSource === 3 || search.channelSource === 13" label="渠道来源">
              <div class="common-width">
                <el-select v-model="search.userTerminal" clearable placeholder="请选择" class="w-200" @change="sureSearch" @clear="sureSearch">
                  <el-option
                    v-for="item in optionsUserTerminal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item v-if="search.channelSource === 13" label="直播间">
              <el-input v-model="search.liveRoomCode" placeholder="请输入直播间ID" clearable @clear="sureSearch" />
            </el-form-item>
          </el-row>
        </template>
      </el-form>
    </div>
    <div class="search-control">
      <div class="search-control-l">
        <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
        <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
        <!-- <div v-permission="['web:order:orderSign', permsList]" class="searchBtn" @click="orderSignConfig.visible = true">订单标记</div> -->
        <el-button type="text" class="more-box" @click="searchOpen = !searchOpen">
          {{ searchOpen ? '收起' : '更多' }}
          <i class="el-icon-arrow-up btn_more" :class="{ btn_close: searchOpen }" />
        </el-button>
      </div>
      <div class="search-control-r">
        <el-button
          v-if="tableDataNum>0"
          v-permission="['system:order:export', permsList]"
          size="small"
          class="control-btn"
          :loading="exportLoading"
          @click="goodsOrderExport"
        >导出</el-button>
        <el-button v-if="search.activeName === '全部订单' || search.activeName === '我的订单'" v-permission="['system:order:addOrderAndUpdate', permsList]" size="small" class="control-btn" @click="onClickAddGiftOrder">新版录单</el-button>
        <el-button v-if="search.activeName === '全部订单' || search.activeName === '我的订单'" v-permission="['system:order:addGiftOrder', permsList]" size="small" class="control-btn" @click="onClickEntryForm">老方式录单</el-button>
        <span v-if="search.activeName === '全部订单'" v-permission="['system:order:adopt', permsList]">
          <el-dropdown @command="handleCommandReceive">
            <el-button size="small" class="control-btn" style="margin:0 10px;">
              订单认领<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">订单认领</el-dropdown-item>
              <el-dropdown-item command="2">多订单认领</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-button v-if="search.activeName === '全部订单'" v-permission="['system:order:receive', permsList]" size="small" class="control-btn" @click="onClickReceiveRecordModel">认领记录</el-button>
        <el-button v-permission="['web:order:orderSign', permsList]" size="small" class="control-btn" @click="toAddBiaoji">订单标记</el-button>
        <el-button v-permission="['web:order:delivery', permsList]" :loading="exportDeliveryLoading" size="small" class="control-btn" @click="deliverySingle">小程序发货单</el-button>
      </div>
    </div>
    <div v-if="optionsApproval.length > 1 && search.activeName === '我的审批'" class="approval-control">
      <div class="approval-list">
        <div v-for="item in optionsApproval" :key="item.id" class="approval-child" :class="[item.status ? 'approval-active':'']" @click="onClickApproval(item.label,item.id)">{{ item.name }}</div>
      </div>
    </div>
    <div class="el-drawer-cls">
      <el-drawer
        :title="orderSignConfig.title"
        :visible.sync="orderSignConfig.visible"
        size="1000px"
        :wrapper-closable="false"
        direction="rtl"
      >
        <orderSign ref="orderSignBj" :config="orderSignConfig" />
      </el-drawer>
    </div>
    <receiveModel ref="receiveModelRef" />
    <receiveRecordModel ref="receiveRecordModelRef" />
    <batchReceiveModel ref="batchReceiveModelRef" />
  </div>
</template>

<script>
import {
  goodsOrderExport,
  findTypeList,
  getLxUrl,
  exportDouAppGiftOrder
} from '@/api/business'
import { getexpertManPageNew } from '@/api/order/performanceShare'
import { userNoPage } from '@/api/addressBookApi'
import orderSign from '../orderSign' // 订单标记弹框
import { mapGetters } from 'vuex'
import moment from 'moment'
import receiveModel from './receiveModel.vue'
import receiveRecordModel from './receiveRecordModel.vue'
import batchReceiveModel from './batchReceiveModel.vue'
import {
  userTerminal,
  orderSource,
  orderClassification,
  commerceEnum
} from '@/utils/enum'
export default {
  name: 'SearchTop',
  components: {
    orderSign,
    receiveModel,
    receiveRecordModel,
    batchReceiveModel
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['optionsApproval'],
  data() {
    return {
      orderSource,
      orderClassification,
      commerceEnum,
      searchStatus: true,
      permsList: this.$route.meta.permsList || [],
      exportLoading: false,
      exportDeliveryLoading: false,
      searchs: '',
      approvalName: '',
      currentTime: '',
      loading: false,
      personOptions: [],
      userOptions: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        },
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(60, 'days').valueOf()
            const maxTime = moment(this.currentTime).add(60, 'days').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      options: [
        { label: '订单号', value: 'orderNo' },
        { label: '招生老师', value: 'enrollmentTeacherName' },
        { label: '交易单号', value: 'transactionId' },
        { label: '商品名称', value: 'goodsName' },
        { label: '买家昵称', value: 'userName' },
        { label: '买家手机号', value: 'userPhone' },
        { label: '用户ID', value: 'userId' },
        { label: '备注', value: 'depositGoodsName' }
      ],
      optionsAccurate: [
        { label: '获客订单号', value: 'orderNo' },
        { label: '第三方订单号', value: 'transactionId' }
      ],
      optionsTime: [
        { label: '下单时间', value: 1 },
        { label: '入账时间', value: 2 },
        { label: '退款时间', value: 3 }
      ],
      optionsType: [
        { label: '全部', value: '' }
      ],
      optionsAudit: [
        { label: '全部', value: '' },
        { label: '待初审', value: 0 },
        { label: '待复审', value: 1 },
        { label: '审核失败', value: 2 },
        { label: '审核成功', value: 3 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
      paymentType: [
        { label: '全部', value: '' },
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 }
      ],
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
      payPromotion: [
        { label: '全部', value: '' },
        { label: '推广付费', value: 1 }
      ],
      searchOpen: true,
      orderSignConfig: {
        visible: false,
        title: '标记条件配置'
      },
      tableDataNum: 0,
      optionsTask: [],
      search: {
        type: 1,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        commerceEnum: '0',
        commerceInfoValue: '',
        orderClassification: '',
        orderSource: '',
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '', // 审核页面审核状态
        operateUid: '',
        anchorUid: '',
        centralControlUid: '',
        pitcherUid: '',
        liveOperateUid: '',
        expertId: '',
        liveScheduleId: '',
        activeName: '全部订单'
      },
      enrollmentTeacherName: ''
    }
  },
  computed: {
    ...mapGetters(['channelSourceType', 'paymentType_options'])
  },
  watch: {
    // 'search': {
    //   handler(val) {
    //     // if (this.searchStatus) {
    //     //   if (val.activeName === '我的审批') {
    //     //     if (val.approvalName === '初审订单') {
    //     //       this.onClickApproval(0)
    //     //       this.searchStatus = false
    //     //     } else {
    //     //       this.onClickApproval(1)
    //     //       this.searchStatus = false
    //     //     }
    //     //   }
    //     //   console.log('val---====', val)
    //     // }

    //     this.searchs = val
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.getFindTypeList()
  },
  mounted() {
    // if (this.search.approvalName === '初审订单') {
    //   this.onClickApproval(0)
    // } else if (this.search.approvalName === '复审订单') {
    //   this.onClickApproval(1)
    // }
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    const result = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
    const startTime = now.setDate(now.getDate() - 30)
    const starty = new Date(startTime).getFullYear()
    const startm = new Date(startTime).getMonth() + 1
    const startd = new Date(startTime).getDate()
    const resultStart = starty + '-' + (startm < 10 ? '0' + startm : startm) + '-' + (startd < 10 ? '0' + startd : startd)
    this.search.time.value = [resultStart, result]
  },
  methods: {
    toAddBiaoji() {
      this.orderSignConfig.visible = true
      this.$nextTick(() => {
        this.$refs.orderSignBj.editConfig.title = '新增标记条件'
        this.$refs.orderSignBj.form = {
          orderPlatform: [], // 渠道店铺
          productId: '',
          shopName: '',
          id: '',
          tagName: '', // 标记名称
          orderName: '' // 商品名
        }
      })
    },
    async deliverySingle() {
      this.exportDeliveryLoading = true
      let type = 1 // 1、全部订单 2、我的订单 3、我的审核
      if (this.search.activeName === '全部订单') {
        type = 1
      } else if (this.search.activeName === '我的订单') {
        type = 2
      } else if (this.search.activeName === '我的审批') {
        type = 3
      }
      const params = {
        current: this.search.current,
        size: this.search.size,
        [this.search.order.label]: this.search.order.value,
        timeType: this.search.time.label,
        startTime: this.search.time.value && this.search.time.value[0],
        endTime: this.search.time.value && this.search.time.value[1],
        orderStatus: this.search.orderStatus || '',
        paymentType: this.search.paymentType || '',
        userTerminal: this.search.userTerminal || '',
        channelSource: this.search.channelSource,
        thirdShopId: this.search.thirdShopId,
        folowerId: this.search.folowerId,
        payPromotion: this.search.payPromotion,
        examineStatus:
          this.search.activeName === '我的审批'
            ? this.search.examineStatus
            : this.search.orderAudit,
        orderMax: this.search.endPrice,
        orderMin: this.search.starPrice,
        orderConfigId: this.search.orderType,
        liveRoomCode: this.search.liveRoomCode,
        orderClassification: this.search.orderClassification,
        orderSource: this.search.orderSource,
        type
      }
      const { data } = await exportDouAppGiftOrder(params)
      this.downloadExecl(data.taskId)
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const { data } = await getexpertManPageNew({ expertName: query })
          console.log('ssssss:', data)
          this.loading = false
          this.personOptions = data ?? []
        } catch (e) {
          this.loading = false
        }
      } else {
        this.personOptions = []
      }
    },
    async userRemoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const { data } = await userNoPage({ nickName: query })
          this.loading = false
          this.userOptions = data ?? []
        } catch (e) {
          this.loading = false
        }
      } else {
        this.userOptions = []
      }
    },
    handleValidator(val) {
      this.search.commerceInfoValue = val.replace(/[^a-zA-Z0-9]/ig, '')
    },
    handleChangeSelect() {
      // 初始化
      this.userOptions = []
      this.personOptions = []
      this.search.commerceInfoValue = ''
      this.search.liveScheduleId = ''
      this.search.expertId = ''
      this.search.operateUid = ''
      this.search.anchorUid = ''
      this.search.centralControlUid = ''
      this.search.pitcherUid = ''
      this.search.liveOperateUid = ''
    },
    getFindTypeList() {
      const param = {}
      findTypeList(param)
        .then((res) => {
          res.data.map(v => {
            this.optionsType.push({ label: v.type, value: Number(v.id) })
          })
        })
        .catch(() => {
        })
    },
    async onClickEntryForm() {
      const res = await this.$store.dispatch('user/viewingFlag', 'newAddOrder')
      if (res) return
      this.$router.push({ path: `/business/orderManage/addOrder` })
    },
    async onClickAddGiftOrder() {
      const res = await this.$store.dispatch('user/viewingFlag', 'newAddOrder')
      if (res) return
      this.$router.push({ path: `/business/orderManage/addOrder?type=gift` })
    },
    isNumeric(n) {
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(n)) {
        return true
      }
      return false
    },
    sureSearch(type, num) {
      const starPrice = this.search.starPrice
      const endPrice = this.search.endPrice
      if (starPrice !== '' && starPrice !== undefined && starPrice !== null || endPrice !== '' && endPrice !== undefined && endPrice !== null) {
        if (this.isNumeric(starPrice) && this.isNumeric(endPrice)) {
          if (endPrice - starPrice >= 0) {
            this.search.current = 1
            this.$emit('search', this.search)
          } else {
            this.$message.error('订单金额开始值不能大于结束值')
          }
        } else {
          this.$message.error('订单金额请输入数字')
        }
      } else {
        this.search.current = 1
        this.$emit('search', this.search)
      }
    },
    clear() {
      this.search = {
        type: 1,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        commerceEnum: '0',
        commerceInfoValue: '',
        orderClassification: '',
        orderSource: '',
        goodsName: '', // 商品名称
        liveRoomCode: '', // 直播间ID
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '全部订单', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '', // 审核页面审核状态
        operateUid: '',
        anchorUid: '',
        centralControlUid: '',
        pitcherUid: '',
        liveOperateUid: '',
        expertId: '',
        liveScheduleId: ''
      }
      this.handleChangeSelect()
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const result = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      const startTime = now.setDate(now.getDate() - 30)
      const starty = new Date(startTime).getFullYear()
      const startm = new Date(startTime).getMonth() + 1
      const startd = new Date(startTime).getDate()
      const resultStart = starty + '-' + (startm < 10 ? '0' + startm : startm) + '-' + (startd < 10 ? '0' + startd : startd)
      this.search.time.value = [resultStart, result]
      this.$emit('search', this.search)
    },
    listTypeChange(val) {
      const res = val
      if (val.name === '我的审批') {
        this.approvalName = val.approvalName
        if (val.approvalName === '初审订单') {
          this.optionsApproval.forEach(v => {
            v.status = false
          })
          res.examineStatus = 0
          this.optionsApproval[0].status = true
          res.approvalName = this.optionsApproval[0].name
        } else {
          if (this.optionsApproval.length === 1) {
            this.optionsApproval.forEach(v => {
              v.status = false
            })
            res.examineStatus = 1
            this.optionsApproval[0].status = true
            res.approvalName = this.optionsApproval[0].name
          } else {
            this.optionsApproval.forEach(v => {
              v.status = false
            })
            res.examineStatus = 1
            this.optionsApproval[1].status = true
            res.approvalName = this.optionsApproval[1].name
          }
        }
      }
      this.$emit('searchFnApproval', res)
    },
    approvalChange(val) {
      this.approvalName = val
    },
    sizeChange(e) {
      this.search.size = e
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
    },
    receiveTableDataNum(e) {
      console.log(e)
      this.$refs.orderSearch.tableDataNumChange(e)
    },
    onClickApproval(key, id) {
      this.optionsApproval.map(v => {
        v.status = false
      })
      console.log('key', key)
      this.search.examineStatus = id
      this.optionsApproval[key].status = true
      this.search.approvalName = this.optionsApproval[key].name
      this.sureSearch()
    },
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.search.channelSource },
        success: (res) => {
          this.search.current = 1
          this.search.thirdShopName = res.shopName
          this.search.thirdShopId = res.shopId
          this.$emit('search', this.search)
        }
      })
    },
    channelSourceChange() {
      this.search.current = 1
      this.search.thirdShopName = ''
      this.search.thirdShopId = ''
      this.$emit('search', this.search)
    },
    delFolower() {
      this.search.folowerId = ''
      this.search.folowername = ''
      this.search.current = 1
      this.$emit('search', this.search)
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: (res) => {
          if (res.user.length > 0) {
            this.search.current = 1
            this.search.folowerId = res.user[0].userId
            this.search.folowerNickName = res.user[0].nickName
            this.search.folowername = res.user[0].userName
            this.$emit('search', this.search)
          }
        }
      })
    },
    // 点击导出
    goodsOrderExport() {
      this.exportLoading = true
      let type = 1 // 1、全部订单 2、我的订单 3、我的审核
      if (this.search.activeName === '全部订单') {
        type = 1
      } else if (this.search.activeName === '我的订单') {
        type = 2
      } else if (this.search.activeName === '我的审批') {
        type = 3
        if (this.search.approvalName === '初审订单') {
          console.log('初审订单')
          // this.search.orderAudit === 0 || this.search.orderAudit === '' ? this.search.orderAudit = 0 : ''
        } else if (this.search.approvalName === '复审订单') {
          console.log('复审订单')
          // this.search.orderAudit === 1 || this.search.orderAudit === '' ? this.search.orderAudit = 1 : ''
        }
      }
      const params = {
        // ...this.search,
        // order: this.search.order.value,
        current: this.search.current,
        size: this.search.size,
        [this.search.order.label]: this.search.order.value,
        timeType: this.search.time.label,
        startTime: this.search.time.value && this.search.time.value[0],
        endTime: this.search.time.value && this.search.time.value[1],
        orderStatus: this.search.orderStatus || '',
        paymentType: this.search.paymentType || '',
        userTerminal: this.search.userTerminal || '',
        channelSource: this.search.channelSource,
        thirdShopId: this.search.thirdShopId,
        folowerId: this.search.folowerId,
        payPromotion: this.search.payPromotion,
        examineStatus: this.search.orderAudit,
        orderMax: this.search.endPrice,
        orderMin: this.search.starPrice,
        orderConfigId: this.search.orderType,
        type
      }
      const orderEnum = {
        0: 'expertId',
        1: 'expertId',
        2: 'operateUid',
        3: 'anchorUid',
        4: 'liveOperateUid',
        5: 'centralControlUid',
        6: 'pitcherUid',
        7: 'liveCode'
      }
      params[orderEnum[this.search.commerceEnum]] = this.search.commerceInfoValue
      const starPrice = this.search.starPrice
      const endPrice = this.search.endPrice
      if (starPrice !== '' && starPrice !== undefined && starPrice !== null || endPrice !== '' && endPrice !== undefined && endPrice !== null) {
        if (this.isNumeric(starPrice) && this.isNumeric(endPrice)) {
          if (endPrice - starPrice >= 0) {
            // 请求
            this.goodsOrderExportApi(params)
          } else {
            this.$message.error('订单金额开始值不能大于结束值')
          }
        } else {
          this.$message.error('订单金额请输入数字')
        }
      } else {
        // 请求
        this.goodsOrderExportApi(params)
      }
      console.log(params, '导出请求参数')
    },
    goodsOrderExportApi(params) {
      goodsOrderExport(params)
        .then((res) => {
          // this.exportLoading = false
          console.log(res)
          // window.location = res.data
          // window.open(res.data, '_self')
          // var newWin = window.open('loading page', '_self')
          // newWin.location.href = res.data // 成功 重定向到目标页面
          if (res.code === 1) {
            this.downloadExecl(res.data.taskId)
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.exportDeliveryLoading = false
        })
    },
    downloadExecl(taskId) {
      const param = {
        taskId: taskId
      }
      getLxUrl(param)
        .then(res => {
          console.log('sssssss: ', res)
          if (res.code === 1 && res.data.status === 2) {
            this.exportLoading = false
            this.exportDeliveryLoading = false
            window.open(res.data.path, 'blank')
          } else {
            const that = this
            setTimeout(function() {
              that.downloadExecl(res.data.taskId)
            }, 1500)
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.exportDeliveryLoading = false
        })
    },
    tableDataNumChange(e) {
      console.log('更新数据', e)
      this.tableDataNum = e
    },
    tableDataPrecisen(e) {
      console.log(e, '搜索结果')
      this.searchPrecisen = e
    },
    // 订单认领
    onClickReceiveModel() {
      this.$refs.receiveModelRef.open()
    },
    // 认领记录
    onClickReceiveRecordModel() {
      this.$refs.receiveRecordModelRef.open()
    },
    handleCommandReceive(command) {
      if (command === '1') {
        this.$refs.receiveModelRef.open()
      } else if (command === '2') {
        this.$refs.batchReceiveModelRef.open()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.commerce.el-select ::v-deep{
  .el-input.is-focus .el-input__inner{
    border-color:#DCDFE6 !important
  }
}
.search-box {
  width: 100%;
  // display: flex;
  position: relative;
  .search-main {
      .input-with-select {
          width: 108px;
          height: 32px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          border-radius: 3px 0px 0px 3px;
      }
      .input-with-select-chang {
          ::v-deep  .el-input__inner {
              border: none;
              border-radius: 3px 0px 0px 3px;
              border: 1px solid #D8DCE6;
              border-right: none;
          }
      }
      .input-with-input {
          width: 308px;
      }
      .input-with-time {
          width: 228px;
          border: none;
          border-radius: 0px 3px 3px 0px;
          border: 1px solid #D8DCE6;
      }
      .order-time-box {
          display: flex;
      }
      .select-width-200 {
          width: 200px;
      }
      .common-width {
          width: 308px;
          .folower-btn {
              width: 200px;
          }
          .price-in {
              width: 92px;
          }
      }
      .common-w336 {
        width: 336px;
      }
  }
  .search-control {
      display: flex;
      margin: 0 20px;
      padding-bottom: 16px;
      justify-content: space-between;
      border-bottom: 1px solid #E7E7E7;
      margin-bottom: 15px;
      .search-control-l {
          margin-left: 10px;
          .more-box {
              margin-left: 26px;
          }
      }
      .search-control-r {
        margin-right: 10px;
      }
      .control-btn-primary {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #FFFFFF;
      }
      .control-btn {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #161616;
      }
  }
  .approval-control {
      background: #F3F3F3;
      border-radius: 4px;
      padding: 2px;
      margin: 15px 30px;
      display: inline-block;
      .approval-list {
          display: flex;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
          supported by Chrome, Edge, Opera and Firefox */
          .approval-child {
              width: 88px;
              height: 32px;
              line-height: 32px;
              background: #F3F3F3;
              border-radius: 2px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              text-align: center;
              cursor: pointer;
          }
          .approval-active {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #0C6FFF;
              background: #FFFFFF;
          }
      }

  }
}
.filter-module {
  padding: 16px 16px 0 16px;
  width: 100%;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
.footer-box {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.w-200 {
  width: 200px;
}
::v-deep .el-input-group__prepend {
  background-color: #FFFFFF;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  // color: #333333;
}
::v-deep .el-input__inner{
  height: 32px;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: #ededed;
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}
.el-drawer-cls {
  ::v-deep .el-drawer__header {
    padding-bottom: 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid #EFF2F6;
  }
}
</style>

