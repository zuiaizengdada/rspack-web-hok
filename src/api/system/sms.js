import request from '@/utils/request2'

/**
 * 渠道商
 */

// 分页查询渠道商列表
export function getSmsChannelList(params) {
  return request({
    url: '/cloud/edata-message/sms-channel-do/page',
    method: 'get',
    params
  })
}
// 编辑渠道
export function editSmsChannelList(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-do',
    method: 'PUT',
    data
  })
}
// 新增渠道
export function addSmsChannel(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-do',
    method: 'POST',
    data
  })
}

// 禁用-启用渠道
export function disableSmsChannel(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-do/disable',
    method: 'POST',
    data
  })
}

// 禁用渠道校验
export function checkSmsChannel(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-do/check',
    method: 'POST',
    data
  })
}

// 用途查询列表
export function getSmsTypeDo(params) {
  return request({
    url: '/cloud/edata-message/sms-type-do/list',
    method: 'GET',
    params
  })
}

/**
 * 短信模板
 */
// 分页查询短信模板列表
export function getSmsChannelTemplate(params) {
  return request({
    url: '/cloud/edata-message/sms-channel-template/page',
    method: 'GET',
    params
  })
}
// 新增模板
export function addSmsTemplate(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-template/add',
    method: 'POST',
    data
  })
}
// 渠道商批量申请
export function duplicateSmsChannelTemplate(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-template/batch/duplicate/channel',
    method: 'PUT',
    data
  })
}
// 短信模板批量申请
export function duplicateSmsChannelTemplateApply(data) {
  return request({
    url: '/cloud/edata-message/sms-channel-template/batch/apply',
    method: 'PUT',
    data
  })
}
// 重新发起申请
export function reapplySmsChannelTemplate(id) {
  return request({
    url: `/cloud/edata-message/sms-channel-template/re-apply/${id}`,
    method: 'PUT'
  })
}

// 测试发送
export function testSend(data) {
  return request({
    url: `/cloud/edata-message/sms-channel-template/test/send`,
    method: 'POST',
    data
  })
}

// 修改模板
export function updateSmsChannelTemplate(data) {
  return request({
    url: `/cloud/edata-message/sms-channel-template/update`,
    method: 'PUT',
    data
  })
}

// 修改标签
export function updateTagList(data) {
  return request({
    url: `/cloud/edata-message/tag-config-do/setting`,
    method: 'POST',
    data
  })
}

// 根据编号查询详情
export function getDetailById(id) {
  return request({
    url: `/cloud/edata-message/sms-channel-template/${id}`,
    method: 'GET'
  })
}

/**
 * 短信发送记录
 */
// 分页查询短信发送记录
export function getMsmsSendLogPage(params) {
  return request({
    url: '/cloud/edata-message/sms-send-log/page',
    method: 'get',
    params
  })
}

/**
 * 数据看板
 */
// 根据获取看板数据
export function getDataBoard(params) {
  return request({
    url: '/cloud/edata-message/sms-send-log/data/board',
    method: 'get',
    params
  })
}
// 趋势图
export function getTrendList(params) {
  return request({
    url: '/cloud/edata-message/sms-send-log/trend/list',
    method: 'get',
    params
  })
}

// 插入字段列表数据
export function getStandardPage(params) {
  return request({
    url: '/cloud/edata-message/sms-standard-template-param-do/page',
    method: 'get',
    params
  })
}

// 标签分页查询
export function getTagList(params) {
  return request({
    url: '/cloud/edata-message/tag-config-do/page',
    method: 'GET',
    params
  })
}

// 渠道签名分页
export function getChannelSignaturePage(params) {
  return request({
    url: '/cloud/edata-message/channel-signature-do/page',
    method: 'GET',
    params
  })
}
// 分页模板查询
export function getOrgMessageTemplateList(params) {
  return request({
    url: '/cloud/msg/org-message-action-template-do/page',
    method: 'GET',
    params
  })
}
// 渠道签名分页
export function getChannelSignaturePageV2(params) {
  return request({
    url: '/cloud/edata-sale/sms/signature/page',
    method: 'GET',
    params
  })
}
