import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 员工列表数据分页查询
export function employeePageListAjax(data) {
  return request({
    url: baseOaUrl + '/employee/pageList',
    method: 'POST',
    data
  })
}

//签署列表分页查询
export function signStatisticsPageListAjax(data) {
  return request({
    url: baseOaUrl + '/employee/signStatisticsPageList',
    method: 'POST',
    data
  })
}

//转正
export function employeeRegularAjax(data) {
  return request({
    url: baseOaUrl + '/employee/regular',
    method: 'POST',
    data
  })
}
//离职
export function employeeLeaveAjax(data) {
  return request({
    url: baseOaUrl + '/employee/leave',
    method: 'POST',
    data
  })
}
//调动
export function employeeTransferAjax(data) {
  return request({
    url: baseOaUrl + '/employee/transfer',
    method: 'POST',
    data
  })
}

//查询签署合同列表
export function contractListAjax(data) {
  return request({
    url: baseOaUrl + '/employee/contract/list',
    method: 'post',
    data
  })
}
//批量添加签署
export function batchAddSignAjax(data) {
  return request({
    url: baseOaUrl + '/employee/batchAddSign',
    method: 'POST',
    data
  })
}

//审核
export function signAuditAjax(data) {
  return request({
    url: baseOaUrl + '/employee/signAudit',
    method: 'POST',
    data
  })
}
//签署明细分页查询
export function signDetailPageListAjax(data) {
  return request({
    url: baseOaUrl + '/employee/signDetailPageList',
    method: 'POST',
    data
  })
}
//一键落章
export function autoSignAjax(data) {
  return request({
    url: baseOaUrl + `/employee/autoSign`,
    method: 'POST',
    data 
   })
}



//落章
export function fallingChapterAjax(params) {
  return request({
    url: baseOaUrl + `/employee/fallingChapter?contractRelationId=${params.contractRelationId}`,
    method: 'get'
  })
}
//修改头像
export function employeeModifyAvatarAjax(data) {
  return request({
    url: baseOaUrl + '/employee/modifyAvatar',
    method: 'POST',
    data
  })
}

//多人查询合同列表
export function contractfollowConditionListAjax(data) {
  return request({
    url: baseOaUrl + '/employee/contract/followConditionList',
    method: 'POST',
    data
  })
}

//tab列头数据统计
export function employeetTbDataStaticAjax() {
  return request({
    url: baseOaUrl + '/employee/tabDataStatic',
    method: 'get'
  })
}