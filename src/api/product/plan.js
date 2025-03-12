
import request from '@/utils/request2'
// 筛选查询计划
export function planQuery(params) {
  return request({
    url: '/cloud/product/plan/management/query',
    method: 'get',
    params
  })
}
// 新增计划
export function planAdd(data) {
  return request({
    url: '/cloud/product/plan/management/add',
    method: 'POST',
    data
  })
}
// 编辑计划
export function planEdit(data) {
  return request({
    url: '/cloud/product/plan/management/edit',
    method: 'POST',
    data
  })
}
// 老师计划下拉
export function planTeacherDropdown(params) {
  return request({
    url: '/cloud/product/plan/management/teacher/dropdown',
    method: 'GET',
    params
  })
}
// 批量删除计划选题
export function planCaseBatchDelete(data) {
  return request({
    url: '/cloud/product/plan/management/case/batch/delete',
    method: 'POST',
    data
  })
}
// 选题详情
export function planCaseDetails(params) {
  return request({
    url: '/cloud/product/plan/management/case/details',
    method: 'GET',
    params
  })
}
// 分享计划选题令牌
export function planShareTicket(params) {
  return request({
    url: '/cloud/product/plan/management/share/ticket',
    method: 'GET',
    params
  })
}
// 计划选题筛选
export function planCaseScreen(params) {
  return request({
    url: '/cloud/product/plan/management/case/screen',
    method: 'GET',
    params
  })
}
// 产品审核选题
export function planProductReview(data) {
  return request({
    url: '/cloud/product/plan/management/product/review',
    method: 'POST',
    data
  })
}
// 产品选题编辑
export function planProductEdit(data) {
  return request({
    url: '/cloud/product/plan/management/product/case/edit',
    method: 'POST',
    data
  })
}
// 计划详情
export function planDetails(params) {
  return request({
    url: '/cloud/product/plan/management/details',
    method: 'GET',
    params
  })
}

// 产品案列演示或者产品评审
export function planProductCase(params) {
  return request({
    url: '/cloud/product/plan/management/product/case',
    method: 'GET',
    params
  })
}

// 下载word
export function downloadWordWj(params) {
  return request({
    url: '/cloud/product/plan/management/product/downloadWord',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
