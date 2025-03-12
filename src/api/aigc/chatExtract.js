import request from '@/utils/request2'

// 查询提取任务列表
export function queryTaskList(params) {
  return request({
    url: `/cloud/hok-assistant/ai-copy-writing-extraction-assistant/get-extract-task-list`,
    method: 'GET',
    params
  })
}

// 搜索提取任务列表
export function searchTaskList(params) {
  return request({
    url: `/cloud/hok-assistant/ai-copy-writing-extraction-assistant/search`,
    method: 'GET',
    params
  })
}

// 取消提取任务
export function cancelTask(params) {
  return request({
    url: `/cloud/hok-assistant/extract/task/cancel`,
    method: 'GET',
    params
  })
}

// 获取任务提取详情
export function queryTaskDetail(params) {
  return request({
    url: `/cloud/hok-assistant/extract/task/details`,
    method: 'GET',
    params
  })
}

// 创建提取任务
export function createTask(data) {
  return request({
    url: `/cloud/hok-assistant/extract/task/crated`,
    method: 'POST',
    data
  })
}

// 提取任务重试接口
export function reTryTask(params) {
  return request({
    url: `/cloud/hok-assistant/extract/task/retry`,
    method: 'GET',
    params
  })
}

// 提取任务结果查询接口
export function queryTaskResult(params) {
  return request({
    url: `/cloud/hok-assistant/extract/task/result`,
    method: 'GET',
    params
  })
}

// 提取助手系统内置模板列表
export function querySystemTemplate(params) {
  return request({
    url: `/cloud/hok-assistant/extract/system/template/list`,
    method: 'GET',
    params
  })
}

// 提取助手自定义模板列表
export function queryCustomTemplate(params) {
  return request({
    url: `/cloud/hok-assistant/extract/custom/template/list`,
    method: 'GET',
    params
  })
}

// 创建助手自定义模板列表
export function createCustomTemplate(data) {
  return request({
    url: `/cloud/hok-assistant/extract/custom/template/new`,
    method: 'POST',
    data
  })
}

// 删除助手自定义模板列表
export function deleteCustomTemplate(params) {
  return request({
    url: `/cloud/hok-assistant/extract/custom/template/delete`,
    method: 'GET',
    params
  })
}

// 修改助手自定义模板列表
export function updateCustomTemplate(data) {
  return request({
    url: `/cloud/hok-assistant/extract/custom/template/update`,
    method: 'POST',
    data
  })
}

// 根据Id查询提取助手自定义模板列表
export function queryCustomTemplateDetailById(params) {
  return request({
    url: `/cloud/hok-assistant/extract/template/details`,
    method: 'GET',
    params
  })
}

// 清除历史对话内容接口
export function clearHistory(data) {
  return request({
    url: `/cloud/hok-assistant/conversation/clear/history`,
    method: 'POST',
    data
  })
}

// 文件上传失败接口
export function uploadFailCallback(data) {
  return request({
    url: `/cloud/hok-assistant/extract/upload/fail/callback`,
    method: 'POST',
    data
  })
}

// 查询启用的模型列表
export function EnableModels() {
  return request({
    url: `/cloud/hok-assistant/ai-file-model-config/models`,
    method: 'GET'
  })
}
