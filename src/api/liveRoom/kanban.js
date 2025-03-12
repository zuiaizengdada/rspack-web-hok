import request from '@/utils/request2'
import request5 from '@/utils/request5'
import { method } from 'lodash'

// 直播大屏-流量来源分析查询
export function getChannelInfo(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/channelInfo',
    method: 'POST',
    data
  })
}

// 直播大屏-商品成交记录查询
export function getGoodsPurchaseRecord(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/goodsPurchaseRecord',
    method: 'POST',
    data
  })
}

// 直播大屏-查询
export function getliveBroadcastLargeScreenInfo(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/info',
    method: 'POST',
    data
  })
}

// 直播大屏-人数趋势图查询
export function getliveBroadcastLargeScreenPeopleTrend(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/peopleTrend',
    method: 'POST',
    data
  })
}
// 直播大屏-直播间人数查询
export function getliveBroadcastLargeScreenPersonNumber(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/personNumber',
    method: 'POST',
    data
  })
}
// 直播大屏-直播间成交趋势查询
export function getliveBroadcastLargeScreenPurchaseTrend(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/purchaseTrend',
    method: 'POST',
    data
  })
}
// 直播大屏-直播间成交金额查询
export function getliveBroadcastLargeScreenTransactionAmount(data) {
  return request({
    url: '/cloud/edata-live/liveBroadcastLargeScreen/transactionAmount',
    method: 'POST',
    data
  })
}
// 单个直播间数据看板-优惠券数据
export function oneLiveRoomReportCoupon(params) {
  return request({
    url: '/cloud/edata-live/oneLiveRoomReport/coupon',
    method: 'get',
    params
  })
}
// 单个直播间数据看板-商品数据
export function oneLiveRoomReportGoods(params) {
  return request({
    url: '/cloud/edata-live/oneLiveRoomReport/goods',
    method: 'get',
    params
  })
}
// 单个直播间数据看板-订单数据
export function oneLiveRoomReportOrder(params) {
  return request({
    url: '/cloud/edata-live/oneLiveRoomReport/order',
    method: 'get',
    params
  })
}

// 互动趋势图-查询
export function interactiveTrend(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/dataBoard/interactiveTrend',
    method: 'POST',
    data
  })
}

// 人数数据-查询
export function getpeopleData(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/dataBoard/peopleData',
    method: 'get',
    params
  })
}
// 观看数据-查询
export function dataBoardviewData(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/dataBoard/viewData',
    method: 'get',
    params
  })
}

// 所有直播间数据看板-直播数据统计
export function allLiveRoomStatistics(data) {
  return request({
    url: '/cloud/edata-live/allLiveRoomReport/allLiveRoomStatistics',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-订单数据
export function allLiveRoomReportSummarize(data) {
  return request({
    url: '/cloud/edata-live/allLiveRoomReport/summarize',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-业绩排行榜-订单字段
export function teacherOrderRanking(data) {
  return request({
    url: '/cloud/edata-live/allLiveRoomReport/teacherOrderRanking',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-业绩排行榜-订单字段
export function teacherOrderRankingNew(data) {
  return request({
    url: '/cloud/data-center/report/v2/teacherOrderRanking',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-到课等数据查询
export function dataProfiling(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/dataBoard/course/dataProfiling',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-业绩排行版 - 到课等数据 查询
export function performanceRankingBoard(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/dataBoard/course/performanceRankingBoard',
    method: 'POST',
    data
  })
}

// 所有直播间数据看板-单个直播间数据查询
export function liveRoomDataBoard(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/dataBoard/liveRoomDataBoard',
    method: 'POST',
    data
  })
}
// 所有直播间看板- 直播助教列表分页查询
export function liveRoomTeachers(params) {
  return request({
    url: '/cloud/edata-live/allLiveRoomReport/liveRoomTeachers',
    method: 'GET',
    params
  })
}

// 所有直播间看板-合计相关字段
export function allLiveRoomStatisticsSum(data) {
  return request({
    url: '/cloud/edata-live/allLiveRoomReport/allLiveRoomStatisticsSum',
    method: 'POST',
    data
  })
}

// 直播数据对比
export function liveRoomStatisticsCompare(data) {
  return request({
    url: '/cloud/edata-live/liveRoomStatistics/compare',
    method: 'POST',
    data
  })
}

// 直播复盘-获取直播中聊天记录分页查询接口
export function getLiveChatRecordPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/liveChatRecordPage',
    method: 'POST',
    data
  })
}

// 私域看板-线索信息
export function clueStat(data) {
  return request({
    url: '/cloud/data-center/liveRoom/data/clueStat',
    method: 'POST',
    data
  })
}

// 私域看板 - 直播间到课、订单、营收数据
export function statistics(data) {
  return request({
    url: '/cloud/data-center/liveRoom/data/single/statistics',
    method: 'POST',
    data
  })
}

// 直播间列表分页查询-精简字段
export function easyPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/easy/page',
    method: 'POST',
    data
  })
}

// 获取记忆数据
export function getTearchRecord(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/detail',
    method: 'POST',
    data
  })
}

// 获取营收明细分页数据
export function getRevenuePage(data) {
  return request5({
    url: '/cloud/data-center/employeePerformanceDetail/revenuePage',
    method: 'POST',
    data
  })
}

// 获取直播看板概况数据
export function getSummarize(data) {
  return request({
    url: '/cloud/data-center/report/v2/summarize',
    method: 'POST',
    data
  })
}

// 获取直播看板概况数据
export function getDeptId() {
  return request({
    url: '/cloud/edata-live/employeePerformance/queryUserDeptId',
    method: 'GET'
  })
}

// 查询营收柱状图
export function getMonthRevenue(data) {
  return request({
    url: '/cloud/data-center/employeePerformance/monthRevenue',
    method: 'POST',
    data
  })
}

// 查询退款柱状图
export function getRefundChart(data) {
  return request({
    url: '/cloud/data-center/employeePerformance/monthRefund',
    method: 'POST',
    data
  })
}

// 查询退款柱状图
export function getCMVChart(data) {
  return request({
    url: '/cloud/data-center/employeePerformance/monthGmv',
    method: 'POST',
    data
  })
}

// 查询营收排名柱状图数据
export function getRevenueRankingBoard(data) {
  return request({
    url: '/cloud/data-center/report/v2/revenueRankingBoard',
    method: 'POST',
    data
  })
}

// 查询退款排名柱状图数据
export function getRefundRankingBoad(data) {
  return request({
    url: '/cloud/data-center/report/v2/refundRankingBoard',
    method: 'POST',
    data
  })
}

// 查询排名gmv柱状图
export function getGmvRankingBoard(data) {
  return request({
    url: '/cloud/data-center/report/v2/gmvRankingBoard',
    method: 'POST',
    data
  })
}

// 查询数据看板排名曲线图数据
export function getDailyDetail(data) {
  return request({
    url: '/cloud/data-center/employeePerformance/dailyDetail',
    method: 'POST',
    data
  })
}

// 查询退款明细分页
export function getRefundPageData(data) {
  return request5({
    url: '/cloud/data-center/employeePerformanceDetail/refundPage',
    method: 'POST',
    data
  })
}

// 查询退款明细分页
export function getGmvPageData(data) {
  return request5({
    url: '/cloud/data-center/employeePerformanceDetail/gmvPage',
    method: 'POST',
    data
  })
}

// 保存查询的ip老师和用户接口
export function setPersonSetUpRecord(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/save',
    method: 'POST',
    data
  })
}

// 保存邀请人的批量历史记录
export function setPersonUpBatchSave(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/batchSave',
    method: 'POST',
    data
  })
}
