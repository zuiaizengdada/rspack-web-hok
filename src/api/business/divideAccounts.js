import request from '@/utils/request2'

// 已结算金额和笔数
export function getAccountAndCount(data) {
  return request({
    url: `/cloud/pay/settle/manage/accountAndCount`,
    method: 'POST',
    data
  })
}

// 保证金账号流水列表导出
export function getCapitalExport(data) {
  return request({
    url: `/cloud/pay/settle/manage/capital/export`,
    method: 'POST',
    data
  })
}

// 账号信息
export function getCapitalInfo(data) {
  return request({
    url: `/cloud/pay/settle/manage/capital/info`,
    method: 'POST',
    data
  })
}

// 资金账户流水列表
export function getCapitalList(data) {
  return request({
    url: `/cloud/pay/settle/manage/capital/list`,
    method: 'POST',
    data
  })
}

// 已结算汇总列表
export function getCollectList(data) {
  return request({
    url: `/cloud/pay/settle/manage/collect/list`,
    method: 'POST',
    data
  })
}

// 已结算金额列表导出
export function getCollectExport(data) {
  return request({
    url: `/cloud/pay/settle/manage/export`,
    method: 'POST',
    data
  })
}

// 已结算金额列表导出状态查询
export function orderSettleExportTaskStatus(params) {
  return request({
    url: `/cloud/pay/settle/manage/export/task/status`,
    method: 'GET',
    params
  })
}

// 已结算金额列表
export function getList(data) {
  return request({
    url: `/cloud/pay/settle/manage/list`,
    method: 'POST',
    data
  })
}

// 待结算列表导出
export function orderExport(data) {
  return request({
    url: `/cloud/pay/settle/order/export`,
    method: 'POST',
    data
  })
}

// 待结算金额列表导出状态查询
export function orderExportTaskStatus(params) {
  return request({
    url: `/cloud/pay/settle/order/export/task/status`,
    method: 'GET',
    params
  })
}

// 待结算查询列表
export function orderPage(params) {
  return request({
    url: `/cloud/pay/settle/order/page`,
    method: 'GET',
    params
  })
}

// 待结算总金额笔数
export function orderTotal(params) {
  return request({
    url: `/cloud/pay/settle/order/total`,
    method: 'GET',
    params
  })
}

// 抖音账户信息
export function douYinInfo(data) {
  return request({
    url: `/cloud/pay/settle/manage/douYin/info`,
    method: 'POST',
    data
  })
}

// 发送提现短信验证码
export function verifyCode(params) {
  return request({
    url: `/cloud/pay/settle/manage/verify/code`,
    method: 'GET',
    params
  })
}

// 提现
export function withdrawCash(data) {
  return request({
    url: `/cloud/pay/settle/manage/withdraw/cash`,
    method: 'POST',
    data
  })
}
