/** 文件上传 */
import request from '@/utils/request'
// import request2 from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'

/** 首页信息查询 */
export function homeList() {
  return request({
    url: '/system/index/list',
    method: 'get'
  })
}

/** 支付榜单top5 */
export function homepayTop() {
  return request({
    url: '/system/index/top',
    method: 'get'
  })
}

/** 查询用户的首页快捷菜单 */
export function userSysShortcutMenus(params) {
  // return request2({
  return edataUserApi({
    url: '/shortcut-menu/userIndexPageSysShortcutMenus',
    method: 'get',
    params
  })
}
/** 查询用户的分类快捷菜单 */
export function userSysShortcutCategoryMenusApi() {
  // return request2({
  return edataUserApi({
    url: '/shortcut-menu/userSysShortcutCategoryMenus',
    method: 'get'
  })
}

/** 添加用户的首页快捷菜单 / 快捷菜单模块 */
export function addUserSysShortcutMenusApi(data) {
  // return request2({
  return edataUserApi({
    url: '/shortcut-menu/addUserSysShortcutMenus',
    method: 'POST',
    data
  })
}
/** 删除用户的快捷菜单 */
export function delUserSysShortcutMenuCategoryApi(data) {
  // return request2({
  return edataUserApi({
    url: '/shortcut-menu/delUserSysShortcutMenuCategory',
    method: 'POST',
    data
  })
}
/** 置顶用户的快捷菜单 */
export function topUserSysShortcutMenuCategoryApi(data) {
  // return request2({
  return edataUserApi({
    url: '/shortcut-menu/topUserSysShortcutMenuCategory',
    method: 'POST',
    data
  })
}

