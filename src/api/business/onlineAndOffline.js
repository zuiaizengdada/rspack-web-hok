import request2 from '@/utils/request2'
import request from '@/utils/request'
import { method } from 'lodash'

// 分页投放账号查询
export function getDeptCategory(params) {
  return request2({
    url: `/cloud/data-center/pcv2/dept-category/getDeptCategory`,
    method: 'GET',
    params
  })
}

// 根据渠道查询店铺分页数据
export function getShopList(params) {
  return request({
    url: '/shop/third/page',
    method: 'get',
    params
  })
}

// 线上线下类型查询
export function getOfflineFlag(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/offlineFlags',
    method: 'post',
    data: params
  })
}

// 查询商品类型数据
export function getRevenueGoodsType() {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/revenueGoodsTypesJsonObj',
    method: 'get'
  })
}

// 业务类型数据查询
export function revenueGroupByBizType(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/revenueGroupByBizType',
    method: 'post',
    data: params
  })
}

// 饼图数据获取
export function revenueDealTypeRatio(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/revenueDealTypeRatio',
    method: 'post',
    data: params
  })
}

// 趋势图获取数据 gmv
export function getGmvTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/gmv/trend/date',
    method: 'post',
    data: params
  })
}

// 线下成交营收趋势图
export function getOfflineTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/offline/trend/date',
    method: 'post',
    data: params
  })
}

// 线上成交营收趋势图
export function getOnlineTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/online/trend/date',
    method: 'post',
    data: params
  })
}

// 退款趋势图
export function getRufundTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/refund/trend/date',
    method: 'post',
    data: params
  })
}

// 直播趋势图
export function getLiveTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/revenue/live/trend/date',
    method: 'post',
    data: params
  })
}

// 视频带货趋势图
export function getVideoTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/revenue/video/trend/date',
    method: 'post',
    data: params
  })
}

// 老师直播带货
export function getTeacherTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/teacher/live/trend/date',
    method: 'post',
    data: params
  })
}

// 总营收趋势图数据
export function getRevenueTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/trend/date',
    method: 'post',
    data: params
  })
}

// 私域直播趋势图
export function getPrivateTrendData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/private/live/trend/date',
    method: 'post',
    data: params
  })
}

// 获取部门数据方法 营收
export function getDeptLandscape(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/dept/landscape',
    method: 'post',
    data: params
  })
}

// 获取员工数据方法 营收
export function getEmployeeLandscape(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/employee/landscape',
    method: 'post',
    data: params
  })
}

// 获取部门数据的方法  业绩
export function getDailyPerfomanceDeptData(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/dept/detail/list',
    method: 'post',
    data: params
  })
}

// 获取部门员工数据  业绩
export function getDailyPerfomanceDetailYj(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/employee/detail/list',
    method: 'post',
    data: params
  })
}

// ip老师数据获取 营收
export function getIpDataList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/ip/landscape',
    method: 'post',
    data: params
  })
}

// 渠道数据获取方法
export function getChannelLandscape(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/channel/landscape',
    method: 'post',
    data: params
  })
}

// 店铺数据获取方法
export function getShopLandscape(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/shop/landscape',
    method: 'post',
    data: params
  })
}

// 营收排行榜 员工分页数据
export function getEmployeeRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/employeeRevenueRankList',
    method: 'post',
    data: params
  })
}

// 排行榜 部门数据
export function getRankDeptRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/deptRevenueRankList',
    method: 'post',
    data: params
  })
}

// 排行榜 商品数据
export function getRankProductRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/productRevenueRankList',
    method: 'post',
    data: params
  })
}

// 排行榜 达人数据
export function getRankExeprtRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/expertRevenueRankList',
    method: 'post',
    data: params
  })
}

// 个人数据榜单中  达人数据 营收
export function getExpertLandscapeForPerson(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/expert/landscape',
    method: 'post',
    data: params
  })
}

// 个人数据榜单中 达人数据 业绩
export function getDailyPerformanceExpert(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/expert/detail/list',
    method: 'post',
    data: params
  })
}

// 根据个人信息查询其部门信息
export function getDeptCategoryMess() {
  return request2({
    url: '/cloud/data-center/pcv2/dept-category/getDeptCategory',
    method: 'get'
  })
}

// 根据个人查询是企业管理员还是部门负责人 或者普通员工
export function getUserRoleType() {
  return request2({
    url: '/cloud/edata-user/sys/user/role/menu/getUserRoleType',
    method: 'get'
  })
}

// 营收排行榜 -部门 导出
export function uploadDeptRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/deptRevenueRankList/export',
    method: 'post',
    data: params
  })
}

// 营收排行榜 -员工 导出
export function uploadEmployeeRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/employeeRevenueRankList/export',
    method: 'post',
    data: params
  })
}

// 营收排行榜 -达人 导出
export function uploadExportRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/expertRevenueRankList/export',
    method: 'post',
    data: params
  })
}

// 营收排行榜 -商品 导出
export function uploadProductRevenueRankList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/rank/productRevenueRankList/export',
    method: 'post',
    data: params
  })
}

// 业绩  查询总业绩
export function getDailyPerformanceTotal(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/total',
    method: 'post',
    data: params
  })
}

// 业绩  查询直播带货
export function getDailyPerformanceVideo(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/video',
    method: 'post',
    data: params
  })
}

// 业绩  查询视频带货
export function getDailyPerformanceAnchorLive(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/live',
    method: 'post',
    data: params
  })
}

// 业绩 查询线下录单业绩
export function getDailyPerformanceOfflinePay(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/offlinePay',
    method: 'post',
    data: params
  })
}

// 业绩 查询线下录单业绩
export function getDailyPerformancePrivateLive(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/private/live',
    method: 'post',
    data: params
  })
}

// 获取部门数据  竖屏  用于chart 图的展示
export function getRevenueDeptVertical(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/dept/vertical',
    method: 'post',
    data: params
  })
}

// 获取部门数据的方法  业绩
export function getDailyPerfomanceDeptDataVertical(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/dept/vertical',
    method: 'post',
    data: params
  })
}

// 获取营收员工数据的chart 数据 竖屏
export function getRevenueEmployeeVertical(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/employee/vertical',
    method: 'post',
    data: params
  })
}

// 获取营收达人数据的chart 数据 竖屏
export function getRevenueExpertVertical(params) {
  return request2({
    url: '/cloud/data-center/pcv2/revenue/expert/vertical',
    method: 'post',
    data: params
  })
}

// 获取业绩的员工竖屏数据
export function getPerformanceEmployeeSimpleDetailList(params) {
  return request2({
    url: '/cloud/data-center/pcv2/daily-performance/employee/simple/detail/list',
    method: 'post',
    data: params
  })
}
