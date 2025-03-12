import request from '@/utils/request'

export function msgQuery(data) {
  return request({
    url: '/msg/page',
    method: 'POST',
    data
  })
}

export function msgDel(data) {
  return request({
    url: '/msg/delete/batch',
    method: 'delete',
    data
  })
}

export function blackwhiteQuery(data) {
  return request({
    url: '/blackwhite/page',
    method: 'POST',
    data
  })
}
export function blackwhiteSave(data) {
  return request({
    url: '/blackwhite/save',
    method: 'POST',
    data
  })
}

export function blackwhiteDel(data) {
  return request({
    url: '/blackwhite/delete/batch',
    method: 'delete',
    data
  })
}

// 获取短信模板
export function msgTemplate(data) {
  return request({
    url: '/msg-template/page',
    method: 'POST',
    data
  })
}

// 分页查询企微激活任务列表
export function getTaskList(params) {
  return request({
    url: '/recall/task/page',
    method: 'GET',
    params
  })
}

// 添加任务
export function addTask(data) {
  return request({
    url: '/recall/task',
    method: 'POST',
    data
  })
}

// 编辑任务
export function editTask(data) {
  return request({
    url: '/recall/task',
    method: 'PUT',
    data
  })
}

// 任务详情
export function getTaskInfo(params) {
  return request({
    url: `/recall/task/detail/${params}`,
    method: 'GET'
  })
}

// 重发任务
export function resendTask(params) {
  return request({
    url: `/recall/task/run/${params}`,
    method: 'GET'
  })
}

// 取消任务发送
export function cancelTask(params) {
  return request({
    url: `/recall/task/cancel/${params}`,
    method: 'GET'
  })
}

// 开始任务发送
export function runTask(params) {
  return request({
    url: `/recall/task/run/${params}`,
    method: 'PUT'
  })
}
