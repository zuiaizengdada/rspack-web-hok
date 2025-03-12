import request from '@/utils/request'

// 分页查询
export function robotPage(params) {
  return request({
    url: '/wx-robot',
    method: 'GET',
    params
  })
}
// 刷新机器人码
export function refreshRobot(params) {
  return request({
    url: `/wx-robot/refresh/qrcode/robot/${params}`,
    method: 'GET'
  })
}

