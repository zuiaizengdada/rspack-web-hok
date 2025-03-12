import request from '@/utils/request2'

/**
 * 数据大盘(折线图)
 * @param {*} data
 * @returns Promise
 */
export function getAccountPage(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getAdLargeMarketChartData`,
    method: 'POST',
    data
  })
}

/**
 * 数据大盘
 * @param {*} data
 * @returns Promise
 */
export function getAdLargeMarketData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getAdLargeMarketData`,
    method: 'POST',
    data
  })
}

/**
 * 广告排名
 * @param {*} data
 * @returns Promise
 */
export function getAdRankData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getAdRankData`,
    method: 'POST',
    data
  })
}

/**
 * 广告数据
 * @param {*} data
 * @returns Promise
 */
export function getAdvertisingData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getAdvertisingData`,
    method: 'POST',
    data
  })
}

/**
 * 广告数据合计
 * @param {*} data
 * @returns Promise
 */
export function getAdvertisingDataTotal(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getAdvertisingDataTotal`,
    method: 'POST',
    data
  })
}
/**
 * 漏斗模型
 * @param {*} data
 * @returns Promise
 */
export function getFunnelData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getFunnelData`,
    method: 'POST',
    data
  })
}

/**
 * 业绩花费ROI趋势
 * @param {*} data
 * @returns Promise
 */
export function getPayOrderRoiTrendData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getPayOrderRoiTrendData`,
    method: 'POST',
    data
  })
}

/**
 * 投手排名
 * @param {*} data
 * @returns Promise
 */
export function getPitcherRankData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getPitcherRankData`,
    method: 'POST',
    data
  })
}

/**
 * 投手排名总计
 * @param {*} data
 * @returns Promise
 */
export function getPitcherRankTotalData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getPitcherRankTotalData`,
    method: 'POST',
    data
  })
}

/**
 * 总成交来源
 * @param {*} data
 * @returns Promise
 */
export function getTotalPayOrderCountData(data) {
  return request({
    url: `/cloud/ad-data-board/ad/data/board/getTotalPayOrderCountData`,
    method: 'POST',
    data
  })
}

/**
 * 第三方开放平台下拉接口
 * @param {*} data
 * @returns Promise
 */
export function getPlatformDropdown() {
  return request({
    url: `/cloud/ad-data-board/ad/platform/dropdown`,
    method: 'GET'
  })
}

/**
 * 获取投手
 * @param {*} data
 * @returns Promise
 */
export function getUserByName(params) {
  return request({
    url: `/cloud/ad-data-board/ad/dept/data/getUserByName`,
    method: 'GET',
    params
  })
}

/**
 * 获取部门树
 * @param {*} data
 * @returns Promise
 */
export function getDeptList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/dept/data/getDeptList`,
    method: 'GET',
    params
  })
}

/**
 * 新增账户获取跳转认证地址
 * @param {*} data
 * @returns Promise
 */
export function getOauthUri(params) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/oauth/uri`,
    method: 'GET',
    params
  })
}

/**
 * 平台应用下拉
 * @param {*} data
 * @returns Promise
 */
export function getApplicationDropdown(params) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/application/dropdown`,
    method: 'GET',
    params
  })
}

/**
 * 应用列表查询接口
 * @param {*} data
 * @returns Promise
 */
export function getApplicationList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/application/list`,
    method: 'GET',
    params
  })
}

/**
 * 新增应用appId接口
 * @param {*} data
 * @returns Promise
 */
export function addApplication(data) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/application/add`,
    method: 'POST',
    data
  })
}

/**
 * 删除应用ID
 * @param {*} data
 * @returns Promise
 */
export function delApplication(params) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/application/deleted`,
    method: 'get',
    params
  })
}

/**
 * 账号详情列表查询接口
 * @param {*} data
 * @returns Promise
 */
export function advertiserStaffList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/advertiser/staff/list`,
    method: 'get',
    params
  })
}

/**
 * 修改关联业绩区分类型
 * @param {*} data
 * @returns Promise
 */
