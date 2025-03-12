import request from '@/utils/request2'
import request3 from '@/utils/request3'

// 获取互动详情
export function getScriptInteractInfo(params) {
  return request({
    url: '/cloud/edata-live/script/interact/detail',
    method: 'get',
    params
  })
}

// 新增互动内容、人数控制
export function addScriptInteract(data) {
  return request({
    url: '/cloud/edata-live/script/interact/add',
    method: 'POST',
    data
  })
}

// 删除脚本互动内容
export function deleteInteract(data) {
  return request({
    url: '/cloud/edata-live/script/interact/delete',
    method: 'POST',
    data
  })
}

// 删除全部脚本互动内容
export function deleteInteractAll(data) {
  return request({
    url: `/cloud/edata-live/script/interact/deleteAll/${data}`,
    method: 'POST'
  })
}

// 编辑互动内容、人数控制
export function editInteract(data) {
  return request({
    url: '/cloud/edata-live/script/interact/edit',
    method: 'POST',
    data
  })
}

// 脚本列表
export function getScriptList(params) {
  return request({
    url: '/cloud/edata-live/script/list',
    method: 'GET',
    params
  })
}
// 新增脚本
export function addScript(data) {
  return request({
    url: '/cloud/edata-live/script/add',
    method: 'POST',
    data
  })
}

// 修改脚本
export function editScript(data) {
  return request({
    url: '/cloud/edata-live/script/modify',
    method: 'POST',
    data
  })
}

// 修改脚本状态
export function editScriptStatus(data) {
  return request({
    url: '/cloud/edata-live/script/modifyStatus',
    method: 'POST',
    data
  })
}

// 脚本导出
export function exportInteract(params) {
  return request({
    url: '/cloud/edata-live/script/interact/export',
    method: 'get',
    params
  })
}

// 视频列表接口
export function getVideoList(params) {
  return request({
    url: '/cloud/edata-live/video/list',
    method: 'GET',
    params
  })
}

// 脚本详情
export function getDetail(scriptId) {
  return request({
    url: `/cloud/edata-live/script/scriptDetail/${scriptId}`,
    method: 'GET'
  })
}

// 删除脚本
export function delScript(data) {
  return request({
    url: '/cloud/edata-live/script/delete',
    method: 'POST',
    data
  })
}

// 获取导入脚本模板URL
export function getImportFileUrl(data) {
  return request({
    url: '/cloud/edata-live/script/interact/getImportFileUrl',
    method: 'POST',
    data
  })
}

// 导入脚本
export function importFile(data, onUploadProgress, cancelToken) {
  return request3({
    url: '/cloud/edata-live/script/interact/import',
    method: 'POST',
    data,
    onUploadProgress,
    cancelToken
  }, true, true)
}

// 复制脚本
export function scriptCopy(data) {
  return request({
    url: '/cloud/edata-live/script/scriptCopy',
    method: 'POST',
    data
  })
}

// 随机选取机器人
export function randomRobot(data) {
  return request({
    url: '/cloud/edata-live/script/randomRobot',
    method: 'POST',
    data
  })
}

// 查询导入聊天记录任务是否成功 0导入中 1成功 2失败
export function getScriptImportRecord(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/script/import/task/result',
    method: 'get',
    params
  })
}
