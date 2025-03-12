import request from '@/utils/request2'
import request3 from '@/utils/request3'

// 获取直播间列表
export function getLiveRoomList(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/page',
    method: 'POST',
    data
  })
}

// 所有机构直播间列表查询
export function getPlatformLiveRoomList(data) {
  return request({
    url: '/cloud/edata-live/platform/liveRoom/page',
    method: 'POST',
    data
  })
}

// 我的直播间列表
export function getMyLiveRoom(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/getMeLiveRoomList',
    method: 'get',
    params
  })
}

// 获取邀课链接
export function getInviteInfo() {
  return request({
    url: '/cloud/edata-live/liveRoom/getInviteInfo',
    method: 'get'
  })
}

// 新增直播间
export function addLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/add',
    method: 'POST',
    data
  })
}

// 编辑直播间
export function editLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/edit',
    method: 'POST',
    data
  })
}

// 编辑直播间
export function editLiveRoomV2(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/editV2',
    method: 'post',
    data
  })
}

// 删除直播间
export function delLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/disabled',
    method: 'POST',
    data
  })
}

// 直播详情接口
// 聊天记录分页查询
export function chatRecordPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/chatRecordPage',
    method: 'post',
    data
  })
}
// 用户记录导出
export function userRecordPageImport(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/userRecordPageImport',
    method: 'GET',
    params
  })
}

// 直播间详情查询
export function getLiveRoomInfo(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/get',
    method: 'get',
    params
  })
}

// 设置优惠券
export function setCouponStyle(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/setCouponStyle',
    method: 'post',
    data
  })
}

// 设置签到样式
export function setSignStyle(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/setSignStyle',
    method: 'post',
    data
  })
}

// 回放设置分页查询-真人直播
export function getPlaybackRecordPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/playbackRecordPage',
    method: 'post',
    data
  })
}

// 回放设置分页查询-数字直播
export function getPlaybackRecordDigAjax(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/playbackRecord/digitization',
    method: 'get',
    params
  })
}
// 购买记录分页查询
export function getPurchaseRecordPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/purchaseRecordPage',
    method: 'post',
    data
  })
}
// 用户记录分页查询
export function getUserRecordPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/userRecordPage',
    method: 'post',
    data
  })
}
// 用户记录分页查询
export function getUserRecordPageV2(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/v2/userRecordPage',
    method: 'post',
    data
  })
}

// 商品信息管理
// 直播带货分页查询
export function getGoodsPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/goodsPage',
    method: 'POST',
    data
  })
}

// 商品拖动排序修改
export function editSortGoods(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/editSort',
    method: 'POST',
    data
  })
}

// 商品上下架
export function editShelfStatus(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/editShelfStatus',
    method: 'POST',
    data
  })
}

// 推送商品更新信息
export function pushGoodsEditInfo(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/pushGoodsEditInfo',
    method: 'POST',
    data
  })
}

// 商品批量新增
export function addLiveRoomGoods(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/addGoods',
    method: 'POST',
    data
  })
}

// 商品移除
export function removeLiveRoomGoods(params) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/remove',
    method: 'get',
    params
  })
}

// 获取回放记录下载地址
export function getDownLoadUrl(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/getDownloadUrl',
    method: 'get',
    params
  })
}

// 根据直播间ID模糊查询脚本下的用户
export function getRobotListByRoomId(params) {
  return request({
    url: '/cloud/edata-live/im/operation/interact/robot/list',
    method: 'GET',
    params
  })
}

// 选择机器人发送实时脚本消息
export function sendRobotMsg(data) {
  return request({
    url: '/cloud/edata-live/im/operation/group/robot/msg',
    method: 'POST',
    data
  })
}

// 直播间脚本导出
export function exportScript(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/script/export',
    method: 'GET',
    params
  })
}

// 查询用户是否可以进入直播间
export function canEnterLiveRoom(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/enter/authority',
    method: 'GET',
    params
  })
}

