import request from '@/utils/request'

// 分页查询企业配置
export function GetCorpList(data) {
  return request({
    url: '/corp-setting/page',
    method: 'post',
    data
  })
}

// 添加企业配置
export function addCorp(data) {
  return request({
    url: '/corp-setting',
    method: 'post',
    data
  })
}
// 更新企业配置
export function updateCorp(data) {
  return request({
    url: '/corp-setting',
    method: 'PUT',
    data
  })
}
// 初始化企业用户

// 删除企业配置

// 查询企业用户分页

// 获取微信用户信息
