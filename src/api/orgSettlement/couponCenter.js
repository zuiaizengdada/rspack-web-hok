// import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 新增-修改优惠券 */
export function addOrUpdateCouponInfoApi(data) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/addOrUpdateCouponInfo',
    method: 'post',
    data
  })
}
/** 优惠券类型（种类） */
export function couponTypesApi(params) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/couponTypes',
    method: 'get',
    params
  })
}
/** 优惠券优惠方式 */
export function discountMethodsApi(params) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/discountMethods',
    method: 'get',
    params
  })
}
/** 查询优惠券详情 */
export function getCouponInfoDetailApi(params) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/getCouponInfoDetail',
    method: 'get',
    params
  })
}
/** 发放优惠券 */
export function grantCouponApi(params) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/grantCoupon',
    method: 'get',
    params
  })
}
/** 分页查询优惠券列表 */
export function pageListCouponInfosApi(data) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/pageListCouponInfos',
    method: 'post',
    data
  })
}

// 优惠券审核相关
/** 审核通过 */
export function auditPassedApi(data) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/audit/passed',
    method: 'post',
    data
  })
}
/** 审核驳回 */
export function auditRejectionApi(data) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/audit/rejection',
    method: 'post',
    data
  })
}
/** 发放优惠券 */
export function qryAuditRecordsApi(params) {
  return request2({
    url: '/cloud/coupon-center/business/coupon/audit/qryAuditRecords',
    method: 'get',
    params
  })
}
