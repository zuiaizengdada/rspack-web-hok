import request from '@/utils/request'
import request2 from '@/utils/request2'

export function dictType(dictType) {
  return request({
    url: `/sys/dict/type/${dictType}`,
    method: 'get'
  })
}

// 获取渠道(机构)
export function getChannelSource() {
  return request({
    url: '/goods/order/getChannelSource',
    method: 'get'
  })
}

// 2023.8.30 获取渠道机构（整合成tree数据结构的接口）
export function getNewChannelSource() {
  return request({
    url: '/goods/order/getChannelSource',
    method: 'get'
  })
}

// 2024.1.13 三方店铺数据
export function getThridShopData() {
  return request2({
    url: '/cloud/center/channel/goodsThirdChannelJsonObjects',
    method: 'get'
  })
}
