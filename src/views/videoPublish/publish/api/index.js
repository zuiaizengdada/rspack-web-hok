import request from '@/utils/request2'

//
export function qryAccountPlatform(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountPlatform',
    method: 'get',
    data
  })
}
// 查询登录配置信息数据
export function qryLoginMerchant(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryLoginMerchant',
    method: 'get',
    data
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

// 保存视频-一键发布
export function accountPublish(data) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/publish',
    method: 'post',
    data
  })
}

// 一键设置信息查询
export function querySettingContent(params) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/querySettingContent',
    method: 'get',
    params
  })
}

// 一键设置信息查询
export function publishAccounts(params) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/publishAccounts',
    method: 'get',
    params
  })
}

// 添加发布记录
export function addPublishTask(data) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/addPublishTask',
    method: 'post',
    data
  })
}

// 记录发布参数
export function insertYixiaoerPublish(data) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/insertYixiaoerPublish',
    method: 'post',
    data
  })
}

// 常用话题查询
export function oftenUseTopic(params) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/oftenUseTopic',
    method: 'get',
    params
  })
}

// 常用话题删除
export function delOftenUseTopic(data) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/deleteTopic',
    method: 'post',
    data
  })
}

// 新增话题
export function addTopic(data) {
  return request({
    url: '/cloud/edata-wemedia/accountPublish/addTopic',
    method: 'POST',
    data
  })
}

// 更新发布记录
export function updatePublishTaskRecord(data) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/updatePublishTaskRecord',
    method: 'POST',
    data
  })
}

// 查询同步帐号信息
export function querySyncInfo(params) {
  return request({
    url: '/cloud/edata-wemedia/account/querySyncInfo',
    method: 'get',
    params
  })
}

// 更新账号同步时间
export function updateSyncTime(data) {
  return request({
    url: '/cloud/edata-wemedia/account/updateSyncTime',
    method: 'post',
    data
  })
}

// 更新账号同步时间(手动)
export function manualSyncData(data) {
  return request({
    url: '/cloud/edata-wemedia/syncData/manualSyncData',
    method: 'post',
    data
  })
}
// 更新账号同步时间(自动)
export function syncData(data) {
  return request({
    url: '/cloud/edata-wemedia/syncData/syncData',
    method: 'post',
    data
  })
}
// 更新发布记录作品唯一id
export function updatePublishSuccessInfo(data) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/updatePublishSuccessInfo',
    method: 'post',
    data
  })
}
