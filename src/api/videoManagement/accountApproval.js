import request from '@/utils/request2'

// 审批设置列表
export function getExaminePage(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/page',
    method: 'post',
    data
  })
}
// 账号审批相关操作（通过、驳回、取消）
export function operateAccountExamine(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/operate',
    method: 'post',
    data
  })
}

// 敏感词触发记录列表查询
export function triggerPage(data) {
  return request({
    url: '/cloud/edata-wemedia/sensitive/trigger/page',
    method: 'post',
    data
  })
}

// 审批设置列表
export function getPageCount() {
  return request({
    url: '/cloud/edata-wemedia/account/examine/pageCount',
    method: 'GET'
  })
}
