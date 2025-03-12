import request from '@/utils/request2'

// 获取火山引擎上传的token
export function getHSToken() {
  return request({
    url: '/cloud/edata-video/config/getToken',
    method: 'get'
  })
}

// 获取火山商户信息
export function getUploadConfig(params) {
  return request({
    url: '/cloud/edata-video/config/getUploadConfig',
    method: 'get',
    params
  })
}

// 获取视频组当前MD5信息
export function getExistsHash(params) {
  return request({
    url: '/cloud/product/video/group/existsHash',
    method: 'get',
    params
  })
}

// 获取视频组当前视频数量
export function getExistsSuccess(params) {
  return request({
    url: '/cloud/product/video/group/existsSuccess',
    method: 'get',
    params
  })
}

// 文件上传失败发送飞书
export function uploadFail(data) {
  return request({
    url: '/cloud/product/video/group/uploadFail',
    method: 'post',
    data
  })
}

// 获取生成视频列表
export function getClipList(params, cancelToken) {
  return request({
    url: '/cloud/product/task/center/generate/video/page',
    method: 'get',
    params,
    cancelToken
  })
}
// 删除生成视频列表的视频
export function delClip(data) {
  return request({
    url: '/cloud/product/task/center/generate/video/del',
    method: 'post',
    data
  })
}

// 删除生成视频列表成功视频
export function delAllSuccessClip(data) {
  return request({
    url: '/cloud/product/task/center/generate/video/del/success',
    method: 'post',
    data
  })
}

// 文件上传失败发送飞书通知
export function sendNotice(data) {
  return request({
    url: '/cloud/product/video/group/uploadFail',
    method: 'post',
    data
  })
}

// 生成工程列表
export function getProjectList(params) {
  return request({
    url: '/cloud/product/task/center/generate/video/projectList',
    method: 'GET',
    params
  })
}

// 生成工程-删除
export function deleteProjectTask(data) {
  return request({
    url: '/cloud/product/task/center/generate/video/deleteProjectTask',
    method: 'post',
    data
  })
}

// 生成工程-删除全部成功任务
export function delProjectTaskSuccess(data) {
  return request({
    url: '/cloud/product/task/center/generate/video/delProjectTaskSuccess',
    method: 'POST',
    data
  })
}

// 重新生成工程
export function reprocessProjectTask(params) {
  return request({
    url: '/cloud/product/operateClips/reprocess',
    method: 'GET',
    params
  })
}

// 学员管理导出
export function getExportTaskList(data) {
  return request({
    url: '/cloud/delivery/delivery/online/getExportTaskList',
    method: 'POST',
    data
  })
}

// 学员管理导出删除
export function deletaExportTaskList(id) {
  return request({
    url: `/cloud/delivery/delivery/online/deleteExportTask/${id}`,
    method: 'DELETE'
  })
}
