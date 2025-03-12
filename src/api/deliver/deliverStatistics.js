import request from '@/utils/request2'

/**
 * 交付课程
 */
// 获取交付订单数据的tab栏目
export function getDataBoardDeliveryItem(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/item',
    method: 'GET',
    params
  })
}

// 支出成本趋势图
export function getDataBoardDeliveryTrendCost(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/cost',
    method: 'GET',
    params
  })
}

// 总交付金额趋势图
export function getDataBoardDeliveryTrendDeliveredFee(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/delivered/fee',
    method: 'GET',
    params
  })
}

// 已交付学员数
export function getDataBoardDeliveryTrendDeliveredUser(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/delivered/user',
    method: 'GET',
    params
  })
}

// 招生趋势图
export function getDataBoardDeliveryTrendRecruit(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/recruit',
    method: 'GET',
    params
  })
}

// 总退款金额趋势图
export function getDataBoardDeliveryTrendRefundFee(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/refund/fee',
    method: 'GET',
    params
  })
}

// 待完成交付学员趋势图
export function getDataBoardDeliveryTrendRefundToDeliveryUser(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/trend/to-delivery/user',
    method: 'GET',
    params
  })
}

// 部门-员工已交付学员排行
export function getDeptUserDeliveredUserRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/dept-user/delivered-user/rank',
    method: 'GET',
    params
  })
}
// 部门-员工交付排行
export function getDeptUserDeliveryFeeRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/dept-user/delivery-fee/rank',
    method: 'GET',
    params
  })
}
// 部门-员工招生排行
export function getDeptUserRecruitRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/dept-user/recruit/rank',
    method: 'GET',
    params
  })
}
// 部门-员工退费排行
export function getDeptUserRefundFeeRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/dept-user/refund-fee/rank',
    method: 'GET',
    params
  })
}
// 部门-员工待完成交付学员排行
export function getDeptUserToDeliveryUserRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/dept-user/to-delivery-user/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 招生业绩
export function deliveryMonthRecruitRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/recruit/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 交付业绩
export function deliveryMonthDeliveryFeeRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/delivery-fee/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 获客学费
export function deliveryMonthHokFeeRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/hok-fee/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 支出成本
export function deliveryMonthCostRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/cost/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 预期利润
export function deliveryMonthExpectProfitRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/expect-profit/rank',
    method: 'GET',
    params
  })
}

// 交付课程月度汇总 退款金额
export function deliveryMonthRefundFeeRank(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/refund-fee/rank',
    method: 'GET',
    params
  })
}

/**
 * 全部
 */
// 查询全部列表数据概况
export function getAllDataInfo(data) {
  return request({
    url: '/cloud/delivery/databoard/getAllDataInfo',
    method: 'POST',
    data
  })
}
// 查询全部列表招生排行
export function getAllRanking(data) {
  return request({
    url: '/cloud/delivery/databoard/getAllRanking',
    method: 'POST',
    data
  })
}

// 查询全部列表招生趋势图
export function getAllTrendChart(data) {
  return request({
    url: '/cloud/delivery/databoard/getAllTrendChart',
    method: 'POST',
    data
  })
}

// 查询导流订单列表数据概况
export function getDiversionDataInfo(data) {
  return request({
    url: '/cloud/delivery/databoard/getDiversionDataInfo',
    method: 'POST',
    data
  })
}

// 查询导流列表招生排行
export function getDiversionRanking(data) {
  return request({
    url: '/cloud/delivery/databoard/getDiversionRanking',
    method: 'POST',
    data
  })
}

// 查询导流列表趋势图
export function getDiversionTrendChart(data) {
  return request({
    url: '/cloud/delivery/databoard/getDiversionTrendChart',
    method: 'POST',
    data
  })
}

// 交付课程 月度汇总 导出汇总报表
export function deliveryMonthExport(params) {
  return request({
    url: '/cloud/delivery/data-board/delivery/month/export/excel',
    method: 'GET',
    params
  })
}
