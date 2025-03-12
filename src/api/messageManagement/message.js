import request from '@/utils/request'

// 分页查询
export function messagePage(params) {
  return request({
    url: '/pf/message/page',
    method: 'GET',
    params
  })
}

// 答复留言
export function replyMessage(data) {
  return request({
    url: '/pf/message/reply',
    method: 'POST',
    data
  })
}

// 批量删除留言
export function deleteMessage(data) {
  return request({
    url: '/pf/message/delete/batch',
    method: 'DELETE',
    data
  })
}
// 评价列表
export function evaluatePage(params) {
  return request({
    url: '/evaluate/page',
    method: 'get',
    params
  })
}

// 评价推荐 0.未推荐(普通) 1.推荐
export function setEvaluateRecommend(data) {
  return request({
    url: '/evaluate/recommend',
    method: 'POST',
    data
  })
}

// 审核 1.未审核 2.审核通过 3.审核未通过
export function setEvaluateProcess(data) {
  return request({
    url: '/evaluate/auditor/process',
    method: 'POST',
    data
  })
}
