import request from '@/utils/request2'

// 师资共享列表分页查询
export function teacherSharingCommonList(params) {
  return request({
    url: '/cloud/teacher/sharing/common/list',
    method: 'get',
    params
  })
}

// 编辑师资共享配置
export function editSharingSetting(data) {
  return request({
    url: '/cloud/teacher/sharing/editSharingSetting',
    method: 'POST',
    data
  })
}

// 单个老师跟进记录列表查询
export function followDetail(params) {
  return request({
    url: '/cloud/teacher/sharing/followDetail',
    method: 'get',
    params
  })
}

// 获取所有机构列表
export function getAllOrgans(data) {
  return request({
    url: '/cloud/teacher/sharing/getAllOrgans',
    method: 'post',
    data
  })
}

// 查询当前机构师资共享配置
export function getSharingSetting(data) {
  return request({
    url: '/cloud/teacher/sharing/getSharingSetting',
    method: 'post',
    data
  })
}

// 领取讲师
export function getTeacher(data) {
  return request({
    url: '/cloud/teacher/sharing/getTeacher',
    method: 'post',
    data
  })
}

// 查询指定机构系统员工
export function querySysUser(data) {
  return request({
    url: '/cloud/teacher/sharing/querySysUser',
    method: 'post',
    data
  })
}

// 放入公海
export function throwCommon(data) {
  return request({
    url: '/cloud/teacher/sharing/throw/common',
    method: 'post',
    data
  })
}

// 师资共享设置机构列表
export function getSharingOrgans(data) {
  return request({
    url: '/cloud/teacher/sharing/getSharingOrgans',
    method: 'post',
    data
  })
}

// 通过老师ID,机构ID查询老师详情
export function detailByTeacherId(data) {
  return request({
    url: '/cloud/teacher/sharing/detailByTeacherId',
    method: 'post',
    data
  })
}

// 领取讲师，判断是否已存在师资档案
export function getTeacherCheck(params) {
  return request({
    url: '/cloud/teacher/sharing/getTeacherCheck',
    method: 'get',
    params
  })
}

// 师资共享列表分页查询(新)
export function teacherSharingNew(params) {
  return request({
    url: '/cloud/teacher/teacherSharingNew/page',
    method: 'get',
    params
  })
}

// 师资共享详情(新)
export function teacherSharingNewDetail(params) {
  return request({
    url: '/cloud/teacher/teacherSharingNew/detail',
    method: 'get',
    params
  })
}

// 师资共享列表分页查询(新)新
export function teacherSharingNewList(params, cooperateStatusPool) {
  return request({
    url: `/cloud/teacher/teacherSharingNew/page/${cooperateStatusPool}`,
    method: 'get',
    params
  })
}
// 师资共享列表分页查询(新)新 导出
export function exportTeacherSharingNewList(params, cooperateStatusPool) {
  return request({
    url: `/cloud/teacher/teacherSharingNew/export/${cooperateStatusPool}`,
    method: 'get',
    params
  })
}
