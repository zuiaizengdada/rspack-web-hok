import request from '@/utils/request2'

// 协议管理
export function getProtocolPage(params) {
  return request({
    url: '/cloud/edata-oa/protocol/getProtocolPage',
    method: 'get',
    params
  })
}

// 我的协议
export function getMyProtocolPage(params) {
  return request({
    url: '/cloud/edata-oa/protocol/getMyProtocolPage',
    method: 'get',
    params
  })
}

// 获取协议模版
export function getProtocolTemplate(params) {
  return request({
    url: '/cloud/edata-oa/protocol/template/getProtocolTemplate',
    method: 'get',
    params
  })
}

// 立即签署
export function signProtocol(params) {
  return request({
    url: '/cloud/edata-oa/protocol/signProtocol',
    method: 'get',
    params
  })
}

// 签名回调
export function getProtocolUrl(params) {
  return request({
    url: '/cloud/edata-oa/protocol/getProtocolUrl',
    method: 'get',
    params
  })
}

// 重新发送
export function resendSignProtocolAjax(params) {
  return request({
    url: '/cloud/edata-oa/protocol/resendSignProtocol',
    method: 'get',
    params
  })
}
