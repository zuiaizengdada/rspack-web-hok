import request from '@/utils/request2'

// 剪辑工作台-我的工程

// 获取我的工程列表
/* export function getMyprojectList(params) {
  return request({
    url: 'http://172.16.21.100:9000/cloud/product/myProject/list',
    method: 'GET',
    params
  })
} */

// 获取我的工程列表
export function getMyprojectList(params) {
  return request({
    url: '/cloud/product/operateWorkbench/myProjects',
    method: 'post',
    data: params
  })
}

// 获取我的素材列表
export function getMyMaterialList(params) {
  return request({
    url: '/cloud/product/operateWorkbench/myMaterials',
    method: 'post',
    data: params
  })
}

// 获取我的素材详情
export function getMaterialDetail(id) {
  return request({
    url: `/cloud/product/operateWorkbench/materialDetail?projectId=${id}`,
    method: 'get'
  })
}

// 获取共享给我的视频列表
export function getClipWorkSharedList(params) {
  return request({
    url: '/cloud/product/operateWorkbench/myShares',
    method: 'post',
    data: params
  })
}

// 获取共享给我的视频详情
export function getSharedDetail(id) {
  return request({
    url: `/cloud/product/operateWorkbench/shareDetail?projectId=${id}`,
    method: 'get'
  })
}

// 获取我的工程详情
export function getMyprojectDetail(params) {
  return request({
    url: '/cloud/product/operateWorkbench/projectDetail',
    method: 'GET',
    params
  })
}

// 获取我的工程和共享给我的工程脱敏查看原视频列表
export function getMyProjectDesensitizationList(id) {
  return request({
    url: `/cloud/product/operateWorkbench/myProjectDesensitizationList?projectId=${id}`,
    method: 'get'
  })
}

// 获取我的工程和共享给我的工程视频的字幕列表
export function getMyProjectDesensitizationSubtitle(id, projectId) {
  return request({
    url: `/cloud/product/operateWorkbench/myProjectDesensitizationSubtitle?desensitizationId=${id}&projectId=${projectId}`,
    method: 'get'
  })
}

// 获取 我的素材 的视频字幕列表
export function getSharedDesensitizationSubtitle(obj) {
  return request({
    url: `/cloud/product/operateWorkbench/getDesensitizationSubtitle?videoId=${obj.id}&type=${obj.type}`,
    method: 'get'
  })
}

// 查询脱敏工程内的视频列表
export function queryByProjectId(id) {
  return request({
    url: `/cloud/product/original/queryByProjectId?projectId=${id}`,
    method: 'get'
  })
}

// 获取我的素材 脱敏查看原视频列表
export function getMyMaterialListDesensitizationList(id) {
  return request({
    url: `/cloud/product/operateWorkbench/myMaterialsDesensitizationList?projectId=${id}`,
    method: 'get'
  })
}

// 工程共享设置
export function setShareProjectP(params) {
  return request({
    url: '/cloud/product/operateWorkbench/share',
    method: 'post',
    data: params
  })
}

// 获取片段列表
export function getPartList(params) {
  return request({
    url: '/cloud/product/operateWorkbench/partList',
    method: 'post',
    data: params
  })
}

// 片段删除
export function deletePart(params) {
  return request({
    url: '/cloud/product/operateWorkbench/deletePart',
    method: 'post',
    data: params
  })
}

// 我的素材生成专属工程
export function setMaterialGenrate(params) {
  return request({
    url: '/cloud/product/operateWorkbench/materialGenrate',
    method: 'post',
    data: params
  })
}

// 共享给我的工程生成专属工程
export function setShareGenrate(params) {
  return request({
    url: '/cloud/product/operateWorkbench/shareGenrate',
    method: 'post',
    data: params
  })
}

// 根据视频id获取我的工程视频片段列表
export function getMyprojectVideoListById(params, cancelToken) {
  return request({
    url: 'http://172.16.21.100:9000/cloud/product/myProject/video/listById',
    method: 'GET',
    params,
    cancelToken
  })
}

// 我的工程删除
export function deleteMyProject(params) {
  return request({
    url: '/cloud/product/operateWorkbench/deleteProject',
    method: 'post',
    data: params
  })
}

// 提交需要下载工程的视频片段参数
export function submitDownloadTask(params) {
  return request({
    url: '/cloud/product/partDownload/submitDownloadTask',
    method: 'post',
    data: params
  })
}

// 查询工程下正在进行的下载任务
export function getPartDownloadTask(id) {
  return request({
    url: `/cloud/product/partDownload/queryPartDownloadTask?projectId=${id}`,
    method: 'get'
  })
}

// 获取工程压缩文件地址
export function getFileUrl(id) {
  return request({
    url: `/cloud/product/partDownload/getFileUrl?downloadId=${id}`,
    method: 'get'
  })
}

// 取消下载
export function cancelDownload(params) {
  return request({
    url: '/cloud/product/partDownload/cancelDownload',
    method: 'post',
    params
  })
}

// 确认下载失败
export function sureConfirmFail(params) {
  return request({
    url: '/cloud/product/partDownload/confirmFail',
    method: 'post',
    params
  })
}

// 剪辑工作台修改我的工程内容
export function updateMyProject(params) {
  return request({
    url: '/cloud/product/operateWorkbench/updateMyProject',
    method: 'post',
    data: params
  })
}

// 查询分组列表数据
export function searchQryGroup() {
  return request({
    url: '/cloud/product/operateWorkbench/qryGroup',
    method: 'get'
  })
}

// 修改分组
export function updateGroup (params) {
  return request({
    url: '/cloud/product/operateWorkbench/updateGroup',
    method: 'post',
    data: params
  })
}

// 共享给我的——隐藏共享工程
export function hideProject (params) {
  return request({
    url: '/cloud/product/operateWorkbench/hideProject',
    method: 'post',
    data: params
  })
}

// 我的工程条件筛选
export function myProjectShaixuan(params) {
  return request({
    url: '/cloud/product/operateWorkbench/myProjectsByParam',
    method: 'post',
    data: params
  })
}

// 我的工程条件筛选
export function myMaterialsShaixuan(params) {
  return request({
    url: '/cloud/product/operateWorkbench/myMaterialsByParam',
    method: 'post',
    data: params
  })
}

// 我的工程条件筛选
export function mySharedShaixuan(params) {
  return request({
    url: '/cloud/product/operateWorkbench/mySharesByParam',
    method: 'post',
    data: params
  })
}

// 新增分组
export function addGroup(params) {
  return request({
    url: '/cloud/product/operateWorkbench/addGroup',
    method: 'post',
    data: params
  })
}

// 删除分组
export function deleteGroup (id) {
  return request({
    url: `/cloud/product/operateWorkbench/deleteGroup?groupId=${id}`,
    method: 'post'
  })
}

// 修改分组
export function updateGroupName(params) {
  return request({
    url: '/cloud/product/operateWorkbench/updateGroupName',
    method: 'post',
    data: params
  })
}

// 提醒是否已生成工程
export function checkGenerateProject(params) {
  return request({
    url: '/cloud/product/operateWorkbench/checkGenerateProject',
    method: 'get',
    params
  })
}

// 根据关键词查询视频
export function qryDesensitizedSubtitleList(data) {
  return request({
    url: '/cloud/product/operateWorkbench/qryDesensitizedSubtitleList',
    method: 'post',
    data
  })
}

// 获取我的素材 脱敏查看原视频列表
export function getDesensitizationDetails(id) {
  return request({
    url: `/cloud/product/video/group/desensitizationDetails?videoGroupId=${id}`,
    method: 'get'
  })
}
