import request from '@/utils/request2'

// 新增课程解锁配置
export function addCourseUnlockConfig(data) {
  return request({
    url: '/cloud/delivery/course/unlock',
    method: 'post',
    data
  })
}

// 获取课程解锁配置
export function getCourseUnlockConfig(id) {
  return request({
    url: `/cloud/delivery/course/unlock/get/${id}`,
    method: 'get'
  })
}
