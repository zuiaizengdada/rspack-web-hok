import request from '@/utils/request2'
// 分页查询打卡
export function punchPage(data) {
  return request({
    url: `/cloud/delivery/punch/page`,
    method: 'post',
    data
  })
}

// 创建-更新打卡
export function punch(data) {
  return request({
    url: `/cloud/delivery/punch`,
    method: 'post',
    data
  })
}
// 删除打卡
export function delPunch(id) {
  return request({
    url: `/cloud/delivery/punch/${id}`,
    method: 'DELETE'
  })
}
// 获取打卡详情
export function getPunchDetail(id) {
  return request({
    url: `/cloud/delivery/punch/${id}`,
    method: 'GET'
  })
}

// 复制打卡下的任务
export function taskCopy(data) {
  return request({
    url: `/cloud/delivery/punch-task/copy`,
    method: 'post',
    data
  })
}
export function getPunchRecordPage(data) {
  return request({
    url: `/cloud/delivery/punch-user-record/page`,
    method: 'POST',
    data
  })
}

export function submitPunchComment(data) {
  return request({
    url: `/cloud/delivery/punch-comment`,
    method: 'POST',
    data
  })
}

export function submitPunchCommentLike(id) {
  return request({
    url: `/cloud/delivery/punch-user-record/like/${id}`,
    method: 'POST'
  })
}

export function submitPunchCommentFeatured(id) {
  return request({
    url: `/cloud/delivery/punch-user-record/featured/${id}`,
    method: 'POST'
  })
}

export function submitPunchCommentTop(id) {
  return request({
    url: `/cloud/delivery/punch-user-record/top/${id}`,
    method: 'POST'
  })
}
export function deletePunchComment(id) {
  return request({
    url: `/cloud/delivery/punch-user-record/${id}`,
    method: 'DELETE'
  })
}

export function getByIdPunchComment(id) {
  return request({
    url: `/cloud/delivery/punch-user-record/${id}`,
    method: 'GET'
  })
}

export function getPunchRecordList(data) {
  return request({
    url: `/cloud/delivery/punch-task/list`,
    method: 'POST',
    data
  })
}
// 分页查询打卡任务
export function taskPage(data) {
  return request({
    url: `/cloud/delivery/punch-task/page`,
    method: 'post',
    data
  })
}

// 删除打卡任务
export function delTask(id) {
  return request({
    url: `/cloud/delivery/punch-task/${id}`,
    method: 'DELETE'
  })
}
// 创建-更新打卡任务
export function addTask(data) {
  return request({
    url: `/cloud/delivery/punch-task`,
    method: 'post',
    data
  })
}

// 获取打卡任务详情
export function getTaskDetail(id) {
  return request({
    url: `/cloud/delivery/punch-task/${id}`,
    method: 'GET'
  })
}
