import request from '@/utils/request2'

// 广告管理详情
export function getManagerDetail(params) {
  return request({
    url: `/cloud/admin/ad/manager/detail`,
    method: 'get',
    params
  })
}

// 广告管理列表
export function getManagerList(params) {
  return request({
    url: '/cloud/admin/ad/manager/page',
    method: 'GET',
    params
  })
}

// 广告管理保存
export function managerUpdate(data) {
  return request({
    url: '/cloud/admin/ad/manager/update',
    method: 'POST',
    data
  })
}

// 广告-新增
export function adInfoCreate(data) {
  return request({
    url: '/cloud/admin/ad/info/create',
    method: 'POST',
    data
  })
}

// 广告-详情
export function adInfoDetail(params) {
  return request({
    url: '/cloud/admin/ad/info/detail',
    method: 'GET',
    params
  })
}

// 广告-列表
export function adInfoList(params) {
  return request({
    url: '/cloud/admin/ad/info/list',
    method: 'GET',
    params
  })
}

// 广告-移除
export function adInfoRemove(data) {
  return request({
    url: `/cloud/admin/ad/info/remove/${data.id}`,
    method: 'DELETE'
  })
}

// 广告-排序
export function adInfoSort(data) {
  return request({
    url: '/cloud/admin/ad/info/sort',
    method: 'POST',
    data
  })
}

// 广告-编辑
export function adInfoUpdate(data) {
  return request({
    url: '/cloud/admin/ad/info/update',
    method: 'POST',
    data
  })
}
