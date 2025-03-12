import request from '@/utils/request'
import { edataCustomerAdminApi } from '@/utils/http/index.js'

// 获取直播用户列表接口
export function getUserLiveList(params) {
  return request({
    url: '/user/order/live',
    method: 'GET',
    params
  })
}

// 获取直播专栏列表
export function getLiveList(params, url) {
  return request({
    url,
    method: 'GET',
    params
  })
}

// 获取老师列表
export function getTeachList(url) {
  return request({
    url,
    method: 'GET'
  })
}

// 标记为企业微信已添加
export function addWxuser(userId) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/user/add/corp/${userId}`,
    method: 'PUT'
  })
}
// 标记为企业微信已取消
export function cancelWxuser(userId) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/user/cancel/corp/${userId}`,
    method: 'PUT'
  })
}

// 手动设置添加标志
export function manualUpdate(data) {
  return request({
    url: '/sys-user-friend/manual/update',
    method: 'POST',
    data
  })
}

// 用户列表导出
export function exportOrderLive(params) {
  return request({
    url: '/user/order/live/export',
    method: 'GET',
    params
  })
}
// // 获取部门直播专栏列表
// export function getDeptLiveList(params) {
//   return request({
//     url: '/material/goods/live/dept/list',
//     method: 'GET',
//     params
//   })
// }

// // 获取全部直播专栏列表
// export function getAllLiveList(params) {
//   return request({
//     url: '/material/goods/live/list',
//     method: 'GET',
//     params
//   })
// }

// // 获取我的直播专栏列表
// export function getMyLiveList(params) {
//   return request({
//     url: '/material/goods/live/my/list',
//     method: 'GET',
//     params
//   })
// }

// // 获取部门老师列表
// export function getDeptTeacherList(params) {
//   return request({
//     url: '/head-teacher/list/bydept',
//     method: 'GET',
//     params
//   })
// }

// // 获取全部老师列表
// export function getAllTeacherList(params) {
//   return request({
//     url: '/head-teacher/all',
//     method: 'GET',
//     params
//   })
// }

// // 获取我的老师列表
// export function getMyTeacherList(params) {
//   return request({
//     url: '/head-teacher/my',
//     method: 'GET',
//     params
//   })
// }
