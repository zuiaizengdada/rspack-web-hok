import request from '@/utils/request2'

// 通用设置-助教管理
export function liveRoomTutorPage(data) {
  return request({
    url: '/cloud/edata-live/teacherManager/page',
    method: 'POST',
    data
  })
}

// 通用设置-助教管理-编辑助教
export function editliveRoomTutor(data) {
  return request({
    url: '/cloud/edata-live/teacherManager/teacherManagerEdit',
    method: 'POST',
    data
  })
}

// B端查询手机号
export function sysUserWrite(data) {
  return request({
    url: '/cloud/edata-live/operationLogs/sysUserWrite',
    method: 'POST',
    data
  })
}

// 查询敏感词设置
export function getSensitiveSettingsAjax(params) {
  return request({
    url: `/cloud/edata-live/sensitive/get/settings`,
    method: 'get',
    params
  })
}

// 修改敏感词设置
export function upDateSensitiveSettingsAjax(params) {
  return request({
    url: `/cloud/edata-live/sensitive/modify/settings`,
    method: 'get',
    params
  })
}

// 查询敏感词列表
export function getLiveSensitivePageAjax(params) {
  return request({
    url: `/cloud/product/live/sensitive/page`,
    method: 'get',
    params
  })
}
// c端查询敏感词列表
export function getSensitiveList(params) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/page`,
    method: 'get',
    params
  })
}
// 新增c端查询敏感词列表
export function addSensitiveList(data) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/add`,
    method: 'POST',
    data
  })
}
// 修改c端查询敏感词列表
export function updateSensitiveList(data) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/modify`,
    method: 'put',
    data
  })
}

// 删除c端查询敏感词列表
export function deleteSensitiveList(id) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除c端敏感词
export function batchDeleteSensitiveList(data) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/delete/batch`,
    method: 'DELETE',
    data
  })
}

// 敏感词导入
export function importSensitiveList(data) {
  return request({
    url: `/cloud/admin/pf/user/sensitive/import`,
    method: 'post',
    data
  })
}

// 修改敏感词列表
export function upDateLiveSensitiveAjax(data) {
  return request({
    url: `/cloud/product/live/sensitive/modify`,
    method: 'put',
    data
  })
}
// 删除敏感词列表
export function deleteLiveSensitiveAjax(id) {
  return request({
    url: `/cloud/product/live/sensitive/delete/${id}`,
    method: 'DELETE'
  })
}
// 批量删除敏感词
export function batchDeleteLiveSensitiveAjax(data) {
  return request({
    url: `/cloud/product/live/sensitive/batchDelete`,
    method: 'DELETE',
    data
  })
}
// 新增敏感词列表
export function addLiveSensitiveAjax(data) {
  return request({
    url: `/cloud/product/live/sensitive/add`,
    method: 'post',
    data
  })
}
// 敏感词导入
export function importLiveSensitiveAjax(data) {
  console.log(data)
  return request({
    url: `/cloud/product/live/sensitive/import`,
    method: 'post',
    data
  })
}

// 新增抽奖
export function addPrize(data) {
  return request({
    url: `/cloud/edata-live/prize/add`,
    method: 'post',
    data
  })
}
// 抽奖设置详情
export function getPrizeDetail(params) {
  return request({
    url: `/cloud/edata-live/prize/detail`,
    method: 'GET',
    params
  })
}
// 抽奖失效
export function disabledPrize(data) {
  return request({
    url: `/cloud/edata-live/prize/disabled`,
    method: 'post',
    data
  })
}
// 编辑抽奖
export function editPrize(data) {
  return request({
    url: `/cloud/edata-live/prize/edit`,
    method: 'post',
    data
  })
}
// 抽奖设置列表
export function getPrizeList(params) {
  return request({
    url: `/cloud/edata-live/prize/list`,
    method: 'get',
    params
  })
}
// 有效抽奖列表
export function getPrizeListEffective(params) {
  return request({
    url: `/cloud/edata-live/prize/list/effective`,
    method: 'get',
    params
  })
}
// 发货详情
export function prizeLogisticDetail(params) {
  return request({
    url: `/cloud/edata-live/prize/logistic/detail`,
    method: 'get',
    params
  })
}
// 物流信息更新
export function updatePrizeLogistic(data) {
  return request({
    url: `/cloud/edata-live/prize/logistic/update`,
    method: 'post',
    data
  })
}
// 直播间是否允许同一个人重复中奖设置
export function prizeRepeatWinner(data) {
  return request({
    url: `/cloud/edata-live/prize/repeat/winner`,
    method: 'post',
    data
  })
}
// 中奖名单
export function prizeWinnerlist(params) {
  return request({
    url: `/cloud/edata-live/prize/winner/list`,
    method: 'get',
    params
  })
}
// 导出名单
export function prizeWinnersExport(params) {
  return request({
    url: `/cloud/edata-live/prize/winners/export`,
    method: 'get',
    params
  })
}

