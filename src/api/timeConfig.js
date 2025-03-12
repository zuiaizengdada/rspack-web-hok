import request from '@/utils/request2'

// 获取触达时间配置
export function getReachTimeConfig() {
  return request({
    url: '/cloud/edata-sale/action/config/list',
    method: 'GET'
  })
}

// 设置触达时间配置
export function setReachTimeConfig(data) {
  return request({
    url: '/cloud/edata-sale/action/config/set',
    method: 'POST',
    data
  })
}
