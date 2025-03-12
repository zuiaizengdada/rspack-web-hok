import qs from 'qs'
/** 搜索管理 */
import request from '@/utils/request'
import request2 from '@/utils/request2'

// 分页查询
export function getSearchList(params) {
  return request({
    url: '/shop/third/page',
    method: 'get',
    params
  })
}
// 查询店铺详情
export function getThirdDetail(params) {
  return request({
    url: `/shop/third/detail/${params}`,
    method: 'get',
    params
  })
}

// 新增店铺
export function addThirdShop(data) {
  return request({
    url: '/shop/third/save',
    method: 'post',
    data
  })
}

// 修改店铺信息
export function editThirdShop(data) {
  return request({
    url: '/shop/third/update',
    method: 'put',
    data
  })
}

// 批量删除店铺
export function delThirdShop(data) {
  return request({
    url: `/shop/third/delete/batch`,
    method: 'DELETE',
    data
  })
}

// 三方商品核对分页
export function getGoodsThirdCheckPage(params) {
  return request({
    url: '/goods/third/check/page',
    method: 'get',
    params
  })
}

// 删除三方核对商品
export function delThirdCheck(data) {
  return request({
    url: '/goods/third/third/batch',
    method: 'POST',
    data
  })
}

// 导出三方核对商品
export function exportThirdCheck(params) {
  return request({
    url: '/goods/third/export',
    method: 'GET',
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 批量上下架店铺
export function shopThirdShelveBatch(data) {
  return request({
    url: '/shop/third/shelve/batch',
    method: 'DELETE',
    data
  })
}

// 申请额度已审核【订单解密】
export function shopThirdApplyByShopId(shopId) {
  return request({
    url: `/shop/third/apply/${shopId}`,
    method: 'PUT'
  })
}

// 查询来源渠道
export function selectThridShopChannelData(params) {
  return request({
    url: '/shop/third/channel/select',
    method: 'get',
    params
  })
}

// 保存或更新机构推送配置
export function pushConfig(data) {
  return request2({
    url: '/cloud/admin/admin/shop/third/push/save',
    method: 'post',
    data
  })
}

// 根据租户ID查询推送配置
export function getPushConfigByTenantId() {
  return request2({
    url: '/cloud/admin/admin/shop/third/push/tenant',
    method: 'get'
  })
}

// 测试推送
export function testPush(data) {
  return request2({
    url: '/cloud/open/open/webhook/test/push',
    method: 'post',
    data
  })
}

// 根据店铺ID获取配置
export function getByShopId(params) {
  return request2({
    url: '/cloud/admin/shop-receive-config-do/getByShopId',
    method: 'get',
    params
  })
}
