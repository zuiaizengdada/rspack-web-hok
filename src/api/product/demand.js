
import request from '@/utils/request2'

export function demandList(data) {
  return request({
    url: '/cloud/product/demand/list',
    method: 'post',
    data
  })
}

export function demandAdd(data) {
  return request({
    url: '/cloud/product/demand/add',
    method: 'post',
    data
  })
}

export function demandEdit(data) {
  return request({
    url: '/cloud/product/demand/edit',
    method: 'post',
    data
  })
}

export function demandKeyword(params) {
  return request({
    url: '/cloud/product/demand/list/keyword',
    method: 'get',
    params
  })
}
