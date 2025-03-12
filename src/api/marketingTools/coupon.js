import request from '@/utils/request2'
// 查询商品信息
export function getGoodsDataForCoupon(params) {
  return request({
    url: '/cloud/admin/material/goods/coupon/pageListCouponMaterialGoods',
    method: 'POST',
    data: params
  })
}

// 新增及修改优惠券
export function addOrUpdateCouponInfo(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/addOrUpdateCouponInfo',
    method: 'POST',
    data: params
  })
}

// 分页查询优惠券
export function getCouponByPage(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/pageListCouponInfos',
    method: 'post',
    data: params
  })
}

// 分页查询优惠券审核信息
export function getCouponAuditPage(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/pageListAuditCoupons',
    method: 'POST',
    data: params
  })
}

// 作废优惠券
export function couponDiscard(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/discard',
    method: 'POST',
    params
  })
}

// 券种明细列表数据查询
export function couponTypePage(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/type/page',
    method: 'get',
    params
  })
}

// 优惠券使用明细数据查询
export function getUsedDataPage(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/use/detail/page',
    method: 'get',
    params
  })
}

// 券种明细列表导出
export function toExportCoupon(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/type/export',
    method: 'get',
    params
  })
}

// 使用明细导出
export function toExportUsedData(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/use/detail/export',
    method: 'get',
    params
  })
}

// 优惠券详情接口
export function getCouponInfoDetail(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/getCouponInfoDetail',
    method: 'post',
    data: params
  })
}

// 优惠券初审通过
export function couponReviewOrPass(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/preliminary/review/passed',
    method: 'post',
    data: params
  })
}

// 优惠券初审驳回
export function couponPreliminary(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/preliminary/rejection',
    method: 'post',
    data: params
  })
}

// 复审通过
export function auditorReviewerApproved(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/reviewed/approved',
    method: 'post',
    data: params
  })
}

// 复审驳回
export function reexaminationRejection(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/reexamination/rejection',
    method: 'post',
    data: params
  })
}

// 数据看板数据接口查询
export function couponDataBoard(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/board',
    method: 'get',
    params
  })
}

// 数据看板数据接口折线图查询
export function boardForLine(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/board/fold/line',
    method: 'get',
    params
  })
}

// 优惠券的审核信息查询
export function searchAuditRecords(params) {
  return request({
    url: '/cloud/coupon-center/coupon/auditor/qryAuditRecords',
    method: 'get',
    params
  })
}

//  使用明细列表
export function couponShare(params) {
  return request({
    url: '/cloud/coupon-center/coupon/data/use/detail/page',
    method: 'get',
    params
  })
}

//  生成分享链接
export function buildShareUrl(params) {
  return request({
    url: '/cloud/coupon-center/couponInfo/buildShareUrl',
    method: 'get',
    params
  })
}
