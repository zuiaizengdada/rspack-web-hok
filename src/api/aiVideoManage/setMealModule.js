import request from '@/utils/request2'

/**
 * 获取套餐列表数据
 * @param {Object} data - 请求参数对象
 * @returns {Promise}
 */
export function getSetMealList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/package/getPackagePage',
    method: 'post',
    data
  })
}

/**
 * 获取套餐详情
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getSetMealDetail(params) {
  return request({
    url: '/cloud/edata-digitalhuman/package/getDetail',
    method: 'get',
    params
  })
}

/**
 * 新增编辑套餐
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function addOperatePackage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/package/operatePackage',
    method: 'post',
    data
  })
}

/**
 * 获取订单详情
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getOrderDetail(params) {
  return request({
    url: '/cloud/edata-digitalhuman/package/getPackageOrderDetail',
    method: 'get',
    params
  })
}

/**
 * 生成订单
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function generateOrder(data) {
  return request({
    url: '/cloud/edata-digitalhuman/package/generateOrder',
    method: 'post',
    data
  })
}

/**
 * 获取费用分页列表
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getCostPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/statistics/getCostPage',
    method: 'post',
    data
  })
}

/**
 * 获取费用情况
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getCostInfo(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/statistics/getCostInfo',
    method: 'post',
    data
  })
}

/**
 * 获取充值记录分页列表
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getPayRecordPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/getPayRecordPage',
    method: 'post',
    data
  })
}

/**
 * 获取消费记录分页列表
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getConsumeRecordPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/getConsumeRecordPage',
    method: 'post',
    data
  })
}

/**
 * 确认收款
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function confirmPayment(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/confirmPayment',
    method: 'post',
    data
  })
}

/**
 * 确认赠送
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function confirmGive(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/confirmGive',
    method: 'post',
    data
  })
}

/**
 * 新增赠送
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function addGive(data) {
  return request({
    url: '/cloud/edata-digitalhuman/platform/addGive',
    method: 'post',
    data
  })
}

/**
 * 根据关键字查询机构信息
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getOrganizationByName(params) {
  return request({
    url: '/cloud/edata-live/heatLiveRoom/org',
    method: 'get',
    params
  })
}

/**
 * 获取机构列表
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getOrgList(params) {
  return request({
    url: '/cloud/edata-user/organization/page',
    method: 'get',
    params
  })
}

/**
 * 获取套餐列表
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getPackageList(params) {
  return request({
    url: '/cloud/edata-digitalhuman/package/getPackageList',
    method: 'get',
    params
  })
}

/**
 * 校验套餐余额
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function checkPackageOrderBalance(data) {
  return request({
    url: '/cloud/edata-digitalhuman/package/checkPackageOrderBalance',
    method: 'post',
    data
  })
}

/**
 * 取消支付
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function cancelPayment(data) {
  return request({
    url: '/cloud/edata-digitalhuman/package/cancelPayment',
    method: 'post',
    data
  })
}

/**
 * 获取收款信息
 * @param {Object} params  - 请求参数对象
 * @returns {Promise}
 */
export function getPaymentInfo(params) {
  return request({
    url: '/cloud/edata-digitalhuman/package/getPaymentInfo',
    method: 'get',
    params
  })
}

/**
 * 获取费用情况
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getDataBoardCostInfo(data) {
  return request({
    url: '/cloud/edata-digitalhuman/dataBoard/statistics/getCostInfo',
    method: 'post',
    data
  })
}

/**
 * 获取充值记录分页列表
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getDataBoardPayRecordPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/dataBoard/getPayRecordPage',
    method: 'post',
    data
  })
}

/**
 * 获取消费记录分页列表
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getDataBoardConsumeRecordPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/dataBoard/getConsumeRecordPage',
    method: 'post',
    data
  })
}

/**
 * 获取数据概况
 * @param {Object} data  - 请求参数对象
 * @returns {Promise}
 */
export function getDataOverview(data) {
  return request({
    url: '/cloud/edata-digitalhuman/dataBoard/statistics/getDataOverview',
    method: 'post',
    data
  })
}
