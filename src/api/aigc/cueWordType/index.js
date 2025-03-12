import request from '@/utils/request2'
/**
 * 新增提示词分类
 * @export
 * @param {string} title 分类名称
 * @return {Promise}
 */
export function aiPromptWordTypeAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word-type/add`,
    method: 'POST',
    data
  })
}
/**
 *
 * 提示词分类列表查询
 * @export
 * @param {string} content 关键词
 * @param {integer} pageIndex 页数,示例值(1)
 * @param {integer} pageSize 分页数量,示例值(10)
 * @param {integer} typeId 提示词分类id
 * @return {*}
 */
export function aiPromptWordTypePage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word-type/page`,
    method: 'post',
    data
  })
}

/**
 * 修改提示词分类
 * @export
 * @param {integer} id 提示词分类id
 * @param {string} title 分类名称
 * @return {*}
 */
export function aiPromptWordTypeUpdate(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word-type/update`,
    method: 'POST',
    data
  })
}

/**
 * 删除提示词分类
 * @export
 * @param {integer} id 提示词分类id
 * @return {*}
 */
export function aiPromptWordTypeDelete(data) {
  return request({
    url: `/cloud/hok-assistant/ai-prompt-word-type/delete`,
    method: 'POST',
    data
  })
}

