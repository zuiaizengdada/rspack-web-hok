import request from '@/utils/request2'

// 分页投放账号查询
export function getFinancialPage(params) {
  return request({
    url: `/cloud/data-center/order/statistics/v2/order/detail/page`,
    method: 'GET',
    params
  })
}

// 分页投放账号查询
export function getOrderInvestigationPage(params) {
  return request({
    url: `/cloud/data-center/order/statistics/order/detail/page`,
    method: 'GET',
    params
  })
}

export function getOrderInvestigationData(params) {
  return request({
    url: '/cloud/data-center/order/statistics/order/detail/export/task',
    method: 'GET',
    params
  })
}

export function getDownloadData(params) {
  return request({
    url: '/cloud/data-center/order/statistics/v2/order/detail/export',
    method: 'GET',
    params
  })
}

export function getLxUrl(params) {
  return request({
    url: '/cloud/data-center/order/statistics/order/detail/export/task/status',
    method: 'GET',
    params
  })
}

export function getStatisticsOperation(params) {
  return request({
    url: '/cloud/data-center/order/statistics/operation',
    method: 'GET',
    params
  })
}

// 查询运营统计数据
export function getOperationExportTask(params) {
  return request({
    url: '/cloud/data-center/order/statistics/operation/export/task',
    method: 'GET',
    params
  })
}

// 查询达人统计数据
export function getTablentExportTask(params) {
  return request({
    url: '/cloud/data-center/order/statistics/expert/export/task',
    method: 'GET',
    params
  })
}

// 查询达人统计数据
export function getOrderStatisticsExpert(params) {
  return request({
    url: '/cloud/data-center/order/statistics/expert',
    method: 'GET',
    params
  })
}

// 查询机构内的所有达人数据
export function getAllTalentData() {
  return request({
    url: '/cloud/data-center/expertMan/listAll',
    method: 'GET'
  })
}

// 查询投放统计数据
export function getAdvertiseMonthPage(params) {
  return request({
    url: '/cloud/data-center/advertise-monthly-stats/page',
    method: 'GET',
    params
  })
}

// 查询roi达标标准new
export function getROIDetailNew(params) {
  return request({
    url: '/cloud/data-center/roi-reach-rule/detail',
    method: 'get',
    params
  })
}

// 分页查询投放账号和员工关系
export function getEmployeeAdvertisePage(params) {
  return request({
    url: '/cloud/data-center/employee-advertise/page',
    method: 'get',
    params
  })
}

// 修改投放账号和员工关系
export function employeeAdvertise(params) {
  return request({
    url: '/cloud/data-center/employee-advertise',
    method: 'put',
    data: params
  })
}

// 查询存在的渠道数据
export function getChannelOfHasShelveShop() {
  return request({
    url: '/cloud/admin/shop/third/channelOfHasShelveShop',
    method: 'get'
  })
}

// 根据渠道查询店铺
export function getShopListByChannel(params) {
  return request({
    url: '/cloud/admin/shop/third/getShelveShopList',
    method: 'get',
    params
  })
}

// 根据渠道查询达人数据
export function getDarenData(params) {
  return request({
    url: '/cloud/data-center/expertMan/listByHokChannel',
    method: 'get',
    params
  })
}

// 新增默认分配规则
export function insertRuleAdd(params) {
  return request({
    url: '/cloud/data-center/default/distribute/rule/add',
    method: 'post',
    data: params
  })
}

// 编辑默认分配规则
export function updateRule(params) {
  return request({
    url: '/cloud/data-center/default/distribute/rule/update',
    method: 'post',
    data: params
  })
}

// 广告主设置备注名称
export function setAdvertiserName(params) {
  return request({
    url: '/cloud/data-center/advertiser/update/alias',
    method: 'post',
    data: params
  })
}

// 投放平台渠道
export function getAdvertiseChannelJsonObject() {
  return request({
    url: '/cloud/center/channel/advertiseChannelJsonObjects',
    method: 'get'
  })
}

// 投放统计数据总计
export function getAdvertiseMonthlyStatsSummary(params) {
  return request({
    url: '/cloud/data-center/advertise-monthly-stats/summary',
    method: 'get',
    params
  })
}
