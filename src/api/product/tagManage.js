import request from '@/utils/request2'

// 爆款标记类型列表
export function hotMarkTypeList(params) {
  return request({
    url: '/cloud/product/videoHotMark/hotMarkTypeList',
    method: 'get',
    params
  })
}

// 查询标记列表
export function queryHotMarkPage(data) {
  return request({
    url: `/cloud/product/videoHotMark/queryHotMarkPage?export=${data.export}`,
    method: 'post',
    data,
    responseType: data.export ? 'blob' : ''
  })
}

// 爆款标记类型编辑列表
export function hotMarkTypeEditList(params) {
  return request({
    url: '/cloud/product/videoHotMark/hotMarkTypeEditList',
    method: 'get',
    params
  })
}

// 爆款标记类型统计
export function hotMarkTypeStatistics(params) {
  return request({
    url: '/cloud/product/videoHotMark/hotMarkTypeStatistics',
    method: 'get',
    params
  })
}

// 添加爆款标记
export function addHotMarkType(data) {
  return request({
    url: '/cloud/product/videoHotMark/addHotMarkType',
    method: 'POST',
    data
  })
}

// 修改爆款标记
export function updateHotMarkType(data) {
  return request({
    url: '/cloud/product/videoHotMark/updateHotMarkType',
    method: 'POST',
    data
  })
}

// 查询字幕
export function queryMarkSubtitle(params) {
  return request({
    url: '/cloud/product/videoHotMark/queryMarkSubtitle',
    method: 'get',
    params
  })
}

// 查询字幕
export function sensitiveQueryMarkSubtitle(params) {
  return request({
    url: '/cloud/product/videoSensitiveMark/queryMarkSubtitle',
    method: 'get',
    params
  })
}

// 敏感标记类型列表
export function sensitiveMarkTypeList(params) {
  return request({
    url: `/cloud/product/videoSensitiveMark/sensitiveMarkTypeList`,
    method: 'get',
    params
  })
}

// 查询标记列表分页
export function querySensitiveMarkPage(data) {
  return request({
    url: `/cloud/product/videoSensitiveMark/querySensitiveMarkPage?export=${data.export}`,
    method: 'post',
    data,
    responseType: data.export ? 'blob' : ''
  })
}

// 爆款标记类型统计
export function sensitiveMarkTypeStatistics(params) {
  return request({
    url: '/cloud/product/videoSensitiveMark/sensitiveMarkTypeStatistics',
    method: 'get',
    params
  })
}

// 敏感标记类型编辑列表
export function sensitiveMarkTypeEditList(params) {
  return request({
    url: '/cloud/product/videoSensitiveMark/sensitiveMarkTypeEditList',
    method: 'get',
    params
  })
}

// 修改敏感标记
export function updateSensitiveMarkType(data) {
  return request({
    url: '/cloud/product/videoSensitiveMark/updateSensitiveMarkType',
    method: 'POST',
    data
  })
}

// 添加敏感标记
export function addSensitiveMarkType(data) {
  return request({
    url: '/cloud/product/videoSensitiveMark/addSensitiveMarkType',
    method: 'POST',
    data
  })
}

// 脱敏标记分类-删除
export function deleteSensitiveMarkType(params) {
  return request({
    url: '/cloud/product/videoSensitiveMark/delete',
    method: 'DELETE',
    params
  })
}