export function addDiscriminate(data) {
  return request({
    url: `/cloud/ad-data-board/ad/advertiser/staff/discriminate`,
    method: 'POST',
    data
  })
}

/**
 * 广告投放管理列表
 * @param {*} data
 * @returns Promise
 */
export function getPutInDataList(data) {
  return request({
    url: `/cloud/ad-data-board/ad/creative/data/getDataList`,
    method: 'POST',
    data
  })
}

/**
 * 关联广告计划
 * @param {*} data
 * @returns Promise
 */
export function getADPlanList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/plan/list`,
    method: 'get',
    params
  })
}

/**
 * 取消关联
 * @param {*} data
 * @returns Promise
 */
export function adPlanCancel(params) {
  return request({
    url: `/cloud/ad-data-board/ad/plan/cancel`,
    method: 'get',
    params
  })
}

/**
 * 重新关联广告计划
 * @param {*} data
 * @returns Promise
 */
export function adPlanRE(params) {
  return request({
    url: `/cloud/ad-data-board/ad/plan/re/interrelated/`,
    method: 'get',
    params
  })
}

/**
 * 关联广告组筛选查询列表
 * @param {*} data
 * @returns Promise
 */
export function getADGroupList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/group/list`,
    method: 'get',
    params
  })
}

/**
 * 取消关联广告组
 * @param {*} data
 * @returns Promise
 */
export function adGroupCancel(params) {
  return request({
    url: `/cloud/ad-data-board/ad/group/cancel`,
    method: 'get',
    params
  })
}

/**
 * 重新关联广告组
 * @param {*} data
 * @returns Promise
 */
export function adGroupRE(params) {
  return request({
    url: `/cloud/ad-data-board/ad/group/re/interrelated`,
    method: 'get',
    params
  })
}

/**
 * 账号详情列表查询接口
 * @param {*} data
 * @returns Promise
 */
export function getAdvertiserUserList(params) {
  return request({
    url: `/cloud/ad-data-board/ad/advertiser/user/list`,
    method: 'get',
    params
  })
}

/**
 * 第三方认证成功回调请求接口
 * @param {*} data
 * @returns Promise
 */
export function getPlatformOauthCallback(params) {
  return request({
    url: `/cloud/ad-data-board/ad/platform/oauth/callback`,
    method: 'get',
    params
  })
}

/**
 * 当前登陆人可关联的广告主
 * @param {*} data
 * @returns Promise
 */
export function getAdvertiserStaffDropdown(params) {
  return request({
    url: `/cloud/ad-data-board/ad/advertiser/staff/dropdown`,
    method: 'get',
    params
  })
}

/**
 * 获取员工对应业绩区分关联的广告主下拉
 * @param {*} data
 * @returns Promise
 */
export function getAdvertiserStaffSelfDropdown(params) {
  return request({
    url: `/cloud/ad-data-board/ad/advertiser/staff/self/dropdown`,
    method: 'get',
    params
  })
}

/**
 * 新增关联广告计划
 * @param {*} data
 * @returns Promise
 */
export function getPlanInterrelated(data) {
  return request({
    url: `/cloud/ad-data-board/ad/plan/interrelated`,
    method: 'POST',
    data
  })
}

/**
 * 新增关联广告广告组
 * @param {*} data
 * @returns Promise
 */
export function getGroupInterrelated(data) {
  return request({
    url: `/cloud/ad-data-board/ad/group/interrelated`,
    method: 'POST',
    data
  })
}

/**
 * 广告投放管理列表合计
 * @param {*} data
 * @returns Promise
 */
export function getCreativeDataTotalList(data) {
  return request({
    url: `/cloud/ad-data-board/ad/creative/data/getDataTotalList`,
    method: 'POST',
    data
  })
}

// 更新广告主额外信息
export function updateExtra(params) {
  return request({
    url: '/cloud/ad-data-board/ad/advertiser/staff/advertiser/extra/update',
    method: 'post',
    data: params
  })
}
