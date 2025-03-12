import { edataUserApi } from '@/utils/http/index.js'
import request from '@/utils/request'

// 员工管理
// 分页查询
export function GetList(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/page',
    method: 'get',
    params
  })
}
// 新增
export function Add(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}
// 批量删除
export function DelBatch(data) {
  // return request({
  return edataUserApi({
    url: '/system/user/delete/batch',
    method: 'post',
    data
  })
}
// 禁用或启用
export function Disable(userId, data) {
  // return request({
  return edataUserApi({
    url: `/system/user/disable/${userId}`,
    method: 'post',
    data
  })
}
// 修改
export function Edit(data) {
  return request({
    url: `/system/user`,
    method: 'PUT',
    data
  })
}
// 重置密码
export function resetPwd(data) {
  // return request({
  return edataUserApi({
    url: '/system/user/resetPwd',
    method: 'PUT',
    data
  })
}

