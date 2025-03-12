import request from '@/utils/request2'

// 新增推送标记
export function addPushOrderTag(data) {
  return request({
    url: '/cloud/open/push/order/tag/add',
    method: 'POST',
    data
  })
}

// 查询推送需要标记订单名称列表
export function getOrderTagList(params) {
  return request({
    url: '/cloud/open/push/order/tag/list',
    method: 'GET',
    params
  })
}

// 推荐标记状态修改
export function editOrderTagModified(params) {
  return request({
    url: '/cloud/open/push/order/tag/modified',
    method: 'GET',
    params
  })
}

// 删除推送标记
export function removeOrderTag(params) {
  return request({
    url: '/cloud/open/push/order/tag/remove',
    method: 'GET',
    params
  })
}

export function removeBatch(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/Condition/batch/remove',
    method: 'DELETE',
    data
  })
}

// 查询推送标记状态
export function getTagStatus(params) {
  return request({
    url: '/cloud/open/push/order/tag/status',
    method: 'GET',
    params
  })
}

// 获取第三方店铺下拉框接口
export function getThirdShopSelect() {
  return request({
    url: '/cloud/admin/shop/third/select',
    method: 'GET'
  })
}

// 获取第三方店铺下拉框接口
export function getThirdShopSelectAll() {
  return request({
    url: '/cloud/admin/shop/third/select/all',
    method: 'GET'
  })
}
