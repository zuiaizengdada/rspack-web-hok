import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 证章列表数据分页查询
export function electronicSealPageListAjax(data) {
  return request({
    url: baseOaUrl + '/electronicSeal/pageList',
    method: 'POST',
    data
  })
}

//证章新增
export function electronicSealAddAjax(data) {
  return request({
    url: baseOaUrl + '/electronicSeal/add',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data
  })
}

//证章修改
export function electronicUpdateAjax(data) {
  return request({
    url: baseOaUrl + '/electronicSeal/update',
    method: 'POST',
    data
  })
}
//删除
export function electronicSealDeleteAjax(params) {
  return request({
    url: baseOaUrl + `/electronicSeal/delete?id=${params.id}`,
    method: 'DELETE'
  })
}

//启用 禁用
export function enableOrDisableAjax(data) {
  return request({
    url: baseOaUrl + '/electronicSeal/enableOrDisable',
    method: 'POST',
    data
  })
}

//根据条件查询列表查询
export function elecFollowConditionListAjax(data) {
  return request({
    url: baseOaUrl + '/electronicSeal/followConditionList',
    method: 'POST',
    data
  })
}

//详情
export function electronicSealInfoAjax(params) {
  return request({
    url: baseOaUrl + `/electronicSeal/info?id=${params.id}`,
    method: 'get'
  })
}

