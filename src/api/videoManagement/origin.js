import request from '@/utils/request2'

// 原视频页面查询
export function videoGroupList(params) {
  return request({
    url: '/cloud/product/video/group/list',
    method: 'get',
    params
  })
}

// 原视频页面查询数据
export function videoGroupDataList(params) {
  return request({
    url: '/cloud/product/video/group/desensitizationList',
    method: 'post',
    data: params
  })
}

// 原视频页面   查询使用统计详情
export function getStatisticsDetail(params) {
  return request({
    url: '/cloud/product/video/group/usage/statistics/detail',
    method: 'get',
    params
  })
}

// 视频组详情
export function getVideoDetail(params) {
  return request({
    url: '/cloud/product/video/group/getVideoDetail',
    method: 'get',
    params
  })
}

// 新增视频组
export function addVideoGroup(data) {
  console.log(data, 111)
  return request({
    url: '/cloud/product/video/group/addVideoGroup',
    method: 'post',
    data
  })
}

// 重新脱敏
export function checkDesensitized(params) {
  return request({
    url: '/cloud/product/video/group/checkDesensitized',
    method: 'post',
    params
  })
}

// 删除视频信息
export function delOriginalVideoId(params) {
  return request({
    url: '/cloud/product/video/group/delOriginalVideoId',
    method: 'post',
    params
  })
}

// 查询定版列表
export function planFinalizedList(params) {
  return request({
    url: '/cloud/product/plan/management/finalized/list',
    method: 'GET',
    params
  })
}

// 保存下载记录
export function videoDownLoadRecord(params) {
  return request({
    url: '/cloud/product/video/download/record',
    method: 'post',
    data: params
  })
}

// 视频数量总数量
export function existsSuccessCount(params) {
  return request({
    url: '/cloud/product/video/group/existsSuccess',
    method: 'get',
    params
  })
}

// 转移视频组
export function transferVIdeoGroup(data) {
  return request({
    url: '/cloud/product/video/group/transferVIdeoGroup',
    method: 'post',
    data
  })
}

// 转移视频组日志列表
export function transferVIdeoGroupLog(data) {
  return request({
    url: '/cloud/product/video/group/transferVIdeoGroupLog',
    method: 'post',
    data
  })
}

// 添加机位模块
export function cameraAdd(data) {
  return request({
    url: '/cloud/product/multi/camera/add',
    method: 'post',
    data
  })
}

// 移除机位模块
export function cameraDelete(data) {
  return request({
    url: '/cloud/product/multi/camera/delete',
    method: 'post',
    data
  })
}

// 查询机位信息
export function getGroupByVideoGroupId(params) {
  return request({
    url: '/cloud/product/multi/camera/getGroupByVideoGroupId',
    method: 'get',
    params
  })
}
