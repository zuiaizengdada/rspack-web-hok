import request from '@/utils/request2'
import request3 from '@/utils/request3'
// 直播v2.0-获取敏感词列表
export function getSensitiveGroupPageApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/getSensitiveGroupPage',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-新增
export function sensitiveGroupAddApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/add',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-删除
export function sensitiveGroupDelApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/delete',
    method: 'DELETE',
    data
  })
}
// 直播v2.0-敏感词管理-批量删除
export function sensitiveGroupsDelApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/delete/batch',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-检测敏感词
export function sensitiveGroupCheckApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/check',
    method: 'POST',
    data
  })
}
// 直播v2.0-敏感词管理-编辑
export function sensitiveGroupEditCheckApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/edit',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-模板url
export function sensitiveGetTemplateUrlApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/getTemplateUrl',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-导入
export function sensitiveImportApi(data, onUploadProgress, cancelToken) {
  return request3({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/import',
    method: 'POST',
    data,
    onUploadProgress,
    cancelToken
  }, true, true)
}

// 直播v2.0-敏感词管理-上传模板
export function sensitiveUploadFileApi(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/uploadFile',
    method: 'POST',
    data
  })
}

// 获取视频信息
export function getVideoInfo(params) {
  return request({
    url: '/cloud/edata-live/video/getVideoInfo',
    method: 'get',
    params
  })
}
