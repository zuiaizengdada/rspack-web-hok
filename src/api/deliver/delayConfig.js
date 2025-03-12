import request from '@/utils/request2'

// 获取交付延期配置
export function getDeliveryDelayConfig() {
  return request({
    url: '/cloud/delivery/delayConfig/get',
    method: 'GET'
  })
}

// 设置交付延期配置
export function setDeliveryDelayConfig(data) {
  return request({
    url: '/cloud/delivery/delayConfig/set',
    method: 'POST',
    data
  })
}
