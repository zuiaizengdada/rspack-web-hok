import request from '@/utils/request'

// 外呼渠道公司发送的记录
export function recallPage(params) {
  return request({
    url: '/recall/provider/api/call/page',
    method: 'GET',
    params
  })
}

// 客服话术配置
export function recallMsgConfig(data) {
  return request({
    url: '/recall/msg/config',
    method: 'POST',
    data
  })
}

// 客服话术配置详情
export function recallMsgDetail(params) {
  return request({
    url: '/recall/msg/detail',
    method: 'GET',
    params
  })
}

// 客服话术配置标签分页列表
export function recallMsgLabelPage(params) {
  return request({
    url: '/recall/msg/label/page',
    method: 'GET',
    params
  })
}

// 外部提供方分页查询
export function recallProviderPage(params) {
  return request({
    url: '/recall/provider/page',
    method: 'GET',
    params
  })
}
// 外呼渠道名称列表
export function getRecallProviderList(params) {
  return request({
    url: '/recall/provider/list',
    method: 'GET',
    params
  })
}

// 导出
export function exportCallProvider(params) {
  return request({
    url: '/recall/provider/api/call/export',
    method: 'GET',
    params
  })
}
