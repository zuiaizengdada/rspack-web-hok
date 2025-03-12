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

// 查询推送标记状态
export function getTagStatus(params) {
  return request({
    url: '/cloud/open/push/order/tag/status',
    method: 'GET',
    params
  })
}

// 查询收款渠道 new
export function findCollectionList(params) {
  return request({
    url: '/cloud/delivery/paymentChannel/findList',
    method: 'GET',
    params
  })
}

// 分页查询订单认领记录
export function orderclaimrecord(data) {
  return request({
    url: '/cloud/admin/system/order-claim-record/page',
    method: 'POST',
    data
  })
}
// 获取订单认领记录详情
export function orderclaimrecordDetail(id) {
  return request({
    url: `/cloud/admin/system/order-claim-record/${id}`,
    method: 'GET'
  })
}

// 根据认领记录ID审核记录详情
export function orderclaimrecordDetailAudit(id) {
  return request({
    url: `/cloud/admin/system/order-claim-record/audit/list/${id}`,
    method: 'GET'
  })
}

// 根据认领记录ID审核记录详情 审核接口（通过）
export function orderclaimrecordPass(data) {
  return request({
    url: `/cloud/admin/system/order-claim-record/pass`,
    method: 'POST',
    data
  })
}
// 根据认领记录ID审核记录详情 驳回
export function orderclaimrecordReject(data) {
  return request({
    url: `/cloud/admin/system/order-claim-record/reject`,
    method: 'POST',
    data
  })
}

// 查询订单的赠送订单
export function listByGiveParentOrderNo(params) {
  return request({
    url: `/cloud/admin/goods/order/listByGiveParentOrderNo`,
    method: 'GET',
    params
  })
}
