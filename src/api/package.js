// import request from '@/utils/request'
import request3 from '@/utils/request3'
import { edataUserApi } from '@/utils/http/index.js'

// 查询套餐列表
export function listPackagesApi(data) {
  return request3({
    url: '/cloud/edata-user/sys-package/pageListPackages',
    method: 'post',
    data
  })
}

// 添加-修改套餐
export function editPackageApi(params) {
  return request3({
    url: '/cloud/edata-user/sys-package/editPackage',
    method: 'post',
    data: params
  })
}

// 添加-修改套餐
export function delPackageApi(params) {
  return request3({
    url: '/cloud/edata-user/sys-package/delPackage',
    method: 'post',
    data: params
  })
}

// 加载对应套餐菜单列表树
export function packageMenuTreeselectApi(packageId) {
  // return request({
  return edataUserApi({
    url: `/menu/packageMenuTreeselect/${packageId}`,
    method: 'get'
  })
}

// 编辑套餐关联的菜单
export function editPackageMenusApi(data) {
  // return request({
  return edataUserApi({
    url: '/menu/editPackageMenus',
    method: 'post',
    data
  })
}

// 加载对应菜单列表树
export function mnuTreeApi(params) {
  // return request({
  return edataUserApi({
    url: `/menu/allTreeselect`,
    method: 'GET',
    params
  })
}
//
export function organizationPageApi(params) {
  return request3({
    url: `/cloud/edata-user/organization/page`,
    method: 'GET',
    params
  })
}
