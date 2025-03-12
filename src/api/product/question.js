
import request from '@/utils/request2'

export function questionPage(data) {
  return request({
    url: '/cloud/product/question/page',
    method: 'POST',
    data
  })
}

export function questionImport({ data, params }) {
  return request({
    url: '/cloud/product/question/import',
    method: 'POST',
    data,
    params
  })
}
export function questionDownload(params) {
  return request({
    url: '/cloud/product/question/download',
    method: 'GET',
    params
  })
}

export function questionStatistics(data) {
  return request({
    url: '/cloud/product/question/statistics',
    method: 'POST',
    data
  })
}

export function questionDetail(params) {
  return request({
    url: '/cloud/product/question/detail',
    method: 'GET',
    params
  })
}

export function questionRead(data) {
  return request({
    url: `/cloud/product/question/read`,
    method: 'put',
    data
  })
}
export function questionIds(data) {
  return request({
    url: '/cloud/product/question/list/ids',
    method: 'post',
    data
  })
}
