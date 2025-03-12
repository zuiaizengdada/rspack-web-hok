import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 添加电话卡
export function cardAdd(data) {
  return request({
    url: baseOaUrl + '/telephone/card/add',
    method: 'POST',
    data
  })
}

// 调拨电话卡
export function cardAllot(data) {
  return request({
    url: baseOaUrl + '/telephone/card/allot',
    method: 'POST',
    data
  })
}

// 电话卡导出
export function cardExport(data) {
  return request({
    url: baseOaUrl + '/telephone/card/export',
    method: 'POST',
    data
  })
}

// 电话卡导入
export function cardImport(data) {
  return request({
    url: baseOaUrl + '/telephone/card/import',
    method: 'POST',
    data
  })
}

// 电话卡分页列表
export function cardPageList(data) {
  return request({
    url: baseOaUrl + '/telephone/card/pageList',
    method: 'POST',
    data
  })
}

// 修改电话卡
export function cardUpdate(data) {
  return request({
    url: baseOaUrl + '/telephone/card/update',
    method: 'POST',
    data
  })
}

// 修改电话卡使用状态
export function cardUpdateState(data) {
  return request({
    url: baseOaUrl + '/telephone/card/updateState',
    method: 'POST',
    data
  })
}

// 电话卡更改记录分页列表
export function phoneCardChangePageListAjax(data) {
  return request({
    url: baseOaUrl + '/telephone/card/changePageList',
    method: 'POST',
    data
  })
}

// 电话卡批量确认 发送通知
export function batchConfirm(data) {
  return request({
    url: baseOaUrl + '/telephone/card/batchConfirm',
    method: 'POST',
    data
  })
}

// 电话卡确认记录分页列表
export function confirmPageList(data) {
  return request({
    url: baseOaUrl + '/telephone/card/confirmPageList',
    method: 'POST',
    data
  })
}

// 批量调拨
export function cardBatchAllotAjax(data) {
  return request({
    url: baseOaUrl + '/telephone/card/batchAllot',
    method: 'POST',
    data
  })
}
// 批量修改使用状态
export function cardBatchUpdateStateAjax(data) {
  return request({
    url: baseOaUrl + '/telephone/card/batchUpdateState',
    method: 'POST',
    data
  })
}
// 电话卡城市分页列表
export function cardSelectCityAjax(params) {
  return request({
    url: baseOaUrl + '/telephone/card/select/city',
    method: 'get',
    params
  })
}
