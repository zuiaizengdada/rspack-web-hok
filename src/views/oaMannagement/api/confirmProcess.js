import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 确认流程分页列表
export function confirmProcessPageListAjax(data) {
  return request({
    url: baseOaUrl + '/asset/confirm/process/stat/pageList',
    method: 'POST',
    data
  })
}

// 撤销
export function confirmProcessRevokeAjax(data) {
  return request({
    url: baseOaUrl + '/asset/confirm/process/stat/revoke',
    method: 'POST',
    data
  })
}

// 详情-列表查询
export function confirmProcessDetailPageListAjax(data) {
  return request({
    url: baseOaUrl + '/asset/confirm/process/stat/detail/pageList',
    method: 'POST',
    data
  })
}

// 详情-再次通知（批量-单个都可以）
export function confirmProcessNotifyAgainAjax(data) {
  return request({
    url: baseOaUrl + '/asset/confirm/process/stat/detail/notifyAgain',
    method: 'POST',
    data
  })
}
