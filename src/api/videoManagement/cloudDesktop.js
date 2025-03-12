import request from '@/utils/request2'

// 云桌面管理详情-基本信息
export function getCloudPcDetailBasic(params) {
  return request({
    url: '/cloud/product/cloudPc/detailBasic',
    method: 'GET',
    params
  })
}

// 云桌面管理详情-使用明细
export function getCloudPcUseDetail(params) {
  return request({
    url: '/cloud/product/cloudPc/useDetail',
    method: 'GET',
    params
  })
}

// 云桌面管理-操作
export function manageCloudPcOperation(data) {
  return request({
    url: '/cloud/product/cloudPc/manageCloudPcOperation',
    method: 'POST',
    data
  })
}

// 云桌面管理-列表
export function getCloudPcPage(data) {
  return request({
    url: '/cloud/product/cloudPc/page',
    method: 'POST',
    data
  })
}

// 云桌面管理-统计
export function cloudPcStatistics() {
  return request({
    url: '/cloud/product/cloudPc/statistics',
    method: 'GET'
  })
}

// 用户云桌面操作
export function userCloudOperation(data) {
  return request({
    url: '/cloud/product/cloudPc/userCloudOperation',
    method: 'POST',
    data
  })
}

// 用户云桌面查询信息
export function userCloudPc(params) {
  return request({
    url: '/cloud/product/cloudPc/userCloudPc',
    method: 'GET',
    params
  })
}
