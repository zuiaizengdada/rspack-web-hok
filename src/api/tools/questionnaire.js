import request from '@/utils/request'

// 问卷列表
export function getQuestionnaireList(params) {
  return request({
    url: '/questionnaire/list',
    method: 'get',
    params
  })
}

// 问卷新建
export function addQuestionnaire(data) {
  return request({
    url: '/questionnaire',
    method: 'post',
    data
  })
}
// 问卷启用禁用
export function editQuestionnaire(params) {
  return request({
    url: '/questionnaire/status',
    method: 'put',
    params
  })
}

// 问卷数据分页查询
export function getQuestionnaireAnswer(params) {
  return request({
    url: '/questionnaire-answer-do/page',
    method: 'get',
    params
  })
}

// 问卷关联的专栏接口
export function getQuestionnaireAnswerPage(id) {
  return request({
    url: `/questionnaire/list/${id}`,
    method: 'get'
  })
}
// 获取问卷详情
export function getQuestionnaireDetail(id) {
  return request({
    url: `/questionnaire/detail/${id}`,
    method: 'GET'
  })
}
