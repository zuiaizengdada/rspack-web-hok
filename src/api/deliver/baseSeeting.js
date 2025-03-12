// 班期管理
import request from '@/utils/request2'
import { method } from 'lodash'
import qs from 'qs'

// 外呼设置
// 获取外呼设置
export function getSaleCallSettingInfo(params) {
  return request({
    url: '/cloud/edata-sale/sale/call/setting/info',
    method: 'get',
    params
  })
}

// 修改外呼设置
export function updateSaleCallSettingInfo(data) {
  return request({
    url: '/cloud/edata-sale/sale/call/setting/update',
    method: 'post',
    data
  })
}

// 企业微信提醒
// 获取详情
export function getWechatCustomer(params) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/customer/get',
    method: 'get',
    params
  })
}

// 企业微信提醒
// 智能销售提醒设置-获取
export function getClueFollowRemind(params) {
  return request({
    url: '/cloud/edata-sale/clueFollowRemindSet/get',
    method: 'get',
    params
  })
}
// 智能销售提醒设置-修改
export function saveClueFollowRemind(data) {
  return request({
    url: '/cloud/edata-sale/clueFollowRemindSet/save',
    method: 'post',
    data
  })
}
// 修改
export function updateWechatCustomer(data) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/customer/update',
    method: 'PUT',
    data
  })
}
// 修改提醒状态
export function updateWechatCustomerStatus(data) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/customer/update/status',
    method: 'PUT',
    data
  })
}

// 销售任务提醒
export function saleTaskRemindInfo(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/remind/info',
    method: 'get',
    params
  })
}

// 修改销售任务提醒
export function editSaleTaskRemind(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/remind/update',
    method: 'POST',
    data
  })
}

// 查询视频交付设置
export function getVideoLivery(params) {
  return request({
    url: '/cloud/delivery/config/videodelivery/get',
    method: 'GET',
    params
  })
}

// 取交付配置-B端使用
export function getDeliveryConfig(params) {
  return request({
    url: '/cloud/delivery/delivery/config/get',
    method: 'get',
    params
  })
}

// 保存交付配置-B端使用
export function saveDeliveryConfig(data) {
  return request({
    url: '/cloud/delivery/delivery/config/save',
    method: 'post',
    data
  })
}

// 视频交付设置
export function setVideoLivery(data) {
  return request({
    url: '/cloud/delivery/config/videodelivery/set',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

// 查询视频交付设置
export function getAutoDeliveryDuration(params) {
  return request({
    url: '/cloud/delivery/delivery/video-course-setting/get',
    method: 'GET',
    params
  })
}

// 获取交付设置 套餐课交付规则
export function getDeliveryConfigApi(params) {
  return request({
    url: '/cloud/delivery/delivery/config/get',
    method: 'GET',
    params
  })
}

// 保存交付设置 套餐课交付规则
export function saveDeliveryConfigApi(params) {
  return request({
    url: '/cloud/delivery/delivery/config/save',
    method: 'POST',
    params
  })
}

// 视频交付设置
export function setAutoDeliveryDuration(data) {
  return request({
    url: '/cloud/delivery/delivery/video-course-setting/update',
    method: 'PUT',
    data
  })
}

// 分页查询收款渠道设置
export function getPaymentchannelPage(params) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/getPage',
    method: 'GET',
    params
  })
}
// 禁用收款渠道
export function disablePaymentchannel(params) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/disable',
    method: 'PUT',
    params
  })
}

// 查询收款渠道详情
export function getPaymentchannelDetail(params) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/detail',
    method: 'GET',
    params
  })
}

// 新增收款渠道
export function addPaymentchannel(data) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/add',
    method: 'POST',
    data
  })
}

// 删除收款渠道
export function deletePaymentchannel(params) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/delete',
    method: 'DELETE',
    params
  })
}

// 编辑收款渠道
export function editPaymentchannel(data) {
  return request({
    url: '/cloud/delivery/config/paymentchannel/edit',
    method: 'PUT',
    data
  })
}

