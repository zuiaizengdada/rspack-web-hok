import request from '@/utils/request2'

// 查询视频使用统计列表
export function searchVideoUseNumsData(params) {
  return request({
    url: '/cloud/product/video/statistics/videoStatisticsList',
    method: 'get',
    params
  })
}

// 新增敏感词
export function insertCaseWords(params) {
  return request({
    url: '/cloud/product/teacher/sensitive/add',
    method: 'post',
    data: params
  })
}

// 敏感词导入
export function caseWordsImport({ data }) {
  return request({
    url: '/cloud/product/teacher/sensitive/import',
    method: 'POST',
    data
  })
}

// 敏感词模板下载
export function caseWordsDownload(params) {
  return request({
    url: '/cloud/product/question/download',
    method: 'GET',
    params
  })
}

// 编辑敏感词
export function editCaseWords(params) {
  return request({
    url: '/cloud/product/teacher/sensitive/modify',
    method: 'PUT',
    data: params
  })
}

// 查询敏感词列表
export function getSensitiveList(params) {
  return request({
    url: '/cloud/product/teacher/sensitive/page',
    method: 'get',
    params
  })
}

// 删除敏感词接口
export function deleteCaseWord(id) {
  return request({
    url: `/cloud/product/teacher/sensitive/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除敏感词接口
export function batchDeleteCaseWord(data) {
  return request({
    url: `/cloud/product/teacher/sensitive/batchDelete`,
    method: 'DELETE',
    data
  })
}

// 查询脱敏视频列表
export function queryDesensitizeVideoList(params) {
  return request({
    url: '/cloud/product/video/desensitized/project/page',
    method: 'get',
    params
  })
}

// 脱敏工程详情查询
export function getDesensitizedProjectDetail(params) {
  return request({
    url: '/cloud/product/video/desensitized/project/detail',
    method: 'get',
    params
  })
}

// 脱敏共享接口
export function toChangeShareVideoStatus(params) {
  return request({
    url: '/cloud/product/video/desensitized/project/shareStatus',
    method: 'post',
    data: params
  })
}

// 重新脱敏接口
export function toDesensitized(params) {
  return request({
    url: '/cloud/product/video/group/checkDesensitized',
    method: 'post',
    params
  })
}

// 人工脱敏重新脱敏接口
export function toDesensitizedRg(params) {
  return request({
    url: '/cloud/product/clip/reprocess',
    method: 'post',
    data: params
  })
}

// 脱敏管理详情列表详情
export function desensitizationListDetail(params) {
  return request({
    url: '/cloud/product/video/group/desensitizationListDetail',
    method: 'post',
    data: params
  })
}

// 重新处理
export function reprocessVideo(params) {
  return request({
    url: '/cloud/product/clip/reprocess',
    method: 'post',
    data: params
  })
}

// 修改视频名称
export function updateVideoName(params) {
  return request({
    url: '/cloud/product/video/group/editVideoName',
    method: 'post',
    data: params
  })
}

// 根据老师ID获取脱敏共享人列表
export function getDesensitizedVideoShareSpecificUser(params) {
  return request({
    url: '/cloud/product/video/desensitized/project/getDesensitizedVideoShareSpecificUserByTeacherId',
    method: 'get',
    params
  })
}

// 关闭企业微信提醒
export function getUpdatePushFlag(params) {
  return request({
    url: '/cloud/product/video/group/updatePushFlag',
    method: 'post',
    data: params
  })
}

// 转组确认接口
export function transferVideoGroupConfirm(params) {
  return request({
    url: '/cloud/product/video/group/transferVideoGroupConfirm',
    method: 'post',
    data: params
  })
}
