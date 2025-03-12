import request from '@/utils/request2'
// 获取分组列表
export function getDataOverview(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/dataOverview',
    method: 'post',
    data: params
  })
}

// 获取图形数据
export function getDataForLine(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/dailyLineChart',
    method: 'post',
    data: params
  })
}

// 获取柱状图数据
export function getDataForChart(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/histogram',
    method: 'post',
    data: params
  })
}

// 我的数据获取
export function getMyData(params) {
  return request({
    url: '/cloud/edata-wemedia/myData/dataOverview',
    method: 'post',
    data: params
  })
}

// 账号数据信息
export function getAccountData() {
  return request({
    url: '/cloud/edata-wemedia/myData/accountSyncProgress',
    method: 'get'
  })
}

// 我的数据获取折线图
export function getMyDataLineData(params) {
  return request({
    url: '/cloud/edata-wemedia/myData/dailyLineChart',
    method: 'post',
    data: params
  })
}

// 查询账号总数
export function getTotalAccountCount(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/getTotalAccountCount',
    method: 'post',
    data: params
  })
}

// 查询数据总览的订单数据
export function getOrderData(params) {
  return request({
    url: '/cloud/data-center/account/order/data/dataOverview',
    method: 'post',
    data: params
  })
}

// 订单数据柱状图
export function getOrderZhuData(params) {
  return request({
    url: '/cloud/data-center/account/order/data/histogram',
    method: 'post',
    data: params
  })
}

// 订单折线图数据
export function getOrderLineData(params) {
  return request({
    url: '/cloud/data-center/account/order/data/dailyLineChart',
    method: 'post',
    data: params
  })
}

// 查询账号详情
export function getAccountWeMediaData(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/accountWeMediaData',
    method: 'get',
    params
  })
}

// 根据账号id查询账号的详情数据
export function getAccountDetailMessage(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountInfo',
    method: 'get',
    params
  })
}

// 查询账号全部作品
export function getAccountAllWorks(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/contentPageList',
    method: 'post',
    data: params
  })
}

// 导出按钮
export function downloadFors(params) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/contentsExport',
    method: 'post',
    data: params
  })
}

// 查询账号列表数据
export function getAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/myData/myAccountData',
    method: 'post',
    data: params
  })
}

// 我的账号列表数据导出
export function toDownloadMyAccountDataExport(params) {
  return request({
    url: '/cloud/edata-wemedia/myData/myAccountDataExport',
    method: 'post',
    data: params
  })
}

// 根据平台id查询所有的账号id
export function getAllAccountIds(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountByPlatformId',
    method: 'get',
    params
  })
}

// 查询需要同步状态的记录
export function getNeedUpdateTaskRecord(params) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/selNeedUpdatePublishTaskRecords',
    method: 'get',
    params
  })
}
// 根据账号id查询同步帐号信息
export function querySyncInfoById(params) {
  return request({
    url: '/cloud/edata-wemedia/account/querySyncInfoById',
    method: 'get',
    params
  })
}

// 查询数据总览明细数据
export function qryDataScreeningDetailList(data) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/qryDataScreeningDetailList',
    method: 'post',
    data
  })
}

// 查询数据总览账号明细数据
export function qryDataScreeningAccountDetailList(data) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/qryDataScreeningAccountDetailList',
    method: 'post',
    data
  })
}

// 数据总览——日折线图统计pc 订单数据及GMV
export function lineChartDetail(data) {
  return request({
    url: '/cloud/data-center/account/order/data/lineChartDetail',
    method: 'post',
    data
  })
}

// 数据总览——日折线图统计pc
export function lineChartDetailSingle(data) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/lineChartDetail',
    method: 'post',
    data
  })
}

// 导出数据总览账号明细数据
export function exportDataScreeningAccountDetail(data) {
  return request({
    url: '/cloud/edata-wemedia/dataOverview/exportDataScreeningAccountDetail',
    method: 'post',
    responseType: 'blob',
    data
  })
}
