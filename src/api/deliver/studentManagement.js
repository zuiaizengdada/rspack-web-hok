// 学员管理
import request from '@/utils/request2'

// 学员列表
export function getDeliveryPage(data) {
  return request({
    url: '/cloud/delivery/delivery-info/page',
    method: 'post',
    data
  })
}

// 我的学员列表
export function getDeliveryMyPage(data) {
  return request({
    url: '/cloud/delivery/delivery-info/my/page',
    method: 'post',
    data
  })
}

// 学员详情
export function getDeliveryDetailById(id) {
  return request({
    url: `/cloud/delivery/delivery-info/detail/${id}`,
    method: 'GET'
  })
}

// B端-换人就读配置管理-分页查询
export function getSettingPage(params) {
  return request({
    url: `/cloud/delivery/replacement/enrollment/setting/page`,
    method: 'GET',
    params
  })
}

// B端-换人就读
export function saveEnrollment(data) {
  return request({
    url: `/cloud/delivery/replacement/enrollment/`,
    method: 'post',
    data
  })
}

// 查看调整班期详情
export function getDeliveryAdjustDetailById(id) {
  return request({
    url: `/cloud/delivery/delivery-info/adjust/detail/${id}`,
    method: 'GET'
  })
}

// 调整班期
export function editDeliveryAdjustDetail(data) {
  return request({
    url: '/cloud/delivery/delivery-info/adjust',
    method: 'PUT',
    data
  })
}

// 修改备注
export function editDeliveryRemark(data) {
  return request({
    url: '/cloud/delivery/delivery-info/remark',
    method: 'PUT',
    data
  })
}

// 转课
// export function editDeliveryShift(data) {
//   return request({
//     url: '/cloud/delivery/delivery-info/shift',
//     method: 'POST',
//     data
//   })
// }

// 学员学费分页查询
export function getDeliveryStudentFeePage(params) {
  return request({
    url: '/cloud/delivery/delivery-info/student/fee/page',
    method: 'GET',
    params
  })
}

// 关闭交付
export function closeDelivery(data) {
  return request({
    url: '/cloud/delivery/delivery-close/close',
    method: 'POST',
    data
  })
}

// 查看关闭原因
export function getCloseDeliveryReasonById(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/delivery-close/reason/${deliveryInfoId}`,
    method: 'GET'
  })
}

// 操作记录分页查询
export function getOperationRecordPage(params) {
  return request({
    url: '/cloud/delivery/operation-record/page',
    method: 'GET',
    params
  })
}

// 操作跟进记录
export function getFollowPage(params) {
  return request({
    url: '/cloud/delivery/follow/page',
    method: 'GET',
    params
  })
}

export function getFollowCreate(data) {
  return request({
    url: '/cloud/delivery/follow/create',
    method: 'POST',
    data
  })
}

// 代签
export function helpSign(data) {
  return request({
    url: '/cloud/delivery/schedule-sign/help/sign',
    method: 'POST',
    data
  })
}

// 交付详情签到记录
export function getScheduleSignRecord(params) {
  return request({
    url: '/cloud/delivery/schedule-sign/schedule/record',
    method: 'GET',
    params
  })
}

// 锁定交付
export function lockDelivery(data) {
  return request({
    url: '/cloud/delivery/delivery-lock/lock',
    method: 'POST',
    data
  })
}
// 解锁
export function unlockDelivery(data) {
  return request({
    url: '/cloud/delivery/delivery-unlock/unlock',
    method: 'POST',
    data
  })
}

// 查看锁单原因
export function getLockReason(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/delivery-lock/reason/${deliveryInfoId}`,
    method: 'GET'
  })
}

// 查看解锁原因
export function getUnlockReason(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/delivery-unlock/reason/${deliveryInfoId}`,
    method: 'GET'
  })
}

// 学员订单的班期记录
export function getScheduleStudentDeliveryPage(params) {
  return request({
    url: '/cloud/delivery/schedule-student/delivery/page',
    method: 'GET',
    params
  })
}

// 签到记录分页
export function getScheduleSignPage(params) {
  return request({
    url: '/cloud/delivery/schedule-sign/schedule/page',
    method: 'GET',
    params
  })
}

// 转课确认提交审核
export function confirmDeliveryShift(shiftId) {
  return request({
    url: `/cloud/delivery/delivery-shift/confirm/${shiftId}`,
    method: 'PUT'
  })
}

// 查看转课详情
export function getDeliveryShiftDetail(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/delivery-shift/detail/${deliveryInfoId}`,
    method: 'get'
  })
}
// 转课
export function addDeliveryShift(data) {
  return request({
    url: `/cloud/delivery/delivery-shift/shift`,
    method: 'POST',
    data
  })
}