// 直播间连麦记录
export function getVoiceChatRecord(params) {
  return request({
    url: '/cloud/edata-live/voiceChat/voiceChatRecord',
    method: 'GET',
    params
  })
}

// 重启任务
export function restartTask(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/restartTask',
    method: 'POST',
    data
  })
}

// 赠品管理列表
export function giftList(params) {
  return request({
    url: '/cloud/edata-live/gift/list',
    method: 'get',
    params
  })
}
// 新增赠品
export function giftAdd(data) {
  return request({
    url: '/cloud/edata-live/gift/add',
    method: 'POST',
    data
  })
}
// 删除赠品
export function giftDelete(data) {
  return request({
    url: '/cloud/edata-live/gift/delete',
    method: 'POST',
    data
  })
}

// 发货详情
export function getPrizeLogisticDetail(params) {
  return request({
    url: '/cloud/edata-live/prize/logistic/detail',
    method: 'get',
    params
  })
}

// 物流信息更新
export function updatePrizeLogistic(data) {
  return request({
    url: '/cloud/edata-live/prize/logistic/update',
    method: 'POST',
    data
  })
}

// 添加优惠券
export function liveRoomcouponadd(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/add',
    method: 'POST',
    data
  })
}

// 添加优惠-用户可选择优惠券列表
export function getliveRoomcouponaddList(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/addlist',
    method: 'get',
    params
  })
}

// 删除优惠券
export function liveRoomcoupondelete(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/delete',
    method: 'POST',
    data
  })
}

// 导出优惠券领取记录
export function liveRoomCouponexportGetLog(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/exportGetLog',
    method: 'get',
    params
  })
}

// 直播间优惠券领取记录
export function liveRoomCouponGetLog(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/getLog',
    method: 'get',
    params
  })
}

// 直播间已关联优惠券列表
export function liveRoomCouponList(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/list',
    method: 'get',
    params
  })
}

// 修改优惠券名称
export function couponModifyCouponName(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/modifyCouponName',
    method: 'POST',
    data
  })
}

// 撤销优惠券
export function couponRevoke(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/revoke',
    method: 'POST',
    data
  })
}

// 发送优惠券
export function couponSend(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/send',
    method: 'POST',
    data
  })
}

// 查询直播间关联脚本是否有更新
export function getUpdateScript(liveRoomId) {
  return request({
    url: `/cloud/edata-live/script/check/update/${liveRoomId}`,
    method: 'get'
  })
}

// 更新最新脚本
export function updateNeweScript(data) {
  return request({
    url: `/cloud/edata-live/script/newest/update`,
    method: 'POST',
    data
  })
}

// 直播间订单小红点:查询是否有新消息
export function orderRemindNewRemind(params) {
  return request({
    url: `/cloud/edata-live/orderRemind/newRemind`,
    method: 'get',
    params
  })
}

// 直播间订单小红点:读消息
export function orderRemindRead(data) {
  return request({
    url: `/cloud/edata-live/orderRemind/read`,
    method: 'POST',
    data
  })
}

// 新增暖场素材
export function addWarmUpMaterial(data) {
  return request({
    url: `/cloud/edata-live/warmUpMaterial/add`,
    method: 'POST',
    data
  })
}

// 素材是否存在
export function checkExistence(data) {
  return request({
    url: `/cloud/edata-live/warmUpMaterial/checkExistence`,
    method: 'POST',
    data
  })
}

// 删除暖场素材
export function deleteWarmUpMaterial(data) {
  return request({
    url: `/cloud/edata-live/warmUpMaterial/delete`,
    method: 'POST',
    data
  })
}

// 编辑暖场素材
export function editWarmUpMaterial(data) {
  return request({
    url: `/cloud/edata-live/warmUpMaterial/edit`,
    method: 'POST',
    data
  })
}

// 暖场素材列表
export function warmUpMaterialList(params) {
  return request({
    url: `/cloud/edata-live/warmUpMaterial/list`,
    method: 'get',
    params
  })
}

