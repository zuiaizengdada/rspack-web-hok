import request from '@/utils/request2'

// 分页查询助教列表
export function getAssistantPage(params) {
  return request({
    url: '/cloud/delivery/assistant/getPage',
    method: 'GET',
    params
  })
}

// 自动分配/取消自动分配
export function distributeAssistant(data) {
  return request({
    url: '/cloud/delivery/assistant/distribute',
    method: 'PUT',
    data
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // },
    // data: qs.stringify(data)
  })
}

// 批量删除助教
export function deleteAssistant(data) {
  return request({
    url: `/cloud/delivery/assistant/delete`,
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    data
  })
}

// 新增助教
export function addAssistant(data) {
  return request({
    url: '/cloud/delivery/assistant/add',
    method: 'POST',
    data
  })
}

// 查询班期列表
export function getSchedulePage(data) {
  return request({
    url: '/cloud/delivery/schedule/page',
    method: 'post',
    data
  })
}

// 获取是否开通交付功能
export function getDeliveryService(params) {
  return request({
    url: '/cloud/delivery/assistant/setting/get/delivery/service',
    method: 'GET',
    params
  })
}

// 根椐讲师+课程类型，获取助教设置
export function getDeliveryAssistantSetting(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/getDeliveryAssistantSetting`,
    method: 'post',
    data
  })
}

// 获取兜底助教(班主任列表)
export function headteacherList(params) {
  return request({
    url: '/cloud/delivery/schedule-headteacher/list',
    method: 'GET',
    params
  })
}

// 详情
export function assistantDetail(params) {
  return request({
    url: '/cloud/delivery/assistant/setting/detail',
    method: 'GET',
    params
  })
}

// 分配规则变动
export function assistantAllocationRules(data) {
  return request({
    url: '/cloud/delivery/assistant/setting/edit/allocation/rules',
    method: 'post',
    data
  })
}

// 分配设置分页查询
export function assistantSettingPage(params) {
  return request({
    url: '/cloud/delivery/assistant/setting/page',
    method: 'get',
    params
  })
}

// 修改兜底助教
export function assistantSettingEdit(data) {
  return request({
    url: '/cloud/delivery/assistant/setting/edit/assistant',
    method: 'post',
    data
  })
}

// 查询助教的班期列表
export function assistantSettingScheduleList(settingId) {
  return request({
    url: `/cloud/delivery/assistant/setting/schedule/list/${settingId}`,
    method: 'get'
  })
}

// 分页查询助教规则库
export function assistantSettingDetailPage(params) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/page`,
    method: 'get',
    params
  })
}

// 新增人员
export function assistantCreate(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/create`,
    method: 'post',
    data
  })
}
// 编辑课程价格
export function assistantDetailEdit(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/edit/price`,
    method: 'post',
    data
  })
}

// 编辑接待人数
export function assistantReceptionsNum(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/edit/receptions/num`,
    method: 'post',
    data
  })
}

// 暂停分配、继续分配
export function assistantSettingEditState(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/edit/allocation/state`,
    method: 'post',
    data
  })
}

// 删除助教
export function assistantSettingDel(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/del`,
    method: 'post',
    data
  })
}

// 助教排序
export function assistantSettingSort(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/sort`,
    method: 'post',
    data
  })
}

// 规则库信息覆盖
export function assistantSettingCover(data) {
  return request({
    url: `/cloud/delivery/assistant/setting/cover`,
    method: 'post',
    data
  })
}

// 获取全部的助教列表
export function assistantSettingUserIdList(params) {
  return request({
    url: `/cloud/delivery/assistant/setting/detail/userIdList/${params}`,
    method: 'get'
  })
}

// 助教组别列表
export function assistantGroupPage(data) {
  return request({
    url: `/cloud/delivery/assistantGroup/page`,
    method: 'post',
    data
  })
}

// 助教组别编辑
export function assistantGroupEditGroup(data) {
  return request({
    url: `/cloud/delivery/assistantGroup/editGroup`,
    method: 'post',
    data
  })
}
