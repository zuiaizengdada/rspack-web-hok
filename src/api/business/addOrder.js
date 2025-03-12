import request from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'

// 分页投放账号查询
export function getDeptAndChildren() {
  // return request({

  return edataUserApi({
    url: `/system/user/isBsDept`,
    method: 'GET'
  })
}

export function getDepositGoods() {
  return request({
    url: '/cloud/admin/material/goods/wallet/deposit/goods',
    method: 'get'
  })
}

export function getPhoneAreaCodes() {
  return request({
    url: '/cloud/edata-message/sms-area-code-do/sms/groupBySmsAreaCodes',
    method: 'get'
  })
}

export function getQueryMoneyByPhone(params) {
  return request({
    url: '/cloud/admin/user/wallet/queryByPhone',
    method: 'post',
    data: params
  })
}

export function taskSelect(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/select',
    method: 'get',
    params
  })
}
