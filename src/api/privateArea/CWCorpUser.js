import request from '@/utils/request'

// 分页查询
export function corpUsertPage(params) {
  return request({
    url: '/corp-user',
    method: 'GET',
    params
  })
}

// 分页查询企业配置
export function corpSettingPage(data) {
  return request({
    url: '/corp-setting/page',
    method: 'post',
    data
  })
}
// 初始化企业用户
export function corpSettingInitDeptAndUser(data) {
  return request({
    url: '/corp-setting/initDeptAndUser',
    method: 'post',
    data
  })
}

// 更新用户信息
export function corpUser(data) {
  return request({
    url: '/corp-user',
    method: 'post',
    data
  })
}

// 获取机器人登录码
export function getRobotCode(params) {
  return request({
    url: '/wx-robot/login/url',
    method: 'GET',
    params
  })
}

// 机器人码解绑
export function setRobotLogout(params) {
  return request({
    url: '/wx-robot/logout',
    method: 'GET',
    params
  })
}

// 刷新机器人码
export function refreshRobot(params) {
  return request({
    url: `/wx-robot/refresh/qrcode/${params}`,
    method: 'GET'
  })
}