// 查询学员在第三方店铺申请退款飞书提醒设置
export function getApplyForRefund() {
  return request({
    url: '/cloud/delivery/config/feishuremind/getApplyForRefund',
    method: 'GET'
  })
}
// 查询班期成本确认飞书提醒设置
export function getClassCostConfirmation() {
  return request({
    url: '/cloud/delivery/config/feishuremind/getClassCostConfirmation',
    method: 'get'
  })
}
// 查询已交付且已退款飞书提醒设置
export function getDeliveredRefunded() {
  return request({
    url: '/cloud/delivery/config/feishuremind/getDeliveredRefunded',
    method: 'get'
  })
}
// 新增/编辑飞书提醒设置
export function setFeishuremind(data) {
  return request({
    url: '/cloud/delivery/config/feishuremind/set',
    method: 'POST',
    data
  })
}
// 获取项目交付预警提醒设置 , 助教分配提醒设置
export function getDeliveryInfoList(params) {
  return request({
    url: '/cloud/delivery/config/feishuremind/delivery-info/list',
    method: 'GET',
    params
  })
}
// 新增-编辑 项目交付预警提醒设置 , 助教分配提醒设置
export function setDeliveryInfoList(data) {
  return request({
    url: '/cloud/delivery/config/feishuremind/delivery-info/set',
    method: 'POST',
    data
  })
}
// 新增解除飞书提醒设置
export function addUnlockFeishuremind(data) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/add',
    method: 'POST',
    data
  })
}
// 移除解除锁单飞书提醒设置
export function deleteUnlockFeishuremind(goodsId) {
  return request({
    url: `/cloud/delivery/config/feishuremind/unlock/delete?goodsId=${goodsId}`,
    method: 'DELETE'
  })
}
// 编辑解除锁单飞书提醒设置
export function editUnlockFeishuremind(data) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/edit',
    method: 'PUT',
    data
  })
}
// 分页查询解除锁单飞书提醒设置
export function getPageUnlockFeishuremind(params) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/getPage',
    method: 'GET',
    params
  })
}
// 解除锁单飞书提醒设置兜底人员
export function setFinalUserUnlockFeishuremind(data) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/setFinalUser',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

// 查询解除锁单飞书提醒已设置过的课程
export function getSetGoods(params) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/getSetGoods',
    method: 'GET',
    params
  })
}

// 查询解除锁单飞书提醒已设置过的兜底人员
export function getUnlockFinalUser(params) {
  return request({
    url: '/cloud/delivery/config/feishuremind/unlock/getFinalUser',
    method: 'GET',
    params
  })
}

// 获取渠道列表
export function getConfigChannelsource() {
  return request({
    url: '/cloud/delivery/config/channelsource/get',
    method: 'GET'
  })
}

// 获取资落地页配置列表
export function getTeachersLandingPage() {
  return request({
    url: '/cloud/teacher/landing/settings/list',
    method: 'GET'
  })
}

// 更新资落地页配置列表
export function updateTeachersLandingPage(data) {
  return request({
    url: '/cloud/teacher/landing/settings/add',
    method: 'POST',
    data
  })
}

// 提醒设置
export function scheduleRemindSettings(data) {
  return request({
    url: '/cloud/delivery/schedule-remind-settings/settings',
    method: 'POST',
    data
  })
}

// 提醒设置查询
export function scheduleRemindSettingsInfo(params) {
  return request({
    url: '/cloud/delivery/schedule-remind-settings/settingsInfo',
    method: 'get',
    params
  })
}

// 查询店铺漏单设置信息
export function getComplementRemindMess() {
  return request({
    url: '/cloud/admin/complement/remind/list',
    method: 'get'
  })
}

// 获取机构发送消息通知类型配置信息feign接口
export function getSendMsgTypeConfigApi(params) {
  return request({
    url: '/cloud/edata-user/organization/getSendMsgTypeConfig',
    method: 'get',
    params
  })
}
// 根据飞书群名关键词查询飞书群信息
export function getComplementRemindListGroup(params) {
  return request({
    url: '/cloud/admin/complement/remind/list/group',
    method: 'get',
    params
  })
}

// 根据企微群名关键词查询企微群信息
export function getbizWechatGroupChatGroup(data) {
  return request({
    url: '/cloud/msg/bizWechatGroupChat/query',
    method: 'post',
    data
  })
}

// 店铺漏单提醒设置参数接口
export function setComplementRemindParam(params) {
  return request({
    url: '/cloud/admin/complement/remind/setting',
    method: 'post',
    data: params
  })
}

// 自媒体提醒设置查询接口
export function getMediaRemind(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/list',
    method: 'get',
    params
  })
}

