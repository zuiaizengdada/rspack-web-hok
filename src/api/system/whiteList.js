import request from '@/utils/request2'

// 校验验证码
export function checkCode(params) {
  return request({
    url: '/cloud/msg/msg/white/config/checkCode',
    method: 'get',
    params
  })
}

// 获取白名单列表
export function getMsgWhiteList(params) {
  return request({
    url: '/cloud/edata-message/msg/white/config/getMsgWhiteList',
    method: 'get',
    params
  })
}

// 新增和修改白名单
export function addWhiteList(data) {
  return request({
    url: '/cloud/edata-message/msg/white/config/addMsgWhite',
    method: 'post',
    data
  })
}

// 删除白名单
export function delWhiteList(data) {
  return request({
    url: '/cloud/edata-message/msg/white/config/delMsgWhite',
    method: 'post',
    data
  })
}

// 发送短信
export function sendMag(params) {
  return request({
    url: '/cloud/msg/msg/white/config/sendMag',
    method: 'get',
    params
  })
}

// 更新白名单状态
export function updateStatus(params) {
  return request({
    url: '/cloud/msg/msg/white/config/updateStatus',
    method: 'put',
    params
  })
}

