import request2 from '@/utils/request2'

/** 谷子订单 */
export function guziOrderList(data) {
  return request2({
    url: '/cloud/edata-order/admin/order/query',
    method: 'post',
    data
  })
}

/** 谷子订单订单详情查询 */
export function guziOrderDetail(params) {
  return request2({
    url: '/cloud/edata-order/admin/order/detail',
    method: 'get',
    params
  })
}

/** 查询用户信息 */
export function queryByAccountOrNames(params) {
  return request2({
    url: '/cloud/edata-customer/admin/guzi/user/queryByAccountOrNames',
    method: 'get',
    params
  })
}
