// 班期管理
import request from '@/utils/request2'

// 新增班期
export function addDeliverySchedule(data) {
  return request({
    url: '/cloud/delivery/schedule',
    method: 'POST',
    data
  })
}
// 编辑班期
export function editDeliverySchedule(data) {
  return request({
    url: '/cloud/delivery/schedule',
    method: 'PUT',
    data
  })
}
// 成本详情
export function getDeliveryScheduleCost(scheduleId) {
  return request({
    url: `/cloud/delivery/schedule/cost/${scheduleId}`,
    method: 'get'
  })
}
// 班期详情
export function getDeliveryScheduleDetail(id) {
  return request({
    url: `/cloud/delivery/schedule/detail/${id}`,
    method: 'get'
  })
}

// 老师验证
export function verifyCheckTeacher(data) {
  return request({
    url: `/cloud/delivery/schedule/check/teacher`,
    method: 'POST',
    data
  })
}

// 查询学员入班数
export function queryCheckNum(data) {
  return request({
    url: `/cloud/delivery/schedule/check/num`,
    method: 'POST',
    data
  })
}

// 分页查询班期列表
export function getDeliveryScheduleList(data) {
  return request({
    url: '/cloud/delivery/schedule/page',
    method: 'post',
    data
  })
}

// 分页部门查询班期列表
export function getDeliveryDepartmentScheduleList(data) {
  return request({
    url: '/cloud/delivery/schedule/department/page',
    method: 'post',
    data
  })
}

// 记录成本
export function getDeliveryScheduleRecordCost(data) {
  return request({
    url: '/cloud/delivery/schedule/record/cost',
    method: 'put',
    data
  })
}
// 分页查询签到码
export function getDeliveryScheduleSignQrcodeList(id) {
  return request({
    url: `/cloud/delivery/schedule/sign/qrcode/${id}`,
    method: 'get'
  })
}
// 删除班期
export function delDeliverySchedule(id) {
  return request({
    url: `/cloud/delivery/schedule/${id}`,
    method: 'DELETE'
  })
}

// 班期的学员记录
export function getSignPage(params) {
  return request({
    url: '/cloud/delivery/schedule-student/page',
    method: 'GET',
    params
  })
}

// 我的分页查询
export function getScheduleMyPage(data) {
  return request({
    url: '/cloud/delivery/schedule/my/page',
    method: 'post',
    data
  })
}

// 分页查询班级详情列表
export function getScheduleClassPage(data) {
  return request({
    url: '/cloud/delivery/schedule/detail/page',
    method: 'POST',
    data
  })
}

// 班期的学员记录
export function getScheduleStudentPage(params) {
  return request({
    url: '/cloud/delivery/schedule-student/page',
    method: 'GET',
    params
  })
}
// 班期的学员操作记录
export function getAuditlog(params) {
  return request({
    url: '/cloud/delivery/schedule/auditlog/query',
    method: 'GET',
    params
  })
}

// 成本确认
export function confirmCost(scheduleId) {
  return request({
    url: `/cloud/delivery/schedule/confirm/cost/${scheduleId}`,
    method: 'PUT'
  })
}

// 获取班期的场次列表
export function getScheduleSessionList(scheduleId) {
  return request({
    url: `/cloud/delivery/schedule-session/list/simple/${scheduleId}`,
    method: 'get'
  })
}

// 根据商品获取班期列表
export function getScheduleListByGoodsId(goodsId) {
  return request({
    url: `/cloud/delivery/schedule/list/${goodsId}`,
    method: 'get'
  })
}

// 根据班期获取班主任列表
export function getHeadteacherListByShceduleId(shceduleId) {
  return request({
    url: `/cloud/delivery/schedule-headteacher/list/${shceduleId}`,
    method: 'GET'
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

// 商品班期上一次的地点
export function getLastDistrict(goodsId) {
  return request({
    url: `/cloud/delivery/schedule/last/district/${goodsId}`,
    method: 'GET'
  })
}

// 获取当前班期未交付学员
export function getUndeliveredUserNameList(scheduleId) {
  return request({
    url: `/cloud/delivery/schedule/record/cost/${scheduleId}`,
    method: 'GET'
  })
}

// 删除助教校验
export function deleteAssistantCheck(data) {
  return request({
    url: '/cloud/admin/material/goods/deleteAssistantCheck',
    method: 'POST',
    data
  })
}

// 获取空降学员列表
export function getAirborneStudentPageAjax(params) {
  return request({
    url: '/cloud/delivery/delivery-info/airborne/student/page',
    method: 'GET',
    params
  })
}

// 新增空降学员
export function addAirborneStudentAjax(data) {
  return request({
    url: '/cloud/delivery/delivery-info/add/airborne/student',
    method: 'POST',
    data
  })
}

export function deliveryScheduleLogo(data) {
  return request({
    url: `/cloud/delivery/schedule-session/sign/logo/${data.scheduleId}`,
    method: 'POST',
    data
  })
}
// 预览班期签到logo
export function deliveryScheduleLogoView(data) {
  return request({
    url: `/cloud/delivery/schedule-session/sign/logo/view`,
    method: 'POST',
    data
  })
}

export function deliveryInfoExportV2(params) {
  return request({
    url: `/cloud/delivery/delivery-info/export/v2`,
    method: 'get',
    params
  })
}

export function deliveryPage(params) {
  return request({
    url: `/cloud/delivery/delivery-info/detail/delivery/page`,
    method: 'get',
    params
  })
}

// 班期管理-直播课-班期详情-学员列表
// /cloud/delivery/live/delivery/page/{type}
export function getLiveDeliveryPage(type, data) {
  return request({
    url: `/cloud/delivery/live/delivery/page/${type}`,
    method: 'POST',
    data
  })
}
