// import request from '@/utils/request'
import { edataUserApi } from '@/utils/http/index.js'

// 分页查询角色信息
export function getRoleList(params) {
  // return request({
  return edataUserApi({
    url: '/role/page',
    method: 'get',
    params
  })
}
// 删除角色
export function delRole(roleIds) {
  // return request({
  return edataUserApi({
    url: `/role/${roleIds}`,
    method: 'DELETE'
  })
}
// 修改角色
export function editRole(data) {
  // return request({
  return edataUserApi({
    url: '/role',
    method: 'put',
    data
  })
}
// 根据角色编号获取详细信息
export function roleInfoById(roleId) {
  // return request({
  return edataUserApi({
    url: `/role/${roleId}`,
    method: 'get'
  })
}
// 新增角色
export function addRole(data) {
  // return request({
  return edataUserApi({
    url: '/role',
    method: 'POST',
    data
  })
}
// 加载对应角色菜单列表树
export function getRoleMenuTree(roleId) {
  // return request({
  return edataUserApi({
    url: `/menu/roleMenuTreeselect/${roleId}`,
    method: 'GET'
  })
}

// 获取菜单下拉树列表
export function getMenuTree() {
  // return request({
  return edataUserApi({
    url: '/menu/treeselect',
    method: 'get'
  })
}

// 获取角色下人员列表
export function getRoleUserList(params) {
  // return request({
  return edataUserApi({
    url: '/role/user/page',
    method: 'get',
    params
  })
}
