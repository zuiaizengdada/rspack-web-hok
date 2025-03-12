import request from '@/utils/request2'

/**
 * 知识库查询分页
 * @param {*} data
 * @returns
 */
export function knowledgePage(params) {
  return request({
    url: `/cloud/hok-assistant/knowledge/query`,
    method: 'GET',
    params
  })
}

/**
 * 修改内容
 * @param {*} data
 * @returns
 */
export function knowledgeUpdate(data) {
  return request({
    url: `/cloud/hok-assistant/knowledge/modify`,
    method: 'POST',
    data
  })
}

/**
 * 评审专家下拉
 * @param {*} data
 * @returns
 */
export function contentReviewer() {
  return request({
    url: `/cloud/hok-assistant/knowledge/contentReviewer`,
    method: 'GET'
  })
}