// 直播间老师白名单列表
export function getWhiteListPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/whiteList/teacher/page',
    method: 'POST',
    data
  })
}

// 编辑直播间老师白名单
export function editWhiteList(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/whiteList/teacher/edit',
    method: 'POST',
    data
  })
}

// 域名设置相关接口
// 获取当前机构所有域名配置信息
export function getLiveRoomOrgConfig(params) {
  return request({
    url: '/cloud/edata-live/domainConfig/getAllMainConfig',
    method: 'GET',
    params
  })
}

// 保存1级域名配置信息
export function saveOneDomainConfig(data) {
  return request({
    url: '/cloud/edata-live/domainConfig/saveOneDomainConfig',
    method: 'POST',
    data
  })
}

// 保存2级域名配置信息
export function saveTwoDomainConfig(data) {
  return request({
    url: '/cloud/edata-live/domainConfig/saveTwoDomainConfig',
    method: 'POST',
    data
  })
}

// 生成邀课链接-新
export function buildInviteUrlNew(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/buildInviteUrlNew',
    method: 'get',
    params
  })
}

// 生成邀课链接-新-v2版本
export function buildInviteUrlNewV2(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/buildInviteUrlNew',
    method: 'get',
    params
  })
}

// 获取域名地址
export function getAllMainConfigByLiveRoomId(params) {
  return request({
    url: '/cloud/edata-live/domainConfig/getAllMainConfigByLiveRoomId',
    method: 'get',
    params
  })
}

// 查询加热直播间列表
export function getHeatLiveRoomPage(params) {
  return request({
    url: '/cloud/edata-live/heatLiveRoom/page',
    method: 'get',
    params
  })
}

// 禁止加热
export function forbidheatLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/heatLiveRoom/forbid',
    method: 'POST',
    data
  })
}

// 停止加热
export function stopheatLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/heatLiveRoom/stop',
    method: 'POST',
    data
  })
}

// 获取机构列表
export function getOrgList() {
  return request({
    url: '/cloud/edata-live/heatLiveRoom/org',
    method: 'get'
  })
}

// 获取机器人发送消息指令
export function getSendMessageCmd() {
  return request({
    url: '/cloud/edata-live/robot/sendMessageCmd/get',
    method: 'get'
  })
}
// 保存机器人发送消息指令
export function saveSendMessageCmd(data) {
  return request({
    url: '/cloud/edata-live/robot/sendMessageCmd/save',
    method: 'POST',
    data
  })
}

export function sendMessage(data) {
  return request({
    url: '/cloud/edata-live/robot/message/send',
    method: 'POST',
    data
  })
}

// 用户观看直播记录
export function getWatchHistoryByPhone(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/user/record/getWatchHistoryByPhone',
    method: 'get',
    params
  })
}

// 根据直播名称等条件模糊查询直播列表
export function getLiveListByConditions(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/getLiveListByConditions',
    method: 'POST',
    data
  })
}

// 根据直播间ID查询直播间白名单信息
export function getLiveRoomPassUserInfo(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/getLiveRoomPassUserInfo',
    method: 'get',
    params
  })
}

// 复制直播间人员
export function copyWhiteList(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/userLimit/copyWhiteList',
    method: 'POST',
    data
  })
}

// 中控台设置
// 获取直播间默认配置
export function getDefaultConfigApi(params) {
  return request({
    url: '/cloud/edata-live/defaultConfig/get',
    method: 'get',
    params
  })
}
// 更新直播间默认配置
export function upfDefaultConfigApi(data) {
  return request({
    url: '/cloud/edata-live/defaultConfig/update',
    method: 'post',
    data
  })
}
// 获取订单通知配置
export function getNoticeConfigApi(params) {
  return request({
    url: '/cloud/edata-live/NoticeConfig/get',
    method: 'get',
    params
  })
}
// 更新直播间默认配置
export function upfNoticeConfigApi(data) {
  return request({
    url: '/cloud/edata-live/NoticeConfig/update',
    method: 'post',
    data
  })
}

// 查询直播间操作日志
export function operationQueryApi(data) {
  return request({
    url: '/cloud/edata-live/operationLog/query ',
    method: 'post',
    data
  })
}

