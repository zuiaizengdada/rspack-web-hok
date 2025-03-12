// import request from '@/utils/request'
import { edataCustomerAdminApi } from '@/utils/http/index.js'

// 员工管理
// 分页查询
export function GetList(params) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/label/page',
    method: 'get',
    params
  })
}
// 新增
export function Add(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/label',
    method: 'post',
    data
  })
}
// 批量删除
export function DelBatch(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/label/delete/batch',
    method: 'DELETE',
    data
  })
}
// 修改
export function Edit(data) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/label`,
    method: 'PUT',
    data
  })
}
