import request from '@/utils/request2'

//  详情
export function saleTaskConfigDetail(params) {
  return request({
    url: '/cloud/edata-sale/sale-task-dispatch-config/detail',
    method: 'get',
    params
  })
}

//  设置接量方式
export function saleTaskConfigSetting(data) {
  return request({
    url: '/cloud/edata-sale/sale-task-dispatch-config/setting',
    method: 'post',
    data
  })
}
