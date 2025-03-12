
import request from '@/utils/request'

// 问卷-新建
export function addQuestionnaire(data) {
  return request({
    url: '/questionnaire',
    method: 'POST',
    data
  })
}
