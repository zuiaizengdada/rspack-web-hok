import request from '@/utils/request2'

// 运营在线剪辑-视频列表
export function videoList(query) {
  return request({
    url: '/cloud/product/operateClips/videoList',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-标记列表
export function markList(query) {
  return request({
    url: '/cloud/product/operateClips/markList',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-标记详情
export function markDetail(query) {
  return request({
    url: '/cloud/product/operateClips/markDetail',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-删除标记
export function deleteMark(data) {
  return request({
    url: '/cloud/product/operateClips/deleteMark',
    method: 'post',
    data
  })
}

// 运营在线剪辑-新增标记
export function addMark(data) {
  return request({
    url: '/cloud/product/operateClips/addMark',
    method: 'post',
    data
  })
}

// 批量新增标记
export function batchAddMark(data) {
  return request({
    url: '/cloud/product/operateClips/batchAddMark',
    method: 'post',
    data
  })
}

// 运营在线剪辑-修改标记
export function updateMark(data) {
  return request({
    url: '/cloud/product/operateClips/updateMark',
    method: 'post',
    data
  })
}

// 运营在线剪辑-批量新增修改切割
export function addCuttings(data) {
  return request({
    url: '/cloud/product/operateClips/addCuttings',
    method: 'post',
    data
  })
}

// 运营在线剪辑-视频切割列表
export function cuttingList(query) {
  return request({
    url: '/cloud/product/operateClips/cuttingList',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-抽帧图片列表
export function frameExtractingList(query) {
  return request({
    url: '/cloud/product/operateClips/frameExtractingList',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-运营生成视频
export function videoGgenerate(data) {
  return request({
    url: '/cloud/product/operateClips/generate',
    method: 'post',
    data
  })
}

// 修改视频导出状态
export function updateIsExport(data) {
  return request({
    url: '/cloud/product/operateClips/updateIsExport',
    method: 'post',
    data
  })
}

// 运营在线剪辑-视频生成明细
export function videoGenerateDetail(query) {
  return request({
    url: '/cloud/product/operateClips/generateDetail',
    method: 'get',
    params: query
  })
}

// 运营在线剪辑-视频字幕
export function subtitleList(query) {
  return request({
    url: '/cloud/product/operateClips/subtitleList',
    method: 'get',
    params: query
  })
}

// 查询片段预估生成时长
export function qryPercentage(data) {
  return request({
    url: '/cloud/product/operateClips/qryPercentage',
    method: 'POST',
    data
  })
}

// 筛选导出状态
export function screenExportStatus(params) {
  return request({
    url: '/cloud/product/operateClips/screenExportStatus',
    method: 'get',
    params
  })
}

// 筛选导出状态
export function editPartName(data) {
  return request({
    url: '/cloud/product/operateClips/editPartName',
    method: 'post',
    data
  })
}

// 添加外部素材
export function externalVideoAdd(data) {
  return request({
    url: '/cloud/product/external/video/add',
    method: 'post',
    data
  })
}

// 删除外部素材
export function externalVideoDelete(data) {
  return request({
    url: '/cloud/product/external/video/delete',
    method: 'post',
    data
  })
}

// 获取云桌面剩余空间大小
export function getEcsMemory(data) {
  return request({
    url: '/cloud/product/partDownload/getEcsMemory',
    method: 'get',
    data
  })
}

// 根据工程id获取多机位组信息
export function getGroupByVideoProjectId(params) {
  return request({
    url: '/cloud/product/operateWorkbench/getGroupByVideoProjectId',
    method: 'get',
    params
  })
}
