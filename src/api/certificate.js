import request from '@/utils/request2'

// 创建证书
export function createCertificate(data) {
  return request({
    url: '/cloud/delivery/certificate',
    method: 'post',
    data
  })
}

// 更新证书
export function updateCertificate(data) {
  return request({
    url: '/cloud/delivery/certificate',
    method: 'put',
    data
  })
}

// 更新证书状态
export function updateCertificateStatus(id, params) {
  return request({
    url: `/cloud/delivery/certificate/status/${id}`,
    method: 'put',
    params
  })
}

// 获取证书详情
export function getCertificateDetail(id) {
  return request({
    url: `/cloud/delivery/certificate/${id}`,
    method: 'get'
  })
}

// 获取证书背景图列表
export function getCertificateBgList() {
  return request({
    url: '/cloud/delivery/image/info/page',
    method: 'get'
  })
}
// 分页查询证书
export function pageCertificate(params) {
  return request({
    url: '/cloud/delivery/certificate/page',
    method: 'get',
    params
  })
}

// 删除证书
export function delCertificate(id) {
  return request({
    url: `/cloud/delivery/certificate/${id}`,
    method: 'DELETE'
  })
}
