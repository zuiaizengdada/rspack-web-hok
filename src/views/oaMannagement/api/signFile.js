import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 文件管理列表数据分页查询
export function signFilePageListAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/pageList',
    method: 'POST',
    data
  })
}
//新增-修改文件
export function addOrUpdateAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/addOrUpdate',
    method: 'POST',
    data
  })
}

//获取参数配置信息
export function paramConfigInfoAjax(data) {
  return request({
    url: baseOaUrl + `/signFile/paramConfigInfo?signFileId=${data.signFileId}`,
    method: 'get'
  })
}

//保存参数配置信息
export function saveParamConfigInfoAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/saveParamConfigInfo',
    method: 'POST',
    data
  })
}

//字体列表
export function fontListAjax(data) {
  return request({
    url: baseOaUrl + '/font/list',
    method: 'get',
    data
  })
}

//文件管理详情数据查询
export function signFileDetailAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/detail',
    method: 'POST',
    data
  })
}

//文件管理删除
export function signFileDeleteAjax(data) {
  return request({
    url: baseOaUrl + `/signFile/delete`,
    method: 'DELETE',
    data
  })
}

//禁用
export function signFileEnableOrDisableAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/enableOrDisable',
    method: 'POST',
    data
  })
}

//根据条件查询列表查询
export function fileFollowConditionListAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/followConditionList',
    method: 'POST',
    data
  })
}

//分页查询
export function signFileTabDataStaticAjax(data) {
  return request({
    url: baseOaUrl + '/signFile/tabDataStatic',
    method: 'get',
    data
  })
}