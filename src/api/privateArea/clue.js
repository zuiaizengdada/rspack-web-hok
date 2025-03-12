// 线索管理
import request from '@/utils/request2'

// 修改线索备注
export function updateRemark(data) {
  return request({
    url: '/cloud/edata-sale/clue/updateRemark',
    method: 'POST',
    data
  })
}

// 分页查询线索列表
export function getCluePageList(data) {
  return request({
    url: '/cloud/edata-sale/clue/cluePageList',
    method: 'post',
    data
  })
}

// 线索-个人标签增加
export function setInsertTag(data) {
  return request({
    url: '/cloud/edata-sale/clue/personTag/insert',
    method: 'post',
    data
  })
}
// 控制查询条件展示
export function queryShopReceiver() {
  return request({
    url: '/cloud/edata-sale/clue/queryShopReceiver',
    method: 'get'
  })
}

// 线索-更新线索有效性
export function updateAvailable(data) {
  return request({
    url: '/cloud/edata-sale/clue/available/update',
    method: 'post',
    data
  })
}

// 线索-个人标签删除
export function deleteTag(params) {
  return request({
    url: '/cloud/edata-sale/clue/personTag/delete',
    method: 'get',
    params
  })
}
// 详情-学员详情
export function getFollowExternalUserInfo(params) {
  return request({
    url: '/cloud/edata-sale/clue/followExternalUserInfo',
    method: 'GET',
    params
  })
}
// 更换跟进人进度
export function editFollowUserSpeed(params) {
  return request({
    url: '/cloud/edata-sale/clue/editFollowUserSpeed',
    method: 'GET',
    params
  })
}
// 获取线索短信
export function getMsg(clueId) {
  return request({
    url: `/cloud/edata-sale/clue/get/msg/${clueId}`,
    method: 'GET'
  })
}
// 发送短信
export function sendMsg(data) {
  return request({
    url: `/cloud/edata-sale/clue/send/msg`,
    method: 'POST',
    data
  })
}

// 获取短息模板列表
export function getMsgTemplateList(params) {
  return request({
    url: `/cloud/edata-sale/template/get/sms`,
    method: 'GET',
    params
  })
}

// 分页查询线索用户直播列表
export function getClueLivePage(data) {
  return request({
    url: `/cloud/edata-sale/clue/user/live/page`,
    method: 'POST',
    data
  })
}
// 修改微信昵称
export function updateWechatNickName(data) {
  return request({
    url: `/cloud/edata-sale/clue/updateWechatNickName`,
    method: 'POST',
    data
  })
}
// 详情-操作日志
export function followUserUpdateLogPageList(data) {
  return request({
    url: '/cloud/edata-sale/clue/followUserUpdateLogPageList',
    method: 'POST',
    data
  })
}

// 详情-学员动态
export function userDynamics(data) {
  return request({
    url: '/cloud/edata-sale/clue/userDynamics',
    method: 'POST',
    data
  })
}

// 更换跟进人
export function editFollowUser(data) {
  return request({
    url: '/cloud/edata-sale/clue/editFollowUser',
    method: 'POST',
    data
  })
}
// 新增跟进状态
export function addFollowType(data) {
  return request({
    url: '/cloud/edata-sale/clue/follow/type/add',
    method: 'POST',
    data
  })
}
// 修改跟进状态
export function editFollowType(data) {
  return request({
    url: '/cloud/edata-sale/clue/follow/type/update',
    method: 'PUT',
    data
  })
}
// 删除跟进状态
export function deleteFollowType(id) {
  return request({
    url: `/cloud/edata-sale/clue/follow/type/delete/${id}`,
    method: 'DELETE'
  })
}

// 部分导出线索列表
export function downCluePartPageList(data) {
  return request({
    url: '/cloud/edata-sale/clue/exportPartClue',
    method: 'POST',
    data
  })
}

// 短信群发
export function clueSendMsgBatch(data) {
  return request({
    url: '/cloud/edata-sale/clue/send/msg/batch',
    method: 'POST',
    data
  })
}

/**
 *@Summary 查询用户收藏列表
 *
 * @param {*} data
 * @return {*}
 */
export const getOrderReceiver = data => {
  return request({
    url: '/cloud/admin/order-receiver-do',
    method: 'POST',
    data
  })
}

