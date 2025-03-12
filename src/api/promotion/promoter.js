import request from '@/utils/request2'

// / 获取推广员列表
export function promoterPage(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/page',
    method: 'post',
    data
  })
}

// 添加推广员
export function addPromoter(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/add',
    method: 'POST',
    data
  })
}

// 推广员审核通过
export function passPromoter(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/audit/pass',
    method: 'POST',
    data
  })
}

// 推广员审核拒绝
export function rejectPromoter(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/audit/rejection',
    method: 'POST',
    data
  })
}

// 推广员审核批量通过
export function passPromoterBatch(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/audit/pass/batch',
    method: 'POST',
    data
  })
}

// 推广员审核批量拒绝
export function rejectPromoterBatch(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/audit/rejection/batch',
    method: 'POST',
    data
  })
}

// 失效推广员恢复正常
export function availablePromoter(id) {
  return request({
    url: `/cloud/promotion/v1/promoter/available/${id}`,
    method: 'post'
  })
}
// 获取推广统计
export function prompterStatisics(params) {
  return request({
    url: '/cloud/promotion/v1/promoter/customer/statistics',
    method: 'get',
    params
  })
}
// 获取用户推广统计
export function userPropterStatisics(data) {
  return request({
    url: '/cloud/promotion/v1/promoter/customer/statistics/user',
    method: 'post',
    data
  })
}

// 推广员失效
export function unavailablePropter(id) {
  return request({
    url: `/cloud/promotion/v1/promoter/unavailable/${id}`,
    method: 'POST'
  })
}

export function promotionGoodsPage(data) {
  return request({
    url: '/cloud/promotion/v1/promotionGoods/page',
    method: 'post',
    data
  })
}
// 新增推广商品
export function promotionGoodsSave(data) {
  return request({
    url: '/cloud/promotion/v1/promotionGoods/save/batch',
    method: 'post',
    data
  })
}
// 修改推广商品
export function promotionGoodsUpdate(data) {
  return request({
    url: '/cloud/promotion/v1/promotionGoods/update',
    method: 'put',
    data
  })
}
// 删除推广商品
export function promotionGoodsDel(params) {
  return request({
    url: `/cloud/promotion/v1/promotionGoods/delete/${params}`,
    method: 'DELETE'
  })
}
// 获取推广记录
export function getPromoteRecordPage(data) {
  return request({
    url: '/cloud/promotion/v1/promote/record/page',
    method: 'post',
    data
  })
}

// 获取存在的推广商品
export function promotionGoodsExists(params) {
  return request({
    url: '/cloud/promotion/v1/promotionGoods/exists',
    method: 'GET',
    params
  })
}
