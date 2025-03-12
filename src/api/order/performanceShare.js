import request from '@/utils/request2'
import qs from 'qs'

// 新增业绩分成
export function performanceShareAdd(data) {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/performanceShare/add',
    method: 'POST',
    data
  })
}
// 删除业绩分成
export function performanceShareDel(data) {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/performanceShare/delete',
    method: 'POST',
    data
  })
}
// 编辑业绩分成
export function performanceShareEdit(data) {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/performanceShare/edit',
    method: 'POST',
    data
  })
}
// 分页查询业绩分成
export function getPerformanceSharePage(data) {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/performanceShare/getPage',
    method: 'POST',
    data
  })
}
// 新增数据看板设置
export function statisticalCorrelationSetting(data) {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/statistics/config/edit',
    method: 'POST',
    data
  })
}
// 查询数据看板设置
export function getStatisticalCorrelation() {
  return request({
    url: '/cloud/data-center/statisticalCorrelation/statistics/config/get',
    method: 'POST'
  })
}

/**
 * 达人管理
 */
// 达人列表查询
export function getexpertManPage(params) {
  return request({
    url: '/cloud/data-center/expertMan/list',
    method: 'get',
    params
  })
}
export function getexpertManPageNew(params) {
  return request({
    url: '/cloud/data-center/expertMan/listExpertManByName',
    method: 'get',
    params
  })
}
// 新增达人
export function expertManAdd(data) {
  return request({
    url: '/cloud/data-center/expertMan/add',
    method: 'POST',
    data
  })
}
// 查询达人的变更记录
export function exportManHistory(params) {
  return request({
    url: '/cloud/data-center/expert-man-history-do/history',
    method: 'get',
    params
  })
}
// 删除达人
export function expertManDel(data) {
  return request({
    url: `/cloud/data-center/expertMan/delete`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}
// 修改达人
export function expertManEdit(data) {
  return request({
    url: '/cloud/data-center/expertMan/update',
    method: 'POST',
    data
  })
}

/**
 * 直播排班管理
 */
// 直播排班列表查询
export function getLiveSchedulePage(params) {
  return request({
    url: '/cloud/data-center/liveSchedule/list',
    method: 'GET',
    params
  })
}
// 新增直播排班
export function liveScheduleAdd(data) {
  return request({
    url: '/cloud/data-center/liveSchedule/add',
    method: 'POST',
    data
  })
}
// 删除直播排班
export function liveScheduleDel(data) {
  return request({
    url: '/cloud/data-center/liveSchedule/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}
// 修改直播排班
export function liveScheduleEdit(data) {
  return request({
    url: '/cloud/data-center/liveSchedule/update',
    method: 'POST',
    data
  })
}

// 查询已上架的商品原价
export function getGoodsPrices() {
  return request({
    url: '/cloud/admin/material/goods/getGoodsPrices',
    method: 'GET'
  })
}

// 查询达人快照信息
export function expertSnapshotData(params) {
  return request({
    url: '/cloud/data-center/expertMan/expert/snapshot',
    method: 'post',
    data: params
  })
}

// 查询达人渠道列表
export function searchExpertChannelEnums() {
  return request({
    url: '/cloud/center/channel/expertChannelJsonObjects',
    method: 'get'
  })
}

// 模糊查询达人名称
export function listExpertManByName(query) {
  return request({
    url: `/cloud/data-center/expertMan/listExpertManByName?expertName=${query}`,
    method: 'get'
  })
}

// 查询场次统计数据
export function scheduleStatistics(liveId) {
  return request({
    url: `/cloud/data-center/order/statistics/order/schedule/statistics?liveScheduleId=${liveId}`,
    method: 'get'
  })
}