// 跟进状态列表
export function getFollowTypePage(params) {
  return request({
    url: '/cloud/edata-sale/clue/follow/type/page',
    method: 'get',
    params
  })
}

// 导出全部线索列表
export function downCluePageList(params) {
  return request({
    url: '/cloud/edata-sale/clue/cluePageList',
    method: 'get',
    params
  })
}

// 添加跟进记录
export function addClueFollowRecord(data) {
  return request({
    url: '/cloud/edata-sale/clue/addClueFollowRecord',
    method: 'POST',
    data
  })
}

// 查询聊天记录
export function getWechatTalkPage(params) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/talk/page',
    method: 'GET',
    params
  })
}

// 手动同步聊天记录
export function syncWechatTalk(data) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/talk/sync',
    method: 'POST',
    data
  })
}

// 编辑加微状态
export function editIsAddGw(data) {
  return request({
    url: '/cloud/edata-sale/clue/editIsAddGw',
    method: 'post',
    data
  })
}

// 查询群组
export function getGroupList(params) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/group/list',
    method: 'GET',
    params
  })
}

// 手动同步群组
export function syncWechatGroup() {
  return request({
    url: '/cloud/edata-sale/biz/wechat/group/sync',
    method: 'POST'
  })
}
// 详情列表
export function clueStatOrderList(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/stat/order/list',
    method: 'POST',
    data
  })
}
// 数据渠道来源下拉列表
export function getSelectListChannel(params) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectListChannel',
    method: 'GET',
    params
  })
}

// 来源老师下拉列表
export function getSelectListTeacher(params) {
  return request({
    url: '/cloud/edata-sale/clueStatHour/selectListTeacher',
    method: 'GET',
    params
  })
}

// 数据看板-数据概况
export function getTaskSelectData(data) {
  return request({
    url: '/cloud/edata-sale/task/stat/selectData',
    method: 'POST',
    data
  })
}

// 数据看板-跟进人数据汇总
export function getTaskFollowerDetail(data) {
  return request({
    url: '/cloud/edata-sale/task/stat/follower/detail',
    method: 'POST',
    data
  })
}

// 数据看板-占比
export function getTaskSelectRatio(data) {
  return request({
    url: '/cloud/edata-sale/task/stat/selectRatio',
    method: 'POST',
    data
  })
}

// 根据线索Id获取微信备注名
export function clueRemark(clueId) {
  return request({
    url: `/cloud/edata-sale/clue/remark/get/${clueId}`,
    method: 'POST'
  })
}

// 线索意向 - 列表
export function getIntentConfigPage(data) {
  return request({
    url: `/cloud/edata-sale/clue/intent/config/page`,
    method: 'POST',
    data
  })
}

// 线索意向 - 列表 - 删除
export function deleteIntentConfig(params) {
  return request({
    url: `/cloud/edata-sale/clue/intent/config/delete`,
    method: 'GET',
    params
  })
}

// 线索意向 - 列表 - 保存
export function saveIntentConfigPage(data) {
  return request({
    url: `/cloud/edata-sale/clue/intent/config/save`,
    method: 'POST',
    data
  })
}

// 线索意向 - 列表 - 更新
export function updateIntentConfig(data) {
  return request({
    url: `/cloud/edata-sale/clue/intention/update`,
    method: 'POST',
    data
  })
}

// 分页查询线索列表
export function publicHighSeasPageList(data) {
  return request({
    url: `/cloud/edata-sale/highSeasClue/cluePageList`,
    method: 'POST',
    data
  })
}
// 分配公海线索
export function publicHighSeasAssignClue(data) {
  return request({
    url: `/cloud/edata-sale/highSeasClue/assignClue`,
    method: 'POST',
    data
  })
}
export function getHighSeasClueEmail(clueId) {
  return request({
    url: `/cloud/edata-sale/highSeasClue/email/get/${clueId}`,
    method: 'post'
  })
}
export function assignClueData(data) {
  return request({
    url: `/cloud/edata-sale/highSeasClue/assignClue/data`,
    method: 'post',
    data
  })
}

export function editFollowUserBefore(data) {
  return request({
    url: `/cloud/edata-sale/clue/editFollowUserBefore`,
    method: 'post',
    data
  })
}
// 直接更换跟进人
export function editFollowUserDirect(data) {
  return request({
    url: `/cloud/edata-sale/clue/editFollowUserDirect`,
    method: 'post',
    data
  })
}