// 查询直播间订单信息
export function queryLiveRoomOrderPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/queryLiveRoomOrderPage',
    method: 'POST',
    data
  })
}

// 撤回商品推送商品
export function withdrawPushGoods(data) {
  return request({
    url: '/cloud/edata-live/liveRoomGoodsManage/withdrawPushGoods',
    method: 'POST',
    data
  })
}
// 回放记录设置详情
export function getPlaybackSetDetailAjax(params) {
  return request({
    url: `/cloud/edata-live/liveRoomInfo/playbackSet/detail`,
    method: 'get',
    params
  })
}
// 回放记录设置
export function playbackSetAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/playbackSet',
    method: 'POST',
    data
  })
}
// 回放记录设置 数字直播
export function playbackSet2(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/v2/playbackSet',
    method: 'POST',
    data
  })
}

// 直播间B端操作日志
export function operationLogsWriteAjax(data) {
  return request({
    url: '/cloud/edata-live/operationLogs/write',
    method: 'POST',
    data
  })
}

// 获取直播项目OSS配置
export function getLiveOssCConfig() {
  return request({
    url: '/cloud/edata-live/upload/file/ossConfig',
    method: 'get'
  })
}

// 查询登录者机构是否启用了讲师模块，true 启用，false 未启用
export function getEnableLecturer() {
  return request({
    url: '/cloud/edata-live/liveRoomConfig/enableLecturer',
    method: 'GET'
  })
}

// 购买记录导出
export function purchaseRecordExport(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/purchaseRecordExport',
    method: 'POST',
    data
  })
}
// 圆桌会议设置主持人
export function operateHostTeacherAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/teacher/operate',
    method: 'POST',
    data
  })
}
// 圆桌会议开启-关闭
export function setRoundTableAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/roundTable/set',
    method: 'POST',
    data
  })
}

// 圆桌会议编辑老师(新增，删除)
export function editHostTeacherAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/teacher/edit',
    method: 'POST',
    data
  })
}

// 获取直播间机构配置信息
export function getLiveRoomOrgConfig(params) {
  return request({
    url: '/cloud/edata-live/liveRoomConfig/getLiveRoomOrgConfig',
    method: 'get',
    params
  })
}

// 新增/修改直播间机构配置信息
export function saveOrUpdate(data) {
  return request({
    url: '/cloud/edata-live/liveRoomConfig/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 查询学员的商品点击次数
export function queryGoodsInfoClickCount(params) {
  return request({
    url: '/cloud/edata-live/im/operation/queryGoodsInfoClickCount',
    method: 'get',
    params
  })
}

// 学员优惠券领取记录
export function queryCouponRecords(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/coupon/couponRecords',
    method: 'get',
    params
  })
}

// 复制直播间
export function copyLiveRoomApi(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/copy',
    method: 'post',
    data
  })
}

// 脚本时间调整
export function scriptTimeModify(data) {
  return request({
    url: '/cloud/edata-live/script/scriptTime/modify',
    method: 'post',
    data
  })
}

// 直播间聊天记录导出
export function chatRecordExportAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/chatRecordExport',
    method: 'post',
    data
  })
}
/**
 * 直播v1.7.1接口开始
 */
