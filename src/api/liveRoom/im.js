import request from '@/utils/request2'

// 计算userSig
export function getUserSig(params) {
  return request({
    url: '/cloud/edata-live/tencentApi/userSig/calculate',
    method: 'get',
    params
  })
}

// 运营聊天室管理
// 编辑直播群公告、设置信息
export function editGroupInfo(data) {
  return request({
    url: '/cloud/edata-live/im/operation/group/info/edit',
    method: 'POST',
    data
  })
}
// 查询直播间在线人数
export function groupOnlineCount(params) {
  return request({
    url: '/cloud/edata-live/im/operation/group/online/count',
    method: 'get',
    params
  })
}
// 直播间人数调整
export function adjustGroupOnline(data) {
  return request({
    url: '/cloud/edata-live/im/operation/group/online/count/adjust',
    method: 'post',
    data
  })
}
// 学员观看直播记录
export function getUserJoinLogs(params) {
  return request({
    url: '/cloud/edata-live/im/operation/join/logs',
    method: 'get',
    params
  })
}
// 聊天列表
export function getLeftList(params) {
  return request({
    url: '/cloud/edata-live/im/operation/left/list',
    method: 'get',
    params
  })
}
// 学员听课信息记录
export function getUserListenLogs(params) {
  return request({
    url: '/cloud/edata-live/im/operation/listen/logs',
    method: 'get',
    params
  })
}
// 标记学员颜色
export function markUserColor(data) {
  return request({
    url: '/cloud/edata-live/im/operation/mark/color',
    method: 'POST',
    data
  })
}
// 对学员操作-禁言/解除禁言、拉黑并踢出/解除黑名单、自嗨/解除自嗨
export function userTrainee(data) {
  return request({
    url: '/cloud/edata-live/im/operation/operate/trainee',
    method: 'POST',
    data
  })
}
// 学员个人信息
export function getUserInfo(params) {
  return request({
    url: '/cloud/edata-live/im/operation/private/chat/trainee',
    method: 'get',
    params
  })
}
// 顶部区域
export function getTopArea(params) {
  return request({
    url: '/cloud/edata-live/im/operation/top/area',
    method: 'get',
    params
  })
}
// 修改学员备注
export function updateUserRemarks(data) {
  return request({
    url: '/cloud/edata-live/im/operation/update/remarks',
    method: 'POST',
    data
  })
}
// 根据学员昵称模糊搜索查询学员
export function getTraineeByName(params) {
  return request({
    url: '/cloud/edata-live/im/operation/trainee/byName',
    method: 'GET',
    params
  })
}
// 获取IM账号appKey，密匙等信息
export function getImOperationAccountInfo(params) {
  return request({
    url: '/cloud/edata-live/im/operation/account/info',
    method: 'GET',
    params
  })
}

// 查询互动脚本数据
export function getGroupScript(params) {
  return request({
    url: '/cloud/edata-live/im/operation/group/script/search',
    method: 'GET',
    params
  })
}

// 暂停互动、启动互动、互动延时、重启互动
export function operateInteract(data) {
  return request({
    url: '/cloud/edata-live/im/operation/group/interact/operate',
    method: 'POST',
    data
  })
}

// 查看学员视频观看记录
export function queryStudentVideoWatchRecord(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/intelligent/queryStudentVideoWatchRecord',
    method: 'POST',
    data
  })
}

// 紧急下课
export function urgentEndClass(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/urgentEndClass',
    method: 'GET',
    params
  })
}

// 根据直播间ID获取当前时刻是否有抽奖
export function checkDraw(params) {
  return request({
    url: '/cloud/edata-live/im/operation/check/draw',
    method: 'GET',
    params
  })
}

// 获取抽奖倒计时信息
export function getDrawCountdown(params) {
  return request({
    url: '/cloud/edata-live/im/operation/draw/countdown',
    method: 'GET',
    params
  })
}

// 获取抽奖参与人数
export function getDrawParticipateCount(params) {
  return request({
    url: '/cloud/edata-live/im/operation/draw/participate/count',
    method: 'GET',
    params
  })
}

// 提前开奖
export function drawPrizeAhead(data) {
  return request({
    url: '/cloud/edata-live/im/operation/draw/prize/ahead',
    method: 'POST',
    data
  })
}

// 发送抽奖
export function sendPrizeDraw(data) {
  return request({
    url: '/cloud/edata-live/im/operation/send/prize/draw',
    method: 'POST',
    data
  })
}

// 查询学员再该直播间白名单信息
export function getWhiteListInfo(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/whiteList/info',
    method: 'get',
    params
  })
}

// 编辑白名单
export function editWhiteListInfo(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/whiteList/edit',
    method: 'POST',
    data
  })
}

// 获取历史聊天记录
export function chatRecordPageAjax(data) {
  return request({
    url: '/cloud/edata-live/im/operation/chatRecordPage',
    method: 'POST',
    data
  })
}

// 撤回群消息
export function groupMsgRecallAjax(data) {
  return request({
    url: '/cloud/edata-live/im/operation/groupMsgRecall',
    method: 'POST',
    data
  })
}

// 获取当前用户的别名
export function getUserAli() {
  return request({
    url: '/cloud/edata-live/teacherManager/getLoginUserLiveRoomAlias',
    method: 'POST'
  })
}

// 获取直播间我的学员离线列表
export function mymemberoffline(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/offline/my',
    method: 'get',
    params
  })
}

// 获取直播间普通学员离线列表
export function normalmemberoffline(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/offline/normal',
    method: 'get',
    params
  })
}

// 获取直播间我的学员在线列表
export function mymemberonline(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/online/my',
    method: 'get',
    params
  })
}

// 获取直播间普通学员在线列表
export function normalmemberonline(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/online/normal',
    method: 'get',
    params
  })
}

// 获取直播间在线老师列表
export function teacheronline(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/online/teacher',
    method: 'get',
    params
  })
}

// 获取直播间成员信息
export function getLiveRoomMemberInfo(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/member/info',
    method: 'get',
    params
  })
}
