import request from '@/utils/request2'

/**
 * QA查询分页
 * @param {*} data
 * @returns
 */
export function aiQADataPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/page`,
    method: 'POST',
    data
  })
}

/**
 * 录入QA
 * @param {*} data
 * @returns
 */
export function aiQADataAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/add`,
    method: 'POST',
    data
  })
}

/**
 * 详情
 * @param {*} id
 * @returns
 */
export function aiQADataDetail(id) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/detail/${id}`,
    method: 'GET'
  })
}

/**
 * 删除
 * @param {*} id
 * @returns
 */
export function aiQADataDel(id) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/delete/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除
 * @param {*} id
 * @returns
 */
export function aiDeleteBatch(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/deleteBatch`,
    method: 'DELETE',
    data
  })
}

/**
 * 文件导入
 * @param {*} data
 * @returns
 */
export function aiQADataImportQA(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/importQa`,
    method: 'POST',
    data
  })
}

/**
 * QA导入模板
 * @param {*} data
 * @returns
 */
export function getImportQaTemplate() {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/importQa/template`,
    method: 'GET'
  })
}

/**
 * 内容审核待处理
 * @param {*} data
 * @returns
 */
export function contentReviewPending() {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/contentReview/pending`,
    method: 'GET'
  })
}

/**
 * 内容审核已驳回
 * @param {*} data
 * @returns
 */
export function contentReviewRejected() {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/contentReview/rejected`,
    method: 'GET'
  })
}
/**
 * 内容审核通过
 * @param {*} data
 * @returns
 */
export function contentReviewPass(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/contentReview/pass`,
    method: 'POST',
    data
  })
}

/**
 * 内容审核跳过
 * @param {*} data
 * @returns
 */
export function contentReviewSkip(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/contentReview/skip`,
    method: 'POST',
    params: data
  })
}

/**
 * 风控审核待处理
 * @param {*} data
 * @returns
 */
export function contentRiskReviewRejected() {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/riskControlReview/pending`,
    method: 'GET'
  })
}

/**
 * 风控审核通过
 * @param {*} data
 * @returns
 */
export function contentRiskReviewPass(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/riskControlReview/pass`,
    method: 'POST',
    params: data
  })
}

/**
 * 风控审核驳回
 * @param {*} data
 * @returns
 */
export function contentRiskReviewReject(data) {
  return request({
    url: `/cloud/hok-assistant/ai-qa-data/riskControlReview/reject`,
    method: 'POST',
    data: data
  })
}
