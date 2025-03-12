/** 搜索管理 */
import request from '@/utils/request'

// 分页查询
export function getSearchList(params) {
  return request({
    url: '/search/page',
    method: 'get',
    params
  })
}
// 批量前端展示(取消)搜索关键词
export function searchDisplay(data) {
  return request({
    url: '/search/update/display',
    method: 'put',
    data
  })
}
// 批量推荐搜索关键词
export function getCatalogueList(params) {
  return request({
    url: '/catalogue/list',
    method: 'get',
    params
  })
}
// 详情
export function searchRecommend(data) {
  return request({
    url: '/search/update/recommend',
    method: 'PUT',
    data
  })
}
// 批量删除搜索关键词
export function searchDeleteBatch(data) {
  return request({
    url: '/search/delete/batch',
    method: 'DELETE',
    data
  })
}
// 修改搜索关键词
export function searchEdit(data) {
  return request({
    url: '/search',
    method: 'put',
    data
  })
}
// 新增搜索关键词
export function searchAdd(data) {
  return request({
    url: '/search',
    method: 'post',
    data
  })
}

