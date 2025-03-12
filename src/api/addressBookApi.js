import request from '@/utils/request'
import { edataUserApi } from '@/utils/http/index.js'

export function orgTree(data) {
  return request({
    url: 'http://localhost:9528/mock/getOrgTree',
    method: 'post',
    data
  })
}

// 获取部门下拉树列表
export function deptTree(params) {
  // return request({
  return edataUserApi({
    url: '/dept/tree',
    method: 'get',
    params
  })
}

// 不分页查询员工列表
export function userNoPage(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/list',
    method: 'GET',
    params
  })
}

// 分页查询员工列表
export function userPage(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/page',
    method: 'get',
    params
  })
}

// 分页查询员工列表
export function getUserPage(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/public/page',
    method: 'get',
    params
  })
}

// 新增员工
export function addUser(data) {
  // return request({
  return edataUserApi({
    url: '/system/user',
    method: 'POST',
    data
  })
}
// 修改员工
export function editUser(data) {
  // return request({
  return edataUserApi({
    url: '/system/user',
    method: 'PUT',
    data
  })
}

// 新增部门
export function addDept(data) {
  // return request({
  return edataUserApi({
    url: '/dept',
    method: 'post',
    data
  })
}

// 批量禁用/启用用户
export function disable(data) {
  // return request({
  return edataUserApi({
    url: '/system/user/disable/batch',
    method: 'POST',
    data
  })
}
// 批量删除用户
export function delUser(data) {
  // return request({
  return edataUserApi({
    url: '/system/user/delete/batch',
    method: 'POST',
    data
  })
}

// 删除部门
export function delDept(deptId) {
  // return request({
  return edataUserApi({
    url: `/dept/${deptId}`,
    method: 'DELETE'
  })
}
// 修改部门
export function editDept(data) {
  // return request({
  return edataUserApi({
    url: '/dept',
    method: 'PUT',
    data
  })
}

// 获取部门列表(搜索用)
export function getDeptList(params) {
  // return request({
  return edataUserApi({
    url: '/dept/list',
    method: 'get',
    params
  })
}

// 获取部门详细信息
export function getDeptDetail(deptId) {
  // return request({
  return edataUserApi({
    url: `/dept/${deptId}`,
    method: 'GET'
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

// 获取关注公众号二维码
export function getCodeUrl(userId) {
  return request({
    url: `/wx-official/token/${userId}`,
    method: 'GET'
  })
}

// 解除绑定公众号
export function unBind(userId) {
  // return request({
  return edataUserApi({
    url: `/system/user/un/bind/${userId}`,
    method: 'POST'
  })
}

// 获取用户绑定信息
export function getUserDetail(userId) {
  // return request({
  return edataUserApi({
    url: `/system/user/detail/${userId}`,
    method: 'POST'
  })
}

// 用户详情查询
export function getUserDetailAjax(params) {
  // return request({
  return edataUserApi({
    url: `/system/user/detail`,
    method: 'get',
    params
  })
}

// 已删除员工分页查询
export function delPage(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/delPage',
    method: 'get',
    params
  })
}
