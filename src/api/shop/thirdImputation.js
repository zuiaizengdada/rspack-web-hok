/** 第三方店铺归集 */
import request from '@/utils/request'

// 分页查询
export function getThirdPage(params) {
  return request({
    url: '/third/page',
    method: 'get',
    params
  })
}

// 新增
export function addThird(data) {
  return request({
    url: '/third',
    method: 'POST',
    data
  })
}
// 修改
export function editThird(data) {
  return request({
    url: '/third',
    method: 'PUT',
    data
  })
}

// 批量删除
export function delThird(data) {
  return request({
    url: '/third/delete/batch',
    method: 'DELETE',
    data
  })
}

// 详情
export function getThirdDetail(id) {
  return request({
    url: `/third/detail/${id}`,
    method: 'GET'
  })
}

