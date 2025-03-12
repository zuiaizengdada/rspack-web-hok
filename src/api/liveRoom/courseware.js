import request from '@/utils/request2'
import request3 from '@/utils/request3'

// 课件详情
export function coursewareDetail(params) {
  return request({
    url: `/cloud/edata-live/courseware/coursewareDetail/${params}`,
    method: 'get'
  })
}

// 课件标记列表
export function markList(params) {
  return request({
    url: '/cloud/edata-live/courseware/markList',
    params
  })
}
// 新增课件
export function addCourseware(data) {
  return request({
    url: '/cloud/edata-live/courseware/add',
    method: 'POST',
    data
  })
}

// 新增课件配置
export function addCoursewareConfig(data) {
  return request({
    url: '/cloud/edata-live/courseware/addConfig',
    method: 'POST',
    data
  })
}

// 课件配置列表
export function getConfigList(params) {
  return request({
    url: '/cloud/edata-live/courseware/configList',
    method: 'get',
    params
  })
}
// 复制课件
export function copyCourseware(data) {
  return request({
    url: '/cloud/edata-live/courseware/copy',
    method: 'POST',
    data
  })
}
// 课件详情
export function getLiveRoomList(coursewareId) {
  return request({
    url: `/cloud/edata-live/courseware/coursewareDetail/${coursewareId}`,
    method: 'get'
  })
}

// 删除课件
export function deleteCourseware(data) {
  return request({
    url: '/cloud/edata-live/courseware/delete',
    method: 'POST',
    data
  })
}

// 课件类型数量
export function markCount(params) {
  return request({
    url: '/cloud/edata-live/courseware/markCount',
    method: 'get',
    params
  })
}
// 删除课件配置
export function deleteCoursewareConfig(data) {
  return request({
    url: '/cloud/edata-live/courseware/deleteConfig',
    method: 'POST',
    data
  })
}

// 课件列表
export function getCoursewareList(params) {
  return request({
    url: '/cloud/edata-live/courseware/list',
    method: 'get',
    params
  })
}

// 修改课件
export function editCourseware(data) {
  return request({
    url: '/cloud/edata-live/courseware/modify',
    method: 'POST',
    data
  })
}

// 修改课件状态
export function editModifyStatus(data) {
  return request({
    url: '/cloud/edata-live/courseware/modifyStatus',
    method: 'POST',
    data
  })
}

// 修改课件配置
export function updateCoursewareConfig(data) {
  return request({
    url: '/cloud/edata-live/courseware/updateConfig',
    method: 'POST',
    data
  })
}

// 获取加热配置列表
export function getHeatConfigList(params) {
  return request({
    url: '/cloud/edata-live/heatConfig/list',
    method: 'get',
    params
  })
}

// 保存加热配置
export function saveHeatConfig(data) {
  return request({
    url: '/cloud/edata-live/heatConfig/save',
    method: 'post',
    data
  })
}

// 一键删除字幕
export function deleteSubtitles(data) {
  return request({
    url: '/cloud/edata-live/courseware/deleteSubtitles',
    method: 'post',
    data
  })
}

// 批量新增重点
export function batchAddMark(data) {
  return request({
    url: '/cloud/edata-live/courseware/batchAddMark',
    method: 'post',
    data
  })
}

// 课件难点列表
export function getDifficultyList(params) {
  return request({
    url: '/cloud/edata-live/courseware/difficultyList',
    method: 'GET',
    params
  })
}
// 删除标记
export function deletelMark(data) {
  return request({
    url: '/cloud/edata-live/courseware/deletelMark',
    method: 'POST',
    data
  })
}

// 修改标记

// 修改难点标记
export function updateMark(data) {
  return request({
    url: '/cloud/edata-live/courseware/updateMark',
    method: 'POST',
    data
  })
}

// 导入脚本
export function importFile(data, onUploadProgress, cancelToken) {
  return request3({
    url: '/cloud/edata-live/courseware/import',
    method: 'POST',
    data,
    onUploadProgress,
    cancelToken
  }, true, true)
}
// 获取导入脚本模板URL
export function getImportFileUrl(data) {
  return request({
    url: '/cloud/edata-live/courseware/getImportFileUrl',
    method: 'POST',
    data
  })
}
// 取消互动点和难点标记
export function cancelMark(data) {
  return request({
    url: '/cloud/edata-live/courseware/cancelMark',
    method: 'POST',
    data
  })
}

// 导出
export function exportFile(params) {
  return request({
    url: '/cloud/edata-live/courseware/export',
    method: 'get',
    params
  })
}

// 新增互动点和难点标记
export function addMark(data) {
  return request({
    url: '/cloud/edata-live/courseware/addMark',
    method: 'POST',
    data
  })
}

// 课件列表
export function coursewareList(params) {
  return request({
    url: '/cloud/edata-live/courseware/list',
    method: 'get',
    params
  })
}
// 修改课件介绍
export function updateSynopsis(data) {
  return request({
    url: '/cloud/edata-live/courseware/updateSynopsis',
    method: 'POST',
    data
  })
}
