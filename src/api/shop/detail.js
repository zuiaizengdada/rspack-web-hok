/** 搜索管理 */
import request from '@/utils/request'

// 通过id查询店铺信息
export function getDetailList(id) {
  return request({
    url: `/shop/third/detail/${id}`,
    method: 'get'
  })
}

// 通过id查询店铺信息
export function getDetailDataList(params) {
  return request({
    url: `/goods/after/sale/goods/page`,
    method: 'get',
    params
  })
}

// 详情
export function materialDetail(goodsId) {
  return request({
    url: `/material-sale-info/detail/${goodsId}`,
    method: 'get'
  })
}
