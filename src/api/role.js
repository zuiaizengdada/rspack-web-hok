// import request from '@/utils/request'
import { edataUserApi } from '@/utils/http/index.js'

// export function getRoutes() {
//   return request({
//     url: '/vue-element-admin/routes',
//     method: 'get'
//   })
// }

// export function getRoles() {
//   return request({
//     url: '/vue-element-admin/roles',
//     method: 'get'
//   })
// }

// export function addRole(data) {
//   return request({
//     url: '/vue-element-admin/role',
//     method: 'post',
//     data
//   })
// }

// export function updateRole(id, data) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'put',
//     data
//   })
// }

// export function deleteRole(id) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'delete'
//   })
// }

export function getRoleOptions(params) {
  // return request({
  return edataUserApi({
    url: '/role/select',
    method: 'get',
    params
  })
}

// 批量调整部门
export function setDeptA(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/batchUpdateDept',
    method: 'post',
    data: params
  })
}

// 批量设置角色
export function setRole(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/batchUpdateRole',
    method: 'post',
    data: params
  })
}

// 角色中删除用户
export function moveUser(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/batchDeleteRole',
    method: 'post',
    data: params
  })
}

// 根据角色id查询该角色下所有的用户
export function getAllUserByRoleId(id) {
  // return request({
  return edataUserApi({
    url: `/role/getUserByRoleId?roleId=${id}`,
    method: 'get'
  })
}

// 根据角色id进行批量用户添加
export function setAllUserByRoleId(params) {
  // return request({
  return edataUserApi({
    url: '/system/user/batchAddRole',
    method: 'post',
    data: params
  })
}
