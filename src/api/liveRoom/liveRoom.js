import request from '@/utils/request2'
import request3 from '@/utils/request3'

/* 直播间中控台的请求 */

// 直播间新增敏感词
export function sensitiveGroupAdd(data) {
  return request({
    url: '/cloud/hok-sensitive-words/sensitiveGroup/add',
    method: 'POST',
    data
  })
}

// 直播间成交金额
export function liveOverview(params) {
  return request({
    url: '/cloud/edata-live/centerConsoleStats/liveOverview',
    method: 'get',
    params
  })
}

// 查询当前登录人部门链
export function queryUserDeptChain(params) {
  return request({
    url: '/cloud/edata-live/employeePerformance/queryUserDeptChain',
    method: 'get',
    params
  })
}
// 直播间成交金额-团队
export function teamOverview(params) {
  return request({
    url: '/cloud/edata-live/centerConsoleStats/teamOverview',
    method: 'get',
    params
  })
}

// 直播间成交金额-个人
export function personalOverview(params) {
  return request({
    url: '/cloud/edata-live/centerConsoleStats/personalOverview',
    method: 'get',
    params
  })
}

// 直播间新建加热
export function liveRoomHeatCreate(data) {
  return request3({
    url: '/cloud/edata-live/liveRoom/heat/create',
    method: 'POST',
    data
  }, true, true)
}

// 获取本场商品点击
export function liveRoomGoodsClick(params) {
  return request({
    url: '/cloud/edata-live/im/operation/queryGoodsInfoClickCount',
    method: 'get',
    params
  })
}
// 获取本场商品点击
export function liveQueryGoodsInfoClickCount(params) {
  return request({
    url: '/cloud/edata-live/im/operation/v2/queryGoodsInfoClickCount',
    method: 'get',
    params
  })
}

// 获取本场领券记录
export function liveRoomCouponLog(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/pageCouponRecords',
    method: 'POST',
    data
  })
}

// 获取历史听课记录
export function liveRoomListeningRecord(params) {
  return request({
    url: '/cloud/edata-live/im/operation/join/logs',
    method: 'get',
    params
  })
}

// 获取历史购买记录
export function historicalPurchaseRecords(params) {
  return request({
    url: '/cloud/admin/goods/order/page',
    method: 'get',
    params
  })
}

// 获取本场外呼记录
export function liveRoomCallPage(data) {
  return request({
    url: '/cloud/edata-live/call/page',
    method: 'POST',
    data
  })
}

// 获取直播间助教
export function querytutor(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/tutorPage',
    method: 'POST',
    data
  })
}

// 获取直播间对应记忆的code  LIVE_ROOM_MARKETING_TOOLS_TAB: 营销工具记忆 LIVE_ROOM_ATTENDANCE_RATE_SELECTOR: 到课率切换记忆
export function getPersonSetUpRecord(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/value',
    method: 'POST',
    data
  })
}

// 保存对应记忆功能点
export function savePersonSetUpRecord(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/save',
    method: 'POST',
    data
  })
}

// 海报相关
// 新增海报
export function posterSetupAdd(data) {
  return request({
    url: '/cloud/edata-live/posterSetup/add',
    method: 'POST',
    data
  })
}
// 删除海报
export function delPoster(params) {
  return request({
    url: '/cloud/edata-live/posterSetup/del',
    method: 'DELETE',
    params
  })
}

// 海报详情
export function posterSetupDetail(data) {
  return request({
    url: '/cloud/edata-live/posterSetup/detail',
    method: 'POST',
    data
  })
}
// 查询自己的海报列表
export function getMyPosterSetupList(params) {
  return request({
    url: '/cloud/edata-live/posterSetup/my/list',
    method: 'get',
    params
  })
}
// 设置默认海报
export function setPosterDefault(data) {
  return request({
    url: '/cloud/edata-live/posterSetup/selectPoster',
    method: 'POST',
    data
  })
}

// H获取当前设置的默认海报
export function getDefaultPoster() {
  return request({
    url: '/cloud/edata-live/posterSetup/getDefault',
    method: 'get'
  })
}

// 直播2.0-聊天列表
export function leftUserList(params, cancelToken) {
  return request({
    url: '/cloud/edata-live/im/operation/left/user/list',
    method: 'GET',
    params,
    cancelToken
  })
}

// 跟课记录相关
// 新增标记
export function addMark(data) {
  return request({
    url: '/cloud/edata-live/followClassRecord/addMark',
    method: 'POST',
    data
  })
}

// 删除标记
export function delMark(data) {
  return request({
    url: '/cloud/edata-live/followClassRecord/delMark',
    method: 'DELETE',
    data
  })
}

// 跟课记录列表查询
export function followClassRecordList(data) {
  return request({
    url: '/cloud/edata-live/followClassRecord/list',
    method: 'POST',
    data
  })
}

// 标记详情
export function markDetail(data) {
  return request({
    url: '/cloud/edata-live/followClassRecord/markDetail',
    method: 'POST',
    data
  })
}

// 修改标记
export function editModifyMark(data) {
  return request({
    url: '/cloud/edata-live/followClassRecord/modifyMark',
    method: 'POST',
    data
  })
}

// 外呼相关
// 呼叫，返回呼叫记录编号
export function callPhone(data) {
  return request3({
    url: '/cloud/edata-live/call/call',
    method: 'POST',
    data
  }, true, true)
}

// 呼叫，通过手机号码呼叫，返回呼叫记录编号
export function callByPhone(data) {
  return request3({
    url: '/cloud/edata-live/call/callByPhone',
    method: 'POST',
    data
  }, true, true)
}

// 检查是否具备拨打权限true为有权限，data直接返回true或者false
export function callEnable(params) {
  return request({
    url: '/cloud/edata-live/call/call/enable',
    method: 'get',
    params
  })
}

// 获取拨打电话状态，1：等待中 2: 呼叫中 3: 通话中 4: 已结束
export function getCallStatus(liveCallRecordId) {
  return request({
    url: `/cloud/edata-live/call/call/status/${liveCallRecordId}`,
    method: 'get'
  })
}

// 取消拨打电话
export function cancelCall(data) {
  return request({
    url: `/cloud/edata-live/call/cancelCall`,
    method: 'post',
    data
  })
}

// 挂断电话
export function callHungUp(data) {
  return request({
    url: '/cloud/edata-live/call/hung/up',
    method: 'POST',
    data
  })
}

// 获取当前登录人是否为负责人的状态
export function queryEmployeeType() {
  return request({
    url: '/cloud/edata-live/employeePerformance/queryEmployeeType',
    method: 'get'
  })
}

// 获取直播间商品数据
export function getLiveRoomGoods(params) {
  return request({
    url: '/cloud/edata-live/oneLiveRoomReport/goods',
    method: 'get',
    params
  })
}

// 下一场直播间预告
export function getNextLivePreviewList(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/nextLivePreviewList',
    method: 'get',
    params
  })
}
// 下一场直播预告查询
export function nextLivePreview(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/nextLivePreview',
    method: 'POST',
    data
  })
}

// 计划看播用户的学员搜索
export function searchStudent(data) {
  return request({
    url: '/cloud/edata-live/student/searchStudent',
    method: 'POST',
    data
  })
}

// 直播间关联任务查询
export function liveRoomTaskList(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/planWatchUser/liveRoomTaskList',
    method: 'GET',
    params
  })
}
