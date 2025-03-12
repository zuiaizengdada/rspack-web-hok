import request from '@/utils/request2'

// 获取直播间用户限制配置
export function getLiveRoomUserLimit(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/config/${params.liveRoomId}`,
    method: 'get',
    params
  })
}

// 保存直播间用户限制配置
export function saveLiveRoomUserLimit(data) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/config`,
    method: 'POST',
    data
  })
}

// 添加直播间限制用户
export function addLiveRoomUserLimit(data) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/add`,
    method: 'POST',
    data
  })
}

// 分页查询直播间限制用户
export function getUserLimitPage(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/page`,
    method: 'get',
    params
  })
}

// 删除直播间限制用户
export function delUserLimitPage(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/remove`,
    method: 'DELETE',
    params: { ids: params.ids.join(',') }
  })
}

// 导入直播间限制用户
export function importLiveRoomUserLimit(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/userLimit/import',
    method: 'POST',
    timeout: 60000,
    data
  })
}

// 获取直播间限制用户的手机号
export function getUserLimitPhone(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/phone/${params.id}`,
    method: 'get',
    params
  })
}
// 获取直播间限制用户的邮箱
export function getUserLimitEmail(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/userLimit/email/${params.id}`,
    method: 'get',
    params
  })
}

// 新增计划看播导入用户
export function addImprtUser(data) {
  return request({
    url: `/cloud/edata-live/liveRoom/planWatchUser/addImprtUser`,
    method: 'POST',
    data
  })
}

// 计划看播用户导入
export function planWatchUserImport(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/planWatchUser/planWatchUserImport',
    method: 'POST',
    data
  })
}

// 下一场直播预告-save
export function nextLivePreview(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/nextLivePreview',
    method: 'POST',
    data
  })
}

// 直播间敏感词设置-save
export function liveRoomSensitive(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/liveRoomSensitive',
    method: 'POST',
    data
  })
}

// 直播v2.0-敏感词管理-模糊搜索敏感词组
export function getInfoByGroupName(params) {
  return request({
    url: `/cloud/hok-sensitive-words/sensitiveGroup/getInfoByGroupName`,
    method: 'get',
    params
  })
}

// 直播v2.0-敏感词管理-获取敏感词组信息
export function getInfoByGroupIds(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/getInfoByGroupIds',
    method: 'POST',
    data
  })
}
