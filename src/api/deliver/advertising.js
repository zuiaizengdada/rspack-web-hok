import request from '@/utils/request2'

// 游客订单详情
export function visitorOrderPage(params) {
  return request({
    url: `/cloud/ad/visitor-order/page`,
    method: 'GET',
    params
  })
}

// 游客订单详情
export function visitorOrderDetail(visitorOrderId) {
  return request({
    url: `/cloud/ad/visitor-order/detail/${visitorOrderId}`,
    method: 'GET'
  })
}

// 获取投放平台下拉列表
export function getAdPlatformSimpleList() {
  return request({
    url: `/cloud/ad/ad-platform/simple/list`,
    method: 'GET'
  })
}

// 完善手机号码
export function completeVisitorPhone(data) {
  return request({
    url: '/cloud/ad/visitor-order/complete/phone',
    method: 'POST',
    data
  })
}

// 获取完善详情
export function getCompleteDetail(completeId) {
  return request({
    url: `/cloud/ad/visitor-order/complete/detail/${completeId}`,
    method: 'GET'
  })
}

// 获取绑定手机号
export function getBindPhoneCode(params) {
  return request({
    url: '/cloud/ad/visitor-order/bind/phone/code',
    method: 'GET',
    params
  })
}