// 转课今天检测
export function detectionShiftCheck(data) {
  return request({
    url: `/cloud/delivery/delivery-shift/shift/check`,
    method: 'POST',
    data
  })
}
// 编辑转课
export function editDeliveryShift(data) {
  return request({
    url: `/cloud/delivery/delivery-shift`,
    method: 'PUT',
    data
  })
}

// 删除转课记录
export function delDeliveryShift(shiftId) {
  return request({
    url: `/cloud/delivery/delivery-shift/${shiftId}`,
    method: 'DELETE'
  })
}

// 导出
export function deliveryExport(params) {
  return request({
    url: '/cloud/delivery/delivery-info/export',
    method: 'GET',
    params
  })
}

// 交付详情签到记录
export function deliverySignPage(params) {
  return request({
    url: '/cloud/delivery/schedule-sign/delivery/page',
    method: 'get',
    params
  })
}

// 根据商品获取班期列表
export function getScheduleList(goodsId) {
  return request({
    url: `/cloud/delivery/schedule/list/${goodsId}`,
    method: 'get'
  })
}

// 批量调整班期
export function batchAdjustDeliveryInfo(data) {
  return request({
    url: '/cloud/delivery/delivery-info/batch/adjust',
    method: 'POST',
    data
  })
}

// 根据班期获取班主任列表
export function getsScheduleHeadteacherList(scheduleId) {
  return request({
    url: `/cloud/delivery/schedule-headteacher/list/${scheduleId}`,
    method: 'GET'
  })
}

// 批量更换助教
export function batchReplaceAssistant(data) {
  return request({
    url: '/cloud/delivery/delivery-info/batch/replace/assistant',
    method: 'POST',
    data
  })
}

// 批量更换班主任
export function batchReplaceHeadTeacher(data) {
  return request({
    url: '/cloud/delivery/delivery-info/batch/replace/headteacher',
    method: 'POST',
    data
  })
}

// 批量下载作业
export function batchDownloadJobAjax(data, cancelToken) {
  return request({
    url: '/cloud/delivery/course-work/batch/download',
    method: 'POST',
    responseType: 'blob',
    data,
    cancelToken
  })
}

// 获取作业的下载信息
export function batchDownloadInfoAjax(data) {
  return request({
    url: '/cloud/delivery/course-work/batch/download/info',
    method: 'POST',
    data
  })
}
// 获取单个学员的作业详情
export function getCourseWorkDetailAjax(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/course-work/detail/${deliveryInfoId}`,
    method: 'GET'
  })
}
// 提交上传作业
export function commitCourseWorkAjax(data) {
  return request({
    url: '/cloud/delivery/course-work/commit',
    method: 'POST',
    data
  })
}
// 删除作业
export function deliveryCourseWorkAjax(id) {
  return request({
    url: `/cloud/delivery/course-work/${id}`,
    method: 'DELETE'
  })
}
// 新增作业
export function addCourseWorkAjax(data) {
  return request({
    url: '/cloud/delivery/course-work/add',
    method: 'POST',
    data
  })
}
// 查看用户班期下未签到场次列表
export function getUnsignList(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/schedule-session/list/unsign/${deliveryInfoId}`,
    method: 'GET'
  })
}