// 获取签到人数
export function liveRoomSignCount(liveRoomSignId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/count/${liveRoomSignId}`,
    method: 'get'
  })
}
// 判断直播间是否正在签到
export function isSigning(liveRoomId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/isSigning/${liveRoomId}`,
    method: 'get'
  })
}
// 手动结束签到
export function overLiveRoomSign(liveRoomSignId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/over/${liveRoomSignId}`,
    method: 'get'
  })
}
// 直播间签到结果列表
export function liveRoomSignResult(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/result`,
    method: 'get',
    params
  })
}
// 直播间签到结果列表导出All
export function liveRoomSignResultExportAll(liveRoomId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/result/export/all/${liveRoomId}`,
    method: 'get'
  })
}
// 直播间签到结果列表导出
export function liveRoomSignResultExport(liveRoomSignId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/result/export/${liveRoomSignId}`,
    method: 'get'
  })
}
// 直播间发起签到
export function liveRoomSignStart(data) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/start`,
    method: 'post',
    data
  })
}
// 直播间签到记录列表
export function liveRoomSignLog(liveRoomId, params) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/${liveRoomId}`,
    method: 'get',
    params
  })
}
// 取消签到
export function cancalLiveRoomSign(liveRoomSignId) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/cancel/${liveRoomSignId}`,
    method: 'DELETE'
  })
}

// 修改直播间签到信息
export function updateLiveRoomSign(liveRoomSignId, data) {
  return request({
    url: `/cloud/edata-live/liveRoom/sign/update/${liveRoomSignId}`,
    method: 'PUT',
    data
  })
}
/**
 * 直播v1.7.1接口结束
 */

// 直播详情-回放设置-指定人员列表
export function playbackWhiteList(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/page',
    method: 'post',
    data
  })
}
// 新增指定人员
export function playbackWhiteListAdd(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/add',
    method: 'post',
    data
  })
}
// 删除指定人员
export function playbackWhiteListDel(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/del',
    method: 'post',
    data
  })
}
// 导入
export function playbackWhiteListImport(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/import',
    method: 'post',
    data
  })
}
// 直播详情-助教管理列表查询
export function gettutorPage(data) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/tutorPage',
    method: 'post',
    data
  })
}
// 批量新增助教
export function addLiveRoomInfoEditTutor(data) {
  return request({
    url: '/cloud/edata-live/teacherManager/liveRoomInfoEditTutor',
    method: 'POST',
    data
  })
}
// 删除直播间助教
export function delTeacherManager(data) {
  return request({
    url: '/cloud/edata-live/teacherManager/del',
    method: 'POST',
    data
  })
}
/**
 * 直播v1.6.6视频的接口开始
 *  */
// 脚本管理-根据直播间IDor名称查询直播间
export function liveRoomScriptQuery(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/script/query',
    method: 'get',
    params
  })
}

// 正在弹窗优惠券查询
export function popoverCouponAjax(params) {
  return request({
    url: '/cloud/edata-live/im/operation/popover/coupon',
    method: 'get',
    params
  })
}

// 聊天记录导入脚本
export function scriptImportChatRecord(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/script/import/chat-record',
    method: 'POST',
    data
  })
}

// 回访记录-获取导入学员的模板url
export function getImportFileUrl(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/getImportFileUrl',
    method: 'POST',
    data
  })
}

// 回访记录-导入学员的模板url
export function importFile(data, onUploadProgress, cancelToken) {
  return request({
    url: '/cloud/edata-live/liveRoom/playbackWhiteList/import',
    method: 'POST',
    data,
    onUploadProgress,
    cancelToken
  })
}
// 视频管理-视频草稿列表
export function getProjectDrafts(params) {
  return request({
    url: '/cloud/product/video/project/projectDrafts',
    method: 'get',
    params
  })
}

// 正在弹窗商品查询
export function popoverGoodsAjax(params) {
  return request({
    url: '/cloud/edata-live/im/operation/popover/goods',
    method: 'get',
    params
  })
}

// 工程生成
export function videoprojectprojectProjectGenerate(data) {
  return request({
    url: '/cloud/product/video/project/projectGenerate',
    method: 'post',
    data
  })
}
// 视频管理-删除视频草稿
export function deleteProjectDraft(data) {
  return request({
    url: '/cloud/product/video/project/deleteProjectDraft',
    method: 'post',
    data
  })
}
// 删除直播回放记录
export function delPlaybackRecord(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/playbackRecord/deleted',
    method: 'get',
    params
  })
}
// 获取视频字幕
export function getSubtitleList(params) {
  return request({
    url: '/cloud/product/operateClips/subtitleList',
    method: 'get',
    params
  })
}
/**
 * 直播v1.6.6视频的接口结束
 */

// 真人直播页面布局修改
export function editPageLayout(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/editPageLayout',
    method: 'post',
    data
  })
}
// 客户端直播间在线老师列表
export function onlineTeacherList(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/onlineTeacher/list',
    method: 'get',
    params
  })
}

// 获取直播间H5分享设置
export function getH5shareSetting(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/h5/share/config/get',
    method: 'get',
    params
  })
}

// 保存直播间H5分享配置
export function saveH5shareSetting(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/h5/share/config/save',
    method: 'post',
    data
  })
}

// 获取直播间自嗨设置
export function getLiveRoomAmuse(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/amuse/config/get',
    method: 'get',
    params
  })
}

// 保存直播间自嗨配置
export function saveLiveRoomAmuse(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/amuse/config/save',
    method: 'post',
    data
  })
}

// 查询直播间加热信息
export function getLiveRoomHeatDetail(liveRoomId) {
  return request({
    url: `/cloud/edata-live/liveRoom/heat/detail/${liveRoomId}`,
    method: 'get'
  })
}

// 直播间新建加热
export function createLiveRoomHeat(data) {
  return request3(
    {
      url: '/cloud/edata-live/liveRoom/heat/create',
      method: 'POST',
      data
    },
    true,
    true
  )
}

// 销售任务列表（直播模块调用）
export function saleTaskPage(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/pageByLive',
    method: 'POST',
    data
  })
}

// 根据学员昵称模糊查询学员数据
export function getLiveRoomUserInfoByName(params) {
  return request({
    url: '/cloud/edata-live/liveRoom/user/record/getLiveRoomUserInfoByName',
    method: 'get',
    params
  })
}

// 用户记录-手动同步线索
export function recordCluePull(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/user/record/clue/pull',
    method: 'POST',
    data
  })
}

// 线索导入直播间人员
export function clueImportLimit(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/userLimit/clueImportLimit',
    method: 'POST',
    data
  })
}

// 线索导入列表(直播模块调用)
export function livePage(data) {
  return request({
    url: '/cloud/edata-sale/clue/live/page',
    method: 'POST',
    data
  })
}

// 销售任务列表-直播使用，勿动
export function cluePage(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/live/clue/page',
    method: 'GET',
    params
  })
}

// 我的直播间列表查询
export function myLive(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/myLive',
    method: 'POST',
    data
  })
}

// 获取对应记忆的code的value 详情tabs获取
export function personSetUpRecord(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/value',
    method: 'POST',
    data
  })
}

// code对应的记忆发生变动保存 详情tabs保存
export function personSetUpRecordSave(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/save',
    method: 'POST',
    data
  })
}

// 获取对应记忆的code的列表
export function personSetUpRecordDetail(data) {
  return request({
    url: '/cloud/edata-live/memory/personSetUpRecord/detail',
    method: 'POST',
    data
  })
}

// 计划看播用户查询
export function planWatchUserQuery(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/planWatchUser/planWatchUserQuery',
    method: 'POST',
    data
  })
}

// 订单数据、观看数据、人数数据 查询
export function dataBoardViewData(params) {
  return request({
    url: '/cloud/edata-live/liveRoomInfo/dataBoard/v2/viewData',
    method: 'GET',
    params
  })
}

// 删除计划看播导入用户
export function deleteImportUser(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/planWatchUser/deleteImportUser',
    method: 'POST',
    data
  })
}
// 修改直播间关联任务
export function relationTaskEdit(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/relationTaskEdit',
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

// 查询当前登录人的员工类型 1-负责人 2-小伙伴
export function queryEmployeeType(params) {
  return request({
    url: '/cloud/edata-live/employeePerformance/queryEmployeeType',
    method: 'GET',
    params
  })
}
// 学员搜索
export function searchStudent(data) {
  return request({
    url: '/cloud/edata-live/student/searchStudent',
    method: 'POST',
    data
  })
}
