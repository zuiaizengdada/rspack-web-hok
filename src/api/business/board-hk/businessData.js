import request from '@/utils/request2'

/**
 * 业务类型数据-业绩
 * @param {*} data
 * @returns
 */
export function bizTypeData(data) {
  return request({
    url: `/cloud/data-center/pc/performance/bizTypeData`,
    method: 'POST',
    data
  })
}

/**
 * 渠道数据-业绩
 * @param {*} data
 * @returns
 */
export function channelData(data) {
  return request({
    url: `/cloud/data-center/pc/performance/channelData`,
    method: 'POST',
    data
  })
}

/**
 * 付费占比数据-业绩
 * @param {*} data
 * @returns
 */
export function payTypeData(data) {
  return request({
    url: `/cloud/data-center/pc/performance/payTypeData`,
    method: 'POST',
    data
  })
}

/**
 * PC部门数据(柱状图)-营收
 * @param {*} data
 * @returns
 */
export function depPerformancetVertical(data) {
  return request({
    url: `/cloud/data-center/pc/performance/dept/vertical`,
    method: 'POST',
    data
  })
}

/**
 * 趋势图-业绩
 * @param {*} data
 * @returns
 */
export function performanceTrendDate(data) {
  return request({
    url: `/cloud/data-center/pc/performance/trend/date`,
    method: 'POST',
    data
  })
}

/**
 * PC员工营收明细数据-业绩
 * @param {*} data
 * @returns
 */
export function employeePerformanceData(data) {
  return request({
    url: `/cloud/data-center/pc/performance/employee/data`,
    method: 'POST',
    data
  })
}

/**
 * PC业绩达人明细数据
 * @param {*} data
 * @returns
 */
export function expertPerformanceData(data) {
  return request({
    url: `/cloud/data-center/pc/performance/expert/data`,
    method: 'POST',
    data
  })
}

/**
 * 业务类型数据-营收
 * @param {*} data
 * @returns
 */
export function bizTypeRevenueData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/bizTypeData`,
    method: 'POST',
    data
  })
}

/**
 * 渠道数据-营收
 * @param {*} data
 * @returns
 */
export function channeRevenuelData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/channelData`,
    method: 'POST',
    data
  })
}

/**
 * 店铺数据-营收
 * @param {*} data
 * @returns
 */
export function shopData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/shopData`,
    method: 'POST',
    data
  })
}

/**
 * 付费占比数据-营收
 * @param {*} data
 * @returns
 */
export function payTypeRevenueData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/payTypeData`,
    method: 'POST',
    data
  })
}

/**
 * 趋势图-营收
 * @param {*} data
 * @returns
 */
export function performanceTrendRevenueDate(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/trend/date`,
    method: 'POST',
    data
  })
}

/**
 * PC部门数据(柱状图)-营收
 * @param {*} data
 * @returns
 */
export function deptVertical(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/dept/vertical`,
    method: 'POST',
    data
  })
}

/**
 * PC员工营收明细数据-营收
 * @param {*} data
 * @returns
 */
export function employeeData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/employee/data`,
    method: 'POST',
    data
  })
}

/**
 * PC达人营收明细数据-营收
 * @param {*} data
 * @returns
 */
export function expertData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/expert/data`,
    method: 'POST',
    data
  })
}

/**
 * PC商品营收明细数据-营收
 * @param {*} data
 * @returns
 */
export function productData(data) {
  return request({
    url: `/cloud/data-center/pc/revenue/product/data`,
    method: 'POST',
    data
  })
}
