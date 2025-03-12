import request from '@/utils/request2'

// 修改ROI达标配置
export function setROIReachRule(params) {
  return request({
    url: '/cloud/data-center/roi-reach-rule',
    method: 'put',
    data: params
  })
}

// 查询ROI配置数据信息
export function getROIReachData(params) {
  return request({
    url: '/cloud/data-center/roi-reach-rule/detail',
    method: 'get',
    data: params
  })
}

// 刷单订单列表查询
export function getBrushOrderPage(params) {
  return request({
    url: '/cloud/data-center/brush/order/page',
    method: 'get',
    params
  })
}

// 广告主投放数据列表查询
export function getAdvertiseCostDoPage(params) {
  return request({
    url: '/cloud/data-center/advertise-cost-do/page',
    method: 'get',
    params
  })
}

// 线下退款上传列表查询
export function getRefundRecordDoPage(params) {
  return request({
    url: '/cloud/edata-order/refund-record-do/page',
    method: 'get',
    params
  })
}

// 刷单订单下载模板
export function getSwipeDownload(params) {
  return request({
    url: '/cloud/data-center/data/upload/swipe/download',
    method: 'get',
    params
  })
}

// 投放花费下载模板
export function getLanuchExeclDownload(params) {
  return request({
    url: '/cloud/data-center/data/upload/launch/download',
    method: 'get',
    params
  })
}

// 线下退款下载模板
export function getRefundExeclDownload(params) {
  return request({
    url: '/cloud/edata-order/data/upload/refund/download',
    method: 'get',
    params
  })
}

// 刷单订单导入接口
export function uploadSwipeImport(params) {
  return request({
    url: '/cloud/data-center/data/upload/swipe/import',
    method: 'post',
    data: params
  })
}

// 投放花费导入接口
export function uploadLaunchImport(params) {
  return request({
    url: '/cloud/data-center/data/upload/launch/import',
    method: 'post',
    data: params
  })
}

// 线下退款导入接口
export function uploadRefundImport(params) {
  return request({
    url: '/cloud/edata-order/data/upload/refund/import',
    method: 'post',
    data: params
  })
}

// 获取导入状态
export function getImportTaskResult(params) {
  return request({
    url: '/cloud/data-center/data/upload/import/task',
    method: 'get',
    params
  })
}

// 查询roi达标标准new
export function getROIDetailNew(params) {
  return request({
    url: '/cloud/data-center/roi-reach-rule/detail',
    method: 'get',
    params
  })
}

// 配置roi达标配置
export function setROIDetailNew(params) {
  return request({
    url: '/cloud/data-center/roi-reach-rule',
    method: 'put',
    data: params
  })
}

// 获取额度解密申请提醒设置详情
export function getDecryptingReminderDetail() {
  return request({
    url: '/cloud/admin/complement/remind/decryptingReminderSettingDetail',
    method: 'get'
  })
}

// 获取未解密订单超额提醒设置详情
export function getComplementOrderReminderSettingDetail() {
  return request({
    url: '/cloud/admin/complement/remind/complementOrderReminderSettingDetail',
    method: 'get'
  })
}

// 设置额度解密申请提醒数据
export function setDecryptingReminderDetail(params) {
  return request({
    url: '/cloud/admin/complement/remind/decryptingReminderSetting',
    method: 'post',
    data: params
  })
}

// 设置未解密订单超额提醒设置
export function setComplementOrderReminder(params) {
  return request({
    url: '/cloud/admin/complement/remind/complementOrderReminderSetting',
    method: 'post',
    data: params
  })
}

// 商品未映射超额提醒设置详情
export function getReminderSettingDetail() {
  return request({
    url: '/cloud/admin/product/remind/reminderSettingDetail',
    method: 'get'
  })
}

// 商品未映射超额提醒设置
export function setReminderSettingDetail(params) {
  return request({
    url: '/cloud/admin/product/remind/reminderSetting',
    method: 'post',
    data: params
  })
}

// 默认分配规则分页查询
export function getDistributeRulePage(params) {
  return request({
    url: '/cloud/data-center/default/distribute/rule/page',
    method: 'post',
    data: params
  })
}