// 自媒体账号查询提醒设置
export function getMediaAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/account/list',
    method: 'get',
    params
  })
}

// 抖音商品审核通知人员列表
export function getRemindInfo(params) {
  return request({
    url: '/cloud/admin/config/feishuremind/remind-info/list',
    method: 'get',
    params
  })
}

// 抖音修改商品审核通知人员列表
export function setRemindInfo(data) {
  return request({
    url: '/cloud/admin/config/feishuremind/set',
    method: 'POST',
    data
  })
}

// 抖音订阅数获取
export function getCeilingNum(params) {
  return request({
    url: '/cloud/center/dou_notification_ceiling_num/query',
    method: 'get',
    params
  })
}

// 抖音订阅数修改
export function setCeilingNum(data) {
  return request({
    url: '/cloud/center/dou_notification_ceiling_num/set',
    method: 'POST',
    data
  })
}

// 自媒体账号修改提醒设置
export function setMediaAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/account/edit',
    method: 'post',
    data: params
  })
}

// 自媒体账号修改提醒设置
export function setHotVideo(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/hot/works/edit',
    method: 'post',
    data: params
  })
}
// 自媒体爆款作品查询提醒设置
export function getHotVideoData(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/hot/works/list',
    method: 'get',
    params
  })
}
// 自媒体提醒数据设置
export function setMediaRemind(params) {
  return request({
    url: '/cloud/edata-wemedia/media/remind/edit',
    method: 'post',
    data: params
  })
}

// 脱敏共享提醒数据查询
export function getVideoRemindData(params) {
  return request({
    url: '/cloud/product/video/remind/list',
    method: 'get',
    params
  })
}

// 脱敏共享提醒设置
export function setVideoRemindData(params) {
  return request({
    url: '/cloud/product/video/remind/edit',
    method: 'post',
    data: params
  })
}

// 商品未映射提醒设置数据查询
export function getProductRemindList(params) {
  return request({
    url: '/cloud/admin/product/remind/list',
    method: 'get',
    params
  })
}

// 商品未映射提醒设置更新方法
export function setProductRemid(params) {
  return request({
    url: '/cloud/admin/product/remind/setting',
    method: 'post',
    data: params
  })
}

// 审核人员配置
export function couponAuditorSetting(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/setting',
    method: 'post',
    data: params
  })
}

export function couponAuditorSearch(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/list',
    method: 'get',
    params
  })
}

// 获取跟进人提醒
export function getFollowerRemind(params) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/customer/follower/remind',
    method: 'GET',
    params
  })
}

// 设置跟进人提醒
export function setFollowerRemind(data) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/customer/follower/remind',
    method: 'POST',
    data
  })
}

// 查询产品设置数据
export function getProductSettingData() {
  return request({
    url: '/cloud/product/product/remind/list',
    method: 'get'
  })
}

// 设置产品提醒
export function setProductSettingData(data) {
  return request({
    url: '/cloud/product/product/remind/edit',
    method: 'post',
    data: data
  })
}
// 预警提醒配置
export function payNoticeSave(data) {
  return request({
    url: '/cloud/pay/notice/save',
    method: 'POST',
    data
  })
}

// 预警提醒查询
export function payNoticeQuery(data) {
  return request({
    url: '/cloud/pay/notice/query',
    method: 'POST',
    data
  })
}

// 获取 交付管理-交付设置-通知设置 详情
export function getRemindDetail() {
  return request({
    url: '/cloud/delivery/delivery/remind/list',
    method: 'get'
  })
}

// 保存 交付管理-交付设置-通知设置
export function saveRemindDetail(data) {
  return request({
    url: '/cloud/delivery/delivery/remind/setting',
    method: 'POST',
    data
  })
}

// 获取 交付管理-交付设置-通用管理-直播课交付 详情
export function getLiveCourseDetailApi() {
  return request({
    url: '/cloud/delivery/delivery/config/live-course/get',
    method: 'get'
  })
}
/**
export function saveDeliveryConfig(data) {
  return request({
    url: '/cloud/delivery/delivery/config/save',
    method: 'post',
    data
  })
}
 */

// 保存 交付管理-交付设置-通用管理-直播课交付
export function saveLiveCourseDetailApi(data) {
  return request({
    url: '/cloud/delivery/delivery/config/live-course/save',
    method: 'post',
    data
  })
}
