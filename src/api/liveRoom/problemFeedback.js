import request from '@/utils/request2'

// 问题反馈列表查询
export function getQuestionFeedbackPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/questionFeedback/page',
    method: 'POST',
    data
  })
}

// 问题反馈详情
export function getQuestionFeedbackDetail(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/questionFeedback/info',
    method: 'GET',
    params
  })
}

// 处理反馈详情
export function editQuestionFeedback(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/questionFeedback/handle',
    method: 'POST',
    data
  })
}
