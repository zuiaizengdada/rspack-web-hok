import request from '@/utils/request2'

/**
 * 分页查询已关联提示词列表
 * @param {*} data
 * @return {Promise}
 */
export function relatedPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-related-prompt-word/related/page`,
    method: 'POST',
    data
  })
}

/**
 * 分页查询未关联提示词列表
 * @param {*} data
 * @return {Promise}
 */
export function unrelatedPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-related-prompt-word/unrelated /page`,
    method: 'POST',
    data
  })
}

/**
 * 删除提示词关联
 * @param {*} data
 * @return {Promise}
 */
export function relatedDelete(data) {
  return request({
    url: `/cloud/hok-assistant/ai-related-prompt-word/related/delete`,
    method: 'POST',
    data
  })
}

/**
 * 批量删除提示词关联
 * @param {*} data
 * @return {Promise}
 */
export function relatedBatchDelete(data) {
  return request({
    url: `/cloud/hok-assistant/ai-related-prompt-word/related/deleteBatch`,
    method: 'POST',
    data
  })
}

/**
 * 新增提示词关联
 * @param {*} data
 * @return {Promise}
 */
export function relatedCueWordAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-related-prompt-word/related/add`,
    method: 'POST',
    data
  })
}
