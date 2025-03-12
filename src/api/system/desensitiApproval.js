import request from '@/utils/request2'

// 查询脱敏申请列表
export function getDesensitizationList(params) {
  return request({
    url: '/cloud/product/desensitizationApplication/page',
    method: 'get',
    params
  })
}

// 查询各种状态的脱敏申请数量
export function getDesensitizationCount(params) {
  return request({
    url: '/cloud/product/desensitizationApplication/count',
    method: 'get',
    params
  })
}

// 提交脱敏申请
export function submitDesensitization(data) {
  return request({
    url: '/cloud/product/desensitizationApplication',
    method: 'post',
    data
  })
}

// 撤销申请
export function desensitizationCancel(data) {
  return request({
    url: '/cloud/product/desensitizationApplication/cancel',
    method: 'put',
    data
  })
}

// 审批通过脱敏申请
export function desensitizationApprove(data) {
  return request({
    url: '/cloud/product/desensitizationApplication/approve',
    method: 'put',
    data
  })
}

// 驳回脱敏申请
export function desensitizationReject(data) {
  return request({
    url: '/cloud/product/desensitizationApplication/reject',
    method: 'put',
    data
  })
}

// 批量提交脱敏申请
export function desensitizationApplication(data) {
  return request({
    url: '/cloud/product/desensitizationApplication',
    method: 'post',
    data
  })
}

// 批量提交脱敏申请new
export function newDesensitizationApplication(data) {
  return request({
    url: '/cloud/product/desensitizationApplication/pcSubmitApplication',
    method: 'post',
    data
  })
}

// 审核驳回的数据重新提交审核
export function desensitizationRestart(data) {
  return request({
    url: '/cloud/product/desensitizationApplication',
    method: 'post',
    data
  })
}
