import request from '@/utils/request2'

// 手动脱敏看板和折线图
export function getDesensitizeDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getDesensitizeDataBoard',
    method: 'get',
    params
  })
}

// 视频组数据看板和折线图
export function getGroupDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getGroupDataBoard',
    method: 'get',
    params
  })
}

// 未手动脱敏看板和折线图
export function getNotDesensitizeDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getNotDesensitizeDataBoard',
    method: 'get',
    params
  })
}

// 共享数看板和折线图
export function getShareDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getShareDataBoard',
    method: 'get',
    params
  })
}
// 视频数据看板和折线图
export function getVideoDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getVideoDataBoard',
    method: 'get',
    params
  })
}

// 爆款标记看板和折线图
export function getHotMarkBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getHotMarkBoard',
    method: 'get',
    params
  })
}

// 爆款标记看板明细列表
export function qryHotMarkList(data) {
  return request({
    url: '/cloud/product/material/data/board/qryHotMarkList',
    method: 'post',
    data
  })
}

// 使用数据看板
export function getOperateDataBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getOperateDataBoard',
    method: 'get',
    params
  })
}

// 使用数据列表
export function getOperateDataList(params) {
  return request({
    url: '/cloud/product/material/data/board/getOperateDataList',
    method: 'get',
    params
  })
}

// 数据看板导出
export function exportOperateDataList(params) {
  return request({
    url: '/cloud/product/material/data/board/exportOperateDataList',
    method: 'get',
    params
  })
}

// 新数据看板导出
export function exportWorksVideoList(data) {
  return request({
    url: '/cloud/product/material/data/board/exportWorksVideoList',
    method: 'post',
    data
  })
}

// 爆款标记看板明细列表——导出
export function exportHotMarkList(data) {
  return request({
    url: '/cloud/product/material/data/board/qryHotMarkList/export',
    method: 'post',
    data
  })
}

// 脱敏数据-视频数据统计、有效视频数、共享视频
export function getVideoGroupBoard(params) {
  return request({
    url: '/cloud/product/material/data/board/getVideoGroupBoard',
    method: 'get',
    params
  })
}

// 脱敏数据-视频组明细列表
export function getVideoGroupBoardDetailPage(params) {
  return request({
    url: '/cloud/product/material/data/board/getVideoGroupBoardDetailPage',
    method: 'get',
    params
  })
}

// 脱敏数据-视频组明细列表
export function getInvalidVideoBoardDetailPage(params) {
  return request({
    url: '/cloud/product/material/data/board/getInvalidVideoBoardDetailPage',
    method: 'get',
    params
  })
}

// 脱敏数据-共享视频明细列表
export function getShardVideoBoardDetailPage(params) {
  return request({
    url: '/cloud/product/material/data/board/getShardVideoBoardDetailPage',
    method: 'get',
    params
  })
}

// 使用数据-点赞数饼图
export function getGreatsPieChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getGreatsPieChart',
    method: 'get',
    params
  })
}

// 使用数据-点赞数分布图
export function getMediaGreatsBarChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getMediaGreatsBarChart',
    method: 'get',
    params
  })
}

// 使用数据-平台点赞数分布图占比
export function getMediaColumnChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getMediaColumnChart',
    method: 'get',
    params
  })
}

// 使用数据-共享视频、视频使用统计
export function getUseDataShardVideo(params) {
  return request({
    url: '/cloud/product/material/data/board/getUseDataShardVideo',
    method: 'get',
    params
  })
}

// 使用数据-共享视频视频使用分页列表
export function getShareVideoBoard(data) {
  return request({
    url: '/cloud/product/material/data/board/getShareVideoBoard',
    method: 'post',
    data
  })
}

// 使用数据-作品视频数据
export function getWorksVideoList(data) {
  return request({
    url: '/cloud/product/material/data/board/getWorksVideoList',
    method: 'post',
    data
  })
}

// 使用数据-作品视频数据 总粉丝 点赞 播放量
export function getWorksVideoInfoNum(data) {
  return request({
    url: '/cloud/product/material/data/board/getWorksVideoInfoNum',
    method: 'post',
    data
  })
}

// 使用数据-数据概览-作品数据
export function getUseWorksDataShardVideo(params) {
  return request({
    url: '/cloud/product/material/data/board/getUseWorksDataShardVideo',
    method: 'get',
    params
  })
}

// 使用数据-分享数饼图
export function getSharedPieChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getSharedPieChart',
    method: 'get',
    params
  })
}

// 使用数据-分享数分布图
export function getMediaSharedBarChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getMediaSharedBarChart',
    method: 'get',
    params
  })
}

// 使用数据-平台分享数分布图占比
export function getMediaSharedColumnChart(params) {
  return request({
    url: '/cloud/product/material/data/board/getMediaSharedColumnChart',
    method: 'get',
    params
  })
}