// 获取可转入金额
export function getAvailableShiftFee(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/delivery-shift/available/shift/fee/${deliveryInfoId}`,
    method: 'POST'
  })
}

// 根据商品获取班期列表
export function getUnfinishedListSchedule(type, goodsId, scheduleId) {
  return request({
    url: `/cloud/delivery/schedule/unfinished/list/${type}/${goodsId}/${scheduleId}`,
    method: 'GET'
  })
}

export function editDeliveringAdjustDetail(data) {
  return request({
    url: '/cloud/delivery/delivery-info/delivering/adjust',
    method: 'PUT',
    data
  })
}

// 获取学员的助教和班主任列表
export function getHeadTeacherAssistant(deliverInfoId) {
  return request({
    url: `/cloud/delivery/delivery-info/headteacher/assistant/${deliverInfoId}`,
    method: 'GET'
  })
}

// 交付用户学习记录
export function getUserProgressDeliveryPage(params) {
  return request({
    url: '/cloud/admin/user/progress/delivery/page',
    method: 'GET',
    params
  })
}
// 交付用户学习记录-汇总
export function getUserProgressDeliveryTotal(data) {
  return request({
    url: '/cloud/admin/user/progress/delivery/page/total',
    method: 'Post',
    data
  })
}

// 批量代签
export function batchHelpSign(data) {
  return request({
    url: '/cloud/delivery/schedule-sign/help/sign/batch',
    method: 'POST',
    data
  })
}

// 关闭交付
export function closeDeliveryDelivery(data) {
  return request({
    url: '/cloud/delivery/close/delivery/',
    method: 'POST',
    data
  })
}

// 关闭交付
export function betchDelayFailureTime(data) {
  return request({
    url: '/cloud/delivery/delivery/online/delayFailureTime',
    method: 'POST',
    data
  })
}

// 录播课备注
export function setUpdateRemark(params) {
  return request({
    url: '/cloud/delivery/delivery/online/updateRemark',
    method: 'get',
    params
  })
}

// 延期信息
export function getDeliverDelayInfo(params) {
  return request({
    url: '/cloud/delivery/delivery/online/getDeliverDelayInfo',
    method: 'get',
    params
  })
}
// B端-换人就读配置管理-添加次数
export function getSettingAdd(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/setting/add',
    method: 'get',
    params
  })
}

// 分页查询操作记录
export function getRecordedClassesLog(data) {
  return request({
    url: '/cloud/delivery/delivery/recordedClassesLog/page',
    method: 'post',
    data
  })
}
// 获取商品助教信息
export function getTeachingAssistants(params) {
  return request({
    url: '/cloud/delivery/assistant/getTeachingAssistants',
    method: 'get',
    params
  })
}

// 查询录播课详情
export function getDeliveryOnlineInfo(params) {
  return request({
    url: '/cloud/delivery/delivery/online/info',
    method: 'get',
    params
  })
}

// B端-换人就读安全性全局设置-查询
export function safeSettingGet(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/safe/setting/get',
    method: 'get',
    params
  })
}

// B端-换人就读安全性全局设置-编辑
export function safeSettingSave(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/safe/setting/save',
    method: 'get',
    params
  })
}

// B端发送验证码
export function changePermissionSmsCode(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/changePermission/sms/code',
    method: 'get',
    params
  })
}

// B端发送语音验证码
export function changePermissionVoiceCode(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/changePermission/voice/code',
    method: 'get',
    params
  })
}

// B端发送邮箱验证码
export function changeEmailCode(params) {
  return request({
    url: '/cloud/delivery/replacement/enrollment/changePermission/email/code',
    method: 'get',
    params
  })
}

// ocr-获取订单信息
export function getOrderAnalysis(params) {
  return request({
    url: '/cloud/delivery/ocr/getOrderAnalysis',
    method: 'get',
    params
  })
}

// 分页查询录播课交付单
export function deliveryOnlinePage(params) {
  return request({
    url: '/cloud/delivery/delivery/online/page',
    method: 'get',
    params
  })
}

// 字典
export function getDeliveryDict(params) {
  return request({
    url: '/cloud/delivery/dict/get',
    method: 'GET',
    params
  })
}

/**
 *学员动态列表
 * @param {*} data
 * @returns
 */
export function userDynamics(data) {
  return request({
    url: '/cloud/delivery/delivery-call-record/delivery/userDynamics',
    method: 'POST',
    data
  })
}

/**
 *更换销售人员
 * @param {*} data
 * @returns
 */
export function userSalesChange(data) {
  return request({
    url: '/cloud/delivery/user/sales/change',
    method: 'POST',
    data
  })
}

// 套餐
// 分页查询套餐交付单
export function deliveryPackagePage(params) {
  return request({
    url: '/cloud/delivery/package/delivery/page',
    method: 'POST',
    data: params
  })
}

// 查询套餐课详情
export function getDeliveryPackageInfo(params) {
  return request({
    url: '/cloud/delivery/package/delivery/detail',
    method: 'get',
    params
  })
}

// 分页查询操作记录
export function getPackageRecordedClassesLog(data) {
  return request({
    url: '/cloud/delivery/package/delivery/recorded/log',
    method: 'post',
    data
  })
}

// 交付信息 录播课
export function getRecordClassList(data) {
  return request({
    url: '/cloud/delivery/package/delivery/live/recorded/info',
    method: 'get',
    params: data
  })
}

// 交付信息 直播课
export function getLiveRoomList(data) {
  return request({
    url: '/cloud/delivery/package/delivery/live/info',
    method: 'get',
    params: data
  })
}

// 交付信息 线下课
export function getOfflineClassList(data) {
  return request({
    url: '/cloud/delivery/package/delivery/offline/info',
    method: 'get',
    params: data
  })
}

// 套餐课备注
export function setPackageRemark(params) {
  return request({
    url: '/cloud/delivery/package/delivery/remark',
    method: 'post',
    data: params
  })
}

// 套餐课 更换销售人员
export function packageUserSalesChange(data) {
  return request({
    url: '/cloud/delivery/package/delivery/change',
    method: 'POST',
    data
  })
}

// 套餐课 转课详情
export function getPackageTransferInfo(data) {
  return request({
    url: `/cloud/delivery/package/delivery/shift/detail`,
    method: 'get',
    params: data
  })
}

// 套餐课 关闭交付
export function closePackageDeliveryDelivery(data) {
  return request({
    url: '/cloud/delivery/package/delivery/close',
    method: 'POST',
    data
  })
}

// 套餐课解锁
export function unlockPackageDelivery(data) {
  return request({
    url: '/cloud/delivery/package/delivery/unlock',
    method: 'POST',
    data
  })
}

// 套餐课 锁定交付
export function lockPackageDelivery(data) {
  return request({
    url: '/cloud/delivery/package/delivery/lock',
    method: 'POST',
    data
  })
}

// 套餐课 B端-换人就读
export function packageSaveEnrollment(data) {
  return request({
    url: '/cloud/delivery/package/delivery/substitution',
    method: 'post',
    data
  })
}

// 套餐课 查看转课详情
export function getPackageDeliveryShiftDetail(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/package/delivery/shift/confirm/detail`,
    method: 'get',
    params: {
      deliveryInfoId: deliveryInfoId
    }
  })
}

