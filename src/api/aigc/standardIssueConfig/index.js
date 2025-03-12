import request from '@/utils/request2'
/**
 * 编辑业务场景
 * @export
 * @param {integer} id 标准问题id
 * @param {string} prompt 	Prompt格式
 * @return {Promise}
 */
export function aiBusinessSceneEdit(data) {
  return request({
    url: `/cloud/hok-assistant/ai-business-scene/edit`,
    method: 'POST',
    data
  })
}

/**
 * 业务场景查询分页
 * @export
 * @param {integer} pageIndex 页数,示例值(1)
 * @param {integer} pageSize 	分页数量,示例值(10)
 * @param {string} title 	提示词名称或者描述
 * @return {Promise}
 */
export function aiBusinessScenePage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-business-scene/page`,
    method: 'POST',
    data
  })
}

/**
 * 新增会话模版
 * @export
 * @param {string} content Prompt格式内容
 * @param {string} describe 	助手描述
 * @param {string} guideIssuesList 	引导问题列表（以,分割存储）
 * @param {string} icon 	图标
 * @param {string} issuesList 	问题列表（以,分割存储）
 * @param {string} title 	模版标题
 * @return {Promise}
 */
export function aiSessionTemplateAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/add`,
    method: 'POST',
    data
  })
}

/**
 * 修改会话模版
 * @export
 * @param {string} content Prompt格式内容
 * @param {string} describe 	助手描述
 * @param {string} guideIssuesList 	引导问题列表（以,分割存储）
 * @param {string} icon 	图标
 * @param {string} issuesList 	问题列表（以,分割存储）
 * @param {string} title 	模版标题
 * @return {Promise}
 */
export function aiSessionTemplateUpdate(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/edit`,
    method: 'POST',
    data
  })
}

/**
 * 会话模板名称分页查询
 * @export
 * @param {integer} pageIndex 页数,示例值(1)
 * @param {integer} pageSize 	分页数量,示例值(10)
 * @param {string} title 		助手名称
 * @return {Promise}
 */
export function aiSessionTemplatePage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/userTemplatePage`,
    method: 'POST',
    data
  })
}

/**
 * 删除会话助手
 * @export
 * @param {integer} id
 * @return {Promise}
 */
export function aiSessionTemplateDelete(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/delete`,
    method: 'POST',
    data
  })
}

/**
 * 用户是否置顶
 * @export
 * @param {integer} id
 * @return {Promise}
 */
export function setUserTop(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/addUserTop`,
    method: 'POST',
    data
  })
}

/**
 * 新增标准问题
 * @param data
 * @return {Promise}
 */
export function aiProblemConfigAdd(data) {
  return request({
    url: `/cloud/hok-assistant/ai-problem-config/add`,
    method: 'POST',
    data
  })
}

/**
 * 编辑标准问题
 * @export
 * @param {string} description 	问题描述
 * @param {string} id 	标准问题id
 * @return {Promise}
 */
export function aiProblemConfigEdit(data) {
  return request({
    url: `/cloud/hok-assistant/ai-problem-config/edit`,
    method: 'POST',
    data
  })
}

/**
 * 标准问题查询分页
 * @export
 * @param {integer} pageIndex 	页数,示例值(1)
 * @param {integer} pageSize 	分页数量,示例值(10)
 * @param {string} title 	提示词名称或者描述
 * @return {Promise}
 */
export function aiProblemConfigPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-problem-config/page`,
    method: 'POST',
    data
  })
}
