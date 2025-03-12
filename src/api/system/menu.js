// import request from '@/utils/request'
// import request2 from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'

// 获取菜单下拉树列表
export function getMenuTreeList(params) {
  // return request({
  return edataUserApi({
    url: '/menu/treeselect',
    method: 'get',
    params
  })
}

// 获取菜单下拉树列表(兼容套餐)
export function getMenuAllTreeList(params) {
  // return request({
  return edataUserApi({
    url: '/menu/allTreeselect',
    method: 'get',
    params
  })
}

// 获取菜单列表
export function getMenuList(params) {
  // return request({
  return edataUserApi({
    url: '/menu/list',
    method: 'get',
    params
  })
}

// 获取菜单列表
export function getAllMenuList(params) {
  // return request({
  return edataUserApi({
    url: '/menu/allList',
    method: 'get',
    params
  })
}
// 获取菜单下拉树列表(1.2)
export function getMenuTreeselect(params) {
  // return request({
  return edataUserApi({
    url: '/menu/treeselect/menu',
    method: 'get',
    params
  })
}
// 删除菜单
export function delMenu(menuId) {
  // return request({
  return edataUserApi({
    url: `/menu/${menuId}`,
    method: 'DELETE'
  })
}
// 新增菜单
export function addMenu(data) {
  // return request({
  return edataUserApi({
    url: '/menu',
    method: 'POST',
    data
  })
}
// 修改菜单
export function editMenu(data) {
  // return request({
  return edataUserApi({
    url: '/menu',
    method: 'PUT',
    data
  })
}

// 下载模板员工
export function downLoadUser() {
  // return request({
  return edataUserApi({
    url: '/system/user/download',
    method: 'GET'
  })
}

// 分页查询菜单下角色列表
export function getRolesByMenuId(params) {
  // return request({
  return edataUserApi({
    url: '/menu/rolesByMenuId',
    method: 'GET',
    params
  })
}

// 分页查询菜单下用户列表
export function getUsersByMenuId(params) {
  // return request({
  return edataUserApi({
    url: '/menu/usersByMenuId',
    method: 'GET',
    params
  })
}

// 分页查询菜单下用户列表
export function organizationsByMenuIdApi(params) {
  // return request2({
  return edataUserApi({
    url: '/menu/organizationsByMenuId',
    method: 'GET',
    params
  })
}
// 详情 分页查询菜单下用户列表
export function usersByMenuIdApi(params) {
  // return request2({
  return edataUserApi({
    url: '/menu/usersByMenuId',
    method: 'GET',
    params
  })
}

// 详情 分页查询菜单下角色列表
export function rolesByMenuIdApi(params) {
  // return request2({
  return edataUserApi({
    url: '/menu/rolesByMenuId',
    method: 'GET',
    params
  })
}

