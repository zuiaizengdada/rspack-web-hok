import request from '@/utils/request2'

// 获取短信签名
export function getSmsSignature(params) {
  return request({
    url: '/cloud/edata-sale/sms/signature/page',
    method: 'GET',
    params
  })
}

// 新增短信签名
export function addSmsSignature(data) {
  return request({
    url: '/cloud/edata-sale/sms/signature/add',
    method: 'POST',
    data
  })
}

// 删除短信签名
export function deleteSmsSignature(id) {
  return request({
    url: `/cloud/edata-sale/sms/signature/delete/${id}`,
    method: 'DELETE'
  })
}
