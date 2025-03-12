/** 直播交付 */
import request from '@/utils/request'

// 商品模糊查询
export function getGoodsList(params) {
  return request({
    url: '/live/delivery/goods/getByGoodsName',
    method: 'post',
    data: params
  })
}

// 根据商品id查询关联班期
export function getClassDataByGoodId(params) {
  return request({
    url: '/live/delivery/queryClass',
    method: 'get',
    params
  })
}

// 签到
export function singInForData(params) {
  return request({
    url: '/live/delivery/orderClass/signIn/patch',
    method: 'post',
    data: params
  })
}

// 登单新增接口
export function addForOrderClass(params) {
  return request({
    url: '/product/order/add',
    method: 'post',
    data: params
  })
}
// 登单更新接口
export function editForOrderClass(params) {
  return request({
    url: '/product/order/edit',
    method: 'post',
    data: params
  })
}
// 更新订单列表
export function editOrdersNotMy(params) {
  return request({
    url: '/live/delivery/update',
    method: 'post',
    data: params
  })
}
// 根据订单id查询订单信息
export function getMyOrderDetailData(params) {
  return request({
    url: '/product/order/details',
    method: 'GET',
    params
  })
}

// 导出订单
export function exportData(params) {
  return request({
    url: '/live/delivery/export',
    method: 'post',
    data: params
  })
}
// 直播课程列表数据
export function getLiveData (params) {
  return request({
    url: '/live/delivery/page',
    method: 'post',
    data: params
  })
}

// 新增商品设置
export function porductSettingList (params) {
  return request({
    url: '/live/delivery/productSettings/add',
    method: 'post',
    data: params
  })
}

// 查询商品设置列表
export function getSetGoodsList(params) {
  return request({
    url: '/live/delivery/productSettings/getByGoodsName',
    method: 'post',
    data: params
  })
}

// 移除商品设置
export function deleteGoods(params) {
  return request({
    url: '/live/delivery/productSettings/delete/batch',
    method: 'DELETE',
    data: params
  })
}

// 签到接口
export function signinPort(params) {
  return request({
    url: '/live/delivery/orderClass/signIn/patch',
    method: 'post',
    params
  })
}

// 获取班期设置列表
export function getScheduleDataList(params) {
  return request({
    url: '/product/class/condition/query',
    method: 'get',
    params
  })
}

// 新增班期接口
export function addClassSchedule(params) {
  return request({
    url: '/product/class/add',
    method: 'post',
    data: params
  })
}

// 编辑班期接口
export function editClassSchedule(params) {
  return request({
    url: '/product/class/edit',
    method: 'post',
    data: params
  })
}

// 我的直播交付页面列表数据查询
export function myDeliveryPage(params) {
  return request({
    url: '/live/delivery/page/my',
    method: 'post',
    data: params
  })
}
/** 获取目录列表
export function getMaterialList() {
  return request({
    url: '/material/dir/ls',
    method: 'get'
  })
}

export function addMaterial(data) {
  return request({
    url: '/material/dir/mk',
    method: 'POST',
    data
  })
}

export function delMaterial(params) {
  return request({
    url: `/material/dir/rm?dirId=${params}`,
    method: 'DELETE'
  })
}

*/
