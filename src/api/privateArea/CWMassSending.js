import request from '@/utils/request'

// 分页查询企微群发
export function GetMsgList(data) {
  return request({
    url: '/wechat/msg/page',
    method: 'post',
    data
  })
}

// 取消发送
export function msgCancel(data) {
  return request({
    url: '/wechat/msg/cancel',
    method: 'post',
    data
  })
}

// 立即发送
export function msgSend(data) {
  return request({
    url: '/wechat/msg/send',
    method: 'post',
    data
  })
}

// 重选发送
export function resendMsgSend(data) {
  return request({
    url: '/wechat/msg/resend',
    method: 'post',
    data
  })
}

// 小程序课程列表分页
export function wechatCoursePage(data) {
  return request({
    url: '/wechat/msg/page/live',
    method: 'post',
    data
  })
}

// 群发添加
export function msgAdd(data) {
  return request({
    url: '/wechat/msg/add',
    method: 'post',
    data
  })
}

// 分页查询企微群发消息结果日志
export function wechatMsgResult(data) {
  return request({
    url: '/wechat/msg/page/result',
    method: 'post',
    data
  })
}

// ID查询企微群发消息详情
export function wechatMsgDetail(params) {
  return request({
    url: '/wechat/msg/get/detail',
    method: 'GET',
    params
  })
}

// 编辑企微群发消息
export function wechatMsgEdit(data) {
  return request({
    url: '/wechat/msg/edit',
    method: 'post',
    data
  })
}
