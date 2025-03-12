/** 交易管理 */
import request from '@/utils/request'
/** 订单管理 */

/** 获客订单数据 */
export function getOrderHok(params) {
  return request({
    url: '/dashboard/hok',
    method: 'get',
    params
  })
}

/** 同步订单数据 */
export function getOrderSync(params) {
  return request({
    url: '/dashboard/sync',
    method: 'get',
    params
  })
}
/** 第三方订单数据 */
export function getOrderDyKs(params) { // 抖音快收订单数据
  return request({
    url: '/dashboard/third/douyin-kuaishou',
    method: 'get',
    params
  })
}
export function getOrderWdYz(params) { // 微店和有赞订单数据
  return request({
    url: '/dashboard/third/wechat-yz',
    method: 'get',
    params
  })
}
export function getOrderXetSph(params) { // 小鹅通和视频号订单数据
  return request({
    url: '/dashboard/third/xiaoet-sph',
    method: 'get',
    params
  })
}

