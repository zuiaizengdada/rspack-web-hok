import request from '@/utils/request2'

// 获取打卡列表
export function getPunchList(data) {
  return request({
    url: '/cloud/delivery/punch/page',
    method: 'post',
    data
  })
}

// 获取打卡任务列表
export function getPunchTaskList(data) {
  return request({
    url: '/cloud/delivery/punch-task/page',
    method: 'post',
    data
  })
}
