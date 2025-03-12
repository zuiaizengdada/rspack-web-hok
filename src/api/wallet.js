import request from '@/utils/request'

export function walletList(data) {
  return request({
    url: '/wallet/list',
    method: 'post',
    data
  })
}

export function walletSummary(params) {
  return request({
    url: '/wallet/operate/summary',
    method: 'get',
    params
  })
}

export function walletOperate(data) {
  return request({
    url: '/wallet/operate',
    method: 'post',
    data
  })
}

export function walletMyBalance(params) {
  return request({
    url: '/wallet/pf/user/balance',
    method: 'get',
    params
  })
}
