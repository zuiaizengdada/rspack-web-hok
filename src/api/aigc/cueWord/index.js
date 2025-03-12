import request from '@/utils/request2'
/**
 * 新增提示词
 * @export
 * @param {string} content 提示语内容
 * @param {string} title 提示语名称
 * @param {integer} type 提示词分类
 * @return {Promise}
 */
export function aiPromptWordAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word/add`,
    method: 'POST',
    data
  })
}
/**
 *
 * 获取提示语分页
 * @export
 * @param {string} content 关键词
 * @param {integer} pageIndex 页数,示例值(1)
 * @param {integer} pageSize 分页数量,示例值(10)
 * @param {integer} typeId 提示词分类id
 * @return {*}
 */
export function aiPromptWordPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word/page`,
    method: 'POST',
    data
  })
}

/**
 * 修改提示词
 *
 * @export
 * @param {string} content 提示语内容
 * @param {integer} id 提示词id
 * @param {string} title 提示语名称
 * @param {integer} typeId 提示词分类id
 * @return {*}
 */
export function aiPromptWordUpdate(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word/update`,
    method: 'POST',
    data
  })
}

/**
 * 删除提示词
 * @export
 * @param {integer} id 提示词id
 * @return {*}
 */
export function aiPromptWordDelete(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word/delete`,
    method: 'POST',
    data
  })
}

