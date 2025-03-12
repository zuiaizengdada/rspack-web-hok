import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 添加固定资产
export function assetAdd(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/add',
    method: 'POST',
    data
  })
}

// 调拨固定资产
export function assetAllot(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/allot',
    method: 'POST',
    data
  })
}

// 固定资产导出
export function assetExport(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/export',
    method: 'POST',
    data
  })
}

// 固定资产导入
export function assetImport(data, cancelToken) {
  return request({
    url: baseOaUrl + '/fixed/asset/import',
    method: 'POST',
    data,
    cancelToken
  })
}

// 固定资产分页列表
export function assetPageList(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/pageList',
    method: 'POST',
    data
  })
}

// 修改固定资产
export function assetUpdate(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/update',
    method: 'POST',
    data
  })
}

// 修改固定资产使用状态
export function assetUpdateState(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/updateState',
    method: 'POST',
    data
  })
}

// 固定资产类型列表
export function assetTypeList(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/typeList',
    method: 'get',
    params: data
  })
}

// 固定资产更改记录分页列表
export function assetChangePageListAjax(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/changePageList',
    method: 'POST',
    data
  })
}

// 固定资产批量确认  发送通知
export function batchConfirm(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/batchConfirm',
    method: 'POST',
    data
  })
}

// 固定资产确认记录分页列表
export function confirmPageList(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/confirmPageList',
    method: 'POST',
    data
  })
}

// 固定城市分页列表
export function selectCity(params) {
  return request({
    url: baseOaUrl + '/fixed/asset/select/city',
    method: 'get',
    params
  })
}
// 批量调拨固定资产
export function assetBatchAllotAjax(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/batchAllot',
    method: 'POST',
    data
  })
}
// 批量修改固定资产使用状态
export function assetBatchUpdateStateAjax(data) {
  return request({
    url: baseOaUrl + '/fixed/asset/batchUpdateState',
    method: 'POST',
    data
  })
}
