import request from '@/utils/request2'

// 首页获取级别列表-爆款推荐
export function selectPfHomePageLevelList() {
  return request({
    url: '/cloud/admin/pfhome/page/selectPfHomePageLevelList',
    method: 'GET'
  })
}

// 获取商品信息-爆款推荐
export function selectPageHomePageGoods(params) {
  return request({
    url: '/cloud/admin/pfhome/page/goods/selectPageHomePageGoods',
    method: 'GET',
    params
  })
}

// 获取一级目录
export function selectLevel1() {
  return request({
    url: '/cloud/admin/pfhome/page/selectLevel1',
    method: 'GET'
  })
}

// 获取二级目录
export function selectLevel2(params) {
  return request({
    url: '/cloud/admin/pfhome/page/selectLevel2',
    method: 'GET',
    params
  })
}

// 新增级别目录
export function insert(data) {
  return request({
    url: '/cloud/admin/pfhome/page/insert',
    method: 'POST',
    data
  })
}

// 修改级别目录
export function update(data) {
  return request({
    url: '/cloud/admin/pfhome/page/update',
    method: 'PUT',
    data
  })
}

// 移除级别目录
export function del(id) {
  return request({
    url: `/cloud/admin/pfhome/page/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量移除级别目录商品
export function delGoods(data) {
  return request({
    url: '/cloud/admin/pfhome/page/goods/delete',
    method: 'POST',
    data
  })
}

// 批量新增级别目录商品
export function insertGoods(data) {
  return request({
    url: '/cloud/admin/pfhome/page/goods/insert',
    method: 'POST',
    data
  })
}

// 修改商品排序
export function updateSortGoods(data) {
  return request({
    url: '/cloud/admin/pfhome/page/goods/update',
    method: 'POST',
    data
  })
}
