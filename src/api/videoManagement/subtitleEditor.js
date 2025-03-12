import request from '@/utils/request2'

// 脱敏视频原视频列表
export function productOriginalVideoList(params) {
  return request({
    url: '/cloud/product/original/video/list',
    method: 'GET',
    params
  })
}

// 脱敏视频-原视频-更新状态
export function productOriginalVideoRenewState(data) {
  return request({
    url: '/cloud/product/original/video/renew/state',
    method: 'POST',
    data
  })
}

// 脱敏视频-原视频-字幕-列表
export function productOriginalVideoSubtitleList(params) {
  return request({
    url: '/cloud/product/original/video/subtitle/list',
    method: 'GET',
    params
  })
}

// 脱敏视频-原视频-字幕-脱敏
export function productOriginalVideoSubtitleRenewStatus(data) {
  return request({
    url: '/cloud/product/original/video/subtitle/renew/status',
    method: 'POST',
    data
  })
}

// 产品视频导出
export function productExport(data) {
  return request({
    url: `/cloud/product/clip/productExport`,
    method: 'POST',
    data
  })
}

// 添加爆款标记
export function addHotMark(params) {
  return request({
    url: '/cloud/product/original/addHotMark',
    method: 'POST',
    data: params
  })
}

// 批量添加爆款标记
export function batchAddHotMark(params) {
  return request({
    url: '/cloud/product/original/batchAddHotMark',
    method: 'POST',
    data: params
  })
}

// 删除爆款标记
export function deleteHotMark(params) {
  return request({
    url: '/cloud/product/original/delHotMark',
    method: 'POST',
    data: params
  })
}

// 根据视频id取字幕接口
export function getSubTitleList(params) {
  return request({
    url: '/cloud/product/video/subtitle/subtitleList',
    method: 'GET',
    params
  })
}

// 剪辑台根据视频id取字幕接口
export function getWorkbenchSubtitleList(params) {
  return request({
    url: '/cloud/product/video/subtitle/workbenchSubtitleList',
    method: 'GET',
    params
  })
}

// 修改爆款标记
export function editHotMark(params) {
  return request({
    url: '/cloud/product/original/editHotMark',
    method: 'post',
    data: params
  })
}

// 原视频设置无效素材
export function setInvalidVideo(params) {
  return request({
    url: '/cloud/product/original/setInvalidVideo',
    method: 'post',
    data: params
  })
}

// 查询标记内的字幕
export function queryMarkSubtitle(params) {
  return request({
    url: '/cloud/product/original/queryMarkSubtitle',
    method: 'GET',
    params
  })
}

// AI推荐脱敏字幕列表
export function qryRecommendSubtitleList(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/qryRecommendSubtitleList',
    method: 'GET',
    params
  })
}

// 修改推荐脱敏字幕采纳状态
export function editRecommendStatus(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/editRecommendStatus',
    method: 'post',
    data: params
  })
}

// 脱敏一键采纳、取消
export function batchOperate(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/batchOperate',
    method: 'post',
    data: params
  })
}

// 获取AI推荐申请取消锁定字幕
export function getSubtitleCancelList(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/getSubtitleCancelList',
    method: 'GET',
    params
  })
}

// 获取AI推荐爆款集合
export function qryRecommendMarkList(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/qryRecommendMarkList',
    method: 'GET',
    params
  })
}

// 取消Ai推荐申请锁定
export function cancelRecommenSubtitle(params) {
  return request({
    url: '/cloud/product/desensitized/recommend/cancelRecommenSubtitle',
    method: 'post',
    data: params
  })
}

// 脱敏视频-原视频-字幕-逐字脱敏
/**
 *
 * @param {*} params
 * @returns
 * {
 * "dataType": 0, 脱敏数据类型：1逐字，2整行
 * "id": 0, 字幕id
 * "videoId": 0, 原视频id
 * desensitizeIndex: '0,10', 脱敏位置
 * desensitizeType: 2,脱敏类型：1自动脱敏，2手动脱敏
 * isDesensitized: 1,是否脱敏：1脱敏，0不脱敏
 * editingType: 1, 剪辑类型：1消音，2脱敏
 * }
 */
export function renewStatus(params) {
  return request({
    url: '/cloud/product/original/video/subtitle/words/renew/status',
    method: 'post',
    data: params
  })
}

// 多机位视频导出
export function multiCameraExport(data) {
  return request({
    url: '/cloud/product/clip/multiCameraExport',
    method: 'post',
    data
  })
}
// 获取爆款标记生成结果
export function getHotMarkGenerateResultApi(params) {
  return request({
    url: '/cloud/product/ai/generation/getHotMarkGenerateResult',
    method: 'get',
    params
  })
}
// 生成爆款标记的总结 然后在调用getHotMarkGenerateResultApi
export function hotMarkApi(data) {
  return request({
    url: '/cloud/product/ai/generation/hotMark',
    method: 'post',
    data
  })
}
// 视频字幕AI生成
export function videoSubtitleApi(params) {
  return request({
    url: '/cloud/product/ai/generation/videoSubtitle',
    method: 'post',
    params
  })
}
// 重新生成视频字幕AI生成
export function newVideoSubtitleApi(params) {
  return request({
    url: '/cloud/product/ai/generation/videoSubtitle/anew',
    method: 'post',
    params
  })
}

