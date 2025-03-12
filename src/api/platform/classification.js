import request from '@/utils/request'

// 新增平台级APP目录分类表
export function catalogueAdd(data) {
  return request({
    url: '/pf-catalogue-do',
    method: 'POST',
    data
  })
}

// 修改平台级APP目录分类表
export function catalogueUpdate(data) {
  return request({
    url: '/pf-catalogue-do',
    method: 'PUT',
    data
  })
}

// 删除
export function catalogueDelete(id) {
  return request({
    url: `/pf-catalogue-do/delete/${id}`,
    method: 'DELETE'
  })
}

// 详情
export function catalogueDetail(params) {
  return request({
    url: `/pf-catalogue-do/detail`,
    method: 'GET',
    params
  })
}

// 列表
export function cataloguePage(params) {
  return request({
    url: `/pf-catalogue-do/page`,
    method: 'GET',
    params
  })
}

// 下级
export function subcataloguePage(params) {
  return request({
    url: `pf-catalogue-do/list`,
    method: 'GET',
    params
  })
}
