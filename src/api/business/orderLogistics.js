import request from '@/utils/request2'

// 分页查询订单物流
export function getLogisticsPage(data) {
  return request({
    url: `/cloud/delivery/order/logistics/page`,
    method: 'POST',
    data
  })
}

// 查询物流轨迹
export function getLogistics(params) {
  return request({
    url: `/cloud/delivery/order/logistic/detail/query`,
    method: 'GET',
    params
  })
}

// 更新物流
export function getLogisticsPUT(data) {
  return request({
    url: `/cloud/delivery/order/logistics/update`,
    method: 'PUT',
    data
  })
}

// 查询是否启用第三方erp配置
export function getLogisticsEnableSetting(params) {
  return request({
    url: `/cloud/delivery/thirdErp/setting/queryEnableSetting`,
    method: 'GET',
    params
  })
}

// 查询第三方erp配置
export function getLogisticsSetting(params) {
  return request({
    url: `/cloud/delivery/thirdErp/setting/querySetting`,
    method: 'GET',
    params
  })
}

// 查询店铺列表
export function getShopList(data) {
  return request({
    url: `/cloud/admin/shop-receive-config-do/shop/list`,
    method: 'POST',
    data
  })
}

// 编辑店铺配置列表
export function editShopList(data) {
  return request({
    url: `/cloud/admin/shop-receive-config-do/shop/edit`,
    method: 'POST',
    data
  })
}

// 保存-修改第三方erp配置
export function saveLogisticsSetting(data) {
  return request({
    url: `/cloud/delivery/thirdErp/setting/save`,
    method: 'POST',
    data
  })
}
