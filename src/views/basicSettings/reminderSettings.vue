<template>
  <MCard class="myCard overflowOuto">
    <div class="reminderSettingsTitle">提醒设置</div>
    <div class="reminderSettingsView">
      <div class="crmTitle">智能销售</div>

      <div class="title">开班前提醒班主任</div>
      <div v-loading="loading" class="m-t-8 m-b-32 remindDialog">
        <div>
          开班前
          <el-input-number
            v-model="form.beforeEnd"
            class="m-r-8 m-l-8"
            size="mini"
            :min="0"
            :max="48"
            :precision="0"
            :controls="false"
            style="width: 60px"
            @change="handleChange"
          />
          小时, 每隔
          <el-select
            v-model="form.intervalTime"
            class="m-r-8 m-l-8"
            style="width: 60px"
            size="mini"
            placeholder="请选择"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          分钟提醒 共提醒
          {{ parseInt((form.beforeEnd * 60) / form.intervalTime) || '-' }} 次
        </div>
      </div>
      <div class="title">班期成本确认{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32">
        <addUser
          :loading="remindCostRecognitionLoading"
          btn-text="添加提醒人员"
          :data="remindCostRecognition"
          @del="val => del('remindCostRecognition', val)"
          @add="val => add('remindCostRecognition', val)"
        />
      </div>
      <div class="title">
        项目交付预警提醒设置<span>（预警内容：未及时同步分配信息等）</span>
      </div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="prewsFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="handleSwitch(7)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="prewsListLoading"
            :shop-notice-flag="prewsFlag"
            btn-text="添加提醒人员"
            :data="prewsList"
            @del="val => del('prewsList', val)"
            @add="val => add('prewsList', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="prewsList"
            :shop-notice-flag="prewsFlag"
            :shop-feishu-group-list="prewsCrowdVosList"
            :set-type="7"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">助教分配提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="teachingFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="handleSwitch(8)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知提醒</span>
          <div class="shop-line-text-box">
            <div>
              单课程助教分配学员数达到
              <el-input-number
                v-model="ceilingNum"
                controls-position="right"
                :min="1"
                @change="handleSwitch(8)"
              />
              人提醒
            </div>
            <div>
              说明：统计学员状态为：待交付、交付中、延期交付、锁定交付，最新分配人员时，达到上述设置即提醒人员
            </div>
          </div>
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="teachingLoading"
            :shop-notice-flag="teachingFlag"
            btn-text="添加提醒人员"
            :data="teachingList"
            @del="val => del('teachingList', val)"
            @add="val => add('teachingList', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="teachingList"
            :shop-notice-flag="teachingFlag"
            :shop-feishu-group-list="teachingVosList"
            :set-type="8"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">已交付且已退款{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32">
        <addUser
          :loading="remindDeliveredLoading"
          btn-text="添加提醒人员"
          :data="remindDelivered"
          @del="val => del('remindDelivered', val)"
          @add="val => add('remindDelivered', val)"
        />
      </div>
      <div class="title">
        店铺漏单通知
        <el-switch
          v-model="shopNoticeFlag"
          active-color="#13ce66"
          inactive-color="#9c9c9c"
          style="margin-left: 15px"
          @change="setShopSwitch"
        />
        <el-button
          style="margin-left: 15px"
          type="primary"
          size="mini"
          @click.stop="toSetShopNotice"
        >设置</el-button>
      </div>
      <setShopNotice
        ref="setShopNotice"
        :set-shop-notice-flag="setShopNoticeFlag"
        :shop-notice-flag="shopNoticeFlag"
        @closeDrawer="closeDrawerEmit"
      />
      <div class="m-t-8 m-b-32 shop-notice">
        <!-- <div class="shop-line">
          <span class="shop-line-label">通知开关</span>

        </div> -->
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="dianpuLoading"
            :shop-notice-flag="shopNoticeFlag"
            btn-text="添加提醒人员"
            :data="dianpuDelivered"
            @del="val => del('dianpuDelivered', val)"
            @add="val => add('dianpuDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="dianpuDelivered"
            :shop-notice-flag="shopNoticeFlag"
            :shop-feishu-group-list="shopFeishuGroupList"
            :set-type="completeType"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">脱敏共享完成提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="videoNoticeFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setVideoSwitch('Notice')"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="videoLoadding"
            :shop-notice-flag="videoNoticeFlag"
            btn-text="添加提醒人员"
            :data="videoDelivered"
            @del="val => del('videoDelivered', val)"
            @add="val => add('videoDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="videoDelivered"
            :biz-id="videoBizId"
            :set-type="videoSetType"
            :shop-notice-flag="videoNoticeFlag"
            :shop-feishu-group-list="videoFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">脱敏视频分发提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="videoDistributeFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setVideoSwitch('Distribute')"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="videoDistributeLoadding"
            :shop-notice-flag="videoDistributeFlag"
            btn-text="添加提醒人员"
            :data="videoDistributeDelivered"
            @del="val => del('videoDistribute', val)"
            @add="val => add('videoDistribute', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="videoDistributeDelivered"
            :biz-id="videoDistributeBizId"
            :set-type="videoDistributeSetType"
            :shop-notice-flag="videoDistributeFlag"
            :shop-feishu-group-list="videoDistributeFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">自媒体账号数据同步提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="mediaNoticeFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setMediaSwitch"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="mediaLoadding"
            :shop-notice-flag="mediaNoticeFlag"
            btn-text="添加提醒人员"
            :data="mediaDelivered"
            @del="val => del('mediaDelivered', val)"
            @add="val => add('mediaDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="mediaDelivered"
            :biz-id="mediaBizId"
            :shop-notice-flag="mediaNoticeFlag"
            :set-type="mediaSetType"
            :shop-feishu-group-list="mediaFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">自媒体账号操作提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="mediaAccountFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setMediaAccountSwitch"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="mediaDataLoadding"
            :shop-notice-flag="mediaAccountFlag"
            btn-text="添加提醒人员"
            :data="mediaAccountDelivered"
            @del="val => del('mediaAccountDelivered', val)"
            @add="val => add('mediaAccountDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="mediaAccountDelivered"
            :biz-id="mediaAccountBizId"
            :shop-notice-flag="mediaAccountFlag"
            :set-type="mediaAccountType"
            :shop-feishu-group-list="mediaAccountFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">自媒体爆款视频通知</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="hotVideoFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setHotVideoSwitch"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="hotVideoLoadding"
            :shop-notice-flag="hotVideoFlag"
            btn-text="添加提醒人员"
            :data="hotVideoDelivered"
            @del="val => del('hotVideoDelivered', val)"
            @add="val => add('hotVideoDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="hotVideoDelivered"
            :biz-id="hotVideoBizId"
            :shop-notice-flag="hotVideoFlag"
            :set-type="hotVideoSetType"
            :shop-feishu-group-list="hotVideoFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <div class="title">
        商品未映射通知
        <el-switch
          v-model="unAssioncationFlag"
          active-color="#13ce66"
          inactive-color="#9c9c9c"
          style="margin-left: 15px"
          @change="setUnAssioncationSwitch"
        />
        <el-button
          style="margin-left: 15px"
          type="primary"
          size="mini"
          @click="goodsNotMappedClick"
        >设置</el-button>
      </div>
      <productNotMapped
        ref="productNotMapped"
        :product-not-mapped-flag="productNotMappedFlag"
        :un-assioncation-flag="unAssioncationFlag"
        @closeUnAssionDrawer="closeUnAssionDrawer"
      />
      <div class="m-t-8 m-b-32 shop-notice">
        <!-- <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="unAssioncationFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setUnAssioncationSwitch"
          />
        </div> -->
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="unAssioncationLoadding"
            :shop-notice-flag="unAssioncationFlag"
            btn-text="添加提醒人员"
            :data="unAssioncationDelivered"
            @del="val => del('unAssioncationDelivered', val)"
            @add="val => add('unAssioncationDelivered', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="unAssioncationDelivered"
            :biz-id="unAssioncationBizId"
            :shop-notice-flag="unAssioncationFlag"
            :set-type="unAssioncationSetType"
            :shop-feishu-group-list="unAssioncationFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
      <!-- <div class="title">
        C端运营提醒设置
        <span>
          （用途：C端自运营终端上架课程的审核，抖音小程序拒审/通过等{{
            types[loginType]
          }}提醒设置）
        </span>
      </div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="tikTokFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="val => handleTikTokSwitch(val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="tikTokLoading"
            :shop-notice-flag="tikTokFlag"
            btn-text="添加提醒人员"
            :data="tikTokList"
            @del="val => delTikTokList(val)"
            @add="val => addTikTokList(val)"
          />
        </div>
      </div> -->
      <div class="title">优惠券审核</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">初审人员</span>
          <addUser
            :loading="couponPreliminaryExaminationLoadding"
            :shop-notice-flag="couponPEFlag"
            btn-text="添加初审人员"
            :data="couponPreliminaryExamination"
            @del="val => del('couponPreliminaryExamination', val)"
            @add="val => add('couponPreliminaryExamination', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">复审人员</span>
          <addUser
            :loading="couponReexamineLoading"
            :shop-notice-flag="couponReexamineFlag"
            btn-text="添加复审人员"
            :data="couponReexamine"
            @del="val => del('couponReexamine', val)"
            @add="val => add('couponReexamine', val)"
          />
        </div>
      </div>
      <div class="title">解除锁单{{ types[loginType] }}提醒设置</div>
      <unlockOrderRemind class="m-t-16 m-b-32" />
      <div class="title">
        资金账户预警
        <!-- <span>（预警内容：您在伏羲云平台的保证金账户已低于应缴金额50%）</span> -->
      </div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="fundFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="handleSwitch(16)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="fundListLoading"
            :shop-notice-flag="fundFlag"
            btn-text="添加提醒人员"
            :data="fundUserList"
            @del="val => del('fundUserList', val)"
            @add="val => add('fundUserList', val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知企微群</span>
          <addGroup
            :dianpu-delivered="fundUserList"
            :shop-notice-flag="fundFlag"
            :shop-feishu-group-list="fundQYList"
            :set-type="16"
            :login-type="loginType"
            @add="qwAddOrDel"
            @del="qwAddOrDel"
          />
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import addUser from './components/addUser.vue'
import addGroup from '@/views/basicSettings/components/addGroup'
import unlockOrderRemind from './unlockOrderRemind.vue'
import setShopNotice from '@/views/basicSettings/components/setShopNotice'
import productNotMapped from '@/views/basicSettings/components/productNotMapped'
import {
  getApplyForRefund,
  scheduleRemindSettingsInfo,
  getClassCostConfirmation,
  getDeliveredRefunded,
  setFeishuremind,
  setDeliveryInfoList,
  scheduleRemindSettings,
  getWechatCustomer,
  updateWechatCustomer,
  updateWechatCustomerStatus,
  saleTaskRemindInfo,
  editSaleTaskRemind,
  getComplementRemindMess,
  setComplementRemindParam,
  getMediaRemind,
  setMediaRemind,
  getVideoRemindData,
  setVideoRemindData,
  getDeliveryInfoList,
  getMediaAccount,
  setMediaAccount,
  setHotVideo,
  getHotVideoData,
  getProductRemindList,
  setProductRemid,
  getRemindInfo,
  setRemindInfo,
  couponAuditorSetting,
  couponAuditorSearch,
  getFollowerRemind,
  setFollowerRemind,
  getSendMsgTypeConfigApi,
  payNoticeSave,
  payNoticeQuery
} from '@/api/deliver/baseSeeting'

import { getItem } from '@/utils/localStorage'
export default {
  components: {
    addUser,
    unlockOrderRemind,
    addGroup,
    setShopNotice,
    productNotMapped
  },
  data() {
    return {
      // 登录类型
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      },
      // 跟进人提醒
      followUp: {
        withClueDispatchHour: undefined,
        intervalMinute: undefined
      },
      productNotMappedFlag: false,
      setShopNoticeFlag: false,
      // 优惠券初审人员
      couponPreliminaryExaminationLoadding: false,
      couponPEFlag: false,
      couponPreliminaryExamination: [],
      couponReexamineLoading: false,
      couponReexamineFlag: false,
      couponReexamine: [],
      // 未关联商品模块数据
      unAssioncationFlag: false,
      unAssioncationLoadding: false,
      unAssioncationDelivered: [],
      unAssioncationFeishuDelivered: [],
      unAssioncationBizId: '',
      unAssioncationSetType: 12,
      // 脱敏视频共享
      videoNoticeFlag: false,
      videoLoadding: false,
      videoDelivered: [],
      videoFeishuDelivered: [],
      videoBizId: '',
      videoSetType: 6,
      // 脱敏视频分发
      videoDistributeFlag: false,
      videoDistributeLoadding: false,
      videoDistributeDelivered: [],
      videoDistributeFeishuDelivered: [],
      videoDistributeBizId: '',
      videoDistributeSetType: 6,
      // 自媒体通知
      mediaNoticeFlag: false,
      mediaLoadding: false,
      mediaDelivered: [],
      mediaFeishuDelivered: [],
      mediaBizId: '',
      mediaSetType: 5,
      // 自媒体账号数据同步提醒
      mediaAccountFlag: false,
      mediaAccountDelivered: [],
      mediaAccountBizId: '',
      mediaDataLoadding: false,
      mediaAccountFeishuDelivered: [],
      mediaAccountType: 9,
      // 爆款视频通知
      hotVideoFlag: false,
      hotVideoLoadding: false,
      hotVideoDelivered: [],
      hotVideoFeishuDelivered: [],
      hotVideoBizId: '',
      hotVideoSetType: 10,
      // 项目交付预警提醒
      prewsList: [],
      prewsFlag: true,
      prewsCrowdVosList: [],
      prewsListLoading: false,
      // 抖音提醒设置
      tikTokList: [],
      tikTokFlag: true,
      tikTokLoading: false,
      // 助教
      teachingList: [],
      teachingVosList: [],
      teachingFlag: true,
      teachingLoading: false,
      ceilingNum: 1,
      // 店铺漏单通知
      shopNoticeFlag: false,
      shopFeishuGroupList: [],
      dianpuLoading: false,
      dianpuDelivered: [],
      completeType: 3,
      // 学员在第三方店铺申请退款飞书/企微提醒设置
      remindThirdShopList: [],
      remindThirdShopFlag: false,
      remindCrowdVosList: [],
      remindThirdShopLoading: false,
      // 班期成本确认飞书/企微提醒设置
      remindCostRecognition: [],
      remindCostRecognitionLoading: false,
      loading: false,
      // 已交付且已退款飞书/企微提醒设置
      remindDelivered: [],
      remindDeliveredLoading: false,
      options: [{ value: 15 }, { value: 30 }, { value: 60 }],
      form: {
        beforeEnd: 0,
        intervalTime: 0
      },
      // 智能销售加微工具预警提醒人员
      CRMRemind: {
        isRemind: 0
      },
      CRMRemindList: [],
      CRMRemindLoading: false,
      CRMBeforeEnd: 0,
      CRMLoading: false,
      // 资金账户企微预警
      fundObj: {
        crowdId: '',
        extendInfo: '',
        sceneType: 0,
        status: 0,
        type: 2,
        userIds: []
      },
      fundFlag: false,
      fundUserList: [],
      fundQYList: [],
      fundListLoading: false
    }
  },
  mounted() {
    this.getCRMRemind()
    this.getSaleTaskRemindInfo()
    this.getApplyForRefund()
    this.getClassCostConfirmation()
    this.getDeliveryInfoList(7)
    this.getDeliveryInfoList(8)
    this.getDeliveredRefunded()
    this.scheduleRemindSettingsInfo()
    this.getComplement(3)
    this.getMediaRemindList()
    this.getMediaAccountList()
    this.getHotVideoList()
    this.getVideoRemindData()
    this.getProductRemindList()
    this.getRemindInfo()
    this.getCouponAuditorList()
    this.getFollowerRemind()
    this.getSendMsgTypeConfig()
    this.getPayNoticeQuery()
  },
  methods: {
    qwAddOrDel(list) {
      console.log(list, 'crowdIdcrowdIdcrowdId')
      this.fundQYList = list.map(m => ({ name: m.name, chat_id: m.chatId }))
      this.setPayNotice(undefined, this.fundQYList)
    },
    getPayNoticeQuery() {
      this.fundObj.type = 2
      this.fundObj.sceneType = 1
      payNoticeQuery({ sceneType: 1 }).then(res => {
        if (res.code === 1) {
          if (res.data) {
            this.fundObj = { ...res.data }
            this.fundFlag = this.fundObj.status === 1
            this.fundObj.userIds = this.fundObj.userList
              ? this.fundObj.userList.map(m => m.userId).join(',')
              : ''
            this.fundUserList = this.fundObj.userList
              ? this.fundObj.userList.map(m => ({
                userId: m.userId,
                nickName: m.userName
              }))
              : []
            const info = this.fundObj.extendInfo
              ? JSON.parse(this.fundObj.extendInfo)
              : ''
            this.fundQYList = Array.isArray(info) ? info : []
          }
          delete this.fundObj.userList
        }
      })
    },
    setPayNotice(list, list2) {
      if (list) {
        this.fundUserList = list
        this.fundObj.userIds =
          list.length > 0 ? list.map(m => m.userId).join(',') : ''
      }
      if (list2) {
        this.fundObj.extendInfo = list2.length > 0 ? JSON.stringify(list2) : ''
        this.fundObj.crowdId =
          list2.length > 0 ? list2.map(m => m.chat_id).join(',') : ''
      }
      payNoticeSave({
        ...this.fundObj,
        status: this.fundFlag ? 1 : 0
      }).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
      })
    },
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
          console.log('this----------------', this.loginType)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getFollowerRemind() {
      const { code, data } = await getFollowerRemind()
      if (code === 1 && data) this.followUp = data
    },
    async handleChangeFollowUp() {
      if (this.followUp.isRemind) {
        if (
          !this.followUp.withClueDispatchHour ||
          !this.followUp.intervalMinute
        ) {
          return this.$notify.error({
            title: '保存失败',
            message: '请设置提醒规则，线索分配时间!'
          })
        }
      }
      const { code } = await setFollowerRemind(this.followUp)
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
      }
    },
    closeUnAssionDrawer() {
      this.productNotMappedFlag = false
    },
    closeDrawerEmit() {
      this.setShopNoticeFlag = false
    },
    goodsNotMappedClick() {
      this.productNotMappedFlag = true
      this.$refs.productNotMapped.getReminderSettingDetail()
    },
    toSetShopNotice() {
      this.setShopNoticeFlag = true
      this.$refs.setShopNotice.getDecryptingReminderDetail()
      this.$refs.setShopNotice.getComplementOrderReminderSettingDetail()
    },
    // 获取优惠券审核人员列表
    getCouponAuditorList() {
      this.couponReexamine = []
      this.couponPreliminaryExamination = []
      couponAuditorSearch().then(res => {
        console.log('优惠券rreesss:', res)
        if (res.code === 1) {
          res.data.some(item => {
            const obj = {
              userId: '',
              nickName: ''
            }
            if (item.auditStage === 1) {
              obj.userId = item.auditUserId
              obj.nickName = item.auditNickName
              this.couponPreliminaryExamination.push(obj)
            } else if (item.auditStage === 2) {
              obj.userId = item.auditUserId
              obj.nickName = item.auditNickName
              this.couponReexamine.push(obj)
            }
          })
        }
      })
    },
    // 获取商品未关联消息通知数据获取
    getProductRemindList() {
      getProductRemindList().then(res => {
        console.log('未关联数据', res)
        if (res.code === 1) {
          this.unAssioncationLoadding = false
          this.unAssioncationFlag = res.data.notifyFlag
          this.unAssioncationDelivered = res.data.sysUserList
            ? res.data.sysUserList
            : []
          this.unAssioncationDelivered.some(item => {
            item.userId = item.sysUserId
            item.nickName = item.sysUserName
          })
          this.unAssioncationFeishuDelivered = res.data.groupList
            ? res.data.groupList
            : []
          this.unAssioncationFeishuDelivered.some(item => {
            item.name = item.sysUserName
            item.chat_id = item.sysUserId
          })
        }
      })
    },
    // 商品未映射提醒通知
    setUnAssioncationSwitch() {
      const paramsArr = []
      this.unAssioncationFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = this.unAssioncationDelivered.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        flag: this.unAssioncationFlag ? 1 : 0,
        type: 2,
        sysUserIds,
        groupReqs: paramsArr
      }
      setProductRemid(params)
        .then(res => {
          if (res.code === 1) {
            this.changeLoading(12)
            this.unAssioncationLoadding = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getProductRemindList()
          }
        })
        .catch(() => {
          // this.changeLoading(4)
        })
    },
    // 获取脱敏管理模块数据
    getVideoRemindData() {
      getVideoRemindData().then(res => {
        if (res.code === 1 && Array.isArray(res.data)) {
          res.data.forEach(curData => {
            // 分享
            if (curData.bizScene === 1) {
              this.videoNoticeFlag = curData.status === 1
              this.videoDelivered = curData.userInfo ? curData.userInfo : []
              this.videoBizId = curData.bizId
              this.videoDelivered?.some(item => {
                item.nickName = item.userName
              })
              this.videoFeishuDelivered = curData.noticeCrowd
                ? curData.noticeCrowd
                : []
              this.videoFeishuDelivered?.some(obj => {
                obj.chat_id = obj.chatId
              })
            } else if (curData.bizScene === 2) {
              this.videoDistributeFlag = curData.status === 1
              this.videoDistributeDelivered = curData.userInfo
                ? curData.userInfo
                : []
              this.videoDistributeBizId = curData.bizId
              this.videoDistributeDelivered?.some(item => {
                item.nickName = item.userName
              })
              this.videoDistributeFeishuDelivered = curData.noticeCrowd
                ? curData.noticeCrowd
                : []
              this.videoDistributeFeishuDelivered?.some(obj => {
                obj.chat_id = obj.chatId
              })
            }
          })
        }
      })
    },
    setVideoSwitch(type) {
      let params = {}
      // 共享
      if (type === 'Notice') {
        const paramsArr = []
        this.videoFeishuDelivered.some(item => {
          const obj = {
            chatId: item.chat_id,
            name: item.name
          }
          paramsArr.push(obj)
        })
        const sysUserIds = this.videoDelivered.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params = {
          status: this.videoNoticeFlag ? 1 : 2,
          bizId: this.videoBizId,
          noticeCrowd: paramsArr,
          noticePersonnel: sysUserIds
        }
      } else {
        // 分发
        const paramsArr = []
        this.videoDistributeFeishuDelivered.some(item => {
          const obj = {
            chatId: item.chat_id,
            name: item.name
          }
          paramsArr.push(obj)
        })
        const sysUserIds = this.videoDistributeDelivered.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params = {
          status: this.videoDistributeFlag ? 1 : 2,
          bizId: this.videoDistributeBizId,
          noticeCrowd: paramsArr,
          noticePersonnel: sysUserIds
        }
      }
      setVideoRemindData(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getVideoRemindData()
        }
      })
    },
    setMediaSwitch() {
      const paramsArr = []
      this.mediaFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = this.mediaDelivered.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.mediaNoticeFlag ? 1 : 2,
        bizId: this.mediaBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setMediaRemind(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getMediaRemindList()
        }
      })
    },

    // 新增-编辑  7项目交付预警提醒设置 , 8助教分配提醒设置
    async setDeliveryInfoList(type, sysUserIds) {
      const data =
        type === 7
          ? {
            onOff: this.prewsFlag ? 1 : 0,
            sysUserIds: sysUserIds,
            type
          }
          : {
            onOff: this.teachingFlag ? 1 : 0,
            sysUserIds: sysUserIds,
            type,
            ceilingNum: this.ceilingNum
          }
      try {
        await setDeliveryInfoList(data)
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.prewsListLoading = false
        this.teachingLoading = false
        this.getListByType(type)
      } catch {
        this.prewsListLoading = false
        this.teachingLoading = false
        //
      }
    },

    // 项目交付预 助教分配 滑动
    handleSwitch(type) {
      if (type === 7) {
        const sysUserIds = this.prewsList.map(item => item.userId)
        this.setDeliveryInfoList(type, sysUserIds)
      }
      if (type === 8) {
        const sysUserIds = this.teachingList.map(item => item.userId)
        this.setDeliveryInfoList(type, sysUserIds)
      }
      if (type === 16) {
        if (this.fundUserList.length < 1 && this.fundQYList.length < 1) {
          this.$message.warning('请选择人员或者企微群')
          this.fundFlag = false
          return
        }
        payNoticeSave({ ...this.fundObj, status: this.fundFlag ? 1 : 0 }).then(
          res => {
            if (res.code === 1) {
              this.$notify.success({ title: '提示', message: '操作成功' })
            }
          }
        )
      }
    },
    setHotVideoSwitch() {
      const paramsArr = []
      this.hotVideoFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = this.hotVideoDelivered.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.hotVideoFlag ? 1 : 2,
        bizId: this.hotVideoBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setHotVideo(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getHotVideoList()
        }
      })
    },
    // 自媒体账号操作提醒设置开关
    setMediaAccountSwitch() {
      const paramsArr = []
      this.mediaAccountFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = this.mediaAccountDelivered.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.mediaAccountFlag ? 1 : 2,
        bizId: this.mediaAccountBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setMediaAccount(params).then(res => {
        if (res.code === 1) {
          this.mediaDataLoadding = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getMediaAccountList()
        }
      })
    },
    // 设置店铺漏单提醒开关
    setShopSwitch() {
      const paramsArr = []
      this.shopFeishuGroupList.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = this.dianpuDelivered.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        flag: this.shopNoticeFlag ? 1 : 0,
        type: 2,
        sysUserIds,
        groupReqs: paramsArr
      }
      setComplementRemindParam(params)
        .then(res => {
          if (res.code === 1) {
            this.changeLoading(4)
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getListByType(4)
            this.dianpuLoading = false
          }
        })
        .catch(() => {
          // this.changeLoading(4)
        })
    },
    // 自媒体爆款视频提醒设置
    async getHotVideoList() {
      const res = await getHotVideoData()
      console.log(res, '爆款视频提醒设置')
      if (res.code === 1) {
        this.hotVideoLoadding = false
        this.hotVideoFlag = res.data[0].status === 1
        this.hotVideoDelivered = res.data[0].userInfo
          ? res.data[0].userInfo
          : []
        this.hotVideoBizId = res.data[0].bizId
        this.hotVideoDelivered?.some(item => {
          item.nickName = item.userName
        })
        this.hotVideoFeishuDelivered = res.data[0].noticeCrowd
          ? res.data[0].noticeCrowd
          : []
        this.hotVideoFeishuDelivered?.some(obj => {
          obj.chat_id = obj.chatId
        })
      }
    },
    // 自媒体账号操作提醒设置
    async getMediaAccountList() {
      const res = await getMediaAccount()
      console.log(res, '自媒体账号操作提醒设置')
      if (res.code === 1) {
        this.mediaDataLoadding = false
        this.mediaAccountFlag = res.data[0].status === 1
        this.mediaAccountDelivered = res.data[0].userInfo
          ? res.data[0].userInfo
          : []
        this.mediaAccountBizId = res.data[0].bizId
        this.mediaAccountDelivered?.some(item => {
          item.nickName = item.userName
        })
        this.mediaAccountFeishuDelivered = res.data[0].noticeCrowd
          ? res.data[0].noticeCrowd
          : []
        this.mediaAccountFeishuDelivered?.some(obj => {
          obj.chat_id = obj.chatId
        })
      }
    },
    // 查询自媒体提醒设置数据
    getMediaRemindList() {
      getMediaRemind().then(res => {
        if (res.code === 1) {
          this.mediaNoticeFlag = res.data[0].status === 1
          this.mediaDelivered = res.data[0].userInfo ? res.data[0].userInfo : []
          this.mediaBizId = res.data[0].bizId
          this.mediaDelivered?.some(item => {
            item.nickName = item.userName
          })
          this.mediaFeishuDelivered = res.data[0].noticeCrowd
            ? res.data[0].noticeCrowd
            : []
          this.mediaFeishuDelivered?.some(obj => {
            obj.chat_id = obj.chatId
          })
        }
      })
    },
    // 获取 项目交付预警提醒设置  助教分配提醒设置
    async getDeliveryInfoList(type) {
      const data = {
        type,
        crowType: type === 7 ? 2 : 3
      }
      const res = await getDeliveryInfoList(data)
      // 项目交付预警提醒设置
      if (type === 7) {
        this.prewsList = res?.data.sysUserList
        this.prewsList.some(item => {
          item.userId = item.sysUserId
          item.nickName = item.sysUserName
        })
        this.prewsCrowdVosList =
          res?.data?.crowdVos?.map(item => ({
            name: item.crowdName,
            chat_id: item.crowdId
          })) || []
        this.prewsFlag = !!res?.data.onOff
        return
      }
      // 助教分配提醒设置
      if (type === 8) {
        this.teachingList = res?.data.sysUserList
        this.teachingList.some(item => {
          item.userId = item.sysUserId
          item.nickName = item.sysUserName
        })
        this.teachingVosList =
          res?.data?.crowdVos?.map(item => ({
            name: item.crowdName,
            chat_id: item.crowdId
          })) || []
        this.teachingFlag = !!res?.data?.onOff
        this.ceilingNum = res?.data?.ceilingNum
        return
      }
    },
    // 查询店铺漏单设置信息
    getComplement(setType) {
      console.log(setType, 'setType')
      if (setType === 5) {
        this.getMediaRemindList()
      } else if (setType === 1) {
        this.getApplyForRefund()
      } else if (setType === 6) {
        this.getVideoRemindData()
      } else if (setType === 4) {
        getComplementRemindMess().then(res => {
          if (res.code === 1) {
            this.dianpuDelivered = res.data.sysUserList
            this.dianpuDelivered.some(item => {
              item.userId = item.sysUserId
              item.nickName = item.sysUserName
            })
            this.shopFeishuGroupList = res.data.groupList
              ? res.data.groupList
              : []
            this.shopFeishuGroupList.some(item => {
              item.name = item.sysUserName
              item.chat_id = item.sysUserId
            })
            this.shopNoticeFlag = res.data.notifyFlag
          }
        })
      } else if (setType === 3) {
        getComplementRemindMess().then(res => {
          if (res.code === 1) {
            this.dianpuDelivered = res.data.sysUserList
            this.dianpuDelivered.some(item => {
              item.userId = item.sysUserId
              item.nickName = item.sysUserName
            })
            this.shopFeishuGroupList = res.data.groupList
              ? res.data.groupList
              : []
            this.shopFeishuGroupList.some(item => {
              item.name = item.sysUserName
              item.chat_id = item.sysUserId
            })
            this.shopNoticeFlag = res.data.notifyFlag
          }
        })
      } else if (setType === 7) {
        this.getDeliveryInfoList(7)
      } else if (setType === 8) {
        this.getDeliveryInfoList(8)
      } else if (setType === 9) {
        this.getMediaAccountList()
      } else if (setType === 10) {
        this.getHotVideoList()
      } else if (setType === 12) {
        this.getProductRemindList()
      } else if (setType === 13) {
        this.getCouponAuditorList()
      }
    },
    del(key, index) {
      console.log(key, index)
      if (this[key].length === 1) {
        return this.$message.error('最后一个提醒人员不可删除')
      }
      const users = JSON.parse(JSON.stringify(this[key]))
      const type = {
        remindThirdShopList: 1, // 学员在第三方店铺申请退款/企微提醒
        remindCostRecognition: 2, // 班期成本确认飞书/企微提醒
        remindDelivered: 3, // 已交付且已退款飞书/企微提醒
        dianpuDelivered: 4, // 店铺漏单提醒设置
        mediaDelivered: 5, // 自媒体设置
        videoDelivered: 6, // 脱敏共享提醒设置, // 店铺漏单飞书/企微提醒
        prewsList: 7, // 项目交付预警提醒
        teachingList: 8, // 助教分配提醒
        mediaAccountDelivered: 9, // 自媒体账号操作提醒设置
        hotVideoDelivered: 10, // 爆款视频通知
        unAssioncationDelivered: 12, // 商品未关联通知
        couponPreliminaryExamination: 13, // 优惠券初审人员
        couponReexamine: 14, // 优惠券复审人员
        videoDistribute: 15, // 脱敏分发提醒设置
        fundUserList: 16 // 资金账户预警
      }
      users.splice(index, 1)
      console.log('sss:::::::', users)
      this.remindAdd(type[key], users)
    },
    handleChange() {
      scheduleRemindSettings(this.form)
    },
    add(key, row) {
      const type = {
        remindThirdShopList: 1, // 学员在第三方店铺申请退款/企微提醒
        remindCostRecognition: 2, // 班期成本确认飞书/企微提醒
        remindDelivered: 3, // 已交付且已退款飞书/企微提醒
        dianpuDelivered: 4, // 店铺漏单飞书/企微提醒
        mediaDelivered: 5, // 自媒体提醒设置
        videoDelivered: 6, // 脱敏共享提醒设置
        prewsList: 7, // 项目交付预警提醒设置
        teachingList: 8, // 助教分配提醒
        mediaAccountDelivered: 9, // 自媒体账号操作提醒设置
        hotVideoDelivered: 10, // 爆款视频通知
        unAssioncationDelivered: 12, // 商品未关联通知
        couponPreliminaryExamination: 13, // 优惠券初审人员
        couponReexamine: 14, // 优惠券复审人员
        videoDistribute: 15, // 脱敏共享提醒设置
        fundUserList: 16 // 资金账户预警
      }
      this[key] && (this[key] = row)
      this.remindAdd(type[key], row)
    },
    // 获取学员在第三方店铺申请退款飞书/企微提醒
    getApplyForRefund() {
      this.remindThirdShopLoading = true
      getApplyForRefund()
        .then(res => {
          if (res?.data?.sysUserIds?.length) {
            this.remindThirdShopList = res?.data?.sysUserIds?.map(item => ({
              nickName: item.sysUserName,
              userId: item.sysUserId
            }))
          }
          if (res?.data?.remindCrowdVos?.length) {
            this.remindCrowdVosList = res?.data?.remindCrowdVos?.map(item => ({
              name: item.crowdName,
              chat_id: item.crowdId
            }))
          } else {
            this.remindCrowdVosList = []
          }
          this.remindThirdShopFlag = !!res?.data?.onOff
          this.remindThirdShopLoading = false
        })
        .catch(() => {
          this.remindThirdShopLoading = false
        })
    },
    scheduleRemindSettingsInfo() {
      this.loading = true
      scheduleRemindSettingsInfo()
        .then(({ data }) => {
          console.log(data)
          this.form.beforeEnd = data?.beforeEnd || 0
          this.form.intervalTime = data?.intervalTime || 0
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取班期成本确认飞书/企微提醒设置
    getClassCostConfirmation() {
      this.remindCostRecognitionLoading = true
      getClassCostConfirmation()
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data.map(v => {
              v.nickName = v.sysUserName
              v.userId = v.sysUserId
            })
            this.remindCostRecognition = res.data
          }
          this.remindCostRecognitionLoading = false
        })
        .catch(() => {
          this.remindCostRecognitionLoading = false
        })
    },
    // 获取已交付且已退款飞书/企微提醒设置
    getDeliveredRefunded() {
      this.remindDeliveredLoading = true
      getDeliveredRefunded()
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data.map(v => {
              v.nickName = v.sysUserName
              v.userId = v.sysUserId
            })
            this.remindDelivered = res.data
            console.log('this.remindDelivered', this.remindDelivered)
          }
          this.remindDeliveredLoading = false
        })
        .catch(() => {
          this.remindDeliveredLoading = false
        })
    },
    // 新增
    remindAdd(type, row) {
      this.changeLoading(type)
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      if (type === 1) {
        const remindCrowdVos = this.remindCrowdVosList.map(item => ({
          crowdId: item.chat_id,
          crowdName: item.name
        }))
        const data = {
          sysUserIds,
          type,
          remindCrowdVos,
          onOff: this.remindThirdShopFlag ? 1 : 0
        }
        setFeishuremind(data)
          .then(res => {
            this.changeLoading(type)
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getListByType(type)
          })
          .catch(() => {
            this.changeLoading(type)
          })
        return
      }
      if (type === 7 || type === 8) {
        this.setDeliveryInfoList(type, sysUserIds)
        return
      }
      if (type === 4) {
        this.missOrderSetFeishuMind(type, row)
      } else if (type === 5) {
        this.addMediaSetArray(type, row)
      } else if (type === 6 || type === 15) {
        this.addVideoSetArray(type, row)
      } else if (type === 9) {
        this.addMediaAccountSetArray(type, row)
      } else if (type === 10) {
        this.addHotVideoSetArray(type, row)
      } else if (type === 12) {
        this.addNoAssicationSetArray(type, row)
      } else if (type === 13 || type === 14) {
        this.addCouponPreliminaryExamination(type, row)
      } else if (type === 16) {
        this.setPayNotice(row)
      } else {
        const data = {
          sysUserIds,
          type
        }
        setFeishuremind(data)
          .then(res => {
            this.changeLoading(type)
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getListByType(type)
          })
          .catch(() => {
            this.changeLoading(type)
          })
      }
    },
    addCouponPreliminaryExamination(type, row) {
      console.log('addCouponPreliminaryExamination---type', type)
      console.log('addCouponPreliminaryExamination---row:::', row)
      const params = {
        beforeAuditUserIdList: [],
        afterAuditUserIdList: []
      }
      if (type === 13) {
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params.beforeAuditUserIdList = sysUserIds
        this.couponReexamine.some(item => {
          params.afterAuditUserIdList.push(item.userId)
        })
      } else if (type === 14) {
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params.afterAuditUserIdList = sysUserIds
        this.couponPreliminaryExamination.some(item => {
          params.beforeAuditUserIdList.push(item.userId)
        })
      }

      couponAuditorSetting(params).then(res => {
        if (res.code === 1) {
          this.getCouponAuditorList()
        }
      })
    },
    // 商品未关联
    addNoAssicationSetArray(type, row) {
      console.log(type)
      console.log(row)
      const paramsArr = []
      this.unAssioncationFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        flag: this.unAssioncationFlag ? 1 : 0,
        type: 1,
        groupReqs: paramsArr,
        sysUserIds: sysUserIds
      }
      setProductRemid(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getProductRemindList()
        }
      })
    },
    addHotVideoSetArray(type, row) {
      console.log(type)
      console.log(row)
      const paramsArr = []
      this.hotVideoFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.hotVideoFlag ? 1 : 2,
        bizId: this.hotVideoBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setHotVideo(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getHotVideoList()
        }
      })
    },
    // 自媒体账号修改提醒设置
    addMediaAccountSetArray(type, row) {
      const paramsArr = []
      console.log(this.mediaAccountFeishuDelivered)
      this.mediaAccountFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      console.log(row, paramsArr, 'row')
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.mediaAccountFlag ? 1 : 2,
        bizId: this.mediaAccountBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setMediaAccount(params).then(res => {
        if (res.data) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getMediaAccountList()
        }
      })
    },
    // 脱敏视频提醒设置
    addVideoSetArray(type, row) {
      console.log(type)
      console.log('roowww:', row)
      let params = {}
      // 共享
      if (type === 6) {
        const paramsArr = []
        this.videoFeishuDelivered.some(item => {
          const obj = {
            chatId: item.chat_id,
            name: item.name
          }
          paramsArr.push(obj)
        })
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params = {
          status: this.videoNoticeFlag ? 1 : 2,
          bizId: this.videoBizId,
          noticeCrowd: paramsArr,
          noticePersonnel: sysUserIds
        }
      } else {
        // 分发
        const paramsArr = []
        this.videoDistributeFeishuDelivered.some(item => {
          const obj = {
            chatId: item.chat_id,
            name: item.name
          }
          paramsArr.push(obj)
        })
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params = {
          status: this.videoDistributeFlag ? 1 : 2,
          bizId: this.videoDistributeBizId,
          noticeCrowd: paramsArr,
          noticePersonnel: sysUserIds
        }
      }

      setVideoRemindData(params).then(res => {
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getVideoRemindData()
        }
      })
    },
    // 自媒体提醒设置
    addMediaSetArray(type, row) {
      console.log(type)
      console.log('roowww:', row)
      const paramsArr = []
      this.mediaFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.mediaNoticeFlag ? 1 : 2,
        bizId: this.mediaBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds
      }
      setMediaRemind(params).then(res => {
        console.log('addrenyuan', res)
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.keywordsObject = {}
          this.getMediaRemindList()
        }
      })
    },
    // 店铺漏单设置
    missOrderSetFeishuMind(type, row) {
      const paramsArr = []
      this.shopFeishuGroupList.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        flag: this.shopNoticeFlag ? 1 : 0,
        type: 1,
        sysUserIds,
        groupReqs: paramsArr
      }
      setComplementRemindParam(params)
        .then(res => {
          this.changeLoading(type)
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getListByType(type)
        })
        .catch(() => {
          this.changeLoading(type)
        })
    },
    changeLoading(type) {
      if (type === 1) {
        this.remindThirdShopLoading = !this.remindThirdShopLoading
      } else if (type === 2) {
        this.remindCostRecognitionLoading = !this.remindCostRecognitionLoading
      } else if (type === 3) {
        this.remindDeliveredLoading = !this.remindDeliveredLoading
      } else if (type === 4) {
        this.dianpuLoading = !this.dianpuLoading
      } else if (type === 7) {
        this.prewsListLoading = !this.prewsListLoading
      } else if (type === 8) {
        this.teachingLoading = !this.teachingLoading
      } else if (type === 9) {
        this.mediaDataLoadding = !this.mediaDataLoadding
      } else if (type === 12) {
        this.unAssioncationLoadding = !this.unAssioncationLoadding
      }
    },
    getListByType(type) {
      if (type === 1) {
        this.getApplyForRefund()
      } else if (type === 2) {
        this.getClassCostConfirmation()
      } else if (type === 3) {
        this.getDeliveredRefunded()
      } else if (type === 4) {
        this.getComplement(4)
      } else if (type === 7 || type === 8) {
        this.getDeliveryInfoList(type)
      }
    },
    // 获取企业微信提醒
    getCRMRemind() {
      this.CRMRemindLoading = true
      getWechatCustomer()
        .then(res => {
          if (res.data && res.data.customers.length > 0) {
            res.data.customers.map(v => {
              v.nickName = v.userName
              v.userId = v.sysUserId
            })
            this.CRMRemindList = res.data.customers
          }
          this.CRMRemind.isRemind = res.data.isRemind
          this.CRMRemindLoading = false
        })
        .catch(() => {
          this.CRMRemindLoading = false
        })
    },
    // C端运营提醒设置
    async getRemindInfo() {
      const res = await getRemindInfo({ type: 1 })
      this.tikTokList = res?.data?.sysUserList
      this.tikTokList.some(item => {
        item.userId = item.sysUserId
        item.nickName = item.sysUserName
      })
      this.tikTokFlag = !!res?.data.isRemind
      return
    },
    handleTikTokSwitch(val) {
      const obj = {
        isRemind: val ? 1 : 0,
        sysUserIds: this.tikTokList.map(item => item.userId),
        type: 1
      }
      this.setRemindInfo(obj)
    },
    // 修改抖音人数提醒
    async delTikTokList(index) {
      if (this.tikTokList.length === 1) {
        return this.$message.error('最后一个提醒人员不可删除')
      }
      const users = JSON.parse(JSON.stringify(this.tikTokList))
      users.splice(index, 1)
      this.tikTokLoading = true
      const obj = {
        isRemind: this.tikTokFlag ? 1 : 0,
        sysUserIds: users.map(item => item.userId),
        type: 1
      }
      this.setRemindInfo(obj)
    },
    async addTikTokList(data) {
      const obj = {
        isRemind: this.tikTokFlag ? 1 : 0,
        sysUserIds: data.map(item => item.userId),
        type: 1
      }
      this.tikTokLoading = true
      this.setRemindInfo(obj)
    },
    async setRemindInfo(data) {
      const res = await setRemindInfo({ ...data })
      if (res.code === 1) this.getRemindInfo()
      this.tikTokLoading = false
    },
    // 获取销售任务提醒设置
    getSaleTaskRemindInfo() {
      this.CRMLoading = true
      saleTaskRemindInfo()
        .then(res => {
          this.CRMBeforeEnd = res.data.remindMin
          this.CRMLoading = false
        })
        .catch(() => {
          this.CRMLoading = false
        })
    },
    // 智能销售计划提醒时间变更
    handleChangeCRM() {
      this.CRMLoading = true
      const data = {
        remindMin: this.CRMBeforeEnd
      }
      editSaleTaskRemind(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getSaleTaskRemindInfo()
        })
        .catch(() => {
          this.getSaleTaskRemindInfo()
          // this.CRMLoading = false
        })
    },
    // 修改智能销售加微信工具提醒人员
    updateWechatCustomerStatus(val) {
      this.CRMRemindLoading = true
      const data = {
        isRemind: val ? 1 : 0
      }
      updateWechatCustomerStatus(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    },
    delWechatCustomer(index) {
      const users = JSON.parse(JSON.stringify(this.CRMRemindList))
      users.splice(index, 1)
      const sysUserIds = users.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = { sysUserIds }
      updateWechatCustomer(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    },
    addWechatCustomer(row) {
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = { sysUserIds }
      updateWechatCustomer(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.myCard {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.crmTitle {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 1.2;
  padding-left: 4px;
  border-left: 3px solid #0c6fff;
  margin-bottom: 20px;
}
.reminderSettingsTitle {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}
.reminderSettingsView {
  padding: 20px;
  > .title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    > span {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 24px;
    }
  }
}
.m-b-32 {
  margin-bottom: 32px;
}

.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  display: inline-block;
  .shop-line {
    float: left;
    width: 100%;
    margin-bottom: 10px;
    ::v-deep .assessBox {
      padding: 0;
      border: none;
    }

    .shop-line-text-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .inputNumber {
        width: 130px;
      }
      > div:nth-of-type(2) {
        padding-left: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 22px;
      }
    }
    .shop-line-label {
      float: left;
      font-size: 12px;
      width: 100px;
      line-height: 28px;
      color: #333;
    }
  }
  .boxText {
    font-size: 14px;
  }
}
</style>
