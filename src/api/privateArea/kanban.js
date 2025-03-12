// 线索管理
import request from '@/utils/request2'

// 数据总览
export function getClueStatOverview(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/clueStatOverview',
    method: 'post',
    data
  })
}

// 折线图
export function getDailyLineChart(data) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectLinkRatio',
    method: 'post',
    data
  })
}

// 过程数据-跟进数据统计
export function getClueFollowStatSelectData(data) {
  return request({
    url: '/cloud/edata-sale/clueFollowStat/selectData',
    method: 'post',
    data
  })
}

// 过过程数据-跟进数据统计
export function getManualCallStatSelectData(data) {
  return request({
    url: '/cloud/edata-sale/sale/manualCallStat/selectData',
    method: 'post',
    data
  })
}

// 外呼数据-个人明细统计
export function getManualSelectDataDetail(data) {
  return request({
    url: '/cloud/edata-sale/sale/manualCallStat/selectDataDetail',
    method: 'post',
    data
  })
}

// 过程数据-个人明细统计
export function getSelectDataDetail(data) {
  return request({
    url: '/cloud/edata-sale/clueFollowStat/selectDataDetail',
    method: 'post',
    data
  })
}

// 任务线索统计
export function getTaskClueStat(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueStat',
    method: 'post',
    data
  })
}

// 员工线索统计
export function getUserClueStat(data) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectSummary',
    // url: '/cloud/edata-sale/clueStat/userClueStat',
    method: 'post',
    data
  })
}

// 分页列表查询
export function getClueStatPayPage(data) {
  return request({
    url: '/cloud/edata-sale/clue-stat-pay/page',
    // url: '/cloud/edata-sale/clueStat/userClueStat',
    method: 'post',
    data
  })
}

// 数据概况
export function getSelectData(data) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectData',
    method: 'POST',
    data
  })
}

// 成交时间维度 - 数据概况
export function getClueStatPayBoard(data) {
  return request({
    url: '/cloud/edata-sale/clue-stat-pay/data/board',
    method: 'POST',
    data
  })
}

// 成交时间维度 - 趋势图
export function getClueStatPayTrendDate(data) {
  return request({
    url: '/cloud/edata-sale/clue-stat-pay/trend/data',
    method: 'POST',
    data
  })
}

// 数据概况更新时间
export function getSelectUpdateTime(params) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectUpdateTime',
    method: 'GET',
    params
  })
}

// 数据看板 - 来源老师下拉列表
export function getSelectTeacherList(params) {
  return request({
    url: `/cloud/edata-sale/clueFollowStat/selectUser`,
    method: 'GET',
    params
  })
}

// 数据看板 - 获取机构部门下的所有部门
export function getClueStatHourSelectDept(params) {
  return request({
    url: `/cloud/edata-sale/clueStatHour/selectDept`,
    method: 'GET',
    params
  })
}
// 来源老师下拉列表
export function getSelectListTeacher(params) {
  return request({
    url: `/cloud/edata-sale/clueStatHour/selectListTeacher`,
    method: 'GET',
    params
  })
}

// 数据柱状图
export function getClueStatHourlineChart(data) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/barChart',
    method: 'POST',
    data
  })
}
// 数据柱状图-新
export function getClueStatPaylineChart(data) {
  return request({
    url: '/cloud/edata-sale/clue-stat-pay/barChart',
    method: 'POST',
    data
  })
}
