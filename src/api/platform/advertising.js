import request from '@/utils/request2'

// 广告管理详情
export function getManagerDetail(params) {
  return request({
    url: `/cloud/admin/platform/ad/detail`,
    method: 'get',
    params
  })
}

// 广告管理列表
export function getManagerList(params) {
  return request({
    url: '/cloud/admin/platform/ad/page',
    method: 'GET',
    params
  })
}

// 广告管理保存
export function managerUpdate(data) {
  return request({
    url: '/cloud/admin/platform/ad/update',
    method: 'POST',
    data
  })
}

// 广告-新增
export function adInfoCreate(data) {
  return request({
    url: '/cloud/admin/platform/ad/info/create',
    method: 'POST',
    data
  })
}

// 广告-详情
export function adInfoDetail(params) {
  return request({
    url: '/cloud/admin/platform/ad/info/detail',
    method: 'GET',
    params
  })
}

// 广告-列表
export function adInfoList(params) {
  return request({
    url: '/cloud/admin/platform/ad/info/list',
    method: 'GET',
    params
  })
}

// 广告-移除
export function adInfoRemove(data) {
  return request({
    url: `/cloud/admin/platform/ad/info/remove/${data.id}`,
    method: 'DELETE'
  })
}

// 广告-排序
export function adInfoSort(data) {
  return request({
    url: '/cloud/admin/platform/ad/info/sort',
    method: 'POST',
    data
  })
}

// 广告-编辑
export function adInfoUpdate(data) {
  return request({
    url: '/cloud/admin/platform/ad/info/update',
    method: 'POST',
    data
  })
}

// 广告-分类 1.平台 2.机构
export function platformGoodsType(params) {
  return request({
    url: '/cloud/admin/platform/goods/type',
    method: 'get',
    params
  })
}

// 专题页列表 - 平台级别
export function specialPage(params) {
  return request({
    url: '/cloud/edata-cms/special/page/list',
    method: 'GET',
    params
  })
}

// 专题页列表 - 平台级别 详情
export function specialDetail(params) {
  return request({
    url: '/cloud/edata-cms/special/page/get/detail',
    method: 'GET',
    params
  })
}

export function goodTypeNameById(id) {
  return request({
    url: `/cloud/admin/platform/goods/type/detail?id=${id}`,
    method: 'get'
  })
}
