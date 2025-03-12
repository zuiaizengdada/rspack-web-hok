import request2 from '@/utils/request2'
import request from '@/utils/request'
import { edataUserApi, edataCustomerAdminApi } from '@/utils/http/index.js'

export function clueGetPhone(clueId) {
  return request2({
    url: `/cloud/edata-sale/clue/phone/get/${clueId}`,
    method: 'post'
  })
}

export function getClueStudentPhone(clueId) {
  return request2({
    url: `/cloud/edata-sale/undertake/clue/student/phone/${clueId}`,
    method: 'GET'
  })
}
export function getClueLinkPhone(clueId) {
  return request2({
    url: `/cloud/edata-sale/hk/link/show/phone/${clueId}`,
    method: 'GET'
  })
}

// 根据线索Id获取微信备注名
export function getLivePhone(clueId) {
  return request2({
    url: `/cloud/edata-sale/clue/livePhone/get/${clueId}`,
    method: 'POST'
  })
}

export function taskGetPhone(id) {
  return request2({
    url: `/cloud/edata-sale/sale/task/offline/phone/get/${id}`,
    method: 'post'
  })
}
export function userGetPhone(userId) {
  // return request2({
  return edataCustomerAdminApi({
    url: `/pf/user/phone/detail/${userId}`,
    method: 'get'
  })
}
export function platformUserGetPhone(platformUserId) {
  // return request2({
  return edataCustomerAdminApi({
    url: `/pf/user/phone/detailByPlatformUserId/${platformUserId}`,
    method: 'get'
  })
}
export function systemGetPhone(userId) {
  // return request2({
  return edataUserApi({
    url: `/system/user/phone/detail/${userId}`,
    method: 'get'
  })
}
export function smsGetPhone(params) {
  return request2({
    url: `/cloud/edata-message/sms-send-log/get/phone`,
    method: 'get',
    params
  })
}

export function recordGetPhone(params) {
  return request2({
    url: `/cloud/edata-cms/phone/record/detail`,
    method: 'get',
    params
  })
}

export function deliveryGetPhone(shiftId) {
  return request2({
    url: `/cloud/delivery/delivery-shift/phone/detail/${shiftId}`,
    method: 'get'
  })
}

export function deliveryDetailsGetPhone(params) {
  return request2({
    url: `/cloud/delivery/delivery-shift/getDetails`,
    method: 'get',
    params
  })
}

export function getDecryptByUser(params) {
  return request2({
    url: '/cloud/edata-customer/admin/pf/user/decryptByUserId',
    method: 'GET',
    params
  })
}

export function getEmailByXsuo(clueId) {
  return request2({
    url: `/cloud/edata-sale/clue/email/get/${clueId}`,
    method: 'post'
  })
}

export function getEmailByUser(platformUserId) {
  return request2({
    url: `/cloud/edata-customer/admin/pf/user/mail/detailByPlatformUserId/${platformUserId}`,
    method: 'GET'
  })
}

export function getReceiverPhone(orderNo) {
  return request({
    url: `/goods/order/sale/feign/getReceiverPhone/${orderNo}`,
    method: 'GET'
  })
}

export function getHighSeasClue(clueId) {
  return request2({
    url: `/cloud/edata-sale/highSeasClue/phone/get/${clueId}`,
    method: 'post'
  })
}