// 套餐课 获取可转入金额
export function getPackageAvailableShiftFee(deliveryInfoId) {
  return request({
    url: `/cloud/delivery/package/delivery/available/shift/fee/${deliveryInfoId}`,
    method: 'POST'
  })
}

// 转课
export function addPackageDeliveryShift(data) {
  return request({
    url: `/cloud/delivery/package/delivery/shift`,
    method: 'POST',
    data
  })
}

// 套餐课 转课确认提交审核
export function confirmPackageDeliveryShift(shiftId) {
  return request({
    url: `/cloud/delivery/package/delivery/confirm`,
    method: 'get',
    params: {
      shiftId: shiftId
    }
  })
}

// 套餐课 编辑转课
export function editPackageDeliveryShift(data) {
  return request({
    url: `/cloud/delivery/package/delivery/update/shift`,
    method: 'POST',
    data
  })
}

// 已删除交付用户学习记录
export function progressDeliveryList(params) {
  return request({
    url: `/cloud/admin/user/progress/delete/delivery/list`,
    method: 'get',
    params
  })
}

// 已删除交付用户学习记录-总计
export function progressDeliveryPageTotal(data) {
  return request({
    url: `/cloud/admin/user/progress/delete/delivery/page/total`,
    method: 'post',
    data
  })
}

// 交付服务编辑用户信息
export function deliveryEditPfUserAjax(data) {
  return request({
    url: '/cloud/delivery/delivery-info/editPfUser',
    method: 'POST',
    data
  })
}

// 交付用户观看记录-总计
export function progressAllTotal(data) {
  return request({
    url: `/cloud/admin/user/progress/delivery/page/all/total`,
    method: 'post',
    data
  })
}
// 交付服务获取用户信息
export function deliverySelectPfUserAjax(param) {
  return request({
    url: `/cloud/delivery/delivery-info/selectPfUser?platformUserId=${param.platformUserId}`,
    method: 'get'
  })
}

// 直播课
// 分页查询套餐交付单
export function deliveryLivePage(params, type) {
  return request({
    url: `/cloud/delivery/live/delivery/page/${type}`,
    method: 'POST',
    data: params
  })
}
// 查询直播课详情
export function getDeliveryLiveInfo(id) {
  return request({
    url: `/cloud/delivery/live/delivery/detail/${id}`,
    method: 'get'
  })
}
// 直播课备注
export function setLiveUpdateRemark(params) {
  return request({
    url: '/cloud/delivery/live/delivery/updateRemark',
    method: 'get',
    params
  })
}
// 直播课调整班期
export function liveAdjustDeliveryInfo(data) {
  return request({
    url: '/cloud/delivery/live/delivery/adjust/schedule',
    method: 'POST',
    data
  })
}

// 直播课交付单关闭交付
export function closeDeliverLive(data) {
  return request({
    url: '/cloud/delivery/live/delivery/close/delivery',
    method: 'POST',
    data
  })
}

// 直播课交付已删除章节用户观看记录
export function progressDeleteLiveCourse(params) {
  return request({
    url: '/cloud/admin/user/progress/delivery/liveCourse/delete/list',
    method: 'get',
    params
  })
}
// 直播课交付用户观看记录
export function progressTreeLiveCourse(params) {
  return request({
    url: '/cloud/admin/user/progress/delivery/liveCourse/tree',
    method: 'get',
    params
  })
}

// 导出学员进度
export function exportDeliveryUserProgress(data) {
  return request({
    url: '/cloud/delivery/delivery/online/exportDeliveryUserProgress',
    method: 'POST',
    data
  })
}
