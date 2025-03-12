// Date: 2024-03-18
import request2 from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'

/**
 * 坐席列表
 * @param {*} params
 * @returns
 */
export function callAgentPage(params) {
  return request2({
    url: '/cloud/edata-message/call-agent/page',
    method: 'get',
    params
  })
}

/**
 * 新增坐席
 * @param {*} data
 * @returns
 */
export function callAgentAdd(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/add',
    method: 'post',
    data
  })
}

/**
 * 编辑坐席
 * @param {*} data
 * @returns
 */
export function callAgentEdit(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/edit',
    method: 'put',
    data
  })
}

/**
 * 删除座席
 * @param {*} params
 * @returns
 */
export function callAgentDel(params) {
  return request2({
    url: `/cloud/edata-message/call-agent/delete/${params.id}`,
    method: 'delete'
  })
}

/**
 * 获取开通座席手机验证码
 * @param {*} params
 * @returns
 */
export function callAgentCode(params) {
  return request2({
    url: '/cloud/edata-message/call-agent/channel/agent/code',
    method: 'get',
    params
  })
}

/**
 * 测试呼叫
 * @param {*} data
 * @returns
 */
export function callAgentTestCall(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/test/call',
    method: 'post',
    data
  })
}

/**
 * 呼叫
 * @param {*} data
 * @returns
 */
export function call(data) {
  return request2({
    url: '/cloud/edata-sale/clue/call',
    method: 'post',
    data
  })
}

/**
 * 取消拨打电话
 * @param {*} data
 * @returns
 */
export function cancelCall(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/cancel/call',
    method: 'post',
    data
  })
}

/**
 * 挂断电话
 * @param {*} data
 * @returns
 */
export function closeCall(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/hung/up',
    method: 'post',
    data
  })
}

/**
 * 获取语音状态
 * @param {*} params
 * @returns
 */
export function callAgentStatus(params) {
  return request2({
    url: '/cloud/edata-message/call-agent/call/status',
    method: 'get',
    params
  })
}

/**
 * 验证保存座席手机号
 * @param {*} data
 * @returns
 */
export function agentVerify(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/channel/agent/verify',
    method: 'post',
    data
  })
}

/**
 * 判断手机是否已经绑定过，data返回true和false
 * @param {*} params
 * @returns
 */
export function verifyBefore(params) {
  return request2({
    url: '/cloud/edata-message/call-agent/check/verify/before',
    method: 'get',
    params
  })
}

/**
 * 人工外呼详情列表
 * @param {*} params
 * @returns
 */
export function clueCallRecordList(params) {
  return request2({
    url: '/cloud/edata-sale/clue-call-record/list',
    method: 'get',
    params
  })
}

/**
 * 检查是否具备拨打权限true为有权限，data直接返回true或者false
 * @param {*} params
 * @returns
 */
export function callCnable(params) {
  return request2({
    url: '/cloud/edata-sale/clue/call/enable',
    method: 'get',
    params
  })
}

/**
 * 检查是否具备拨打权限true为有权限，data直接返回true或者false
 * @param {*} phone
 * @returns
 */
export function phoneCnable(phone) {
  return request2({
    url: `/cloud/edata-message/call-agent/call/phone/enabled/${phone}`,
    method: 'get'
  })
}

/**
 * 根据用户编号查询父级部门名称
 * @param {*} data
 * @returns
 */
export function selectDeptByUserIds(data) {
  // return request2({
  return edataUserApi({
    url: `/system/user/dept/selectDeptByUserIds`,
    method: 'post',
    data: data
  })
}

/**
 * 获取电话的拨打次数
 * @param {*} phone
 * @returns
 */
export function countPhoneCnable(phone) {
  return request2({
    url: `/cloud/edata-message/call-agent/call/phone/count/${phone}`,
    method: 'get'
  })
}

/**
 * 呼叫，返回呼叫记录编号
 * @param {*} data
 * @returns
 */
export function getCallRecord(data) {
  return request2({
    url: '/cloud/delivery/delivery-call-record/call',
    method: 'POST',
    data
  })
}

/**
 * 呼叫,data数据为callNo
 * @param {*} data   calledPhone 被叫号码
 * @returns
 */
export function customStudentCall(data) {
  return request2({
    url: '/cloud/edata-message/call-agent/call',
    method: 'POST',
    data
  })
}

