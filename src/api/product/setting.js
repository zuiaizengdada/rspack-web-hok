import request from '@/utils/request2'

// 删除交付场景接口
export function deleteDeliveryScenario(id) {
  return request({
    url: `/cloud/product/delivery/scene/delete?id=${id}`,
    method: 'DELETE'
  })
}

// 交付场景查询接口
export function searchDeliveryData(params) {
  return request({
    url: '/cloud/product/delivery/scene/list',
    method: 'post',
    data: params
  })
}

// 交付场景中平台分类及平台账号接口
export function getAccount() {
  return request({
    url: '/cloud/product/case/platform/list/platform',
    method: 'get'
  })
}

// 新增交付场景
export function insertDelivery(params) {
  return request({
    url: `/cloud/product/delivery/scene/add`,
    method: 'POST',
    data: params
  })
}

// 编辑交付场景
export function editDelivery(params) {
  return request({
    url: '/cloud/product/delivery/scene/edit',
    method: 'PUT',
    data: params
  })
}

// 分词查询接口
export function getWordsListData(params) {
  return request({
    url: '/cloud/product/participle/list',
    method: 'post',
    data: params
  })
}

// 删除分词接口
export function deleteWords(id) {
  return request({
    url: `/cloud/product/participle/delete?id=${id}`,
    method: 'DELETE'
  })
}

// 新增分词接口
export function insertWords(params) {
  return request({
    url: `/cloud/product/participle/add`,
    method: 'POST',
    data: params
  })
}

// 分词导入接口
export function participleImport(param) {
  return request({
    url: '/cloud/product/participle/import',
    method: 'post',
    data: param
  })
}

// 分词下载
export function participleDownload() {
  return request({
    url: '/cloud/product/participle/template/url',
    method: 'post'
  })
}

// 根据条件查询选题平台列表
export function getCasePlatformList(params) {
  return request({
    url: '/cloud/product/case/platform/list',
    method: 'POST',
    data: params
  })
}

// 新增选题平台
export function addPlatform(params) {
  return request({
    url: '/cloud/product/case/platform/add',
    method: 'POST',
    data: params
  })
}

// 编辑选题平台
export function editPlatform(params) {
  return request({
    url: '/cloud/product/case/platform/edit',
    method: 'POST',
    data: params
  })
}

// 删除选题平台
export function deletePlatform(params) {
  return request({
    url: '/cloud/product/case/platform/delete',
    method: 'POST',
    params
  })
}
