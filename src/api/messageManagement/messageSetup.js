import request from '@/utils/request'

// 消息设置详情
export function msgSetupDetail(params) {
  return request({
    url: '/sms/settings/get',
    method: 'GET',
    params
  })
}

// 消息设置
export function msgSetupUpdate(data) {
  return request({
    url: '/sms/settings/update',
    method: 'PUT',
    data
  })
}
