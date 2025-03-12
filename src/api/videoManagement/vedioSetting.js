import request from '@/utils/request2'

// 半成品开放权限设置
export function settingShare(params) {
  return request({
    url: '/cloud/product/semi-video/protect/day/setting',
    method: 'put',
    data: params
  })
}

// 查询系统半成品保护周期
export function getProtectDay() {
  return request({
    url: '/cloud/product/semi-video/protect/day/get',
    method: 'get'
  })
}

// 查询半成品获取开放权限设置
export function getSettingGetData(id) {
  return request({
    url: `/cloud/product/semi-video/share/setting/get/${id}`,
    method: 'get'
  })
}

// 新增敏感词
export function insertTongyongCaseWords(params) {
  return request({
    url: '/cloud/product/common/sensitive/add',
    method: 'post',
    data: params
  })
}

// 敏感词导入
export function caseWordsTongyongImport(data) {
  return request({
    url: '/cloud/product/common/sensitive/import',
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
export function editTongyongCaseWords(params) {
  return request({
    url: '/cloud/product/common/sensitive/modify',
    method: 'PUT',
    data: params
  })
}

// 查询敏感词列表
export function getTongyongSensitiveList(params) {
  return request({
    url: '/cloud/product/common/sensitive/page',
    method: 'get',
    params
  })
}

// 删除敏感词接口
export function deleteTongyongCaseWord(id) {
  return request({
    url: `/cloud/product/common/sensitive/delete/${id}`,
    method: 'DELETE'
  })
}

// 删除敏感词接口
export function batchDeleteTongyongCaseWord(data) {
  return request({
    url: `/cloud/product/common/sensitive/batchDelete`,
    method: 'DELETE',
    data
  })
}

// 成品关键词检测
export function getWordsPage(params) {
  return request({
    url: '/cloud/product/finish/video/keyword/page',
    method: 'get',
    params
  })
}

// 半成品分页查询列表
export function getSemiVideoPage(params) {
  return request({
    url: '/cloud/product/semi-video/page',
    method: 'get',
    params
  })
}

// 半成品视频删除
export function deleteVideo(semiVideoId) {
  return request({
    url: `/cloud/product/semi-video/${semiVideoId}`,
    method: 'DELETE'
  })
}

// 半成品视频修改
export function editSemiVideo(params) {
  return request({
    url: '/cloud/product/semi-video/modify',
    method: 'PUT',
    data: params
  })
}

// 半成品视频详情
export function getVideoDetailData(id) {
  return request({
    url: `/cloud/product/semi-video/detail/${id}`,
    method: 'get'
  })
}

// 下载加1统计
export function downloadAdd(id) {
  return request({
    url: `/cloud/product/semi-video/download/num/${id}`,
    method: 'put'
  })
}

// 半成品共享视频列表
export function getShareVideoPage(params) {
  return request({
    url: '/cloud/product/semi-video/share/page',
    method: 'get',
    params
  })
}

// 半成品共享视频视频详情
export function getShareVideoDetailData(id) {
  return request({
    url: `/cloud/product/semi-video/share/detail/${id}`,
    method: 'get'
  })
}

// 获取成品视频列表
export function getFinishedVedioList(params) {
  return request({
    url: '/cloud/product/finish/video/page',
    method: 'get',
    params
  })
}

// 获取成品视频详情
export function getFinishVideoDetail(id) {
  return request({
    url: `/cloud/product/finish/video/detail/${id}`,
    method: 'get'
  })
}

// 成品视频删除
export function deleteFinishedVideo(semiVideoId) {
  return request({
    url: `/cloud/product/finish/video/delete/${semiVideoId}`,
    method: 'DELETE'
  })
}

// 成品视频修改
export function editFinishedVideo(params) {
  return request({
    url: '/cloud/product/finish/video/modify',
    method: 'post',
    data: params
  })
}

// 开放权限设置接口
export function setShareSetting(params) {
  return request({
    url: '/cloud/product/semi-video/share/setting',
    method: 'put',
    data: params
  })
}

// 半成品视频重新处理字幕
export function semiVideoReflow(id) {
  return request({
    url: `/cloud/product/semi-video/reflow/${id}`,
    method: 'post'
  })
}

// 成品视频重新处理字幕
export function finishVideoReflow(id) {
  return request({
    url: `/cloud/product/finish/video/reflow/${id}`,
    method: 'post'
  })
}

// 半成品视频和成品视频重新脱敏
export function subtitleRecheck(params) {
  return request({
    url: '/cloud/product/video/subtitle/recheck',
    method: 'post',
    data: params
  })
}

// 判断是否存在MD5
export function existsHash(params) {
  console.log('ppp:', params)
  return request({
    url: '/cloud/product/video/group/existsHash',
    method: 'get',
    params
  })
}

// 自媒体成品信息查询
export function queryWeMediaVideoInfo(data) {
  return request({
    url: '/cloud/product/finish/video/queryWeMediaVideoInfo',
    method: 'get',
    params: data
  })
}

// 分发相关
// 脱敏视频内容分发操作
export function desensitizedContentDeliveryApi(data) {
  return request({
    url: '/cloud/product/video/desensitized/project/contentDelivery',
    method: 'post',
    data
  })
}
// 成品视频内容分发操作
export function videoContentDeliveryApi(data) {
  return request({
    url: '/cloud/product/finish/video/contentDelivery',
    method: 'post',
    data
  })
}
// 获取合作机构列表 1/成品 2/脱敏
export function getCpOrgListApi(params) {
  return request({
    url: '/cloud/product/contentDelivery/getCpOrgList',
    method: 'get',
    params
  })
}
// 获取供应机构列表
export function getSupplierOrgListApi(params) {
  return request({
    url: '/cloud/product/contentDelivery/getSupplierOrgList',
    method: 'get',
    params
  })
}
// 获取分发合作机构记录列表 1/成品 2/脱敏
export function getDeliveryCpOrgListApi(params) {
  return request({
    url: '/cloud/product/contentDelivery/getDeliveryCpOrgList',
    method: 'get',
    params
  })
}
// 获取分发给我的成品视频 1/成品 2/脱敏
export function getDeliveryToMePageListApi(params) {
  return request({
    url: '/cloud/product/finish/video/getDeliveryToMePageList',
    method: 'get',
    params
  })
}
// 成品视频分发给我的ip列表
export function getVideoIpListApi(params) {
  return request({
    url: '/cloud/product/contentDelivery/getVideoIpList',
    method: 'get',
    params
  })
}

// 获取脱敏共享人列表
export function getDesensitizedVideoShareSpecificUser(params) {
  return request({
    url: '/cloud/product/video/desensitized/project/getDesensitizedVideoShareSpecificUser',
    method: 'get',
    params
  })
}
