import request from '@/utils/request2'

/**
 * 查询培训视频列表
 * @param {*} data
 * @returns Promise
 */
export function getTrainingVideoList(params) {
  return request({
    url: `/cloud/product/trainingVideo/page`,
    method: 'GET',
    params
  })
}

/**
 * 新增培训视频
 * @param {*} data
 * @returns Promise
 */
export function addTrainingVideo(data) {
  return request({
    url: `/cloud/product/trainingVideo`,
    method: 'POST',
    data
  })
}

/**
 * 修改培训视频
 * @param {*} data
 * @returns Promise
 */
export function updateTrainingVideo(data) {
  return request({
    url: `/cloud/product/trainingVideo`,
    method: 'PUT',
    data
  })
}

/**
 * 查询我的培训视频列表
 * @param {*} data
 * @returns Promise
 */
export function getTrainingVideoMineList(params) {
  return request({
    url: `/cloud/product/trainingVideo/mine`,
    method: 'GET',
    params
  })
}

/**
 * 删除培训视频
 * @param {*} data
 * @returns Promise
 */
export function deleteTrainingVideo(params) {
  return request({
    url: `/cloud/product/trainingVideo/${params.trainingVideoId}`,
    method: 'DELETE'
  })
}

/**
 * 查询绑定事件列表
 * @param {*} data
 * @returns Promise
 */
export function getBindEvent(params) {
  return request({
    url: `/cloud/product/bindEvent`,
    method: 'GET',
    params
  })
}

/**
 * 查询是否已经观看过培训视频
 * @param {*} data
 * @returns Promise
 */
export function viewingFlag(params) {
  return request({
    url: `/cloud/product/trainingVideoViewingRecord/viewingFlag`,
    method: 'GET',
    params
  })
}

/**
 * 新增培训视频观看记录
 * @param {*} data
 * @returns Promise
 */
export function trainingVideoViewingRecord(data) {
  return request({
    url: `/cloud/product/trainingVideoViewingRecord`,
    method: 'POST',
    data
  })
}
